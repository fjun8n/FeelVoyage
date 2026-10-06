/* FeelVoyage — detectarea țării vizitatorului (geolocație), folosită în fereastra fiecărui pachet: dacă ești
   deja în țara destinației, biletul de avion nu mai are sens și apare altfel (nebifat, cu explicație).

   Pentru CONTUL tău, țara se cere o singură dată, pe orice dispozitiv, și rămâne — odată salvată pe cont
   (Firebase), niciun alt dispozitiv pe care te loghezi nu te mai întreabă (nu mai contează ce ai răspuns
   local, pe dispozitivul ăla); regulile bazei de date nici nu mai permit schimbarea ei din aplicație după
   ce a fost pusă o dată — doar un administrator o poate schimba, direct din baza de date.

   Pentru vizitatori FĂRĂ cont, întrebarea rămâne per-dispozitiv (în localStorage), doar pentru prețul
   biletului de avion — nu există cont unde să salvăm ceva.

   Dacă geolocația browserului nu merge sau e refuzată, apare opțiunea de a alege țara manual, dintr-o listă —
   la fel, o singură dată per cont. Reverse-geocoding: OpenStreetMap Nominatim (gratuit, fără cheie). */
(function () {
    'use strict';

    const KEY_COUNTRY = 'fv_geo_country';
    const KEY_ASKED = 'fv_geo_asked';
    let shownThisSession = false;   // un singur banner per vizită, chiar dacă fv:profile se declanșează de mai multe ori

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
    function currentSession() {
        return typeof window.fvCurrentSession === 'function' ? window.fvCurrentSession() : null;
    }

    function reverseGeocode(lat, lon) {
        return fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lon + '&zoom=3&addressdetails=1', {
            headers: { 'Accept-Language': 'ro' }
        }).then(function (r) { return r.json(); }).then(function (data) {
            const cc = data && data.address && data.address.country_code;
            return cc ? cc.toUpperCase() : null;
        });
    }

    // Țara detectată/aleasă ajunge mereu în localStorage (pentru prețul biletului, valabil și fără cont) și,
    // dacă ești logat ȘI contul tău nu are încă o țară salvată, se salvează și acolo (o singură dată).
    function applyCountry(cc) {
        if (!cc) return;
        setCountry(cc);
        document.dispatchEvent(new CustomEvent('fv:geo-country', { detail: { country: cc } }));
        const session = currentSession();
        if (session && !session.country && window.FVBackend && FVBackend.setCountry) FVBackend.setCountry(cc).catch(function () { });
    }

    function detectViaBrowser(onDone) {
        if (!navigator.geolocation) { onDone(false); return; }
        navigator.geolocation.getCurrentPosition(
            function (pos) {
                reverseGeocode(pos.coords.latitude, pos.coords.longitude).then(function (cc) {
                    if (cc) { applyCountry(cc); onDone(true); } else onDone(false);
                }).catch(function () { onDone(false); });
            },
            function () { onDone(false); },   // refuzat sau indisponibil
            { timeout: 10000, maximumAge: 24 * 60 * 60 * 1000 }
        );
    }

    // Lista mică de țări (din js/countries.js) pentru alegerea manuală — un simplu <select>, e nativ căutabil
    // (tastezi prima literă) și funcționează bine chiar și cu 190+ opțiuni, fără să mai construim un combobox nou.
    function showManualPicker(container) {
        const countries = window.FV_COUNTRIES || [];
        container.innerHTML =
            '<select id="fvGeoManualSelect" class="fv-geo-select"><option value="">Alege țara...</option>' +
            countries.map(function (c) { return '<option value="' + c.code + '">' + c.name + '</option>'; }).join('') +
            '</select>' +
            '<button type="button" id="fvGeoManualSave" class="fv-geo-btn fv-geo-btn-yes">Salvează</button>';
        document.getElementById('fvGeoManualSave').addEventListener('click', function () {
            const code = document.getElementById('fvGeoManualSelect').value;
            if (!code) return;
            markAsked();
            applyCountry(code);
            removeBanner();
        });
    }

    let bannerEl = null;
    function removeBanner() {
        if (!bannerEl) return;
        bannerEl.classList.remove('fv-geo-in');
        const el = bannerEl;
        setTimeout(function () { el.remove(); }, 250);
        bannerEl = null;
    }

    function showBanner() {
        if (bannerEl) return;
        const bar = document.createElement('div');
        bar.id = 'fvGeoBanner';
        bar.setAttribute('role', 'status');
        bar.innerHTML =
            '<span class="fv-geo-text"><i class="fa-solid fa-plane-up"></i> Putem să-ți spunem când NU ai nevoie de bilet de avion (dacă ești deja în țara destinației)?</span>' +
            '<span class="fv-geo-actions">' +
            '<button type="button" id="fvGeoAllow" class="fv-geo-btn fv-geo-btn-yes">Permite locația</button>' +
            '<button type="button" id="fvGeoManual" class="fv-geo-btn fv-geo-btn-manual">Aleg manual țara</button>' +
            '<button type="button" id="fvGeoDeny" class="fv-geo-btn fv-geo-btn-no">Nu, mulțumesc</button>' +
            '</span>' +
            '<div id="fvGeoManualBox" class="fv-geo-manual-box hidden"></div>';
        document.body.appendChild(bar);
        bannerEl = bar;
        requestAnimationFrame(function () { bar.classList.add('fv-geo-in'); });

        document.getElementById('fvGeoAllow').addEventListener('click', function () {
            markAsked();
            detectViaBrowser(function (ok) { if (ok) removeBanner(); else showManualFallback(); });
        });
        document.getElementById('fvGeoManual').addEventListener('click', showManualFallback);
        document.getElementById('fvGeoDeny').addEventListener('click', function () { markAsked(); removeBanner(); });

        function showManualFallback() {
            const box = document.getElementById('fvGeoManualBox');
            if (!box) return;
            box.classList.remove('hidden');
            showManualPicker(box);
        }
    }

    // Decide dacă trebuie arătat bannerul, pe baza stării CONTULUI (dacă ești logat) — nu doar a dispozitivului.
    function maybeShowBanner() {
        if (shownThisSession || bannerEl) return;
        const session = currentSession();
        if (session) {
            // Logat: singura sursă de adevăr e contul. Dacă are deja o țară, nu întrebăm NICIODATĂ, pe niciun
            // dispozitiv — exact cerința ta. Dacă nu are, întrebăm (chiar dacă alt dispozitiv, demult, a zis
            // „nu, mulțumesc” — situația de „sunt logat și nu am țară” e nouă și merită întrebată din nou).
            if (session.country) return;
            shownThisSession = true;
            showBanner();
            return;
        }
        // Fără cont: comportamentul vechi, per-dispozitiv, doar pentru prețul biletului de avion.
        if (wasAsked() || getCountry()) return;
        shownThisSession = true;
        showBanner();
    }

    document.addEventListener('fv:profile', function () { maybeShowBanner(); });
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(maybeShowBanner, 2500); });
    else setTimeout(maybeShowBanner, 2500);

    window.FVGeo = { getCountry: getCountry };
})();
