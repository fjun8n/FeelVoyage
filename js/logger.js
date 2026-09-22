/* FeelVoyage — jurnalul site-ului (log-uri).
   Se încarcă PRIMUL, ca să prindă și erorile din celelalte scripturi. Ce face:
   • păstrează ultimele 300 de evenimente într-un buffer circular, salvat în localStorage (pe dispozitiv; NU se trimite nicăieri);
   • prinde singur: erori JavaScript, promisiuni respinse, poze/scripturi care nu se încarcă, avertismentele și erorile din consolă, pierderea conexiunii;
   • măsoară indicatorii de performanță (FCP, LCP, CLS, sarcini lungi, răspuns la atingere) și îi rezumă în evenimentul „perf.summary”;
   • șterge datele personale înainte de scriere (e-mail, telefon, nume, parole, mesaje) — vezi „redact” mai jos;
   • poate fi citit de administrator (buton „Jurnal” în profil) și exportat JSON / CSV.
   Folosire din cod: fvLog('categorie', 'eveniment', { ...date fără date personale }) sau FVLog.warn/error(...). Modul de depanare: adaugă ?debug=1 în adresă
   (evenimentele apar și în consola browserului). Nu are nicio dependență și nu poate strica pagina: orice eroare internă e ignorată. */
(function (root) {
    'use strict';

    var KEY = 'fv_logs';
    var MAX_ENTRIES = 300;
    var MAX_BYTES = 90000;                                   // plafon pentru ce se salvează în localStorage
    var LEVELS = { debug: 0, info: 1, warn: 2, error: 3 };
    var sid = Math.random().toString(36).slice(2, 8);          // identifică o vizită (o încărcare de pagină)
    var seq = 0;
    var entries = [];
    var saveTimer = null;
    var debugOn = false;
    var sinks = [];
    var origConsole = { warn: console.warn, error: console.error };

    /* ---------------------------------------------------------------- stocare */
    function load() {
        try {
            var raw = root.localStorage.getItem(KEY);
            var arr = raw ? JSON.parse(raw) : [];
            if (Array.isArray(arr)) entries = arr.filter(function (e) { return e && typeof e === 'object' && e.e; }).slice(-MAX_ENTRIES);
            entries.forEach(function (e) { if (e.n > seq) seq = e.n; });
        } catch (err) { entries = []; }
    }
    function save() {
        saveTimer = null;
        try {
            var json = JSON.stringify(entries);
            while (json.length > MAX_BYTES && entries.length > 20) { entries.splice(0, Math.ceil(entries.length / 5)); json = JSON.stringify(entries); }
            root.localStorage.setItem(KEY, json);
        } catch (err) { /* spațiu plin / stocare dezactivată: rămâne doar în memorie */ }
    }
    function scheduleSave() { if (saveTimer == null) saveTimer = setTimeout(save, 900); }

    /* ---------------------------------------------------------------- date personale */
    // valori ale căror chei arată a date personale nu se scriu niciodată; șirurile mai lungi se taie; e-mailurile și telefoanele din text se maschează
    var SENSITIVE_KEY = /(e-?mail|phone|telefon|tel\b|name|nume|prenume|pass|parol|token|secret|key|cheie|mesaj|message|text|adres|address|cnp|card|iban|uid|query|q\b)/i;
    var EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
    var PHONE_RE = /\+?\d[\d\s().-]{7,}\d/g;
    function redactString(s) {
        s = String(s).replace(EMAIL_RE, '[email]').replace(PHONE_RE, '[telefon]');
        return s.length > 220 ? s.slice(0, 220) + '…' : s;
    }
    function clean(v, depth, key) {
        if (key === 'acct') return typeof v === 'string' ? v.slice(0, 40) : undefined;   // identificatorul contului (nu e e-mail): îl vede doar administratorul, legat de e-mail în fereastra „Jurnal”
        if (key && SENSITIVE_KEY.test(key)) return '[redactat]';
        if (v == null) return v;
        var t = typeof v;
        if (t === 'number') return isFinite(v) ? Math.round(v * 100) / 100 : null;
        if (t === 'boolean') return v;
        if (t === 'string') return redactString(v);
        if (t === 'function') return '[funcție]';
        if (depth > 2) return '[…]';
        if (v instanceof Error) return { name: v.name, msg: redactString(v.message || '') };
        if (typeof Node !== 'undefined' && v instanceof Node) return '<' + String(v.nodeName || '').toLowerCase() + '>';
        if (Array.isArray(v)) return v.slice(0, 12).map(function (x) { return clean(x, depth + 1); });
        if (t === 'object') {
            var out = {}, n = 0;
            for (var k in v) { if (!Object.prototype.hasOwnProperty.call(v, k)) continue; if (++n > 16) break; out[k] = clean(v[k], depth + 1, k); }
            return out;
        }
        return String(v);
    }

    /* ---------------------------------------------------------------- scriere */
    var lastKey = '', lastAt = 0, lastEntry = null;
    function log(level, cat, ev, data) {
        try {
            if (!LEVELS.hasOwnProperty(level)) level = 'info';
            var d = data === undefined ? undefined : clean(data, 0);
            var key = level + '|' + cat + '|' + ev + '|' + (d === undefined ? '' : JSON.stringify(d));
            var now = Date.now();
            // același eveniment repetat în mai puțin de 2 s: crește un contor în loc să umple jurnalul
            if (key === lastKey && now - lastAt < 2000 && lastEntry) { lastEntry.r = (lastEntry.r || 1) + 1; lastAt = now; scheduleSave(); return lastEntry; }
            var entry = { n: ++seq, t: now, s: sid, l: level, c: String(cat), e: String(ev) };
            if (d !== undefined) entry.d = d;
            entries.push(entry);
            if (entries.length > MAX_ENTRIES) entries.splice(0, entries.length - MAX_ENTRIES);
            lastKey = key; lastAt = now; lastEntry = entry;
            scheduleSave();
            if (debugOn) { try { (origConsole.debug || console.log).call(console, '[FV]', level, cat + '.' + ev, d === undefined ? '' : d); } catch (e2) { } }
            for (var i = 0; i < sinks.length; i++) { try { sinks[i](entry); } catch (e3) { } }
            return entry;
        } catch (err) { return null; }
    }

    /* ---------------------------------------------------------------- export */
    function csvCell(v) { var s = v == null ? '' : String(v); return /[",\n;]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }
    function toCSV(list) {
        var rows = ['nr;ora;vizita;nivel;categorie;eveniment;repetari;date'];
        (list || entries).forEach(function (e) { rows.push([e.n, new Date(e.t).toISOString(), e.s, e.l, e.c, e.e, e.r || 1, e.d === undefined ? '' : JSON.stringify(e.d)].map(csvCell).join(';')); });
        return rows.join('\n');
    }
    function download(kind, list, label) {
        try {
            var isCsv = kind === 'csv';
            var data = list || entries;
            var blob = new Blob([isCsv ? '\ufeff' + toCSV(data) : JSON.stringify(data, null, 2)], { type: isCsv ? 'text/csv;charset=utf-8' : 'application/json' });
            var a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'feelvoyage-jurnal-' + (label ? label + '-' : '') + new Date().toISOString().slice(0, 10) + (isCsv ? '.csv' : '.json');
            document.body.appendChild(a); a.click();
            setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
            return true;
        } catch (e) { return false; }
    }
    function stats() {
        var by = { debug: 0, info: 0, warn: 0, error: 0 }, cats = {}, sessions = {};
        entries.forEach(function (e) { var n = e.r || 1; by[e.l] = (by[e.l] || 0) + n; cats[e.c] = (cats[e.c] || 0) + n; sessions[e.s] = 1; });
        return { total: entries.length, levels: by, categories: cats, sessions: Object.keys(sessions).length, first: entries.length ? entries[0].t : null, last: entries.length ? entries[entries.length - 1].t : null };
    }

    /* ---------------------------------------------------------------- măsurători de timp */
    // const done = FVLog.time('catalog', 'open'); ... done({ extra }) — scrie durata; peste 250 ms devine avertisment „perf.slow”
    function time(cat, ev, slowMs) {
        var t0 = root.performance && performance.now ? performance.now() : Date.now();
        return function (extra) {
            var ms = Math.round((root.performance && performance.now ? performance.now() : Date.now()) - t0);
            var d = extra && typeof extra === 'object' ? extra : {};
            d.ms = ms;
            var limit = slowMs == null ? 250 : slowMs;
            log(ms > limit ? 'warn' : 'info', cat, ev, d);
            if (ms > limit) log('warn', 'perf', 'slow', { what: cat + '.' + ev, ms: ms });
            return ms;
        };
    }

    /* ---------------------------------------------------------------- erori */
    function baseName(u) { try { var p = String(u).split('?')[0].split('#')[0].split('/'); return p[p.length - 1] || p[p.length - 2] || ''; } catch (e) { return ''; } }
    function hostOf(u) { try { return new URL(u, root.location.href).host; } catch (e) { return ''; } }

    root.addEventListener('error', function (e) {
        try {
            var t = e.target;
            if (t && t !== root && t.tagName) {                                   // resursă (poză, script, stil) care nu s-a încărcat
                var src = t.currentSrc || t.src || t.href || '';
                log('warn', 'resource', 'fail', { tag: String(t.tagName).toLowerCase(), host: hostOf(src), file: baseName(src).slice(0, 80) });
                return;
            }
            log('error', 'js', 'error', { msg: e.message, file: baseName(e.filename), line: e.lineno, col: e.colno });
        } catch (err) { }
    }, true);
    root.addEventListener('unhandledrejection', function (e) {
        try { var r = e && e.reason; log('error', 'js', 'unhandledrejection', { msg: r && r.message ? r.message : String(r), code: r && r.code }); } catch (err) { }
    });
    root.addEventListener('securitypolicyviolation', function (e) {
        try { log('error', 'security', 'csp', { directive: e.violatedDirective, blocked: hostOf(e.blockedURI) || String(e.blockedURI).slice(0, 40) }); } catch (err) { }
    });
    root.addEventListener('offline', function () { log('warn', 'net', 'offline'); });
    root.addEventListener('online', function () { log('info', 'net', 'online'); });

    // avertismentele și erorile din consolă (inclusiv cele din backend.js / ai.js) intră și ele în jurnal; consola rămâne neschimbată
    function wrapConsole(name, level) {
        var orig = origConsole[name];
        if (typeof orig !== 'function') return;
        console[name] = function () {
            try {
                var a = Array.prototype.slice.call(arguments);
                var first = typeof a[0] === 'string' ? a[0] : '';
                if (first.indexOf('[FV]') !== 0 && !/Failed to load resource/.test(first)) {
                    var text = a.map(function (x) { return x instanceof Error ? x.message : (typeof x === 'string' ? x : ''); }).filter(Boolean).join(' ');
                    log(level, 'console', name, { msg: text });
                }
            } catch (e) { }
            return orig.apply(console, arguments);
        };
    }

    /* ---------------------------------------------------------------- performanță */
    var vitals = { fcp: null, lcp: null, cls: 0, longTasks: 0, tbt: 0, maxLong: 0, worstEvent: 0 };
    function observe(type, cb, opts) {
        try {
            if (!root.PerformanceObserver || (PerformanceObserver.supportedEntryTypes && PerformanceObserver.supportedEntryTypes.indexOf(type) === -1)) return;
            var o = new PerformanceObserver(function (list) { try { list.getEntries().forEach(cb); } catch (e) { } });
            var init = { type: type, buffered: true };
            if (opts) for (var k in opts) init[k] = opts[k];
            o.observe(init);
        } catch (e) { }
    }
    observe('paint', function (en) { if (en.name === 'first-contentful-paint') vitals.fcp = Math.round(en.startTime); });
    observe('largest-contentful-paint', function (en) { vitals.lcp = Math.round(en.startTime); });
    observe('layout-shift', function (en) { if (!en.hadRecentInput) vitals.cls = Math.round((vitals.cls + en.value) * 1000) / 1000; });
    observe('longtask', function (en) { vitals.longTasks++; vitals.tbt += Math.max(0, en.duration - 50); vitals.maxLong = Math.max(vitals.maxLong, Math.round(en.duration)); });
    observe('event', function (en) { if (en.duration > vitals.worstEvent) vitals.worstEvent = Math.round(en.duration); }, { durationThreshold: 40 });

    function navTimes() {
        var out = { ttfb: null, dcl: null, load: null, transferKB: null };
        try {
            var n = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
            if (n) {
                out.ttfb = Math.round(n.responseStart); out.dcl = Math.round(n.domContentLoadedEventEnd);
                out.load = n.loadEventEnd ? Math.round(n.loadEventEnd) : null; out.transferKB = n.transferSize ? Math.round(n.transferSize / 1024) : null;
            } else if (performance.timing) {                                     // browsere vechi: API-ul mai vechi „performance.timing”
                var t = performance.timing, s = t.navigationStart;
                if (t.responseStart > s) out.ttfb = t.responseStart - s;
                if (t.domContentLoadedEventEnd > s) out.dcl = t.domContentLoadedEventEnd - s;
                if (t.loadEventEnd > s) out.load = t.loadEventEnd - s;
            }
        } catch (e) { }
        return out;
    }
    function summary(ev) {
        var d = navTimes();
        d.fcp = vitals.fcp; d.lcp = vitals.lcp; d.cls = vitals.cls; d.longTasks = vitals.longTasks; d.tbt = Math.round(vitals.tbt); d.maxLongTask = vitals.maxLong; d.worstInput = vitals.worstEvent || null;
        // verdict simplu după pragurile Google („bun” / „de îmbunătățit” / „slab”)
        var bad = (vitals.lcp && vitals.lcp > 4000) || vitals.cls > 0.25 || vitals.worstEvent > 500 || vitals.tbt > 600;
        var mid = (vitals.lcp && vitals.lcp > 2500) || vitals.cls > 0.1 || vitals.worstEvent > 200 || vitals.tbt > 200;
        d.verdict = bad ? 'slab' : (mid ? 'de îmbunătățit' : 'bun');
        log(bad ? 'warn' : 'info', 'perf', ev, d);
    }
    var summarized = false;
    function afterLoad() { setTimeout(function () { if (!summarized) { summarized = true; summary('summary'); } }, 4000); }
    if (document.readyState === 'complete') afterLoad(); else root.addEventListener('load', afterLoad);
    document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') { if (summarized) summary('final'); save(); } });
    root.addEventListener('pagehide', function () { save(); });

    /* ---------------------------------------------------------------- pornire */
    load();
    try { debugOn = /[?&]debug=1\b/.test(root.location.search) || root.localStorage.getItem('fv_debug') === '1'; } catch (e) { }
    wrapConsole('warn', 'warn');
    wrapConsole('error', 'error');
    log('info', 'app', 'start', {
        path: root.location.pathname.split('/').pop() || '/',
        viewport: root.innerWidth + 'x' + root.innerHeight,
        dpr: root.devicePixelRatio || 1,
        touch: ('ontouchstart' in root) || (navigator.maxTouchPoints > 0),
        memoryGB: navigator.deviceMemory || null,
        cores: navigator.hardwareConcurrency || null,
        net: (navigator.connection && navigator.connection.effectiveType) || null,
        saveData: !!(navigator.connection && navigator.connection.saveData),
        reducedMotion: !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches)
    });

    var api = {
        log: log,
        debug: function (c, e, d) { return log('debug', c, e, d); },
        info: function (c, e, d) { return log('info', c, e, d); },
        warn: function (c, e, d) { return log('warn', c, e, d); },
        error: function (c, e, d) { return log('error', c, e, d); },
        time: time,
        getAll: function () { return entries.slice(); },
        stats: stats,
        toCSV: toCSV,
        toJSON: function () { return JSON.stringify(entries, null, 2); },
        download: download,
        clear: function () { entries = []; lastEntry = null; lastKey = ''; try { root.localStorage.removeItem(KEY); } catch (e) { } log('info', 'log', 'cleared'); },
        vitals: function () { return JSON.parse(JSON.stringify(vitals)); },
        summary: summary,
        flush: save,
        addSink: function (fn) { if (typeof fn === 'function') sinks.push(fn); },   // ex.: trimitere către un server propriu (nu e folosit implicit)
        setDebug: function (on) { debugOn = !!on; try { root.localStorage.setItem('fv_debug', on ? '1' : '0'); } catch (e) { } },
        sessionId: sid,
        redact: function (v) { return clean(v, 0); },
        MAX_ENTRIES: MAX_ENTRIES
    };
    root.FVLog = api;
    root.fvLog = function (cat, ev, data) { return log('info', cat, ev, data); };
})(window);
