/* FeelVoyage — baza de răspunsuri preprogramate (motorul).
   Se folosește când asistentul AI nu e disponibil (neconfigurat, offline, limită depășită) și pentru mesajele scurte
   (salut, mulțumesc...), ca să economisim cererile către AI. Conținutul (peste 100 de răspunsuri, în română, engleză și
   italiană) este în js/faq-data.js. Ambele fișiere se încarcă doar când se deschide chatul.

   Cum se alege răspunsul: mesajul se scrie cu litere mici și fără diacritice, apoi fiecare intrare primește puncte pentru
   cuvintele-cheie găsite (expresiile mai lungi valorează mai mult); câștigă intrarea cu cele mai multe puncte.
   O destinație numită în mesaj (ex. „Roma") primește un bonus, iar răspunsul se adaptează întrebării: preț, sezon, ce include.
   Răspunsul e în limba în care a scris utilizatorul, nu neapărat în limba paginii.

   Dacă vrei să adaugi un răspuns nou, îl scrii în js/faq-data.js (vezi exemplele de acolo). */
(function (root) {
    'use strict';

    const LANGS = ['ro', 'en', 'it', 'fr', 'es'];
    const SITE = {
        phone: '0799 927 590',
        email: 'crucrudenis@gmail.com',
        address: 'Str. Tudor Vladimirescu nr. 124, Tg-Jiu, Gorj',
        hours: { ro: 'luni–vineri 09:00–18:00, sâmbătă 10:00–14:00', en: 'Monday–Friday 09:00–18:00, Saturday 10:00–14:00', it: 'lunedì–venerdì 09:00–18:00, sabato 10:00–14:00', fr: 'lundi–vendredi 09:00–18:00, samedi 10:00–14:00', es: 'lunes–viernes 09:00–18:00, sábado 10:00–14:00' }
    };
    const EUR_RON = 5;

    const state = { entries: [], byId: {}, destMeta: {}, destEntries: [], ready: false, ext: {}, bestExtra: {} };
    const zeroVotes = function () { const v = {}; LANGS.forEach(function (l) { v[l] = 0; }); return v; };

    /* ------------------------------------------------------------------ text */
    function norm(s) {
        return String(s == null ? '' : s).toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')      // fără diacritice: ă â î ș ț è à ...
            .replace(/ß/g, 'ss').replace(/€/g, ' euro ')
            .replace(/[^a-z0-9]+/g, ' ').trim();
    }
    function compile(kw) {
        const stem = /\*$/.test(kw);
        const n = norm(String(kw).replace(/\*$/, ''));
        if (!n) return null;
        const esc = n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return { re: new RegExp('(?:^| )' + esc + (stem ? '' : '(?= |$)')), w: n.split(' ').length, stem: stem };
    }
    const points = function (c) { return 2 * c.w + (c.stem ? 0 : 1); };

    /* ------------------------------------------------------------------ înregistrare */
    // O limbă adăugată ulterior (js/faq-fr.js, js/faq-es.js) completează intrările existente după id: { id: { t, k, a } }
    function applyExt(e, lang) {
        const x = state.ext[lang] && state.ext[lang][e.id];
        if (x) { e[lang] = x; e._c[lang] = (x.k || []).map(compile).filter(Boolean); }
    }
    function register(list) {
        list.forEach(function (e) {
            e._c = {};
            LANGS.forEach(function (l) { e._c[l] = ((e[l] && e[l].k) || []).map(compile).filter(Boolean); applyExt(e, l); });
            state.entries.push(e);
            state.byId[e.id] = e;
        });
    }
    function extend(lang, map) {
        if (LANGS.indexOf(lang) === -1) return;
        state.ext[lang] = Object.assign(state.ext[lang] || {}, map);
        state.entries.forEach(function (e) { applyExt(e, lang); });
    }
    // „Cel mai bun moment" pe destinații, într-o limbă adăugată ulterior: { 'roma': 'text' }
    function extendDest(lang, map) { state.bestExtra[lang] = Object.assign(state.bestExtra[lang] || {}, map); }
    function registerDestinations(meta) { Object.assign(state.destMeta, meta); }

    // Se apelează la finalul faq-data.js: construiește intrările pentru fiecare destinație din catalog
    function finish() {
        const list = (typeof destinations !== 'undefined' && Array.isArray(destinations)) ? destinations : [];
        state.destEntries = list.map(function (d) {
            const meta = state.destMeta[d.id] || {};
            const kws = (meta.alias || []).concat([d.title]);
            return { id: 'dest:' + d.id, dest: d.id, _c: { all: kws.map(compile).filter(Boolean) } };
        });
        state.ready = true;
    }

    /* ------------------------------------------------------------------ date din catalog */
    const dests = function () { return (typeof destinations !== 'undefined' && Array.isArray(destinations)) ? destinations : []; };
    const destById = function (id) { return dests().find(function (d) { return d.id === id; }); };
    const dict = function (lang) { return (lang !== 'ro' && typeof i18n !== 'undefined' && i18n[lang]) ? i18n[lang] : null; };
    function destText(d, lang) {
        const dc = dict(lang), p = 'dest.' + d.id + '.';
        return {
            title: (dc && dc[p + 'title']) || d.title,
            description: (dc && dc[p + 'description']) || d.description,
            amenities: (dc && dc[p + 'amenities']) ? String(dc[p + 'amenities']).split('|') : (d.amenities || [])
        };
    }
    const profile = function (d) { return (typeof FVPricing !== 'undefined') ? FVPricing.profile(d) : { nights: 0, board: 'none', transportIncluded: false, nightsFixed: false, minNights: 0, maxNights: 0, guideIncluded: false }; };
    const fmt = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); };

    const W = {
        ro: { from: 'de la', nights: 'nopți', adult: 'pe adult', board: { ai: 'all inclusive', full: 'pensiune completă', half: 'demipensiune', bb: 'mic dejun', none: 'fără masă' },
              fixed: 'durată fixă', flexible: 'durată flexibilă', transportYes: 'Transport inclus.', transportNo: 'Transportul nu e inclus (se poate adăuga ca serviciu extra).', guideYes: 'Ghid local inclus.',
              includes: 'include', duration: 'Durată', forTwo: 'Pentru 2 adulți', roomNote: 'în cameră dublă, în sezon redus', priceNote: 'Prețul crește în sezon și se ajustează la durata aleasă; în fereastra pachetului vezi estimarea exactă pe persoane, date și servicii.',
              weather: 'Verifică prognoza înainte de plecare.', compare: 'Iată o comparație rapidă:', see: 'Vezi pachetul pentru detalii.', noneUnder: 'Sub {b} € pe persoană nu avem pachete; cel mai ieftin începe de la {m} €.', under: 'Cu un buget de {b} € pe persoană (pachet standard, cameră dublă) ai aceste pachete:', ask: 'Spune-mi ce buget ai (ex. „am 600 euro”) și îți arăt pachetele potrivite. Ca reper, avem pachete de la {min} € la {max} € pe adult:' },
        en: { from: 'from', nights: 'nights', adult: 'per adult', board: { ai: 'all inclusive', full: 'full board', half: 'half board', bb: 'breakfast', none: 'no meals' },
              fixed: 'fixed length', flexible: 'flexible length', transportYes: 'Transport included.', transportNo: 'Transport is not included (it can be added as an extra service).', guideYes: 'Local guide included.',
              includes: 'includes', duration: 'Length', forTwo: 'For 2 adults', roomNote: 'in a double room, low season', priceNote: 'The price rises in high season and adjusts to the length you choose; open the package to see the exact estimate for people, dates and extras.',
              weather: 'Check the forecast before you travel.', compare: 'A quick comparison:', see: 'Open the package for details.', noneUnder: 'We have no packages under {b} € per person; the cheapest starts from {m} €.', under: 'With a budget of {b} € per person (standard package, double room) you can choose:', ask: 'Tell me your budget (e.g. "I have 600 euro") and I will show matching packages. For reference, our packages range from {min} € to {max} € per adult:' },
        it: { from: 'da', nights: 'notti', adult: 'a persona', board: { ai: 'all inclusive', full: 'pensione completa', half: 'mezza pensione', bb: 'colazione', none: 'senza pasti' },
              fixed: 'durata fissa', flexible: 'durata flessibile', transportYes: 'Trasporto incluso.', transportNo: 'Il trasporto non è incluso (si può aggiungere come servizio extra).', guideYes: 'Guida locale inclusa.',
              includes: 'include', duration: 'Durata', forTwo: 'Per 2 adulti', roomNote: 'in camera doppia, bassa stagione', priceNote: 'Il prezzo sale in alta stagione e si adegua alla durata scelta; apri il pacchetto per la stima esatta con persone, date e servizi.',
              weather: 'Controlla le previsioni prima di partire.', compare: 'Un rapido confronto:', see: 'Apri il pacchetto per i dettagli.', noneUnder: 'Sotto {b} € a persona non abbiamo pacchetti; il più economico parte da {m} €.', under: 'Con un budget di {b} € a persona (pacchetto standard, camera doppia) puoi scegliere:', ask: 'Dimmi il tuo budget (es. "ho 600 euro") e ti mostro i pacchetti adatti. Come riferimento, i nostri pacchetti vanno da {min} € a {max} € a persona:' },
        fr: { from: 'à partir de', nights: 'nuits', adult: 'par adulte', board: { ai: 'tout compris', full: 'pension complète', half: 'demi-pension', bb: 'petit-déjeuner', none: 'sans repas' },
              fixed: 'durée fixe', flexible: 'durée flexible', transportYes: 'Transport inclus.', transportNo: 'Le transport n\'est pas inclus (il peut être ajouté comme service supplémentaire).', guideYes: 'Guide local inclus.',
              includes: 'comprend', duration: 'Durée', forTwo: 'Pour 2 adultes', roomNote: 'en chambre double, basse saison', priceNote: 'Le prix augmente en haute saison et s\'ajuste à la durée choisie ; ouvrez le forfait pour voir l\'estimation exacte selon les personnes, les dates et les services.',
              weather: 'Vérifiez la météo avant de partir.', compare: 'Une comparaison rapide :', see: 'Ouvrez le forfait pour les détails.', noneUnder: 'Nous n\'avons pas de forfaits à moins de {b} € par personne ; le moins cher commence à {m} €.', under: 'Avec un budget de {b} € par personne (forfait standard, chambre double), vous pouvez choisir :', ask: 'Dites-moi votre budget (ex. « j\'ai 600 euros ») et je vous montrerai les forfaits adaptés. À titre indicatif, nos forfaits vont de {min} € à {max} € par adulte :' },
        es: { from: 'desde', nights: 'noches', adult: 'por adulto', board: { ai: 'todo incluido', full: 'pensión completa', half: 'media pensión', bb: 'desayuno', none: 'sin comidas' },
              fixed: 'duración fija', flexible: 'duración flexible', transportYes: 'Transporte incluido.', transportNo: 'El transporte no está incluido (se puede añadir como servicio extra).', guideYes: 'Guía local incluido.',
              includes: 'incluye', duration: 'Duración', forTwo: 'Para 2 adultos', roomNote: 'en habitación doble, temporada baja', priceNote: 'El precio sube en temporada alta y se ajusta a la duración elegida; abre el paquete para ver la estimación exacta según personas, fechas y servicios.',
              weather: 'Consulta la previsión del tiempo antes de viajar.', compare: 'Una comparación rápida:', see: 'Abre el paquete para ver los detalles.', noneUnder: 'No tenemos paquetes por menos de {b} € por persona; el más económico empieza en {m} €.', under: 'Con un presupuesto de {b} € por persona (paquete estándar, habitación doble) puedes elegir:', ask: 'Dime tu presupuesto (p. ej. «tengo 600 euros») y te mostraré los paquetes adecuados. Como referencia, nuestros paquetes van de {min} € a {max} € por adulto:' }
    };

    /* ------------------------------------------------------------------ răspunsuri pentru destinații */
    const INTENT = {
        time: /(?:^| )(?:cand|sezon|moment|luna|vreme|clima|meteo|temperatur|cel mai bun|when|season|weather|climate|month|best time|quando|stagione|periodo|mese|tempo|quand|saison|meteo|climat|quel mois|mois ideal|meilleure periode|cuando|epoca|temporada|clima|que mes|mes ideal|mejor epoca|mejor momento)/,
        price: /(?:^| )(?:cat cost|costa|cost|pret|tarif|price|prices|how much|quanto|prezzo|prezzi|euro|lei|ron|buget|budget|combien|prix|tarif|cout|coute|cuanto|precio|cuesta|presupuesto)/,
        incl: /(?:^| )(?:includ|inclus|contine|facilit|amenit|included|includes|inclu|compres|comprend|cosa include|contien|prestations|comodidades|servicios)/
    };
    function intentOf(t) { return INTENT.time.test(t) ? 'time' : INTENT.price.test(t) ? 'price' : INTENT.incl.test(t) ? 'incl' : 'info'; }

    function bestOf(d, lang) {
        const m = state.destMeta[d.id], x = state.bestExtra[lang] && state.bestExtra[lang][d.id];
        return m && m.best ? (m.best[lang] || x || m.best.en || m.best.ro) : (x || '');
    }

    function destAnswer(d, intent, lang) {
        const w = W[lang], p = profile(d), tx = destText(d, lang), board = w.board[p.board] || '';
        const dur = p.nights + ' ' + w.nights + (p.nightsFixed ? ' (' + w.fixed + ')' : '');
        const head = '**' + tx.title + '**';
        const priceLine = w.from + ' **' + d.price + ' €** (' + fmt(d.price * EUR_RON) + ' lei) ' + w.adult + ', ' + w.roomNote + '.';
        const trLine = (p.transportIncluded ? w.transportYes : w.transportNo) + (p.guideIncluded ? ' ' + w.guideYes : '');
        if (intent === 'time') return head + '\n' + bestOf(d, lang) + '\n' + w.weather;
        if (intent === 'price') return head + ' — ' + dur + (board ? ', ' + board : '') + '.\n' + priceLine.charAt(0).toUpperCase() + priceLine.slice(1) + '\n' + w.forTwo + ': **' + fmt(2 * d.price) + ' €** (≈ ' + fmt(2 * d.price * EUR_RON) + ' lei).\n' + trLine + '\n' + w.priceNote;
        if (intent === 'incl') return head + ' ' + w.includes + ': ' + tx.amenities.join(', ') + '.\n' + w.duration + ': ' + dur + (board ? ', ' + board : '') + '. ' + trLine;
        return head + '\n' + tx.description + '\n' + w.duration + ': ' + dur + ' · ' + priceLine + '\n' + bestOf(d, lang);
    }

    function compareAnswer(ids, lang) {
        const w = W[lang];
        const rows = ids.map(function (id) {
            const d = destById(id), p = profile(d), tx = destText(d, lang);
            return '• **' + tx.title + '** — ' + p.nights + ' ' + w.nights + ', ' + w.from + ' ' + d.price + ' € (' + (w.board[p.board] || '') + ')';
        });
        return w.compare + '\n' + rows.join('\n') + '\n' + w.see;
    }

    /* ------------------------------------------------------------------ răspunsuri calculate din catalog */
    function bullets(list, lang) {
        const w = W[lang];
        return list.map(function (d) { return '• **' + destText(d, lang).title + '** — ' + w.from + ' ' + d.price + ' € · ' + profile(d).nights + ' ' + w.nights; }).join('\n');
    }
    const byPrice = function (list) { return list.slice().sort(function (a, b) { return a.price - b.price; }); };
    const DYN = {
        cheapest: function (e, lang) { const l = byPrice(dests()).slice(0, 4); return { list: l, text: null }; },
        priciest: function (e, lang) { const l = byPrice(dests()).slice(-4).reverse(); return { list: l }; },
        weekend: function () { return { list: byPrice(dests().filter(function (d) { return profile(d).nights <= 3; })).slice(0, 5) }; },
        longtrip: function () { return { list: dests().filter(function (d) { return profile(d).nights >= 8; }).sort(function (a, b) { return profile(b).nights - profile(a).nights; }).slice(0, 5) }; },
        allinclusive: function () { return { list: dests().filter(function (d) { return profile(d).board === 'ai'; }) }; },
        fixed: function () { return { list: dests().filter(function (d) { return profile(d).nightsFixed; }) }; }
    };

    // „De la" cel mai mic preț pe grupe de destinații, calculat din catalog
    function rangesText(lang) {
        const L = {
            ro: ['România', 'City break în Europa', 'Plajă și munte în Europa', 'Exotice', 'China și Coreea de Sud'],
            en: ['Romania', 'City breaks in Europe', 'Beach and mountains in Europe', 'Exotic', 'China and South Korea'],
            it: ['Romania', 'City break in Europa', 'Mare e montagna in Europa', 'Esotiche', 'Cina e Corea del Sud'],
            fr: ['Roumanie', 'City breaks en Europe', 'Mer et montagne en Europe', 'Destinations exotiques', 'Chine et Corée du Sud'],
            es: ['Rumanía', 'Escapadas urbanas en Europa', 'Playa y montaña en Europa', 'Destinos exóticos', 'China y Corea del Sur']
        }[lang];
        const groups = [['romania'], ['city-break'], ['plaja', 'munte'], ['exotic'], ['asia']];
        return groups.map(function (g, i) {
            const l = dests().filter(function (d) { return g.indexOf(d.category) !== -1; });
            if (!l.length) return '';
            return '• **' + L[i] + ':** ' + W[lang].from + ' ' + Math.min.apply(null, l.map(function (d) { return d.price; })) + ' € ' + W[lang].adult;
        }).filter(Boolean).join('\n');
    }

    function budgetAnswer(hit, lang) {
        const w = W[lang];
        const m = /(\d{2,5})/.exec(hit.text || '');
        const lei = /(?:^| )(?:lei|ron)(?: |$)/.test(hit.text || '');
        const list = byPrice(dests());
        if (!m) return { text: w.ask.replace('{min}', list[0].price).replace('{max}', list[list.length - 1].price) + '\n' + bullets([list[0], list[Math.floor(list.length / 2)], list[list.length - 1]], lang), list: [] };
        let budget = parseInt(m[1], 10);
        if (lei) budget = Math.round(budget / EUR_RON);
        const ok = list.filter(function (d) { return d.price <= budget; });
        if (!ok.length) return { text: w.noneUnder.replace('{b}', budget).replace('{m}', list[0].price), list: [list[0]] };
        const show = ok.slice(-5).reverse();
        return { text: w.under.replace('{b}', budget) + '\n' + bullets(show, lang), list: show };
    }

    /* ------------------------------------------------------------------ potrivirea mesajului */
    const HINTS = {
        ro: ['cat', 'cum', 'ce', 'cand', 'unde', 'este', 'sunt', 'pentru', 'vreau', 'aveti', 'pot', 'imi', 'mi', 'si', 'sau', 'la', 'un', 'o', 'de', 'cu', 'nu', 'da'],
        en: ['how', 'much', 'what', 'when', 'where', 'is', 'are', 'the', 'for', 'want', 'do', 'you', 'can', 'my', 'and', 'or', 'to', 'a', 'of', 'with', 'i', 'have'],
        it: ['quanto', 'come', 'che', 'cosa', 'quando', 'dove', 'per', 'voglio', 'avete', 'posso', 'il', 'lo', 'la', 'un', 'una', 'di', 'con', 'non', 'e', 'sono', 'ho', 'del'],
        fr: ['combien', 'comment', 'quel', 'quelle', 'quand', 'pour', 'veux', 'avez', 'puis', 'mon', 'les', 'des', 'une', 'du', 'avec', 'pas', 'vous', 'je', 'est', 'sont', 'bonjour', 'merci'],
        es: ['cuanto', 'como', 'cuando', 'donde', 'quiero', 'tienen', 'puedo', 'los', 'las', 'una', 'con', 'son', 'tengo', 'del', 'por', 'para', 'hola', 'gracias']
    };
    function pickLang(t, votes, uiLang) {
        const words = t.split(' ');
        const score = {}; LANGS.forEach(function (l) { score[l] = votes[l] || 0; });
        LANGS.forEach(function (l) { words.forEach(function (x) { if (HINTS[l].indexOf(x) !== -1) score[l] += 0.5; }); });
        let best = uiLang, top = score[uiLang] + 0.01;   // limba paginii câștigă la egalitate
        LANGS.forEach(function (l) { if (score[l] > top) { top = score[l]; best = l; } });
        return best;
    }

    // Punctajul unei intrări: fiecare fragment din mesaj se numără o singură dată. Dacă mai multe cuvinte-cheie acoperă același
    // loc (ex. „card" și „plata cu cardul", sau același cuvânt scris identic în două limbi), contează doar cel mai lung.
    function scoreEntry(e, t) {
        const found = [];
        LANGS.forEach(function (l) {
            e._c[l].forEach(function (c) {
                const m = c.re.exec(t);
                if (m) { const s = m.index + (m[0].charAt(0) === ' ' ? 1 : 0); found.push({ l: l, s: s, e: m.index + m[0].length, p: points(c) }); }
            });
        });
        found.sort(function (a, b) { return b.p - a.p || a.s - b.s; });
        const picked = [], votes = zeroVotes();
        let total = 0;
        found.forEach(function (x) {
            const clash = picked.filter(function (y) { return x.s < y.e && y.s < x.e; })[0];
            if (clash) { if (clash.p === x.p && clash.s === x.s && clash.e === x.e) clash.langs.push(x.l); return; }
            picked.push({ s: x.s, e: x.e, p: x.p, langs: [x.l] });
            total += x.p;
        });
        picked.forEach(function (y) { y.langs.forEach(function (l) { votes[l] += y.p / y.langs.length; }); });
        return { score: total, votes: votes };
    }
    // Cea mai bună potrivire a numelor unei destinații, cu poziția în text (ca „brasov" din „poiana brasov" să nu conteze separat)
    function scoreDest(e, t) {
        let best = { score: 0, start: -1, end: -1 };
        e._c.all.forEach(function (c) {
            const m = c.re.exec(t);
            if (m) { const p = points(c); if (p > best.score) best = { score: p, start: m.index, end: m.index + m[0].length }; }
        });
        return best;
    }

    // „600 euro", „1500 lei", „euro 800": o sumă cu monedă este aproape sigur o întrebare de buget
    const BUDGET_RX = /(?:^| )\d{2,5}(?: de)? ?(?:euro|eur|lei|ron)(?: |$)|(?:^| )(?:euro|eur|lei|ron) ?\d{2,5}(?: |$)/;

    function match(text, uiLang) {
        const t = norm(text);
        if (!t || !state.ready) return null;
        const nWords = t.split(' ').length;
        const cands = [];
        state.entries.forEach(function (e, i) {
            if (e.short && nWords > 5) return;
            const r = scoreEntry(e, t);
            if (r.score >= 2) cands.push({ e: e, idx: i, score: r.score, votes: r.votes });
        });
        let destHits = [];
        state.destEntries.forEach(function (e) {
            const s = scoreDest(e, t);
            if (s.score >= 2) destHits.push({ e: e, score: s.score, start: s.start, end: s.end });
        });
        destHits.sort(function (a, b) { return b.score - a.score; });
        // o potrivire cuprinsă în alta mai lungă (ex. „brasov" în „poiana brasov") nu se socotește
        destHits = destHits.filter(function (h, i) {
            return !destHits.slice(0, i).some(function (o) { return h.start >= o.start && h.end <= o.end; });
        });
        // un subiect general (acte, vaccinuri, monedă, bacșiș...) are prioritate chiar dacă mesajul numește și o destinație
        const topical = cands.some(function (c) { return c.e.topic && c.score >= 3; });
        if (destHits.length && !topical) {
            // raspunsurile generale (cand e cel mai bun moment, ce include pretul) cedeaza in fata destinatiei numite
            for (let i = cands.length - 1; i >= 0; i--) if (cands[i].e.defer) cands.splice(i, 1);
            // o destinație numită în mesaj = intenție foarte clară: bonus față de răspunsurile generale
            if (destHits.length >= 2 && destHits[1].score >= 2) {
                return { entry: null, compare: destHits.slice(0, 3).map(function (h) { return h.e.dest; }), lang: pickLang(t, zeroVotes(), uiLang), text: t, score: destHits[0].score + 7 };
            }
            cands.push({ e: destHits[0].e, idx: 1000, score: destHits[0].score + 7, votes: zeroVotes(), dest: true });
        }
        if (BUDGET_RX.test(t) && state.byId.budget) {
            const bi = state.entries.indexOf(state.byId.budget);
            const ex = cands.filter(function (c) { return c.e === state.byId.budget; })[0];
            if (ex) ex.score += 6; else cands.push({ e: state.byId.budget, idx: bi, score: 6, votes: zeroVotes() });
        }
        if (!cands.length) return null;
        cands.sort(function (a, b) { return b.score - a.score || a.idx - b.idx; });
        const best = cands[0];
        const hit = { entry: best.e, score: best.score, text: t, lang: pickLang(t, best.votes, uiLang) };
        if (best.dest) { hit.dest = best.e.dest; hit.intent = intentOf(t); }
        return hit;
    }

    // Răspunsuri „locale": salut, mulțumesc, la revedere... (mesaje scurte, deja acoperite) — nu merită o cerere către AI
    function matchLocal(text, uiLang) {
        const hit = match(text, uiLang);
        if (!hit || !hit.entry || !hit.entry.local) return null;
        return (hit.text.split(' ').length <= 5 && hit.score >= 3) ? hit : null;
    }

    /* ------------------------------------------------------------------ construirea răspunsului */
    function fill(str, lang) {
        return String(str)
            .replace(/\{phone\}/g, SITE.phone).replace(/\{email\}/g, SITE.email).replace(/\{address\}/g, SITE.address)
            .replace(/\{hours\}/g, SITE.hours[lang] || SITE.hours.ro).replace(/\{count\}/g, String(dests().length));
    }
    const labelOf = function (id, lang) { const e = state.byId[id]; return e ? ((e[lang] && e[lang].t) || (e.en && e.en.t) || (e.ro && e.ro.t) || id) : id; };
    function chips(ids, lang) {
        const out = [];
        (ids || []).forEach(function (id) { if (state.byId[id]) out.push({ label: labelOf(id, lang), value: 'faq:' + id }); });
        return out.slice(0, 4);
    }

    function answer(hit, uiLang) {
        const lang = (hit && hit.lang) || uiLang || 'ro';
        // comparație între destinații
        if (hit.compare) {
            return { text: compareAnswer(hit.compare, lang), replies: chips(['how-to-book', 'extras', 'contact'], lang), packages: hit.compare.slice(0, 3), lang: lang };
        }
        // destinație numită în mesaj
        if (hit.dest) {
            const d = destById(hit.dest);
            return { text: destAnswer(d, hit.intent || 'info', lang), replies: chips(['how-to-book', 'extras', 'contact'], lang), packages: [d.id], lang: lang };
        }
        const e = hit.entry;
        const tx = e[lang] || e.en || e.ro;
        let text = fill(tx.a || '', lang), pk = (e.p || []).slice();
        if (e.dyn === 'budget') {
            const b = budgetAnswer(hit, lang);
            text = b.text; pk = b.list.map(function (d) { return d.id; });
        } else if (e.dyn && DYN[e.dyn]) {
            const r = DYN[e.dyn](e, lang);
            if (r.list.length) { text = text + '\n' + bullets(r.list, lang); pk = r.list.map(function (d) { return d.id; }); }
        } else if (e.dyn === 'ranges') {
            text = text + '\n' + rangesText(lang);
        } else if (e.cats) {
            const l = byPrice(dests().filter(function (d) { return e.cats.indexOf(d.category) !== -1; }));
            if (l.length) { text = text + '\n' + bullets(l, lang); pk = l.slice(0, 3).map(function (d) { return d.id; }); }
        } else if (e.list) {
            const l = e.list.map(destById).filter(Boolean);
            if (l.length) { text = text + '\n' + bullets(l, lang); pk = l.map(function (d) { return d.id; }); }
        }
        return { text: text, replies: chips(e.next, lang), packages: pk.filter(function (id) { return !!destById(id); }).slice(0, 3), lang: lang };
    }

    function answerById(id, uiLang) {
        const e = state.byId[id];
        return e ? answer({ entry: e, lang: uiLang, text: '' }, uiLang) : null;
    }

    function stats() {
        const authored = state.entries.length, dst = state.destEntries.length;
        return { authored: authored, destinations: dst, total: authored + dst };
    }

    const api = {
        SITE: SITE, LANGS: LANGS, norm: norm, register: register, extend: extend, extendDest: extendDest, registerDestinations: registerDestinations, finish: finish,
        match: match, matchLocal: matchLocal, answer: answer, answerById: answerById, stats: stats,
        entries: function () { return state.entries; }, byId: function (id) { return state.byId[id]; }, destMeta: function () { return state.destMeta; },
        get ready() { return state.ready; }, _state: state
    };
    if (typeof module !== 'undefined' && module.exports) module.exports = api;
    root.FVFAQ = api;
})(typeof window !== 'undefined' ? window : globalThis);
