/* FeelVoyage — vizualizatorul jurnalului (doar pentru administrator).
   Apare ca buton „Jurnal” lângă „Utilizatori”, în profilul administratorului (același eveniment ca panoul de utilizatori: fv:profile).
   Arată ce a scris js/logger.js pe ACEST dispozitiv: statistici, ultimii indicatori de performanță, evenimente filtrabile, export JSON / CSV, ștergere.
   Jurnalul nu se trimite nicăieri și nu conține date personale (e-mail, telefon, nume, texte scrise de vizitatori sunt șterse înainte de scriere).
   Testare fără cont de administrator: FVLogView.open() în consolă. */
(function (root) {
    'use strict';
    var doc = root.document;
    var modal = null, adminOn = false, filt = { level: 'all', cat: 'all', q: '' }, openIds = {};

    function trF(k, fb) { return (typeof root.tr === 'function') ? root.tr(k, fb) : fb; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function $(id) { return doc.getElementById(id); }
    function pad(n) { return n < 10 ? '0' + n : String(n); }
    function hhmmss(ms) { var d = new Date(ms); return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); }
    function dayOf(ms) { var d = new Date(ms); return pad(d.getDate()) + '.' + pad(d.getMonth() + 1); }

    /* ------------------------------------------------------------ buton în profil */
    function removeButton() { var b = $('adminLogBtn'); if (b) b.remove(); }
    function mountButton() {
        var row = $('profileNameRow');
        if (!row || !adminOn) return;
        var b = $('adminLogBtn');
        if (!b) {
            b = doc.createElement('button');
            b.id = 'adminLogBtn'; b.type = 'button'; b.className = 'lv-btn';
            b.addEventListener('click', open);
            row.appendChild(b);
        }
        b.innerHTML = '<i class="fa-solid fa-clipboard-list"></i><span>' + esc(trF('log.btn', 'Jurnal')) + '</span>';
        b.setAttribute('aria-label', trF('log.btn', 'Jurnal'));
    }
    doc.addEventListener('fv:profile', function (e) { adminOn = !!(e.detail && e.detail.admin); if (adminOn) mountButton(); else { removeButton(); close(); } });
    doc.addEventListener('fv:language', function () { if (adminOn) mountButton(); if (isOpen()) { build(); render(); } });

    /* ------------------------------------------------------------ fereastra */
    function isOpen() { return !!modal && !modal.classList.contains('hidden'); }

    function build() {
        if (!modal) {
            modal = doc.createElement('div');
            modal.id = 'logModal'; modal.className = 'lv-modal hidden';
            modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true'); modal.setAttribute('aria-labelledby', 'lvTitle');
            doc.body.appendChild(modal);
            modal.addEventListener('click', function (e) {
                if (e.target === modal) return close();
                var t = e.target.closest && e.target.closest('[data-lv]');
                if (!t) return;
                var a = t.getAttribute('data-lv');
                if (a === 'close') close();
                else if (a === 'json') root.FVLog.download('json');
                else if (a === 'csv') root.FVLog.download('csv');
                else if (a === 'refresh') render();
                else if (a === 'clear') { if (root.confirm(trF('log.confirmClear', 'Ștergi tot jurnalul de pe acest dispozitiv?'))) { root.FVLog.clear(); openIds = {}; render(); } }
                else if (a === 'row') { var n = t.getAttribute('data-n'); openIds[n] = !openIds[n]; render(true); }
            });
            modal.addEventListener('input', function (e) {
                if (e.target.id === 'lvLevel') filt.level = e.target.value;
                else if (e.target.id === 'lvCat') filt.cat = e.target.value;
                else if (e.target.id === 'lvQ') filt.q = e.target.value;
                else return;
                renderList();
            });
        }
        modal.innerHTML =
            '<div class="lv-panel" id="lvPanel">' +
                '<div class="lv-head">' +
                    '<div class="lv-head-icon"><i class="fa-solid fa-clipboard-list"></i></div>' +
                    '<div class="lv-head-text"><h3 id="lvTitle">' + esc(trF('log.title', 'Jurnalul site-ului')) + '</h3><p>' + esc(trF('log.hint', 'Rămâne pe acest dispozitiv, fără date personale.')) + '</p></div>' +
                    '<button type="button" class="lv-x" data-lv="close" aria-label="' + esc(trF('about.close', 'Închide')) + '"><i class="fa-solid fa-xmark"></i></button>' +
                '</div>' +
                '<div class="lv-body">' +
                    '<div id="lvStats" class="lv-stats"></div>' +
                    '<div id="lvPerf" class="lv-perf"></div>' +
                    '<div class="lv-tools">' +
                        '<select id="lvLevel" class="lv-field" aria-label="' + esc(trF('log.level', 'Nivel')) + '"></select>' +
                        '<select id="lvCat" class="lv-field" aria-label="' + esc(trF('log.category', 'Categorie')) + '"></select>' +
                        '<input id="lvQ" type="search" class="lv-field lv-q" autocomplete="off" placeholder="' + esc(trF('log.search', 'Caută în jurnal…')) + '">' +
                    '</div>' +
                    '<div class="lv-actions">' +
                        '<button type="button" class="lv-act" data-lv="refresh"><i class="fa-solid fa-rotate"></i> ' + esc(trF('log.refresh', 'Actualizează')) + '</button>' +
                        '<button type="button" class="lv-act" data-lv="json"><i class="fa-solid fa-download"></i> JSON</button>' +
                        '<button type="button" class="lv-act" data-lv="csv"><i class="fa-solid fa-file-csv"></i> CSV</button>' +
                        '<button type="button" class="lv-act lv-danger" data-lv="clear"><i class="fa-solid fa-trash"></i> ' + esc(trF('log.clear', 'Șterge')) + '</button>' +
                    '</div>' +
                    '<p id="lvCount" class="lv-count"></p>' +
                    '<div id="lvList" class="lv-list" role="list"></div>' +
                '</div>' +
            '</div>';
        // păstrăm filtrele la reconstruire
        $('lvQ').value = filt.q;
    }

    function renderStats() {
        var s = root.FVLog.stats();
        $('lvStats').innerHTML =
            '<div class="lv-stat"><b>' + s.total + '</b><span>' + esc(trF('log.events', 'evenimente')) + '</span></div>' +
            '<div class="lv-stat lv-e"><b>' + (s.levels.error || 0) + '</b><span>' + esc(trF('log.errors', 'erori')) + '</span></div>' +
            '<div class="lv-stat lv-w"><b>' + (s.levels.warn || 0) + '</b><span>' + esc(trF('log.warnings', 'avertismente')) + '</span></div>' +
            '<div class="lv-stat"><b>' + s.sessions + '</b><span>' + esc(trF('log.sessions', 'vizite')) + '</span></div>';
        // ultimul rezumat de performanță
        var perf = root.FVLog.getAll().filter(function (e) { return e.c === 'perf' && (e.e === 'summary' || e.e === 'final') && e.d; }).pop();
        var mode = doc.documentElement.getAttribute('data-perf') === 'lite';
        var html = '<div class="lv-perf-title"><i class="fa-solid fa-gauge-high"></i> ' + esc(trF('log.perf', 'Performanță')) + ' — ' + esc(mode ? trF('log.modeLite', 'mod rapid') : trF('log.modeFull', 'mod complet')) + '</div>';
        if (perf) {
            var d = perf.d;
            var v = d.verdict === 'bun' ? 'ok' : (d.verdict === 'slab' ? 'bad' : 'mid');
            html += '<div class="lv-perf-grid">' +
                cell('LCP', d.lcp != null ? d.lcp + ' ms' : '—') + cell('FCP', d.fcp != null ? d.fcp + ' ms' : '—') + cell('CLS', d.cls != null ? d.cls : '—') +
                cell('TBT', (d.tbt != null ? d.tbt : '—') + ' ms') + cell(esc(trF('log.longTasks', 'Sarcini lungi')), d.longTasks != null ? d.longTasks : '—') +
                cell(esc(trF('log.verdict', 'Verdict')), '<span class="lv-v lv-v-' + v + '">' + esc(d.verdict || '—') + '</span>') + '</div>';
        } else html += '<p class="lv-muted">' + esc(trF('log.perfWait', 'Rezumatul apare la 4 secunde după încărcarea paginii.')) + '</p>';
        $('lvPerf').innerHTML = html;
        function cell(k, val) { return '<div class="lv-cell"><span>' + k + '</span><b>' + val + '</b></div>'; }

        // liste de filtre
        var lv = $('lvLevel'), ct = $('lvCat');
        lv.innerHTML = ['all', 'error', 'warn', 'info', 'debug'].map(function (l) { return '<option value="' + l + '"' + (filt.level === l ? ' selected' : '') + '>' + esc(l === 'all' ? trF('log.allLevels', 'Toate nivelurile') : l) + '</option>'; }).join('');
        var cats = Object.keys(s.categories).sort();
        ct.innerHTML = '<option value="all">' + esc(trF('log.allCats', 'Toate categoriile')) + '</option>' + cats.map(function (c) { return '<option value="' + esc(c) + '"' + (filt.cat === c ? ' selected' : '') + '>' + esc(c) + ' (' + s.categories[c] + ')</option>'; }).join('');
        if (filt.cat !== 'all' && cats.indexOf(filt.cat) === -1) filt.cat = 'all';
    }

    function renderList() {
        var all = root.FVLog.getAll().slice().reverse();
        var q = filt.q.trim().toLowerCase();
        var rows = all.filter(function (e) {
            if (filt.level !== 'all' && e.l !== filt.level) return false;
            if (filt.cat !== 'all' && e.c !== filt.cat) return false;
            if (q && (e.c + '.' + e.e + ' ' + (e.d ? JSON.stringify(e.d) : '')).toLowerCase().indexOf(q) === -1) return false;
            return true;
        });
        $('lvCount').textContent = rows.length + ' / ' + all.length + ' ' + trF('log.events', 'evenimente');
        var shown = rows.slice(0, 120);
        $('lvList').innerHTML = shown.length ? shown.map(function (e) {
            var open = !!openIds[e.n];
            return '<div class="lv-row lv-l-' + esc(e.l) + '" role="listitem">' +
                '<button type="button" class="lv-row-head" data-lv="row" data-n="' + e.n + '" aria-expanded="' + open + '">' +
                    '<span class="lv-time">' + esc(dayOf(e.t) + ' ' + hhmmss(e.t)) + '</span>' +
                    '<span class="lv-chip">' + esc(e.l) + '</span>' +
                    '<span class="lv-name">' + esc(e.c + '.' + e.e) + '</span>' +
                    (e.r > 1 ? '<span class="lv-rep">×' + e.r + '</span>' : '') +
                '</button>' +
                (e.d !== undefined ? '<pre class="lv-data' + (open ? ' is-open' : '') + '">' + esc(JSON.stringify(e.d, null, open ? 2 : 0)) + '</pre>' : '') +
            '</div>';
        }).join('') + (rows.length > shown.length ? '<p class="lv-muted">… ' + esc(trF('log.older', 'mai vechi: exportă JSON / CSV pentru tot jurnalul')) + '</p>' : '') : '<p class="lv-muted">' + esc(trF('log.empty', 'Niciun eveniment pentru filtrele alese.')) + '</p>';
    }
    function render(keepScroll) {
        var sc = keepScroll && $('lvList') ? $('lvList').scrollTop : 0;
        renderStats(); renderList();
        if (keepScroll && $('lvList')) $('lvList').scrollTop = sc;
    }

    var locked = false, hideTimer = null;
    function open() {
        if (!root.FVLog) return;
        build(); render();
        clearTimeout(hideTimer);
        modal.classList.remove('hidden');
        if (!locked && typeof root.lockScroll === 'function') { root.lockScroll(true); locked = true; }
        requestAnimationFrame(function () { var p = $('lvPanel'); if (p) p.classList.add('is-open'); });
        root.FVLog.info('admin', 'log.open');
    }
    function close() {
        if (!isOpen()) return;
        if (locked && typeof root.lockScroll === 'function') { root.lockScroll(false); locked = false; }
        var p = $('lvPanel'); if (p) p.classList.remove('is-open');
        hideTimer = setTimeout(function () { if (modal) modal.classList.add('hidden'); }, 200);
    }
    doc.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) { e.stopPropagation(); close(); } });

    root.FVLogView = { open: open, close: close, isOpen: isOpen };
})(window);
