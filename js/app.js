/* FeelVoyage — logica principală: filtre, rezervări, stocare locală, limbi */
// State Management
let currentFilter = 'all';
let searchQuery = '';
let maxBudget = 'all';

// DOM Elements
const destinationsGrid = document.getElementById('destinationsGrid');
const noResultsMsg = document.getElementById('noResultsMsg');
const filterBtns = document.querySelectorAll('.filter-btn');
const heroSearchForm = document.getElementById('heroSearchForm');
const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const budgetSelect = document.getElementById('budgetSelect');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

// Modal Elements
const bookingModal = document.getElementById('bookingModal');
const modalContainer = document.getElementById('modalContainer');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalBadge = document.getElementById('modalBadge');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalAmenities = document.getElementById('modalAmenities');
const modalGalleryThumbnails = document.getElementById('modalGalleryThumbnails');

// Unsplash permite alegerea lățimii imaginii: pe telefon descărcăm poze mai mici (mai puțini MB)
function imgSized(url, width) {
    if (!url) return url;
    // Wikimedia Commons: lățimea e în adresa miniaturii (…/960px-Nume.jpg); folosim doar lățimile standard acceptate de Wikimedia
    if (/^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(url)) {
        const steps = [250, 330, 500, 960, 1280];
        const w = steps.find(s => s >= width) || 1280;
        return url.replace(/\/\d+px-([^/]+)$/, '/' + w + 'px-$1');
    }
    return url.replace(/([?&])w=\d+/, '$1w=' + width);
}
// Pagina fișierului de pe Wikimedia Commons (cu autorul și licența), dedusă din adresa miniaturii; '' pentru alte surse
function commonsFilePage(url) {
    const m = /^https:\/\/(?:upload|thumb)\.wikimedia\.org\/wikipedia\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//.exec(url || '');
    return m ? 'https://commons.wikimedia.org/wiki/File:' + m[1] : '';
}

// Blochează derularea paginii cât timp o fereastră (modal) e deschisă; numără câte sunt deschise
let scrollLocks = 0;
function lockScroll(on) {
    scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
    document.body.classList.toggle('overflow-hidden', scrollLocks > 0);
}

// ----- Destinații
// Prima pagină arată doar cele 6 destinații marcate „featured: true” în js/destinations.js.
// Restul se deschid într-o fereastră (ca „Termeni și Condiții”), pe categorii, din butoanele de categorie sau din căutarea de sus.

// număr + „destinații” cu acordul corect în română („59 de destinații”, dar „11 destinații”); în celelalte limbi: textul tradus cu {n}
function nDest(key, roText, n) {
    if (typeof currentLang !== 'undefined' && currentLang !== 'ro') return tr(key, roText).replace('{n}', n);
    const de = (n % 100 === 0 || n % 100 >= 20) ? ' de' : '';
    return roText.replace('{n}', n + de);
}

// o destinație se potrivește dacă are categoria cerută (principală sau în extraCategories), textul căutat și se încadrează în buget
function destinationMatches(item, f) {
    const t = getDestinationText(item);
    const q = (f.query || '').trim().toLowerCase();
    const inCategory = f.filter === 'all' || item.category === f.filter || (Array.isArray(item.extraCategories) && item.extraCategories.includes(f.filter));
    const inText = !q || item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q) || t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
    const inBudget = f.budget === 'all' || item.price <= parseInt(f.budget);
    return inCategory && inText && inBudget;
}

// Cardul unei destinații: doar poza de copertă; celelalte poze stau într-un sertar care se trage de un mâner (doar pe ecrane late, ≥ 1024 px);
// pe ecrane mici insigna „N Foto” deschide direct galeria mare (nu se descarcă nimic în plus până nu o deschizi)
function buildCard(item) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-300 flex flex-col group transform hover:-translate-y-1';
    card.dataset.dest = item.id;
    const coverImg = item.images && item.images.length > 0 ? item.images[0] : '';
    const t = getDestinationText(item);
    card.innerHTML = `
                <div class="fv-cover relative h-48 sm:h-60 overflow-hidden">
                    <img src="${imgSized(coverImg, (window.FVPerf ? FVPerf.coverWidth() : 700))}" alt="${t.title}" loading="lazy" decoding="async" width="700" height="480" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                    
                    <span class="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-brand-900 font-extrabold text-xs shadow-md">
                        ${t.tagLabel || item.category}
                    </span>
                    
                    <div class="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-amber-400 text-slate-900 font-bold text-xs shadow flex items-center gap-1">
                        <i class="fa-solid fa-star text-slate-900 text-[10px]"></i> ${item.rating || '4.9'}
                    </div>

                    <div class="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white">
                        <span class="text-xs font-medium bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                            <i class="fa-regular fa-clock mr-1"></i> ${t.period}
                        </span>
                        <button type="button" class="fv-photos-pill text-xs bg-brand-600/90 px-2 py-0.5 rounded backdrop-blur-sm font-semibold" data-photos aria-label="${tr('card.seePhotos', 'Vezi toate pozele pachetului')}">
                            <i class="fa-solid fa-images mr-1"></i> ${tr('dest.fotoN', '{n} Foto').replace('{n}', (item.images || []).length)}
                        </button>
                    </div>

                    <div class="fv-drawer" data-drawer aria-hidden="true">
                        <button type="button" class="fv-pull" data-pull aria-expanded="false" aria-label="${tr('card.pullOpen', 'Deschide galeria foto')}" title="${tr('card.pullOpen', 'Deschide galeria foto')}">
                            <i class="fa-solid fa-chevron-left"></i><i class="fa-solid fa-images"></i>
                        </button>
                        <div class="fv-drawer-body">
                            <div class="fv-drawer-head">
                                <div class="fv-drawer-title">${tr('card.drawerTitle', '{n} poze').replace('{n}', (item.images || []).length)}</div>
                                <button type="button" class="fv-drawer-x" data-drawer-close aria-label="${tr('card.pullClose', 'Închide galeria foto')}" title="${tr('card.pullClose', 'Închide galeria foto')}"><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <div class="fv-drawer-grid" data-drawer-grid></div>
                        </div>
                    </div>
                </div>
                
                <div class="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                        <h3 class="text-xl font-bold font-serif text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">${t.title}</h3>
                        <p class="text-slate-600 text-xs line-clamp-3 mb-4 leading-relaxed">${t.description}</p>
                        
                        <div class="flex flex-wrap gap-1.5 mb-6">
                            ${t.amenities.slice(0, 3).map(a => `<span class="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2.5 py-1 rounded-md border border-slate-200/60"><i class="fa-solid fa-check text-brand-500 mr-1"></i>${a}</span>`).join('')}
                        </div>
                    </div>

                    <div class="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                            <span class="text-[10px] uppercase text-slate-400 font-bold block">${tr('dest.deLa', 'De la')}</span>
                            <span class="text-2xl font-black text-brand-900">${item.price} ${item.currency}</span><span class="text-xs font-bold text-slate-400 ml-1">/ ${tr('dest.perPerson', 'pers.')}</span>
                            ${item.priceRon ? `<span class="text-[11px] text-slate-400 font-medium block -mt-1">approx. ${item.priceRon}</span>` : ''}
                        </div>
                        <button onclick="openModal('${item.id}')" class="dest-btn px-5 py-3 sm:py-2.5 rounded-xl bg-slate-900 group-hover:bg-brand-600 text-white font-bold text-xs shadow transition-all flex items-center gap-1.5">
                            ${tr('dest.detaliiBtn', 'Detalii Pachet')} <i class="fa-solid fa-arrow-right text-[10px]"></i>
                        </button>
                    </div>
                </div>
            `;
    initCardGallery(card, item);
    return card;
}

