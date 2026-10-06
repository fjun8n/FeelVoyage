/* FeelVoyage — poză de profil personalizată (din galerie sau fișierele telefonului/calculatorului), găzduită gratuit
   pe Cloudinary (vezi js/cloudinary-config.js pentru pasul de configurare, o singură dată).
   Poza e redimensionată/comprimată în browser (pătrat, max 480×480, JPEG) înainte de a fi trimisă, ca să nu
   încarci fișiere uriașe direct de pe telefon — Cloudinary primește deja fișierul mic. */
(function () {
    'use strict';

    const btn = document.getElementById('profileAvatarBtn');
    const input = document.getElementById('profileAvatarInput');
    const statusEl = document.getElementById('profileAvatarStatus');
    const avatarEl = document.getElementById('profileAvatar');
    if (!btn || !input || !avatarEl) return;

    const MAX_SIDE = 480;
    const MAX_RAW_BYTES = 15 * 1024 * 1024;   // 15 MB — doar ca să nu încercăm să citim ceva absurd de mare

    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }
    function setStatus(text, isError) {
        if (!statusEl) return;
        statusEl.textContent = text || '';
        statusEl.className = text ? ('text-[11px] ' + (isError ? 'text-rose-500' : 'text-slate-400')) : 'hidden text-[11px] text-slate-400';
    }

    // Afișează poza în cercul de avatar (sau revine la inițiale dacă url e gol) — apelat și din auth.js la fillProfile().
    function renderAvatar(url, initials) {
        avatarEl.innerHTML = '';
        if (url) {
            const img = document.createElement('img');
            img.src = url;
            img.alt = '';
            img.className = 'w-full h-full object-cover';
            avatarEl.appendChild(img);
        } else {
            avatarEl.textContent = initials || 'FV';
        }
    }
    window.fvRenderAvatar = renderAvatar;

    // Redimensionează/comprimă imaginea aleasă într-un pătrat (decupat din centru) — Blob JPEG, gata de încărcat.
    function prepareImage(file) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            const url = URL.createObjectURL(file);
            img.onload = function () {
                URL.revokeObjectURL(url);
                const side = Math.min(img.naturalWidth, img.naturalHeight);
                const sx = (img.naturalWidth - side) / 2, sy = (img.naturalHeight - side) / 2;
                const out = Math.min(MAX_SIDE, side);
                const canvas = document.createElement('canvas');
                canvas.width = out; canvas.height = out;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, sx, sy, side, side, 0, 0, out, out);
                canvas.toBlob(function (blob) {
                    if (blob) resolve(blob); else reject(new Error('canvas-empty'));
                }, 'image/jpeg', 0.87);
            };
            img.onerror = function () { URL.revokeObjectURL(url); reject(new Error('invalid-image')); };
            img.src = url;
        });
    }

    // Upload „unsigned” direct din browser către Cloudinary — fără cheie secretă în cod (vezi js/cloudinary-config.js).
    async function uploadToCloudinary(blob) {
        const cfg = window.FV_CLOUDINARY_CONFIG || {};
        if (!cfg.cloudName || !cfg.uploadPreset) throw new Error('not-configured');
        const form = new FormData();
        form.append('file', blob, 'avatar.jpg');
        form.append('upload_preset', cfg.uploadPreset);
        // nu mai trimitem „folder” separat — preset-ul „FeelVoyage” din Cloudinary are deja asset folder-ul
        // „feelvoyage_avatars” fixat în el (vezi js/cloudinary-config.js)
        const resp = await fetch('https://api.cloudinary.com/v1_1/' + cfg.cloudName + '/image/upload', { method: 'POST', body: form });
        const data = await resp.json().catch(function () { return null; });
        if (!resp.ok || !data || !data.secure_url) throw new Error((data && data.error && data.error.message) || 'upload-failed');
        return data.secure_url;
    }

    btn.addEventListener('click', function () { input.click(); });

    input.addEventListener('change', async function () {
        const file = input.files && input.files[0];
        input.value = '';   // ca să poți alege din nou același fișier mai târziu, dacă e nevoie
        if (!file) return;
        if (!/^image\//.test(file.type)) { setStatus(trF('auth.photoErrorType', 'Alege un fișier imagine (JPG, PNG sau WEBP).'), true); return; }
        if (file.size > MAX_RAW_BYTES) { setStatus(trF('auth.photoErrorSize', 'Fișierul e prea mare (maxim 15 MB).'), true); return; }
        const session = typeof window.fvCurrentSession === 'function' ? window.fvCurrentSession() : null;
        if (!session) return;

        setStatus(trF('auth.photoUploading', 'Se încarcă poza...'), false);
        btn.disabled = true;
        try {
            const blob = await prepareImage(file);
            const url = await uploadToCloudinary(blob);
            await FVBackend.setPhotoURL(url);
            renderAvatar(url, null);
            setStatus(trF('auth.photoSaved', 'Poză actualizată.'), false);
            setTimeout(function () { setStatus(''); }, 3000);
        } catch (err) {
            console.error('[FeelVoyage] Poza de profil nu a putut fi încărcată:', err);
            const notConfigured = err && err.message === 'not-configured';
            setStatus(notConfigured
                ? trF('auth.photoErrorStorage', 'Încărcarea pozelor nu e încă configurată pe acest site (Cloudinary). Spune-i administratorului.')
                : trF('auth.photoErrorGeneric', 'Poza nu a putut fi încărcată. Încearcă din nou.'), true);
        } finally {
            btn.disabled = false;
        }
    });

    // Dacă sesiunea are deja o poză salvată (revii pe site, sau te loghezi din nou), o arătăm la fiecare fv:profile
    document.addEventListener('fv:profile', function () {
        const session = typeof window.fvCurrentSession === 'function' ? window.fvCurrentSession() : null;
        if (!session) return;
        const initials = (session.name || 'FV').split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
        renderAvatar(session.photoURL || '', initials);
    });
})();
