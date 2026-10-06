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

    function buildParams(order) {
        const totalPrice = order.totalPrice != null ? (order.totalPrice + ' ' + (order.currency || '€') + ' (≈ ' + (order.priceRon || '') + ')') : '';
        return {
            to_email: cfg.toEmail,
            order_type: order.type === 'booking' ? 'Rezervare pachet' : 'Mesaj de contact',
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
            sent_at: order.dateText || new Date().toLocaleString('ro-RO')
        };
    }

    window.FVEmailNotify = {
        configured: configured,
        updateConfigured: updateConfigured,

        send: async function (order) {
            if (!configured) return false;
            if (!(await waitReady(4000))) return false;
            try {
                await emailjs.send(cfg.serviceId, cfg.templateId, buildParams(order));
                if (window.FVLog) FVLog.info('order', 'email-sent', { type: order.type });
                return true;
            } catch (e) {
                console.error('[FeelVoyage] Notificarea pe e-mail a eșuat (comanda tot s-a salvat în baza de date):', e);
                if (window.FVLog) FVLog.warn('order', 'email-failed', { type: order.type });
                return false;
            }
        },

        // emails: listă de adrese; message: textul scris de administrator; onProgress(facute, total, ultimaEroare) e apelat după fiecare încercare
        sendUpdateToSubscribers: async function (emails, message, onProgress) {
            if (!updateConfigured) return { sent: 0, failed: emails.length, reason: 'not-configured' };
            if (!(await waitReady(4000))) return { sent: 0, failed: emails.length, reason: 'sdk-unavailable' };
            let sent = 0, failed = 0;
            for (let i = 0; i < emails.length; i++) {
                try {
                    await emailjs.send(cfg.serviceId, cfg.updateTemplateId, { to_email: emails[i], message: message, sent_at: new Date().toLocaleString('ro-RO') });
                    sent++;
                } catch (e) {
                    failed++;
                    console.error('[FeelVoyage] Nu am putut trimite actualizarea către', emails[i], ':', e);
                }
                if (onProgress) onProgress(sent + failed, emails.length);
                if (i < emails.length - 1) await sleep(700);   // mică pauză, ca să nu trimitem totul deodată
            }
            if (window.FVLog) FVLog.info('order', 'newsletter-broadcast', { sent: sent, failed: failed, total: emails.length });
            return { sent: sent, failed: failed };
        }
    };
})();