// Mânerul din dreapta pozei: click sau tragere spre stânga deschide sertarul cu miniaturi; miniaturile se creează abia la prima deschidere
function initCardGallery(card, item) {
    const pill = card.querySelector('[data-photos]');
    if (pill) pill.addEventListener('click', () => { if (window.FVLog) FVLog.info('card', 'photos', { id: item.id }); openModal(item.id, 0); });
    const drawer = card.querySelector('[data-drawer]'), tab = card.querySelector('[data-pull]'), grid = card.querySelector('[data-drawer-grid]');
    if (!drawer || !tab || !grid) return;
    let open = false, built = false;
    function build() {
        if (built) return;
        built = true;
        (item.images || []).forEach((url, i) => {
            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', tr('card.openPhoto', 'Deschide poza {n}').replace('{n}', i + 1));
            const im = document.createElement('img');
            im.src = imgSized(url, 250); im.alt = ''; im.loading = 'lazy'; im.decoding = 'async';
            im.addEventListener('error', () => { if (isCommonsUrl(url)) { b.remove(); if (window.FVLog) FVLog.warn('media', 'thumb.fail', { id: item.id, n: i + 1 }); } });   // poză care nu se încarcă: dispare și din sertar
            b.appendChild(im);
            b.addEventListener('click', () => openModal(item.id, i));
            grid.appendChild(b);
        });
    }
    function setOpen(v) {
        if (v && !open && window.FVLog) FVLog.info('card', 'drawer', { id: item.id });
        open = v;
        if (v) build();
        drawer.classList.toggle('is-open', v);
        drawer.style.transform = '';
        drawer.setAttribute('aria-hidden', v ? 'false' : 'true');
        tab.setAttribute('aria-expanded', v ? 'true' : 'false');
        const label = tr(v ? 'card.pullClose' : 'card.pullOpen', v ? 'Închide galeria foto' : 'Deschide galeria foto');
        tab.setAttribute('aria-label', label); tab.title = label;
    }
    let startX = 0, startOpen = false, moved = false, dragging = false, width = 0;
    tab.addEventListener('pointerdown', (e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        dragging = true; moved = false; startX = e.clientX; startOpen = open; width = drawer.offsetWidth;
        build();
        try { tab.setPointerCapture(e.pointerId); } catch (err) { }
        drawer.classList.add('is-dragging');
    });
    tab.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        const dx = e.clientX - startX;
        if (Math.abs(dx) > 4) moved = true;
        if (!moved) return;
        const x = Math.min(width, Math.max(0, (startOpen ? 0 : width) + dx));
        drawer.style.transform = `translateX(${x}px)`;
    });
    function endDrag(e, cancelled) {
        if (!dragging) return;
        dragging = false;
        drawer.classList.remove('is-dragging');
        const dx = e.clientX - startX;
        if (cancelled) setOpen(startOpen);
        else if (!moved) setOpen(!startOpen);                                  // simplu click pe mâner
        else setOpen(startOpen ? !(dx > 40) : dx < -40);                       // tragere: peste 40 px într-o parte
    }
    tab.addEventListener('pointerup', (e) => endDrag(e, false));
    tab.addEventListener('pointercancel', (e) => endDrag(e, true));
    tab.addEventListener('click', (e) => { if (e.detail === 0) setOpen(!open); });   // tastatură (Enter / Space)
    drawer.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && open) { e.stopPropagation(); setOpen(false); tab.focus(); }
    });
    const xBtn = drawer.querySelector('[data-drawer-close]');
    if (xBtn) xBtn.addEventListener('click', () => { setOpen(false); tab.focus(); });   // buton X vizibil: nu toată lumea știe că mânerul se apasă din nou
}

// Prima pagină: doar destinațiile „featured” + butonul „Vezi toate”
function renderDestinations() {
    // numărul de destinații din pagină (statisticile din prima pagină și „Despre noi”) vine din listă
    document.querySelectorAll('[data-dest-count]').forEach(el => { el.textContent = String(destinations.length); });
    destinationsGrid.innerHTML = '';
    noResultsMsg.classList.add('hidden');
    destinations.filter(d => d.featured).forEach(item => destinationsGrid.appendChild(buildCard(item)));
    const label = document.getElementById('viewAllLabel');
    if (label) label.textContent = nDest('catwin.viewAll', 'Vezi toate cele {n} destinații', destinations.length);
    refreshCatalog();   // dacă fereastra cu destinații e deschisă, își reface cardurile în limba curentă
}

// ----- Fereastra cu destinații (pe categorii / rezultatele căutării)
const catState = { filter: 'all', query: '', budget: 'all', results: false };
const catModalEl = document.getElementById('catModal');
let catRenderToken = 0;
// Cardurile apar în loturi: primul lot (un ecran) imediat, restul câte un lot pe cadru — pe un telefon slab fereastra se deschide fără să înghețe,
// iar dacă alegi altă categorie în timpul randării, lotul vechi se oprește (token)
function renderCatalog() {
    const grid = document.getElementById('catGrid');
    if (!grid) return;
    const items = destinations.filter(d => destinationMatches(d, catState));
    const token = ++catRenderToken;
    const size = (window.FVPerf && FVPerf.chunk()) || 8;
    const done = window.FVLog ? FVLog.time('catalog', 'render', 400) : null;
    grid.innerHTML = '';
    delete grid.dataset.ready;
    let i = 0;
    function step() {
        if (token !== catRenderToken) return;
        const frag = document.createDocumentFragment();
        for (let k = 0; k < size && i < items.length; k++, i++) {
            const card = buildCard(items[i]);
            card.style.setProperty('--i', k);
            frag.appendChild(card);
        }
        grid.appendChild(frag);
        if (i < items.length) {
            if (document.hidden) setTimeout(step, 30); else requestAnimationFrame(step);
        } else {
            grid.dataset.ready = '1';
            if (done) done({ n: items.length, chunk: size, filter: catState.filter });
        }
    }
    step();
    const btn = document.querySelector('.filter-btn[data-filter="' + catState.filter + '"] span');
    document.getElementById('catModalTitle').textContent = catState.results ? tr('catwin.results', 'Rezultatele căutării') : (btn ? btn.textContent.trim() : '');
    document.getElementById('catModalCount').textContent = items.length === 1 ? tr('catwin.count1', '1 destinație') : nDest('catwin.count', '{n} destinații', items.length);
    const note = document.getElementById('catModalNote');
    const hasBudget = catState.budget !== 'all';
    note.classList.toggle('hidden', !hasBudget);
    note.textContent = hasBudget ? tr('catwin.budget', 'Buget maxim: {b} €').replace('{b}', catState.budget) : '';
    document.getElementById('catEmpty').classList.toggle('hidden', items.length > 0);
    grid.classList.toggle('hidden', items.length === 0);
    document.getElementById('catShowAll').textContent = nDest('catwin.viewAll', 'Vezi toate cele {n} destinații', destinations.length);
    return items.length;
}
function refreshCatalog() {
    if (catModalEl && !catModalEl.classList.contains('hidden')) renderCatalog();
}
function openCatalog(filter, opts) {
    opts = opts || {};
    catState.filter = filter || 'all';
    catState.query = opts.query || '';
    catState.budget = opts.budget || 'all';
    catState.results = !!opts.results;
    const s = document.getElementById('catSearch');
    if (s) s.value = catState.query;
    const n = renderCatalog();
    if (window.FVLog) FVLog.info('catalog', 'open', { filter: catState.filter, results: catState.results, n: n, qLen: (catState.query || '').trim().length, budget: catState.budget !== 'all' });
    if (window.fvCatModal) {
        window.fvCatModal.open(false);
        window.fvCatModal.scroller.scrollTop = 0;   // deja deschisă și s-a schimbat lista: revenim sus
    }
}
window.openCatalog = openCatalog;
(function initCatalog() {
    const s = document.getElementById('catSearch');
    let timer = null;
    if (s) s.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => { catState.query = s.value; const n = renderCatalog(); if (window.FVLog) FVLog.info('catalog', 'search', { filter: catState.filter, qLen: s.value.trim().length, n: n }); }, 120);
    });
    const showAll = document.getElementById('catShowAll');
    if (showAll) showAll.addEventListener('click', () => {
        catState.filter = 'all'; catState.query = ''; catState.budget = 'all'; catState.results = false;
        if (s) s.value = '';
        renderCatalog();
    });
    const viewAll = document.getElementById('viewAllBtn');
    if (viewAll) viewAll.addEventListener('click', () => openCatalog('all'));
})();

