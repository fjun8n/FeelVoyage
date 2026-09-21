/* FeelVoyage — cutia „Conturi Create" din prima pagină: câte persoane au cont pe site.
   Cu Firebase configurat, numărul se actualizează live la toți vizitatorii când cineva își face un cont (vezi backend.js: onAccounts).
   Fără Firebase (mod de testare) se numără conturile din acest browser. Indicatorul „în direct" e cel din js/counter.js ([data-live-dot]). */
(function () {
    'use strict';
    const displays = document.querySelectorAll('[data-accounts-count]');
    if (!displays.length || !window.FVBackend || !FVBackend.onAccounts) return;

    let count = FVBackend.cachedAccounts();   // ultima valoare cunoscută, până sosește citirea de pe server
    let receivedFirst = false;

    function render() { displays.forEach(function (el) { el.textContent = String(count); }); }
    function pop(display) {
        display.classList.remove('counter-pop');
        void display.offsetWidth;   // repornește animația dacă vin mai multe schimbări rapide
        display.classList.add('counter-pop');
    }
    function floatText(display, text) {
        const plus = document.createElement('span');
        plus.className = 'plus-one';
        plus.textContent = text;
        plus.setAttribute('aria-hidden', 'true');
        plus.addEventListener('animationend', function () { plus.remove(); });
        setTimeout(function () { plus.remove(); }, 1500);   // plasă de siguranță
        display.parentElement.appendChild(plus);
    }

    FVBackend.onAccounts(function (value) {
        const delta = value - count;
        count = value;
        render();
        if (!receivedFirst) { receivedFirst = true; return; }   // prima citire: fără animație
        if (delta > 0) displays.forEach(function (d) { pop(d); floatText(d, '+' + delta); });
    });

    render();
})();
