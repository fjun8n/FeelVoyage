/* FeelVoyage — animații.
   Tot ce e aici se oprește singur în modul rapid (perf-low) și când sistemul cere „reduce motion” (clasa motion-off pe <html>, vezi js/perf.js):
   • apariție la derulare (fade + glisare ușoară) pentru titluri, carduri de pe prima pagină, servicii și contact, cu întârziere în cascadă;
   • indicație „trage de mâner” pe primul card cu galerie (o singură dată pe sesiune, doar pe ecrane late unde există sertarul);
   • bară subțire de progres la derulare, sus.
   Animațiile de card din fereastra cu destinații, de la butoane și de la schimbarea pozei sunt în CSS (css/styles.css).
   Nimic nu ascunde definitiv conținutul: dacă IntersectionObserver lipsește sau pagina e ascunsă, totul se arată imediat; după 4 s orice element rămas se arată oricum. */
(function (root) {
    'use strict';
    var doc = root.document, html = doc.documentElement;
    function motionOn() { return !html.classList.contains('motion-off'); }
    function log(ev, data) { if (root.FVLog) root.FVLog.log('debug', 'motion', ev, data); }

    var io = null, watched = 0, revealed = 0;
    var SELECTORS = [
        '#destinatii > div > .text-center',                 // titlul secțiunii de destinații
        '#filterContainer', '#destinatii p.text-center',      // butoanele de categorie și indicația
        '#viewAllBtn',
        '#servicii .text-center', '#servicii .grid > *',
        '#contact .grid > *'
    ];

    function finish(el) {
        // după ce a apărut, elementul revine la stilurile lui obișnuite (altfel „is-in” ar bloca efectele de hover ale cardurilor)
        el.removeAttribute('data-reveal');
        el.classList.remove('is-in');
        el.style.removeProperty('--rd');
    }
    function show(el) {
        if (!el.hasAttribute('data-reveal') || el.classList.contains('is-in')) return;
        el.classList.add('is-in');
        revealed++;
        var wait = 700 + (parseInt(el.style.getPropertyValue('--rd'), 10) || 0);
        setTimeout(function () { finish(el); }, wait);
    }
    function watch(el, delayIndex) {
        if (!el || el.nodeType !== 1 || el.hasAttribute('data-reveal')) return;
        el.setAttribute('data-reveal', '');
        el.style.setProperty('--rd', Math.min(6, delayIndex || 0) * 70 + 'ms');
        watched++;
        if (io) io.observe(el); else show(el);
    }
    function watchAll(list) {
        var i = 0;
        Array.prototype.forEach.call(list, function (el) { watch(el, i++); });
    }

    function initReveal() {
        if (!('IntersectionObserver' in root)) return;
        io = new IntersectionObserver(function (ents) {
            ents.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); show(en.target); } });
        }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
        html.classList.add('motion-ready');
        SELECTORS.forEach(function (sel) {
            var nodes = doc.querySelectorAll(sel), byParent = new Map();
            nodes.forEach(function (n) { var k = n.parentElement; var i = byParent.get(k) || 0; byParent.set(k, i + 1); watch(n, i); });
        });
        // cardurile de pe prima pagină se creează după încărcarea scripturilor: le prindem o singură dată, la prima populare
        var grid = doc.getElementById('destinationsGrid');
        if (grid) {
            if (grid.children.length) watchAll(grid.children);
            else {
                var mo = new MutationObserver(function () { if (grid.children.length) { mo.disconnect(); watchAll(grid.children); } });
                mo.observe(grid, { childList: true });
            }
        }
        // plasă de siguranță: nimic nu rămâne ascuns
        setTimeout(function () { doc.querySelectorAll('[data-reveal]').forEach(show); html.classList.add('motion-fallback'); }, 4000);
        doc.addEventListener('visibilitychange', function () { if (doc.hidden) doc.querySelectorAll('[data-reveal]').forEach(show); });
    }

    /* Indicația „trage de mâner”: mânerul primului card cu sertar se mișcă de două ori, o singură dată pe sesiune */
    function initPeek() {
        if (!root.matchMedia || !root.matchMedia('(min-width: 1024px)').matches || !('IntersectionObserver' in root)) return;
        var seen = false; try { seen = root.sessionStorage.getItem('fv_peek') === '1'; } catch (e) { }
        if (seen) return;
        var grid = doc.getElementById('destinationsGrid');
        if (!grid) return;
        var pio = new IntersectionObserver(function (ents) {
            ents.forEach(function (en) {
                if (!en.isIntersecting) return;
                pio.disconnect();
                try { root.sessionStorage.setItem('fv_peek', '1'); } catch (e) { }
                var tab = en.target.querySelector('[data-pull]');
                if (!tab || !motionOn()) return;
                setTimeout(function () { tab.classList.add('is-peek'); setTimeout(function () { tab.classList.remove('is-peek'); }, 1800); log('peek'); }, 700);
            });
        }, { threshold: 0.6 });
        var arm = function () { var c = grid.children[0]; if (c) pio.observe(c.querySelector('.fv-cover') || c); };
        if (grid.children.length) arm();
        else { var mo = new MutationObserver(function () { if (grid.children.length) { mo.disconnect(); arm(); } }); mo.observe(grid, { childList: true }); }
    }

    /* Bara de progres la derulare (transform pe un singur element; actualizată cel mult o dată pe cadru) */
    function initProgress() {
        var bar = doc.createElement('div');
        bar.id = 'fvProgress'; bar.setAttribute('aria-hidden', 'true');
        doc.body.appendChild(bar);
        var ticking = false;
        function update() {
            ticking = false;
            var h = html.scrollHeight - root.innerHeight;
            bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, Math.max(0, root.scrollY / h)) : 0) + ')';
        }
        root.addEventListener('scroll', function () { if (!ticking) { ticking = true; root.requestAnimationFrame(update); } }, { passive: true });
        update();
    }

    function init() {
        if (!motionOn()) { log('off', { lite: html.classList.contains('perf-low') }); return; }
        initReveal();
        initPeek();
        initProgress();
    }
    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', init); else init();

    // modul rapid pornit din butonul din subsol: scoatem imediat ascunderile și bara
    doc.addEventListener('fv:perf', function () {
        if (motionOn()) return;
        doc.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('is-in'); finish(el); });
        html.classList.remove('motion-ready');
        var b = doc.getElementById('fvProgress'); if (b) b.remove();
    });

    root.FVMotion = { watch: watch, watchAll: watchAll, stats: function () { return { watched: watched, revealed: revealed }; } };
})(window);
