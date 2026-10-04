/* FeelVoyage — fereastra de review pe o destinație (stele 1-5, text pozitiv/negativ/alte observații, poze),
   plus nota live afișată în fiecare pachet (recalculată automat din js/backend.js → onReviewStats).
   Fiecare destinație „pornește” cu o notă de bază de 5★ (vezi explicația din backend.js); nota afișată e
   media reală odată ce apar recenzii adevărate. */
(function () {
    'use strict';

    const modal = document.getElementById('reviewModal');
    const panel = document.getElementById('reviewModalContainer');
    const scroll = document.getElementById('reviewScroll');
    const closeBtn = document.getElementById('closeReviewBtn');
    const openBtn = document.getElementById('openReviewBtn');
    const needAccount = document.getElementById('reviewNeedAccount');
    const openAuthBtn = document.getElementById('reviewOpenAuthBtn');
    const form = document.getElementById('reviewForm');
    const destNameEl = document.getElementById('reviewDestName');
    const starPicker = document.getElementById('reviewStarPicker');
    const ratingInput = document.getElementById('reviewRatingInput');
    const nameDisplay = document.getElementById('reviewNameDisplay');
    const positiveEl = document.getElementById('reviewPositive');
    const negativeEl = document.getElementById('reviewNegative');
    const extraEl = document.getElementById('reviewExtra');
    const photosInput = document.getElementById('reviewPhotosInput');
    const photosPreview = document.getElementById('reviewPhotosPreview');
    const errorEl = document.getElementById('reviewFormError');
    const submitBtn = document.getElementById('reviewSubmitBtn');
    if (!modal || !openBtn) return;

    const t = (key, fb) => (typeof tr === 'function' ? tr(key, fb) : fb);
    let locked = false, reviewDestId = null, reviewDestTitle = '', photosData = [];   // poze deja comprimate (data URL), gata de trimis

    function open(destId, destTitle) {
        reviewDestId = destId;
        reviewDestTitle = destTitle;
        destNameEl.textContent = destTitle;
        resetForm();
        const session = typeof window.fvCurrentSession === 'function' ? window.fvCurrentSession() : null;
        const loggedIn = !!session;
        needAccount.classList.toggle('hidden', loggedIn);
        form.classList.toggle('hidden', !loggedIn);
        if (loggedIn) nameDisplay.value = session.name || session.email || '';
        modal.classList.remove('hidden');
        if (!locked && typeof lockScroll === 'function') { lockScroll(true); locked = true; }
        requestAnimationFrame(function () { panel.classList.remove('scale-95', 'opacity-0'); });
        if (scroll) scroll.scrollTop = 0;
    }
    function close() {
        panel.classList.add('scale-95', 'opacity-0');
        if (locked && typeof lockScroll === 'function') { lockScroll(false); locked = false; }
        setTimeout(function () { if (panel.classList.contains('opacity-0')) modal.classList.add('hidden'); }, 200);
    }
    function resetForm() {
        form.reset();
        setRating(0);
        photosData = [];
        photosPreview.innerHTML = '';
        errorEl.classList.add('hidden');
        submitBtn.disabled = false;
    }

    function setRating(n) {
        ratingInput.value = String(n);
        Array.from(starPicker.children).forEach(function (btn) {
            const on = Number(btn.getAttribute('data-star')) <= n;
            btn.classList.toggle('text-amber-500', on);
            btn.classList.toggle('text-slate-300', !on);
        });
    }
    starPicker.addEventListener('click', function (e) {
        const btn = e.target.closest('.review-star');
        if (btn) setRating(Number(btn.getAttribute('data-star')));
    });

    // Poze: redimensionate și comprimate în browser (canvas), ca să rămână mici — nu trimitem fișierul original
    function compressImage(file, maxW, quality) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = function () {
                URL.revokeObjectURL(url);
                const scale = Math.min(1, maxW / img.width);
                const w = Math.max(1, Math.round(img.width * scale));
                const h = Math.max(1, Math.round(img.height * scale));
                const canvas = document.createElement('canvas');
                canvas.width = w; canvas.height = h;
                canvas.getContext('2d').drawImage(img, 0, 0, w, h);
                resolve(canvas.toDataURL('image/jpeg', quality));
            };
            img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('bad-image')); };
            img.src = url;
        });
    }
    photosInput.addEventListener('change', async function () {
        const files = Array.from(photosInput.files || []).slice(0, 4 - photosData.length);
        for (const file of files) {
            if (photosData.length >= 4) break;
            try {
                const dataUrl = await compressImage(file, 900, 0.6);
                if (dataUrl.length > 340000) continue;   // tot prea mare (poză foarte încărcată vizual): sărim, fără eroare blocantă
                photosData.push(dataUrl);
                const wrap = document.createElement('div');
                wrap.className = 'relative w-16 h-16 rounded-lg overflow-hidden border border-slate-200';
                wrap.innerHTML = '<img src="' + dataUrl + '" class="w-full h-full object-cover">' +
                    '<button type="button" class="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-black/60 text-white text-[9px] flex items-center justify-center" aria-label="Șterge">✕</button>';
                wrap.querySelector('button').addEventListener('click', function () {
                    const idx = Array.from(photosPreview.children).indexOf(wrap);
                    if (idx > -1) photosData.splice(idx, 1);
                    wrap.remove();
                });
                photosPreview.appendChild(wrap);
            } catch (e) { /* poza nu s-a putut citi: o sărim */ }
        }
        photosInput.value = '';
    });

    closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.classList.contains('hidden')) close(); });
    openAuthBtn.addEventListener('click', function () { close(); if (typeof openAuthModal === 'function') openAuthModal(); });

    openBtn.addEventListener('click', function () {
        if (typeof currentBookingDest === 'undefined' || !currentBookingDest) return;
        const d = currentBookingDest;
        const title = (typeof getDestinationText === 'function') ? getDestinationText(d).title : d.title;
        open(d.id, title);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const rating = Number(ratingInput.value);
        if (!rating) {
            errorEl.textContent = t('review.errorRating', 'Alege o notă de la 1 la 5 stele.');
            errorEl.classList.remove('hidden');
            return;
        }
        errorEl.classList.add('hidden');
        submitBtn.disabled = true;
        window.FVBackend.submitReview(reviewDestId, reviewDestTitle, {
            rating: rating,
            positive: positiveEl.value.trim(),
            negative: negativeEl.value.trim(),
            extra: extraEl.value.trim(),
            photos: photosData,
            lang: (typeof currentLang !== 'undefined' && currentLang) || 'ro'
        }).then(function () {
            if (typeof fvToast === 'function') fvToast(t('review.thanks', 'Mulțumim pentru recenzie!'));
            close();
        }).catch(function () {
            errorEl.textContent = t('review.error', 'Nu am putut trimite recenzia. Încearcă din nou.');
            errorEl.classList.remove('hidden');
            submitBtn.disabled = false;
        });
    });

    /* ---------- nota live, afișată în fiecare pachet deschis ---------- */
    const starsEl = document.getElementById('modalReviewStars');
    const avgEl = document.getElementById('modalReviewAvg');
    const countEl = document.getElementById('modalReviewCount');
    let unsubStats = null;

    function renderStars(avg) {
        let html = '';
        for (let i = 1; i <= 5; i++) html += '<i class="fa-' + (avg >= i - 0.25 ? 'solid' : (avg >= i - 0.75 ? 'solid fa-star-half-stroke' : 'regular')) + ' fa-star"></i> ';
        return html;
    }
    function watchDestinationStats(destId) {
        if (unsubStats) { unsubStats(); unsubStats = null; }
        if (!destId || !window.FVBackend) return;
        unsubStats = window.FVBackend.onReviewStats(destId, function (stats) {
            if (starsEl) starsEl.innerHTML = renderStars(stats.avg);
            if (avgEl) avgEl.textContent = stats.avg.toFixed(1);
            if (countEl) countEl.textContent = stats.count > 0 ? ('(' + stats.count + ' ' + t('review.reviewsWord', 'recenzii') + ')') : t('review.noReviewsYet', '(fără recenzii încă)');
        });
    }
    // modalul pachetului expune currentBookingDest (js/app.js); urmărim schimbarea lui ascultând deschiderea ferestrei
    document.addEventListener('fv:package-open', function (e) {
        if (e && e.detail && e.detail.id) { watchDestinationStats(e.detail.id); watchDestinationReviews(e.detail.id); }
    });

    /* ---------- lista de recenzii a pachetului deschis (text + poze), aceeași sursă ca FeelVoyage Reviews ---------- */
    const reviewsListEl = document.getElementById('modalReviewsList');
    let unsubList = null;
    function escList(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function initialsOfList(name) {
        return String(name || 'FV').trim().split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase() || 'FV';
    }
    function reviewListItemHtml(r) {
        const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('ro-RO') : '';
        const text = (r.positive || r.extra || r.negative || '').trim();
        const photosHtml = (r.photos && r.photos.length) ? '<div class="flex gap-2 mt-2 flex-wrap">' + r.photos.map(function (p) { return '<img src="' + escList(p) + '" data-lightbox-src="' + escList(p) + '" class="w-14 h-14 rounded-lg object-cover border border-slate-200 cursor-zoom-in hover:opacity-80 transition" alt="">'; }).join('') + '</div>' : '';
        return '<div class="pb-4 border-b border-slate-100 last:border-0 last:pb-0">' +
            '<div class="flex items-start justify-between gap-3">' +
                '<div class="flex items-center gap-2.5 min-w-0">' +
                    '<div class="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-sunset-500 text-white flex items-center justify-center font-bold text-[11px] flex-shrink-0">' + escList(initialsOfList(r.name)) + '</div>' +
                    '<div class="min-w-0"><p class="font-bold text-xs text-slate-800 truncate">' + escList(r.name || 'Călător FeelVoyage') + '</p><p class="text-[10px] text-slate-400">' + escList(dateStr) + '</p></div>' +
                '</div>' +
                '<div class="text-amber-500 text-[11px] shrink-0">' + renderStars(r.rating) + '</div>' +
            '</div>' +
            (text ? '<p class="text-xs text-slate-600 leading-relaxed mt-2">' + escList(text) + '</p>' : '') +
            photosHtml +
        '</div>';
    }
    function watchDestinationReviews(destId) {
        if (!reviewsListEl) return;
        if (unsubList) { unsubList(); unsubList = null; }
        if (!destId || !window.FVBackend) return;
        reviewsListEl.innerHTML = '';
        unsubList = window.FVBackend.onDestinationReviews(destId, function (list) {
            reviewsListEl.innerHTML = list.length ? list.map(reviewListItemHtml).join('') : '';
        });
    }
    if (reviewsListEl) {
        reviewsListEl.addEventListener('click', function (e) {
            const pic = e.target.closest('[data-lightbox-src]');
            if (pic && typeof window.fvOpenLightbox === 'function') window.fvOpenLightbox(pic.getAttribute('data-lightbox-src'), '');
        });
    }

    /* ---------- secțiunea de pe prima pagină: cele mai bune 3 recenzii, în timp real ---------- */
    const topGrid = document.getElementById('topReviewsGrid');
    const topEmpty = document.getElementById('topReviewsEmpty');
    if (topGrid && window.FVBackend) {
        function initialsOf(name) {
            return String(name || 'FV').trim().split(/\s+/).filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase() || 'FV';
        }
        function starsHtml(n) {
            let html = '';
            for (let i = 1; i <= 5; i++) html += '<i class="fa-' + (i <= n ? 'solid' : 'regular') + ' fa-star"></i>';
            return html;
        }
        function escHtml(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
        function cardHtml(r) {
            const text = (r.positive || r.extra || r.negative || '').trim();
            return '<div class="bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col">' +
                '<div class="flex items-center gap-0.5 text-amber-500 text-sm mb-3">' + starsHtml(r.rating) + '</div>' +
                (text ? '<p class="text-slate-600 text-sm leading-relaxed flex-1 mb-4">\u201c' + escHtml(text.length > 180 ? text.slice(0, 180) + '…' : text) + '\u201d</p>' : '<div class="flex-1 mb-4"></div>') +
                '<div class="flex items-center gap-3 pt-3 border-t border-slate-100">' +
                    '<div class="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-600 to-sunset-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">' + escHtml(initialsOf(r.name)) + '</div>' +
                    '<div class="min-w-0"><p class="font-bold text-slate-800 text-sm truncate">' + escHtml(r.name || 'Călător FeelVoyage') + '</p><p class="text-slate-400 text-xs truncate">' + escHtml(r.destTitle || '') + '</p></div>' +
                '</div>' +
            '</div>';
        }
        window.FVBackend.onTopReviews(3, function (list) {
            if (!list || !list.length) {
                topGrid.innerHTML = '';
                topGrid.appendChild(topEmpty);
                return;
            }
            topGrid.innerHTML = list.map(cardHtml).join('');
        });
    }
})();
