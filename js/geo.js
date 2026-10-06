/* FeelVoyage — detectarea țării vizitatorului (geolocație), folosită în fereastra fiecărui pachet:
   dacă ești deja în țara destinației, biletul de avion nu mai are sens și apare altfel (nebifat, cu
   explicație), nu ca „inclus” blocat. Cere permisiunea o singură dată (buton propriu, înainte de
   promptul real al browserului) și ține minte rezultatul definitiv — nu mai întreabă la fiecare vizită.
   Reverse-geocoding: OpenStreetMap Nominatim (gratuit, fără cheie). */
(function () {
    'use strict';

    const KEY_COUNTRY = 'fv_geo_country';
    const KEY_ASKED = 'fv_geo_asked';

    function getCountry() {
        try { return localStorage.getItem(KEY_COUNTRY) || null; } catch (e) { return null; }
    }
    function setCountry(code) {
        try { localStorage.setItem(KEY_COUNTRY, code); } catch (e) { }
    }
    function markAsked() {
        try { localStorage.setItem(KEY_ASKED, '1'); } catch (e) { }
    }
    function wasAsked() {
        try { return localStorage.getItem(KEY_ASKED) === '1'; } catch (e) { return true; }   // fără localStorage: nu insistăm
    }

    function reverseGeocode(lat, lon) {
        return fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=3&addressdetails=1', {
            headers: { 'Accept-Language': 'ro' }
        }).then(function (r) { return r.json(); }).then(function (data) {
            const cc = data && data.address && data.address.country_code;
            return cc ? cc.toUpperCase() : null;
        });
    }

    function detect() {
        if (!navigator.geolocation) { markAsked(); return; }
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                reverseGeocode(pos.coords.latitude, pos.coords.longitude).then(function (cc) {
                    markAsked();
                    if (cc) { setCountry(cc); document.dispatchEvent(new CustomEvent('fv:geo-country', { detail: { country: cc } })); }
                }).catch(function () { markAsked(); });
            },
            function () { markAsked(); },   // refuzat sau indisponibil: nu mai întrebăm din nou
            { timeout: 10000, maximumAge: 24 * 60 * 60 * 1000 }
        );
    }

    // Bannerul discret, o singură dată, înainte de promptul real al browserului — ca omul să știe de ce i se cere.
    function maybeShowBanner() {
        if (wasAsked() || getCountry()) return;
        const bar = document.createElement('div');
        bar.id = 'fvGeoBanner';
        bar.setAttribute('role', 'status');
        bar.innerHTML =
            '<span class="fv-geo-text"><i class="fa-solid fa-plane-up"></i> Putem să-ți spunem când NU ai nevoie de bilet de avion (dacă ești deja în țara destinației)?</span>' +
            '<span class="fv-geo-actions">' +
            '<button type="button" id="fvGeoAllow" class="fv-geo-btn fv-geo-btn-yes">Permite</button>' +
            '<button type="button" id="fvGeoDeny" class="fv-geo-btn fv-geo-btn-no">Nu, mulțumesc</button>' +
            '</span>';
        document.body.appendChild(bar);
        requestAnimationFrame(function () { bar.classList.add('fv-geo-in'); });
        function remove() { bar.classList.remove('fv-geo-in'); setTimeout(function () { bar.remove(); }, 250); }
        document.getElementById('fvGeoAllow').addEventListener('click', function () { remove(); detect(); });
        document.getElementById('fvGeoDeny').addEventListener('click', function () { markAsked(); remove(); });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(maybeShowBanner, 2500); });
    else setTimeout(maybeShowBanner, 2500);

    window.FVGeo = { getCountry: getCountry };
})();
