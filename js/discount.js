/* FeelVoyage — reducere aleatorie, per cont.

   Fiecare cont primește automat, o dată la 7-14 zile (interval aleator), o reducere de 2-5% valabilă pentru o
   fereastră aleatoare de 24-48H, pe o destinație aleasă tot aleator — dar NU cu șanse egale: pachetele mai ieftine
   au o șansă mai mare de a fi alese decât cele mai scumpe (greutate = 1 / preț).

   Site-ul e static (fără server/cron), așa că „rularea" se verifică singură la fiecare autentificare/încărcare a
   sesiunii (vezi FVBackend.onAuth mai jos): dacă reducerea curentă nu mai are termen de reînnoire (nextRollAt) în
   viitor, se trimite una nouă. Protecția reală e în regulile bazei de date (firebase-rules.json): un cont își poate
   rescrie singur reducerea DOAR când termenul a trecut — nu o poate forța mai des, indiferent ce ar încerca din
   consola browserului.

   Când reducerea contului e ACTIVĂ chiar acum, pachetul respectiv apare într-un banner chiar pe prima pagină
   (#fvDiscountBanner, din index.html), cu prețul redus și timpul rămas.

   Administratorul poate acorda manual aceeași reducere (ales de ACELAȘI algoritm ponderat) oricui, din panoul de
   utilizatori (js/admin.js) — vezi FVDiscount.pick(), apelat de acolo. */
