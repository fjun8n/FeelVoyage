/* FeelVoyage — estimarea de preț pentru „Trimite o solicitare de ofertă”, la o destinație care NU e în catalog.

   ─── DE UNDE VINE PREȚUL ───────────────────────────────────────────────────────────────────────────
   Nu dintr-un API de zboruri/hoteluri. Pe un site static (GitHub Pages + Firebase) nu se poate: API-urile
   reale (Amadeus, Travelpayouts, Booking…) cer o cheie care trebuie să rămână SECRETĂ, iar orice cheie pusă
   în JavaScript e publică — o vede oricine deschide fișierul și ți-o poate consuma. În plus aproape toate
   refuză cererile venite direct din browser (CORS), fiind făcute server-la-server.

   Deci estimarea se calculează din datele NOASTRE, care sunt prețuri reale:
   • ZBORUL — catalogul (js/destinations.js) are pentru fiecare pachet un preț real de zbor dus-întors,
     cercetat manual (`flightPriceRT`). Pentru cele 43 de țări în care zburăm deja folosim exact media
     prețurilor reale pentru țara aceea. Pentru restul lumii folosim o curbă potrivită pe aceleași prețuri
     reale, în funcție de distanța de la București (două segmente: până la 2000 km zborurile low-cost sunt
     aproape independente de distanță, peste 2000 km curba de putere se potrivește bine). Eroarea medie a
     curbei, verificată pe cele 42 de țări cu zbor: ~59 €.
   • CAZAREA — tot din catalog: prețul de teren pe noapte, mediat pe țară (dacă avem pachete acolo) sau pe
     regiune (dacă nu), la standardul pachetelor noastre.
   • RESTUL (nopți, copii, sezon, cameră single, serviciile bifate) — nu se recalculează aici: se construiește
     o destinație „sintetică” și se trece prin motorul de preț existent (js/pricing.js), exact cel folosit la
     pachetele din catalog. Așa estimarea rămâne consecventă cu tot restul site-ului.

   Localitatea se identifică prin Nominatim (OpenStreetMap) — gratuit, fără cheie, merge din browser; e deja
   folosit de js/geo.js. Dacă nu răspunde (internet oprit, limită atinsă), nu se afișează nicio estimare și
   NU se blochează nimic: omul își poate trimite cererea oricum, iar un consultant o calculează ca până acum.

   ─── DACĂ VREI PREȚURI LIVE MAI TÂRZIU ─────────────────────────────────────────────────────────────
   Se schimbă O SINGURĂ funcție: `priceSource` (mai jos). Pui acolo un fetch către propria funcție Firebase
   (Cloud Functions, plan Blaze), care ține cheia API ascunsă pe server și întoarce {flightPerAdult, nightRate}.
   Restul fișierului și toată interfața rămân neschimbate. */
