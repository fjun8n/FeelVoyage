/* FeelVoyage — acceptarea documentelor legale (Termeni și Condiții, Politica de Confidențialitate, ANPC / SAL).
   La finalul fiecărui document: o bifă + butonul „Acceptă". Acceptul se salvează DOAR în browserul acestui dispozitiv
   (cheia fv_consents), împreună cu data și versiunea documentului (data-doc-version). Dacă versiunea se schimbă, acceptul cere refăcut.
   Nu se trimite nicăieri: pentru dovadă pe server ar trebui salvat în contul utilizatorului sau în comandă (vezi README). */
(function () {
    'use strict';
    const KEY = 'fv_consents';
    const blocks = Array.prototype.slice.call(document.querySelectorAll('.doc-accept[data-doc]'));
    if (!blocks.length) return;

    const kv = (typeof fvStore !== 'undefined') ? fvStore : {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorat */ } }
    };
    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }

    function read() {
        try { const v = JSON.parse(kv.get(KEY)); return v && typeof v === 'object' && !Array.isArray(v) ? v : {}; } catch (e) { return {}; }
    }
    function write(o) { kv.set(KEY, JSON.stringify(o)); }
    function versionOf(doc) { const b = blocks.filter(function (x) { return x.getAttribute('data-doc') === doc; })[0]; return b ? b.getAttribute('data-doc-version') : ''; }
    function isAccepted(doc) { const c = read()[doc]; return !!(c && c.v === versionOf(doc) && Number(c.at) > 0); }

    function dateText(at) {
        const loc = (typeof LOCALES !== 'undefined' && typeof currentLang !== 'undefined' && LOCALES[currentLang]) || 'ro-RO';
        try { return new Date(at).toLocaleDateString(loc, { day: 'numeric', month: 'long', year: 'numeric' }); }
        catch (e) { return new Date(at).toISOString().slice(0, 10); }
    }

    function render() {
        blocks.forEach(function (b) {
            const doc = b.getAttribute('data-doc');
            const check = b.querySelector('[data-accept-check]');
            const btn = b.querySelector('[data-accept-btn]');
            const done = b.querySelector('[data-accept-done]');
            const doneText = b.querySelector('[data-accept-done-text]');
            const withdraw = b.querySelector('[data-accept-withdraw]');
            const ok = isAccepted(doc);
            if (ok) {
                const c = read()[doc];
                check.checked = true; check.disabled = true;
                btn.hidden = true;
                done.hidden = false; withdraw.hidden = false;
                doneText.textContent = trF('accept.done', 'Acceptat pe {date}').replace('{date}', dateText(c.at));
            } else {
                check.disabled = false;
                btn.hidden = false; btn.disabled = !check.checked;
                done.hidden = true; withdraw.hidden = true;
            }
        });
        document.querySelectorAll('.doc-chip[data-chip]').forEach(function (chip) {
            chip.classList.toggle('is-done', isAccepted(chip.getAttribute('data-chip')));
        });
    }

    function toast(key, fallback) { if (typeof window.fvToast === 'function') window.fvToast(trF(key, fallback)); }

    blocks.forEach(function (b) {
        const doc = b.getAttribute('data-doc');
        const check = b.querySelector('[data-accept-check]');
        const btn = b.querySelector('[data-accept-btn]');
        b.querySelector('[data-accept-done]').setAttribute('aria-live', 'polite');
        check.addEventListener('change', function () { btn.disabled = !check.checked; });
        btn.addEventListener('click', function () {
            if (!check.checked) return;
            const all = read();
            all[doc] = { v: versionOf(doc), at: Date.now() };
            write(all);
            render();
            toast('accept.toast', 'Mulțumim! Acceptul a fost salvat.');
        });
        b.querySelector('[data-accept-withdraw]').addEventListener('click', function () {
            const all = read();
            delete all[doc];
            write(all);
            check.checked = false;
            render();
            toast('accept.toastOff', 'Acceptul a fost retras.');
        });
    });

    // alte file ale aceluiași browser + schimbarea limbii (data se rescrie în limba paginii)
    window.addEventListener('storage', function (e) { if (e.key === KEY) render(); });
    if (window.MutationObserver) new MutationObserver(render).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    document.addEventListener('fv:doc-open', render);

    window.FVConsent = { isAccepted: isAccepted, all: read, version: versionOf };
    render();
})();
