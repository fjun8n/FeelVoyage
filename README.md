# FeelVoyage

Site static (HTML + CSS + JavaScript), gata de pus pe **GitHub Pages**: încarci toate fișierele din acest folder în repository, cu `index.html` la rădăcină.

```
index.html
css/tailwind.css     ← stilurile Tailwind, deja generate (nu le edita de mână)
css/styles.css       ← stiluri proprii, optimizări pentru telefon, contor
css/dark.css         ← modul întunecat
js/translations.js   ← texte EN / IT
js/translations-fr.js ← texte în franceză (FR)
js/translations-es.js ← texte în spaniolă (ES)
js/destinations.js   ← lista destinațiilor și prețul de bază al fiecărui pachet
js/pricing.js        ← calculatorul de preț (adulți, copii, sezon, durată, servicii extra)
js/daterange.js      ← calendarul pentru intervalul de date (plecare → întoarcere, format zz/ll/aaaa)
js/app.js            ← filtre, rezervări, limbi
js/infomodal.js      ← ferestrele „Despre noi” și „Termeni și Condiții” (se deschid din antet, meniul de telefon și subsol)
js/chat.js           ← fereastra de chat (butoane rapide, întrebări libere, „Vezi pachetul”)
js/ai.js             ← asistentul AI: Gemini prin Firebase AI Logic (prompt, instrumentul de preț, limite)
js/faq.js            ← motorul răspunsurilor preprogramate (potrivire pe cuvinte-cheie, 5 limbi)
js/faq-data-1.js     ← răspunsuri preprogramate: mesaje scurte, agenție, rezervări, plată
js/faq-data-2.js     ← răspunsuri preprogramate: prețuri, servicii extra, recomandări
js/faq-data-3.js     ← răspunsuri preprogramate: informații de călătorie, folosirea site-ului
js/faq-fr.js         ← aceleași răspunsuri, în franceză (titluri, cuvinte-cheie, texte + „cel mai bun moment” pe destinații)
js/faq-es.js         ← aceleași răspunsuri, în spaniolă
js/faq-dest.js       ← răspunsuri pentru cele 29 de destinații (nume alternative + cel mai bun moment)
js/firebase-config.js← AICI pui cheile Firebase (vezi mai jos)
js/backend.js        ← contorul comun, conturile și comenzile (Firebase sau local)
js/theme.js          ← comutatorul luminos / întunecat
js/auth.js           ← autentificare, înregistrare, profil
js/counter.js        ← contorul „Călători Fericiți"
js/admin.js          ← panoul de administrator (se încarcă doar pentru admin)
firebase-rules.json  ← regulile bazei de date (le lipești în Firebase)
```

## Contor comun + conturi pe orice dispozitiv (Firebase, gratuit)

GitHub Pages găzduiește doar fișiere, deci nu poate ține minte un număr comun sau conturi. Pentru asta folosim Firebase (planul gratuit, fără card).
**Până nu faci pașii de mai jos, site-ul merge în „mod local":** contorul și conturile rămân doar în browserul fiecărui vizitator.

1. Intră pe <https://console.firebase.google.com> → **Add project** (poți dezactiva Google Analytics).
2. În meniul din stânga: **Databases & Storage → Realtime Database → Create database**. Alege o locație (pentru România: `europe-west1`) și **Locked mode**.
3. În tab-ul **Rules** șterge tot, lipește conținutul fișierului `firebase-rules.json` și apasă **Publish**.
4. În meniul din stânga: **Security → Authentication → Get started → Sign-in method → Email/Password → Enable → Save**.
5. Roata dințată de lângă *Project Overview* → **Project settings** → la **Your apps** apasă `</>` (Web) → dă un nume și **Register app**.
6. Copiază valorile din `firebaseConfig` în `js/firebase-config.js` (`apiKey`, `authDomain`, `databaseURL`, `projectId`, `appId`).
   Dacă `databaseURL` lipsește, îl găsești în **Realtime Database → Data**, sus (arată ca `https://NUME-default-rtdb.europe-west1.firebasedatabase.app`; pentru locația `us-central1` are forma `https://NUME-default-rtdb.firebaseio.com`).
