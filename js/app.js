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
    return url ? url.replace(/([?&])w=\d+/, '$1w=' + width) : url;
}

// Blochează derularea paginii cât timp o fereastră (modal) e deschisă; numără câte sunt deschise
let scrollLocks = 0;
function lockScroll(on) {
    scrollLocks = Math.max(0, scrollLocks + (on ? 1 : -1));
    document.body.classList.toggle('overflow-hidden', scrollLocks > 0);
}

// Render Destinations Function with RON conversion support & Rating Stars
function renderDestinations() {
    destinationsGrid.innerHTML = '';
    
    const filtered = destinations.filter(item => {
        const matchesCategory = (currentFilter === 'all') || (item.category === currentFilter) || (Array.isArray(item.extraCategories) && item.extraCategories.includes(currentFilter));
        const t = getDestinationText(item);
        const query = searchQuery.toLowerCase();
        const matchesSearch = item.title.toLowerCase().includes(query) || 
                              item.description.toLowerCase().includes(query) ||
                              t.title.toLowerCase().includes(query) ||
                              t.description.toLowerCase().includes(query);
        const matchesBudget = (maxBudget === 'all') || (item.price <= parseInt(maxBudget));
        
        return matchesCategory && matchesSearch && matchesBudget;
    });

    if (filtered.length === 0) {
        noResultsMsg.classList.remove('hidden');
    } else {
        noResultsMsg.classList.add('hidden');
        
        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl border border-slate-100 transition-all duration-300 flex flex-col group transform hover:-translate-y-1';
            const coverImg = item.images && item.images.length > 0 ? item.images[0] : '';
            const t = getDestinationText(item);
            
            card.innerHTML = `
                <div class="relative h-48 sm:h-60 overflow-hidden">
                    <img src="${imgSized(coverImg, 700)}" alt="${t.title}" loading="lazy" decoding="async" width="700" height="480" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
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
                        <span class="text-xs bg-brand-600/90 px-2 py-0.5 rounded backdrop-blur-sm font-semibold">
                            <i class="fa-solid fa-images mr-1"></i> ${tr('dest.foto', '4 Foto')}
                        </span>
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
            destinationsGrid.appendChild(card);
        });
    }
}

// Filter Buttons Handler
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
            b.classList.remove('bg-brand-600', 'text-white', 'shadow-md');
            b.classList.add('bg-white', 'text-slate-700', 'hover:bg-slate-100');
        });
        btn.classList.remove('bg-white', 'text-slate-700', 'hover:bg-slate-100');
        btn.classList.add('bg-brand-600', 'text-white', 'shadow-md');

        currentFilter = btn.getAttribute('data-filter');
        renderDestinations();
        if (btn.scrollIntoView) btn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
});

function filterCategory(cat) {
    currentFilter = cat;
    filterBtns.forEach(b => {
        if (b.getAttribute('data-filter') === cat) {
            b.click();
        }
    });
}

// Search Form Submission
heroSearchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = searchInput.value;
    currentFilter = categorySelect.value;
    maxBudget = budgetSelect.value;
    renderDestinations();
    document.getElementById('destinatii').scrollIntoView({ behavior: 'smooth' });
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

// Open Modal Function with Multi-Image Support & Dynamic Gallery
let currentBookingDest = null;   // destinația pentru care e deschisă fereastra de rezervare
function openModal(id) {
    const item = destinations.find(d => d.id === id);
    if (!item) return;
    currentBookingDest = item;

    const t = getDestinationText(item);

    // Set main details
    modalTitle.innerText = t.title;
    modalBadge.innerText = t.tagLabel || item.category;
    modalPrice.innerText = `${item.price} ${item.currency} (${item.priceRon || ''})`;
    modalDesc.innerText = t.description;

    // Main display image
    modalImg.src = item.images[0];

    // Render Multi-Image 4 Photo Thumbnails Gallery
    modalGalleryThumbnails.innerHTML = '';
    item.images.forEach((imgUrl, index) => {
        const thumb = document.createElement('img');
        thumb.src = imgSized(imgUrl, 160);
        thumb.alt = `${t.title} foto ${index + 1}`;
        thumb.className = `w-16 h-12 object-cover rounded-lg cursor-pointer border-2 transition-all opacity-70 hover:opacity-100 ${index === 0 ? 'thumb-active' : 'border-slate-700'}`;
        
        thumb.addEventListener('click', () => {
            modalImg.src = imgUrl;
            document.querySelectorAll('#modalGalleryThumbnails img').forEach(t => t.classList.remove('thumb-active'));
            thumb.classList.add('thumb-active');
        });
        
        modalGalleryThumbnails.appendChild(thumb);
    });

    // Render Amenities
    modalAmenities.innerHTML = t.amenities.map(a => `
        <span class="px-3 py-1 bg-brand-50 text-brand-700 font-bold text-xs rounded-lg border border-brand-200/60 flex items-center gap-1.5">
            <i class="fa-solid fa-star text-amber-500 text-[10px]"></i> ${a}
        </span>
    `).join('');

    initBookingPricing(item);

    if (bookingModal.classList.contains('hidden')) lockScroll(true);
    bookingModal.classList.remove('hidden');
    setTimeout(() => {
        modalContainer.classList.remove('scale-95', 'opacity-0');
        modalContainer.classList.add('scale-100', 'opacity-100');
    }, 10);
}

function closeModal() {
    if (bookingModal.classList.contains('hidden')) return;
    if (bookingRange) bookingRange.close();
    lockScroll(false);
    modalContainer.classList.remove('scale-100', 'opacity-100');
    modalContainer.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        bookingModal.classList.add('hidden');
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
const LOCALES = { ro: 'ro-RO', en: 'en-GB', it: 'it-IT' };

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
    if (!window.FVBackend) return Promise.reject(new Error('backend indisponibil'));
    order.lang = currentLang;
    order.dateText = new Date().toLocaleString('ro-RO');
    return window.FVBackend.submitOrder(order);
}
const ORDER_ERROR_RO = 'Nu am putut trimite solicitarea. Încearcă din nou sau sună-ne la 0799 927 590.';

// Modal Form Booking
document.getElementById('modalBookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Validate Name (Nume + Prenume: at least 2 words) ---
    const nameInput = document.getElementById('bookingName');
    const nameError = document.getElementById('bookingNameError');
    const nameVal = nameInput.value.trim();
    // Regex: at least 2 words, each 2+ chars, supports RO diacritics, hyphens, apostrophes
    const nameRegex = /^[A-Za-zĂÂÎȘȚăâîșțÀ-ÿ'\-]{2,}(?:\s+[A-Za-zĂÂÎȘȚăâîșțÀ-ÿ'\-]{2,})+$/;
    if (!nameRegex.test(nameVal)) {
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
    // Normalize: remove spaces, dashes, parentheses
    const phoneNorm = phoneVal.replace(/[\s\-()]/g, '');
    // Romanian local format: 07xxxxxxxx or 02xxxxxxxx (10 digits)
    const roLocalRegex = /^0[2-7]\d{8}$/;
    // International format: + followed by country code and number
    // Whitelist: RO(+40), IT(+39), UK(+44), DE(+49), MD(+373), US/CA(+1), FR(+33), ES(+34),
    // Asia: JP(+81), KR(+82), CN(+86), IN(+91), ID(+62), PH(+63), SG(+65), TH(+66), VN(+84), AE(+971), TR(+90), MY(+60), HK(+852)
    const intlRegex = /^\+(40|39|44|49|373|1|33|34|81|82|86|91|62|63|65|66|84|971|90|60|852)\d{6,14}$/;
    const phoneValid = roLocalRegex.test(phoneNorm) || intlRegex.test(phoneNorm);
    if (!phoneValid) {
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
        if (bookingRange) {
            bookingRange.showError(tr('modal.dateRequired', 'Alege data plecării și data întoarcerii.'));
            bookingRange.open(bookingRange.getRange().start ? 'end' : 'start');
            document.getElementById('dateRange').scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
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
    if (!['ro', 'en', 'it'].includes(lang)) lang = 'ro';
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
window.onload = function() {
    initLanguageSwitcher();
    renderDestinations();
};