// Butoanele de categorie deschid fereastra cu destinațiile categoriei
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => openCatalog(btn.getAttribute('data-filter')));
});

function filterCategory(cat) {
    openCatalog(cat);
}

// Căutarea de sus: deschide fereastra cu rezultatele (din toate destinațiile)
heroSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = searchInput.value;
    currentFilter = categorySelect.value;
    maxBudget = budgetSelect.value;
    const custom = searchQuery.trim() !== '' || maxBudget !== 'all';
    if (window.FVLog) FVLog.info('search', 'submit', { filter: currentFilter, qLen: searchQuery.trim().length, budget: maxBudget, n: destinations.filter(d => destinationMatches(d, { filter: currentFilter, query: searchQuery, budget: maxBudget })).length });
    openCatalog(currentFilter, { query: searchQuery, budget: maxBudget, results: custom });
});

document.getElementById('resetFiltersBtn').addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = 'all';
    budgetSelect.value = 'all';
    searchQuery = '';
    currentFilter = 'all';
    maxBudget = 'all';
    renderDestinations();
});

// Mobile Menu Toggle
function setMobileMenu(open) {
    mobileMenu.classList.toggle('hidden', !open);
    mobileMenuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    const icon = mobileMenuBtn.querySelector('i');
    if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars-staggered';
}
window.closeMobileMenu = () => setMobileMenu(false);
mobileMenuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setMobileMenu(mobileMenu.classList.contains('hidden'));
});
document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => setMobileMenu(false));
});
// Se închide la click în afara lui și când ecranul devine suficient de lat pentru meniul complet
document.addEventListener('click', (e) => {
    if (!mobileMenu.classList.contains('hidden') && !mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) setMobileMenu(false);
});
if (window.matchMedia) {
    const wide = window.matchMedia('(min-width: 1024px)');
    const onWide = (e) => { if (e.matches) setMobileMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide); else if (wide.addListener) wide.addListener(onWide);
}

