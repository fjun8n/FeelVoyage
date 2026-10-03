/* FeelVoyage — pop-up mic, în colțul din dreapta sus, care reamintește vizitatorilor autentificați să se aboneze la
   newsletter. Apare DOAR dacă omul are cont (e autentificat) ȘI nu s-a abonat deja. Dacă îl închide fără să bifeze,
   nu mai apare o vreme (SNOOZE_DAYS), ca să nu fie enervant — nu la fiecare reîncărcare a paginii. */
(function () {
    'use strict';
    const KEY_DISMISSED = 'fv_newsletter_popup_dismissed_at';
    const SNOOZE_DAYS = 7;
    const SHOW_DELAY_MS = 2500;   // mică întârziere, ca să nu sară peste restul paginii imediat la încărcare

    const popup = document.getElementById('newsletterPopup');
    const checkbox = document.getElementById('newsletterPopupCheckbox');
    const closeBtn = document.getElementById('newsletterPopupClose');
    if (!popup || !checkbox || !closeBtn) return;

    const store = (typeof fvStore !== 'undefined') ? fvStore : {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorat */ } }
    };
    const t = (key, fb) => (typeof tr === 'function' ? tr(key, fb) : fb);

    function snoozed() {
        const n = parseInt(store.get(KEY_DISMISSED), 10);
        return Number.isFinite(n) && (Date.now() - n) < SNOOZE_DAYS * 86400000;
    }
    function setSnoozed() { store.set(KEY_DISMISSED, String(Date.now())); }

    let visible = false;
    function hide() {
        if (!visible) return;
        visible = false;
        popup.classList.add('opacity-0', '-translate-y-2');
        setTimeout(function () { popup.classList.add('hidden'); }, 300);
    }
    function show() {
        if (visible || snoozed()) return;
        visible = true;
        popup.classList.remove('hidden');
        requestAnimationFrame(function () { popup.classList.remove('opacity-0', '-translate-y-2'); });
    }

    closeBtn.addEventListener('click', function () {
        setSnoozed();
        hide();
    });

    checkbox.addEventListener('change', function () {
        if (!checkbox.checked || !window.FVBackend) return;
        checkbox.disabled = true;
        window.FVBackend.setNewsletter(true).then(function () {
            if (typeof window.fvToast === 'function') window.fvToast(t('newsletter.popup.thanks', 'Te-ai abonat! Îți mulțumim.'), 'success');
            setTimeout(hide, 1100);
        }).catch(function () {
            checkbox.checked = false;
            checkbox.disabled = false;
            if (typeof window.fvToast === 'function') window.fvToast(t('newsletter.popup.error', 'Nu am putut salva abonarea. Încearcă din nou.'), 'error');
        });
    });

    // Apare doar dacă omul e autentificat ȘI nu e deja abonat; dacă se dezabonează/delogează cât timp e vizibil, se ascunde.
    let everShown = false;
    if (window.FVBackend) {
        window.FVBackend.onAuth(function (session) {
            if (!session || session.newsletter) { hide(); return; }
            if (everShown) return;
            everShown = true;
            setTimeout(show, SHOW_DELAY_MS);
        });
    }
})();