7. Urcă fișierele pe GitHub. Deschide site-ul pe două dispozitive: un click pe „Călători Fericiți" se vede live pe amândouă.

Note:
- Cheile din `firebase-config.js` **nu sunt secrete**; securitatea o fac regulile din pasul 3.
- Planul gratuit permite ~100 de vizitatori conectați simultan și 10 GB trafic/lună.
- Oricine poate da click pe contor de câte ori vrea (regulile permit doar +1 pe rând, nu salturi mari).

## Comenzile clienților

Când cineva trimite formularul de **rezervare** (din fereastra unei destinații) sau formularul de **contact**, comanda ajunge în Firebase:
**Databases & Storage → Realtime Database → Data → `orders`**. Fiecare comandă are un cod generat automat și conține numele, telefonul, e-mailul, data trimiterii și, la rezervare, destinația, numărul de adulți și copii, perioada, serviciile alese, **totalul estimat** (`totalPrice`, în €), prețul pe persoană și un detaliu al calculului (`priceDetails`, mereu în română).

- `status` pornește ca `nou`; îl poți schimba tu în `procesat` direct din consolă (dublu-click pe valoare).
- Vizitatorii pot **doar crea** comenzi; nu le pot citi, modifica sau șterge. Le vezi doar tu, din consola Firebase.
- Dacă trimiterea eșuează (fără internet, reguli nepublicate), clientul primește un mesaj și formularul rămâne completat.
- Cine e logat pe site are și `uid` în comandă (legătura cu contul lui).
- Ca să-ți apară comenzile, regulile din `firebase-rules.json` trebuie publicate în Firebase (tab-ul **Rules**).

## Prețuri și calculator

În fereastra unui pachet, clientul alege adulții, copiii, data și serviciile extra, iar prețul se recalculează pe loc (total, preț pe persoană și echivalent în lei). Regulile sunt cele ale agențiilor reale (ex. cistour.ro):

