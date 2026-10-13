/* FeelVoyage — cardurile de contact care se deschid direct în aplicația potrivită.

   • „E-mail suport & oferte” → mailto:. Sistemul îl dă aplicației pe care o folosește omul —
     Gmail, Yahoo, Outlook, Mail — cu destinatarul și subiectul deja scrise. Nu alegem noi
     furnizorul (un link direct către mail.google.com ar trimite pe Yahoo într-un loc greșit);
     „mailto:” e singurul care nimerește de fiecare dată aplicația potrivită.
   • „Telefon & WhatsApp” → wa.me. Pe telefon deschide aplicația WhatsApp pe numărul agenției,
     pe calculator deschide WhatsApp Web / aplicația de desktop. Lângă el rămâne „sună”, cu „tel:”.

   Subiectul mailului și mesajul din WhatsApp sunt pe limba în care e site-ul acum și se refac
   la fiecare schimbare de limbă. În HTML legăturile au deja forma simplă (fără subiect), așa că
   funcționează și dacă acest fișier nu apucă să ruleze. */
(function (root) {
    'use strict';

    var doc = root.document;
    var PHONE_INTL = '40799927590';          // fără „+” și fără spații — cerința wa.me
    var EMAIL = 'crucrudenis@gmail.com';

    function t(key, fb) { return (typeof root.tr === 'function') ? root.tr(key, fb) : fb; }

    function apply() {
        var mail = doc.getElementById('contactMailLink');
        if (mail) {
            mail.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(t('contact.mailSubject', 'Cerere de ofertă — FeelVoyage'));
        }
        var wa = doc.getElementById('contactWhatsAppLink');
        if (wa) {
            wa.href = 'https://wa.me/' + PHONE_INTL + '?text=' + encodeURIComponent(t('contact.waPrefill', 'Bună ziua! Aș dori o ofertă pentru o vacanță.'));
            wa.setAttribute('aria-label', t('contact.waAria', 'Scrie-ne pe WhatsApp la 0799 927 590'));
        }
        var call = doc.getElementById('contactCallLink');
        if (call) call.setAttribute('aria-label', t('contact.callAria', 'Sună la 0799 927 590'));
    }

    if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', apply);
    else apply();
    doc.addEventListener('fv:language', apply);
})(window);
