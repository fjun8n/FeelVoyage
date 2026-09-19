/* FeelVoyage — contorul „Călători Fericiți".
   Pornește de la 0 și crește cu +1 la fiecare click al oricărui vizitator.
   Cu Firebase configurat, toți vizitatorii aflați pe pagină văd numărul schimbându-se live (vezi backend.js).
   Toate elementele [data-happy-counter] sunt butoane; toate [data-happy-count] afișează aceeași valoare. */
(function () {
    'use strict';

    const buttons = document.querySelectorAll('[data-happy-counter]');
    const displays = document.querySelectorAll('[data-happy-count]');
    const dots = document.querySelectorAll('[data-live-dot]');
    if (!buttons.length || !window.FVBackend) return;

    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }

    let count = FVBackend.cachedCount();   // ultima valoare cunoscută, până sosește citirea de pe server
    let receivedFirst = false;
    let pendingLocal = 0;                  // click-uri ale acestui vizitator încă neconfirmate

    function render() {
        displays.forEach(function (el) { el.textContent = String(count); });
    }

    // Numărul „sare" ușor și, opțional, un text (ex. +1) plutește deasupra lui
    function pop(display) {
        display.classList.remove('counter-pop');
        void display.offsetWidth;   // repornește animația dacă vin click-uri rapide
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

    // Se apelează la fiecare schimbare a valorii, inclusiv când ALȚI vizitatori dau click
    FVBackend.onCounter(function (value) {
        const delta = value - count;
        count = value;
        render();

        if (!receivedFirst) { receivedFirst = true; return; }   // prima citire: fără animație
        if (delta > 0) {
            const mine = Math.min(delta, pendingLocal);
            pendingLocal -= mine;
            const others = delta - mine;
            displays.forEach(function (d) {
                pop(d);
                if (others > 0) floatText(d, '+' + others);      // click-uri venite de la alți vizitatori
            });
        }
    });

    buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
            const display = btn.querySelector('[data-happy-count]');
            pendingLocal += 1;
            if (display) floatText(display, '+1');

            const settle = function () { pendingLocal = 0; };
            FVBackend.incrementCounter().then(settle, function () {
                settle();
                if (typeof window.fvToast === 'function') {
                    window.fvToast(trF('counter.error', 'Nu am putut salva click-ul. Verifică conexiunea la internet.'), 'error');
                }
            });
        });
    });

    // Indicatorul „în direct": apare doar când datele vin din cloud
    FVBackend.ready.then(function () {
        if (FVBackend.mode !== 'firebase') return;
        dots.forEach(function (d) { d.classList.remove('hidden'); });
        FVBackend.onConnection(function (connected) {
            dots.forEach(function (d) {
                d.classList.toggle('is-live', connected);
                d.title = connected ? trF('counter.live', 'În direct: toți vizitatorii văd același număr') : '';
            });
        });
    });

    render();
})();
