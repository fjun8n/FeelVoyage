/* FeelVoyage — panou administrator.

   Se încarcă DOAR când contul curent este marcat ca administrator în baza de date (Realtime Database → admins/<uid> = true);
   vezi js/auth.js. Un vizitator obișnuit nu descarcă acest fișier și nu vede niciun element de administrare.

   Ce face:
   • pune un buton „Utilizatori" lângă numele din profilul administratorului (și un element în meniul contului);
   • deschide o fereastră cu toți utilizatorii înregistrați (căutare după nume, e-mail, telefon);
   • la click pe un utilizator arată profilul lui, exact cum îl vede el (doar citire).

   Securitate: butoanele și fereastra sunt doar interfață. Datele sunt protejate de regulile bazei de date (firebase-rules.json):
   doar un cont din „admins" poate citi lista de utilizatori; oricine altcineva primește PERMISSION_DENIED, chiar dacă ar
   încerca să apeleze funcția din consola browserului. Panoul nu poate modifica nimic, doar citește.
   Datele utilizatorilor (nume, e-mail...) sunt scrise de ei înșiși, deci se afișează mereu scăpate de HTML. */
(function (root) {
    'use strict';

    const doc = document;
    let session = null;            // sesiunea administratorului (din auth.js)
    let users = [], loaded = false, loadedAt = 0, loading = false, error = null;
    let query = '', selected = null;
    let modal = null, box = null, locked = false;

    const trF = function (k, fb) { return (typeof tr === 'function') ? tr(k, fb) : fb; };
    const esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); };
    const norm = function (s) { return String(s == null ? '' : s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); };
    const $ = function (id) { return doc.getElementById(id); };
    const lang = function () { return (typeof currentLang !== 'undefined' && currentLang) || 'ro'; };
    const localeTag = function () { return ({ ro: 'ro-RO', en: 'en-GB', it: 'it-IT' })[lang()] || 'ro-RO'; };

    function initialsOf(name) {
        const i = String(name || '').split(' ').filter(Boolean).map(function (w) { return w[0]; }).join('').slice(0, 2).toUpperCase();
        return i || 'FV';
    }
    function fmtDate(ms) {
        if (!ms) return '—';
        try { return new Date(ms).toLocaleDateString(localeTag(), { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch (e) { return '—'; }
    }
    function avatarClass(admin, size) {
        return size + ' rounded-full bg-gradient-to-tr text-white flex items-center justify-center font-black shadow-md flex-shrink-0 ' + (admin ? 'from-blue-700 to-sky-400 ring-2 ring-blue-200' : 'from-brand-600 to-sunset-500');
    }
    function chipHtml(admin) {
        return admin
            ? '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600 px-2 py-0.5 rounded-full"><i class="fa-solid fa-shield-halved"></i> ' + esc(trF('auth.adminChip', 'Administrator')) + '</span>'
            : '<span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><i class="fa-solid fa-circle-check"></i> ' + esc(trF('auth.memberChip', 'Membru FeelVoyage')) + '</span>';
    }

    /* ------------------------------------------------------------------ butonul din profil (lângă nume) */
    function removeButton() { const b = $('adminUsersBtn'); if (b) b.remove(); }
    function mountButton() {
        const row = $('profileNameRow');
        if (!row || !session) return;
        let b = $('adminUsersBtn');
        if (!b) {
            b = doc.createElement('button');
            b.id = 'adminUsersBtn';
            b.type = 'button';
            b.className = 'inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-sm transition flex-shrink-0';
            b.addEventListener('click', function () { openUsers(); });
            row.appendChild(b);
        }
        b.innerHTML = '<i class="fa-solid fa-users"></i><span>' + esc(trF('admin.usersBtn', 'Utilizatori')) + '</span>';
        b.setAttribute('aria-label', trF('admin.usersBtn', 'Utilizatori'));
    }

    /* ------------------------------------------------------------------ fereastra */
    function ensureModal() {
        if (modal) return;
        modal = doc.createElement('div');
        modal.id = 'adminModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'adminTitle');
        modal.className = 'fixed inset-0 z-[95] hidden bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4';
        modal.innerHTML =
            '<div id="adminBox" class="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-md w-full overflow-hidden h-[88svh] sm:h-[640px] sm:max-h-[92vh] flex flex-col transform transition-all duration-200 scale-95 opacity-0">' +
                '<div class="bg-gradient-to-r from-blue-800 via-blue-600 to-sky-500 px-4 sm:px-5 py-4 text-white flex items-center gap-3">' +
                    '<button id="adminBack" type="button" class="hidden w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-arrow-left"></i></button>' +
                    '<div id="adminIcon" class="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-shield-halved"></i></div>' +
                    '<div class="min-w-0 flex-1"><h3 id="adminTitle" class="font-bold text-[15px] truncate"></h3><p id="adminSub" class="text-[11px] text-blue-100 truncate"></p></div>' +
                    '<button id="adminClose" type="button" class="w-10 h-10 rounded-full bg-black/25 hover:bg-black/50 flex items-center justify-center flex-shrink-0 text-lg"><i class="fa-solid fa-xmark"></i></button>' +
                '</div>' +
                '<div id="adminListView" class="flex-1 min-h-0 flex flex-col">' +
                    '<div class="px-4 pt-4 pb-2 flex gap-2">' +
                        '<div class="relative flex-1"><i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>' +
                        '<input id="adminSearch" type="search" autocomplete="off" class="w-full pl-9 pr-3 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"></div>' +
                        '<button id="adminRefresh" type="button" class="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center flex-shrink-0"><i class="fa-solid fa-rotate"></i></button>' +
                    '</div>' +
                    '<p id="adminCount" class="px-5 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider"></p>' +
                    '<div id="adminList" class="flex-1 overflow-y-auto px-3 pb-4 space-y-1"></div>' +
                '</div>' +
                '<div id="adminUserView" class="hidden flex-1 min-h-0 overflow-y-auto p-5 space-y-5"></div>' +
            '</div>';
        doc.body.appendChild(modal);
        box = $('adminBox');

        modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });
        $('adminClose').addEventListener('click', closeModal);
        $('adminBack').addEventListener('click', showList);
        $('adminRefresh').addEventListener('click', function () { load(true); });
        $('adminSearch').addEventListener('input', function (e) { query = e.target.value; renderList(); });
        $('adminList').addEventListener('click', function (e) {
            const row = e.target.closest('[data-uid]');
            if (!row) return;
            const u = users.filter(function (x) { return x.uid === row.getAttribute('data-uid'); })[0];
            if (u) showUser(u);
        });
        $('adminUserView').addEventListener('click', function (e) {
            const c = e.target.closest('[data-copy-uid]');
            if (c && selected) copyText(selected.uid);
        });
        applyTexts();
    }

    function applyTexts() {
        if (!modal) return;
        $('adminSearch').placeholder = trF('admin.search', 'Caută după nume, e-mail sau telefon');
        $('adminSearch').setAttribute('aria-label', trF('admin.search', 'Caută după nume, e-mail sau telefon'));
        $('adminRefresh').setAttribute('aria-label', trF('admin.refresh', 'Reîmprospătează'));
        $('adminRefresh').title = trF('admin.refresh', 'Reîmprospătează');
        $('adminClose').setAttribute('aria-label', trF('admin.close', 'Închide'));
        $('adminBack').setAttribute('aria-label', trF('admin.back', 'Înapoi la listă'));
        if (selected) { setHeader(true); renderUser(selected); } else { setHeader(false); renderList(); }
    }

    function setHeader(userView) {
        $('adminBack').classList.toggle('hidden', !userView);
        $('adminIcon').classList.toggle('hidden', userView);
        $('adminTitle').textContent = userView && selected ? (selected.name || selected.email || '—') : trF('admin.panelTitle', 'Panou administrator');
        $('adminSub').textContent = userView ? trF('admin.viewSub', 'Vizualizare profil · doar citire') : (session ? (session.email || session.name || '') : '');
    }

    function isOpen() { return !!modal && !modal.classList.contains('hidden'); }

    function openUsers() {
        if (!session || !session.admin) return;   // doar pentru administrator (și datele sunt protejate în baza de date)
        ensureModal();
        if (typeof closeAuthModal === 'function') closeAuthModal();   // din profil în panou, ca între două file
        selected = null;
        showList();
        const wasOpen = isOpen();
        modal.classList.remove('hidden');
        if (!wasOpen && !locked && typeof lockScroll === 'function') { lockScroll(true); locked = true; }
        requestAnimationFrame(function () { box.classList.remove('scale-95', 'opacity-0'); });
        load(false);
    }

    function closeModal() {
        if (!isOpen()) return;
        box.classList.add('scale-95', 'opacity-0');
        if (locked && typeof lockScroll === 'function') { lockScroll(false); locked = false; }
        setTimeout(function () { if (modal && box && box.classList.contains('opacity-0')) modal.classList.add('hidden'); }, 200);
    }

    function showList() {
        selected = null;
        if (!modal) return;
        $('adminListView').classList.remove('hidden');
        $('adminUserView').classList.add('hidden');
        setHeader(false);
        renderList();
    }
    function showUser(u) {
        selected = u;
        $('adminListView').classList.add('hidden');
        $('adminUserView').classList.remove('hidden');
        $('adminUserView').scrollTop = 0;
        setHeader(true);
        renderUser(u);
    }

    /* ------------------------------------------------------------------ lista */
    async function load(force) {
        if (loading) return;
        if (loaded && !force && Date.now() - loadedAt < 60000) { renderList(); return; }
        loading = true; error = null; renderList();
        try {
            users = await FVBackend.listUsers();
            loaded = true; loadedAt = Date.now();
        } catch (e) {
            error = (e && e.code) || 'network';
            users = []; loaded = false;
        }
        loading = false;
        if (modal) { if (selected) { const s = selected; selected = users.filter(function (x) { return x.uid === s.uid; })[0] || s; } renderList(); }
    }

    function filtered() {
        const q = norm(query).trim();
        if (!q) return users;
        return users.filter(function (u) { return norm(u.name + ' ' + u.email + ' ' + u.phone + ' ' + u.uid).indexOf(q) !== -1; });
    }

    function errorText(code) {
        if (code === 'forbidden') return trF('admin.errForbidden', 'Nu ai permisiunea să vezi utilizatorii. Verifică dacă ai publicat regulile din firebase-rules.json și dacă contul tău este marcat ca administrator în baza de date.');
        if (code === 'unsupported') return trF('admin.errUnsupported', 'Panoul de administrator funcționează doar cu Firebase configurat.');
        return trF('admin.errNetwork', 'Nu m-am putut conecta la server. Verifică internetul și încearcă din nou.');
    }

    function renderList() {
        if (!modal) return;
        const list = $('adminList'), count = $('adminCount');
        $('adminRefresh').querySelector('i').classList.toggle('fa-spin', loading);
        if (loading) {
            count.textContent = '';
            list.innerHTML = '<div class="py-16 text-center text-sm text-slate-400"><i class="fa-solid fa-spinner fa-spin text-xl mb-3 block text-blue-500"></i>' + esc(trF('admin.loading', 'Se încarcă utilizatorii...')) + '</div>';
            return;
        }
        if (error) {
            count.textContent = '';
            list.innerHTML = '<div class="m-2 p-4 rounded-2xl bg-rose-50 border border-rose-100 text-sm text-rose-700 space-y-3"><p><i class="fa-solid fa-triangle-exclamation mr-1.5"></i>' + esc(errorText(error)) + '</p>' +
                (error === 'forbidden' || error === 'unsupported' ? '' : '<button type="button" id="adminRetry" class="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700">' + esc(trF('admin.retry', 'Încearcă din nou')) + '</button>') + '</div>';
            const r = $('adminRetry'); if (r) r.addEventListener('click', function () { load(true); });
            return;
        }
        const rows = filtered();
        count.textContent = (rows.length === users.length)
            ? trF('admin.count', '{n} utilizatori').replace('{n}', users.length)
            : trF('admin.countOf', '{n} din {total} utilizatori').replace('{n}', rows.length).replace('{total}', users.length);
        if (!rows.length) {
            list.innerHTML = '<p class="py-14 px-6 text-center text-sm text-slate-400">' + esc(users.length ? trF('admin.noMatch', 'Niciun utilizator nu se potrivește.') : trF('admin.empty', 'Încă nu există utilizatori cu profil salvat.')) + '</p>';
            return;
        }
        list.innerHTML = rows.map(function (u) {
            const me = session && u.uid === session.uid;
            return '<button type="button" data-uid="' + esc(u.uid) + '" class="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-blue-50 focus:bg-blue-50 focus:outline-none text-left transition">' +
                '<div class="' + avatarClass(u.admin, 'w-11 h-11 text-sm') + '">' + esc(initialsOf(u.name)) + '</div>' +
                '<div class="min-w-0 flex-1">' +
                    '<p class="font-bold text-sm text-slate-900 truncate flex items-center gap-1.5"><span class="truncate">' + esc(u.name || '—') + '</span>' +
                        (u.admin ? '<span class="inline-flex items-center gap-1 text-[9px] font-extrabold text-white bg-blue-600 px-1.5 py-0.5 rounded-full flex-shrink-0"><i class="fa-solid fa-shield-halved"></i> Admin</span>' : '') +
                        (me ? '<span class="text-[9px] font-bold text-blue-600 flex-shrink-0">(' + esc(trF('admin.you', 'tu')) + ')</span>' : '') + '</p>' +
                    '<p class="text-xs text-slate-500 truncate">' + esc(u.email || u.phone || '—') + '</p>' +
                '</div>' +
                '<div class="text-right flex-shrink-0"><p class="text-[10px] text-slate-400">' + esc(fmtDate(u.createdAt)) + '</p><i class="fa-solid fa-chevron-right text-slate-300 text-xs mt-1"></i></div>' +
            '</button>';
        }).join('');
    }

    /* ------------------------------------------------------------------ profilul unui utilizator, ca la el */
    function detailRow(icon, label, valueHtml) {
        return '<div class="flex items-start gap-3 text-sm"><i class="fa-solid ' + icon + ' w-4 text-blue-500 mt-0.5"></i><div class="min-w-0 flex-1"><p class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">' + esc(label) + '</p><div class="text-slate-700 break-words">' + valueHtml + '</div></div></div>';
    }
    function renderUser(u) {
        const v = $('adminUserView');
        const muted = function (t) { return '<span class="text-slate-400 italic text-xs">' + esc(t) + '</span>'; };
        v.innerHTML =
            '<div class="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-[11px] leading-relaxed text-blue-800 flex gap-2"><i class="fa-solid fa-eye mt-0.5"></i><span>' + esc(trF('admin.viewBanner', 'Vezi profilul acestui utilizator așa cum îl vede el. Mod administrator, doar citire: nu poți modifica nimic.')) + '</span></div>' +
            // aceeași machetă ca „Profilul meu"
            '<div class="flex items-center gap-4">' +
                '<div class="' + avatarClass(u.admin, 'w-14 h-14 text-xl') + '">' + esc(initialsOf(u.name)) + '</div>' +
                '<div class="min-w-0 flex-1">' +
                    '<h4 class="font-bold text-slate-900 truncate">' + esc(u.name || '—') + '</h4>' +
                    '<p class="text-xs text-slate-500 truncate">' + esc(u.email || '—') + '</p>' +
                    '<div class="mt-1">' + chipHtml(u.admin) + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="p-4 rounded-2xl bg-brand-50 border border-brand-100 space-y-2">' +
                '<p class="text-[10px] uppercase font-bold text-brand-700 tracking-wider">' + esc(trF('auth.perksTitle', 'Avantajele contului tău')) + '</p>' +
                '<p class="text-xs text-slate-600 flex items-center gap-2"><i class="fa-solid fa-bolt text-amber-500"></i><span>' + esc(trF('auth.perk1', 'Rezervări precompletate — nu mai tastezi datele')) + '</span></p>' +
                '<p class="text-xs text-slate-600 flex items-center gap-2"><i class="fa-solid fa-gift text-rose-500"></i><span>' + esc(trF('auth.perk2', 'Oferte exclusive pentru membri')) + '</span></p>' +
                '<p class="text-xs text-slate-600 flex items-center gap-2"><i class="fa-solid fa-clock text-brand-600"></i><span>' + esc(trF('auth.perk3', 'Răspuns prioritar de la consultantul tău')) + '</span></p>' +
            '</div>' +
            '<button type="button" disabled class="w-full py-3.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-sm cursor-not-allowed"><i class="fa-solid fa-right-from-bracket mr-1.5"></i>' + esc(trF('auth.logoutBtn', 'Deconectare')) + '</button>' +
            // detalii vizibile doar administratorului
            '<div class="p-4 rounded-2xl border border-blue-100 bg-white space-y-3.5">' +
                '<p class="text-[10px] uppercase font-bold text-blue-700 tracking-wider"><i class="fa-solid fa-shield-halved mr-1"></i>' + esc(trF('admin.details', 'Detalii cont (le vezi doar tu)')) + '</p>' +
                detailRow('fa-phone', trF('admin.phone', 'Telefon'), u.phone ? esc(u.phone) : muted(trF('admin.noPhone', 'nespecificat'))) +
                detailRow('fa-envelope', trF('admin.email', 'E-mail'), u.email ? esc(u.email) : muted(trF('admin.noEmail', 'necunoscut (apare după următoarea autentificare a utilizatorului)'))) +
                detailRow('fa-calendar-check', trF('admin.since', 'Membru din'), esc(fmtDate(u.createdAt))) +
                detailRow('fa-fingerprint', trF('admin.uid', 'ID cont'), '<code class="text-[11px] bg-slate-100 rounded px-1.5 py-0.5 break-all">' + esc(u.uid) + '</code> <button type="button" data-copy-uid class="ml-1 text-[11px] font-bold text-blue-600 hover:underline">' + esc(trF('admin.copy', 'Copiază')) + '</button>') +
            '</div>';
    }

    function copyText(text) {
        const done = function () { if (typeof fvToast === 'function') fvToast(trF('admin.copied', 'Copiat!')); };
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, done); return; }
        } catch (e) { /* trece la varianta veche */ }
        try { const ta = doc.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0'; doc.body.appendChild(ta); ta.select(); doc.execCommand('copy'); ta.remove(); done(); } catch (e) { /* ignorat */ }
    }

    /* ------------------------------------------------------------------ sincronizare cu sesiunea */
    function sync(s) {
        session = (s && s.admin) ? s : null;
        if (!session) {
            // nu mai e administrator (deconectare sau rol retras): dispare tot ce ține de panou
            if (isOpen() && locked && typeof lockScroll === 'function') { lockScroll(false); locked = false; }
            removeButton();
            if (modal) { modal.remove(); modal = null; box = null; }
            users = []; loaded = false; error = null; selected = null; query = '';
            return;
        }
        mountButton();
    }

    doc.addEventListener('fv:profile', function (e) { if (e.detail && e.detail.admin && session) mountButton(); else removeButton(); });
    doc.addEventListener('fv:language', function () { if (session) { mountButton(); applyTexts(); } });
    doc.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !isOpen()) return;
        if (selected) showList(); else closeModal();
    });

    const api = { sync: sync, openUsers: openUsers, close: closeModal, _isOpen: isOpen };
    root.FVAdmin = api;
})(window);
