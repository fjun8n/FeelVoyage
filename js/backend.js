/* FeelVoyage — backend: contorul „Călători Fericiți" comun tuturor vizitatorilor + conturile de utilizator.

   Două moduri (se alege automat):
   • "firebase" — dacă js/firebase-config.js are cheile tale. Datele stau în cloud (Realtime Database + Authentication),
                   deci contorul se actualizează live la toți vizitatorii, iar contul funcționează pe orice dispozitiv.
   • "local"    — dacă Firebase nu e configurat. Totul rămâne doar în browserul curent (bun pentru testare).

   Restul site-ului folosește doar obiectul global FVBackend, definit la finalul acestui fișier. */
(function () {
    'use strict';

    const SDK_BASE = 'https://www.gstatic.com/firebasejs/12.19.0/';
    const COUNTER_PATH = 'happyTravelers';
    const KEY_COUNTER_LOCAL = 'fv_happy_travelers';
    const KEY_COUNTER_CACHE = 'fv_happy_cache';
    const KEY_SESSION_LOCAL = 'fv_session';
    const KEY_USERS_LOCAL = 'fv_users';
    const KEY_SESSION_HINT = 'fv_session_hint';

    // fvStore (din app.js) are rezervă în memorie dacă localStorage e blocat
    const kv = (typeof fvStore !== 'undefined') ? fvStore : {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorat */ } },
        del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* ignorat */ } }
    };
    const noop = function () { };
    const readJSON = function (k, fallback) { try { const v = JSON.parse(kv.get(k)); return v === null || v === undefined ? fallback : v; } catch (e) { return fallback; } };

    function FVError(code, original) { const e = new Error(code); e.code = code; e.original = original; return e; }

    const cfg = window.FV_FIREBASE_CONFIG || {};
    const configured = ['apiKey', 'authDomain', 'databaseURL', 'projectId', 'appId'].every(function (k) {
        return typeof cfg[k] === 'string' && cfg[k].trim() !== '' && !/^PASTE/i.test(cfg[k].trim());
    });

    function cachedCount() { const n = parseInt(kv.get(KEY_COUNTER_CACHE), 10); return Number.isFinite(n) && n > 0 ? n : 0; }

    /* ------------------------------------------------------------------ MOD LOCAL */
    function createLocalBackend() {
        const counterSubs = new Set();
        const authSubs = new Set();

        function hash(str) { let h = 5381; for (let i = 0; i < str.length; i++) { h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; } return 'h' + h.toString(16); }
        function readCount() { const n = parseInt(kv.get(KEY_COUNTER_LOCAL), 10); return Number.isFinite(n) && n > 0 ? n : 0; }
        function readSession() { return readJSON(KEY_SESSION_LOCAL, null); }
        function users() { return readJSON(KEY_USERS_LOCAL, []); }
        function publishSession(s) {
            if (s) kv.set(KEY_SESSION_LOCAL, JSON.stringify(s)); else kv.del(KEY_SESSION_LOCAL);
            authSubs.forEach(function (cb) { cb(s); });
        }

        // Sincronizare între filele aceluiași browser
        window.addEventListener('storage', function (e) {
            if (e.key === KEY_COUNTER_LOCAL) { const n = readCount(); counterSubs.forEach(function (cb) { cb(n); }); }
            if (e.key === KEY_SESSION_LOCAL) { const s = readSession(); authSubs.forEach(function (cb) { cb(s); }); }
        });

        return {
            mode: 'local',
            onCounter: function (cb) {
                counterSubs.add(cb);
                Promise.resolve().then(function () { cb(readCount()); });
                return function () { counterSubs.delete(cb); };
            },
            incrementCounter: function () {
                const n = readCount() + 1;
                kv.set(KEY_COUNTER_LOCAL, String(n));
                counterSubs.forEach(function (cb) { cb(n); });
                return Promise.resolve(n);
            },
            onConnection: function (cb) { cb(false); return noop; },
            onAuth: function (cb) {
                authSubs.add(cb);
                Promise.resolve().then(function () { cb(readSession()); });
                return function () { authSubs.delete(cb); };
            },
            register: function (d) {
                const email = d.email.trim().toLowerCase();
                if (users().some(function (u) { return u.email === email; })) return Promise.reject(FVError('email-in-use'));
                if (d.password.length < 6) return Promise.reject(FVError('weak-password'));
                const list = users();
                list.push({ name: d.name, phone: d.phone || '', email: email, pw: hash(d.password), created: new Date().toISOString() });
                kv.set(KEY_USERS_LOCAL, JSON.stringify(list));
                const s = { name: d.name, email: email, phone: d.phone || '' };
                publishSession(s);
                return Promise.resolve(s);
            },
            login: function (emailRaw, password) {
                const email = emailRaw.trim().toLowerCase();
                const u = users().find(function (x) { return x.email === email; });
                if (!u || u.pw !== hash(password)) return Promise.reject(FVError('invalid-credentials'));
                const s = { name: u.name, email: u.email, phone: u.phone || '' };
                publishSession(s);
                return Promise.resolve(s);
            },
            logout: function () { publishSession(null); return Promise.resolve(); },
            resetPassword: function () { return Promise.reject(FVError('unsupported')); }
        };
    }

    /* ------------------------------------------------------------------ MOD OFFLINE (Firebase configurat, dar SDK-ul nu s-a putut încărca) */
    function createOfflineBackend(err) {
        console.error('[FeelVoyage] Nu s-a putut încărca Firebase (internet oprit sau resursa blocată):', err);
        const fail = function () { return Promise.reject(FVError('network', err)); };
        return {
            mode: 'offline',
            onCounter: function (cb) { Promise.resolve().then(function () { cb(cachedCount()); }); return noop; },
            incrementCounter: fail,
            onConnection: function (cb) { cb(false); return noop; },
            onAuth: function (cb) { Promise.resolve().then(function () { cb(null); }); return noop; },
            register: fail, login: fail, resetPassword: fail,
            logout: function () { return Promise.resolve(); }
        };
    }

    /* ------------------------------------------------------------------ MOD FIREBASE */
    async function createFirebaseBackend() {
        const mods = await Promise.all([
            import(SDK_BASE + 'firebase-app.js'),
            import(SDK_BASE + 'firebase-auth.js'),
            import(SDK_BASE + 'firebase-database.js')
        ]);
        const appM = mods[0], authM = mods[1], dbM = mods[2];

        const app = appM.initializeApp(cfg);
        const auth = authM.getAuth(app);
        const db = dbM.getDatabase(app);
        const counterRef = dbM.ref(db, COUNTER_PATH);

        const authSubs = new Set();
        let session = null;
        let resolved = false;   // true după ce Firebase a spus prima dată dacă utilizatorul e logat
        let seq = 0;            // ignoră răspunsurile vechi dacă două actualizări se suprapun

        function normalize(e) {
            const code = (e && e.code) || '';
            switch (code) {
                case 'auth/email-already-in-use': return FVError('email-in-use', e);
                case 'auth/invalid-credential':
                case 'auth/invalid-login-credentials':
                case 'auth/wrong-password':
                case 'auth/user-not-found': return FVError('invalid-credentials', e);
                case 'auth/weak-password': return FVError('weak-password', e);
                case 'auth/invalid-email': return FVError('invalid-email', e);
                case 'auth/network-request-failed': return FVError('network', e);
                case 'auth/too-many-requests': return FVError('too-many', e);
                case 'auth/operation-not-allowed':
                    console.error('[FeelVoyage] Activează „Email/Password" în Firebase → Authentication → Sign-in method.');
                    return FVError('unknown', e);
                default:
                    console.error('[FeelVoyage] Eroare Firebase:', e);
                    return FVError('unknown', e);
            }
        }

        async function buildSession(user) {
            let profile = {};
            try { profile = (await dbM.get(dbM.ref(db, 'users/' + user.uid))).val() || {}; } catch (e) { /* profilul e opțional */ }
            const email = user.email || '';
            return {
                uid: user.uid,
                email: email,
                name: profile.name || user.displayName || email.split('@')[0],
                phone: profile.phone || ''
            };
        }

        async function refresh(user) {
            const mine = ++seq;
            const s = user ? await buildSession(user) : null;
            if (mine !== seq) return s;
            session = s;
            resolved = true;
            if (s) kv.set(KEY_SESSION_HINT, JSON.stringify({ name: s.name, email: s.email, phone: s.phone })); else kv.del(KEY_SESSION_HINT);
            authSubs.forEach(function (cb) { cb(session); });
            return s;
        }

        authM.onAuthStateChanged(auth, function (user) { refresh(user); });

        return {
            mode: 'firebase',

            onCounter: function (cb) {
                return dbM.onValue(counterRef, function (snap) {
                    const v = Number(snap.val());
                    cb(Number.isFinite(v) && v > 0 ? v : 0);
                }, function (err) {
                    console.error('[FeelVoyage] Nu pot citi contorul. Ai publicat regulile din firebase-rules.json?', err);
                });
            },
            incrementCounter: function () {
                return dbM.runTransaction(counterRef, function (current) {
                    return (typeof current === 'number' && current >= 0 ? current : 0) + 1;
                }).then(function (res) {
                    if (!res.committed) throw FVError('unknown');
                    return res.snapshot.val();
                }).catch(function (e) {
                    if (e && e.code === 'unknown') throw e;
                    console.error('[FeelVoyage] Nu pot salva contorul. Ai publicat regulile din firebase-rules.json?', e);
                    throw FVError('network', e);
                });
            },
            onConnection: function (cb) {
                return dbM.onValue(dbM.ref(db, '.info/connected'), function (snap) { cb(snap.val() === true); });
            },

            onAuth: function (cb) {
                authSubs.add(cb);
                if (resolved) Promise.resolve().then(function () { cb(session); });
                return function () { authSubs.delete(cb); };
            },
            register: async function (d) {
                try {
                    const cred = await authM.createUserWithEmailAndPassword(auth, d.email.trim(), d.password);
                    try { await authM.updateProfile(cred.user, { displayName: d.name }); } catch (e) { /* nu e critic */ }
                    try {
                        await dbM.set(dbM.ref(db, 'users/' + cred.user.uid), { name: d.name, phone: d.phone || '', createdAt: dbM.serverTimestamp() });
                    } catch (e) { console.warn('[FeelVoyage] Profilul nu a putut fi salvat (verifică regulile din firebase-rules.json):', e); }
                    return await refresh(auth.currentUser || cred.user);
                } catch (e) { throw normalize(e); }
            },
            login: async function (email, password) {
                try {
                    const cred = await authM.signInWithEmailAndPassword(auth, email.trim(), password);
                    return await refresh(cred.user);
                } catch (e) { throw normalize(e); }
            },
            logout: async function () {
                await authM.signOut(auth);
                await refresh(null);
            },
            resetPassword: async function (email) {
                try { await authM.sendPasswordResetEmail(auth, email.trim()); }
                catch (e) {
                    const n = normalize(e);
                    if (n.code === 'invalid-credentials') return;   // nu dezvăluim dacă există contul
                    throw n;
                }
            }
        };
    }

    /* ------------------------------------------------------------------ FAȚADA PUBLICĂ */
    let impl = null;
    const ready = (configured ? createFirebaseBackend().catch(createOfflineBackend) : Promise.resolve(createLocalBackend()))
        .then(function (b) { impl = b; return b; });

    function whenReady(method) {
        // abonările făcute înainte ca backend-ul să fie gata sunt amânate automat
        return function (cb) {
            let unsub = noop, cancelled = false;
            ready.then(function (b) { if (!cancelled) unsub = b[method](cb); });
            return function () { cancelled = true; unsub(); };
        };
    }

    window.FVBackend = {
        get mode() { return impl ? impl.mode : (configured ? 'firebase' : 'local'); },
        ready: ready,

        onCounter: function (cb) {
            return whenReady('onCounter')(function (v) { kv.set(KEY_COUNTER_CACHE, String(v)); cb(v); });
        },
        incrementCounter: function () { return ready.then(function (b) { return b.incrementCounter(); }); },
        onConnection: whenReady('onConnection'),
        cachedCount: cachedCount,

        onAuth: whenReady('onAuth'),
        register: function (d) { return ready.then(function (b) { return b.register(d); }); },
        login: function (e, p) { return ready.then(function (b) { return b.login(e, p); }); },
        logout: function () { return ready.then(function (b) { return b.logout(); }); },
        resetPassword: function (e) { return ready.then(function (b) { return b.resetPassword(e); }); },

        // Ultima sesiune cunoscută, ca antetul să nu „clipească" între „Contul meu" și numele utilizatorului
        sessionHint: function () { return configured ? readJSON(KEY_SESSION_HINT, null) : null; }
    };
})();
