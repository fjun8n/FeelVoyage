/* FeelVoyage — selector de interval de date: „de pe" (plecare) → „până pe" (întoarcere), afișat zz/ll/aaaa.

   Cum funcționează:
   • se apasă câmpul „Plecare" și se alege o zi din calendar; data întoarcerii se completează automat cu durata standard a pachetului;
   • pentru pachetele cu durată flexibilă se poate apoi alege altă zi de întoarcere (în limitele min–max nopți ale pachetului);
   • circuitele ghidate au durată fixă: data întoarcerii se calculează singură;
   • nu se pot alege zile trecute (prima zi posibilă = mâine).

   Calendarul se deschide în pagină (nu într-un popup), ca să nu fie tăiat în fereastra de rezervare de pe telefon.
   Partea de calcul cu date nu atinge pagina, deci se poate testa separat. Datele se rețin ca text AAAA-LL-ZZ și se afișează ZZ/LL/AAAA. */
(function (root) {
    'use strict';

    const MAX_AHEAD_DAYS = 548;   // maximum ~18 luni în viitor
    const LOCALES = { ro: 'ro-RO', en: 'en-GB', it: 'it-IT' };

    /* ------------------------------------------------------------------ calcule cu date (fără DOM) */
    const pad = function (n) { return String(n).padStart(2, '0'); };
    function iso(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }

    function parse(s) {
        const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(s || ''));
        if (!m) return null;
        const y = +m[1], mo = +m[2], d = +m[3];
        const dt = new Date(y, mo - 1, d, 12);
        if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== d) return null;   // respinge 2026-02-31
        return { y: y, m: mo, d: d };
    }
    // Se lucrează la ora 12:00, ca schimbarea orei (vară/iarnă) să nu strice diferențele de zile
    function toDate(s) { const p = parse(s); return p ? new Date(p.y, p.m - 1, p.d, 12) : null; }
    function fromDate(dt) { return iso(dt.getFullYear(), dt.getMonth() + 1, dt.getDate()); }
    function addDays(s, n) { const dt = toDate(s); dt.setDate(dt.getDate() + n); return fromDate(dt); }
    function diffDays(a, b) { return Math.round((toDate(b) - toDate(a)) / 86400000); }
    function fmt(s) { const p = parse(s); return p ? pad(p.d) + '/' + pad(p.m) + '/' + p.y : ''; }
    function today() { return fromDate(new Date()); }

    // Luna afișată ca 42 de celule (6 rânduri × 7 zile), cu săptămâna de la luni; zilele din afara lunii sunt null
    function monthGrid(y, m) {
        const first = new Date(y, m - 1, 1, 12);
        const offset = (first.getDay() + 6) % 7;
        const daysInMonth = new Date(y, m, 0).getDate();
        const cells = [];
        for (let i = 0; i < 42; i++) {
            const day = i - offset + 1;
            cells.push(day >= 1 && day <= daysInMonth ? iso(y, m, day) : null);
        }
        return cells;
    }

    function fmtTpl(str, vars) { return String(str).replace(/\{(\w+)\}/g, function (x, k) { return vars[k] !== undefined ? vars[k] : x; }); }

    /* ------------------------------------------------------------------ componenta */
    // el: elementul cu câmpurile și calendarul (vezi index.html) · opts: { t(key, fallback), getLang(), onChange(range) }
    function create(el, opts) {
        opts = opts || {};
        const t = opts.t || function (k, fb) { return fb; };
        const lang = function () { return (opts.getLang && opts.getLang()) || 'ro'; };
        const locale = function () { return LOCALES[lang()] || 'ro-RO'; };
        const onChange = opts.onChange || function () { };
        const q = function (sel) { return el.querySelector(sel); };

        const startBtn = q('[data-date-field="start"]');
        const endBtn = q('[data-date-field="end"]');
        const startInput = q('[data-date-input="start"]');
        const endInput = q('[data-date-input="end"]');
        const hintEl = q('[data-date-hint]');
        const cal = q('[data-date-calendar]');
        const errorEl = q('[data-date-error]');

        const cfg = { defaultNights: 3, minNights: 2, maxNights: 14, fixed: false };
        const st = { start: null, end: null, open: false, mode: 'start', view: null, error: false };

        const minStart = function () { return addDays(today(), 1); };
        const maxStart = function () { return addDays(today(), MAX_AHEAD_DAYS); };
        const nights = function () { return st.start && st.end ? diffDays(st.start, st.end) : null; };
        const monthOf = function (s) { const p = parse(s); return { y: p.y, m: p.m }; };
        const monthKey = function (v) { return v.y * 12 + (v.m - 1); };

        function getRange() { return { start: st.start || '', end: st.end || '', nights: nights() }; }

        function validate() {
            if (!st.start || !st.end) return 'missing';
            const n = diffDays(st.start, st.end);
            if (st.start < minStart()) return 'past';
            if (n < cfg.minNights || n > cfg.maxNights) return 'range';
            return null;
        }

        // Ce poate face o zi din calendar, în funcție de pasul curent (alegi plecarea sau întoarcerea)
        function isDisabled(d) {
            if (st.mode === 'end' && st.start) {
                if (d < st.start) return d < minStart();                       // o zi mai devreme = plecare nouă
                if (d === st.start) return false;
                const n = diffDays(st.start, d);
                return n < cfg.minNights || n > cfg.maxNights;
            }
            return d < minStart() || d > maxStart();
        }

        /* ---------- afișare */
        function fieldClass(active, disabled) {
            return 'text-left px-3 py-2.5 rounded-xl border bg-white transition focus:outline-none focus:ring-2 focus:ring-brand-500 '
                + (st.error ? 'border-red-500 ' : (active ? 'border-brand-500 ' : 'border-slate-200 hover:border-brand-300 '))
                + (active ? 'ring-2 ring-brand-500 ' : '')
                + (disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer');
        }
        function valueClass(has) { return 'block text-sm ' + (has ? 'font-extrabold text-slate-800' : 'font-medium text-slate-400'); }

        function renderFields() {
            const ph = t('modal.datePlaceholder', 'zz/ll/aaaa');
            [[startBtn, st.start, 'start'], [endBtn, st.end, 'end']].forEach(function (row) {
                const btn = row[0], val = row[1], which = row[2];
                const disabled = which === 'end' && cfg.fixed;
                btn.className = fieldClass(st.open && st.mode === which, disabled);
                btn.disabled = disabled;
                btn.setAttribute('aria-expanded', st.open && st.mode === which ? 'true' : 'false');
                const v = btn.querySelector('[data-date-value]');
                v.textContent = val ? fmt(val) : ph;
                v.className = valueClass(!!val);
            });
            startInput.value = st.start || '';
            endInput.value = st.end || '';
        }

        function renderHint() {
            const n = nights();
            let text;
            if (cfg.fixed) text = fmtTpl(t('modal.dateHintFixed', 'Circuit cu durată fixă de {n} nopți: data întoarcerii se completează automat.'), { n: cfg.defaultNights });
            else if (!st.start) text = t('modal.dateHintStart', 'Alege data plecării din calendar.');
            else if (n === cfg.defaultNights) text = fmtTpl(t('modal.dateDuration', 'Durată: {n} nopți'), { n: n }) + ' · ' + t('modal.dateChangeEnd', 'poți schimba data întoarcerii');
            else text = fmtTpl(t('modal.dateDurationStd', 'Durată: {n} nopți (pachet standard: {std})'), { n: n, std: cfg.defaultNights });
            hintEl.textContent = text;
        }

        function renderCalendar() {
            if (!st.open) { cal.classList.add('hidden'); cal.innerHTML = ''; cal.removeAttribute('data-view'); return; }
            const v = st.view;
            const loc = locale();
            const monthLabel = new Date(v.y, v.m - 1, 1, 12).toLocaleString(loc, { month: 'long', year: 'numeric' });
            const canPrev = monthKey(v) > monthKey(monthOf(minStart()));
            const canNext = monthKey(v) < monthKey(monthOf(maxStart()));
            const navCls = 'w-10 h-10 rounded-full border border-slate-200 text-slate-700 hover:bg-brand-50 text-lg font-bold leading-none disabled:opacity-30 disabled:cursor-not-allowed';

            let html = '<div class="flex items-center justify-between mb-2">'
                + '<button type="button" data-cal-nav="-1" class="' + navCls + '" aria-label="' + t('modal.datePrev', 'Luna anterioară') + '"' + (canPrev ? '' : ' disabled') + '>‹</button>'
                + '<p class="text-sm font-extrabold text-slate-800 capitalize" aria-live="polite">' + monthLabel + '</p>'
                + '<button type="button" data-cal-nav="1" class="' + navCls + '" aria-label="' + t('modal.dateNext', 'Luna următoare') + '"' + (canNext ? '' : ' disabled') + '>›</button>'
                + '</div>';

            html += '<div class="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400 mb-1">';
            for (let i = 0; i < 7; i++) html += '<span>' + new Date(2024, 0, 1 + i, 12).toLocaleString(loc, { weekday: 'short' }).replace('.', '').slice(0, 2) + '</span>';
            html += '</div><div class="grid grid-cols-7 gap-y-1" role="grid">';

            monthGrid(v.y, v.m).forEach(function (d) {
                if (!d) { html += '<span></span>'; return; }
                const disabled = isDisabled(d);
                const isStart = d === st.start, isEnd = d === st.end;
                const inRange = st.start && st.end && d > st.start && d < st.end;
                let cls = 'h-10 sm:h-9 w-full text-xs font-semibold transition ';
                if (isStart || isEnd) cls += 'bg-brand-600 text-white rounded-lg ';
                else if (inRange) cls += 'bg-brand-100 text-brand-900 ';
                else cls += 'rounded-lg text-slate-700 ' + (disabled ? '' : 'hover:bg-brand-50 ');
                if (disabled) cls += ((inRange || isStart || isEnd) ? '' : 'opacity-30 ') + 'cursor-not-allowed';   // zilele din interval nu se estompează
                const label = toDate(d).toLocaleDateString(loc, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                html += '<button type="button" data-date="' + d + '" class="' + cls + '" aria-label="' + label + '"'
                    + (disabled ? ' disabled' : '') + ((isStart || isEnd) ? ' aria-pressed="true"' : '') + '>' + parse(d).d + '</button>';
            });
            html += '</div>';

            let calHint;
            if (st.mode === 'end' && st.start) calHint = fmtTpl(t('modal.dateHintEnd', 'Alege data întoarcerii ({min}–{max} nopți).'), { min: cfg.minNights, max: cfg.maxNights });
            else calHint = t('modal.dateHintStart', 'Alege data plecării din calendar.');
            html += '<div class="mt-3 flex items-center justify-between gap-2">'
                + '<p class="text-[11px] text-slate-500 leading-snug">' + calHint + '</p>'
                + '<div class="flex items-center gap-1.5 shrink-0">'
                + '<button type="button" data-cal-clear class="px-3 py-2 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-slate-100">' + t('modal.dateClear', 'Șterge') + '</button>'
                + '<button type="button" data-cal-close class="px-3 py-2 rounded-lg text-[11px] font-bold bg-brand-600 text-white hover:opacity-90">' + t('modal.dateDone', 'Gata') + '</button>'
                + '</div></div>';

            cal.innerHTML = html;
            cal.setAttribute('data-view', v.y + '-' + pad(v.m));
            cal.classList.remove('hidden');
        }

        function render() { renderFields(); renderHint(); renderCalendar(); }

        /* ---------- acțiuni */
        function clearError() {
            st.error = false;
            errorEl.classList.add('hidden');
            [startBtn, endBtn].forEach(function (b) { b.classList.remove('border-red-500'); });
        }
        function showError(message) {
            st.error = true;                       // rămâne marcat și după redesenări (ex. când se deschide calendarul)
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
            renderFields();
        }
        function commit() { clearError(); render(); onChange(getRange()); }

        function open(mode) {
            st.open = true;
            st.mode = (mode === 'end' && st.start && !cfg.fixed) ? 'end' : 'start';
            st.view = monthOf(st.start || minStart());
            render();
        }
        function close(returnFocus) {
            if (!st.open) return;
            const which = st.mode;
            st.open = false; render();
            if (returnFocus) (which === 'end' && !cfg.fixed ? endBtn : startBtn).focus();   // tastatură: focusul revine pe câmp
        }

        function setStart(d) {
            st.start = d;
            st.end = addDays(d, cfg.defaultNights);          // durata standard, ca sugestie
            st.view = monthOf(d);
            if (cfg.fixed) { st.open = false; } else { st.mode = 'end'; }
            commit();
        }
        function setEnd(d) { st.end = d; st.open = false; commit(); }

        // Programatic (folosit și la teste): setRange('2026-12-20', '2026-12-27')
        function setRange(start, end) {
            st.start = start || null; st.end = end || null; st.open = false;
            commit();
        }

        function clear() {
            st.start = null; st.end = null; st.mode = 'start'; st.view = monthOf(minStart());
            commit();
        }

        function configure(c) { Object.assign(cfg, c || {}); }
        function reset(silent) {
            st.start = null; st.end = null; st.open = false; st.mode = 'start'; st.view = null;
            clearError(); renderFields(); renderHint(); renderCalendar();
            if (!silent) onChange(getRange());
        }

        /* ---------- evenimente */
        startBtn.addEventListener('click', function () { if (st.open && st.mode === 'start') close(); else open('start'); });
        endBtn.addEventListener('click', function () {
            if (cfg.fixed) return;
            if (!st.start) { open('start'); return; }
            if (st.open && st.mode === 'end') close(); else open('end');
        });

        cal.addEventListener('click', function (e) {
            const dayBtn = e.target.closest('[data-date]');
            if (dayBtn && !dayBtn.disabled) {
                const d = dayBtn.getAttribute('data-date');
                if (st.mode === 'end' && st.start && d > st.start) setEnd(d);
                else if (st.mode === 'end' && d === st.start) { /* ziua de plecare: nicio schimbare */ }
                else setStart(d);
                // tastatură: focusul nu se pierde la redesenare
                const again = st.open ? cal.querySelector('[data-date="' + d + '"]') : (st.mode === 'end' && !cfg.fixed ? endBtn : startBtn);
                if (again) again.focus();
                return;
            }
            const nav = e.target.closest('[data-cal-nav]');
            if (nav && !nav.disabled) {
                const idx = st.view.y * 12 + (st.view.m - 1) + parseInt(nav.getAttribute('data-cal-nav'), 10);
                st.view = { y: Math.floor(idx / 12), m: (idx % 12) + 1 };
                renderCalendar();
                const keep = cal.querySelector('[data-cal-nav="' + nav.getAttribute('data-cal-nav') + '"]:not([disabled])') || cal.querySelector('[data-cal-nav]:not([disabled])');
                if (keep) keep.focus();
                return;
            }
            if (e.target.closest('[data-cal-clear]')) { clear(); open('start'); return; }
            if (e.target.closest('[data-cal-close]')) { close(true); }
        });

        // Click în afara componentei închide calendarul. composedPath() rămâne corect și după ce calendarul se redesenează.
        document.addEventListener('click', function (e) {
            if (st.open && e.composedPath().indexOf(el) === -1) close();
        });
        // Esc închide doar calendarul (faza de captură: handlerul care închide fereastra de rezervare nu mai primește tasta)
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && st.open) { e.stopPropagation(); close(true); }
        }, true);

        return { configure: configure, reset: reset, getRange: getRange, validate: validate, open: open, close: close,
                 refresh: render, setRange: setRange, clear: clear, showError: showError, clearError: clearError, isOpen: function () { return st.open; } };
    }

    const api = { MAX_AHEAD_DAYS: MAX_AHEAD_DAYS, iso: iso, parse: parse, toDate: toDate, addDays: addDays, diffDays: diffDays, fmt: fmt, today: today, monthGrid: monthGrid, create: create };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.FVDateRange = api;
})(typeof window !== 'undefined' ? window : globalThis);
