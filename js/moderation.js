/* FeelVoyage — filtrul de conținut indecent (text în orice limbă + poze). Fișier identic pe ambele site-uri.

   Unde se folosește: recenzii (text + poze), chatul cu asistentul, „Raportează un bug”, mesajul din formularul
   de contact / rezervare, poza de profil și numele contului. Pe site-ul de recenzii: aceeași verificare, plus
   la afișare (vezi js/app-reviews.js), ca o recenzie veche din baza de date să nu apară dacă trece pragul.

   ─── CE POATE ȘI CE NU POATE ───────────────────────────────────────────────────────────────────────
   Verificarea rulează ÎN BROWSER. Pentru folosirea normală a site-ului e o barieră reală: nimeni nu poate
   trimite din interfață un text obscen sau o poză indecentă. DAR nu e o barieră de securitate: cine se
   pricepe poate ocoli orice cod din browser (din consolă, cu scripturi proprii). Site-ul e găzduit static
   (GitHub Pages + Firebase), fără server propriu, iar regulile Firebase pot verifica doar forma datelor
   (tip, lungime, prefixul data:image/...), nu înțelesul unui text sau conținutul unei poze. O barieră de
   neocolit ar cere o funcție pe server (Firebase Cloud Functions, plan plătit), care să verifice înainte
   de scriere. Până atunci: filtrul de aici + verificarea ta ca administrator (fereastra „Jurnal” și
   posibilitatea de a șterge orice recenzie) sunt cele două niveluri reale.

   ─── TEXT ──────────────────────────────────────────────────────────────────────────────────────────
   Lista de cuvinte acoperă cele 5 limbi ale site-ului (română, engleză, italiană, franceză, spaniolă) plus
   cele mai răspândite insulte internaționale. Nu poate fi exhaustivă pentru „orice limbă” — nicio listă nu
   poate — dar normalizarea de mai jos prinde și variantele deghizate: diacritice, litere repetate
   („puuulaaa”), cifre în loc de litere („p0rn”, „fvck”, „5hit”) și litere despărțite cu semne („p.u.l.a”).
   Potrivirea se face pe CUVINTE ÎNTREGI, nu pe bucăți, ca să nu respingem texte curate: altfel „curs”,
   „curte” sau „Constanța” ar fi blocate degeaba. Doar câteva rădăcini fără echivoc se caută și în interiorul
   cuvintelor (vezi SUBSTRING_BAD).

   ─── POZE ──────────────────────────────────────────────────────────────────────────────────────────
   Pozele se verifică cu modelul Gemini (prin Firebase AI Logic, deja configurat în js/firebase-config.js —
   fără cheie nouă): modelul se uită la poză și spune dacă are nuditate / conținut sexual, violență grafică
   sau SCRIS indecent în imagine (exact cazul „poze cu scrisuri indecente”). Dacă verificarea NU poate rula
   (fără internet, AI neconfigurat, limită depășită), poza NU se trimite și omul primește un mesaj că poate
   reîncerca. Am ales intenționat varianta asta: o poză indecentă publicată e mult mai costisitoare decât o
   încărcare amânată un minut. */
