/* FeelVoyage — traducere automată a unui text scurt, cu Gemini (prin Firebase AI Logic).

   Folosită la newsletter: administratorul scrie mesajul o singură dată (în română), iar fiecare abonat îl
   primește pe limba țării lui din cont (vezi js/emailnotify.js → sendUpdateToSubscribers). Nicio cheie nouă:
   merge pe aceeași configurație care există deja în js/firebase-config.js → FV_AI_CONFIG.

   Nu e un traducător de uz general: cere un text scurt (max 1500 de caractere), traduce într-un singur apel
   în toate limbile cerute și întoarce un obiect { en: '…', it: '…', fr: '…', es: '…' }. Dacă traducerea nu
   reușește (fără internet, AI neconfigurat, limită depășită), întoarce textul original pentru limbile care
   au eșuat — deci newsletterul pleacă oricum, în cel mai rău caz în limba în care l-ai scris. */
(function (root) {
    'use strict';

    var LANG_NAMES = { ro: 'română', en: 'engleză', it: 'italiană', fr: 'franceză', es: 'spaniolă' };
    var MAX_CHARS = 1500;

    function cfg() { return root.FV_AI_CONFIG || {}; }
    function hasKey(k) { return typeof k === 'string' && k.trim() !== '' && !/^PASTE/i.test(k.trim()); }
    function backend() { return root.FVBackend || root.FVReviewsBackend || null; }

    var st = { ready: null, model: null, mod: null, appCheckDone: false };

    function enabled() {
        var b = backend();
        return !!(b && b.mode === 'firebase' && b.importSDK && cfg().enabled !== false);
    }

    function init() {
        if (st.ready) return st.ready;
        var c = cfg();
        st.ready = (async function () {
            var b = backend();
            if (!b || !b.firebaseApp) throw new Error('no-firebase');
            var app = await b.firebaseApp();
            if (!app) throw new Error('no-firebase');
            if (hasKey(c.appCheckSiteKey) && !st.appCheckDone) {
                try {
                    var ac = await b.importSDK('app-check');
                    if (c.appCheckDebug) root.self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
                    var legacy = String(c.appCheckProvider || '').toLowerCase() === 'v3';
                    var provider = legacy ? new ac.ReCaptchaV3Provider(c.appCheckSiteKey) : new ac.ReCaptchaEnterpriseProvider(c.appCheckSiteKey);
                    ac.initializeAppCheck(app, { provider: provider, isTokenAutoRefreshEnabled: true });
                } catch (e) { /* poate fi deja pornit de js/ai.js — nu e o eroare */ }
                st.appCheckDone = true;
            }
            st.mod = await b.importSDK('ai');
            var ai = st.mod.getAI(app, { backend: new st.mod.GoogleAIBackend() });
            st.model = st.mod.getGenerativeModel(ai, {
                model: c.model || 'gemini-3.5-flash-lite',
                systemInstruction: [
                    'Ești un traducător pentru newsletterul unei agenții de turism din România (FeelVoyage).',
                    'Primești un text scurt și o listă de limbi. Traduci textul în fiecare limbă cerută.',
                    'REGULI:',
                    '• Păstrează sensul exact, tonul prietenos și toate cifrele, datele, prețurile și numele proprii neschimbate.',
                    '• Păstrează emoji-urile și formatarea simplă (**bold**, rânduri noi) exact unde erau.',
                    '• NU adăuga, nu explica, nu comenta și nu traduce numele „FeelVoyage”.',
                    '• Răspunzi DOAR cu JSON, fără alt text, exact în forma: {"en":"…","it":"…","fr":"…","es":"…"}',
                    '  (doar cheile limbilor cerute).'
                ].join('\n'),
                generationConfig: { maxOutputTokens: 2048, temperature: 0.2, responseMimeType: 'application/json' }
            }, { timeout: 30000 });
        })();
        st.ready.catch(function () { st.ready = null; });
        return st.ready;
    }

    function withTimeout(p, ms) {
        return new Promise(function (resolve, reject) {
            var t = setTimeout(function () { reject(new Error('timeout')); }, ms);
            p.then(function (v) { clearTimeout(t); resolve(v); }, function (e) { clearTimeout(t); reject(e); });
        });
    }

    // text: ce a scris administratorul · langs: ['en','it','fr','es'] · from: limba textului (implicit 'ro')
    // Întoarce { en:…, it:…, … }. Limbile care n-au putut fi traduse primesc textul original.
    async function toLanguages(text, langs, from) {
        var src = String(text || '').trim().slice(0, MAX_CHARS);
        var want = (langs || []).filter(function (l) { return l && l !== (from || 'ro') && LANG_NAMES[l]; });
        var out = {};
        want.forEach(function (l) { out[l] = src; });     // rezervă: textul original
        if (!src || !want.length) return out;
        if (!enabled()) return out;

        var done = root.FVLog ? root.FVLog.time('translate', 'newsletter', 12000) : null;
        try {
            await withTimeout(init(), 30000);
            var prompt = 'Limba textului: ' + (LANG_NAMES[from || 'ro'] || 'română') + '.\n'
                + 'Tradu în: ' + want.map(function (l) { return l + ' (' + LANG_NAMES[l] + ')'; }).join(', ') + '.\n'
                + 'Text:\n' + src;
            var res = await withTimeout(st.model.generateContent(prompt), 30000);
            var raw = '';
            try { raw = String(res.response.text() || ''); } catch (e) { raw = ''; }
            var parsed = null;
            try { parsed = JSON.parse(raw); } catch (e) {
                var m = /\{[\s\S]*\}/.exec(raw);           // dacă modelul a pus JSON-ul între alt text
                if (m) { try { parsed = JSON.parse(m[0]); } catch (e2) { parsed = null; } }
            }
            var okCount = 0;
            if (parsed && typeof parsed === 'object') {
                want.forEach(function (l) {
                    var v = parsed[l];
                    if (typeof v === 'string' && v.trim()) { out[l] = v.trim().slice(0, MAX_CHARS * 2); okCount++; }
                });
            }
            if (done) done({ ok: okCount > 0, langs: okCount, asked: want.length });
            if (!okCount) console.warn('[FeelVoyage] Traducerea newsletterului nu a întors nimic folosibil; se trimite textul original.');
            return out;
        } catch (e) {
            if (done) done({ ok: false, code: (e && e.message) || 'necunoscut' });
            console.warn('[FeelVoyage] Traducerea newsletterului a eșuat; se trimite textul original:', e);
            return out;
        }
    }

    root.FVTranslate = { toLanguages: toLanguages, enabled: enabled, LANG_NAMES: LANG_NAMES, MAX_CHARS: MAX_CHARS };
})(window);
