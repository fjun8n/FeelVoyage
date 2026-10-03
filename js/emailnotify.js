/* FeelVoyage — trimite o notificare pe e-mail (prin EmailJS) la fiecare solicitare nouă, pe lângă salvarea în baza
   de date care se întâmplă oricum (js/backend.js → submitOrder). Cheile se pun în js/emailjs-config.js — vezi
   instrucțiunile de acolo. Dacă nu sunt completate, acest fișier nu face nimic: comenzile tot se salvează normal.

   Trimiterea e „cel mai bun efort": dacă e-mailul eșuează (internet oprit, cheie greșită etc.), comanda tot a fost
   deja salvată în baza de date — nu blocăm și nu arătăm nicio eroare omului care trimite formularul pentru asta. */
(function () {
    'use strict';
    const SDK_URL = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
    const cfg = window.FV_EMAILJS_CONFIG || {};
    const configured = ['publicKey', 'serviceId', 'templateId', 'toEmail'].every(function (k) {
        return typeof cfg[k] === 'string' && cfg[k].trim() !== '' && !/^PASTE/i.test(cfg[k].trim());
    });

    if (!configured) {
        console.info('[FeelVoyage] Notificarea pe e-mail e dezactivată — completează js/emailjs-config.js ca să o activezi. Comenzile tot se salvează normal în baza de date.');
        window.FVEmailNotify = { configured: false, send: function () { return Promise.resolve(false); } };
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
        s.onerror = function () { sdkFailed = true; console.error('[FeelVoyage] Nu s-a putut încărca scriptul EmailJS (internet oprit sau resursă blocată). Comenzile tot se salvează normal în baza de date.'); };
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

    // „order" vine din js/app.js → sendOrder (aceleași câmpuri trimise și către baza de date)
    function buildParams(order) {
        return {
            to_email: cfg.toEmail,
            order_type: order.type === 'booking' ? 'Rezervare pachet' : 'Mesaj de contact',
            name: order.name || '',
            phone: order.phone || '',
            email: order.email || '',
            destination: order.destinationTitle || order.destination || '',
            message: order.message || '',
            period: order.periodText || '',
            travelers: order.travelers != null ? String(order.travelers) : '',
            total_price: order.totalPrice != null ? (order.totalPrice + ' ' + (order.currency || '€') + ' (≈ ' + (order.priceRon || '') + ')') : '',
            services: order.services || '',
            sent_at: order.dateText || new Date().toLocaleString('ro-RO')
        };
    }

    window.FVEmailNotify = {
        configured: true,
        send: async function (order) {
            const ok = await waitReady(4000);
            if (!ok) return false;
            try {
                await emailjs.send(cfg.serviceId, cfg.templateId, buildParams(order));
                if (window.FVLog) FVLog.info('order', 'email-sent', { type: order.type });
                return true;
            } catch (e) {
                console.error('[FeelVoyage] Notificarea pe e-mail a eșuat (comanda tot s-a salvat în baza de date):', e);
                if (window.FVLog) FVLog.warn('order', 'email-failed', { type: order.type });
                return false;
            }
        }
    };
})();
