/* FeelVoyage — „Destinație dorită”: verificarea locului scris + estimarea de preț afișată deasupra butonului
   „Trimite cererea de ofertă”. Calculul în sine e în js/estimate.js (acolo e și explicația de unde vin prețurile).

   Ce face aici:
   • la fiecare pauză în scris (700 ms, ca să nu batem Nominatim la fiecare literă) caută locul scris;
   • dacă e o ȚARĂ, o respinge: cerem un oraș / o localitate, altfel nu se poate estima nimic serios
     („Franța” poate însemna Paris sau un sat din Normandia, cu prețuri complet diferite);
   • dacă locul e deja în catalogul nostru, spune asta și oferă un buton care deschide pachetul existent;
   • altfel calculează estimarea și o arată: zbor, cazare, serviciile bifate, total în € și în lei.
   Estimarea se reface singură când omul schimbă perioada, numărul de călători sau serviciile bifate.

   Dacă Nominatim nu răspunde (internet oprit, limită atinsă): nu se blochează NIMIC și nu se afișează nicio
   estimare — cererea se trimite ca până acum, iar consultantul o calculează manual. */
(function (root) {
    'use strict';

    var doc = root.document;
    var destEl = doc.getElementById('contactDest');
    var noteEl = doc.getElementById('contactDestNote');
    var boxEl = doc.getElementById('contactEstimate');
    if (!destEl || !noteEl || !boxEl) return;

    var placeEl = doc.getElementById('contactEstimatePlace');
    var rowsEl = doc.getElementById('contactEstimateRows');
    var totalEl = doc.getElementById('contactEstimateTotal');
    var ronEl = doc.getElementById('contactEstimateRon');
    var submitBtn = doc.getElementById('contactSubmitBtn');

    var DEBOUNCE_MS = 700;
    var timer = null;
    var state = { place: null, estimate: null, blocked: false, lastQuery: '' };

    function t(key, fb) { return (typeof root.tr === 'function') ? root.tr(key, fb) : fb; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function eur(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €'; }

    /* ------------------------------------------------------------ mesajul de sub câmp */
    function note(html, kind) {
        noteEl.innerHTML = html || '';
        noteEl.classList.toggle('hidden', !html);
        noteEl.classList.toggle('is-bad', kind === 'bad');
        noteEl.classList.toggle('is-info', kind === 'info');
    }
    function clearNote() { note('', ''); }

    /* ------------------------------------------------------------ cutia de estimare */
    function hideBox() { boxEl.classList.add('hidden'); state.estimate = null; }
    function showWaiting() {
        boxEl.classList.remove('hidden');
        placeEl.textContent = '';
        rowsEl.innerHTML = '<p class="fv-est-wait">' + esc(t('est.calculating', 'Se calculează estimarea…')) + '</p>';
        totalEl.textContent = '';
        ronEl.textContent = '';
    }

    // Serviciile bifate în formular, în formatul cerut de js/pricing.js
    function chosenExtras() {
        var out = [];
        doc.querySelectorAll('input[name="contact-service"]:checked').forEach(function (i) {
            if (i.value && i.value !== 'cazare') out.push(i.value);
        });
        return out;
    }
    function travelers() {
        var n = function (id) { return parseInt((doc.getElementById(id) || {}).value, 10) || 0; };
        return { adults: Math.max(1, n('contactAdults')), kids04: n('contactKids04'), kids512: n('contactKids512') };
    }
    // Perioada aleasă în calendarul propriu (js/daterange.js) — dacă nu e completă, folosim 7 nopți
    function period() {
        try {
            if (typeof contactRange !== 'undefined' && contactRange && !contactRange.validate()) {
                var r = contactRange.getRange();
                return { nights: r.nights, date: r.start };
            }
        } catch (e) { /* ignorat */ }
        return { nights: 7, date: '' };
    }

    function render(est) {
        if (!est) { hideBox(); return; }
        boxEl.classList.remove('hidden');
        var p = est.place;
        placeEl.textContent = (p.name || '') + (p.country ? ', ' + p.country : '')
            + ' · ' + est.nights + ' ' + t('est.nights', 'nopți');

        var tv = travelers();
        var people = tv.adults + tv.kids04 + tv.kids512;
        var rows = [];
        if (est.flightPerAdult > 0) {
            rows.push([t('est.flight', 'Zbor estimat (dus-întors)'), eur(est.flightPerAdult) + ' / ' + t('est.perAdult', 'adult')]);
        } else {
            rows.push([t('est.transport', 'Transport'), t('est.transportRo', 'autocar, în România')]);
        }
        rows.push([t('est.stay', 'Cazare') + ' ' + est.nights + ' ' + t('est.nights', 'nopți'),
            eur(est.nightRate) + ' / ' + t('est.perNight', 'noapte')]);
        // liniile de serviciu și suplimentele vin din motorul de preț (js/pricing.js)
        (est.quote.lines || []).forEach(function (l) {
            if (l.type === 'extra' || l.type === 'season' || l.type === 'single') {
                var label = (typeof root.FVAI !== 'undefined' && root.FVAI.describeLine) ? root.FVAI.describeLine(l) : l.type;
                rows.push([label, eur(l.amount)]);
            }
        });
        rowsEl.innerHTML = rows.map(function (r) {
            return '<div class="fv-est-row"><span>' + esc(r[0]) + '</span><b>' + esc(r[1]) + '</b></div>';
        }).join('');

        totalEl.textContent = eur(est.total);
        var perPerson = people > 1 ? ' · ' + eur(est.perPerson) + ' / ' + t('est.perPerson', 'persoană') : '';
        ronEl.textContent = (root.FVPricing ? FVPricing.fmtRON(est.ron) : '') + perPerson;
    }

    /* ------------------------------------------------------------ recalcularea */
    function recompute() {
        if (!state.place || state.blocked) { hideBox(); return; }
        if (typeof root.FVEstimate === 'undefined') { hideBox(); return; }
        var per = period(), tv = travelers();
        var est = root.FVEstimate.estimate(state.place, {
            nights: per.nights, date: per.date,
            adults: tv.adults, kids04: tv.kids04, kids512: tv.kids512,
            extras: chosenExtras()
        });
        state.estimate = est;
        render(est);
    }

    /* ------------------------------------------------------------ verificarea locului scris */
    function openExisting(id) {
        if (typeof root.openModal === 'function') root.openModal(id);
    }

    function handle(text) {
        var q = String(text || '').trim();
        state.lastQuery = q;
        if (q.length < 3) { state.place = null; state.blocked = false; clearNote(); hideBox(); return; }

        // 1) e deja în catalog? (verificare locală, fără rețea)
        var hit = root.FVEstimate && root.FVEstimate.catalogMatch(q);
        if (hit) {
            var title = (typeof root.getDestinationText === 'function') ? root.getDestinationText(hit).title : hit.title;
            note(esc(t('est.inCatalog', 'Avem deja un pachet pentru această destinație:')) + ' '
                + '<button type="button" class="fv-dest-link" data-open-dest="' + esc(hit.id) + '">' + esc(title) + '</button>', 'info');
            // nu blocăm: poate vrea totuși altceva decât pachetul nostru. Estimarea rămâne a noastră, din catalog.
            state.place = null; state.blocked = false;
            hideBox();
            return;
        }

        // 2) e o țară? (verificare locală, instantanee)
        if (root.FVEstimate && root.FVEstimate.isCountryText(q)) {
            note(esc(t('est.countryBlocked', 'Scrie un oraș sau o localitate, nu o țară — altfel nu putem estima prețul (de exemplu „Paris”, nu „Franța”).')), 'bad');
            state.place = null; state.blocked = true;
            hideBox();
            return;
        }

        // 3) căutăm locul (Nominatim)
        clearNote();
        showWaiting();
        root.FVEstimate.lookupPlace(q).then(function (res) {
            if (state.lastQuery !== q) return;        // omul a scris mai departe: răspunsul e vechi
            if (!res || !res.ok) {
                state.place = null; state.blocked = false;
                hideBox();
                if (res && res.reason === 'notfound') note(esc(t('est.notFound', 'Nu am găsit locul acesta. Verifică scrierea sau scrie orașul cel mai apropiat.')), 'bad');
                return;
            }
            if (res.kind === 'country') {
                note(esc(t('est.countryBlocked', 'Scrie un oraș sau o localitate, nu o țară — altfel nu putem estima prețul (de exemplu „Paris”, nu „Franța”).')), 'bad');
                state.place = null; state.blocked = true;
                hideBox();
                return;
            }
            state.place = res; state.blocked = false;
            clearNote();
            recompute();
        });
    }

    /* ------------------------------------------------------------ legături */
    destEl.addEventListener('input', function () {
        clearTimeout(timer);
        var v = destEl.value;
        // feedback instantaneu pentru cazurile locale (țară / pachet existent), fără să aștepte rețeaua
        if (root.FVEstimate && (root.FVEstimate.isCountryText(v.trim()) || root.FVEstimate.catalogMatch(v.trim()))) {
            handle(v);
            return;
        }
        timer = setTimeout(function () { handle(destEl.value); }, DEBOUNCE_MS);
    });
    destEl.addEventListener('blur', function () { clearTimeout(timer); handle(destEl.value); });

    noteEl.addEventListener('click', function (e) {
        var b = e.target.closest && e.target.closest('[data-open-dest]');
        if (b) openExisting(b.getAttribute('data-open-dest'));
    });

    // estimarea se reface când se schimbă perioada, călătorii sau serviciile
    ['contactAdults', 'contactKids04', 'contactKids512'].forEach(function (id) {
        var el = doc.getElementById(id);
        if (el) el.addEventListener('change', recompute);
    });
    doc.addEventListener('change', function (e) {
        if (e.target && e.target.name === 'contact-service') recompute();
    });
    // perioada: js/app.js apelează FVContactEstimate.refresh() din onChange-ul calendarului
    doc.addEventListener('fv:exchange-rate', function () { if (state.estimate) render(state.estimate); });
    doc.addEventListener('fv:language', function () { if (state.estimate) render(state.estimate); else if (state.lastQuery) handle(state.lastQuery); });

    // la trimitere: dacă e o țară, nu lăsăm cererea să plece (a doua barieră, pe lângă mesajul de sub câmp)
    var form = doc.getElementById('contactForm');
    if (form) form.addEventListener('submit', function (e) {
        if (state.blocked) {
            e.preventDefault();
            e.stopImmediatePropagation();
            note(esc(t('est.countryBlocked', 'Scrie un oraș sau o localitate, nu o țară — altfel nu putem estima prețul (de exemplu „Paris”, nu „Franța”).')), 'bad');
            destEl.focus();
            destEl.scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
    }, true);   // faza de captură: ajunge înaintea trimiterii din js/app.js

    // ce știe estimarea, pentru js/app.js (merge în cerere și în mailul către agenție)
    root.FVContactEstimate = {
        current: function () { return state.estimate; },
        isBlocked: function () { return state.blocked; },
        refresh: recompute
    };
})(window);