// ----- galeria fotografiilor din fereastra pachetului
let galleryImages = [];
let galleryIndex = 0;
let galleryTitle = '';
// pozele de pe Commons se cer la lățimea standard de 960 px; celelalte rămân cum sunt
function mainPhotoUrl(url) { return /wikimedia\.org\//.test(url || '') ? imgSized(url, 960) : url; }
function showPhoto(i) {
    const n = galleryImages.length;
    if (!n) return;
    galleryIndex = ((i % n) + n) % n;
    const url = galleryImages[galleryIndex];
    modalImg.dataset.url = url;   // adresa din listă (pentru a scoate poza dacă nu se încarcă)
    modalImg.src = mainPhotoUrl(url);
    if (!window.FVPerf || FVPerf.motionOn()) { modalImg.classList.remove('fv-swap'); void modalImg.offsetWidth; modalImg.classList.add('fv-swap'); }   // fade scurt la schimbarea pozei
    modalImg.alt = `${galleryTitle} foto ${galleryIndex + 1}`;
    const thumbs = modalGalleryThumbnails.querySelectorAll('img');
    thumbs.forEach((th, k) => {
        th.classList.toggle('thumb-active', k === galleryIndex);
        th.classList.toggle('border-slate-700', k !== galleryIndex);
    });
    const active = thumbs[galleryIndex];
    if (active && modalGalleryThumbnails.scrollTo) {
        const left = active.offsetLeft - modalGalleryThumbnails.offsetLeft - (modalGalleryThumbnails.clientWidth - active.offsetWidth) / 2;
        modalGalleryThumbnails.scrollTo({ left: Math.max(0, left), behavior: 'smooth' });
    }
    const prev = document.getElementById('modalPrev'), next = document.getElementById('modalNext'), count = document.getElementById('modalPhotoCount');
    if (prev) prev.hidden = n < 2;
    if (next) next.hidden = n < 2;
    if (count) count.textContent = n > 1 ? `${galleryIndex + 1} / ${n}` : '';
    // sursa poze: pagina fișierului de pe Commons (autor + licență)
    const page = commonsFilePage(url), credit = document.getElementById('modalPhotoCredit'), link = document.getElementById('modalPhotoLink');
    if (credit) credit.classList.toggle('hidden', !page);
    if (link && page) link.href = page;
    // încarcă din timp pozele vecine
    if (n > 1) [galleryIndex + 1, galleryIndex - 1].forEach(k => { const u = galleryImages[((k % n) + n) % n]; if (u) { const im = new Image(); im.src = mainPhotoUrl(u); } });
}
// O poză de pe Commons care nu se încarcă (fișier redenumit sau șters) se scoate din galerie, ca vizitatorul să nu vadă un chenar gol
function isCommonsUrl(url) { return /^https:\/\/(upload|thumb)\.wikimedia\.org\//.test(url || ''); }
function dropPhoto(url) {
    const i = galleryImages.indexOf(url);
    if (i < 0 || galleryImages.length < 2 || !isCommonsUrl(url)) return;
    galleryImages.splice(i, 1);
    if (window.FVLog) FVLog.warn('media', 'photo.dropped', { file: decodeURIComponent((url.split('/').slice(-2)[0] || '')).slice(0, 80), left: galleryImages.length });
    const th = modalGalleryThumbnails.querySelectorAll('img')[i];
    if (th) th.remove();
    // rămânem pe aceeași poză (sau pe următoarea, dacă tocmai a dispărut cea afișată)
    showPhoto(galleryIndex > i ? galleryIndex - 1 : galleryIndex);
}
(function initGalleryControls() {
    const prev = document.getElementById('modalPrev'), next = document.getElementById('modalNext');
    modalImg.addEventListener('error', () => { const u = modalImg.dataset.url; if (u) dropPhoto(u); });
    if (prev) prev.addEventListener('click', () => showPhoto(galleryIndex - 1));
    if (next) next.addEventListener('click', () => showPhoto(galleryIndex + 1));
    // glisare pe telefon
    let touchX = null;
    modalImg.addEventListener('touchstart', (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
    modalImg.addEventListener('touchend', (e) => {
        if (touchX === null) return;
        const dx = e.changedTouches[0].clientX - touchX; touchX = null;
        if (Math.abs(dx) > 40) showPhoto(galleryIndex + (dx < 0 ? 1 : -1));
    }, { passive: true });
    // săgeți de la tastatură (nu când scrii într-un câmp sau când calendarul e deschis)
    document.addEventListener('keydown', (e) => {
        if (bookingModal.classList.contains('hidden') || galleryImages.length < 2) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        const el = e.target;
        if (el && (/^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName) || el.isContentEditable || (el.closest && el.closest('[role="grid"]')))) return;
        if (bookingRange && bookingRange.isOpen && bookingRange.isOpen()) return;
        showPhoto(galleryIndex + (e.key === 'ArrowRight' ? 1 : -1));
        e.preventDefault();
    });
})();

// ----- Galeria foto: pe calculator (≥ 1024 px) stă într-o fereastră SEPARATĂ, în dreapta pachetului, mai mare și cu buton X propriu;
// pe ecrane mici rămâne în fereastra pachetului, deasupra descrierii. Aceleași elemente (#modalImg, miniaturi, săgeți) se mută între cele două locuri.
const bkWrap = document.getElementById('bookingWrap');
const galleryPanel = document.getElementById('galleryPanel');
const gpBody = document.getElementById('gpBody');
const modalHeader = document.getElementById('modalHeader');
const modalHead = document.getElementById('modalHead');
const bkGalleryBtn = document.getElementById('bkGalleryBtn');
const desktopMQ = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : { matches: false };
let galleryVisible = true;   // alegerea vizitatorului pe calculator: galeria deschisă (implicit) sau închisă cu X
function isDesktopGallery() { return !!desktopMQ.matches; }
function galleryBtnLabel() { return tr('modal.galleryOpen', 'Galerie foto ({n})').replace('{n}', galleryImages.length); }
function applyGalleryState() {
    const desk = isDesktopGallery();
    const show = desk && galleryVisible;
    galleryPanel.hidden = !show;
    bkWrap.classList.toggle('with-gallery', show);
    if (bkGalleryBtn) {
        bkGalleryBtn.hidden = !desk || show;
        const l = document.getElementById('bkGalleryBtnLabel'); if (l) l.textContent = galleryBtnLabel();
    }
}
function placeGallery() {
    if (isDesktopGallery()) {
        if (modalHeader.parentElement !== gpBody) gpBody.appendChild(modalHeader);
        if (closeModalBtn.parentElement !== modalHead) modalHead.appendChild(closeModalBtn);     // X-ul pachetului în antetul lui
    } else {
        if (modalHeader.parentElement !== modalContainer) modalContainer.insertBefore(modalHeader, modalHead.nextSibling);
        const stage = modalHeader.querySelector('.modal-stage');
        if (stage && closeModalBtn.parentElement !== stage) stage.appendChild(closeModalBtn);   // pe telefon X-ul stă pe poză
    }
    applyGalleryState();
}
function setGalleryVisible(v) {
    galleryVisible = !!v;
    const hadFocus = galleryPanel.contains(document.activeElement);
    applyGalleryState();
    if (!v && hadFocus && bkGalleryBtn && !bkGalleryBtn.hidden) bkGalleryBtn.focus();
    if (window.FVLog) FVLog.info('gallery', v ? 'show' : 'hide');
}
document.getElementById('galleryCloseBtn').addEventListener('click', () => setGalleryVisible(false));
if (bkGalleryBtn) bkGalleryBtn.addEventListener('click', () => { setGalleryVisible(true); const nx = document.getElementById('modalNext'); if (nx && !nx.hidden) nx.focus({ preventScroll: true }); });
if (desktopMQ.addEventListener) desktopMQ.addEventListener('change', () => { if (!bookingModal.classList.contains('hidden')) placeGallery(); });
document.addEventListener('keydown', (e) => {
    // Escape în fereastra galeriei o închide doar pe ea; pachetul rămâne deschis
    if (e.key !== 'Escape' || bookingModal.classList.contains('hidden') || galleryPanel.hidden || !galleryPanel.contains(document.activeElement)) return;
    e.preventDefault(); e.stopPropagation(); setGalleryVisible(false);
});

// Open Modal Function with Multi-Image Support & Dynamic Gallery
let currentBookingDest = null;   // destinația pentru care e deschisă fereastra de rezervare
function openModal(id, photoIndex) {
    const item = destinations.find(d => d.id === id);
    if (!item) { if (window.FVLog) FVLog.warn('package', 'unknown', { id: String(id).slice(0, 40) }); return; }
    if (window.FVLog) FVLog.info('package', 'open', { id: id, photo: Number.isInteger(photoIndex) ? photoIndex : 0 });
    currentBookingDest = item;
    document.getElementById('bookingGateError').classList.add('hidden');   // pachet nou deschis: ascundem eroarea de la o încercare anterioară de trimitere
    refreshBookingConsent();
    if (Number.isInteger(photoIndex)) galleryVisible = true;   // ai apăsat pe o poză (sertar / insignă): galeria se deschide chiar dacă o închisese

    const t = getDestinationText(item);

    // Set main details
    modalTitle.innerText = t.title;
    modalBadge.innerText = t.tagLabel || item.category;
    modalPrice.innerText = `${item.price} ${item.currency} (${item.priceRon || ''})`;
    modalDesc.innerText = t.description;
    // antetul pentru calculator (același conținut ca pe poza de pe telefon)
    document.getElementById('bkTitle').textContent = t.title;
    document.getElementById('bkBadge').textContent = t.tagLabel || item.category;
    document.getElementById('bkPrice').textContent = modalPrice.innerText;

    // Galeria: imaginea principală, săgeți, contor, miniaturi derulabile și sursa pozei (11–15 poze la fiecare pachet)
    galleryImages = item.images.slice();
    galleryTitle = t.title;
    modalGalleryThumbnails.innerHTML = '';
    galleryImages.forEach((imgUrl, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSized(imgUrl, 250);
        thumb.alt = `${t.title} foto ${index + 1}`;
        thumb.loading = 'lazy';
        thumb.decoding = 'async';
        thumb.className = `w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all opacity-70 hover:opacity-100 ${index === 0 ? 'thumb-active' : 'border-slate-700'}`;
        // poziția se citește la click (după ce unele poze pot fi scoase din listă)
        thumb.addEventListener('click', () => showPhoto(Array.prototype.indexOf.call(modalGalleryThumbnails.children, thumb)));
        thumb.addEventListener('error', () => dropPhoto(imgUrl));
        modalGalleryThumbnails.appendChild(thumb);
    });
    placeGallery();   // pe calculator: galeria în fereastra din dreapta; pe telefon: în fereastra pachetului
    showPhoto(Number.isInteger(photoIndex) && photoIndex > 0 && photoIndex < galleryImages.length ? photoIndex : 0);   // din sertarul cardului se poate deschide direct la o anumită poză

    // Render Amenities
    modalAmenities.innerHTML = t.amenities.map(a => `
        <span class="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-lg border border-brand-200/60 flex items-center gap-1.5">
            <i class="fa-solid fa-star text-amber-500 text-[10px]"></i> ${a}
        </span>
    `).join('');

    initBookingPricing(item);

    // dacă fereastra a fost închisă cu câteva zeci de milisecunde înainte, anulăm ascunderea întârziată (și reblocăm derularea)
    if (bookingModal.classList.contains('hidden') || modalCloseTimer) lockScroll(true);
    clearTimeout(modalCloseTimer); modalCloseTimer = null;
    if (bookingModal.classList.contains('hidden')) {
        // focusul pleacă din pagină / din lista de destinații în fereastra pachetului; lista din spate devine inertă (nici tastatura, nici cititorul de ecran nu o ating)
        bookingReturnFocus = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
        if (catModalEl && !catModalEl.classList.contains('hidden')) { catModalEl.inert = true; catInertByBooking = true; }
    }
    bookingModal.classList.remove('hidden');
    requestAnimationFrame(() => { try { closeModalBtn.focus({ preventScroll: true }); } catch (e) { closeModalBtn.focus(); } });
    setTimeout(() => {
        modalContainer.classList.remove('scale-95', 'opacity-0');
        modalContainer.classList.add('scale-100', 'opacity-100');
    }, 10);
}

let modalCloseTimer = null;
let bookingReturnFocus = null, catInertByBooking = false;
// Tab rămâne în fereastra pachetului (de la ultimul element revine la primul și invers)
bookingModal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const f = Array.prototype.filter.call(bookingModal.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'), el => el.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});
function closeModal() {
    if (bookingModal.classList.contains('hidden') || modalCloseTimer) return;
    if (bookingRange) bookingRange.close();
    lockScroll(false);
    if (catInertByBooking && catModalEl) { catModalEl.inert = false; catInertByBooking = false; }   // lista de destinații din spate redevine activă
    modalContainer.classList.remove('scale-100', 'opacity-100');
    modalContainer.classList.add('scale-95', 'opacity-0');
    modalCloseTimer = setTimeout(() => {
        modalCloseTimer = null;
        bookingModal.classList.add('hidden');
        const back = bookingReturnFocus; bookingReturnFocus = null;
        if (back && document.contains(back) && back.offsetParent !== null) { try { back.focus({ preventScroll: true }); } catch (err) { } }
    }, 200);
}

closeModalBtn.addEventListener('click', closeModal);
bookingModal.addEventListener('click', (e) => {
    if (e.target === bookingModal) closeModal();
});

// Live-clear validation errors as user types/corrects
document.addEventListener('input', (e) => {
    if (e.target.id === 'bookingEmail') {
        e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
        document.getElementById('bookingEmailError').classList.add('hidden');
    }
    if (e.target.id === 'bookingDate') {
        e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
    }
    if (e.target.id === 'bookingName') {
        e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
        document.getElementById('bookingNameError').classList.add('hidden');
    }
    if (e.target.id === 'bookingPhone') {
        e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
        document.getElementById('bookingPhoneError').classList.add('hidden');
    }
});

// ============ CALCULATORUL DE PREȚ AL REZERVĂRII (regulile sunt în js/pricing.js) ============
const bookingState = { adults: 2, kids04: 0, kids512: 0 };
let bookingRange = null;   // selectorul de interval de date (js/daterange.js)
const EXTRA_LABEL_KEYS = { transport: 'modal.serviceTransport', cazare: 'modal.serviceCazare', transfer: 'modal.serviceTransfer', meals: 'modal.serviceMeals', tickets: 'modal.serviceTickets', insurance: 'modal.serviceInsurance', guide: 'modal.serviceGuide', car: 'modal.serviceCar' };
const EXTRA_LABELS_RO = { transport: 'Transport (zbor/autocar)', cazare: 'Cazare hotel', transfer: 'Transfer aeroport-hotel', meals: 'Demipensiune / Mic dejun', tickets: 'Bilete la atracții', insurance: 'Asigurare de călătorie', guide: 'Ghid local', car: 'Închiriere auto' };
const LOCALES = { ro: 'ro-RO', en: 'en-GB', it: 'it-IT', fr: 'fr-FR', es: 'es-ES' };

function fmtTpl(str, vars) { return String(str).replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m)); }
function priceEUR(n) { return FVPricing.fmtEUR(n); }
function monthName(m, lang) { return new Date(2026, m - 1, 1).toLocaleString(LOCALES[lang] || 'ro-RO', { month: 'long' }); }
function selectedServiceKeys() { return Array.from(document.querySelectorAll('input[name="booking-service"]:checked')).map(i => i.value); }

// Intervalul ales de client (plecare, întoarcere) și numărul de nopți dintre ele
function currentRange() {
    return bookingRange ? bookingRange.getRange() : { start: '', end: '', nights: null };
}
function currentNights() {
    const n = currentRange().nights;
    return n ? n : undefined;   // fără interval ales: durata standard a pachetului
}

function currentQuote() {
    if (!currentBookingDest || !window.FVPricing) return null;
    const range = currentRange();
    return FVPricing.quote(currentBookingDest, {
        adults: bookingState.adults, kids04: bookingState.kids04, kids512: bookingState.kids512,
        extras: selectedServiceKeys(), date: range.start, nights: currentNights()
    });
}

// Textul unei linii din estimare. localized=false => mereu în română (pentru comanda trimisă în Firebase, pe care o citești tu)
function quoteLineText(l, localized) {
    const t = localized ? tr : (k, fb) => fb;
    const lang = localized ? currentLang : 'ro';
    const name = (key) => t(EXTRA_LABEL_KEYS[key], EXTRA_LABELS_RO[key]);
    switch (l.type) {
        case 'adults': return fmtTpl(t('quote.adultsLine', '{n} × adult ({unit})'), { n: l.count, unit: priceEUR(l.unit) });
        case 'kids04': return fmtTpl(t('quote.kids04Line', '{n} × copil 0–4 ani ({pct}% din preț)'), { n: l.count, pct: l.pct });
        case 'kids512': return fmtTpl(t('quote.kids512Line', '{n} × copil 5–12 ani ({pct}% din preț)'), { n: l.count, pct: l.pct });
        case 'single': return fmtTpl(t('quote.singleLine', 'Supliment cameră single ({perNight} × {nights} nopți)'), { perNight: priceEUR(l.perNight), nights: l.nights });
        case 'season': return fmtTpl(t('quote.seasonLine', 'Supliment de sezon: {month} (+{pct}%)'), { month: monthName(l.month, lang), pct: l.pct });
        case 'extra':
            if (l.per === 'group') return fmtTpl(t('quote.groupLine', '{name} (per grup)'), { name: name(l.key) });
            if (l.per === 'car') return fmtTpl(t('quote.carLine', '{name} ({cars} × {days} zile × {unit})'), { name: name(l.key), cars: l.cars, days: l.days, unit: priceEUR(l.unit) });
            return `${name(l.key)} (${l.count} × ${priceEUR(l.unit)})`;
    }
    return '';
}

// Servicii: incluse în pachet (bifate, blocate) / opționale (cu preț) / indisponibile
function refreshExtraChips(item) {
    FVPricing.extrasFor(item, currentNights()).forEach(ex => {
        const label = document.querySelector(`#modalBookingForm [data-extra="${ex.key}"]`);
        if (!label) return;
        const chip = label.querySelector('[data-extra-chip]');
        let text = '', color = 'text-slate-400';
        if (ex.status === 'included') { text = tr('modal.included', 'Inclus'); color = 'text-emerald-600'; }
        else if (ex.status === 'unavailable') { text = tr('modal.unavailable', 'Indisponibil'); }
        else {
            const unit = ex.unit === 'group' ? tr('modal.unitGroup', '/ grup') : ex.unit === 'car' ? tr('modal.unitDay', '/ zi') : tr('modal.unitPerson', '/ pers.');
            text = `+ ${priceEUR(ex.price)} ${unit}`; color = 'text-slate-500';
        }
        chip.textContent = text;
        chip.className = 'ml-auto pl-1 text-[10px] font-bold whitespace-nowrap ' + color;
    });
}
function initBookingExtras(item) {
    FVPricing.extrasFor(item, currentNights()).forEach(ex => {
        const label = document.querySelector(`#modalBookingForm [data-extra="${ex.key}"]`);
        if (!label) return;
        const input = label.querySelector('input');
        input.checked = ex.status === 'included';
        input.disabled = ex.status !== 'optional';
        label.classList.toggle('opacity-60', ex.status === 'unavailable');
        label.classList.toggle('cursor-not-allowed', ex.status !== 'optional');
        label.classList.toggle('cursor-pointer', ex.status === 'optional');
    });
    refreshExtraChips(item);
}

function renderSteppers() {
    document.querySelectorAll('#modalBookingForm [data-stepper]').forEach(el => {
        const key = el.dataset.stepper;
        const min = key === 'adults' ? 1 : 0;
        const max = key === 'adults' ? FVPricing.MAX_ADULTS : FVPricing.MAX_KIDS;
        el.querySelector('[data-stepper-value]').textContent = bookingState[key];
        const [minus, plus] = el.querySelectorAll('[data-step]');
        minus.disabled = bookingState[key] <= min;
        plus.disabled = bookingState[key] >= max;
    });
}

function renderBookingQuote() {
    const q = currentQuote();
    if (!q) return;
    renderSteppers();
    refreshExtraChips(currentBookingDest);   // prețurile serviciilor depind de numărul de nopți
    // antetul ferestrei: prețul mediu pe persoană, actualizat live
    modalPrice.innerText = `${priceEUR(q.perPerson)} (${FVPricing.fmtRON(FVPricing.toRON(q.perPerson))})`;
    document.getElementById('quoteLines').innerHTML = q.lines.map(l =>
        `<li class="flex items-start justify-between gap-3"><span class="min-w-0">${quoteLineText(l, true)}</span><span class="font-bold text-slate-800 whitespace-nowrap">${priceEUR(l.amount)}</span></li>`
    ).join('');
    document.getElementById('quoteTotal').textContent = priceEUR(q.total);
    document.getElementById('quoteRon').textContent = `≈ ${FVPricing.fmtRON(q.ron)}`;
    document.getElementById('quotePerPerson').textContent = `${priceEUR(q.perPerson)} · ${q.travelers} ${q.travelers === 1 ? tr('quote.person', 'persoană') : tr('quote.persons', 'persoane')}`;
    document.getElementById('quoteNights').textContent = `${q.nights} ${tr('quote.nightsWord', 'nopți')}`;
    const range = currentRange();
    const rangeEl = document.getElementById('quoteRange');
    rangeEl.textContent = range.start && range.end ? `${FVDateRange.fmt(range.start)} – ${FVDateRange.fmt(range.end)}` : '';
    rangeEl.classList.toggle('hidden', !(range.start && range.end));
    const notes = [];
    if (q.season.month === 0) notes.push(tr('quote.noteDate', 'Prețul „de la" este pentru sezonul redus. Alege data plecării ca să vezi prețul exact al sezonului.'));
    else if (!q.season.applied) notes.push(tr('quote.noteLow', 'Data aleasă este în sezon redus: se aplică prețul de bază.'));
    if (q.nightsAdjusted) notes.push(fmtTpl(tr('quote.noteDuration', 'Prețul este ajustat la durata aleasă (pachetul standard are {std} nopți).'), { std: q.packageNights }));
    document.getElementById('quoteNote').textContent = notes.join(' ');
}

function initBookingPricing(item) {
    bookingState.adults = 2; bookingState.kids04 = 0; bookingState.kids512 = 0;
    if (bookingRange) {   // durata și limitele pachetului; datele se aleg din nou pentru fiecare pachet
        const pr = FVPricing.profile(item);
        bookingRange.configure({ defaultNights: pr.nights, minNights: pr.minNights, maxNights: pr.maxNights, fixed: pr.nightsFixed });
        bookingRange.reset(true);
        bookingRange.refresh();
    }
    initBookingExtras(item);
    renderBookingQuote();
}

document.querySelectorAll('#modalBookingForm [data-stepper] [data-step]').forEach(btn => {
    btn.addEventListener('click', () => {
        const key = btn.closest('[data-stepper]').dataset.stepper;
        const min = key === 'adults' ? 1 : 0;
        const max = key === 'adults' ? FVPricing.MAX_ADULTS : FVPricing.MAX_KIDS;
        bookingState[key] = Math.min(max, Math.max(min, bookingState[key] + parseInt(btn.dataset.step, 10)));
        renderBookingQuote();
    });
});
document.getElementById('modalBookingForm').addEventListener('change', (e) => {
    if (e.target.name === 'booking-service') renderBookingQuote();
});
bookingRange = FVDateRange.create(document.getElementById('dateRange'), {
    t: (key, fallback) => tr(key, fallback),
    getLang: () => currentLang,
    onChange: () => renderBookingQuote()
});
document.addEventListener('fv:language', () => {
    if (bookingRange) bookingRange.refresh();
    if (currentBookingDest) { refreshExtraChips(currentBookingDest); renderBookingQuote(); }
});

// ---- Trimiterea comenzilor către Firebase (vezi backend.js → submitOrder) ----
function setFormBusy(form, busy) {
    const btn = form.querySelector('button[type="submit"]');
    if (!btn) return;
    btn.disabled = busy;
    btn.classList.toggle('opacity-70', busy);
    const spinner = btn.querySelector('[data-spinner]');
    if (spinner) spinner.classList.toggle('hidden', !busy);
}
function notify(message, kind) {
    if (typeof window.fvToast === 'function') window.fvToast(message, kind);
}
function sendOrder(order) {
    if (!window.FVBackend) { if (window.FVLog) FVLog.error('order', 'no-backend', { type: order.type }); return Promise.reject(new Error('backend indisponibil')); }
    order.lang = currentLang;
    order.dateText = new Date().toLocaleString('ro-RO');
    const done = window.FVLog ? FVLog.time('order', 'send', 1500) : null;
    return window.FVBackend.submitOrder(order).then(
        (r) => { if (done) done({ ok: true, type: order.type }); return r; },
        (err) => { if (done) done({ ok: false, type: order.type }); if (window.FVLog) FVLog.error('order', 'failed', { type: order.type, code: (err && err.code) || 'necunoscut' }); throw err; }
    );
}
const ORDER_ERROR_RO = 'Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne la 0799 927 590.';

// Modal Form Booking
// ----- Acceptul documentelor legale în formularul de rezervare (aceleași 3 documente ca în subsol, js/consent.js)
// Bifarea de aici salvează acceptul prin ACELAȘI FVBackend.saveConsent ca pagina documentului: pe cont dacă ești autentificat,
// altfel pe acest dispozitiv. De asta, dacă a acceptat deja (de aici sau din subsol), caseta apare bifată și blocată.
const CONSENT_DOCS_BOOKING = ['terms', 'privacy', 'anpc'];
const consentPending = {};
function consentCheckbox(doc) { return document.getElementById('bkConsent' + doc.charAt(0).toUpperCase() + doc.slice(1)); }
function refreshBookingConsent() {
    CONSENT_DOCS_BOOKING.forEach(doc => {
        const cb = consentCheckbox(doc);
        if (!cb) return;
        const done = !!(window.FVConsent && FVConsent.isAccepted(doc));
        cb.checked = done;
        cb.disabled = done || !!consentPending[doc];
    });
}
function allConsentsAccepted() { return CONSENT_DOCS_BOOKING.every(doc => window.FVConsent && FVConsent.isAccepted(doc)); }
CONSENT_DOCS_BOOKING.forEach(doc => {
    const cb = consentCheckbox(doc);
    if (!cb) return;
    cb.addEventListener('change', () => {
        if (!cb.checked || consentPending[doc] || !window.FVConsent) { refreshBookingConsent(); return; }
        consentPending[doc] = true; cb.disabled = true;
        FVConsent.accept(doc, true).then(() => { consentPending[doc] = false; refreshBookingConsent(); });   // aceeași funcție ca la pagina documentului (js/consent.js): pe cont sau pe dispozitiv
    });
});
document.querySelectorAll('#bookingConsent [data-open-doc]').forEach(btn => {
    btn.addEventListener('click', () => {
        const doc = btn.getAttribute('data-open-doc');
        const fn = window['fvOpen' + doc.charAt(0).toUpperCase() + doc.slice(1)];   // js/infomodal.js: fvOpenTerms / fvOpenPrivacy / fvOpenAnpc
        if (typeof fn === 'function') fn();
    });
});
document.addEventListener('fv:doc-open', refreshBookingConsent);   // dacă acceptă din subsol cât timp pachetul e deschis dedesubt

function showBookingGateError(msg, focusEl) {
    if (window.FVLog) FVLog.info('booking', 'blocked');
    const p = document.getElementById('bookingGateError'), span = document.getElementById('bookingGateErrorText');
    span.textContent = msg;
    p.classList.remove('hidden');
    if (focusEl) { focusEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); if (typeof focusEl.focus === 'function') focusEl.focus(); }
}

document.getElementById('modalBookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Validate Name (Nume + Prenume: at least 2 words) ---
    const nameInput = document.getElementById('bookingName');
    const nameError = document.getElementById('bookingNameError');
    const nameVal = nameInput.value.trim();
    // Regex: at least 2 words, each 2+ chars, supports RO diacritics, hyphens, apostrophes
    const nameRegex = /^[A-Za-zĂÂÎȘȚăâîșțÀ-ÿ'\-]{2,}(?:\s+[A-Za-zĂÂÎȘȚăâîșțÀ-ÿ'\-]{2,})+$/;
    if (!nameRegex.test(nameVal)) {
        if (window.FVLog) FVLog.info('booking', 'invalid', { field: 'nume' });
        nameInput.classList.add('border-red-500', 'ring-2', 'ring-red-400');
        nameError.classList.remove('hidden');
        nameInput.focus();
        return;
    } else {
        nameInput.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
        nameError.classList.add('hidden');
    }

    // --- Validate Phone (international format, country code whitelist) ---
    const phoneInput = document.getElementById('bookingPhone');
    const phoneError = document.getElementById('bookingPhoneError');
    const phoneVal = phoneInput.value.trim();
    const phoneValid = fvPhoneValid(phoneVal);
    if (!phoneValid) {
        if (window.FVLog) FVLog.info('booking', 'invalid', { field: 'telefon' });
        phoneInput.classList.add('border-red-500', 'ring-2', 'ring-red-400');
        phoneError.classList.remove('hidden');
        phoneInput.focus();
        return;
    } else {
        phoneInput.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
        phoneError.classList.add('hidden');
    }

    // --- Validate Email ---
    const emailInput = document.getElementById('bookingEmail');
    const emailError = document.getElementById('bookingEmailError');
    const emailVal = emailInput.value.trim().toLowerCase();
    const allowedDomains = ['@gmail.com', '@yahoo.com', '@business.com'];
    const emailValid = allowedDomains.some(d => emailVal.endsWith(d));

    if (!emailValid) {
        if (window.FVLog) FVLog.info('booking', 'invalid', { field: 'email' });
        emailInput.classList.add('border-red-500', 'ring-2', 'ring-red-400');
        emailError.classList.remove('hidden');
        emailInput.focus();
        return;
    } else {
        emailInput.classList.remove('border-red-500', 'ring-2', 'ring-red-400');
        emailError.classList.add('hidden');
    }

    // --- Validate Dates (plecare + întoarcere, în limitele pachetului, nu în trecut) ---
    if (!bookingRange || bookingRange.validate()) {
        if (window.FVLog) FVLog.info('booking', 'invalid', { field: 'date' });
        if (bookingRange) {
            bookingRange.showError(tr('modal.dateRequired', 'Alege data plecării și data întoarcerii.'));
            bookingRange.open(bookingRange.getRange().start ? 'end' : 'start');
            document.getElementById('dateRange').scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
        return;
    }

    // --- Documentele legale: toate cele 3 trebuie acceptate (aceeași regulă ca la pagina fiecărui document) ---
    document.getElementById('bookingGateError').classList.add('hidden');
    if (!allConsentsAccepted()) {
        const firstUnchecked = CONSENT_DOCS_BOOKING.map(consentCheckbox).find(cb => cb && !cb.checked);
        showBookingGateError(tr('booking.consentErrorDocs', 'Trebuie să accepți Termenii și Condițiile, Politica de Confidențialitate și informațiile ANPC / SAL înainte de a trimite.'), firstUnchecked || document.getElementById('bookingConsent'));
        return;
    }

    // --- E-mailul contului: dacă ești autentificat, trebuie verificat înainte să poți trimite o comandă (poți naviga site-ul oricum) ---
    const activeSession = typeof window.fvCurrentSession === 'function' ? window.fvCurrentSession() : null;
    if (activeSession && activeSession.emailVerified === false) {
        showBookingGateError(tr('booking.consentErrorEmail', 'Trebuie să-ți verifici e-mailul înainte de a trimite o comandă. Mergi în profil și apasă „Retrimite e-mailul” sau „Am verificat, actualizează”.'), document.getElementById('bookingGateError'));
        return;
    }

    const range = bookingRange.getRange();

    // --- Trimite comanda în Firebase (fereastra rămâne deschisă dacă nu reușește, ca să nu se piardă datele) ---
    const form = e.target;
    const dest = currentBookingDest;
    const quote = currentQuote();
    const order = {
        type: 'booking',
        name: nameVal,
        phone: phoneVal,
        email: emailVal,
        destinationId: dest ? dest.id : '',
        destinationTitle: dest ? dest.title : '',
        price: dest ? Number(dest.price) || 0 : 0,
        currency: dest ? String(dest.currency || '') : '',
        travelers: quote.travelers,
        adults: quote.adults,
        children04: quote.kids04,
        children512: quote.kids512,
        travelDate: range.start,
        returnDate: range.end,
        nights: quote.nights,
        periodText: `${FVDateRange.fmt(range.start)} – ${FVDateRange.fmt(range.end)} (${quote.nights} nopți)`,
        services: selectedServiceKeys().join(', '),
        totalPrice: quote.total,
        pricePerPerson: quote.perPerson,
        priceDetails: quote.lines.map(l => `${quoteLineText(l, false)} = ${l.amount} €`).join('; ') + ` | Total ${quote.total} € (≈ ${quote.ron} lei)`
    };
    setFormBusy(form, true);
    try {
        await sendOrder(order);
    } catch (err) {
        setFormBusy(form, false);
        notify(tr('order.error', ORDER_ERROR_RO), 'error');
        return;
    }
    setFormBusy(form, false);
    if (window.FVLog) FVLog.info('booking', 'submitted', { id: dest ? dest.id : '', adults: quote.adults, kids04: quote.kids04, kids512: quote.kids512, nights: quote.nights, total: quote.total });

    // --- Close the booking modal ---
    closeModal();
    // --- Show the Thank You overlay ---
    const overlay = document.getElementById('thankYouOverlay');
    const content = document.getElementById('thankYouContent');
    overlay.classList.remove('hidden');
    setTimeout(() => {
        content.classList.remove('scale-50', 'opacity-0');
        content.classList.add('scale-100', 'opacity-100');
    }, 50);
    // Reset form
    e.target.reset();
    if (dest) initBookingPricing(dest);
    // Auto-hide after 3.5 seconds
    setTimeout(() => {
        content.classList.remove('scale-100', 'opacity-100');
        content.classList.add('scale-50', 'opacity-0');
        setTimeout(() => {
            overlay.classList.add('hidden');
        }, 500);
    }, 3500);
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const val = (id) => document.getElementById(id).value.trim();
    const order = {
        type: 'contact',
        name: val('contactName'),
        phone: val('contactPhone'),
        email: val('contactEmail').toLowerCase()
    };
    if (val('contactDest')) order.destination = val('contactDest');
    if (val('contactMsg')) order.message = val('contactMsg');

    setFormBusy(form, true);
    try {
        await sendOrder(order);
    } catch (err) {
        setFormBusy(form, false);
        notify(tr('order.error', ORDER_ERROR_RO), 'error');
        return;
    }
    setFormBusy(form, false);

    document.getElementById('contactSuccess').classList.remove('hidden');
    form.reset();
    setTimeout(() => {
        document.getElementById('contactSuccess').classList.add('hidden');
    }, 5000);
});

