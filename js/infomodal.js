/* FeelVoyage — ferestrele informative: „Despre noi" și „Termeni și Condiții".
   Conținutul lor nu mai stă pe pagina principală: se deschide într-o fereastră din link-urile din antet / meniul de telefon / subsol.
   Textele rămân în index.html, cu chei de traducere (despre.*, terms.*), deci limba se schimbă și cât timp fereastra e închisă.
   O singură logică pentru ambele ferestre: blocarea derulării paginii, Escape, click pe fundal, focus prins în fereastră și revenit la închidere. */
(function () {
    'use strict';
    const instances = [];
    const reduceMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function attach(cfg) {
        const modal = document.getElementById(cfg.modal);
        if (!modal) return null;
        const panel = document.getElementById(cfg.panel);
        const scroller = document.getElementById(cfg.scroll);
        const closeBtn = document.getElementById(cfg.close);
        let lastFocus = null;       // elementul de la care s-a deschis (primește focusul înapoi)
        let fromHash = false;       // deschisă prin adresa …/#despre sau …/#termeni
        let hideTimer = null;

        const isOpen = () => !modal.classList.contains('hidden');

        function open(viaHash) {
            if (isOpen()) return;
            clearTimeout(hideTimer);
            instances.forEach(function (o) { if (o !== api && o.isOpen()) o.close(); });   // o singură fereastră deschisă
            lastFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
            fromHash = !!viaHash;
            if (typeof closeMobileMenu === 'function') closeMobileMenu();
            modal.classList.remove('hidden');
            if (typeof lockScroll === 'function') lockScroll(true);
            scroller.scrollTop = 0;
            requestAnimationFrame(function () {
                panel.classList.remove('scale-95', 'opacity-0');
                try { closeBtn.focus({ preventScroll: true }); } catch (e) { closeBtn.focus(); }
            });
        }

        function close(after) {
            if (!isOpen()) { if (typeof after === 'function') after(); return; }
            if (typeof lockScroll === 'function') lockScroll(false);
            panel.classList.add('scale-95', 'opacity-0');
            // deschisă prin adresă: o scoatem, ca să nu se redeschidă la reîncărcare
            if (fromHash && location.hash === cfg.hash && window.history && history.replaceState) {
                try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
            }
            fromHash = false;
            hideTimer = setTimeout(function () {
                modal.classList.add('hidden');
                if (lastFocus && document.contains(lastFocus) && lastFocus.offsetParent !== null) { try { lastFocus.focus({ preventScroll: true }); } catch (e) { } }
                lastFocus = null;
                if (typeof after === 'function') after();
            }, 200);
        }

        const api = { open: open, close: close, isOpen: isOpen, scroller: scroller };
        instances.push(api);

        document.querySelectorAll('a[href="' + cfg.hash + '"]').forEach(function (a) {
            a.addEventListener('click', function (e) { e.preventDefault(); open(false); });
        });
        closeBtn.addEventListener('click', function () { close(); });
        (cfg.extraClose || []).forEach(function (id) { const b = document.getElementById(id); if (b) b.addEventListener('click', function () { close(); }); });
        modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

        document.addEventListener('keydown', function (e) {
            if (!isOpen()) return;
            if (e.key === 'Escape') { close(); return; }
            if (e.key !== 'Tab') return;   // focusul rămâne în fereastră cât timp e deschisă
            const f = Array.prototype.filter.call(modal.querySelectorAll('a[href], button:not([disabled])'), function (el) { return el.offsetParent !== null; });
            if (!f.length) return;
            const first = f[0], last = f[f.length - 1];
            if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        });

        // adresa externă …/#despre sau …/#termeni deschide fereastra (și la „Înapoi" / schimbare de adresă)
        function fromLocation() { if (location.hash === cfg.hash) open(true); }
        window.addEventListener('hashchange', fromLocation);
        fromLocation();
        return api;
    }

    /* ---------- Despre noi ---------- */
    const about = attach({ modal: 'aboutModal', panel: 'aboutModalContainer', scroll: 'aboutScroll', close: 'closeAboutBtn', hash: '#despre' });
    if (about) {
        // „Vino să ne cunoști": închide fereastra și te duce la formularul de contact
        const contactBtn = document.getElementById('aboutContactBtn');
        if (contactBtn) contactBtn.addEventListener('click', function (e) {
            e.preventDefault();
            about.close(function () {
                const c = document.getElementById('contact');
                if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
        window.fvOpenAbout = function () { about.open(false); };
        window.fvCloseAbout = function () { about.close(); };
    }

    /* ---------- Termeni și Condiții ---------- */
    const terms = attach({ modal: 'termsModal', panel: 'termsModalContainer', scroll: 'termsScroll', close: 'closeTermsBtn', hash: '#termeni', extraClose: ['termsDoneBtn'] });
    if (terms) {
        // cuprinsul: derulează în interiorul ferestrei (nu în pagina din spate) până la secțiunea aleasă
        document.querySelectorAll('#termsModal [data-terms-go]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.getElementById(a.getAttribute('data-terms-go'));
                if (!target) return;
                const top = target.getBoundingClientRect().top - terms.scroller.getBoundingClientRect().top + terms.scroller.scrollTop - 12;
                terms.scroller.scrollTo({ top: Math.max(0, top), behavior: reduceMotion() ? 'auto' : 'smooth' });
                const h = target.querySelector('h3');
                if (h) { h.setAttribute('tabindex', '-1'); try { h.focus({ preventScroll: true }); } catch (err) { } }
            });
        });
        window.fvOpenTerms = function () { terms.open(false); };
        window.fvCloseTerms = function () { terms.close(); };
    }
})();