(function (root) {
    'use strict';

    /* ------------------------------------------------------------------ lista de cuvinte */
    // Obscenități, insulte și apelative jignitoare. Cuvinte întregi (vezi explicația de mai sus).
    var BAD_WORDS = [
        // română
        'pula', 'pizda', 'pizdă', 'muie', 'cacat', 'căcat', 'cur', 'curva', 'curvă', 'prost', 'proasta', 'proastă',
        'idiot', 'idioata', 'idioată', 'tampit', 'tâmpit', 'tampita', 'tâmpită', 'jegos', 'nesimtit', 'nesimțit',
        'handicapat', 'retardat', 'mongol', 'gunoi', 'dobitoc', 'vaca', 'vacă', 'tarfa', 'târfă', 'jigodie',
        'nemernic', 'ticalos', 'ticălos', 'cretin', 'cretina', 'cretină', 'magar', 'măgar', 'spurcat', 'scarba', 'scârbă', 'imbecil',
        'fut', 'futu', 'futai', 'sugi', 'coaie', 'bou', 'boule', 'labagiu', 'poponar', 'bulangiu', 'pervers',
        // engleză
        'fuck', 'fucking', 'fucker', 'shit', 'bitch', 'cunt', 'asshole', 'bastard', 'dick', 'pussy', 'whore', 'slut', 'faggot',
        'nigger', 'nigga', 'retard', 'cock', 'twat', 'wanker', 'motherfucker', 'bollocks', 'douchebag', 'dumbass',
        'moron', 'scumbag', 'jackass', 'prick', 'porn', 'porno', 'nude', 'nudes', 'boobs', 'tits', 'horny', 'rape', 'rapist',
        // italiană
        'cazzo', 'merda', 'stronzo', 'stronza', 'puttana', 'troia', 'vaffanculo', 'coglione', 'bastardo', 'cretino',
        'deficiente', 'minchia', 'culo', 'figa', 'zoccola', 'frocio', 'porca',
        // franceză
        'merde', 'putain', 'salope', 'connard', 'connasse', 'pute', 'encule', 'enculee', 'batard', 'bâtard',
        'con', 'conne', 'abruti', 'abrutie', 'ordure', 'salaud', 'bordel', 'couille', 'pedale', 'pédale', 'nique',
        // spaniolă
        'mierda', 'puta', 'puto', 'gilipollas', 'cabron', 'cabrón', 'pendejo', 'imbécil', 'maricon', 'maricón',
        'coño', 'joder', 'zorra', 'pendeja', 'chinga', 'chingar', 'verga', 'culero', 'polla',
        // alte limbi răspândite (germană, rusă transliterat, turcă, maghiară, arabă transliterat)
        'scheisse', 'scheiße', 'arschloch', 'hurensohn', 'fotze', 'wichser',
        'blyat', 'blyad', 'suka', 'pizdec', 'yebat', 'mudak', 'khuy', 'huy',
        'orospu', 'amk', 'sikerim', 'gavat',
        'kurva', 'kurwa', 'faszom', 'picsa',
        'sharmuta', 'kahba'
    ];

    // Rădăcini fără echivoc, căutate și în interiorul cuvintelor (lipite, cu sau fără separatoare).
    // Lista e INTENȚIONAT mică: orice adaos aici crește riscul de a respinge un text curat.
    var SUBSTRING_BAD = [
        'fuck', 'motherfuck', 'nigger', 'nigga', 'porno', 'pornhub', 'faggot', 'vaffanculo', 'gilipollas',
        'hurensohn', 'arschloch', 'orospu', 'blyat'
    ];

    /* ------------------------------------------------------------------ normalizare */
    // cifre / semne folosite în locul literelor (deghizare de tip „l33t”)
    var LEET = { '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's', '7': 't', '8': 'b', '9': 'g', '@': 'a', '$': 's', '!': 'i', '+': 't', '|': 'i' };

    // mic -> fără diacritice -> cifre înlocuite cu litere -> litere repetate reduse la una
    function normalize(s) {
        s = String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        s = s.replace(/[0134578 9@$!+|]/g, function (c) { return LEET[c] !== undefined ? LEET[c] : c; });
        return s.replace(/(.)\1+/g, '$1');
    }
    // „p.u.l.a” / „f-u-c-k” / „p u l a”: litere singure despărțite de semne -> lipite.
    // Se aplică doar când există cel puțin 3 astfel de salturi la rând, ca să nu strivim text normal.
    function undisguise(s) {
        return s.replace(/\b(?:[a-z][^a-z0-9]{1,2}){3,}[a-z]\b/g, function (m) { return m.replace(/[^a-z]/g, ''); });
    }

    var BAD_NORM = {};
    BAD_WORDS.forEach(function (w) { BAD_NORM[normalize(w)] = true; });
    var SUB_NORM = SUBSTRING_BAD.map(normalize);

    /* ------------------------------------------------------------------ verificarea textului */
    // Întoarce { ok: true } sau { ok: false, reason: 'word', word: '<cuvântul găsit, normalizat>' }
    function checkText(text) {
        var raw = String(text == null ? '' : text);
        if (!raw.trim()) return { ok: true };
        var norm = normalize(raw);
        var glued = undisguise(norm);

        // 1) cuvinte întregi (în textul normalizat și în varianta „lipită”)
        var words = (norm + ' ' + glued).split(/[^a-z]+/);
        for (var i = 0; i < words.length; i++) {
            if (words[i] && BAD_NORM[words[i]]) return { ok: false, reason: 'word', word: words[i] };
        }
        // 2) rădăcinile fără echivoc, oriunde în text.
        // Se caută și într-o variantă cu literele schimbate des folosite ca deghizare (v→u, z→s, x→ks):
        // „fvck”, „azzhole”. Substituția asta se aplică DOAR rădăcinilor fără echivoc, nu listei mari —
        // altfel ar strica cuvinte curate (ex. „vacanță” → „uacanță”) și ar da respingeri nedrepte.
        var flat = glued.replace(/[^a-z]+/g, '');
        var flatAlt = flat.replace(/v/g, 'u').replace(/z/g, 's');
        for (var j = 0; j < SUB_NORM.length; j++) {
            if (flat.indexOf(SUB_NORM[j]) !== -1 || flatAlt.indexOf(SUB_NORM[j]) !== -1) return { ok: false, reason: 'word', word: SUB_NORM[j] };
        }
        return { ok: true };
    }

    // Numele de cont: aceeași listă, dar doar pe cuvinte întregi (un nume e scurt, riscul de fals pozitiv e mai mare)
    function checkName(name) {
        var words = normalize(name).split(/[^a-z]+/).filter(Boolean);
        for (var i = 0; i < words.length; i++) if (BAD_NORM[words[i]]) return { ok: false, reason: 'word', word: words[i] };
        return { ok: true };
    }

    /* ------------------------------------------------------------------ verificarea pozelor (Gemini) */
    var AI_PROMPT = [
        'Ești un filtru de conținut pentru un site de turism. Uită-te la imagine și răspunde DOAR cu un cuvânt, fără explicații:',
        '• "BLOCK" dacă imaginea conține: nuditate totală sau parțială, conținut sexual sau sugestiv, lenjerie intimă ca subiect principal,',
        '  violență grafică sau sânge, droguri, simboluri extremiste / de ură, SAU TEXT SCRIS în imagine care e obscen, insultător sau vulgar',
        '  (în orice limbă, inclusiv deghizat sau scris cu cifre în loc de litere).',
        '• "OK" dacă imaginea e potrivită pentru un site public de turism (peisaje, orașe, hoteluri, mâncare, oameni îmbrăcați normal, documente, capturi de ecran curate).',
        'Dacă ești nesigur, răspunde "BLOCK". Răspunde cu exact un cuvânt: OK sau BLOCK.'
    ].join('\n');

    var ai = { ready: null, model: null, mod: null, appCheckDone: false, broken: false };

    function backend() { return root.FVBackend || root.FVReviewsBackend || null; }
    function aiCfg() { return root.FV_AI_CONFIG || {}; }
    function hasKey(k) { return typeof k === 'string' && k.trim() !== '' && !/^PASTE/i.test(k.trim()); }

    // Poate rula verificarea pozelor? (Firebase configurat + AI activat)
    function imageChecksEnabled() {
        var b = backend();
        return !!(b && b.mode === 'firebase' && b.importSDK && aiCfg().enabled !== false && !ai.broken);
    }

    function initAI() {
        if (ai.ready) return ai.ready;
        var c = aiCfg();
        ai.ready = (async function () {
            var b = backend();
            if (!b || !b.firebaseApp) throw new Error('no-firebase');
            var app = await b.firebaseApp();
            if (!app) throw new Error('no-firebase');
            if (hasKey(c.appCheckSiteKey) && !ai.appCheckDone) {
                try {
                    var ac = await b.importSDK('app-check');
                    if (c.appCheckDebug) root.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
                    var legacy = String(c.appCheckProvider || '').toLowerCase() === 'v3';
                    var provider = legacy ? new ac.ReCaptchaV3Provider(c.appCheckSiteKey) : new ac.ReCaptchaEnterpriseProvider(c.appCheckSiteKey);
                    ac.initializeAppCheck(app, { provider: provider, isTokenAutoRefreshEnabled: true });
                    ai.appCheckDone = true;
                } catch (e) { /* App Check poate fi deja pornit de js/ai.js — nu e o eroare */ ai.appCheckDone = true; }
            }
            ai.mod = await b.importSDK('ai');
            var inst = ai.mod.getAI(app, { backend: new ai.mod.GoogleAIBackend() });
            ai.model = ai.mod.getGenerativeModel(inst, {
                model: c.model || 'gemini-3.5-flash-lite',
                systemInstruction: AI_PROMPT,
                generationConfig: { maxOutputTokens: 8, temperature: 0 }
            }, { timeout: 20000 });
        })();
        ai.ready.catch(function () { ai.ready = null; });
        return ai.ready;
    }

    function dataUrlParts(dataUrl) {
        var m = /^data:([^;,]+)(?:;base64)?,(.*)$/i.exec(String(dataUrl || ''));
        if (!m) return null;
        return { mime: m[1], data: m[2] };
    }
    function fileToDataUrl(file) {
        return new Promise(function (resolve, reject) {
            var fr = new FileReader();
            fr.onload = function () { resolve(String(fr.result || '')); };
            fr.onerror = function () { reject(new Error('read-failed')); };
            fr.readAsDataURL(file);
        });
    }
    function withTimeout(p, ms) {
        return new Promise(function (resolve, reject) {
            var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
            p.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
        });
    }

    // Verifică o poză. Primește un File/Blob sau un data:image/... deja pregătit.
    // Întoarce { ok: true } / { ok: false, reason: 'image' } / { ok: false, reason: 'unavailable' }
    // „unavailable” = NU am putut verifica (fără internet, AI neconfigurat, limită depășită): poza nu se trimite,
    // dar omul poate reîncerca (vezi explicația din capul fișierului).
    async function checkImage(input) {
        if (!imageChecksEnabled()) return { ok: false, reason: 'unavailable' };
        var dataUrl;
        try {
            dataUrl = (typeof input === 'string') ? input : await fileToDataUrl(input);
        } catch (e) { return { ok: false, reason: 'unavailable' }; }
        var parts = dataUrlParts(dataUrl);
        if (!parts || !/^image\//i.test(parts.mime)) return { ok: false, reason: 'image' };

        var done = root.FVLog ? root.FVLog.time('mod', 'image', 9000) : null;
        try {
            await withTimeout(initAI(), 20000);
            var res = await withTimeout(ai.model.generateContent([
                { inlineData: { mimeType: parts.mime, data: parts.data } },
                { text: 'Verifică imaginea după regulile primite. Răspunde doar OK sau BLOCK.' }
            ]), 20000);
            var txt = '';
            try { txt = String(res.response.text() || '').trim().toUpperCase(); } catch (e) { txt = ''; }
            var blocked = txt.indexOf('BLOCK') !== -1;
            var okAnswer = txt.indexOf('OK') !== -1 && !blocked;
            if (done) done({ ok: true, verdict: blocked ? 'block' : (okAnswer ? 'ok' : 'unclear') });
            if (blocked) return { ok: false, reason: 'image' };
            if (okAnswer) return { ok: true };
            return { ok: false, reason: 'unavailable' };   // răspuns neclar: tratat ca „nu am putut verifica”
        } catch (e) {
            if (done) done({ ok: false, code: (e && e.code) || (e && e.message) || 'necunoscut' });
            // o singură eroare nu oprește filtrul; după 3 la rând nu mai încercăm până la reîncărcare (altfel fiecare poză ar aștepta degeaba)
            ai.failures = (ai.failures || 0) + 1;
            if (ai.failures >= 3) ai.broken = true;
            console.warn('[FeelVoyage] Verificarea pozei nu a putut rula:', e);
            return { ok: false, reason: 'unavailable' };
        }
    }

    // Mai multe poze deodată: se oprește la prima problemă (așa omul vede exact care poză e de vină)
    async function checkImages(list) {
        var arr = Array.prototype.slice.call(list || []);
        for (var i = 0; i < arr.length; i++) {
            var r = await checkImage(arr[i]);
            if (!r.ok) return { ok: false, reason: r.reason, index: i };
        }
        return { ok: true };
    }

    root.FVModeration = {
        checkText: checkText,
        checkName: checkName,
        checkImage: checkImage,
        checkImages: checkImages,
        imageChecksEnabled: imageChecksEnabled,
        normalize: normalize,
        BAD_WORDS: BAD_WORDS,
        _ai: ai
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = root.FVModeration;
})(typeof window !== 'undefined' ? window : globalThis);