// ============ STORAGE SHIM ============
// Persistență reală pe host; în medii restricționate (ex. iframe de preview)
// folosește automat memorie temporară, ca site-ul să funcționeze oriunde.
const fvStore = (() => {
    try {
        const ls = window['loc' + 'al' + 'Storage'];
        const probe = '__fv__';
        ls.setItem(probe, probe); ls.removeItem(probe);
        return { get: k => ls.getItem(k), set: (k, v) => ls.setItem(k, v), del: k => ls.removeItem(k), persistent: true };
    } catch (e) {
        const mem = {};
        return { get: k => (k in mem ? mem[k] : null), set: (k, v) => { mem[k] = String(v); }, del: k => { delete mem[k]; }, persistent: false };
    }
})();

// ============ I18N MULTI-LANGUAGE SYSTEM ============
let currentLang = fvStore.get('feelvoyage_lang') || 'ro';

// Cache original Romanian text/placeholders on first load so we can restore them
function cacheI18nDefaults() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        if (el.dataset.i18nDefault === undefined) {
            el.dataset.i18nDefault = el.textContent;
        }
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        if (el.dataset.i18nPhDefault === undefined) {
            el.dataset.i18nPhDefault = el.getAttribute('placeholder') || '';
        }
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        if (el.dataset.i18nAriaDefault === undefined) {
            el.dataset.i18nAriaDefault = el.getAttribute('aria-label') || '';
        }
    });
}

