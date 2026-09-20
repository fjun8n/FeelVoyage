/* FeelVoyage — calculul prețului unei rezervări (ESTIMARE ORIENTATIVĂ, în EUR).

   Regulile sunt gândite ca la agențiile reale (ex. cistour.ro):
   • prețul din card („de la X €") = per adult, în cameră dublă, în sezon redus, pentru pachetul standard;
   • adult singur în cameră => supliment single (pe noapte);
   • copii pe intervale de vârstă, ca procent din prețul adultului; copilul cazat cu un singur adult plătește preț întreg;
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
    // mealsPerNight: upgrade de masă / persoană / noapte · ticketsPerNight: bilete la atracții / persoană / noapte
    // insurancePerDay: asigurare medicală + storno / persoană / zi · guideDay: ghid local privat / grup / zi · carDay: mașină / zi
    const CATEGORY = {
        'romania':    { kids: [0.40, 0.70], singlePerNight: 18, transfer: 12, mealsPerNight: 15, ticketsPerNight: 6,  insurancePerDay: 1.0, guideDay: 45,  carDay: 32 },
        'city-break': { kids: [0.65, 0.85], singlePerNight: 30, transfer: 22, mealsPerNight: 22, ticketsPerNight: 14, insurancePerDay: 1.9, guideDay: 90,  carDay: 42 },
        'plaja':      { kids: [0.65, 0.85], singlePerNight: 30, transfer: 25, mealsPerNight: 25, ticketsPerNight: 10, insurancePerDay: 1.9, guideDay: 80,  carDay: 45 },
        'munte':      { kids: [0.65, 0.85], singlePerNight: 40, transfer: 35, mealsPerNight: 35, ticketsPerNight: 22, insurancePerDay: 2.2, guideDay: 110, carDay: 70 },
        'exotic':     { kids: [0.75, 0.85], singlePerNight: 45, transfer: 40, mealsPerNight: 28, ticketsPerNight: 16, insurancePerDay: 3.6, guideDay: 90,  carDay: 55 },
        'asia':       { kids: [0.75, 0.85], singlePerNight: 35, transfer: 38, mealsPerNight: 20, ticketsPerNight: 12, insurancePerDay: 3.4, guideDay: 75,  carDay: 45 }
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
        'jeju-insula-vulcanica': { season: 'longhaul' }
    };

    const SERVICE_ORDER = ['transport', 'cazare', 'transfer', 'meals', 'tickets', 'insurance', 'guide', 'car'];

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
        return {
            nights: nights,
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
            guideIncluded: /circuit|ghidat/i.test(String(dest.period || '')),
            transportIncluded: dest.category !== 'romania'
        };
    }

    // Serviciile unui pachet: incluse / opționale (cu preț) / indisponibile
    // unit: 'pp' = per persoană (pentru întreaga ședere) · 'group' = per grup (total) · 'car' = per mașină pe zi
    function extrasFor(dest) {
        const p = profile(dest);
        const halfOrMore = p.board === 'ai' || p.board === 'full' || p.board === 'half';
        const mealsRate = p.board === 'none' ? Math.round(p.mealsPerNight * 1.5) : p.mealsPerNight;
        const map = {
            transport: { status: p.transportIncluded ? 'included' : 'optional', unit: 'pp', price: p.transport },
            cazare:    { status: 'included' },
            transfer:  { status: 'optional', unit: 'pp', price: p.transfer },
            meals:     { status: halfOrMore ? 'included' : 'optional', unit: 'pp', price: mealsRate * p.nights },
            tickets:   { status: 'optional', unit: 'pp', price: p.ticketsPerNight * p.nights },
            insurance: { status: 'optional', unit: 'pp', price: Math.max(5, Math.round(p.insurancePerDay * (p.nights + 1))) },
            guide:     { status: p.guideIncluded ? 'included' : 'optional', unit: 'group', price: p.guideDay * Math.min(3, p.nights) },
            car:       { status: p.carUnavailable ? 'unavailable' : 'optional', unit: 'car', price: p.carDay }
        };
        return SERVICE_ORDER.map(function (key) { return Object.assign({ key: key }, map[key]); });
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
        const base = dest.price;

        const soloParent = adults === 1 && kids > 0;          // copilul cazat cu un singur adult plătește preț întreg
        const pct04 = soloParent ? 1 : p.kids[0];
        const pct512 = soloParent ? 1 : p.kids[1];

        const lines = [];
        const add = function (type, data, amount) { lines.push(Object.assign({ type: type, amount: amount }, data)); };

        add('adults', { count: adults, unit: base }, adults * base);
        if (kids04) { const u = Math.round(base * pct04); add('kids04', { count: kids04, unit: u, pct: Math.round(pct04 * 100) }, kids04 * u); }
        if (kids512) { const u = Math.round(base * pct512); add('kids512', { count: kids512, unit: u, pct: Math.round(pct512 * 100) }, kids512 * u); }

        const singles = (adults % 2 === 1 && kids === 0) ? 1 : 0;   // un adult rămas fără partener de cameră
        if (singles) { const u = p.singlePerNight * p.nights; add('single', { count: singles, unit: u, perNight: p.singlePerNight, nights: p.nights }, singles * u); }

        const core = lines.reduce(function (s, l) { return s + l.amount; }, 0);
        const sf = seasonFactor(p.season, opts.date);
        const seasonAmount = Math.round(core * (sf.factor - 1));
        if (seasonAmount > 0) add('season', { month: sf.month, pct: Math.round((sf.factor - 1) * 100) }, seasonAmount);

        const chosen = new Set(opts.extras || []);
        extrasFor(dest).forEach(function (ex) {
            if (ex.status !== 'optional' || !chosen.has(ex.key)) return;
            if (ex.unit === 'pp') add('extra', { key: ex.key, unit: ex.price, count: travelers, per: 'pp' }, ex.price * travelers);
            else if (ex.unit === 'group') add('extra', { key: ex.key, unit: ex.price, count: 1, per: 'group' }, ex.price);
            else if (ex.unit === 'car') {
                const cars = Math.ceil(travelers / CAR_SEATS);
                add('extra', { key: ex.key, unit: ex.price, cars: cars, days: p.nights, per: 'car' }, ex.price * cars * p.nights);
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
            nights: p.nights,
            season: { factor: sf.factor, month: sf.month, applied: seasonAmount > 0 },
            soloParent: soloParent
        };
    }

    /* ------------------------------------------------------------------ formatare */
    function group(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    function fmtEUR(n) { return group(n) + ' €'; }
    function fmtRON(n) { return group(n) + ' lei'; }
    function toRON(eur) { return Math.round(eur * EUR_RON); }

    const api = {
        EUR_RON: EUR_RON, MAX_ADULTS: MAX_ADULTS, MAX_KIDS: MAX_KIDS, CAR_SEATS: CAR_SEATS,
        profile: profile, extrasFor: extrasFor, quote: quote, seasonFactor: seasonFactor,
        fmtEUR: fmtEUR, fmtRON: fmtRON, toRON: toRON, SERVICE_ORDER: SERVICE_ORDER
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.FVPricing = api;
})(typeof window !== 'undefined' ? window : globalThis);
