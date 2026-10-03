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
      {{destination}}, {{period}}, {{travelers}}, {{total_price}}, {{services}}, {{message}}, {{sent_at}}.
      În câmpul „To Email" al template-ului pune {{to_email}}.
      Exemplu de subiect: Solicitare nouă FeelVoyage — {{order_type}}
      Notează „Template ID"-ul (ex: template_xyz5678).
   4. „Account" → „General" → copiază „Public Key"-ul (ex: AbCdEfGhIjKlMnOp).
   5. Pune cele 3 valori mai jos, între ghilimele, în locul textului "PASTE...". Salvează fișierul.

   Asta e tot — nu trebuie schimbat nimic altundeva în cod. */
window.FV_EMAILJS_CONFIG = {
    publicKey: "PASTE_EMAILJS_PUBLIC_KEY",
    serviceId: "PASTE_EMAILJS_SERVICE_ID",
    templateId: "PASTE_EMAILJS_TEMPLATE_ID",
    toEmail: "crucrudenis@gmail.com"
};