// Translate a key; falls back to the Romanian default when lang is 'ro' or key missing
function tr(key, fallback) {
    if (currentLang === 'ro') return fallback !== undefined ? fallback : key;
    const dict = (typeof i18n !== 'undefined') ? i18n[currentLang] : null;
    if (dict && dict[key] !== undefined) return dict[key];
    return fallback !== undefined ? fallback : key;
}

// Get translated display fields for a destination object
// Telefon valid: format românesc local (07xxxxxxxx / 02xxxxxxxx) sau internațional (+prefix + număr), cu prefixe acceptate.
// Îl folosesc formularul de rezervare și înregistrarea contului.
function fvPhoneValid(value) {
    const norm = String(value == null ? '' : value).trim().replace(/[\s\-()]/g, '');
    const roLocal = /^0[2-7]\d{8}$/;
    // Prefixe acceptate: RO(+40), IT(+39), UK(+44), DE(+49), MD(+373), US/CA(+1), FR(+33), ES(+34), BE(+32), CH(+41), LU(+352),
    // MX(+52), AR(+54), CL(+56), CO(+57), Asia: JP(+81), KR(+82), CN(+86), IN(+91), ID(+62), PH(+63), SG(+65), TH(+66), VN(+84), AE(+971), TR(+90), MY(+60), HK(+852)
    const intl = /^\+(40|39|44|49|373|1|33|34|32|41|352|52|54|56|57|81|82|86|91|62|63|65|66|84|971|90|60|852)\d{6,14}$/;
    return roLocal.test(norm) || intl.test(norm);
}

