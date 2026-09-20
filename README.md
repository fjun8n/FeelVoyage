# FeelVoyage

Site static (HTML + CSS + JavaScript), gata de pus pe **GitHub Pages**: încarci toate fișierele din acest folder în repository, cu `index.html` la rădăcină.

```
index.html
css/tailwind.css     ← stilurile Tailwind, deja generate (nu le edita de mână)
css/styles.css       ← stiluri proprii, optimizări pentru telefon, contor
css/dark.css         ← modul întunecat
js/translations.js   ← texte EN / IT
js/destinations.js   ← lista destinațiilor și prețul de bază al fiecărui pachet
js/pricing.js        ← calculatorul de preț (adulți, copii, sezon, durată, servicii extra)
js/daterange.js      ← calendarul pentru intervalul de date (plecare → întoarcere, format zz/ll/aaaa)
js/app.js            ← filtre, rezervări, limbi
js/chat.js           ← asistentul de chat
js/firebase-config.js← AICI pui cheile Firebase (vezi mai jos)
js/backend.js        ← contorul comun, conturile și comenzile (Firebase sau local)
js/theme.js          ← comutatorul luminos / întunecat
js/auth.js           ← autentificare, înregistrare, profil
js/counter.js        ← contorul „Călători Fericiți"
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
- Mesajele din chat ajung la Google; în chat apare o notă că răspunsurile sunt generate de AI și că nu trebuie scrise date personale.
- Modelele Gemini 2.5 se închid în octombrie 2026; modelul implicit este din seria 3.5. Dacă un model e retras, schimbă `model`.
- Test local (`localhost`): pune `appCheckDebug: true`, deschide chatul și copiază „debug token" din consola browserului în Firebase → App Check → Apps → Manage debug tokens. Nu urca site-ul cu `appCheckDebug: true`.
- Nu ținem evidența conversațiilor: nu se salvează nicăieri pe site.

## Modificări de design

Site-ul folosește Tailwind **precompilat** (`css/tailwind.css`), care se încarcă mult mai repede pe telefon decât varianta cu CDN.
Dacă adaugi clase Tailwind noi în `index.html` sau în `js/*.js`, regenerează fișierul (necesită Node.js):

```
npm install
npm run build:css
```

Culorile modului întunecat sunt în `css/dark.css`.