(function () {
    'use strict';

    const MIN_PCT = 2, MAX_PCT = 5;
    const MIN_ACTIVE_H = 24, MAX_ACTIVE_H = 48;
    const MIN_GAP_DAYS = 7, MAX_GAP_DAYS = 14;
    const HOUR = 60 * 60 * 1000;
    const DAY = 24 * HOUR;

    const trF = function (k, fb) { return (typeof tr === 'function') ? tr(k, fb) : fb; };
    const esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };

    function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function randFloat(min, max) { return min + Math.random() * (max - min); }

    // doar destinații reale, rezervabile acum (nu „în curând”) — nu are sens o reducere pe ceva ce încă nu poți rezerva
    function eligibleDestinations() {
        const list = (typeof destinations !== 'undefined') ? destinations : [];
        return list.filter(function (d) { return !d.comingSoon && Number(d.price) > 0; });
    }

    // Alegere ponderată: greutatea e 1/preț — o destinație de 2x mai ieftină are de 2x mai multe șanse să fie aleasă.
    function pickWeightedDestination(list) {
        const weights = list.map(function (d) { return 1 / Math.max(1, Number(d.price) || 1); });
        const total = weights.reduce(function (a, b) { return a + b; }, 0);
        let r = Math.random() * total;
        for (let i = 0; i < list.length; i++) {
            r -= weights[i];
            if (r <= 0) return list[i];
        }
        return list[list.length - 1];
    }

    // „Rulează" o reducere nouă: pornește ACUM, pentru 24-48H, pe o destinație aleasă ponderat; următoarea rulare
    // automată e programată la 7-14 zile de la începutul acesteia.
    function rollDiscount() {
        const pool = eligibleDestinations();
        if (!pool.length) return null;
        const dest = pickWeightedDestination(pool);
        const startAt = Date.now();
        const endAt = startAt + Math.round(randFloat(MIN_ACTIVE_H, MAX_ACTIVE_H) * HOUR);
        const nextRollAt = startAt + Math.round(randFloat(MIN_GAP_DAYS, MAX_GAP_DAYS) * DAY);
        return { destId: dest.id, pct: randInt(MIN_PCT, MAX_PCT), startAt: startAt, endAt: endAt, nextRollAt: nextRollAt };
    }

    // Reducerea din sesiune e ACTIVĂ chiar acum (între startAt și endAt)?
    function activeDiscount(session) {
        const d = session && session.discount;
        if (!d || !d.destId) return null;
        const now = Date.now();
        if (now < d.startAt || now > d.endAt) return null;
        return d;
    }

    let rolling = false;
    // Dacă reducerea curentă (sau lipsa ei) și-a trecut termenul de reînnoire, trimitem una nouă pe cont — scrierea
    // e validată/protejată din regulile bazei de date, deci un apel „în plus” sau prea devreme pur și simplu nu scrie nimic.
    function maybeRoll(session) {
        if (!session || rolling) return;
        const d = session.discount;
        const due = !d || !d.nextRollAt || d.nextRollAt <= Date.now();
        if (!due) return;
        const payload = rollDiscount();
        if (!payload) return;
        rolling = true;
        window.FVBackend.setDiscount(payload).catch(function () { /* se reîncearcă la următoarea autentificare */ }).then(function () { rolling = false; });
    }

    /* ------------------------------------------------------------------ banner-ul de pe prima pagină */
    let lastSession = null, tickTimer = null;

    function discountedPrice(dest, pct) { return Math.max(0, Math.round(Number(dest.price) * (1 - pct / 100))); }

    function tickCountdown(endAt) {
        const el = document.getElementById('fvDiscountCountdown');
        if (!el) return;
        const remain = endAt - Date.now();
        if (remain <= 0) { renderBanner(lastSession); return; }   // a expirat cât era pe ecran: se re-randează (dispare)
        const h = Math.floor(remain / HOUR), m = Math.floor((remain % HOUR) / 60000);
        el.textContent = trF('discount.expiresIn', 'Expiră în {h}h {m}min').replace('{h}', h).replace('{m}', m);
    }

    function renderBanner(session) {
        const el = document.getElementById('fvDiscountBanner');
        if (!el) return;
        const active = activeDiscount(session);
        if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
        if (!active) { el.innerHTML = ''; el.classList.add('hidden'); return; }
        const list = (typeof destinations !== 'undefined') ? destinations : [];
        const dest = list.find(function (d) { return d.id === active.destId; });
        if (!dest) { el.innerHTML = ''; el.classList.add('hidden'); return; }
        const t = (typeof getDestinationText === 'function') ? getDestinationText(dest) : { title: dest.title };
        const discounted = discountedPrice(dest, active.pct);
        const cover = (dest.images && dest.images[0]) || '';
        el.classList.remove('hidden');
        el.innerHTML =
            '<div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-600 via-brand-600 to-amber-500 text-white shadow-xl p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5">' +
                '<div class="w-full sm:w-40 h-32 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-white/30">' +
                    '<img src="' + esc(cover) + '" alt="" loading="lazy" decoding="async" class="w-full h-full object-cover">' +
                '</div>' +
                '<div class="flex-1 min-w-0">' +
                    '<span class="inline-flex items-center gap-1.5 bg-white text-rose-700 font-black text-xs px-3 py-1 rounded-full mb-2">' +
                        '<i class="fa-solid fa-bolt" aria-hidden="true"></i> ' + esc(trF('discount.badge', 'Reducere doar pentru tine')) + ' · -' + active.pct + '%' +
                    '</span>' +
                    '<h3 class="text-lg sm:text-xl font-bold font-serif truncate">' + esc(t.title) + '</h3>' +
                    '<p class="text-sm text-white/90 mt-0.5">' +
                        '<span class="line-through opacity-70">' + esc(String(dest.price)) + ' ' + esc(dest.currency || '') + '</span>' +
                        '<span class="font-black text-lg ml-1.5">' + discounted + ' ' + esc(dest.currency || '') + '</span>' +
                        '<span class="text-xs opacity-80 ml-1">/ ' + esc(trF('dest.perPerson', 'pers.')) + '</span>' +
                    '</p>' +
                    '<p id="fvDiscountCountdown" class="text-xs mt-1.5 font-semibold text-white/90"></p>' +
                '</div>' +
                '<button type="button" id="fvDiscountViewBtn" class="shrink-0 px-5 py-3 rounded-xl bg-white text-rose-700 font-bold text-sm shadow hover:bg-rose-50 transition">' +
                    esc(trF('discount.viewBtn', 'Vezi Pachetul')) + ' <i class="fa-solid fa-arrow-right text-[10px] ml-1" aria-hidden="true"></i>' +
                '</button>' +
            '</div>';
        const btn = document.getElementById('fvDiscountViewBtn');
        if (btn) btn.addEventListener('click', function () { if (typeof openModal === 'function') openModal(dest.id); });
        tickCountdown(active.endAt);
        tickTimer = setInterval(function () { tickCountdown(active.endAt); }, 30000);
    }

    if (window.FVBackend && FVBackend.onAuth) {
        FVBackend.onAuth(function (session) {
            lastSession = session;
            // maybeRoll poate scrie o reducere nouă și, la rândul ei, re-declanșa acest callback (sincron, în modul local) —
            // „lastSession" ajunge astfel deja actualizată; de-aia randăm banner-ul din „lastSession", nu din parametrul
            // local „session", ca să nu suprascriem cu starea veche randarea corectă făcută de apelul re-intrat.
            maybeRoll(session);
            renderBanner(lastSession);
        });
    }
    document.addEventListener('fv:language', function () { renderBanner(lastSession); });

    // Pentru js/admin.js (acordare manuală, din panoul de utilizatori) — ACELAȘI algoritm ponderat, independent de contul curent.
    window.FVDiscount = {
        eligibleDestinations: eligibleDestinations,
        pick: rollDiscount,
        activeFor: activeDiscount
    };
})();
