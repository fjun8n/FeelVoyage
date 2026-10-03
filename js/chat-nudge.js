/* FeelVoyage — „norișorul" care iese din chatbot: un mic mesaj prietenos, de tipul „Ai vreo întrebare? Mă poți
   întreba orice!", care apare singur lângă buton după câteva secunde, ca botul să pară mai viu. Apare o singură
   dată pe vizită, doar dacă chatul nu a fost deja deschis, și nu mai apare o vreme dacă e închis manual. */
(function () {
    'use strict';
    const KEY_DISMISSED = 'fv_chat_nudge_dismissed_at';
    const SNOOZE_HOURS = 6;
    const SHOW_DELAY_MS = 9000;

    const bubble = document.getElementById('chatNudgeBubble');
    const closeBtn = document.getElementById('chatNudgeClose');
    const toggleBtn = document.getElementById('chatToggleBtn');
    if (!bubble || !closeBtn || !toggleBtn) return;

    const store = (typeof fvStore !== 'undefined') ? fvStore : {
        get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
        set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignorat */ } }
    };

    function snoozed() {
        const n = parseInt(store.get(KEY_DISMISSED), 10);
        return Number.isFinite(n) && (Date.now() - n) < SNOOZE_HOURS * 3600000;
    }
    function setSnoozed() { store.set(KEY_DISMISSED, String(Date.now())); }

    let shown = false;
    function hide() {
        bubble.classList.add('opacity-0', 'translate-y-2');
        setTimeout(function () { bubble.classList.add('hidden'); }, 300);
    }
    function show() {
        if (shown || snoozed() || (typeof isChatOpen !== 'undefined' && isChatOpen)) return;
        shown = true;
        bubble.classList.remove('hidden');
        requestAnimationFrame(function () { bubble.classList.remove('opacity-0', 'translate-y-2'); });
        // dacă nimeni nu-l atinge, dispare singur după un timp — nu rămâne agățat acolo la nesfârșit
        setTimeout(function () { if (!bubble.classList.contains('hidden')) { setSnoozed(); hide(); } }, 11000);
    }

    closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        setSnoozed();
        hide();
    });
    // click pe restul norișorului deschide direct chatul (nu doar îl închide)
    bubble.addEventListener('click', function () {
        setSnoozed();
        hide();
        if (typeof toggleChat === 'function' && !(typeof isChatOpen !== 'undefined' && isChatOpen)) toggleChat();
    });
    // dacă se deschide chatul din buton, norișorul nu mai are rost
    toggleBtn.addEventListener('click', function () { setSnoozed(); hide(); });

    setTimeout(show, SHOW_DELAY_MS);
})();
