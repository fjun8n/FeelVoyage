/* FeelVoyage — cont utilizator: autentificare, înregistrare, profil, parolă uitată.
   Datele vin din FVBackend (backend.js): cu Firebase configurat, contul funcționează pe orice dispozitiv;
   altfel, rămâne un cont demo salvat local. */
(function () {
    'use strict';

    const authModal = document.getElementById('authModal');
    const authModalContainer = document.getElementById('authModalContainer');
    const closeAuthBtn = document.getElementById('closeAuthBtn');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const profileView = document.getElementById('profileView');
    const tabLoginBtn = document.getElementById('tabLoginBtn');
    const tabRegisterBtn = document.getElementById('tabRegisterBtn');
    const tabsBar = document.getElementById('authTabs');
    const loginError = document.getElementById('loginError');
    const loginErrorText = document.getElementById('loginErrorText');
    const registerError = document.getElementById('registerError');
    const registerErrorText = document.getElementById('registerErrorText');
    const forgotBtn = document.getElementById('forgotBtn');
    const authBtn = document.getElementById('authBtn');
    const authBtnLabel = document.getElementById('authBtnLabel');
    const authBtnIcon = document.getElementById('authBtnIcon');
    const userDropdown = document.getElementById('userDropdown');
    const userDropdownContent = document.getElementById('userDropdownContent');
    const authMobileBtn = document.getElementById('authMobileBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const toastEl = document.getElementById('fvToast');
    let toastTimer = null;

    // Sesiunea curentă: { name, email, phone } sau null. Se actualizează din FVBackend.onAuth.
    // Până răspunde serverul folosim ultima sesiune cunoscută, ca antetul să nu „clipească".
    let session = FVBackend.sessionHint();

    function trF(key, fallback) { return (typeof tr === 'function') ? tr(key, fallback) : fallback; }
    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
    function firstName(s) { return (s && s.name ? s.name : '').split(' ')[0] || ''; }
    function isModalOpen() { return !authModal.classList.contains('hidden'); }

    /* ---------- Notificare (toast) ---------- */
    function toast(msg, kind) {
        const icon = kind === 'error' ? 'fa-triangle-exclamation text-amber-400' : 'fa-circle-check text-emerald-400';
        toastEl.innerHTML = '<i class="fa-solid ' + icon + '"></i><span>' + esc(msg) + '</span>';
        toastEl.classList.remove('hidden');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(function () { toastEl.classList.add('hidden'); }, 3600);
    }
    window.fvToast = toast;

    /* ---------- Mesaje de eroare ---------- */
    function errorMessage(err) {
        switch (err && err.code) {
            case 'email-in-use': return trF('auth.errorEmailUsed', 'Există deja un cont cu acest e-mail. Autentifică-te.');
            case 'invalid-credentials': return trF('auth.errorLogin', 'E-mail sau parolă incorectă.');
            case 'weak-password': return trF('auth.errorPasswordShort', 'Parola trebuie să aibă minim 6 caractere.');
            case 'invalid-email': return trF('auth.errorInvalidEmail', 'Adresa de e-mail nu este validă.');
            case 'invalid-phone': return trF('auth.errorPhone', 'Introdu un număr de telefon valid, în format românesc (07XX XXX XXX) sau internațional (ex: +40 7XX XXX XXX).');
            case 'network': return trF('auth.errorNetwork', 'Nu m-am putut conecta la server. Verifică internetul și încearcă din nou.');
            case 'too-many': return trF('auth.errorTooMany', 'Prea multe încercări. Încearcă din nou peste câteva minute.');
            default: return trF('auth.errorGeneric', 'A apărut o eroare. Încearcă din nou.');
        }
    }
    function showLoginError(msg) { loginErrorText.textContent = msg; loginError.classList.remove('hidden'); }
    function showRegisterError(msg) { registerErrorText.textContent = msg; registerError.classList.remove('hidden'); }

    // Buton „în lucru": dezactivat + iconiță de încărcare
    function setBusy(form, busy) {
        const btn = form.querySelector('button[type="submit"]');
        if (!btn) return;
        btn.disabled = busy;
        btn.classList.toggle('opacity-70', busy);
        const spinner = btn.querySelector('[data-spinner]');
        if (spinner) spinner.classList.toggle('hidden', !busy);
    }

    /* ---------- Fereastra de autentificare ---------- */
    function showAuthView(view) {
        tabsBar.classList.toggle('hidden', view === 'profile');
        loginForm.classList.toggle('hidden', view !== 'login');
        registerForm.classList.toggle('hidden', view !== 'register');
        profileView.classList.toggle('hidden', view !== 'profile');
        loginError.classList.add('hidden');
        registerError.classList.add('hidden');
        tabLoginBtn.className = 'py-3.5 text-sm font-bold border-b-2 transition ' + (view === 'login' ? 'text-brand-600 border-brand-600' : 'text-slate-500 border-transparent hover:text-brand-600');
        tabRegisterBtn.className = 'py-3.5 text-sm font-bold border-b-2 transition ' + (view === 'register' ? 'text-brand-600 border-brand-600' : 'text-slate-500 border-transparent hover:text-brand-600');
    }

    function fillProfile() {
        if (!session) return;
        const initials = (session.name || 'FV').split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
        document.getElementById('profileAvatar').textContent = initials || 'FV';
        document.getElementById('profileName').textContent = session.name || '';
        document.getElementById('profileEmail').textContent = session.email || '';
        applyProfileRole();
        // panoul de administrator (js/admin.js, se încarcă doar pentru administrator) își pune butonul lângă nume
        document.dispatchEvent(new CustomEvent('fv:profile', { detail: { admin: !!session.admin } }));
    }

    // Membru = insignă verde; Administrator = insignă albastră (și avatar albastru)
    function applyProfileRole() {
        const admin = !!(session && session.admin);
        const chip = document.getElementById('profileChip'), icon = document.getElementById('profileChipIcon'), text = document.getElementById('profileChipText');
        const avatar = document.getElementById('profileAvatar');
        chip.className = 'inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ' + (admin ? 'text-white bg-blue-600' : 'text-emerald-600 bg-emerald-50');
        icon.className = 'fa-solid ' + (admin ? 'fa-shield-halved' : 'fa-circle-check');
        text.setAttribute('data-i18n', admin ? 'auth.adminChip' : 'auth.memberChip');
        text.textContent = trF(admin ? 'auth.adminChip' : 'auth.memberChip', admin ? 'Administrator' : 'Membru FeelVoyage');
        avatar.className = 'w-14 h-14 rounded-full bg-gradient-to-tr text-white flex items-center justify-center text-xl font-black shadow-md ' + (admin ? 'from-blue-700 to-sky-400 ring-4 ring-blue-200' : 'from-brand-600 to-sunset-500');
    }

    /* ---------- Administrator: panoul se încarcă doar pentru contul marcat în baza de date ---------- */
    let adminLoading = null;
    function loadAdminModule() {
        if (window.FVAdmin) { window.FVAdmin.sync(session); return Promise.resolve(); }
        if (!adminLoading) {
            adminLoading = new Promise(function (resolve, reject) {
                const s = document.createElement('script');
                s.src = 'js/admin.js';
                s.onload = resolve;
                s.onerror = function () { adminLoading = null; reject(new Error('js/admin.js nu s-a putut încărca')); };
                document.head.appendChild(s);
            }).then(function () { if (window.FVAdmin) window.FVAdmin.sync(session); });
        }
        return adminLoading;
    }
    function syncAdmin(s) {
        const admin = !!(s && s.admin);
        if (window.FVAI && typeof FVAI.setAdmin === 'function') FVAI.setAdmin(admin);   // chatul: fără restricție de subiect doar pentru administrator
        if (admin) loadAdminModule().catch(function (e) { console.warn('[FeelVoyage]', e); });
        else if (window.FVAdmin) window.FVAdmin.sync(null);
        document.dispatchEvent(new CustomEvent('fv:admin', { detail: { admin: admin } }));
    }
    // starea curentă de administrator, pentru modulele încărcate după ce evenimentul fv:admin a fost deja trimis (ex. fereastra „Jurnal”)
    window.fvIsAdmin = function () { return !!(session && session.admin); };
    window.fvAdminOpen = function () {
        userDropdown.classList.add('hidden');
        loadAdminModule().then(function () { if (window.FVAdmin && session && session.admin) window.FVAdmin.openUsers(); })
            .catch(function () { toast(trF('auth.errorGeneric', 'A apărut o eroare. Încearcă din nou.'), 'error'); });
    };
    // fereastra „Jurnal” (js/logviewer.js, încărcată dintotdeauna): arată jurnalul JavaScript de pe acest dispozitiv și, la fila „Server”, cel din baza de date
    window.fvLogOpen = function () {
        userDropdown.classList.add('hidden');
        if (window.FVLogView) FVLogView.open();
        else toast(trF('auth.errorGeneric', 'A apărut o eroare. Încearcă din nou.'), 'error');
    };

    function openAuthModal(view) {
        if (!view) view = session ? 'profile' : 'login';
        if (view === 'profile' && !session) view = 'login';
        if ((view === 'login' || view === 'register') && session) view = 'profile';
        showAuthView(view);
        if (view === 'profile') fillProfile();
        const wasOpen = isModalOpen();
        authModal.classList.remove('hidden');
        if (!wasOpen && typeof lockScroll === 'function') lockScroll(true);
        requestAnimationFrame(function () { authModalContainer.classList.remove('scale-95', 'opacity-0'); });
    }

    function closeAuthModal() {
        if (!isModalOpen()) return;
        authModalContainer.classList.add('scale-95', 'opacity-0');
        if (typeof lockScroll === 'function') lockScroll(false);
        setTimeout(function () { authModal.classList.add('hidden'); }, 200);
        loginForm.reset();
        registerForm.reset();
    }

    /* ---------- Butonul de cont din antet + meniul lui ---------- */
    function renderAuthUI() {
        const guest = !session;
        const label = guest ? trF('auth.loginBtn', 'Contul Meu') : firstName(session);
        authBtnLabel.textContent = label;
        authBtn.setAttribute('aria-label', label);
        authBtnIcon.className = 'fa-solid fa-circle-user text-lg ' + (guest ? 'text-brand-600' : 'text-emerald-500');

        const item = 'w-full text-left px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 rounded-xl flex items-center gap-2';
        if (!guest) {
            userDropdownContent.innerHTML =
                '<div class="px-4 py-3 bg-brand-50 border-b border-slate-100">' +
                '<p class="text-[10px] uppercase font-bold text-brand-700 tracking-wider">' + esc(trF('auth.dropdownHello', 'Bună ziua')) + '</p>' +
                '<p class="text-sm font-bold text-slate-800 truncate">' + esc(session.name) + '</p>' +
                '<p class="text-[11px] text-slate-500 truncate">' + esc(session.email) + '</p>' +
                '</div>' +
                '<div class="p-2">' +
                '<button onclick="openAuthModal(\'profile\')" class="' + item + '"><i class="fa-solid fa-user w-5 text-brand-600"></i>' + esc(trF('auth.profileBtn', 'Profilul meu')) + '</button>' +
                (session.admin ? '<button onclick="fvAdminOpen()" class="' + item + ' !text-blue-700 bg-blue-50/60"><i class="fa-solid fa-users w-5 text-blue-600"></i>' + esc(trF('admin.usersBtn', 'Utilizatori')) + '</button>' : '') +
                (session.admin ? '<button onclick="fvLogOpen()" class="' + item + ' !text-blue-700 bg-blue-50/60"><i class="fa-solid fa-clipboard-list w-5 text-blue-600"></i>' + esc(trF('log.btn', 'Jurnal')) + '</button>' : '') +
                '<a href="#destinatii" class="dd-close ' + item + '"><i class="fa-solid fa-map-location-dot w-5 text-brand-600"></i>' + esc(trF('auth.viewDestinations', 'Vezi destinațiile')) + '</a>' +
                '<button onclick="fvLogout()" class="w-full text-left px-3 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2"><i class="fa-solid fa-right-from-bracket w-5"></i>' + esc(trF('auth.logoutBtn', 'Deconectare')) + '</button>' +
                '</div>';
        } else {
            userDropdownContent.innerHTML =
                '<div class="px-4 py-3 bg-slate-50 border-b border-slate-100">' +
                '<p class="text-xs text-slate-500 leading-relaxed">' + esc(trF('auth.dropdownGuest', 'Autentifică-te pentru rezervări mai rapide și oferte exclusive.')) + '</p>' +
                '</div>' +
                '<div class="p-2">' +
                '<button onclick="openAuthModal(\'login\')" class="' + item + '"><i class="fa-solid fa-right-to-bracket w-5 text-brand-600"></i>' + esc(trF('auth.tabLogin', 'Autentificare')) + '</button>' +
                '<button onclick="openAuthModal(\'register\')" class="' + item + '"><i class="fa-solid fa-user-plus w-5 text-brand-600"></i>' + esc(trF('auth.tabRegister', 'Înregistrare')) + '</button>' +
                '</div>';
        }
        // Butonul „Contul meu" din meniul mobil
        if (authMobileBtn) {
            const span = authMobileBtn.querySelector('span');
            if (span) span.textContent = label;
        }
    }

    window.openAuthModal = openAuthModal;
    window.closeAuthModal = closeAuthModal;
    window.fvLogout = async function () {
        try { await FVBackend.logout(); } catch (e) { /* deconectare locală oricum */ }
        session = null;
        syncAdmin(null);
        renderAuthUI();
        userDropdown.classList.add('hidden');
        closeAuthModal();
        toast(trF('auth.loggedOut', 'Te-ai deconectat. Pe curând!'));
    };

    /* ---------- Formulare ---------- */
    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        loginError.classList.add('hidden');
        setBusy(loginForm, true);
        try {
            const s = await FVBackend.login(document.getElementById('loginEmail').value, document.getElementById('loginPassword').value);
            session = s;
            syncAdmin(s);
            renderAuthUI();
            closeAuthModal();
            toast(trF('auth.welcomeBack', 'Bine ai revenit') + ', ' + firstName(s) + '!');
        } catch (err) {
            showLoginError(errorMessage(err));
        } finally {
            setBusy(loginForm, false);
        }
    });

    registerForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const name = document.getElementById('regName').value.trim();
        const phone = document.getElementById('regPhone').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const pw1 = document.getElementById('regPassword').value;
        const pw2 = document.getElementById('regPassword2').value;
        registerError.classList.add('hidden');

        if (name.split(' ').filter(Boolean).length < 2) { showRegisterError(trF('auth.errorName', 'Te rog introdu numele și prenumele.')); return; }
        if (!fvPhoneValid(phone)) { showRegisterError(trF('auth.errorPhone', 'Introdu un număr de telefon valid, în format românesc (07XX XXX XXX) sau internațional (ex: +40 7XX XXX XXX).')); document.getElementById('regPhone').focus(); return; }
        if (pw1.length < 6) { showRegisterError(trF('auth.errorPasswordShort', 'Parola trebuie să aibă minim 6 caractere.')); return; }
        if (pw1 !== pw2) { showRegisterError(trF('auth.errorPasswordMatch', 'Parolele nu coincid.')); return; }

        setBusy(registerForm, true);
        try {
            const s = await FVBackend.register({ name: name, phone: phone, email: email, password: pw1 });
            session = s;
            syncAdmin(s);
            renderAuthUI();
            closeAuthModal();
            toast(trF('auth.registerSuccess', 'Contul a fost creat. Bine ai venit') + ', ' + firstName(s) + '!');
        } catch (err) {
            showRegisterError(errorMessage(err));
        } finally {
            setBusy(registerForm, false);
        }
    });

    forgotBtn.addEventListener('click', async function () {
        const email = document.getElementById('loginEmail').value.trim();
        loginError.classList.add('hidden');
        if (!email) { showLoginError(trF('auth.resetNeedEmail', 'Scrie mai întâi adresa de e-mail în câmpul de mai sus.')); return; }
        try {
            await FVBackend.resetPassword(email);
            toast(trF('auth.resetSent', 'Dacă există un cont cu acest e-mail, ți-am trimis linkul de resetare a parolei.'));
        } catch (err) {
            showLoginError(errorMessage(err));
        }
    });

    /* ---------- Evenimente ---------- */
    authBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle('hidden');
    });
    document.addEventListener('click', function (e) {
        if (!userDropdown.classList.contains('hidden') && !userDropdown.contains(e.target) && !authBtn.contains(e.target)) {
            userDropdown.classList.add('hidden');
        }
    });
    userDropdownContent.addEventListener('click', function (e) {
        if (e.target.closest('a')) userDropdown.classList.add('hidden');
    });
    closeAuthBtn.addEventListener('click', closeAuthModal);
    authModal.addEventListener('click', function (e) { if (e.target === authModal) closeAuthModal(); });
    tabLoginBtn.addEventListener('click', function () { showAuthView('login'); });
    tabRegisterBtn.addEventListener('click', function () { showAuthView('register'); });
    logoutBtn.addEventListener('click', function () { window.fvLogout(); });
    if (authMobileBtn) authMobileBtn.addEventListener('click', function () {
        if (typeof closeMobileMenu === 'function') closeMobileMenu();
        openAuthModal();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (isModalOpen()) closeAuthModal();
        userDropdown.classList.add('hidden');
    });

    // Pre-completează formularul de rezervare pentru utilizatorii logați
    const _origOpenModal = window.openModal;
    if (typeof _origOpenModal === 'function') {
        window.openModal = function (id, photoIndex) {
            _origOpenModal(id, photoIndex);   // photoIndex: deschide galeria direct la o anumită poză (din sertarul cardului)
            if (session) {
                const bn = document.getElementById('bookingName');
                const be = document.getElementById('bookingEmail');
                const bp = document.getElementById('bookingPhone');
                if (session.name && bn && !bn.value) bn.value = session.name;
                if (session.email && be && !be.value) be.value = session.email;
                if (session.phone && bp && !bp.value) bp.value = session.phone;
            }
        };
    }

    // Re-randează textele la schimbarea limbii
    document.addEventListener('fv:language', renderAuthUI);

    /* ---------- Pornire: ascultă starea contului din backend ---------- */
    FVBackend.onAuth(function (s) {
        session = s;
        syncAdmin(s);
        renderAuthUI();
        // dacă utilizatorul s-a deconectat din altă filă cât timp profilul e deschis
        if (isModalOpen() && !s && !profileView.classList.contains('hidden')) showAuthView('login');
        if (isModalOpen() && s && !profileView.classList.contains('hidden')) fillProfile();
    });

    // Textul de sub formular și linkul „parolă uitată" depind de modul backend-ului
    FVBackend.ready.then(function () {
        const cloud = FVBackend.mode === 'firebase';
        document.querySelectorAll('[data-note="local"]').forEach(function (el) { el.classList.toggle('hidden', cloud); });
        document.querySelectorAll('[data-note="cloud"]').forEach(function (el) { el.classList.toggle('hidden', !cloud); });
        forgotBtn.classList.toggle('hidden', !cloud);
    });

    renderAuthUI();
})();
