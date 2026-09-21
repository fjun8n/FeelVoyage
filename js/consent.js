/* FeelVoyage — acceptarea documentelor legale (Termeni și Condiții, Politica de Confidențialitate, ANPC / SAL).
   La finalul fiecărui document: o bifă + butonul „Acceptă".
   • Cu cont (autentificat): acceptul se salvează PE CONT, cu data serverului și versiunea documentului (users/<uid>/consents/<doc>);
     îl vezi pe orice dispozitiv, iar administratorul îl vede în panoul de utilizatori. „Retrage acceptul" păstrează urma retragerii (off).
   • Fără cont: acceptul se salvează doar în browserul acestui dispozitiv (cheia fv_consents). La prima autentificare sau creare de cont,
     acceptele date în acest fel se mută automat pe cont (cu data originală) și se șterg din dispozitiv.
   Versiunea documentului e data-doc-version; dacă se schimbă, acceptul cere refăcut. */
(function () {
    'use strict';
    const KEY = 'fv_consents';
    const DOCS = ['terms', 'privacy', 'anpc'];
    const blocks = Array.prototype.slice.call(document.querySelectorAll('.doc-accept[data-doc]'));
    if (!blocks.length) return;

    const kv = (typeof fvStore !== 'undefined') ? fvStore : {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorat */ } }
    };
    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }
    const backend = window.FVBackend && FVBackend.saveConsent ? window.FVBackend : null;

    let account = null;          // sesiunea curentă (cu .consents) sau null dacă nu ești autentificat
    const pending = {};          // documente cu o salvare în curs (butonul „Acceptă" e dezactivat)
    const uploading = {};        // documente în curs de mutare de pe dispozitiv pe cont

    function read() {
        try { const v = JSON.parse(kv.get(KEY)); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch (e) { return {}; }
    }
    function write(o) { kv.set(KEY, JSON.stringify(o)); }
    function versionOf(doc) { const b = blocks.filter(function (x) { return x.getAttribute('data-doc') === doc; })[0]; return b ? b.getAttribute('data-doc-version') : ''; }
    // acceptat = versiunea curentă și nu a fost retras după acceptare
    function ok(entry, version) { return !!(entry && entry.v === version && Number(entry.at) > 0 && !(Number(entry.off) >= Number(entry.at))); }
    function entryOf(doc) { return account ? (account.consents || {})[doc] : read()[doc]; }
    function isAccepted(doc) { return ok(entryOf(doc), versionOf(doc)); }

    function dateText(at) {
        const loc = (typeof LOCALES !== 'undefined' && typeof currentLang !== 'undefined' && LOCALES[currentLang]) || 'ro-RO';
        try { return new Date(at).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }); }
        catch (e) { return new Date(at).toISOString().slice(0, 10); }
    }
    function toast(key, fallback, kind) { if (typeof window.fvToast === 'function') window.fvToast(trF(key, fallback), kind); }

    function render() {
        blocks.forEach(function (b) {
            const doc = b.getAttribute('data-doc');
            const check = b.querySelector('[data-accept-check]');
            const btn = b.querySelector('[data-accept-btn]');
            const done = b.querySelector('[data-accept-done]');
            const doneText = b.querySelector('[data-accept-done-text]');
            const withdraw = b.querySelector('[data-accept-withdraw]');
            const e = entryOf(doc);
            if (isAccepted(doc)) {
                check.checked = true; check.disabled = true;
                btn.hidden = true;
                done.hidden = false; withdraw.hidden = false; withdraw.disabled = !!pending[doc];
                doneText.textContent = trF('accept.done', 'Acceptat pe {date}').replace('{date}', dateText(e.at));
            } else {
                check.disabled = false;
                btn.hidden = false; btn.disabled = !check.checked || !!pending[doc];
                done.hidden = true; withdraw.hidden = true;
            }
            b.querySelector('[data-accept-note-out]').hidden = !!account;
            b.querySelector('[data-accept-login]').hidden = !!account;
            b.querySelector('[data-accept-note-in]').hidden = !account;
        });
        document.querySelectorAll('.doc-chip[data-chip]').forEach(function (chip) {
            chip.classList.toggle('is-done', isAccepted(chip.getAttribute('data-chip')));
        });
    }

    // acceptele date fără cont se mută pe cont la autentificare / creare de cont
    function migrate() {
        if (!account || !backend) return;
        const local = read(); let changed = false;
        DOCS.forEach(function (doc) {
            const v = versionOf(doc), le = local[doc];
            if (!le || !ok(le, v) || uploading[doc]) return;
            const ae = (account.consents || {})[doc];
            if (ok(ae, v) || (ae && Number(ae.off) >= Number(le.at))) { delete local[doc]; changed = true; return; }   // contul o are deja sau a retras-o ulterior
            uploading[doc] = true;
            backend.saveConsent(doc, v, le.at).then(function () {
                const l = read(); delete l[doc]; write(l);
            }, function () { /* rămâne pe dispozitiv; se reîncearcă la următoarea autentificare */ }).then(function () { uploading[doc] = false; render(); });
        });
        if (changed) write(local);
    }

    blocks.forEach(function (b) {
        const doc = b.getAttribute('data-doc');
        const check = b.querySelector('[data-accept-check]');
        const btn = b.querySelector('[data-accept-btn]');
        b.querySelector('[data-accept-done]').setAttribute('aria-live', 'polite');
        check.addEventListener('change', function () { btn.disabled = !check.checked || !!pending[doc]; });

        btn.addEventListener('click', function () {
            if (!check.checked || pending[doc]) return;
            if (account) {
                pending[doc] = true; render();
                backend.saveConsent(doc, versionOf(doc)).then(function () {
                    toast('accept.toast', 'Mulțumim! Acceptul a fost salvat.');
                }, function () {
                    toast('accept.error', 'Nu am putut salva acceptul pe contul tău. Verifică internetul și încearcă din nou.', 'error');
                }).then(function () { pending[doc] = false; render(); });
                return;
            }
            const all = read();
            all[doc] = { v: versionOf(doc), at: Date.now() };
            write(all);
            render();
            toast('accept.toast', 'Mulțumim! Acceptul a fost salvat.');
        });

        b.querySelector('[data-accept-withdraw]').addEventListener('click', function () {
            if (account) {
                pending[doc] = true; render();
                backend.withdrawConsent(doc).then(function () {
                    check.checked = false;
                    toast('accept.toastOff', 'Acceptul a fost retras.');
                }, function () {
                    toast('accept.error', 'Nu am putut salva acceptul pe contul tău. Verifică internetul și încearcă din nou.', 'error');
                }).then(function () { pending[doc] = false; render(); });
                return;
            }
            const all = read();
            delete all[doc];
            write(all);
            check.checked = false;
            render();
            toast('accept.toastOff', 'Acceptul a fost retras.');
        });

        // „Autentifică-te": închide documentul și deschide fereastra de autentificare
        b.querySelector('[data-accept-login]').addEventListener('click', function () {
            const modal = b.closest('[role="dialog"]');
            const closeBtn = modal && modal.querySelector('.doc-close');
            if (closeBtn) closeBtn.click();
            setTimeout(function () { if (typeof openAuthModal === 'function') openAuthModal('login'); }, 280);
        });
    });

    // alte file ale aceluiași browser + schimbarea limbii (data se rescrie în limba paginii)
    window.addEventListener('storage', function (e) { if (e.key === KEY) render(); });
    if (window.MutationObserver) new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    document.addEventListener('fv:doc-open', render);
    if (backend) backend.onAuth(function (s) { account = s || null; migrate(); render(); });

    window.FVConsent = { isAccepted: isAccepted, all: function () { return account ? (account.consents || {}) : read(); }, version: versionOf };
    render();
})();
