/* FeelVoyage — poză de profil personalizată (din galerie sau fișierele telefonului/calculatorului).
   Necesită Firebase Storage activat în proiect (vezi README.md → „Poză de profil (Firebase Storage)”);
   dacă nu e activat, afișează o eroare clară în loc să rămână agățat la „Se încarcă...”.
   Poza e redimensionată/comprimată în browser (pătrat, max 480×480, JPEG) înainte de a fi trimisă, ca
   să nu încarci fișiere uriașe direct de pe telefon. */
(function () {
    'use strict';

    const btn = document.getElementById('profileAvatarBtn');
    const input = document.getElementById('profileAvatarInput');
    const statusEl = document.getElementById('profileAvatarStatus');
    const avatarEl = document.getElementById('profileAvatar');
    if (!btn || !input || !avatarEl) return;

    const MAX_SIDE = 480;
    const MAX_RAW_BYTES = 15 * 1024 * 1024;   // 15 MB — doar ca să nu încercăm să citim ceva absurd de mare
    let storageModule = null, storageInstance = null;

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

    async function ensureStorage() {
        if (storageInstance) return storageInstance;
        const app = await FVBackend.firebaseApp();
        if (!app) throw new Error('no-app');
        if (!storageModule) storageModule = await FVBackend.importSDK('storage');
        storageInstance = storageModule.getStorage(app);
        return storageInstance;
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
            const storage = await ensureStorage();
            const fileRef = storageModule.ref(storage, 'avatars/' + session.uid + '.jpg');
            await storageModule.uploadBytes(fileRef, blob, { contentType: 'image/jpeg' });
            const url = await storageModule.getDownloadURL(fileRef);
            await FVBackend.setPhotoURL(url);
            renderAvatar(url, null);
            setStatus(trF('auth.photoSaved', 'Poză actualizată.'), false);
            setTimeout(function () { setStatus(''); }, 3000);
        } catch (err) {
            console.error('[FeelVoyage] Poza de profil nu a putut fi încărcată:', err);
            const notConfigured = err && (err.code === 'storage/unknown' || /bucket/i.test(String(err.message || '')) || err.message === 'no-app');
            setStatus(notConfigured
                ? trF('auth.photoErrorStorage', 'Încărcarea pozelor nu e încă activată pe acest site (Firebase Storage). Spune-i administratorului.')
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
