/* FeelVoyage — notificare pe e-mail la fiecare solicitare nouă (rezervare sau formular de contact), PE LÂNGĂ salvarea
   în baza de date (asta se întâmplă oricum, prin js/backend.js → submitOrder, indiferent de acest fișier).

   Trimiterea pe e-mail e complet opțională și separată de Firebase: folosește EmailJS (gratuit până la 200 e-mailuri/lună),
   care trimite direct din browser, fără server propriu. Dacă lași valorile de mai jos cu "PASTE...", notificarea pe
   e-mail e doar sărită — comenzile tot ajung normal în baza de date, ca până acum.

   PAȘI (10 minute, o singură dată):
   1. Mergi pe https://www.emailjs.com/ și fă-ți cont gratuit (poți cu contul de Google).
   2. „Email Services" → „Add New Service" → alege Gmail → conectează crucrudenis@gmail.com.
      Notează „Service ID"-ul generat (ex: service_abc1234).
   3. „Email Templates" → „Create New Template". Scrie un subiect și un conținut care folosesc variabilele de mai jos
      (le poți insera din panoul din dreapta al editorului): {{order_type}}, {{name}}, {{phone}}, {{email}},
      {{destination}}, {{period}}, {{travelers}}, {{total_price}}, {{services}}, {{amenities_excluded}}, {{message}}, {{sent_at}}.
      În câmpul „To Email" al template-ului pune {{to_email}}.
      Exemplu de subiect: Solicitare nouă FeelVoyage — {{order_type}}
      Notează „Template ID"-ul (ex: template_xyz5678).
   4. „Account" → „General" → copiază „Public Key"-ul (ex: AbCdEfGhIjKlMnOp).
   5. Pune cele 3 valori mai jos, între ghilimele, în locul textului "PASTE...". Salvează fișierul.

   Asta e tot pentru notificarea de comandă nouă. ---------------------------------------------------------------

   PENTRU NEWSLETTER (opțional, separat): panoul de administrator are un buton „Trimite actualizare" (lângă
   „Utilizatori"), care trimite un e-mail scurt, scris de tine, către toți cei abonați la newsletter — de exemplu
   când adaugi destinații noi sau schimbi ceva important pe site. Are nevoie de UN AL DOILEA șablon EmailJS (diferit
   de cel de mai sus, pentru că destinatarul și conținutul sunt altele):
   6. „Email Templates" → „Create New Template" (încă unul). Variabile disponibile: {{to_email}}, {{message}},
      {{sent_at}}. În câmpul „To Email" pune {{to_email}}.
      Exemplu de subiect: Noutăți FeelVoyage
      Exemplu de conținut: {{message}}
      Notează „Template ID"-ul acestui al doilea șablon și pune-l mai jos, la updateTemplateId.
   Dacă nu completezi updateTemplateId, butonul din panoul de administrator rămâne dezactivat — restul site-ului
   funcționează normal oricum. */
window.FV_EMAILJS_CONFIG = {
    publicKey: "PXMzonXn_vMUEWtH8",
    serviceId: "FeelVoyage",
    templateId: "template_iscq76d",
    updateTemplateId: "template_ftx524k",
    toEmail: "crucrudenis@gmail.com"
};