- **Prețul din card** („De la X €") este pe adult, în cameră dublă, în sezon redus. Se schimbă în `js/destinations.js` (`price` și `priceRon`).
- **Adult singur** în cameră: supliment single pe noapte. La 3 adulți, unul plătește supliment.
- **Copii:** 0–4 ani și 5–12 ani plătesc un procent din prețul adultului (România 40% / 70%, restul 65% / 85%, exotic 75% / 85%). Copilul cazat cu un singur adult plătește preț întreg.
- **Sezon:** în lunile de vârf (ex. iulie–august la mare) prețul crește în funcție de data plecării.
- **Servicii:** unele sunt deja incluse în pachet (apar „Inclus"), altele se adaugă: per persoană (transfer, asigurare, bilete, masă), per grup (ghid local) sau per zi și mașină (închiriere auto; indisponibilă în Maldive și China).

Toate valorile (suplimente, procente, sezoane, prețurile serviciilor) sunt în tabelele de la începutul fișierului `js/pricing.js` și se pot modifica ușor.
**Sunt estimări orientative**; oferta finală o confirmă un consultant.

## Date de plecare și întoarcere

În fereastra unui pachet, clientul alege **de pe ce dată până pe ce dată** (afișat zz/ll/aaaa) dintr-un calendar: apasă „Plecare", alege ziua, iar „Întoarcere" se completează automat cu durata standard a pachetului; poate apoi alege altă zi de întoarcere.

- Prima zi posibilă este **mâine**; calendarul merge cu ~18 luni înainte. Nu se pot alege zile din trecut.
- **Durata contează la preț:** o parte din preț (zborul / transportul) e fixă, restul crește cu fiecare noapte în plus. Limitele sunt de 2–14 nopți (5–21 la exotice și Asia); serviciile extra (asigurare, masă, bilete, mașină) se recalculează pe nopțile alese.
- **Circuitele ghidate** (Kenya, Tokyo, Beijing) au durată fixă: data întoarcerii se calculează singură.
- **Sezonul** se stabilește după data plecării.
- În comandă ajung `travelDate` și `returnDate` (AAAA-LL-ZZ), `nights` și `periodText` (ex. „20/12/2026 – 27/12/2026 (7 nopți)").
- Regulile din `firebase-rules.json` includ aceste câmpuri: **publică-le din nou în Firebase** după ce actualizezi site-ul.

## Fereastra „Despre noi”

Povestea agenției, cifrele (29 destinații, contorul „Călători fericiți”, 3 continente, 24/7), cele 4 valori și „De ce aleg călătorii FeelVoyage?” **nu mai sunt pe pagina principală**: se deschid într-o fereastră din **„Despre Noi”** (antet și meniul de telefon) și **„Despre FeelVoyage”** (subsol). Se închide cu ✕, cu tasta Escape sau cu click pe fundalul din afara ei; „Vino să ne cunoști” o închide și te duce la formularul de contact. O adresă de forma `…/index.html#despre` deschide direct fereastra.

- Textele rămân la locul lor: română în `index.html` (blocul `id="aboutModal"`), engleză/italiană în `js/translations.js`, franceză și spaniolă în `js/translations-fr.js` / `js/translations-es.js`, toate cu cheile `despre.*`. Limba se schimbă și cât timp fereastra e închisă.
- Contorul „Călători fericiți” din fereastră e același contor ca cel din prima pagină (aceeași valoare, în timp real).
- Logica (deschidere, Escape, focus, blocarea derulării paginii din spate) e în `js/infomodal.js`, comună cu fereastra „Termeni și Condiții”.
- **Dacă adaugi clase Tailwind noi** în fereastră, fișierul `css/tailwind.css` este precompilat și nu le cunoaște: rulează `npm run build:css` (cu Node instalat) sau pune stilul în `css/styles.css`.

## Termeni și Condiții (fereastră)

Din subsol, **„Termeni și Condiții”** deschide documentul într-o fereastră (ca „Despre noi”). Are un **cuprins** cu cifre romane (I–XI) care duce direct la fiecare secțiune, casete de atenționare la punctele importante (confirmarea fermă a rezervării, penalizările de până la 100%, asigurarea storno) și carduri pentru datele firmei și de contact. Se închide cu ✕, Escape, click pe fundal sau butonul „Închide”; o adresă `…/index.html#termeni` o deschide direct.

- **Unde se editează textul:** româna în `index.html` (blocul `id="termsModal"`), celelalte limbi în `js/translations.js` (EN, IT), `js/translations-fr.js` și `js/translations-es.js`, toate cu cheile `terms.*` (64 de chei). Traducerile sunt orientative: la final documentul spune că, în caz de diferențe, prevalează versiunea în română.
- **Datele firmei** (denumire, sediu, Registrul Comerțului, CUI, licență) și **datele de contact** (telefon, e-mail, program) sunt scrise direct în HTML, în cardul din secțiunea I și în lista din secțiunea XI, ca să le poți schimba într-un singur loc.
- Când adaugi o secțiune, copiezi una existentă (`id="terms-sN"`), îi pui numărul roman în ecuson și o adaugi și în cuprins (`data-terms-go`).
- Documentul nu ține loc de consultanță juridică: cere unui jurist să verifice textul, mai ales secțiunile despre anulări, plată și date personale.
- „Politica de Confidențialitate” și „ANPC / SAL” din subsol sunt încă link-uri goale (`#`).

## Cont nou: telefonul este obligatoriu

La crearea unui cont, câmpul **Telefon** trebuie completat. Sunt acceptate numere românești (`07XX XXX XXX`, `02XX XXX XXX`) și internaționale cu `+` și prefix (România +40, Italia +39, Franța +33, Spania +34, Belgia +32, Elveția +41, Luxemburg +352, Mexic +52, Argentina +54, Chile +56, Columbia +57, Marea Britanie +44, Germania +49, Moldova +373, SUA / Canada +1 și prefixele din Asia și Orientul Mijlociu folosite și la rezervări). Aceeași validare se aplică și la formularul de rezervare (funcția `fvPhoneValid` din `js/app.js`).

- Conturile create **înainte** de această modificare rămân valabile, chiar dacă nu au telefon; nu li se cere nimic la autentificare.
- Regula din `firebase-rules.json` pentru `users/<uid>/phone` cere acum minim 6 caractere. **Publică din nou regulile** în Firebase (tab-ul **Rules** → **Publish**). Dacă nu le republici, site-ul merge oricum, dar baza de date nu verifică lungimea telefonului.
- Obligativitatea telefonului este verificată de formular și de codul site-ului; baza de date nu poate impune ca un câmp să existe la crearea contului fără să blocheze conturile vechi.

## Limbi: română, engleză, italiană, franceză, spaniolă

Comutatorul de limbă din antet (și din meniul de pe telefon) are 5 limbi. Româna este limba de bază, scrisă direct în `index.html`, `js/destinations.js` și în cod; celelalte sunt dicționare în `js/translations.js` (EN, IT), `js/translations-fr.js` (FR) și `js/translations-es.js` (ES), toate cu aceleași chei (`nav.acasa`, `dest.roma.title`...).

- Schimbarea limbii traduce pe loc textele, pachetele, calendarul (luni și zile), estimarea de preț, chatul și panoul de administrator.
- Chatul înțelege și răspunde în limba în care scrie utilizatorul, chiar dacă pagina e în alta (ex.: pagina în română, întrebarea în franceză → răspuns în franceză). Asistentul AI primește și limba paginii ca indiciu.
- Dacă o cheie lipsește dintr-un dicționar, se afișează textul în română, ca să nu apară niciodată chei goale.
- **Ca să modifici un text în franceză/spaniolă**, caută cheia (ex. `hero.title1`) în `js/translations-fr.js` sau `js/translations-es.js`. Pentru o **limbă nouă**, copiezi un fișier de traduceri, îl încarci în `index.html` după `js/translations.js`, adaugi codul limbii în `setLanguage` (`js/app.js`), în `LOCALES` (`js/app.js`, `js/daterange.js`, `js/admin.js`), în `LANGS` (`js/faq.js`) și un buton în comutator.

## Administrator (panou de utilizatori + chat fără restricții)

Un cont poate fi **administrator**. Rolul se dă **doar din baza de date** (din site nu poate scrie nimeni în acel loc, deci nimeni nu-și poate da singur drept de admin).

**Cum îți dai (sau dai altcuiva) drept de administrator**
1. Publică regulile actualizate: Firebase → **Realtime Database** → **Rules** → lipește tot conținutul `firebase-rules.json` → **Publish**. (Obligatoriu, altfel panoul nu poate citi utilizatorii.)
2. Firebase → **Authentication** → **Users** → copiază **User UID** al contului dorit.
3. Firebase → **Realtime Database** → **Data** → adaugă nodul `admins`, iar în el un copil cu **numele = UID-ul** și **valoarea = `true`** (boolean, scris fără ghilimele).
4. Contul se reconectează (sau reîncarcă pagina). Ca să retragi rolul, ștergi acel copil din `admins`.

**Ce primește administratorul**
- În **profil**: insignă albastră „Administrator" (în loc de „Membru FeelVoyage") și butonul **Utilizatori** lângă nume (plus un element „Utilizatori" în meniul contului).
- Panoul **Utilizatori**: lista tuturor utilizatorilor, cu căutare (nume, e-mail, telefon). Click pe un utilizator arată profilul lui așa cum îl vede el, **doar pentru citire**. Panoul nu poate modifica nimic.
- **Chat fără restricții de subiect**: poate întreba orice (cod, texte, idei), fără limita de întrebări pe sesiune și cu întrebări/răspunsuri mai lungi. Are o insignă albastră „Admin" în antetul chatului.

**Cum e protejat**
- Datele sunt apărate de **regulile bazei de date**, nu de butoanele din pagină: doar un cont din `admins` poate citi lista `users`; oricine altcineva primește PERMISSION_DENIED chiar dacă modifică pagina în browser.
- Fișierul `js/admin.js` se descarcă doar pentru conturile marcate ca administrator.
- Numele și e-mailurile utilizatorilor se afișează mereu ca text (nu se poate injecta cod prin ele).

**De știut**
- Chatul fără restricții e activat de pagină, nu de server (Firebase AI Logic nu verifică conturile). Nu expune date, dar cineva tehnic ar putea folosi cota Gemini fără limita de subiect. Păstrează **App Check** și setează o limită de cotă în Firebase.
- E-mailul se salvează în profil de la înregistrare. Conturile mai vechi îl primesc la următoarea lor autentificare; până atunci panoul arată „necunoscut".
- Lista conține conturile cu profil salvat în baza de date. Conturile fără profil se văd doar în **Authentication**.
- Fără Firebase configurat (mod local) nu există administrator.

## Asistent AI (Gemini)

Chatul poate răspunde la întrebări scrise liber cu **Gemini**, prin **Firebase AI Logic**. Nicio cheie Gemini nu se pune în cod (ar fi publică pe GitHub); cererile trec prin Firebase și sunt protejate cu **App Check (reCAPTCHA)**.

- Răspunde **doar** despre agenția FeelVoyage, site și destinații / locații. Pentru orice altceva, modelul semnalează „în afara domeniului", iar pagina afișează un mesaj fix (nu textul modelului).
- **Prețurile nu le inventează:** apelează calculatorul site-ului (`js/pricing.js`), deci cifrele sunt aceleași ca în fereastra pachetului.
- Cunoaște tot catalogul (`js/destinations.js`) și se actualizează singur când îl modifici.
- Butoanele rapide din chat rămân cu răspunsurile scrise de noi. Dacă AI-ul nu e disponibil (neconfigurat, fără internet, limită depășită), chatul revine automat la botul clasic.
- SDK-ul AI și reCAPTCHA se încarcă **doar la prima întrebare**, nu la deschiderea paginii.

**Configurare (o singură dată, după ce ai Firebase configurat):**

1. Firebase console → **AI Services → AI Logic → Get started** → alege **Gemini Developer API** (gratuit, fără card) și urmează pașii. Firebase activează API-urile necesare și cere **App Check** pentru AI Logic.
2. Creează cheia reCAPTCHA Enterprise: în Google Cloud console, în proiectul Firebase (același ca în `projectId`), caută **reCAPTCHA Enterprise** (numit uneori „Fraud Defense") → activează API-ul dacă ți se cere → **Create key** → tip **Website** → adaugă domeniul site-ului tău, doar numele, ex. `numele-tau.github.io` (**nu** adăuga `localhost`) → lasă **debifat** „Use checkbox challenge" → Create. Copiază **cheia** (ID-ul ei).
3. Firebase console → **Security → App Check → Apps** → aplicația web → **reCAPTCHA Enterprise** → lipește cheia → Save. (Pe planul gratuit Spark pragul de risc poate fi 0.1, 0.3, 0.5, 0.7 sau 0.9; recomandat 0.5.) La tab-ul **APIs** verifică să apară „Enforced" pe rândul *Firebase AI Logic*.
4. În `js/firebase-config.js`, la `FV_AI_CONFIG.appCheckSiteKey`, pune **cheia** de la pasul 2.
5. Urcă fișierele, deschide chatul și scrie, de exemplu: „Cât costă Roma pentru 2 adulți și un copil?".

**Setări** (în `FV_AI_CONFIG`, `js/firebase-config.js`): `enabled` (false = doar botul clasic), `appCheckProvider` (`enterprise` sau `v3`), `model` (implicit `gemini-3.5-flash-lite`; pentru răspunsuri mai precise `gemini-3.5-flash`), `maxQuestionsPerSession`. Domeniul și regulile asistentului sunt în funcția `buildSystemInstruction()` din `js/ai.js`.

**De știut:**
- Limitele planului gratuit sunt pe **proiect** (toți vizitatorii la un loc). Le vezi la Firebase → AI Logic; acolo poți seta și limita de cereri pe utilizator. Când se depășesc, chatul folosește răspunsurile clasice.
- Mesajele din chat ajung la Google. Sub câmpul de scris apare o notă scurtă „Răspunsuri generate de AI · pot conține greșeli”; butonul „i” deschide detaliile (nu scrie date personale, reCAPTCHA). Mențiunea reCAPTCHA cerută de Google e mereu vizibilă în subsolul site-ului, cât timp AI-ul e activ.
- Modelele Gemini 2.5 se închid în octombrie 2026; modelul implicit este din seria 3.5. Dacă un model e retras, schimbă `model`.
- Test local (`localhost`): pune `appCheckDebug: true`, deschide chatul și copiază „debug token" din consola browserului în Firebase → App Check → Apps → Manage debug tokens. Nu urca site-ul cu `appCheckDebug: true`.
- Nu ținem evidența conversațiilor: nu se salvează nicăieri pe site.

## Răspunsuri preprogramate (peste 100)

Chatul are o bază de **112 răspunsuri scrise de mână**, în **română, engleză, italiană, franceză și spaniolă**, plus răspunsuri pe fiecare dintre cele **29 de destinații** (în total 141). Se folosesc:
- când asistentul AI nu e disponibil (neconfigurat, fără internet, limită gratuită depășită, două erori la rând);
- pentru mesaje scurte („salut”, „mulțumesc”, „la revedere”), ca să nu consume cereri către AI;
- pentru butoanele de sub răspunsuri („Cum rezerv?”, „Servicii extra”...).

Teme acoperite: agenție și contact, rezervări și cont, plată, prețuri (copii, single, sezon, servicii extra), recomandări (mare, munte, city break, romantic, familie, aventură, iarnă...), informații de călătorie (acte, viză, vaccinuri, monedă, bagaje, prize, fus orar, bacșiș...), folosirea site-ului. Răspunsurile despre prețuri, ce include un pachet și listele („cele mai ieftine”, „all inclusive”, „cu buget de 600 €”) se calculează din `js/destinations.js`, deci rămân corecte când schimbi prețurile.

Întrebarea se potrivește pe cuvinte-cheie, fără să conteze diacriticele sau majusculele, iar răspunsul vine în limba în care a scris utilizatorul. Baza se descarcă doar când se deschide chatul.

**Cum adaugi un răspuns:** copiezi o intrare din `js/faq-data-1.js` (sau 2 / 3), îi dai un `id` nou și completezi titlul (`t`), cuvintele-cheie (`k`) și textul (`a`) pentru `ro`, `en`, `it`. Traducerile în franceză și spaniolă stau separat, în `js/faq-fr.js` și `js/faq-es.js`: acolo adaugi aceeași intrare, după `id`, cu `t`, `k`, `a`. Dacă lipsește o traducere, chatul folosește textul în engleză pentru acea intrare. În text poți folosi `**bold**`, `{phone}`, `{email}`, `{address}`, `{hours}`, `{count}`. Datele agenției (telefon, e-mail, adresă, program) sunt într-un singur loc, în `js/faq.js` (`SITE`).

## Modificări de design

Site-ul folosește Tailwind **precompilat** (`css/tailwind.css`), care se încarcă mult mai repede pe telefon decât varianta cu CDN.
Dacă adaugi clase Tailwind noi în `index.html` sau în `js/*.js`, regenerează fișierul (necesită Node.js):

```
npm install
npm run build:css
```

Culorile modului întunecat sunt în `css/dark.css`.
