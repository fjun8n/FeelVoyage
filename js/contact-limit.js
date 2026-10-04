/* FeelVoyage — limita de 1 „Cerere de Ofertă” / 3 zile / cont (doar pentru conturi membru; administratorii sunt scutiți).
   Reîncărcarea se face mereu la ora 7:00 dimineața, ora României (Europe/Bucharest — ține cont singur de ora de
   vară/iarnă, prin Intl, fără librărie externă): momentul următor permis e primul 07:00 care cade la cel puțin
   3 zile întregi (72 ore) după ultima cerere trimisă. */
(function () {
    'use strict';

    const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000;   // 3 zile
    const RESET_HOUR = 7;                           // 07:00, ora României

    // Componentele orei de perete din Europe/Bucharest, la un moment dat (UTC ms) — ține cont singur de EET/EEST.
    function bucharestParts(ms) {
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Europe/Bucharest', year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
        });
        const out = {};
        fmt.formatToParts(new Date(ms)).forEach(function (p) { if (p.type !== 'literal') out[p.type] = parseInt(p.value, 10); });
        if (out.hour === 24) out.hour = 0;   // unele motoare dau "24" pentru miezul nopții în loc de "00"
        return out;
    }

    // UTC ms care corespunde unei ore de perete date (y-mo-d h:mi:s) în Europe/Bucharest — corecție iterativă prin offset real.
    function bucharestWallToUtc(y, mo, d, h, mi, s) {
        let guess = Date.UTC(y, mo - 1, d, h, mi, s);
        for (let i = 0; i < 3; i++) {
            const p = bucharestParts(guess);
            const guessedWall = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
            const target = Date.UTC(y, mo - 1, d, h, mi, s);
            const diff = target - guessedWall;
            if (diff === 0) break;
            guess += diff;
        }
        return guess;
    }

    // Primul 07:00 (ora României) care cade la sau după momentul dat (UTC ms).
    function next7amAtOrAfter(ms) {
        const p = bucharestParts(ms);
        let candidate = bucharestWallToUtc(p.year, p.month, p.day, RESET_HOUR, 0, 0);
        if (candidate < ms) {
            const nextDayUtcNoon = Date.UTC(p.year, p.month - 1, p.day, 12) + 24 * 60 * 60 * 1000;   // „amiaza +1 zi”, ca reper sigur de dată, ferit de ambiguități DST
            const nd = new Date(nextDayUtcNoon);
            candidate = bucharestWallToUtc(nd.getUTCFullYear(), nd.getUTCMonth() + 1, nd.getUTCDate(), RESET_HOUR, 0, 0);
        }
        return candidate;
    }

    // Momentul (UTC ms) de la care poți trimite din nou, pornind de la ultima cerere trimisă (UTC ms, sau 0/absent = niciodată).
    function nextAllowedTime(lastRequestMs) {
        if (!lastRequestMs) return 0;   // nicio cerere anterioară: poate trimite oricând
        return next7amAtOrAfter(lastRequestMs + COOLDOWN_MS);
    }

    // Text „Xh Ym” din diferența de milisecunde (rotunjit la minut în sus, ca „0h 0m” să nu apară cât timp mai e puțin peste pragul de minute).
    function formatRemaining(ms) {
        const totalMin = Math.max(1, Math.ceil(ms / 60000));
        const h = Math.floor(totalMin / 60);
        const m = totalMin % 60;
        return { h: h, m: m, totalMin: totalMin };
    }

    window.FVContactLimit = {
        COOLDOWN_MS: COOLDOWN_MS,
        nextAllowedTime: nextAllowedTime,
        formatRemaining: formatRemaining
    };
})();
