/* FeelVoyage — modul luminos / întunecat.
   Clasa "dark" de pe <html> este pusă încă din <head> (script mic inline), ca pagina să nu „clipească" la încărcare.
   Aici doar gestionăm butoanele de comutare și reținem alegerea vizitatorului. */
(function () {
    'use strict';

    const KEY = 'fv_theme';
    const root = document.documentElement;
    const media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    const metaTheme = document.querySelector('meta[name="theme-color"]');

    function stored() { try { const v = localStorage.getItem(KEY); return (v === 'dark' || v === 'light') ? v : null; } catch (e) { return null; } }
    function current() { return root.classList.contains('dark') ? 'dark' : 'light'; }
    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }

    function updateButtons() {
        const dark = current() === 'dark';
        const label = dark ? trF('nav.toLight', 'Comută la modul luminos') : trF('nav.toDark', 'Comută la modul întunecat');
        document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
            btn.setAttribute('aria-label', label);
            btn.setAttribute('title', label);
            btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
        });
    }

    function apply(theme, persist) {
        root.classList.toggle('dark', theme === 'dark');
        root.style.colorScheme = theme;
        if (metaTheme) metaTheme.setAttribute('content', theme === 'dark' ? '#0b1220' : '#f8fafc');
        if (persist) { try { localStorage.setItem(KEY, theme); } catch (e) { /* ignorat */ } if (window.FVLog) FVLog.info('app', 'theme', { theme: theme }); }
        updateButtons();
    }

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
        btn.addEventListener('click', function () { apply(current() === 'dark' ? 'light' : 'dark', true); });
    });

    // Cât timp vizitatorul n-a ales manual, urmărim setarea telefonului / computerului
    if (media) {
        const onChange = function (e) { if (!stored()) apply(e.matches ? 'dark' : 'light', false); };
        if (media.addEventListener) media.addEventListener('change', onChange); else if (media.addListener) media.addListener(onChange);
    }

    document.addEventListener('fv:language', updateButtons);
    window.fvTheme = { get: current, set: function (t) { apply(t === 'dark' ? 'dark' : 'light', true); } };

    apply(current(), false);   // sincronizează meta theme-color și etichetele cu starea inițială
})();
