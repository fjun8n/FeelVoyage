/* FeelVoyage — dropdown căutabil de țară/cetățenie, cu steag lângă fiecare țară (js/countries.js),
   pentru formularul „Trimite Cerere de Ofertă”. Fără diacritice la căutare, la fel ca restul site-ului
   (vezi stripDiacritics din js/app.js) — scris din nou aici ca fișierul să rămână independent. */
(function () {
    'use strict';

    const btn = document.getElementById('contactCountryBtn');
    const panel = document.getElementById('contactCountryPanel');
    const search = document.getElementById('contactCountrySearch');
    const list = document.getElementById('contactCountryList');
    const hidden = document.getElementById('contactCountryCode');
    const flagImg = document.getElementById('contactCountryFlag');
    const labelEl = document.getElementById('contactCountryLabel');
    if (!btn || !panel || !list || !hidden) return;

    const countries = window.FV_COUNTRIES || [];
    function stripDiacritics(s) { return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
    function flagUrl(code) { return 'https://flagcdn.com/24x18/' + code.toLowerCase() + '.png'; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

    function rowHtml(c) {
        return '<button type="button" data-country-code="' + c.code + '" data-country-name="' + esc(c.name) + '" class="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-slate-50 transition">' +
            '<img src="' + flagUrl(c.code) + '" alt="" class="w-5 h-auto rounded-sm shrink-0" loading="lazy">' +
            '<span class="text-slate-700">' + esc(c.name) + '</span>' +
            '</button>';
    }
    function renderList(filterText) {
        const q = stripDiacritics((filterText || '').trim());
        const filtered = q ? countries.filter(function (c) { return stripDiacritics(c.name).indexOf(q) > -1; }) : countries;
        list.innerHTML = filtered.length ? filtered.map(rowHtml).join('') : '<p class="px-3 py-4 text-center text-xs text-slate-400">Nicio țară găsită.</p>';
    }

    function open() {
        if (btn.disabled) return;
        panel.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
        renderList('');
        if (search) { search.value = ''; search.focus(); }
    }
    function close() {
        panel.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
    }
    function select(code, name) {
        hidden.value = code;
        hidden.setAttribute('data-name', name);
        if (flagImg) { flagImg.src = flagUrl(code); flagImg.classList.remove('hidden'); }
        if (labelEl) { labelEl.textContent = name; labelEl.classList.remove('text-slate-400'); labelEl.classList.add('text-slate-800'); }
        close();
    }
    // Golește selecția (apelat și din app.js după trimiterea cu succes a formularului, odată cu form.reset())
    function reset() {
        hidden.value = '';
        hidden.removeAttribute('data-name');
        if (flagImg) { flagImg.src = ''; flagImg.classList.add('hidden'); }
        if (labelEl) { labelEl.textContent = labelEl.getAttribute('data-placeholder') || 'Selectează țara...'; labelEl.classList.add('text-slate-400'); labelEl.classList.remove('text-slate-800'); }
    }
    window.fvResetCountrySelect = reset;
    // Completare automată din profil (js/auth.js, când ești logat și contul tău are deja o țară salvată) —
    // doar dacă nu a fost deja aleasă manual ceva (nu suprascriem o alegere făcută chiar acum pentru cererea asta).
    window.fvAutofillCountry = function (code) {
        if (hidden.value) return;
        const c = countries.find(function (x) { return x.code === code; });
        if (c) select(c.code, c.name);
    };

    btn.addEventListener('click', function () { panel.classList.contains('hidden') ? open() : close(); });
    if (search) search.addEventListener('input', function () { renderList(search.value); });
    list.addEventListener('click', function (e) {
        const row = e.target.closest('[data-country-code]');
        if (row) select(row.getAttribute('data-country-code'), row.getAttribute('data-country-name'));
    });
    document.addEventListener('click', function (e) {
        if (!panel.classList.contains('hidden') && !panel.contains(e.target) && e.target !== btn && !btn.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.classList.contains('hidden')) close(); });
})();
