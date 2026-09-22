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
    const ACCOUNTS_PATH = 'accountIds';   // câte un marcaj anonim (uid → true) per cont creat; numărul lor = „Conturi Create"
    const ORDERS_PATH = 'orders';
    const LOGS_PATH = 'logs';   // jurnalul tehnic: oricine poate crea intrări validate, doar administratorul le citește / șterge (firebase-rules.json)
    const KEY_ORDERS_LOCAL = 'fv_orders_local';
    const KEY_COUNTER_LOCAL = 'fv_happy_travelers';
    const KEY_COUNTER_CACHE = 'fv_happy_cache';
    const KEY_ACCOUNTS_CACHE = 'fv_accounts_cache';
    const KEY_CONSENTS_ACCT = 'fv_consents_acct';   // mod local: acceptările documentelor, pe e-mailul contului
    const CONSENT_DOCS = ['terms', 'privacy', 'anpc'];
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

    // acceptările documentelor legale, salvate pe cont: { terms: { v: '2026-09', at: <ms>, off: <ms sau 0> }, ... }
    function cleanConsents(raw) {
        const out = {};
        if (raw && typeof raw === 'object') CONSENT_DOCS.forEach(function (d) {
            const e = raw[d];
            if (e && typeof e === 'object' && typeof e.v === 'string' && Number(e.at) > 0) out[d] = { v: e.v, at: Number(e.at), off: Number(e.off) > 0 ? Number(e.off) : 0 };
        });
        return out;
    }
    function cachedAccounts() { const n = parseInt(kv.get(KEY_ACCOUNTS_CACHE), 10); return Number.isFinite(n) && n > 0 ? n : 0; }
    function cachedCount() { const n = parseInt(kv.get(KEY_COUNTER_CACHE), 10); return Number.isFinite(n) && n > 0 ? n : 0; }

    /* ------------------------------------------------------------------ MOD LOCAL */
    function createLocalBackend() {
        const counterSubs = new Set();
        const authSubs = new Set();
        const accountSubs = new Set();

        function hash(str) { let h = 5381; for (let i = 0; i < str.length; i++) { h = ((h << 5) + h + str.charCodeAt(i)) >>> 0; } return 'h' + h.toString(16); }
        function readCount() { const n = parseInt(kv.get(KEY_COUNTER_LOCAL), 10); return Number.isFinite(n) && n > 0 ? n : 0; }
        function acctConsents(email) { const all = readJSON(KEY_CONSENTS_ACCT, {}); return cleanConsents(all && all[email]); }
        function withConsents(s) { return s ? Object.assign({}, s, { consents: acctConsents(s.email) }) : s; }
        function readSession() { return withConsents(readJSON(KEY_SESSION_LOCAL, null)); }
        function users() { return readJSON(KEY_USERS_LOCAL, []); }
        function publishSession(s) {
            if (s) kv.set(KEY_SESSION_LOCAL, JSON.stringify({ name: s.name, email: s.email, phone: s.phone })); else kv.del(KEY_SESSION_LOCAL);
            const out = withConsents(s);
            authSubs.forEach(function (cb) { cb(out); });
        }
        function writeConsent(doc, mutate) {
            const s = readJSON(KEY_SESSION_LOCAL, null);
            if (!s || CONSENT_DOCS.indexOf(doc) < 0) return Promise.reject(FVError('forbidden'));
            const all = readJSON(KEY_CONSENTS_ACCT, {}) || {};
            const mine = Object.assign({}, all[s.email] || {});
            mutate(mine);
            all[s.email] = mine;
            kv.set(KEY_CONSENTS_ACCT, JSON.stringify(all));
            publishSession(s);
            return Promise.resolve(cleanConsents(mine));
        }

        // Sincronizare între filele aceluiași browser
        window.addEventListener('storage', function (e) {
            if (e.key === KEY_COUNTER_LOCAL) { const n = readCount(); counterSubs.forEach(function (cb) { cb(n); }); }
            if (e.key === KEY_SESSION_LOCAL || e.key === KEY_CONSENTS_ACCT) { const s = readSession(); authSubs.forEach(function (cb) { cb(s); }); }
            if (e.key === KEY_USERS_LOCAL) { const n = users().length; accountSubs.forEach(function (cb) { cb(n); }); }
        });

        return {
            mode: 'local',
            app: null,
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
            onAccounts: function (cb) {
                accountSubs.add(cb);
                Promise.resolve().then(function () { cb(users().length); });
                return function () { accountSubs.delete(cb); };
            },
            onAuth: function (cb) {
                authSubs.add(cb);
                Promise.resolve().then(function () { cb(readSession()); });
                return function () { authSubs.delete(cb); };
            },
            register: function (d) {
                if (!d.phone || !String(d.phone).trim()) return Promise.reject(FVError('invalid-phone'));
                const email = d.email.trim().toLowerCase();
                if (users().some(function (u) { return u.email === email; })) return Promise.reject(FVError('email-in-use'));
                if (d.password.length < 6) return Promise.reject(FVError('weak-password'));
                const list = users();
                list.push({ name: d.name, phone: d.phone || '', email: email, pw: hash(d.password), created: new Date().toISOString() });
                kv.set(KEY_USERS_LOCAL, JSON.stringify(list));
                accountSubs.forEach(function (cb) { cb(list.length); });
                const s = { name: d.name, email: email, phone: d.phone || '', emailVerified: true };
                publishSession(s);
                return Promise.resolve(s);
            },
            login: function (emailRaw, password) {
                const email = emailRaw.trim().toLowerCase();
                const u = users().find(function (x) { return x.email === email; });
                if (!u || u.pw !== hash(password)) return Promise.reject(FVError('invalid-credentials'));
                const s = { name: u.name, email: u.email, phone: u.phone || '', emailVerified: true };
                publishSession(s);
                return Promise.resolve(s);
            },
            logout: function () { publishSession(null); return Promise.resolve(); },
            saveConsent: function (doc, version, at) {
                return writeConsent(doc, function (mine) { mine[doc] = { v: String(version), at: at ? Number(at) : Date.now() }; });
            },
            withdrawConsent: function (doc) {
                return writeConsent(doc, function (mine) { if (mine[doc]) mine[doc] = Object.assign({}, mine[doc], { off: Date.now() }); });
            },
            resetPassword: function () { return Promise.reject(FVError('unsupported')); },
            listUsers: function () { return Promise.reject(FVError('unsupported')); },   // rolul de administrator există doar cu Firebase (regulile bazei de date îl protejează)
            loginWithGoogle: function () { return Promise.reject(FVError('unsupported')); },   // autentificarea cu Google există doar cu Firebase configurat
            resendVerification: function () { return Promise.reject(FVError('unsupported')); },   // fără Firebase nu există un e-mail real de trimis
            refreshVerification: function () { return Promise.resolve(readSession()); },
            submitLogs: function () { return Promise.resolve(0); },   // fără Firebase jurnalul rămâne doar pe dispozitiv
            listLogs: function () { return Promise.reject(FVError('unsupported')); },
            pruneLogs: function () { return Promise.reject(FVError('unsupported')); },
            clearLogs: function () { return Promise.reject(FVError('unsupported')); },
            submitOrder: function (order) {
                // Fără Firebase comanda nu ajunge la tine; o păstrăm doar în browser, pentru testare
                const list = readJSON(KEY_ORDERS_LOCAL, []);
                const key = 'local-' + Date.now();
                list.push(Object.assign({ key: key, status: 'nou', createdAt: Date.now() }, order));
                kv.set(KEY_ORDERS_LOCAL, JSON.stringify(list));
                return Promise.resolve(key);
            }
        };
    }

    /* ------------------------------------------------------------------ MOD OFFLINE (Firebase configurat, dar SDK-ul nu s-a putut încărca) */
    function createOfflineBackend(err) {
        console.error('[FeelVoyage] Nu s-a putut încărca Firebase (internet oprit sau resursa blocată):', err);
        const fail = function () { return Promise.reject(FVError('network', err)); };
        return {
            mode: 'offline',
            app: null,
            onCounter: function (cb) { Promise.resolve().then(function () { cb(cachedCount()); }); return noop; },
            incrementCounter: fail,
            onConnection: function (cb) { cb(false); return noop; },
            onAccounts: function (cb) { Promise.resolve().then(function () { cb(cachedAccounts()); }); return noop; },
            onAuth: function (cb) { Promise.resolve().then(function () { cb(null); }); return noop; },
            register: fail, login: fail, loginWithGoogle: fail, resendVerification: fail, refreshVerification: fail, resetPassword: fail, submitOrder: fail, listUsers: fail, submitLogs: fail, listLogs: fail, pruneLogs: fail, clearLogs: fail, saveConsent: fail, withdrawConsent: fail,
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
        const accountsRef = dbM.ref(db, ACCOUNTS_PATH);

        // Starea conexiunii: nu încercăm să scriem o comandă când nu suntem conectați
        // (Firebase ar ține scrierea în coadă și ar putea-o trimite mai târziu, dublând comanda dacă omul retrimite)
        let connected = false;
        const connWaiters = [];
        dbM.onValue(dbM.ref(db, '.info/connected'), function (snap) {
            connected = snap.val() === true;
            if (connected) connWaiters.splice(0).forEach(function (fn) { fn(); });
        });
        function waitConnected(ms) {
            if (connected) return Promise.resolve(true);
            return new Promise(function (resolve) {
                const timer = setTimeout(function () { resolve(false); }, ms);
                connWaiters.push(function () { clearTimeout(timer); resolve(true); });
            });
        }
        function withTimeout(promise, ms) {
            return new Promise(function (resolve, reject) {
                const timer = setTimeout(function () { reject(FVError('network')); }, ms);
                promise.then(function (v) { clearTimeout(timer); resolve(v); }, function (e) { clearTimeout(timer); reject(e); });
            });
        }

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
                    console.error('[FeelVoyage] Activează „Email/Password" (sau „Google") în Firebase → Authentication → Sign-in method.');
                    return FVError('unknown', e);
                case 'auth/popup-closed-by-user':
                case 'auth/cancelled-popup-request':
                    return FVError('popup-closed', e);   // vizitatorul a închis singur fereastra Google — nu e o eroare de arătat
                case 'auth/popup-blocked':
                    return FVError('popup-blocked', e);
                case 'auth/account-exists-with-different-credential':
                    return FVError('account-exists', e);   // există deja un cont cu parolă, pe același e-mail
                case 'auth/unauthorized-domain':
                    console.error('[FeelVoyage] Domeniul acesta nu e autorizat în Firebase → Authentication → Settings → Authorized domains.');
                    return FVError('unknown', e);
                default:
                    console.error('[FeelVoyage] Eroare Firebase:', e);
                    return FVError('unknown', e);
            }
        }

        // Marcajul public „acest cont există": creat o singură dată per cont (regulile nu permit rescrierea sau marcaje pentru alții).
        // Se încearcă la fiecare autentificare, deci și conturile mai vechi se numără la prima lor conectare, iar un eșec de rețea se repară singur.
        const markerTried = new Set();
        function ensureAccountMarker(uid) {
            if (markerTried.has(uid)) return;
            markerTried.add(uid);
            const r = dbM.ref(db, ACCOUNTS_PATH + '/' + uid);
            dbM.get(r).then(function (s) { if (s.val() === true) return; return dbM.set(r, true); }).catch(function (e) {
                markerTried.delete(uid);
                console.warn('[FeelVoyage] Contul nu a putut fi trecut în contorul „Conturi Create". Ai publicat regulile noi din firebase-rules.json?', e);
            });
        }

        async function buildSession(user) {
            let profile = {}, admin = false;
            ensureAccountMarker(user.uid);
            // Profilul și rolul se citesc separat: dacă unul eșuează (ex. regulile noi nu sunt publicate încă), celălalt rămâne valabil
            const reads = await Promise.all([
                dbM.get(dbM.ref(db, 'users/' + user.uid)).then(function (s) { return s.val() || {}; }, function () { return {}; }),
                dbM.get(dbM.ref(db, 'admins/' + user.uid)).then(function (s) { return s.val() === true; }, function () { return false; })
            ]);
            profile = reads[0]; admin = reads[1];   // administrator = exact „admins/<uid>: true", pus din consola Firebase
            const email = user.email || '';
            // E-mailul nu era salvat în profil la conturile mai vechi; îl completăm la următoarea autentificare (ca administratorul să-l vadă)
            if (email && profile.email !== email) {
                try { dbM.update(dbM.ref(db, 'users/' + user.uid), { email: email }).catch(noop); } catch (e) { /* ignorat */ }
            }
            return {
                uid: user.uid,
                email: email,
                name: profile.name || user.displayName || email.split('@')[0],
                phone: profile.phone || '',
                admin: admin,
                emailVerified: !!user.emailVerified,   // de pe contul Firebase Auth, nu din baza de date; Google vine deja verificat
                consents: cleanConsents(profile.consents)
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

        // după o salvare/retragere, sesiunea curentă primește imediat acceptările actualizate
        function applyConsent(doc, val) {
            const mine = Object.assign({}, session.consents);
            const c = cleanConsents({ [doc]: val });
            if (c[doc]) mine[doc] = c[doc]; else delete mine[doc];
            session = Object.assign({}, session, { consents: mine });
            authSubs.forEach(function (cb) { cb(session); });
            return mine;
        }
        function consentError(e) {
            if (!(e && e.code === 'network')) console.error('[FeelVoyage] Nu pot salva acceptul pe cont. Ai publicat regulile noi din firebase-rules.json?', e);
            return FVError('network', e);
        }

        authM.onAuthStateChanged(auth, function (user) { refresh(user); });

        return {
            mode: 'firebase',
            app: app,   // aplicația Firebase, folosită și de asistentul AI (js/ai.js)

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
            onAccounts: function (cb) {
                return dbM.onValue(accountsRef, function (snap) {
                    const v = snap.val();
                    cb(v && typeof v === 'object' ? Object.keys(v).length : 0);
                }, function (err) {
                    console.error('[FeelVoyage] Nu pot citi numărul de conturi. Ai publicat regulile din firebase-rules.json?', err);
                });
            },

            onAuth: function (cb) {
                authSubs.add(cb);
                if (resolved) Promise.resolve().then(function () { cb(session); });
                return function () { authSubs.delete(cb); };
            },
            register: async function (d) {
                if (!d.phone || !String(d.phone).trim()) throw FVError('invalid-phone');   // telefonul e obligatoriu la conturile noi
                try {
                    const cred = await authM.createUserWithEmailAndPassword(auth, d.email.trim(), d.password);
                    try { await authM.sendEmailVerification(cred.user); } catch (e) { console.warn('[FeelVoyage] E-mailul de verificare nu a putut fi trimis:', e); }
                    try { await authM.updateProfile(cred.user, { displayName: d.name }); } catch (e) { /* nu e critic */ }
                    try {
                        await dbM.set(dbM.ref(db, 'users/' + cred.user.uid), { name: d.name, phone: d.phone || '', email: d.email.trim(), createdAt: dbM.serverTimestamp() });
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
            // Autentificare cu Google (fereastră pop-up): gratuită, activată din Firebase → Authentication → Sign-in method → Google.
            // Prima dată creează contul automat; profilul (users/<uid>) se scrie doar dacă nu există deja, fără să ceară telefonul —
            // formularul de rezervare tot îl cere separat, deci nu blochează nimic (vezi README, secțiunea „Autentificare cu Google”).
            loginWithGoogle: async function () {
                try {
                    const provider = new authM.GoogleAuthProvider();
                    const cred = await authM.signInWithPopup(auth, provider);
                    const user = cred.user;
                    try {
                        const snap = await dbM.get(dbM.ref(db, 'users/' + user.uid));
                        if (!snap.val()) {
                            await dbM.set(dbM.ref(db, 'users/' + user.uid), { name: user.displayName || (user.email || '').split('@')[0], email: user.email || '', createdAt: dbM.serverTimestamp() });
                        }
                    } catch (e) { console.warn('[FeelVoyage] Profilul Google nu a putut fi salvat (verifică regulile din firebase-rules.json):', e); }
                    return await refresh(auth.currentUser || user);
                } catch (e) { throw normalize(e); }
            },
            // E-mailul de verificare: „Retrimite” (resendVerification) și „Am verificat, actualizează” (refreshVerification, recitește starea de pe Firebase)
            resendVerification: async function () {
                const u = auth.currentUser;
                if (!u) throw FVError('not-signed-in');
                if (u.emailVerified) return true;
                try { await authM.sendEmailVerification(u); return true; } catch (e) { throw normalize(e); }
            },
            refreshVerification: async function () {
                const u = auth.currentUser;
                if (!u) throw FVError('not-signed-in');
                try { await authM.reload(u); } catch (e) { /* dacă reload eșuează, tot citim starea curentă mai jos */ }
                return await refresh(auth.currentUser || u);
            },
            logout: async function () {
                await authM.signOut(auth);
                await refresh(null);
            },
            // Acceptul documentelor legale, pe cont: users/<uid>/consents/<doc> = { v: versiunea, at: ora serverului, off: ora retragerii }
            saveConsent: async function (doc, version, at) {
                if (!auth.currentUser || !session || CONSENT_DOCS.indexOf(doc) < 0) throw FVError('forbidden');
                const r = dbM.ref(db, 'users/' + auth.currentUser.uid + '/consents/' + doc);
                try {
                    if (!(await waitConnected(6000))) throw FVError('network');
                    await withTimeout(dbM.set(r, { v: String(version), at: at ? Number(at) : dbM.serverTimestamp() }), 15000);
                    return applyConsent(doc, (await dbM.get(r)).val());
                } catch (e) { throw consentError(e); }
            },
            withdrawConsent: async function (doc) {
                if (!auth.currentUser || !session || CONSENT_DOCS.indexOf(doc) < 0) throw FVError('forbidden');
                const r = dbM.ref(db, 'users/' + auth.currentUser.uid + '/consents/' + doc);
                try {
                    if (!(await waitConnected(6000))) throw FVError('network');
                    await withTimeout(dbM.update(r, { off: dbM.serverTimestamp() }), 15000);
                    return applyConsent(doc, (await dbM.get(r)).val());
                } catch (e) { throw consentError(e); }
            },
            submitOrder: async function (order) {
                const payload = Object.assign({}, order, { status: 'nou', createdAt: dbM.serverTimestamp() });
                if (auth.currentUser) payload.uid = auth.currentUser.uid;   // dacă e logat, comanda se leagă de contul lui
                try {
                    if (!(await waitConnected(6000))) throw FVError('network');
                    const newRef = dbM.push(dbM.ref(db, ORDERS_PATH));
                    await withTimeout(dbM.set(newRef, payload), 15000);
                    return newRef.key;
                } catch (e) {
                    if (!(e && e.code === 'network')) {
                        console.error('[FeelVoyage] Nu pot salva comanda. Ai publicat regulile noi din firebase-rules.json?', e);
                    }
                    throw FVError('network', e);
                }
            },
            // Lista utilizatorilor: doar pentru administrator. Protecția reală e în regulile bazei de date (firebase-rules.json):
            // un cont obișnuit primește PERMISSION_DENIED chiar dacă ar apela această funcție.
            listUsers: async function () {
                if (!session || !session.admin) throw FVError('forbidden');
                try {
                    const res = await Promise.all([dbM.get(dbM.ref(db, 'users')), dbM.get(dbM.ref(db, 'admins'))]);
                    const users = res[0].val() || {}, admins = res[1].val() || {};
                    return Object.keys(users).map(function (uid) {
                        const u = users[uid] || {};
                        return { uid: uid, name: String(u.name || ''), email: String(u.email || ''), phone: String(u.phone || ''), createdAt: Number(u.createdAt) || 0, admin: admins[uid] === true, consents: cleanConsents(u.consents) };
                    }).sort(function (a, b) { return (b.createdAt - a.createdAt) || a.name.localeCompare(b.name); });
                } catch (e) {
                    if (e && /permission/i.test(String(e.code || e.message))) throw FVError('forbidden', e);
                    throw FVError('network', e);
                }
            },
            // Jurnal tehnic (js/logremote.js): fiecare intrare e un nod nou sub logs/, validat de reguli (câmpuri și lungimi fixe). Fără date personale în ele.
            submitLogs: async function (entries) {
                const list = (entries || []).slice(0, 40);
                if (!list.length) return 0;
                const base = dbM.ref(db, LOGS_PATH);
                const updates = {};
                list.forEach(function (en) { updates[dbM.push(base).key] = Object.assign({}, en, { at: dbM.serverTimestamp() }); });
                await withTimeout(dbM.update(base, updates), 15000);
                return list.length;
            },
            // Citirea, curățarea și ștergerea jurnalului: doar administratorul (protecția reală e în regulile bazei de date: un cont obișnuit primește PERMISSION_DENIED)
            listLogs: async function (limit) {
                if (!session || !session.admin) throw FVError('forbidden');
                try {
                    const q = dbM.query(dbM.ref(db, LOGS_PATH), dbM.orderByKey(), dbM.limitToLast(Math.max(1, Math.min(Number(limit) || 300, 1000))));
                    const v = (await dbM.get(q)).val() || {};
                    return Object.keys(v).map(function (id) { return Object.assign({ id: id }, v[id]); }).sort(function (a, b) { return (a.at || a.ts || 0) - (b.at || b.ts || 0); });
                } catch (e) {
                    if (e && /permission/i.test(String(e.code || e.message))) throw FVError('forbidden', e);
                    throw FVError('network', e);
                }
            },
            pruneLogs: async function (days) {
                if (!session || !session.admin) throw FVError('forbidden');
                const cutoff = Date.now() - Math.max(1, Number(days) || 30) * 86400000;
                try {
                    const q = dbM.query(dbM.ref(db, LOGS_PATH), dbM.orderByChild('at'), dbM.endAt(cutoff), dbM.limitToFirst(500));
                    const ids = Object.keys((await dbM.get(q)).val() || {});
                    if (ids.length) { const rm = {}; ids.forEach(function (k) { rm[k] = null; }); await withTimeout(dbM.update(dbM.ref(db, LOGS_PATH), rm), 15000); }
                    return ids.length;
                } catch (e) {
                    if (e && /permission/i.test(String(e.code || e.message))) throw FVError('forbidden', e);
                    throw FVError('network', e);
                }
            },
            clearLogs: async function () {
                if (!session || !session.admin) throw FVError('forbidden');
                try { await withTimeout(dbM.remove(dbM.ref(db, LOGS_PATH)), 15000); }
                catch (e) {
                    if (e && /permission/i.test(String(e.code || e.message))) throw FVError('forbidden', e);
                    throw FVError('network', e);
                }
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
        onAccounts: function (cb) {
            return whenReady('onAccounts')(function (v) { kv.set(KEY_ACCOUNTS_CACHE, String(v)); cb(v); });
        },
        cachedAccounts: cachedAccounts,

        onAuth: whenReady('onAuth'),
        register: function (d) { return ready.then(function (b) { return b.register(d); }); },
        login: function (e, p) { return ready.then(function (b) { return b.login(e, p); }); },
        loginWithGoogle: function () { return ready.then(function (b) { return b.loginWithGoogle(); }); },
        resendVerification: function () { return ready.then(function (b) { return b.resendVerification(); }); },
        refreshVerification: function () { return ready.then(function (b) { return b.refreshVerification(); }); },
        logout: function () { return ready.then(function (b) { return b.logout(); }); },
        saveConsent: function (doc, v, at) { return ready.then(function (b) { return b.saveConsent(doc, v, at); }); },
        withdrawConsent: function (doc) { return ready.then(function (b) { return b.withdrawConsent(doc); }); },
        resetPassword: function (e) { return ready.then(function (b) { return b.resetPassword(e); }); },
        submitOrder: function (o) { return ready.then(function (b) { return b.submitOrder(o); }); },
        listUsers: function () { return ready.then(function (b) { return b.listUsers(); }); },
        submitLogs: function (entries) { return ready.then(function (b) { return b.submitLogs(entries); }); },
        listLogs: function (limit) { return ready.then(function (b) { return b.listLogs(limit); }); },
        pruneLogs: function (days) { return ready.then(function (b) { return b.pruneLogs(days); }); },
        clearLogs: function () { return ready.then(function (b) { return b.clearLogs(); }); },

        // Pentru asistentul AI (js/ai.js): aplicația Firebase (null dacă nu e configurat) și încărcarea modulelor SDK la cerere
        firebaseApp: function () { return ready.then(function (b) { return b.app || null; }); },
        importSDK: function (name) { return import(SDK_BASE + 'firebase-' + name + '.js'); },

        // Ultima sesiune cunoscută, ca antetul să nu „clipească" între „Contul meu" și numele utilizatorului
        sessionHint: function () { return configured ? readJSON(KEY_SESSION_HINT, null) : null; }
    };

    /* Jurnal (js/logger.js): rezultatul operațiilor importante, FĂRĂ date personale — doar numele operației, durata și codul erorii */
    (function instrument() {
        const L = window.FVLog;
        if (!L) return;
        ready.then(function (b) { L.info('backend', 'ready', { mode: b && b.mode }); }, function (e) { L.error('backend', 'init-failed', { code: e && e.code }); });
        let lastUid = '';   // identificatorul contului (nu e e-mail): administratorul îl leagă de e-mail în fereastra „Jurnal” (vezi js/logviewer.js)
        try { window.FVBackend.onAuth(function (s) { if (s && s.uid) lastUid = s.uid; }); } catch (e) { /* ignorat */ }
        ['register', 'login', 'loginWithGoogle', 'logout', 'saveConsent', 'withdrawConsent', 'resetPassword', 'resendVerification', 'listUsers', 'listLogs', 'pruneLogs', 'clearLogs'].forEach(function (m) {
            const orig = window.FVBackend[m];
            if (typeof orig !== 'function') return;
            window.FVBackend[m] = function () {
                const done = L.time('backend', m, 2500);
                const doc = (m === 'saveConsent' || m === 'withdrawConsent') ? String(arguments[0] || '').slice(0, 20) : undefined;
                const before = lastUid;
                return Promise.resolve(orig.apply(window.FVBackend, arguments)).then(function (r) {
                    const acct = (m === 'register' || m === 'login' || m === 'loginWithGoogle') ? (r && r.uid) : (m === 'logout' ? before : undefined);
                    if (acct) lastUid = m === 'logout' ? '' : acct;
                    done({ ok: true, doc: doc, acct: acct || undefined });
                    return r;
                }, function (err) {
                    done({ ok: false, doc: doc, code: (err && err.code) || 'necunoscut' });
                    L.warn('backend', m + '.fail', { code: (err && err.code) || 'necunoscut' });
                    throw err;
                });
            };
        });
    })();
})();
