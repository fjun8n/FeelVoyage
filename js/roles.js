/* FeelVoyage — roluri vizuale pe lângă „Membru” (vezi README.md → „Roluri”). Doar ecusoane, FĂRĂ nicio funcție
   ascunsă, cu o singură excepție: „helper” primește și acces (doar de citire) la Jurnal — vezi js/logviewer.js.
   Ordinea de mai jos e și ierarhia: pe profil se arată cel mult primele 2 roluri pe care le are cineva. */
(function () {
    'use strict';

    const ROLES = [
        { key: 'loyal', label: 'Călător Loial', icon: 'fa-coins', chipClass: 'fv-role-loyal' },
        { key: 'helper', label: 'Helper', icon: 'fa-headset', chipClass: 'fv-role-helper' },
        { key: 'bugfinder', label: 'Bug Finder', icon: 'fa-bug', chipClass: 'fv-role-bugfinder' },
        { key: 'beta', label: 'Beta Tester', icon: 'fa-flask', chipClass: 'fv-role-beta' }
    ];

    function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }

    // Rolurile pe care le are cineva, în ordinea ierarhiei (cele mai importante primele).
    function activeRoles(roles) {
        if (!roles) return [];
        return ROLES.filter(function (r) { return roles[r.key] === true; });
    }

    // Ecusoanele de arătat (implicit cel mult 2, cele mai importante) — folosit pe profil (js/auth.js).
    function badgesHtml(roles, max) {
        const active = activeRoles(roles).slice(0, max == null ? 2 : max);
        return active.map(function (r) {
            return '<span class="fv-role-chip ' + r.chipClass + '"><i class="fa-solid ' + r.icon + '"></i> ' + esc(r.label) + '</span>';
        }).join('');
    }

    window.FVRoles = { ROLES: ROLES, activeRoles: activeRoles, badgesHtml: badgesHtml };
})();
