/* FeelVoyage — calculul prețului unei rezervări (ESTIMARE ORIENTATIVĂ, în EUR).

   Regulile sunt gândite ca la agențiile reale (ex. cistour.ro):
   • prețul din card („de la X €") = per adult, în cameră dublă, în sezon redus, pentru pachetul standard;
   • adult singur în cameră => supliment single (pe noapte);
   • copii pe intervale de vârstă, ca procent din prețul adultului; copilul cazat cu un singur adult plătește preț întreg;
   • durata: clientul poate alege între min și max nopți; o parte din preț (zborul/transportul) e fixă, restul crește cu nopțile;
   • sezon: prețul crește în lunile de vârf (în funcție de data plecării);
   • servicii extra: unele sunt deja incluse în pachet, altele se adaugă per persoană, per grup sau per zi.

   Fișierul nu atinge pagina (fără DOM), așa că poate fi testat separat. Toate sumele sunt numere întregi (EUR).
   Vrei să schimbi un preț? Modifică tabelele de mai jos (CATEGORY, OVERRIDES, SEASON). */
(function (root) {
    'use strict';

    const EUR_RON = 5.0;        // cursul folosit pe site (340 € = 1.700 lei)
    const CAR_SEATS = 4;        // locuri per mașină închiriată
    const MAX_ADULTS = 10;
    const MAX_KIDS = 6;

    /* ------------------------------------------------------------------ reguli pe categorie */
    // kids: [copii 0–4 ani, copii 5–12 ani] ca fracție din prețul adultului
    // singlePerNight: supliment cameră single / noapte · transfer: aeroport-hotel dus-întors / persoană
    // fixedShare: partea din prețul pachetului care NU depinde de numărul de nopți (zbor / transport) · minNights / maxNights: durata permisă
    // mealsPerNight: upgrade de masă / persoană / noapte · ticketsPerNight: bilete la atracții / persoană / noapte
    // insurancePerDay: asigurare medicală + storno / persoană / zi · guideDay: ghid local privat / grup / zi · carDay: mașină / zi
    const CATEGORY = {
        'romania':    { fixedShare: 0.00, minNights: 2, maxNights: 14, kids: [0.40, 0.70], singlePerNight: 18, transfer: 12, mealsPerNight: 15, ticketsPerNight: 6,  insurancePerDay: 1.0, guideDay: 45,  carDay: 32 },
        'city-break': { fixedShare: 0.35, minNights: 2, maxNights: 14, kids: [0.65, 0.85], singlePerNight: 30, transfer: 22, mealsPerNight: 22, ticketsPerNight: 14, insurancePerDay: 1.9, guideDay: 90,  carDay: 42 },
        'plaja':      { fixedShare: 0.30, minNights: 2, maxNights: 14, kids: [0.65, 0.85], singlePerNight: 30, transfer: 25, mealsPerNight: 25, ticketsPerNight: 10, insurancePerDay: 1.9, guideDay: 80,  carDay: 45 },
        'munte':      { fixedShare: 0.20, minNights: 2, maxNights: 14, kids: [0.65, 0.85], singlePerNight: 40, transfer: 35, mealsPerNight: 35, ticketsPerNight: 22, insurancePerDay: 2.2, guideDay: 110, carDay: 70 },
        'exotic':     { fixedShare: 0.50, minNights: 5, maxNights: 21, kids: [0.75, 0.85], singlePerNight: 45, transfer: 40, mealsPerNight: 28, ticketsPerNight: 16, insurancePerDay: 3.6, guideDay: 90,  carDay: 55 },
        'asia':       { fixedShare: 0.55, minNights: 5, maxNights: 21, kids: [0.75, 0.85], singlePerNight: 35, transfer: 38, mealsPerNight: 20, ticketsPerNight: 12, insurancePerDay: 3.4, guideDay: 75,  carDay: 45 }
    };

    /* ------------------------------------------------------------------ sezoane: multiplicator pe luna plecării (lipsă = 1) */
    const SEASON = {
        flat:     {},
        general:  { 7: 1.10, 8: 1.10, 12: 1.15 },
        beach:    { 6: 1.15, 7: 1.40, 8: 1.50, 9: 1.15 },
        mountain: { 12: 1.30, 1: 1.20, 2: 1.15, 7: 1.10, 8: 1.10 },
        city:     { 4: 1.10, 5: 1.10, 6: 1.05, 9: 1.10, 10: 1.05, 12: 1.20 },
        warm:     { 11: 1.10, 12: 1.35, 1: 1.25, 2: 1.15, 3: 1.10 },
        longhaul: { 7: 1.10, 8: 1.10, 10: 1.05, 12: 1.25 }
    };

    /* ------------------------------------------------------------------ particularități pe destinație */
    // season: profilul de sezon · transport: transport autocar retur / persoană (doar pachetele din România, unde nu e inclus)
    // carUnavailable: închirierea de mașină nu se oferă (Maldive: nu există mașini; China: turiștii nu pot conduce; safari: jeep cu șofer)
    const OVERRIDES = {
        'delta-dunarii':         { season: 'general',  transport: 28 },
        'poiana-brasov':         { season: 'mountain', transport: 15 },
        'bran-brasov':           { season: 'general',  transport: 15 },
        'transfagarasan':        { season: 'general',  transport: 20 },
        'cazanele-dunarii':      { season: 'general',  transport: 22 },
        'maramures':             { season: 'general',  transport: 38 },
        'sibiu-sighisoara':      { season: 'general',  transport: 22 },
        'mamaia-constanta':      { season: 'beach',    transport: 20 },
        'roma':                  { season: 'city' },
        'barcelona':             { season: 'city' },
        'londra':                { season: 'city' },
        'praga':                 { season: 'city' },
        'viena':                 { season: 'city' },
        'paris':                 { season: 'city' },
        'cappadocia':            { season: 'city' },
        'santorini':             { season: 'beach' },
        'alpi-elvetia':          { season: 'mountain' },
        'dubai':                 { season: 'warm' },
        'maldive-deluxe':        { season: 'warm',     transfer: 220, singlePerNight: 90, carUnavailable: true },
        'kenya-safari':          { season: 'longhaul', carUnavailable: true },
        'bali':                  { season: 'longhaul' },
        'tokyo':                 { season: 'longhaul' },
        'newyork':               { season: 'longhaul' },
        'beijing-marele-zid':    { season: 'longhaul', carUnavailable: true },
        'shanghai-metropola-futurului': { season: 'longhaul', carUnavailable: true },
        'zhangjiajie-avatar':    { season: 'longhaul', carUnavailable: true },
        'seoul-coreea':          { season: 'longhaul' },
        'busan-coreea':          { season: 'longhaul' },
        'jeju-insula-vulcanica': { season: 'longhaul' },
        'yosemite': { season: 'longhaul' },
        'grand-canyon': { season: 'longhaul' },
        'san-francisco': { season: 'city' },
        'hawaii': { season: 'warm' },
        'banff': { season: 'general' },
        'machu-picchu': { season: 'longhaul', carUnavailable: true },
        'rio': { season: 'warm' },
        'patagonia': { season: 'longhaul' },
        'edinburgh': { season: 'city' },
        'norvegia-fiorduri': { season: 'general' },
        'cape-town': { season: 'warm' },
        'niagara': { season: 'general' },
        'skye': { season: 'general' },
        'lofoten': { season: 'mountain' },
        'irlanda': { season: 'general' },
        'islanda': { season: 'general' },
        'marrakech': { season: 'city' },
        'egipt': { season: 'warm' },
        'zanzibar': { season: 'warm' },
        'serengeti': { season: 'longhaul', carUnavailable: true },
        'victoria-falls': { season: 'longhaul' },
        'namibia': { season: 'longhaul' },
        'india': { season: 'warm' },
        'halong': { season: 'warm' },
        'noua-zeelanda': { season: 'longhaul' },
        'sydney': { season: 'longhaul' },
        'petra': { season: 'city' },
        'krabi': { season: 'warm' },
        'cornwall': { season: 'beach' },
        'horseshoe-bend': { season: 'longhaul' }
    };

    const SERVICE_ORDER = ['transport', 'cazare', 'transfer', 'meals', 'tickets', 'insurance', 'guide', 'car'];

    /* ------------------------------------------------------------------ destinații sezoniere (ski / plajă de vară)
       core: luna-ziua (MM-ZZ) a sezonului propriu-zis · margin: zile în plus la fiecare capăt în care tot se poate rezerva
       opposite: sezonul „opus”, folosit pentru reducerea de rezervare din timp (ex. schi rezervat vara) */
    const SEASONAL = {
        iarna:     { coreStart: '12-01', coreEnd: '03-15', opposite: 'vara' },
        vara:      { coreStart: '06-01', coreEnd: '09-15', opposite: 'iarna' },
        halloween: { coreStart: '10-24', coreEnd: '11-02', opposite: null },   // 31 oct ± o săptămână
        patrick:   { coreStart: '03-10', coreEnd: '03-24', opposite: null },   // 17 mar ± o săptămână
        craciun:   { coreStart: '11-25', coreEnd: '01-06', opposite: null },   // târguri de Crăciun: de la Sf. Andrei până la Bobotează
        valentine: { coreStart: '02-07', coreEnd: '02-21', opposite: null },   // 14 feb ± o săptămână
        // Paștele e o sărbătoare mobilă (dată diferită în fiecare an, și diferită catolic/ortodox); fără calcul exact pe an,
        // folosim o fereastră lată, care acoperă ambele calendare în orice an: 22 mar (cea mai devreme dată catolică posibilă)
        // până la 8 mai (cea mai târzie dată ortodoxă posibilă) — mai largă decât o sărbătoare fixă, dar tot limitată la primăvară.
        paste:     { coreStart: '03-22', coreEnd: '05-08', opposite: null }
    };
    const SEASONAL_MARGIN_DAYS = 15;
    const LONG_STAY_NIGHTS = 14;        // peste atâtea nopți se aplică reducerea de sejur lung
    const LONG_STAY_DISCOUNT = 0.05;    // 5%
    const OFF_SEASON_DISCOUNT = 0.12;   // 12%

    // Reducere de rezervare din timp: valabilă la ORICE destinație (nu doar cele sezoniere), dacă data plecării e
    // la 8-13 luni distanță de ziua comenzii. Dacă destinația e și sezonieră și s-ar califica și la OFF_SEASON_DISCOUNT,
    // se aplică doar reducerea mai mare dintre cele două (nu se adună).
    const EARLY_BOOKING_MIN_DAYS = 240;   // ~8 luni
    const EARLY_BOOKING_MAX_DAYS = 400;   // ~13 luni (o mică marjă peste 12, ca „un an înainte” să se califice sigur)
    const EARLY_BOOKING_DISCOUNT = 0.15;  // 15%

    // Facilitățile incluse (dest.amenities, ex. „Hotel 4★”, „Mic Dejun Inclus”) sunt bifate implicit; clientul poate debifa
    // oricare dintre ele dacă nu o vrea, iar prețul scade. Fără o defalcare reală pe fiecare facilitate (sunt text liber,
    // diferit la fiecare pachet), tratăm toate facilitățile unei destinații ca împărțind în mod egal acest procent din preț.
    const AMENITIES_POOL_PCT = 0.30;   // 30% din preț e considerat „acoperit” de totalul facilităților incluse

    /* ------------------------------------------------------------------ calcule pe lună-zi (MM-ZZ), independente de an */
    function mdOf(dateStr) { return String(dateStr || '').slice(5, 10); }   // 'AAAA-LL-ZZ' -> 'LL-ZZ'
    function mdInRange(md, start, end) {
        if (!md) return false;
        return start <= end ? (md >= start && md <= end) : (md >= start || md <= end);   // 'end < start' = intervalul trece peste anul nou
    }
    // Deplasează un 'LL-ZZ' cu n zile (foloseşte un an bisect/nebisect fix, doar ca să calculăm ziua — anul în sine nu contează)
    function shiftMonthDay(md, days) {
        const mo = +md.slice(0, 2), da = +md.slice(3, 5);
        const dt = new Date(2027, mo - 1, da, 12);   // 2027: an nebisect, suficient pentru calculul zi-lună
        dt.setDate(dt.getDate() + days);
        return pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate());
    }
    function pad2(n) { return String(n).padStart(2, '0'); }
    function todayISO() { const d = new Date(); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate()); }

    // Informațiile de sezon ale unei destinații: null dacă nu e sezonieră
    function seasonalInfo(dest) {
        const kind = dest && dest.seasonal;
        const cfg = SEASONAL[kind];
        if (!cfg) return null;
        return {
            kind: kind,
            coreStart: cfg.coreStart, coreEnd: cfg.coreEnd,
            windowStart: shiftMonthDay(cfg.coreStart, -SEASONAL_MARGIN_DAYS),
            windowEnd: shiftMonthDay(cfg.coreEnd, SEASONAL_MARGIN_DAYS),
            opposite: cfg.opposite
        };
    }
    // O dată (AAAA-LL-ZZ) e în perioada în care destinația sezonieră poate fi rezervată (sezon ± marjă)?
    function isDateAllowed(dest, dateStr) {
        const info = seasonalInfo(dest);
        if (!info || !dateStr) return true;
        return mdInRange(mdOf(dateStr), info.windowStart, info.windowEnd);
    }
    // Reducere „rezervare din timp” (sezon opus): comanda plasată azi, în sezonul opus celui al destinației.
    // Se aplică doar la destinațiile cu sezon „pereche” (iarnă ↔ vară) — sărbătorile (Halloween, Paște etc.) nu au una.
    function offSeasonDiscount(dest, orderDateStr) {
        const info = seasonalInfo(dest);
        if (!info || !info.opposite) return 0;
        const opp = SEASONAL[info.opposite];
        return mdInRange(mdOf(orderDateStr), opp.coreStart, opp.coreEnd) ? OFF_SEASON_DISCOUNT : 0;
    }
    // Numărul de zile calendaristice între două date 'AAAA-LL-ZZ' (poate fi negativ dacă b e înainte de a)
    function daysBetween(aStr, bStr) {
        const a = new Date(String(aStr || '') + 'T00:00:00');
        const b = new Date(String(bStr || '') + 'T00:00:00');
        if (isNaN(a) || isNaN(b)) return null;
        return Math.round((b - a) / 86400000);
    }
    // Reducere „rezervare din timp” (cu mult înainte): data plecării e la 8-13 luni distanță de ziua comenzii.
    // Valabilă la orice destinație, indiferent dacă e sezonieră sau nu.
    function earlyBookingDiscount(orderDateStr, travelDateStr) {
        const gap = daysBetween(orderDateStr, travelDateStr);
        if (gap === null) return 0;
        return (gap >= EARLY_BOOKING_MIN_DAYS && gap <= EARLY_BOOKING_MAX_DAYS) ? EARLY_BOOKING_DISCOUNT : 0;
    }

    /* ------------------------------------------------------------------ ajutoare */
    const int = (v, dflt) => { const n = parseInt(v, 10); return Number.isFinite(n) ? n : dflt; };
    const clamp = (n, lo, hi) => Math.min(hi, Math.max(lo, n));

    function boardOf(period) {
        const p = String(period || '');
        if (/all inclusive/i.test(p)) return 'ai';
        if (/pensiune complet/i.test(p)) return 'full';
        if (/demipensiune/i.test(p)) return 'half';
        if (/mic dejun/i.test(p)) return 'bb';
        if (/circuit\s*&\s*resort/i.test(p)) return 'full';
        if (/ghidat/i.test(p)) return 'bb';
        return 'none';
    }

    // Profilul de preț al unei destinații (durata, reguli, ce e inclus)
    function profile(dest) {
        const cat = CATEGORY[dest.category] || CATEGORY['city-break'];
        const ov = OVERRIDES[dest.id] || {};
        const nights = Math.max(1, int(String(dest.period || '').match(/\d+/), 3));
        const fixedTour = /circuit|ghidat/i.test(String(dest.period || ''));   // circuitele ghidate au durată fixă
        return {
            nights: nights,
            nightsFixed: fixedTour,
            minNights: fixedTour ? nights : Math.min(cat.minNights, nights),
            maxNights: fixedTour ? nights : Math.max(cat.maxNights, nights),
            fixedShare: cat.fixedShare,
            category: dest.category,
            kids: cat.kids,
            singlePerNight: ov.singlePerNight !== undefined ? ov.singlePerNight : cat.singlePerNight,
            transfer: ov.transfer !== undefined ? ov.transfer : cat.transfer,
            transport: ov.transport !== undefined ? ov.transport : 25,
            mealsPerNight: cat.mealsPerNight,
            ticketsPerNight: cat.ticketsPerNight,
            insurancePerDay: cat.insurancePerDay,
            guideDay: cat.guideDay,
            carDay: cat.carDay,
            season: ov.season || 'flat',
            carUnavailable: !!ov.carUnavailable,
            board: boardOf(dest.period),
            guideIncluded: fixedTour,
            transportIncluded: dest.category !== 'romania',
            seasonal: seasonalInfo(dest)
        };
    }

    // Serviciile unui pachet: incluse / opționale (cu preț) / indisponibile
    // unit: 'pp' = per persoană (pentru întreaga ședere) · 'group' = per grup (total) · 'car' = per mașină pe zi
    function extrasFor(dest, nightsOpt) {
        const p = profile(dest);
        const n = clamp(int(nightsOpt, p.nights), p.minNights, p.maxNights);   // nopțile alese (implicit, cele ale pachetului)
        const halfOrMore = p.board === 'ai' || p.board === 'full' || p.board === 'half';
        const mealsRate = p.board === 'none' ? Math.round(p.mealsPerNight * 1.5) : p.mealsPerNight;
        const map = {
            transport: { status: p.transportIncluded ? 'included' : 'optional', unit: 'pp', price: p.transport },
            cazare:    { status: 'included' },
            transfer:  { status: 'optional', unit: 'pp', price: p.transfer },
            meals:     { status: halfOrMore ? 'included' : 'optional', unit: 'pp', price: mealsRate * n },
            tickets:   { status: 'optional', unit: 'pp', price: p.ticketsPerNight * n },
            insurance: { status: 'optional', unit: 'pp', price: Math.max(5, Math.round(p.insurancePerDay * (n + 1))) },
            guide:     { status: p.guideIncluded ? 'included' : 'optional', unit: 'group', price: p.guideDay * Math.min(3, n) },
            car:       { status: p.carUnavailable ? 'unavailable' : 'optional', unit: 'car', price: p.carDay }
        };
        return SERVICE_ORDER.map(function (key) { return Object.assign({ key: key }, map[key]); });
    }

    // Prețul unui adult pentru n nopți: partea fixă (zbor/transport) + partea care crește cu nopțile. La n = nopțile pachetului = prețul din card.
    function adultPrice(base, packageNights, n, fixedShare) {
        if (n === packageNights) return base;
        return Math.round(base * (fixedShare + (1 - fixedShare) * (n / packageNights)));
    }

    function seasonFactor(seasonName, dateStr) {
        const m = int(String(dateStr || '').slice(5, 7), 0);
        if (m < 1 || m > 12) return { factor: 1, month: 0 };
        const table = SEASON[seasonName] || {};
        return { factor: table[m] || 1, month: m };
    }

    /* ------------------------------------------------------------------ calculul propriu-zis */
    // opts: { adults, kids04, kids512, extras: ['transfer', ...], date: 'AAAA-LL-ZZ' }
    function quote(dest, opts) {
        opts = opts || {};
        const p = profile(dest);
        const adults = clamp(int(opts.adults, 2), 1, MAX_ADULTS);
        const kids04 = clamp(int(opts.kids04, 0), 0, MAX_KIDS);
        const kids512 = clamp(int(opts.kids512, 0), 0, MAX_KIDS);
        const kids = kids04 + kids512;
        const travelers = adults + kids;
        const nights = clamp(int(opts.nights, p.nights), p.minNights, p.maxNights);
        const base = adultPrice(dest.price, p.nights, nights, p.fixedShare);   // prețul unui adult pentru durata aleasă

        const soloParent = adults === 1 && kids > 0;          // copilul cazat cu un singur adult plătește preț întreg
        const pct04 = soloParent ? 1 : p.kids[0];
        const pct512 = soloParent ? 1 : p.kids[1];

        const lines = [];
        const add = function (type, data, amount) { lines.push(Object.assign({ type: type, amount: amount }, data)); };

        add('adults', { count: adults, unit: base }, adults * base);
        if (kids04) { const u = Math.round(base * pct04); add('kids04', { count: kids04, unit: u, pct: Math.round(pct04 * 100) }, kids04 * u); }
        if (kids512) { const u = Math.round(base * pct512); add('kids512', { count: kids512, unit: u, pct: Math.round(pct512 * 100) }, kids512 * u); }

        const singles = (adults % 2 === 1 && kids === 0) ? 1 : 0;   // un adult rămas fără partener de cameră
        if (singles) { const u = p.singlePerNight * nights; add('single', { count: singles, unit: u, perNight: p.singlePerNight, nights: nights }, singles * u); }

        const core = lines.reduce(function (s, l) { return s + l.amount; }, 0);

        // Facilități incluse, debifate de client: fiecare reprezintă o parte egală din AMENITIES_POOL_PCT
        const amenitiesTotal = Array.isArray(dest.amenities) ? dest.amenities.length : 0;
        const amenitiesRemoved = clamp(int(opts.amenitiesRemoved, 0), 0, amenitiesTotal);
        const amenitiesPct = amenitiesTotal > 0 ? (AMENITIES_POOL_PCT * amenitiesRemoved / amenitiesTotal) : 0;
        if (amenitiesRemoved > 0) { const d = -Math.round(core * amenitiesPct); add('amenities_removed', { count: amenitiesRemoved, total: amenitiesTotal, pct: Math.round(amenitiesPct * 100) }, d); }

        const sf = seasonFactor(p.season, opts.date);
        const seasonAmount = Math.round(core * (sf.factor - 1));
        if (seasonAmount > 0) add('season', { month: sf.month, pct: Math.round((sf.factor - 1) * 100) }, seasonAmount);

        // Reducere de sejur lung: peste LONG_STAY_NIGHTS nopți
        const longStay = nights > LONG_STAY_NIGHTS;
        if (longStay) { const d = -Math.round(core * LONG_STAY_DISCOUNT); add('longstay', { nights: nights, pct: Math.round(LONG_STAY_DISCOUNT * 100) }, d); }

        // Reducere de rezervare din timp: fie sezon opus (doar la destinațiile sezoniere), fie plecare la 8-13 luni distanță
        // (la orice destinație) — se aplică doar reducerea mai mare dintre cele două, nu se adună.
        const orderDate = opts.orderDate || todayISO();
        const offSeasonPct = offSeasonDiscount(dest, orderDate);
        const earlyPct = earlyBookingDiscount(orderDate, opts.date);
        const earlyWins = earlyPct > offSeasonPct;
        const earlyBookingPct = earlyWins ? earlyPct : 0;
        const finalOffSeasonPct = earlyWins ? 0 : offSeasonPct;
        if (earlyWins) { const d = -Math.round(core * earlyPct); add('earlybooking', { pct: Math.round(earlyPct * 100) }, d); }
        else if (offSeasonPct > 0) { const d = -Math.round(core * offSeasonPct); add('offseason', { pct: Math.round(offSeasonPct * 100) }, d); }

        const chosen = new Set(opts.extras || []);
        extrasFor(dest, nights).forEach(function (ex) {
            if (ex.status !== 'optional' || !chosen.has(ex.key)) return;
            if (ex.unit === 'pp') add('extra', { key: ex.key, unit: ex.price, count: travelers, per: 'pp' }, ex.price * travelers);
            else if (ex.unit === 'group') add('extra', { key: ex.key, unit: ex.price, count: 1, per: 'group' }, ex.price);
            else if (ex.unit === 'car') {
                const cars = Math.ceil(travelers / CAR_SEATS);
                add('extra', { key: ex.key, unit: ex.price, cars: cars, days: nights, per: 'car' }, ex.price * cars * nights);
            }
        });

        const total = lines.reduce(function (s, l) { return s + l.amount; }, 0);
        return {
            lines: lines,
            total: total,
            perPerson: Math.round(total / travelers),
            ron: Math.round(total * EUR_RON),
            travelers: travelers,
            adults: adults, kids04: kids04, kids512: kids512,
            nights: nights,
            packageNights: p.nights,
            minNights: p.minNights,
            maxNights: p.maxNights,
            nightsFixed: p.nightsFixed,
            nightsAdjusted: nights !== p.nights,
            season: { factor: sf.factor, month: sf.month, applied: seasonAmount > 0 },
            soloParent: soloParent,
            seasonal: p.seasonal,
            dateAllowed: isDateAllowed(dest, opts.date),
            longStay: longStay,
            offSeasonPct: Math.round(finalOffSeasonPct * 100),
            earlyBookingPct: Math.round(earlyBookingPct * 100)
        };
    }

    // Valoarea estimată a UNEI facilități incluse (pentru afișarea „-X €” lângă fiecare, când o debifezi), la numărul curent de persoane
    function amenityUnitValue(dest, opts) {
        const amenitiesTotal = Array.isArray(dest.amenities) ? dest.amenities.length : 0;
        if (!amenitiesTotal) return 0;
        const q = quote(dest, Object.assign({}, opts || {}, { amenitiesRemoved: 0 }));
        return Math.round(q.total * AMENITIES_POOL_PCT / amenitiesTotal);
    }

    /* ------------------------------------------------------------------ formatare */
    function group(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function fmtEUR(n) { return group(n) + ' €'; }
    function fmtRON(n) { return group(n) + ' lei'; }
    function toRON(eur) { return Math.round(eur * EUR_RON); }

    const api = {
        EUR_RON: EUR_RON, MAX_ADULTS: MAX_ADULTS, MAX_KIDS: MAX_KIDS, CAR_SEATS: CAR_SEATS,
        profile: profile, extrasFor: extrasFor, quote: quote, seasonFactor: seasonFactor, adultPrice: adultPrice,
        fmtEUR: fmtEUR, fmtRON: fmtRON, toRON: toRON, SERVICE_ORDER: SERVICE_ORDER,
        seasonalInfo: seasonalInfo, isDateAllowed: isDateAllowed, offSeasonDiscount: offSeasonDiscount,
        earlyBookingDiscount: earlyBookingDiscount,
        LONG_STAY_NIGHTS: LONG_STAY_NIGHTS, LONG_STAY_DISCOUNT: LONG_STAY_DISCOUNT, OFF_SEASON_DISCOUNT: OFF_SEASON_DISCOUNT,
        EARLY_BOOKING_MIN_DAYS: EARLY_BOOKING_MIN_DAYS, EARLY_BOOKING_MAX_DAYS: EARLY_BOOKING_MAX_DAYS, EARLY_BOOKING_DISCOUNT: EARLY_BOOKING_DISCOUNT,
        AMENITIES_POOL_PCT: AMENITIES_POOL_PCT, amenityUnitValue: amenityUnitValue,
        todayISO: todayISO
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.FVPricing = api;
})(typeof window !== 'undefined' ? window : globalThis);
