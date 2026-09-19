# FeelVoyage

Site static (HTML + CSS + JavaScript), gata de pus pe **GitHub Pages**: încarci toate fișierele din acest folder în repository, cu `index.html` la rădăcină.

```
index.html
css/tailwind.css     ← stilurile Tailwind, deja generate (nu le edita de mână)
css/styles.css       ← stiluri proprii, optimizări pentru telefon, contor
css/dark.css         ← modul întunecat
js/translations.js   ← texte EN / IT
js/destinations.js   ← lista destinațiilor
js/app.js            ← filtre, rezervări, limbi
js/chat.js           ← asistentul de chat
js/firebase-config.js← AICI pui cheile Firebase (vezi mai jos)
js/backend.js        ← contorul comun + conturile (Firebase sau local)
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

## Modificări de design

Site-ul folosește Tailwind **precompilat** (`css/tailwind.css`), care se încarcă mult mai repede pe telefon decât varianta cu CDN.
Dacă adaugi clase Tailwind noi în `index.html` sau în `js/*.js`, regenerează fișierul (necesită Node.js):

```
npm install
npm run build:css
```

Culorile modului întunecat sunt în `css/dark.css`.
