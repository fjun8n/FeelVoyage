/* FeelVoyage — fereastra „Despre noi".
   Conținutul (povestea, cifrele, cele 4 valori, „De ce aleg călătorii FeelVoyage?") nu mai stă pe pagina principală:
   se deschide într-o fereastră din „Despre Noi" (antet, desktop și meniul de telefon) și din „Despre FeelVoyage" (subsol).
   Textele rămân în index.html, cu aceleași chei de traducere (despre.*), deci limba se schimbă și cât timp fereastra e închisă. */
(function () {
    'use strict';
    const modal = document.getElementById('aboutModal');
    if (!modal) return;
    const panel = document.getElementById('aboutModalContainer');
    const scroller = document.getElementById('aboutScroll');
    const closeBtn = document.getElementById('closeAboutBtn');
    const contactBtn = document.getElementById('aboutContactBtn');
    let lastFocus = null;       // elementul de la care s-a deschis (primește focusul înapoi)
    let fromHash = false;       // deschisă prin adresa …/#despre
    let hideTimer = null;

    const isOpen = () => !modal.classList.contains('hidden');

    function open(viaHash) {
        if (isOpen()) return;
        clearTimeout(hideTimer);
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
        // dacă fereastra a fost deschisă prin #despre, scoatem adresa ca să nu se redeschidă la reîncărcare
        if (fromHash && location.hash === '#despre' && window.history && history.replaceState) {
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

    // „Despre Noi" din antet (desktop + meniul de telefon) și „Despre FeelVoyage" din subsol
    document.querySelectorAll('a[href="#despre"]').forEach(function (a) {
        a.addEventListener('click', function (e) { e.preventDefault(); open(false); });
    });
    closeBtn.addEventListener('click', function () { close(); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });

    // „Vino să ne cunoști": închide fereastra și te duce la formularul de contact
    if (contactBtn) contactBtn.addEventListener('click', function (e) {
        e.preventDefault();
        close(function () {
            const c = document.getElementById('contact');
            if (c) c.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

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

    // adresa veche/externă …/#despre deschide fereastra
    function fromLocation() { if (location.hash === '#despre') open(true); }
    window.addEventListener('hashchange', fromLocation);
    fromLocation();

    window.fvOpenAbout = function () { open(false); };
    window.fvCloseAbout = function () { close(); };
})();
