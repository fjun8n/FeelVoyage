/* FeelVoyage — trimiterea jurnalului tehnic către Firebase (nodul „logs/” din Realtime Database).
   Ce se trimite: doar evenimentele nivel info / warn / error din jurnalul local (js/logger.js), care NU conține date personale
   (e-mail, telefon, nume, mesaje, texte căutate sunt șterse înainte de scriere). Evenimentele de cont (creare cont, autentificare) poartă
   identificatorul contului (nu e-mailul); administratorul îl leagă de e-mail în fereastra „Jurnal”.
   Cine poate ce (regulile din firebase-rules.json): oricine poate CREA o intrare validată (câmpuri și lungimi fixe), dar DOAR administratorul
   (admins/<uid>: true) o poate citi sau șterge.
   Respectă „Do Not Track” și „Global Privacy Control” (nu se trimite nimic), precum și comutatorul localStorage fv_nolog=1.
   Limite: cel mult 80 de evenimente pe vizită (după ele doar erorile, până la 20), loturi de cel mult 40, coadă de cel mult 120; după 3 eșecuri la rând
   trimiterea se oprește până la următoarea vizită. Fără Firebase (mod local / offline) nu se trimite nimic. */
(function (root) {
    'use strict';
    var MAX_VISIT = 80, MAX_ERRORS_EXTRA = 20, MAX_BATCH = 40, MAX_QUEUE = 120, FLUSH_MS = 20000;
    var queue = [], sentCount = 0, accepted = 0, extraErrors = 0, timer = null, failures = 0, stopped = false, sending = false;
    var SKIP_CATS = { admin: 1, log: 1 };   // activitatea din fereastra „Jurnal” a administratorului nu se trimite

    function optedOut() {
        try {
            var n = root.navigator || {};
            if (n.doNotTrack === '1' || root.doNotTrack === '1' || n.msDoNotTrack === '1' || n.globalPrivacyControl === true) return true;
            return root.localStorage.getItem('fv_nolog') === '1';
        } catch (e) { return false; }
    }

    // forma unei intrări în baza de date (vezi „logs/$logId” în firebase-rules.json): d e șir JSON de cel mult 1200 de caractere
    function shape(e) {
        var d = e.d && typeof e.d === 'object' ? JSON.parse(JSON.stringify(e.d)) : null;
        var out = { ts: e.t, s: String(e.s).slice(0, 12), l: e.l, c: String(e.c).slice(0, 24), e: String(e.e).slice(0, 48) };
        if (e.r > 1) out.r = Math.min(9999, e.r);
        if (d && d.acct) { out.a = String(d.acct).slice(0, 40); delete d.acct; }
        if (d && Object.keys(d).length) { var j = JSON.stringify(d); out.d = j.length > 1200 ? j.slice(0, 1199) + '…' : j; }
        return out;
    }

    function online() { return !!(root.FVBackend && root.FVBackend.mode === 'firebase' && root.FVBackend.submitLogs); }

    function accept(e) {
        if (stopped || !e || e.l === 'debug' || SKIP_CATS[e.c]) return;
        if (accepted >= MAX_VISIT) {
            if (e.l !== 'error' || extraErrors >= MAX_ERRORS_EXTRA) return;
            extraErrors++;
        }
        accepted++;
        if (queue.length >= MAX_QUEUE) queue.shift();
        queue.push(shape(e));
        if (queue.length >= 10) flush(); else if (!timer) timer = setTimeout(flush, FLUSH_MS);
    }

    function flush() {
        clearTimeout(timer); timer = null;
        if (stopped || sending || !queue.length || !online()) return;
        var batch = queue.splice(0, MAX_BATCH);
        sending = true;
        root.FVBackend.submitLogs(batch).then(function (n) {
            sending = false; failures = 0; sentCount += batch.length;
            if (queue.length) flush();
        }, function (err) {
            sending = false; failures++;
            queue = batch.concat(queue).slice(0, MAX_QUEUE);          // le păstrăm pentru o nouă încercare
            if (failures >= 3) { stopped = true; if (root.FVLog) root.FVLog.warn('logremote', 'stopped', { code: (err && err.code) || 'necunoscut' }); }
            else timer = setTimeout(flush, FLUSH_MS);
        });
    }

    function start() {
        if (!root.FVLog || optedOut()) { if (root.FVLog && optedOut()) root.FVLog.info('logremote', 'optout'); return; }
        // ce s-a scris deja în această vizită (pornirea, modul rapid etc.) + evenimentele următoare
        root.FVLog.getAll().filter(function (e) { return e.s === root.FVLog.sessionId; }).forEach(accept);
        root.FVLog.addSink(accept);
        var goHidden = function () { if (document.visibilityState === 'hidden') flush(); };
        document.addEventListener('visibilitychange', goHidden);
        root.addEventListener('pagehide', flush);
    }

    root.FVLogRemote = {
        optedOut: optedOut,
        flush: flush,
        state: function () { return { queued: queue.length, sent: sentCount, accepted: accepted, stopped: stopped, failures: failures }; },
        _shape: shape
    };
    if (root.FVBackend && root.FVBackend.ready) root.FVBackend.ready.then(start, start); else start();
})(window);
