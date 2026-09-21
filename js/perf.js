/* FeelVoyage — modul rapid (dispozitive slabe).
   Clasele de pe <html> se pun încă din <head> (vezi index.html), înainte de prima afișare:
     perf-low   = modul rapid: fără estompări (backdrop blur), umbre simple, fără animații de zoom pe poze, secțiuni de jos randate leneș, poze mai mici
     motion-off = fără animații (modul rapid SAU „reduce motion” cerut de sistem)
   Reguli automate (mod „auto”): memorie ≤ 2 GB, procesor cu ≤ 2 nuclee, „economisire de date” pornită, rețea 2G — plus un sondaj de fluiditate după încărcare
   (dacă pagina rulează sub ~25 de cadre pe secundă de două ori la rând, trece singură în modul rapid).
   Utilizatorul poate alege oricând: butonul „Mod rapid” din subsol sau ?lite=1 / ?lite=0 în adresă (alegerea se ține minte în fv_perf).
   Tot ce se întâmplă se scrie în jurnal (categoria „perf”). */
(function (root) {
    'use strict';
    var doc = root.document, html = doc.documentElement;
    var KEY = 'fv_perf';
    var kv = {
        get: function (k) { try { return root.localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { root.localStorage.setItem(k, v); } catch (e) { } },
        del: function (k) { try { root.localStorage.removeItem(k); } catch (e) { } }
    };
    function trF(key, fb) { return (typeof root.tr === 'function') ? root.tr(key, fb) : fb; }
    function log(level, ev, data) { if (root.FVLog) root.FVLog.log(level, 'perf', ev, data); }

    function isLite() { return html.classList.contains('perf-low'); }
    function mode() { return html.getAttribute('data-perf-mode') || 'auto'; }
    function reducedMotion() { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }

    function applyClasses(low) {
        html.classList.toggle('perf-low', low);
        html.classList.toggle('motion-off', low || reducedMotion());
        html.setAttribute('data-perf', low ? 'lite' : 'full');
    }

    function updateButtons() {
        var low = isLite();
        doc.querySelectorAll('[data-perf-toggle]').forEach(function (b) {
            b.setAttribute('aria-pressed', low ? 'true' : 'false');
            var lab = b.querySelector('[data-perf-label]');
            if (lab) lab.textContent = low ? trF('perf.on', 'Mod rapid: pornit') : trF('perf.off', 'Mod rapid: oprit');
            b.title = trF('perf.title', 'Reduce efectele și animațiile pentru un site mai fluid pe telefoane mai vechi');
        });
    }

    // alegere explicită: 'lite' | 'full' | 'auto' (auto = revine la regulile automate la următoarea încărcare)
    function setMode(m, why) {
        if (m !== 'lite' && m !== 'full') { kv.del(KEY); m = 'auto'; } else kv.set(KEY, m);
        html.setAttribute('data-perf-mode', m);
        var low = m === 'lite';
        if (low) html.setAttribute('data-perf-why', 'ales'); else html.removeAttribute('data-perf-why');
        applyClasses(low);
        updateButtons();
        log('info', 'mode', { mode: m, lite: isLite(), why: why || 'ales de utilizator' });
        doc.dispatchEvent(new CustomEvent('fv:perf', { detail: { lite: isLite(), mode: m } }));
    }

    // Sondaj de fluiditate: măsoară cât durează cadrele când pagina e inactivă; sub ~25 fps de două ori la rând → modul rapid
    var probes = 0, slowProbes = 0;
    function probe() {
        if (mode() !== 'auto' || isLite() || doc.hidden || !root.requestAnimationFrame) return;
        var frames = 0, t0 = 0, last = 0, worst = 0;
        function tick(ts) {
            if (!t0) { t0 = ts; last = ts; }
            else { worst = Math.max(worst, ts - last); last = ts; }
            frames++;
            if (frames < 30 && ts - t0 < 1500) return root.requestAnimationFrame(tick);
            var avg = (ts - t0) / Math.max(1, frames - 1);
            probes++;
            var fps = Math.round(1000 / avg);
            log('debug', 'probe', { fps: fps, worstFrameMs: Math.round(worst), n: probes });
            slowProbes = fps < 25 ? slowProbes + 1 : 0;
            if (slowProbes >= 2) { html.setAttribute('data-perf-why', 'fluiditate'); applyClasses(true); updateButtons(); log('warn', 'mode', { mode: 'auto', lite: true, why: 'fluiditate', fps: fps }); doc.dispatchEvent(new CustomEvent('fv:perf', { detail: { lite: true, mode: 'auto' } })); return; }
            if (probes < 4) setTimeout(probe, 2500);
        }
        root.requestAnimationFrame(tick);
    }
    function startProbe() { setTimeout(probe, 1800); }
    if (doc.readyState === 'complete') startProbe(); else root.addEventListener('load', startProbe);

    doc.addEventListener('click', function (e) {
        var b = e.target && e.target.closest && e.target.closest('[data-perf-toggle]');
        if (!b) return;
        setMode(isLite() ? 'full' : 'lite');
    });
    doc.addEventListener('fv:language', updateButtons);
    // „reduce motion” schimbat din setările sistemului cât timp pagina e deschisă
    if (root.matchMedia) {
        try { var mq = root.matchMedia('(prefers-reduced-motion: reduce)'); var on = function () { applyClasses(isLite()); }; if (mq.addEventListener) mq.addEventListener('change', on); else if (mq.addListener) mq.addListener(on); } catch (e) { }
    }

    /* Dimensiuni adaptate: în modul rapid pozele de pe carduri se cer mai mici (mai puține date, decodare mai rapidă), iar cardurile apar în loturi mai mici */
    var api = {
        isLite: isLite,
        mode: mode,
        setMode: setMode,
        reducedMotion: reducedMotion,
        motionOn: function () { return !html.classList.contains('motion-off'); },
        coverWidth: function () { return isLite() ? 500 : 700; },
        chunk: function () { return isLite() ? 4 : 8; },
        updateButtons: updateButtons
    };
    root.FVPerf = api;

    // jurnal: modul ales la pornire și motivul
    log('info', 'mode', { mode: mode(), lite: isLite(), why: html.getAttribute('data-perf-why') || (isLite() ? 'ales' : 'dispozitiv suficient'), reducedMotion: reducedMotion() });
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', updateButtons); else updateButtons();
})(window);
