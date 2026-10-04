/* FeelVoyage — lightbox simplu pentru mărirea pozelor de recenzii (click pe o miniatură → poza pe tot ecranul).
   Folosit din js/reviews.js (recenziile dintr-un pachet, pe site-ul principal). Închidere: X, click pe fundal, Escape. */
(function () {
    'use strict';
    const box = document.getElementById('fvLightbox');
    const img = document.getElementById('fvLightboxImg');
    const closeBtn = document.getElementById('fvLightboxClose');
    if (!box || !img || !closeBtn) return;

    let returnFocus = null;
    function open(src, alt) {
        img.src = src;
        img.alt = alt || '';
        returnFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
        box.classList.remove('hidden');
        box.classList.add('flex');
        document.body.style.overflow = 'hidden';
        requestAnimationFrame(function () { closeBtn.focus({ preventScroll: true }); });
    }
    function close() {
        box.classList.add('hidden');
        box.classList.remove('flex');
        img.src = '';
        document.body.style.overflow = '';
        if (returnFocus && document.contains(returnFocus)) { try { returnFocus.focus({ preventScroll: true }); } catch (e) { } }
        returnFocus = null;
    }
    closeBtn.addEventListener('click', close);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !box.classList.contains('hidden')) close(); });

    window.fvOpenLightbox = open;
})();
