/* FeelVoyage — lightbox pentru mărirea pozelor de recenzii (click pe o miniatură → poza pe tot ecranul,
   într-un cadru alb, cu săgeți ca să treci prin toate pozele aceleiași recenzii).
   Apel: window.fvOpenLightbox(photos, startIndex) — photos poate fi un singur URL sau un array de URL-uri.
   Închidere: X (colț dreapta-sus), click pe fundal, Escape. Navigare: săgețile de pe ecran, ← / → de la tastatură. */
(function () {
    'use strict';
    const box = document.getElementById('fvLightbox');
    const img = document.getElementById('fvLightboxImg');
    const closeBtn = document.getElementById('fvLightboxClose');
    const prevBtn = document.getElementById('fvLightboxPrev');
    const nextBtn = document.getElementById('fvLightboxNext');
    const counter = document.getElementById('fvLightboxCounter');
    if (!box || !img || !closeBtn) return;

    let photos = [];
    let idx = 0;
    let returnFocus = null;

    function render() {
        img.src = photos[idx];
        img.alt = '';
        const multi = photos.length > 1;
        if (prevBtn) prevBtn.classList.toggle('hidden', !multi);
        if (nextBtn) nextBtn.classList.toggle('hidden', !multi);
        if (counter) {
            counter.textContent = multi ? (idx + 1) + ' / ' + photos.length : '';
            counter.classList.toggle('hidden', !multi);
        }
    }
    function open(photosOrSrc, startIndex) {
        photos = (Array.isArray(photosOrSrc) ? photosOrSrc : [photosOrSrc]).filter(Boolean);
        if (!photos.length) return;
        idx = Math.min(Math.max(0, startIndex || 0), photos.length - 1);
        render();
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
    function next() { if (photos.length < 2) return; idx = (idx + 1) % photos.length; render(); }
    function prev() { if (photos.length < 2) return; idx = (idx - 1 + photos.length) % photos.length; render(); }

    closeBtn.addEventListener('click', close);
    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    box.addEventListener('click', function (e) { if (e.target === box) close(); });
    document.addEventListener('keydown', function (e) {
        if (box.classList.contains('hidden')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') next();
        else if (e.key === 'ArrowLeft') prev();
    });

    window.fvOpenLightbox = open;
})();
