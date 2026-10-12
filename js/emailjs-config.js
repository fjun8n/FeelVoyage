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
   funcționează normal oricum.

   OPȚIONAL — VARIANTA ÎN ENGLEZĂ A AMBELOR ȘABLOANE: emailjs-template-contact-en.html și
   emailjs-template-newsletter-en.html (la fel ca pașii 3/6 de mai sus, dar fiecare ca șablon NOU, separat).
   Pune Template ID-urile generate la templateIdEn / updateTemplateIdEn mai jos. Fără asta, totul rămâne
   exact ca până acum (doar în română) — nu e un pas obligatoriu. */
window.FV_EMAILJS_CONFIG = {
    publicKey: "PXMzonXn_vMUEWtH8",
    serviceId: "FeelVoyage",
    templateId: "template_iscq76d",
    updateTemplateId: "template_ftx524k",
    toEmail: "crucrudenis@gmail.com",

    // OPȚIONAL — variantele în ENGLEZĂ ale celor două șabloane (emailjs-template-contact-en.html și
    // emailjs-template-newsletter-en.html): le creezi ca șabloane NOI, separate, în contul tău EmailJS
    // (vezi instrucțiunile din fiecare fișier -en.html), apoi pui aici Template ID-urile generate.
    // Dacă le lași goale (ca mai jos), nimic nu se schimbă: totul continuă să meargă doar în română, ca până acum.
    // templateIdEn: notificarea de comandă/contact folosește automat varianta engleză când cererea a fost
    // trimisă cât timp site-ul era în engleză (order.lang === 'en') — nu trebuie ales manual.
    templateIdEn: "",

    /* NEWSLETTER PE LIMBA FIECĂRUI ABONAT
       Fiecare abonat primește anunțul pe limba ȚĂRII lui din cont (Franța → franceză, Italia → italiană,
       Spania/America Latină → spaniolă, România/Moldova → română, restul → engleză). Tu îl scrii O SINGURĂ
       dată, în română: textul se traduce automat cu Gemini (js/translate.js, aceeași configurație AI care
       există deja) și fiecare primește șablonul limbii lui.

       Pentru fiecare limbă ai nevoie de un șablon NOU în EmailJS, făcut din fișierul corespunzător:
           updateTemplateIdEn ← emailjs-template-newsletter-en.html
           updateTemplateIdIt ← emailjs-template-newsletter-it.html
           updateTemplateIdFr ← emailjs-template-newsletter-fr.html
           updateTemplateIdEs ← emailjs-template-newsletter-es.html
       Ce lași gol se rezolvă singur: limba respectivă primește șablonul englez, iar dacă nici acela nu e
       completat, pe cel românesc (textul tradus se trimite oricum). Deci poți adăuga limbile pe rând. */
    updateTemplateIdEn: "",
    updateTemplateIdIt: "",
    updateTemplateIdFr: "",
    updateTemplateIdEs: ""
};
