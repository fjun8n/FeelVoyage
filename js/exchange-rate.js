/* FeelVoyage — cursul EUR→RON în timp real (Frankfurter.app, gratuit, fără cheie, bazat pe cursurile BCE).
   Prețurile în EURO NU se schimbă (reflectă costuri reale: hotel, zbor etc.) — doar echivalentul în LEI se
   recalculează automat cu cursul de azi, exact cum ai cerut: dacă euro „crește” (ia mai mulți lei), suma în
   lei afișată crește; dacă scade, scade. Se cere o singură dată pe zi (cache în localStorage), nu la fiecare
   încărcare de pagină — cursul BCE oricum se actualizează o dată pe zi, în jur de ora 16:00 CET. */
(function () {
    'use strict';

    const KEY_RATE = 'fv_eur_ron_rate';
    const KEY_FETCHED_AT = 'fv_eur_ron_fetched_at';
    const MAX_AGE_MS = 12 * 60 * 60 * 1000;   // 12 ore — suficient de des cât să prindă actualizarea zilnică BCE

    function applyRate(rate) {
        if (window.FVPricing && typeof FVPricing.setEurRon === 'function') FVPricing.setEurRon(rate);
        document.dispatchEvent(new CustomEvent('fv:exchange-rate', { detail: { rate: rate } }));
    }

    function cached() {
        try {
            const rate = parseFloat(localStorage.getItem(KEY_RATE));
            const at = parseInt(localStorage.getItem(KEY_FETCHED_AT), 10);
            if (rate > 0 && isFinite(rate) && at && (Date.now() - at) < MAX_AGE_MS) return rate;
        } catch (e) { }
        return null;
    }
    function saveCache(rate) {
        try { localStorage.setItem(KEY_RATE, String(rate)); localStorage.setItem(KEY_FETCHED_AT, String(Date.now())); } catch (e) { }
    }

    function fetchLive() {
        fetch('https://api.frankfurter.app/latest?symbols=RON')
            .then(function (r) { if (!r.ok) throw new Error('bad-status'); return r.json(); })
            .then(function (data) {
                const rate = data && data.rates && data.rates.RON;
                if (typeof rate === 'number' && rate > 0) { saveCache(rate); applyRate(rate); }
            })
            .catch(function (e) { console.warn('[FeelVoyage] Cursul EUR/RON live nu s-a putut încărca, rămânem la cel de rezervă:', e); });
    }

    // Un curs din cache (chiar și de acum câteva ore) se aplică imediat, ca prețurile în lei să fie corecte din
    // prima clipă, fără să aștepte răspunsul rețelei. Se cere din nou din rețea doar dacă nu mai e proaspăt.
    const c = cached();
    if (c) applyRate(c); else fetchLive();
    let fetchedAt = 0;
    try { fetchedAt = parseInt(localStorage.getItem(KEY_FETCHED_AT), 10) || 0; } catch (e) { }
    if (c && (Date.now() - fetchedAt) > MAX_AGE_MS / 2) fetchLive();

    window.FVExchangeRate = { getRate: function () { return (window.FVPricing && FVPricing.getEurRon) ? FVPricing.getEurRon() : null; } };
})();
