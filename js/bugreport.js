/* FeelVoyage — „Raportează un bug” (subsol, ambele site-uri). Funcționează fără cont; folosește
   window.FVBackend (site-ul principal) sau window.FVReviewsBackend (site-ul reviews) — pe oricare
   dintre ele e disponibil. Fișier identic pe ambele site-uri. */
(function () {
    'use strict';

    const btn = document.getElementById('bugReportBtn');
    const modal = document.getElementById('bugReportModal');
    if (!btn || !modal) return;
    const form = document.getElementById('bugReportForm');
    const textEl = document.getElementById('bugReportText');
    const emailEl = document.getElementById('bugReportEmail');
    const statusEl = document.getElementById('bugReportStatus');
    const submitBtn = document.getElementById('bugReportSubmitBtn');
    const closeBtn = document.getElementById('bugReportClose');

    function backend() { return window.FVBackend || window.FVReviewsBackend || null; }
    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }

    function open() {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        statusEl.className = 'hidden text-xs text-center';
        requestAnimationFrame(function () { textEl.focus(); });
    }
    function close() {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }

    btn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.classList.contains('hidden')) close(); });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const text = textEl.value.trim();
        if (text.length < 3) {
            statusEl.textContent = trF('bug.tooShort', 'Spune-ne puțin mai mult despre ce s-a întâmplat.');
            statusEl.className = 'text-xs text-center text-rose-500';
            return;
        }
        const be = backend();
        if (!be || !be.submitBugReport) {
            statusEl.textContent = trF('bug.unavailable', 'Momentan nu putem trimite raportul. Încearcă din nou mai târziu.');
            statusEl.className = 'text-xs text-center text-rose-500';
            return;
        }
        submitBtn.disabled = true;
        be.submitBugReport({ text: text, email: emailEl.value.trim(), page: location.pathname + location.hash }).then(function () {
            statusEl.textContent = trF('bug.thanks', 'Mulțumim! Am primit raportul.');
            statusEl.className = 'text-xs text-center text-emerald-600';
            form.reset();
            setTimeout(close, 1600);
        }).catch(function () {
            statusEl.textContent = trF('bug.error', 'Nu am putut trimite raportul. Încearcă din nou.');
            statusEl.className = 'text-xs text-center text-rose-500';
        }).finally(function () { submitBtn.disabled = false; });
    });
})();