function getDestinationText(item) {
    const prefix = `dest.${item.id}.`;
    const amenitiesFallback = item.amenities.join('|');
    const translatedAmenities = tr(prefix + 'amenities', amenitiesFallback);
    return {
        title: tr(prefix + 'title', item.title),
        tagLabel: tr(prefix + 'tagLabel', item.tagLabel),
        period: tr(prefix + 'period', item.period),
        description: tr(prefix + 'description', item.description),
        amenities: translatedAmenities.split('|')
    };
}

// Apply the current language to all static [data-i18n] / [data-i18n-ph] elements
function applyStaticTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const fallback = el.dataset.i18nDefault !== undefined ? el.dataset.i18nDefault : el.textContent;
        el.textContent = tr(key, fallback);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        const fallback = el.dataset.i18nPhDefault !== undefined ? el.dataset.i18nPhDefault : (el.getAttribute('placeholder') || '');
        el.setAttribute('placeholder', tr(key, fallback));
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const fallback = el.dataset.i18nAriaDefault !== undefined ? el.dataset.i18nAriaDefault : (el.getAttribute('aria-label') || '');
        el.setAttribute('aria-label', tr(key, fallback));
    });
}

// Update language switcher UI (desktop label + mobile active states)
function updateLangSwitcherUI() {
    const label = document.getElementById('currentLangLabel');
    if (label) label.textContent = currentLang.toUpperCase();

    document.querySelectorAll('.lang-option').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('bg-brand-50', 'text-brand-700');
        } else {
            btn.classList.remove('bg-brand-50', 'text-brand-700');
        }
    });

    document.querySelectorAll('.lang-option-mobile').forEach(btn => {
        if (btn.dataset.lang === currentLang) {
            btn.classList.add('border-brand-500', 'bg-brand-50', 'text-brand-700');
            btn.classList.remove('border-slate-200', 'text-slate-600');
        } else {
            btn.classList.remove('border-brand-500', 'bg-brand-50', 'text-brand-700');
            btn.classList.add('border-slate-200', 'text-slate-600');
        }
    });
}