(function (root) {
    'use strict';

    /* ------------------------------------------------------------------ calibrarea (vezi comentariul de sus) */
    var ORIGIN = { lat: 44.5711, lon: 26.0850 };   // București Otopeni
    var FLIGHT_SPLIT_KM = 2000;
    var FLIGHT_NEAR = { a: 40.5, b: 0.0161811, c: 1.2 };
    var FLIGHT_FAR = { a: -1501.47, b: 274.216, c: 0.23 };

    // media prețurilor REALE de zbor dus-întors din catalog, pe țară (€ / adult)
    var FLIGHT_BY_COUNTRY = {
        RO: 0, IT: 80, ES: 173, GB: 90, CZ: 75, AT: 70, FR: 95, MV: 700, KE: 580, ID: 650, GR: 125, JP: 700,
        CH: 120, AE: 325, TR: 100, US: 497, CN: 650, KR: 650, CA: 500, PE: 800, BR: 850, CL: 900, NO: 207,
        ZA: 650, IE: 110, IS: 180, MA: 200, EG: 180, TZ: 600, ZW: 650, NA: 650, IN: 480, VN: 620, NZ: 1150,
        AU: 1100, JO: 260, TH: 600, FI: 140, IL: 230, HU: 70, SC: 700, DE: 85, DK: 130
    };
    // partea de teren (cazare + masa inclusă), € pe noapte pe adult, din catalog
    var NIGHT_BY_COUNTRY = {
        RO: 76, IT: 115, ES: 143, GB: 162, CZ: 81, AT: 132, FR: 131, MV: 299, KE: 239, ID: 75, GR: 167,
        JP: 122, CH: 167, AE: 210, TR: 70, US: 202, CN: 99, KR: 92, CA: 224, PE: 264, BR: 106, CL: 450,
        NO: 240, ZA: 137, IE: 206, IS: 252, MA: 90, EG: 93, TZ: 314, ZW: 311, NA: 295, IN: 87, VN: 94,
        NZ: 229, AU: 155, JO: 91, TH: 93, FI: 285, IL: 129, HU: 80, SC: 288, DE: 96, DK: 184
    };
    var NIGHT_DEFAULT = 172;   // media globală a catalogului, folosită doar dacă nu se poate determina regiunea
    // Pentru țările în care NU avem încă pachete: se alege punctul de mai jos cel mai apropiat de localitate.
    // Fiecare punct poartă un preț pe noapte, luat din media regiunii corespunzătoare din catalogul nostru:
    //   eu-vest 149 · eu-sud 142 · eu-est 77 · nordic 240 · orient-mijlociu 143 · africa-nord 91
    //   africa-sub 259 · insule-exotic 294 · asia-sud 87 · asia-sud-est 87 · asia-est 104
    //   america-nord 213 · america-sud 273 · oceania 192
    // Unde catalogul n-are nimic apropiat (Mexic, Caraibe, Asia Centrală) am pus nivelul regiunii celei mai
    // asemănătoare la preț — e o aproximare declarată, nu o cifră cercetată.
    var REGION_CENTERS = [
        ['eu-vest', 48, 5, 149], ['eu-vest', 52, 10, 149],
        ['eu-sud', 41, 13, 142], ['eu-sud', 38, 23, 142], ['eu-sud', 40, -4, 142],
        ['eu-est', 47, 20, 77], ['eu-est', 52, 20, 77], ['eu-est', 56, 38, 77], ['eu-est', 42, 44, 77], ['eu-est', 44, 28, 77],
        ['nordic', 60, 15, 240], ['nordic', 64, -20, 240],
        ['orient-mijlociu', 29, 45, 143], ['orient-mijlociu', 35, 51, 143],
        ['africa-nord', 31, 10, 91], ['africa-nord', 15, 32, 91],
        ['africa-sub', -10, 25, 259], ['africa-sub', 6, 0, 259],
        ['insule-exotic', -8, 60, 294], ['insule-exotic', 18, -70, 294],
        ['asia-sud', 22, 78, 87], ['asia-centrala', 43, 68, 87],
        ['asia-sud-est', 10, 105, 87], ['asia-est', 36, 125, 104],
        ['america-nord', 40, -95, 213], ['america-centrala', 19, -99, 143],
        ['america-sud', -15, -60, 273], ['oceania', -30, 150, 192], ['oceania', -8, 160, 192]
    ];

    /* ------------------------------------------------------------------ unelte */
    function norm(s) {
        return String(s == null ? '' : s).toLowerCase().normalize('NFD')
            .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
    }
    function km(lat1, lon1, lat2, lon2) {
        var R = 6371, rad = Math.PI / 180;
        var dLat = (lat2 - lat1) * rad, dLon = (lon2 - lon1) * rad;
        var h = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
    }
    // Cel mai apropiat punct de referință: întoarce { name, eurPerNight }
    function regionOf(lat, lon) {
        var best = null, bestD = Infinity;
        for (var i = 0; i < REGION_CENTERS.length; i++) {
            var d = km(lat, lon, REGION_CENTERS[i][1], REGION_CENTERS[i][2]);
            if (d < bestD) { bestD = d; best = REGION_CENTERS[i]; }
        }
        return best ? { name: best[0], eurPerNight: best[3] } : { name: 'necunoscut', eurPerNight: NIGHT_DEFAULT };
    }
    // Atenție: în js/destinations.js lista e declarată cu `const destinations = [...]`, iar un `const` de la
    // nivelul unui script clasic NU devine proprietate pe window — deci `root.destinations` ar fi mereu
    // undefined. Se citește ca identificator simplu, exact ca în js/ai.js și js/chat.js.
    function catalog() {
        try {
            return (typeof destinations !== 'undefined' && Array.isArray(destinations)) ? destinations : [];
        } catch (e) { return []; }
    }

    /* ------------------------------------------------------------------ e o țară, nu o localitate? */
    // Verificare instantanee, fără rețea, pe lista de țări a site-ului (js/countries.js, 192 de nume în română)
    // plus câteva forme internaționale pentru cele mai scrise. Cazurile neacoperite le prinde Nominatim
    // (întoarce addresstype = 'country'), deci lista asta e doar pentru un răspuns imediat.
    var EXTRA_COUNTRY_FORMS = [
        'france', 'francia', 'frankreich', 'spain', 'espana', 'spagna', 'italy', 'italia', 'italie',
        'germany', 'deutschland', 'allemagne', 'alemania', 'germania', 'england', 'united kingdom', 'uk',
        'great britain', 'inghilterra', 'angleterre', 'inglaterra', 'greece', 'grecia', 'grece',
        'usa', 'united states', 'united states of america', 'america', 'etats unis', 'estados unidos',
        'turkey', 'turkiye', 'turquia', 'turchia', 'egypt', 'egitto', 'egypte', 'egipto',
        'austria', 'autriche', 'switzerland', 'suisse', 'svizzera', 'suiza', 'netherlands', 'holland',
        'olanda', 'hollande', 'portugal', 'portogallo', 'poland', 'polonia', 'pologne',
        'japan', 'giappone', 'japon', 'china', 'cina', 'chine', 'thailand', 'thailandia', 'thailande',
        'brazil', 'brasil', 'brasile', 'bresil', 'canada', 'australia', 'australie', 'mexico', 'mexique',
        'messico', 'morocco', 'maroc', 'marocco', 'marruecos', 'india', 'inde', 'indonesia', 'indonesie'
    ];
    function countryNames() {
        var out = {};
        var list = root.FV_COUNTRIES || [];
        for (var i = 0; i < list.length; i++) if (list[i] && list[i].name) out[norm(list[i].name)] = list[i].code;
        for (var j = 0; j < EXTRA_COUNTRY_FORMS.length; j++) out[norm(EXTRA_COUNTRY_FORMS[j])] = '';
        return out;
    }
    var COUNTRY_NAMES = null;
    function isCountryText(text) {
        if (!COUNTRY_NAMES) COUNTRY_NAMES = countryNames();
        var n = norm(text);
        if (!n) return false;
        return Object.prototype.hasOwnProperty.call(COUNTRY_NAMES, n);
    }

    /* ------------------------------------------------------------------ e deja în catalog? */
    // Caută localitatea scrisă printre cele 92 de pachete: pe id, pe titlu și pe primul cuvânt al titlului
    // (titlurile sunt de forma „Praga - Orașul celor 100 de Turnuri”).
    function catalogMatch(text) {
        var n = norm(text);
        if (n.length < 3) return null;
        var list = catalog();
        for (var i = 0; i < list.length; i++) {
            var d = list[i];
            var id = norm(d.id);
            // „capul” titlului se taie din titlul BRUT (titlurile arată ca „Praga - Orașul celor 100 de Turnuri”);
            // dacă s-ar tăia din cel normalizat, separatorul „ - ” ar fi deja înlocuit cu spațiu și n-ar mai fi găsit
            var head = norm(String(d.title || '').split(/\s[-–—]\s|,|\(/)[0]);
            var title = norm(d.title);
            if (id === n || title === n || head === n) return d;
            if (head.split(' ').indexOf(n) !== -1 || id.split('-').indexOf(n) !== -1) return d;
            if (n.length >= 4 && head.indexOf(n) === 0) return d;
        }
        return null;
    }

    /* ------------------------------------------------------------------ identificarea localității (Nominatim) */
    var cache = {};          // text normalizat -> rezultat (nu cerem de două ori același lucru)
    var inflight = null;     // ultima cerere pornită (o anulăm dacă omul scrie mai departe)

    var PLACE_TYPES = { city: 1, town: 1, village: 1, hamlet: 1, municipality: 1, suburb: 1, borough: 1, county: 1, state: 1, region: 1, island: 1, archipelago: 1, locality: 1 };

    function lookupPlace(text) {
        var n = norm(text);
        if (n.length < 3) return Promise.resolve({ ok: false, reason: 'short' });
        if (cache[n]) return Promise.resolve(cache[n]);

        if (inflight && inflight.abort) { try { inflight.abort(); } catch (e) { /* ignorat */ } }
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        inflight = ctrl;

        var url = 'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q='
            + encodeURIComponent(String(text).trim());
        var opts = { headers: { 'Accept-Language': 'ro' } };
        if (ctrl) opts.signal = ctrl.signal;

        var done = root.FVLog ? root.FVLog.time('estimate', 'geocode', 4000) : null;
        return fetch(url, opts).then(function (r) {
            if (!r.ok) throw new Error('http-' + r.status);
            return r.json();
        }).then(function (arr) {
            var hit = Array.isArray(arr) && arr[0];
            if (!hit) { var miss = { ok: false, reason: 'notfound' }; cache[n] = miss; if (done) done({ ok: true, found: false }); return miss; }
            var at = String(hit.addresstype || hit.type || '').toLowerCase();
            var cc = (hit.address && hit.address.country_code) ? String(hit.address.country_code).toUpperCase() : '';
            var res = {
                ok: true,
                kind: at === 'country' ? 'country' : (PLACE_TYPES[at] ? 'place' : 'other'),
                addresstype: at,
                name: String(hit.name || hit.display_name || '').split(',')[0],
                display: String(hit.display_name || ''),
                countryCode: cc,
                countryName: (hit.address && hit.address.country) ? String(hit.address.country) : '',
                lat: parseFloat(hit.lat), lon: parseFloat(hit.lon)
            };
            cache[n] = res;
            if (done) done({ ok: true, found: true, kind: res.kind });
            return res;
        }).catch(function (e) {
            if (done) done({ ok: false, code: (e && e.name === 'AbortError') ? 'abort' : 'network' });
            // anulată pentru că omul a scris mai departe: nu e o eroare
            return { ok: false, reason: (e && e.name === 'AbortError') ? 'abort' : 'network' };
        });
    }

    /* ------------------------------------------------------------------ SURSA DE PREȚ (un singur loc de schimbat) */
    // Întoarce { flightPerAdult, nightRate, source }. Dacă treci mai târziu pe prețuri live, înlocuiește
    // doar corpul funcției cu un fetch către funcția ta Firebase (care ține cheia API pe server).
    function priceSource(place) {
        var cc = place.countryCode || '';
        var dist = km(ORIGIN.lat, ORIGIN.lon, place.lat, place.lon);

        var flight, flightSource;
        if (Object.prototype.hasOwnProperty.call(FLIGHT_BY_COUNTRY, cc)) {
            flight = FLIGHT_BY_COUNTRY[cc];                       // preț real, cercetat, pentru țara asta
            flightSource = 'catalog';
        } else {
            var m = dist < FLIGHT_SPLIT_KM ? FLIGHT_NEAR : FLIGHT_FAR;
            flight = m.a + m.b * Math.pow(dist, m.c);
            flight = Math.max(45, Math.round(flight / 5) * 5);    // o limită de jos rezonabilă, rotunjit la 5 €
            flightSource = 'curba';
        }

        var nightRate, nightSource;
        if (Object.prototype.hasOwnProperty.call(NIGHT_BY_COUNTRY, cc)) {
            nightRate = NIGHT_BY_COUNTRY[cc];
            nightSource = 'catalog';
        } else {
            var reg = regionOf(place.lat, place.lon);
            nightRate = reg.eurPerNight || NIGHT_DEFAULT;
            nightSource = 'regiune:' + reg.name;
        }

        return {
            flightPerAdult: Math.round(flight),
            nightRate: Math.round(nightRate),
            distanceKm: dist,
            source: { flight: flightSource, night: nightSource }
        };
    }

    /* ------------------------------------------------------------------ estimarea completă */
    // opts: { nights, adults, kids04, kids512, date, extras: ['transport','transfer',...], single }
    // Construiește o destinație „sintetică” și o trece prin motorul de preț existent (js/pricing.js),
    // ca să se aplice exact aceleași reguli ca la pachetele din catalog (sezon, copii, single, servicii).
    function estimate(place, opts) {
        opts = opts || {};
        if (!place || !place.ok || typeof place.lat !== 'number' || isNaN(place.lat)) return null;
        if (typeof root.FVPricing === 'undefined') return null;

        var nights = Math.max(1, Math.min(60, parseInt(opts.nights, 10) || 7));
        var src = priceSource(place);
        var landTotal = src.nightRate * nights;   // partea de teren pentru toate nopțile alese

        // destinația sintetică: aceleași câmpuri pe care le citește js/pricing.js
        var synthetic = {
            id: '__estimare__',
            country: place.countryCode || 'XX',
            flightPriceRT: src.flightPerAdult,
            title: place.name || '',
            category: 'city-break',          // categoria neutră: fără supliment de circuit, servicii standard
            price: landTotal,
            currency: '€',
            period: nights + ' Nopți / Mic Dejun',
            amenities: []
        };

        var quote = root.FVPricing.quote(synthetic, {
            adults: opts.adults, kids04: opts.kids04, kids512: opts.kids512,
            nights: nights, date: opts.date || '', extras: Array.isArray(opts.extras) ? opts.extras : []
        });

        return {
            place: { name: place.name, country: place.countryName, countryCode: place.countryCode, distanceKm: src.distanceKm },
            nights: nights,
            flightPerAdult: src.flightPerAdult,
            nightRate: src.nightRate,
            quote: quote,
            total: quote.total,
            perPerson: quote.perPerson,
            ron: quote.ron,
            source: src.source
        };
    }

    root.FVEstimate = {
        lookupPlace: lookupPlace,
        isCountryText: isCountryText,
        catalogMatch: catalogMatch,
        estimate: estimate,
        priceSource: priceSource,        // înlocuiește DOAR asta dacă treci pe prețuri live
        distanceFromOrigin: function (lat, lon) { return km(ORIGIN.lat, ORIGIN.lon, lat, lon); },
        _norm: norm,
        _regionOf: regionOf
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = root.FVEstimate;
})(typeof window !== 'undefined' ? window : globalThis);
