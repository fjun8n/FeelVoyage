/* FeelVoyage — trimite e-mailuri (prin EmailJS) din browser, fără server propriu. Cheile se pun în
   js/emailjs-config.js — vezi instrucțiunile de acolo. Sunt DOUĂ funcții independente, fiecare cu propriul șablon:

   1. send(order) — notificare de comandă nouă, către tine (toEmail), la fiecare rezervare/mesaj de contact.
      Apelată automat din js/app.js → sendOrder(), pe lângă salvarea în baza de date (care se întâmplă oricum).

   2. sendUpdateToSubscribers(emails, message) — newsletter: un e-mail scurt, scris de administrator, către toți cei
      abonați. Apelată din panoul de administrator (js/admin.js), la cerere, niciodată automat.

   Fiecare funcționează DOAR dacă propriile ei chei sunt completate în js/emailjs-config.js — sunt independente,
   poți avea doar una activă, sau niciuna (site-ul funcționează normal oricum, doar partea de e-mail e sărită). */
(function () {
    'use strict';
    const SDK_URL = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    const cfg = window.FV_EMAILJS_CONFIG || {};
    const filled = function (k) { return typeof cfg[k] === 'string' && cfg[k].trim() !== '' && !/^PASTE/i.test(cfg[k].trim()); };
    const configured = ['publicKey', 'serviceId', 'templateId', 'toEmail'].every(filled);
    const updateConfigured = ['publicKey', 'serviceId', 'updateTemplateId'].every(filled);

    if (!configured) console.info('[FeelVoyage] Notificarea de comandă pe e-mail e dezactivată — completează js/emailjs-config.js ca să o activezi. Comenzile tot se salvează normal în baza de date.');
    if (!updateConfigured) console.info('[FeelVoyage] Trimiterea de newsletter e dezactivată — completează updateTemplateId în js/emailjs-config.js ca să o activezi.');

    if (!configured && !updateConfigured) {
        window.FVEmailNotify = {
            configured: false, updateConfigured: false,
            send: function () { return Promise.resolve(false); },
            sendUpdateToSubscribers: function (emails) { return Promise.resolve({ sent: 0, failed: emails.length, reason: 'not-configured' }); }
        };
        return;
    }

    let sdkReady = false, sdkFailed = false;
    (function loadSDK() {
        const s = document.createElement('script');
        s.src = SDK_URL;
        s.onload = function () {
            try { emailjs.init({ publicKey: cfg.publicKey }); sdkReady = true; }
            catch (e) { sdkFailed = true; console.error('[FeelVoyage] EmailJS nu a putut porni:', e); }
        };
        s.onerror = function () { sdkFailed = true; console.error('[FeelVoyage] Nu s-a putut încărca scriptul EmailJS (internet oprit sau resursă blocată).'); };
        document.head.appendChild(s);
    })();

    function waitReady(ms) {
        if (sdkReady) return Promise.resolve(true);
        if (sdkFailed) return Promise.resolve(false);
        return new Promise(function (resolve) {
            const start = Date.now();
            (function poll() {
                if (sdkReady) return resolve(true);
                if (sdkFailed || Date.now() - start > ms) return resolve(false);
                setTimeout(poll, 100);
            })();
        });
    }
    function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    // „order" vine din js/app.js → sendOrder (aceleași câmpuri trimise și către baza de date)
    // De la zero, cât mai simplu posibil: DOAR variabile simple {{...}}, fără {{#if}}, fără triple-acolade
    // {{{...}}}, fără HTML construit în cod — exact tiparul newsletter-ului, care a mers dintotdeauna fără
    // nicio problemă. Fiecare câmp gol devine „—” (nu rămâne gol de tot, ca să se vadă clar în e-mail că
    // acel criteriu n-a fost completat, nu doar un rând „ciudat”, gol).
    function orDash(v) { return (v === null || v === undefined || v === '') ? '—' : String(v); }

    // Șablonul englez e opțional (vezi js/emailjs-config.js → templateIdEn) — dacă e completat, cererile trimise
    // cât timp site-ul era în engleză folosesc automat varianta engleză a notificării, fără nimic de ales manual.
    function useEnglishOrderTemplate(order) { return order && order.lang === 'en' && filled('templateIdEn'); }

    /* ---------------------------------------------------------------- limba abonatului, după țara din cont */
    // „Stau în Franța, am țara în cont pe Franța, deci primesc mailul în franceză.”
    // Țara se salvează la cont prin geolocalizare (js/geo.js) sau o alege omul din formular.
    // Țările care nu sunt mai jos primesc engleză — limba cea mai probabil înțeleasă.
    var LANG_BY_COUNTRY = {
        RO: 'ro', MD: 'ro',
        IT: 'it', SM: 'it', VA: 'it',
        FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', CH: 'fr', CA: 'fr',
        ES: 'es', MX: 'es', AR: 'es', CL: 'es', CO: 'es', PE: 'es', VE: 'es', EC: 'es', BO: 'es',
        PY: 'es', UY: 'es', CR: 'es', PA: 'es', GT: 'es', HN: 'es', SV: 'es', NI: 'es', DO: 'es', CU: 'es', PR: 'es'
    };
    function langForCountry(cc) {
        var c = String(cc || '').trim().toUpperCase();
        return LANG_BY_COUNTRY[c] || 'en';
    }
    /* Limba în care primește un abonat anunțul: limba ȚĂRII salvate pe contul lui.
       Dacă pe cont nu e salvată nicio țară, primește limba în care a fost scris anunțul.
       Limba în care scrii TU nu influențează pe nimeni care are țara salvată pe cont. */
    function langForRecipient(r, fallback) {
        if (r && r.country) return langForCountry(r.country);
        return fallback || 'ro';
    }
    // Șablonul EmailJS pentru o limbă; dacă lipsește, engleza, iar în ultimă instanță româna.
    function templateForLang(lang) {
        var key = { en: 'updateTemplateIdEn', it: 'updateTemplateIdIt', fr: 'updateTemplateIdFr', es: 'updateTemplateIdEs' }[lang];
        if (key && filled(key)) return cfg[key];
        if (lang !== 'ro' && filled('updateTemplateIdEn')) return cfg.updateTemplateIdEn;
        return cfg.updateTemplateId;
    }
    function buildParams(order) {
        const en = useEnglishOrderTemplate(order);
        const totalPrice = order.totalPrice != null ? (order.totalPrice + ' ' + (order.currency || '€') + ' (≈ ' + (order.priceRon || '') + ')') : '';
        return {
            to_email: cfg.toEmail,
            order_type: order.type === 'booking' ? (en ? 'Package booking' : 'Rezervare pachet') : (en ? 'Contact message' : 'Mesaj de contact'),
            name: orDash(order.name),
            phone: orDash(order.phone),
            email: orDash(order.email),
            destination: orDash(order.destinationTitle || order.destination),
            country: orDash(order.country),
            message: orDash(order.message),
            period: orDash(order.periodText),
            travelers: orDash(order.travelers),
            services: orDash(order.services),
            amenities_excluded: orDash(order.amenitiesExcluded),
            total_price: totalPrice,
            // Estimarea calculată automat pentru o destinație din afara catalogului (js/estimate.js).
            // La rezervările de pachete nu există — rămâne gol, iar în șablon rândul nu se afișează.
            estimate: estimateText(order, en),
            estimate_details: estimateDetails(order, en),
            sent_at: order.dateText || new Date().toLocaleString('ro-RO')
        };
    }

    // „1.195 € (≈ 5.975 lei) · 598 € / persoană” — ce a văzut și clientul pe site
    function estimateText(order, en) {
        if (order.estimateTotal == null) return '';
        var bits = [Math.round(order.estimateTotal) + ' €'];
        if (order.estimateRon) bits.push('(≈ ' + order.estimateRon + ')');
        if (order.estimatePerPerson) bits.push('· ' + Math.round(order.estimatePerPerson) + ' € / ' + (en ? 'person' : 'persoană'));
        return bits.join(' ');
    }
    // din ce e compusă estimarea, ca să poți verifica repede dacă e aproape de realitate
    function estimateDetails(order, en) {
        if (order.estimateTotal == null) return '';
        var parts = [];
        if (order.estimatePlace) parts.push((en ? 'Place: ' : 'Loc: ') + order.estimatePlace);
        if (order.estimateNights) parts.push(order.estimateNights + (en ? ' nights' : ' nopți'));
        if (order.estimateFlight) parts.push((en ? 'flight ' : 'zbor ') + order.estimateFlight + ' €/' + (en ? 'adult' : 'adult'));
        if (order.estimateNight) parts.push((en ? 'accommodation ' : 'cazare ') + order.estimateNight + ' €/' + (en ? 'night' : 'noapte'));
        if (order.estimateSource) parts.push((en ? 'source: ' : 'sursă: ') + order.estimateSource);
        return parts.join(' · ');
    }

    window.FVEmailNotify = {
        configured: configured,
        updateConfigured: updateConfigured,
        updateConfiguredEn: updateConfigured && filled('updateTemplateIdEn'),   // arată butonul Română/English la „Trimite actualizare” doar dacă e cu adevărat pregătit

        send: async function (order) {
            if (!configured) return false;
            if (!(await waitReady(4000))) return false;
            try {
                const tplId = useEnglishOrderTemplate(order) ? cfg.templateIdEn : cfg.templateId;
                await emailjs.send(cfg.serviceId, tplId, buildParams(order));
                if (window.FVLog) FVLog.info('order', 'email-sent', { type: order.type });
                return true;
            } catch (e) {
                console.error('[FeelVoyage] Notificarea pe e-mail a eșuat (comanda tot s-a salvat în baza de date):', e);
                if (window.FVLog) FVLog.warn('order', 'email-failed', { type: order.type });
                return false;
            }
        },

        // emails: listă de adrese; message: textul scris de administrator; onProgress(facute, total, ultimaEroare) e apelat după fiecare încercare;
        // lang: 'en' trimite cu varianta engleză a șablonului (dacă updateTemplateIdEn e completat în js/emailjs-config.js), altfel română ca până acum
        langForCountry: langForCountry,
        langForRecipient: langForRecipient,

        /* Newsletter, pe limba țării fiecărui abonat.
           „recipients” poate fi:
             • o listă de obiecte { email, country } — fiecare primește pe limba țării salvate pe contul lui;
             • o listă de e-mailuri (text) — ca înainte, toți pe aceeași limbă (opts.lang).
           opts: { lang: limba în care ai scris mesajul, translate: true/false }
           Limba în care scrii TU e doar punctul de pornire al traducerii: nu ajunge la nimeni care are țara
           salvată pe cont. Scrii în engleză, iar un abonat cu România pe cont primește română.
           Mesajul se traduce o singură dată, pentru limbile de care e nevoie (js/translate.js, Gemini),
           apoi fiecare om primește șablonul limbii lui. Dacă pentru o limbă nu există șablon în
           js/emailjs-config.js, se folosește cel englez, iar dacă nici acela nu există, cel românesc. */
        sendUpdateToSubscribers: async function (recipients, message, onProgress, opts) {
            const list = (recipients || []).map(function (r) {
                return (typeof r === 'string') ? { email: r, country: '' } : { email: r.email, country: r.country || '' };
            }).filter(function (r) { return r.email; });
            if (!updateConfigured) return { sent: 0, failed: list.length, reason: 'not-configured' };
            if (!(await waitReady(4000))) return { sent: 0, failed: list.length, reason: 'sdk-unavailable' };

            // compatibil cu apelul vechi, în care al 4-lea argument era direct limba
            const o = (typeof opts === 'string') ? { lang: opts, translate: false } : (opts || {});
            const from = o.lang || 'ro';
            const autoTranslate = o.translate !== false;

            // limba fiecăruia: cea a țării din cont; dacă n-are țară, cea în care ai scris
            list.forEach(function (r) { r.sendLang = langForRecipient(r, from); });

            // traducem o singură dată, doar pentru limbile de care avem nevoie
            let texts = {};
            texts[from] = message;
            if (autoTranslate) {
                const needed = [];
                list.forEach(function (r) { if (r.sendLang !== from && needed.indexOf(r.sendLang) === -1) needed.push(r.sendLang); });
                if (needed.length && window.FVTranslate) {
                    const translated = await FVTranslate.toLanguages(message, needed, from);
                    Object.keys(translated).forEach(function (l) { texts[l] = translated[l]; });
                }
            }

            let sent = 0, failed = 0;
            const byLang = {};
            for (let i = 0; i < list.length; i++) {
                const r = list[i];
                const tplId = templateForLang(r.sendLang);
                const body = texts[r.sendLang] || texts[from] || message;
                try {
                    await emailjs.send(cfg.serviceId, tplId, { to_email: r.email, message: body, sent_at: new Date().toLocaleString('ro-RO') });
                    sent++;
                    byLang[r.sendLang] = (byLang[r.sendLang] || 0) + 1;
                } catch (e) {
                    failed++;
                    console.error('[FeelVoyage] Nu am putut trimite actualizarea către', r.email, ':', e);
                }
                if (onProgress) onProgress(sent + failed, list.length, r.sendLang);
                if (i < list.length - 1) await sleep(700);   // mică pauză, ca să nu trimitem totul deodată
            }
            if (window.FVLog) FVLog.info('order', 'newsletter-broadcast', { sent: sent, failed: failed, total: list.length, langs: byLang });
            return { sent: sent, failed: failed, byLang: byLang, texts: texts };
        }
    };
})();