// Master language switch function
function setLanguage(lang) {
    if (!['ro', 'en', 'it', 'fr', 'es'].includes(lang)) lang = 'ro';
    if (lang !== currentLang && window.FVLog) FVLog.info('app', 'lang', { from: currentLang, to: lang });
    currentLang = lang;
    fvStore.set('feelvoyage_lang', lang);
    document.documentElement.setAttribute('lang', lang);

    cacheI18nDefaults();
    applyStaticTranslations();
    updateLangSwitcherUI();

    // Re-render dynamic content that depends on language
    if (typeof renderDestinations === 'function') renderDestinations();

    // Reset chat so the welcome message re-renders in the new language
    if (typeof chatInitialized !== 'undefined') {
        chatInitialized = false;
        if (typeof chatMessages !== 'undefined' && chatMessages && chatWindow && !chatWindow.classList.contains('hidden')) {
            initChat();
        }
    }

    const langDropdown = document.getElementById('langDropdown');
    if (langDropdown) langDropdown.classList.add('hidden');

    // Anunță celelalte scripturi (cont, temă, contor) că textele s-au schimbat
    document.dispatchEvent(new CustomEvent('fv:language', { detail: { lang: lang } }));
}

// Wire up language switcher click handlers
function initLanguageSwitcher() {
    cacheI18nDefaults();

    const langBtn = document.getElementById('langBtn');
    const langDropdown = document.getElementById('langDropdown');
    if (langBtn && langDropdown) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langDropdown.classList.toggle('hidden');
        });
        document.addEventListener('click', (e) => {
            if (!langDropdown.contains(e.target) && e.target !== langBtn) {
                langDropdown.classList.add('hidden');
            }
        });
    }

    document.querySelectorAll('.lang-option').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });
    document.querySelectorAll('.lang-option-mobile').forEach(btn => {
        btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
    });

    // Apply saved/default language on load
    setLanguage(currentLang);
}

// Initialize App
// Pornește imediat ce pagina e gata (DOMContentLoaded), nu la window.onload: „load” așteaptă toate pozele și fonturile, iar pe o conexiune lentă
// cardurile ar apărea târziu, iar o listă de destinații deschisă între timp ar fi refăcută sub degetul vizitatorului.
function initApp() {
    initLanguageSwitcher();
    renderDestinations();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
else initApp();
