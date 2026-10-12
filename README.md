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
js/infomodal.js      ← ferestrele „Despre noi”, „Termeni și Condiții”, „Politica de Confidențialitate” și „ANPC / SAL” (antet, meniul de telefon, subsol)
js/consent.js        ← acceptarea documentelor (bifă + buton „Acceptă”, salvat în browser)
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
js/accounts.js       ← cutia „Conturi Create” din prima pagină (număr live)
js/admin.js          ← panoul de administrator (se încarcă doar pentru admin)
js/moderation.js     ← filtrul de conținut indecent: text (orice limbă) + poze (prin Gemini). Identic pe ambele site-uri
js/estimate.js       ← estimarea de preț pentru o destinație din afara catalogului (zbor + cazare, calibrate pe prețurile reale)
js/contact-estimate.js ← leagă estimarea la formularul de ofertă: blocator de țară, sugestie de pachet existent, afișarea estimării
js/translate.js      ← traducerea automată a newsletterului (Gemini), ca fiecare abonat să-l primească pe limba lui
js/logger.js         ← jurnalul site-ului (erori, performanță), plafon 900, rotație pe priorități
js/logviewer.js      ← fereastra „Jurnal" din profilul administratorului
js/logremote.js      ← trimiterea jurnalului către Firebase (nodul logs/)
firebase-rules.json  ← regulile bazei de date (le lipești în Firebase)
```

Site-ul de recenzii (folderul `reviews/`, pus în repository-ul lui, separat) are pe lângă acestea:

```
reviews/js/admin-auth.js  ← autentificare DOAR pentru administratori (cont existent pe site-ul principal, marcat admins/<uid>)
reviews/js/logviewer.js   ← jurnalul propriu al acestui site (nodul reviewsLogs/, separat de cel principal)
reviews/js/ai-reviews.js  ← mini asistent AI, doar pentru administrator (Gemini, fără restricție de subiect)
reviews/js/chat-admin.js  ← bula de chat a administratorului (nu există în pagină pentru alți vizitatori)
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

## Pachete și galerii foto (59 de destinații)

Catalogul are **59 de pachete**: cele 29 inițiale și **30 noi**, din toată lumea:

- **America (10):** Yosemite, Grand Canyon, Horseshoe Bend & Page, San Francisco, Hawaii (Maui & Big Island), Cascada Niagara, Banff & Lake Louise, Machu Picchu, Rio de Janeiro, Patagonia (Torres del Paine);
- **Marea Britanie și Irlanda (4):** Edinburgh, Insula Skye, Cornwall, Irlanda (Cliffs of Moher);
- **Norvegia și Islanda (3):** Fiordul Geiranger, Lofoten (cu aurora boreală), Islanda (cascadele);
- **Africa (7):** Cape Town, Marrakech, Egipt (Giza), Zanzibar, Tanzania (Serengeti), Cascada Victoria, Namibia (Sossusvlei);
- **Asia și Oceania (6):** India (Taj Mahal & Jaipur), Vietnam (Golful Ha Long), Thailanda (Krabi & Phi Phi), Iordania (Petra), Noua Zeelandă (Milford Sound), Sydney.

Numărul „Destinații” din prima pagină și din „Despre noi” se calculează singur din listă (`data-dest-count`).

- **Galeria:** fereastra pachetului arată poza mare cu săgeți, contor („3 / 14”), miniaturi derulabile, glisare pe telefon și tastele ← →. Toate cele 59 de pachete au **11–15 poze**: cele 30 noi au 11–14 (396 în total), iar cele 29 vechi păstrează pozele de dinainte (coperta rămâne aceeași) și primesc încă 8–11 de pe Commons (289 în total). Insigna de pe card („14 Foto”) e numărată din listă.
- **De unde sunt pozele:** de pe **Wikimedia Commons** (fotografii făcute de oameni obișnuiți, publicate sub licențe libere: CC BY, CC BY-SA, CC0 ș.a.), în aceeași formă ca la pachetele existente (`upload.wikimedia.org/.../thumb/...`). **Nu sunt luate de pe Facebook, Instagram sau Reddit**: acolo fotografiile aparțin autorilor, iar folosirea lor pe un site comercial fără acordul lor ar încălca drepturile de autor. Sub poză apare „Foto: Wikimedia Commons, licență liberă. Autor și licență”, cu link către pagina fișierului, unde sunt autorul și licența exactă (licențele CC cer menționarea autorului; linkul o asigură).
- **Adresele pozelor** conțin calea MD5 a fișierului (`/thumb/a/ab/Nume.jpg/960px-Nume.jpg`). Site-ul cere doar lățimile standard acceptate de Wikimedia (250, 330, 500, 960, 1280 px). **Pozele nu au putut fi încărcate și verificate vizual în mediul în care a fost făcut site-ul** (fără internet): numele fișierelor vin din listele Commons, iar calea a fost verificată pe adresele deja existente. Dacă un fișier e redenumit sau șters pe Commons, site-ul scoate automat poza din galerie (miniatura dispare, contorul se ajustează), ca vizitatorul să nu vadă un chenar gol. Ca să revină numărul complet de poze, înlocuiește adresa în `js/destinations.js`.
- **Adaugi un pachet nou (5 locuri):**
  1. `js/destinations.js`: o intrare nouă (id, titlu, categorie, etichetă, preț în €, `priceRon` = preț × 5, rating, perioadă de forma „8 Nopți / Mic Dejun”, `images`, descriere, facilități);
  2. `js/translations.js` (EN, IT), `js/translations-fr.js`, `js/translations-es.js`: cheile `dest.<id>.title / tagLabel / period / description / amenities` (facilitățile, separate prin `|`);
  3. `js/faq-dest.js`: nume alternative + „cel mai bun moment” (RO, EN, IT), iar în `js/faq-fr.js` și `js/faq-es.js` textul din `F.extendDest`;
  4. `js/pricing.js`: sezonul în `OVERRIDES` (`longhaul`, `warm`, `city`, `beach`, `mountain`, `general`) și, dacă e cazul, `carUnavailable`;
  5. asistentul AI și „Destinații” din chat se actualizează singure din listă (doar textul din chat pentru „noutăți” se scrie la mână).
- **Prețurile noilor pachete sunt orientative** (estimări de pornit, nu oferte reale): verifică-le înainte să le publici.

## Cutia „Conturi Create” (prima pagină)

Între „Călători Fericiți” și „Destinații Active” se vede câte persoane au cont pe site, iar numărul se schimbă **live** la toți vizitatorii când cineva își face un cont (cu animație „+1” și indicatorul „în direct”).

- **Cum se numără:** la crearea contului, site-ul scrie un marcaj anonim `accountIds/<uid> = true`; numărul afișat este numărul marcajelor. Nu se salvează niciun nume, e-mail sau telefon acolo, dar identificatorii de cont sunt citibili public (fără ei nu se poate număra).
- **Nu poate fi umflat:** regulile permit doar crearea propriului marcaj, o singură dată; nu îl poți rescrie, șterge sau crea pentru altcineva. Numărul nu este o valoare pe care o scrie cineva.
- **Conturile mai vechi** (create înainte de această funcție) se numără la **prima lor autentificare**, deci numărul pornește mic și crește. Dacă un marcaj nu s-a putut scrie (rețea, reguli nepublicate), se reîncearcă singur la următoarea autentificare.
- **Trebuie să publici din nou `firebase-rules.json`** (regula `accountIds`). Fără ea contul se creează normal, dar contorul nu numără (în consolă apare un avertisment).
- Fără Firebase (mod de testare) se numără conturile din acel browser; fără internet se afișează ultima valoare cunoscută.

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

## Adresa sediului: nr. 127, cu link către hartă în subsol

- Adresa a fost actualizată de la nr. 124 la **nr. 127** peste tot unde apare: secțiunea de contact, eticheta hărții, subsolul, Termenii și Condițiile, documentele legale (Termeni/Confidențialitate/ANPC), traducerile în toate cele 5 limbi, **și** în sursele de date ale chatbot-ului (`js/chat.js`, `js/faq.js`) și ale asistentului AI (`js/ai.js`) — nu doar textul vizibil pe pagină.
- **Adresa din subsol e acum o legătură** care deschide Google Maps direct la adresă, într-o filă nouă (`target="_blank"`, cu `rel="noopener noreferrer"`), cu o iconiță de locație și un indiciu la trecerea mouse-ului, tradus în toate limbile (cheia nouă `footer.mapTitle`).
- Am adăugat suport general pentru `data-i18n-title` (traducerea atributului `title`, după modelul deja existent pentru `data-i18n-aria`) — util și pentru alte tooltip-uri viitoare, nu doar pentru acest link.

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

## Documente legale: Termeni și Condiții, Politica de Confidențialitate, ANPC / SAL

Din subsol, cele trei link-uri deschid documentele în ferestre (ca „Despre noi”). Fiecare are **cuprins** cu cifre romane care duce direct la secțiune, casete de atenționare la punctele importante, carduri pentru datele firmei și de contact, mod luminos/întunecat și 5 limbi. Se închid cu ✕, Escape, click pe fundal sau „Închide”; adresele `…/index.html#termeni`, `#confidentialitate` și `#anpc` le deschid direct. Între documente se poate trece direct (link-ul „Termeni și Condiții” din ANPC / SAL, stările din blocul de acceptare); se vede mereu o singură fereastră.

- **Plata:** Termenii spun că **nu se plătește pe site** și că plata se face doar după discuția cu un agent și oferta confirmată. Nu mai există nicio mențiune despre Stripe, Netopia sau plata cu cardul online. Chatul (răspunsurile preprogramate din toate limbile, botul clasic și instrucțiunile AI) spune la fel: plata se face doar după discuția cu un agent, nu pe site, iar cardul (Visa / Mastercard) nu mai e menționat ca metodă de plată către agenție (cardurile în străinătate rămân, ca sfat pentru călători).
- **Unde se editează textul:** româna în `index.html` (blocurile `id="termsModal"`, `id="privacyModal"`, `id="anpcModal"`), celelalte limbi în `js/translations.js` (EN, IT), `js/translations-fr.js` și `js/translations-es.js`, cu cheile `terms.*`, `privacy.*`, `anpc.*`, `accept.*` și cele partajate `legal.*` (cuprins, notă, contact, data actualizării). Titlurile vin din `footer.terms`, `footer.privacy`, `footer.anpc`. Traducerile sunt orientative: la final documentele spun că, în caz de diferențe, prevalează versiunea în română.
- **Datele firmei** (denumire, sediu, Registrul Comerțului, CUI, licență) și **datele de contact** (telefon, e-mail, program) sunt scrise direct în HTML (cardul din Termeni, secțiunea I, și listele de contact din fiecare document), ca să le poți schimba într-un singur loc.
- **Data actualizării:** „Ultima actualizare: septembrie 2026” (`legal.updated`). Când schimbi un document, schimbă și versiunea acceptării (mai jos).
- **ANPC / SAL** trimite doar la surse oficiale: `anpc.ro/sal`, `reclamatiisal.anpc.ro`, `eccromania.ro`. Platforma europeană SOL nu mai există (Regulamentul (UE) 2024/3228), deci nu e menționată. Linkurile trebuie verificate din când în când.
- Când adaugi o secțiune, copiezi una existentă (`id="<doc>-sN"`), îi pui numărul roman în ecuson și o adaugi și în cuprins (`data-doc-go`).
- Documentele nu țin loc de consultanță juridică: cere unui jurist să le verifice, mai ales anulările, plata și datele personale.

### Acceptarea documentelor

La finalul fiecărui document: o **bifă** și butonul **„Acceptă”** (activ doar după bifare). După acceptare apare „Acceptat pe <data>”, iar „Retrage acceptul” anulează. Blocul arată și starea celor trei documente.

- **Cu cont (autentificat):** acceptul se salvează **pe cont**, în Firebase, la `users/<uid>/consents/<document>` = `{ v: versiunea documentului, at: data (ora serverului), off: data retragerii }`. Îl vezi pe orice dispozitiv, iar **administratorul îl vede în panoul „Utilizatori”**, la rândul „Acceptări documente” (acceptat pe dată / retras pe dată / versiune veche / neacceptat). „Retrage acceptul” păstrează urma (adaugă `off`), nu șterge înregistrarea.
- **Fără cont:** acceptul se salvează doar în browserul acelui dispozitiv (`fv_consents`). **La prima autentificare sau creare de cont**, acceptele date așa se mută automat pe cont (cu data originală) și dispar de pe dispozitiv; un acord vechi de pe dispozitiv nu reînvie ceva ce ai retras ulterior pe cont. Dacă mutarea eșuează (fără internet, reguli nepublicate), acceptul rămâne pe dispozitiv și se reîncearcă la următoarea încărcare.
- **Trebuie să publici din nou `firebase-rules.json`** (regula `consents`). Fără ea, salvarea pe cont e respinsă, utilizatorul vede „Nu am putut salva acceptul pe contul tău” și acceptul rămâne nesalvat (nu se pretinde niciodată că e salvat).
- **Limită de securitate:** înregistrarea stă în profilul utilizatorului, pe care acesta îl poate modifica (regulile îi permit să scrie în propriul profil). Este o evidență utilă, dar **nu o probă juridică nemodificabilă**; pentru asta ar fi nevoie de o funcție pe server (Cloud Functions) care să scrie acceptul.
- **Versiunea:** fiecare bloc are `data-doc-version="2026-09"`. Dacă îl schimbi (după ce modifici un document), acceptele vechi nu mai contează și se cere din nou acceptul.
- Textul „Prin înregistrare accepți Termenii…” din formularul de cont nu e legat de aceste ferestre.

## Cont nou: telefonul este obligatoriu

La crearea unui cont, câmpul **Telefon** trebuie completat. Sunt acceptate numere românești (`07XX XXX XXX`, `02XX XXX XXX`) și internaționale cu `+` și prefix (România +40, Italia +39, Franța +33, Spania +34, Belgia +32, Elveția +41, Luxemburg +352, Mexic +52, Argentina +54, Chile +56, Columbia +57, Marea Britanie +44, Germania +49, Moldova +373, SUA / Canada +1 și prefixele din Asia și Orientul Mijlociu folosite și la rezervări). Aceeași validare se aplică și la formularul de rezervare (funcția `fvPhoneValid` din `js/app.js`).

- Conturile create **înainte** de această modificare rămân valabile, chiar dacă nu au telefon; nu li se cere nimic la autentificare.
- Regula din `firebase-rules.json` pentru `users/<uid>/phone` cere acum minim 6 caractere. **Publică din nou regulile** în Firebase (tab-ul **Rules** → **Publish**). Dacă nu le republici, site-ul merge oricum, dar baza de date nu verifică lungimea telefonului.
- Obligativitatea telefonului este verificată de formular și de codul site-ului; baza de date nu poate impune ca un câmp să existe la crearea contului fără să blocheze conturile vechi.

## Contul nu e „gata" până nu verifici e-mailul / parole ușor de ghicit, respinse

- **Nu se poate crea (folosi) un cont fără e-mail verificat.** La înregistrare sau la orice autentificare ulterioară cu un cont neverificat, în locul profilului apare o fereastră dedicată, „Mai ai un singur pas" — nu doar un banner alături de profil, ci înlocuiește complet conținutul lui. De acolo: **Retrimite e-mailul**, **Am verificat, actualizează** (recitește starea reală de pe Firebase și, dacă e confirmată, trece direct la profil) și **Deconectare**. Fereastra rămâne închidabilă normal (X, fundal, Escape) — **poți naviga tot site-ul oricând**, doar profilul „real" al contului nu se deschide până nu confirmi.
- Conturile **Google** rămân verificate automat (Google garantează adresa) — merg direct la profil, fără acest pas. **Modul local** (fără Firebase) la fel — nu există un mecanism real de verificat, deci nu cerem ceva ce site-ul nu poate confirma.
- Butoanele **„Utilizatori"** și **„Jurnal"** din dropdown-ul de cont, pentru administrator, cer acum și e-mail verificat, nu doar rolul — un administrator neverificat vede doar „Profilul meu" (care duce spre „verify"), „Vezi destinațiile" și „Deconectare".
- Blocajul de la trimiterea comenzii (secțiunea de mai jos) rămâne neschimbat și independent — funcționează chiar dacă vizitatorul nu a deschis niciodată fereastra de profil.
- Cod: `js/auth.js` (`isWeakPassword`, `afterSignIn`, rutarea din `openAuthModal`/`showAuthView`, fereastra `#verifyView`), `index.html` (`#verifyView`, în locul vechiului banner din `#profileView`).

- **Parole ușor de ghicit, respinse la înregistrare.** Pe lângă „123456" și „abcdef" (exact exemplele cerute), sunt respinse: alte secvențe simple ascendente/descendente de cifre sau litere (ex. „654321", „fedcba"), caractere repetate (ex. „111111", „aaaaaa") și o listă scurtă de parole foarte comune („qwerty", „password" etc.). Verificarea e doar în formularul de pe site — **dacă cineva își resetează parola prin linkul primit pe e-mail, acea pagină e găzduită de Firebase**, nu de site-ul nostru, și nu se poate aplica aceeași regulă acolo.

## Numele contului: majusculă obligatorie, fără cuvinte obscene/insulte

- La înregistrarea cu parolă, numele trebuie să înceapă **fiecare cuvânt cu majusculă** (ex: „Ion Popescu” — nu „ion popescu”, nu „ion Popescu”).
- Numele nu poate conține **cuvinte obscene, insulte sau apelative jignitoare** — verificat printr-o listă din română, engleză, italiană, franceză și spaniolă (nu poate fi o listă exhaustivă pentru „orice limbă din lume”, dar acoperă limbile site-ului și pe cele mai răspândite). Detectează și deghizări simple (litere repetate ca „puuulaaa”, diacritice diferite ca „pùlà”).
- Testat cu grijă să nu respingă din greșeală nume legitime cu litere duble (Anna, Emma), diacritice, apostrof sau cratimă (O'Connor, Jean-Baptiste, Mihai-Ștefan).
- **Se aplică doar formularului de înregistrare cu parolă.** Un cont creat prin Google folosește numele real de pe contul Google și nu trece prin acest filtru (nu are sens să blocăm autentificarea pe baza numelui de pe alt serviciu).
- Cod: `NAME_REGEX`, `isCapitalizedWord`, `BAD_WORDS`/`containsBadWord` în `js/auth.js`.

## Nu se poate trimite o comandă fără documentele acceptate și fără e-mail verificat

- **Documentele legale (Termeni, Confidențialitate, ANPC):** în formularul de rezervare apar 3 casete de bifat, chiar deasupra butonului de trimitere, fiecare cu un link „citește” care deschide documentul respectiv PESTE formular (fără să pierzi ce ai completat). Bifarea aici salvează acceptul prin ACEEAȘI funcție ca la pagina documentului (`FVConsent.accept`, în `js/consent.js`): pe cont dacă ești autentificat, altfel pe acest dispozitiv. Dacă ai acceptat deja un document (de aici sau din subsol), apare bifat și blocat, nu ți se mai cere din nou. **Se aplică tuturor** — cu cont sau fără.
- **E-mailul contului:** dacă ești autentificat și e-mailul contului tău nu e verificat, poți naviga tot site-ul normal, dar formularul de rezervare refuză trimiterea, cu un mesaj care te trimite spre profil („Retrimite e-mailul” / „Am verificat, actualizează”). **Nu se aplică** vizitatorilor fără cont (nu există un „e-mail de cont” de verificat) și nici conturilor Google sau modului local (ambele sunt tratate ca verificate din start — vezi secțiunile de mai sus).
- Ambele verificări rulează în `js/app.js`, chiar înainte de calculul prețului și trimiterea comenzii (`allConsentsAccepted()`, apoi `emailVerified === false`), cu focus pe prima casetă nebifată sau pe mesajul de eroare.
- Cod: `js/app.js` (gate-urile + checklist-ul din formular), `js/consent.js` (funcția `acceptDoc` extrasă și expusă ca `FVConsent.accept`), `js/auth.js` (`window.fvCurrentSession`, pentru ca `app.js` să știe dacă ești autentificat și verificat).

## E-mailurile ajung la Spam — nu se poate repara din cod

E-mailurile trimise de Firebase (verificare, resetare parolă) pot ajunge la Spam. Cauza ține de infrastructura **gratuită** de trimitere a Firebase (adresă de expeditor comună, folosită de mii de proiecte, cu reputație slabă la filtrele anti-spam) — **nu de codul site-ului**. Nu există niciun parametru pe care să-l setez din cod și care să garanteze livrarea în Inbox.

**Ce poți face gratuit, chiar acum, din consola Firebase:**
- **Authentication → Templates** — personalizează subiectul și textul e-mailelor (un text specific site-ului tău ajută puțin la percepția destinatarului, nu la trecerea filtrelor tehnice).
- **Project Settings → General** — completează „Public-facing name” și „Support email” cu datele reale ale afacerii; acestea apar ca nume al expeditorului.

**Soluția completă** (livrare mult mai bună) presupune trimiterea e-mailurilor prin propriul domeniu, cu înregistrări SPF/DKIM/DMARC, printr-un serviciu extern (SendGrid, Mailgun etc.) declanșat dintr-o funcție Cloud Function — ceea ce cere planul plătit Firebase (Blaze) și acces la DNS-ul unui domeniu propriu. E aceeași categorie de decizie ca la Apple sau verificarea telefonului prin SMS: dacă vrei să mergi pe acest drum, discutăm pașii, dar nu e ceva ce se poate activa doar din cod.

## Verificarea e-mailului (gratuită) / telefonul rămâne doar validat ca format

- **La înregistrarea cu parolă**, Firebase trimite automat un e-mail de verificare, imediat după crearea contului — gratuit, fără nicio configurare suplimentară (spre deosebire de verificarea telefonului prin SMS, vezi mai jos).
- **În pagina de profil** apare un banner „E-mailul nu este verificat”, cu două butoane: **Retrimite e-mailul** și **Am verificat, actualizează** (recitește starea reală de pe Firebase). La deschiderea profilului se face și o verificare automată, silențioasă — dacă a apăsat linkul din altă filă, bannerul dispare singur.
- **Conturile Google** sunt considerate verificate din start (Google garantează adresa) — nu li se trimite niciun e-mail suplimentar, nu apare bannerul.
- **Modul local** (fără Firebase configurat) tratează orice cont ca verificat: nu există un mecanism real de verificat fără Firebase, deci n-are rost un avertisment pe care vizitatorul nu-l poate rezolva.
- Starea de verificare vine direct de pe contul Firebase Auth (`user.emailVerified`), nu din baza de date — e imposibil de falsificat din site.
- Cod: `js/backend.js` (`resendVerification`, `refreshVerification`, `sendEmailVerification` la `register()`), `js/auth.js` (bannerul și cele două butoane, în `#profileView`).

**Verificarea telefonului prin SMS nu este inclusă** — spre deosebire de e-mail, Firebase **nu** oferă asta gratuit: necesită trecerea proiectului pe planul **Blaze** (facturare activată) și se plătește un cost per SMS trimis (de la ~0,01 $ în țările ieftine, până la ~0,46 $ în cele mai scumpe). Telefonul rămâne, ca și până acum, doar **validat ca format** (regex), nu verificat ca fiind al persoanei. Dacă vrei verificare reală prin SMS, spune-mi și o configurez — la fel ca la Apple, decizia de a activa facturarea Firebase îți aparține.

## Autentificare cu Google (gratuită)

Pe lângă e-mail/parolă, oricine se poate autentifica sau crea cont cu un click, printr-o fereastră Google. E complet gratuit — Firebase nu taxează suplimentar pentru asta, indiferent de trafic.

- **Ca să funcționeze pe site-ul tău real**, trebuie activat manual, o singură dată: Firebase Console → **Authentication** → **Sign-in method** → activează furnizorul **Google**. Fără acest pas, butonul apare, dar autentificarea eșuează cu eroarea „operation-not-allowed” (vizibilă în consolă).
- Dacă găzduiești pe alt domeniu decât cel implicit Firebase, adaugă-l și la **Authentication → Settings → Authorized domains** (altfel fereastra Google refuză cu „unauthorized-domain”).
- Butonul „Continuă cu Google” apare doar când Firebase e configurat (`js/firebase-config.js` are chei reale, nu „PASTE...”) — în modul local sau offline nu are sens, deci rămâne ascuns.
- **La prima autentificare**, contul se creează automat: nume și e-mail vin din contul Google. **Telefonul nu este cerut** la acest pas (spre deosebire de înregistrarea cu parolă) — formularul de rezervare tot îl cere separat, când chiar rezervi ceva, deci nimic nu blochează o comandă.
- Dacă cineva are deja cont cu parolă pe același e-mail și încearcă Google, primește un mesaj clar să se autentifice întâi cu parola (Firebase nu unește automat cele două metode).
- Dacă vizitatorul închide singur fereastra Google (s-a răzgândit), nu apare nicio eroare pe ecran.
- Un cont creat prin Google poate deveni administrator exact ca oricare altul: `admins/<uid>: true` în consola Firebase.
- **Apple („Sign in with Apple”)** nu poate fi gratuit: necesită obligatoriu un cont Apple Developer Program (99 $/an), indiferent de tehnologia din spate. Dacă site-ul prinde trafic și decideți să plătiți acel abonament, spuneți-mi și îl configurez — structura din `js/backend.js`/`js/auth.js` e pregătită să primească un al doilea furnizor la fel de ușor.

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

## Logo nou (câștigătorul votului) + animație la finalizarea comenzii

- **Logo-ul de pe site a fost înlocuit peste tot** (antet, fereastra „Mulțumim”) cu varianta câștigătoare la vot. Nu am folosit direct imaginea trimisă (era un JPEG pictat, cu fundal alb — ar fi arătat neclar la 40px în antet sau ca favicon); am **reconstruit-o ca desen vectorial adevărat**: literele „Feel voyage” sunt conturate din fonturile Poppins Bold și „Nothing You Could Do” (nu text obișnuit — arată identic peste tot, indiferent ce fonturi are instalate vizitatorul), cu o mică busolă ascunsă în litera „o”, exact ca în imaginea câștigătoare.
- **Site-ul are acum și un favicon** (nu avea deloc înainte) — insigna cu busolă, codificată direct în pagină.
- **Actualizare:** insigna conține acum **și peisajul, și avionul** din imaginea câștigătoare — nu mai e doar o busolă simplă. E tot o singură emblemă circulară, complet vectorială (reconstruită de la zero, nu imaginea foto trimisă): sus, un avion stilizat cu traiectoria de zbor și două păsări; jos, apusul de soare pe mare, stânca cu satul mediteranean și o barcă cu pânze — elementele din imaginea aleasă la vot. Testată la toate dimensiunile folosite pe site (antet, fereastra „Mulțumim”, favicon) — rămâne clară chiar și micșorată.
- **Reparat: un fundal colorat rămânea vizibil în spatele „Feel voyage”** — o regulă CSS veche, de la fostul logo bazat pe text (`.logo-text { background-image: ... }`), nu se mai potrivea cu noul logo SVG și apărea ca o pată colorată, mai ales la vizitatorii cu modul întunecat al sistemului activat. Am scos regula veche și am adăugat corect o variantă deschisă la culoare a wordmark-ului, afișată automat doar pe fundal întunecat (antetul se închide la culoare în modul întunecat al sistemului) — „voyage” rămâne lizibil în ambele moduri. Acoperit de `test30.js`.
- **Logo-ul a fost adăugat și în subsolul paginii** — acolo exista încă o instanță, separată, a vechiului logo (un romb albastru-portocaliu) care fusese ratată la înlocuirea inițială; a fost înlocuită cu insigna și wordmark-ul noi.
- **Reparat: pătratul necunoscut care apărea la distribuirea link-ului site-ului** (de exemplu pe WhatsApp/Telegram, mai ales cu modul întunecat al aplicației de mesagerie activat). Cauza: site-ul nu avea etichete Open Graph/Twitter Card, deci aplicațiile afișau un card generic, cu o pictogramă aleatoare, în loc de logo-ul real. Am adăugat `og:title`, `og:description`, `og:image` (o imagine proprie, 1200×630, cu logo-ul complet) și etichetele echivalente pentru Twitter. **„og:image" folosește o cale relativă** (`img/og-preview.png`) — se rezolvă corect automat la domeniul unde va fi găzduit site-ul, fără nimic de schimbat manual.
- **Mică umbră adăugată pe textul „Feel voyage"** (antet și subsol), cu o variantă puțin mai pronunțată pe fundal întunecat — îi dă puțin relief, discret.
- Logo-ul e definit **o singură dată**, ca simboluri SVG reutilizabile (`#fv-badge`, `#fv-wordmark`, `#fv-wordmark-dark`), refolosite prin `<use>` în antet și în fereastra „Mulțumim” — nu se repetă datele grele ale conturului de fiecare dată.
- **Fișiere separate** (SVG + PNG, fundal transparent) livrate din nou, cu noul design: `feelvoyage-logo-icon`, `feelvoyage-logo-orizontal`, `feelvoyage-logo-orizontal-fundal-inchis`.
- **La finalizarea comenzii** (fereastra „Mulțumim”), acum apar: o mică explozie de confetti (14 bucăți, culorile site-ului, dispar de la sine în ~1 secundă) și insigna „sare” elastic la apariție. Ambele sunt animații CSS simple, care respectă automat modul „fără animații” al site-ului (`html.motion-off`, pornit de modul rapid sau de „reduce motion” din sistem) — fără cod separat pentru asta, regula generală deja existentă le reduce automat la aproape zero. Cod: `.fv-confetti` / `.fv-badge-pop` în `css/styles.css`.

## Modificări de design

Site-ul folosește Tailwind **precompilat** (`css/tailwind.css`), care se încarcă mult mai repede pe telefon decât varianta cu CDN.
Dacă adaugi clase Tailwind noi în `index.html` sau în `js/*.js`, regenerează fișierul (necesită Node.js):

```
npm install
npm run build:css
```

Culorile modului întunecat sunt în `css/dark.css`.

### Prețurile pachetelor noi
Prețurile celor 30 de pachete noi au fost aliniate la oferte găsite pe site-urile agențiilor românești (cercetare din 21 septembrie 2026). Sursele, reperele găsite și pachetele care rămân estimări sunt în `PRETURI-SURSE.md`. Verifică prețurile înainte de a le folosi în vânzare.

## Prima pagină cu 6 destinații și ferestrele pe categorii
- **Prima pagină** arată doar destinațiile marcate `featured: true` în `js/destinations.js` (acum 6, câte una din fiecare categorie veche: Delta Dunării, Paris, Maldive, Santorini, Alpii Elvețieni, Zhangjiajie). Ca să schimbi care apar, mută `featured: true` la alte destinații.
- **Butoanele de categorie** (Toate, România, Plajă, Munte, City Break, Exotice, China & Coreea de Sud și cele noi: America & Canada, Africa & Safari, Europa de Nord & Insule, Asia & Oceania) deschid o fereastră ca „Termeni și Condiții”, cu toate destinațiile categoriei și un câmp de căutare. Butonul „Vezi toate cele 59 de destinații” și căutarea de sus deschid aceeași fereastră. O destinație poate fi în mai multe categorii (`extraCategories`). Ca să adaugi o categorie: un buton `data-filter="..."` în `index.html`, o opțiune în lista din căutare, cheia `dest.filterX` în cele 5 limbi și valoarea în `extraCategories`.
- **Cardurile** au doar poza de copertă. Pe ecrane de cel puțin **1024 px** (calculator, tabletă mare) apare pe marginea din dreapta a pozei un **mâner**: îl apeși sau îl tragi spre stânga și se deschide un sertar cu toate pozele (miniaturile se creează abia atunci; un click pe una deschide galeria mare la poza aleasă). **Pe ecrane mici** nu există sertar: insigna „N Foto” deschide direct galeria mare (cu glisare) și nu se descarcă nimic în plus până atunci. Limita de 1024 px e în `css/styles.css` (`@media (min-width: 1024px)`, clasele `.fv-drawer`, `.fv-pull`).
- **Ca să adaugi o categorie:** un buton `data-filter="..."` în `index.html` (și o opțiune în căutarea de sus), cheia `dest.filter...` în toate limbile și `extraCategories: ['...']` la destinațiile potrivite (o destinație poate fi în mai multe categorii). `test17` verifică numărul de destinații din fiecare categorie.
- **Pornirea paginii:** cardurile se afișează la `DOMContentLoaded`, nu la `window.onload`. Pe o conexiune lentă nu mai așteaptă pozele și fonturile, iar o listă deschisă între timp nu mai e refăcută la sfârșitul încărcării (`test17`, secțiunea H).
- **Ordinea ferestrelor:** pagina < lista de destinații (z-index 60) < fereastra pachetului (70) < ferestrele legale și contul (90). Cât timp fereastra pachetului e deschisă, lista din spate e inertă, iar Escape și Tab sunt ale ferestrei de deasupra.
- **Tailwind este precompilat** (`css/tailwind.css`) și nu poate fi recompilat fără `npm install`; de aceea componentele noi folosesc clase proprii din `css/styles.css`. Dacă adaugi clase Tailwind noi, rulează `npm run build:css`.
- **Subsol:** sub cele 3 iconițe sociale apare, cu litere mici și îngroșat, textul „Acest site este făcut în scop educativ și nu pot fi plasate comenzi reale.” (cheia `footer.edu`, în toate cele 5 limbi).

## Jurnal (log-uri), modul rapid și animații

- **Reparat: butoanele „Șterge” și „Actualizează” puteau rămâne inaccesibile pe ecrane foarte mici.** Reparația anterioară (rândurile comprimate la 2 px) rezolvase acea problemă ascunzând excesul cu `overflow: hidden`, dar asta putea, pe rândul ei, să ascundă complet butoanele de acțiune atunci când nici măcar antetul fix (statistici, filtre) nu încăpea. Acum întregul corp al ferestrei (`.lv-body`) rămâne derulabil ca plasă de siguranță, pe lângă derularea proprie a listei — butoanele rămân mereu accesibile prin derulare, niciodată ascunse. Acoperit de `test28.js` (ecran de 380 px înălțime).
- **Reparat: rândurile din fereastra „Jurnal” se comprimau la 2 pixeli pe ferestre mai scunde**, devenind imposibil de citit sau de deschis (linii subțiri, fără text vizibil). Cauza: statisticile, filtrele și lista de evenimente se „luptau” pentru spațiu în același container flex, iar lista pierdea aproape tot atunci când nu încăpea totul. Rezolvat: doar lista de evenimente (`#lvList`) se mai poate micșora și derulează (`overflow-y: auto`); antetul, statisticile, filtrele și butoanele de sus (`.lv-stats`, `.lv-perf`, `.lv-tools`, `.lv-actions`, `#lvCount`) și fiecare rând (`.lv-row`) nu se mai micșorează niciodată (`flex: none`) — își păstrează mereu dimensiunea naturală. Acoperit de `test27.js` (fereastră scundă, telefon, derulare, extinderea unui rând).
- **Erorile și avertismentele au acum un mesaj clar, în română, vizibil direct în listă** (fără să deschizi datele brute): eroare de cod → mesajul, fișierul și linia; eșec de autentificare/înregistrare → tradus din codul tehnic Firebase (ex. „invalid-credentials” → „E-mail sau parolă greșite”); poză/resursă nereușită → ce anume și de unde; blocaj de securitate (CSP), acțiune prea lentă, oprirea trimiterii jurnalului către server — fiecare cu explicație. Codurile fără o traducere anume tot arată ceva (nu rămân goale). Datele tehnice complete (JSON) rămân disponibile la un click pe rând, pentru detalii suplimentare. Eroarea e roșie, avertismentul portocaliu. Cod: `friendlyError()` în `js/logviewer.js`. **Doar în română** — dacă vrei mesajele traduse și în celelalte 4 limbi, se poate adăuga.
- **Reparat:** fereastra „Jurnal” devenea invizibilă (opacitate 0, deși fundalul rămânea întunecat/blurat) la schimbarea filei (Dispozitiv/Server/Conturi) sau a limbii cât timp fereastra era deschisă. Cauza: `build()` din `js/logviewer.js` recrea tot panoul de fiecare dată, iar clasa `is-open` (cea care face panoul vizibil, adăugată doar la prima deschidere) nu mai era pusă la loc. Rezolvat: `build()` reține dacă fereastra era deja deschisă și, dacă da, pune imediat `is-open` pe panoul nou creat. Acoperit de `test21.js` (verifică opacitatea reală, nu doar conținutul din DOM).
- **„Jurnal” apare acum și în dropdown-ul de cont** (cel din antet, cu „Profilul meu / Utilizatori / Vezi destinațiile / Deconectare”), imediat sub „Utilizatori”, doar pentru administrator — la fel cum apare și „Utilizatori”. Butonul rămâne și lângă nume, în pagina de profil completă (dublă cale de acces, ca la „Utilizatori”). Cod: `window.fvLogOpen` în `js/auth.js`.

- **Jurnalul** (`js/logger.js`, se încarcă primul) păstrează pe dispozitiv (localStorage, cheia `fv_logs`) ultimele 300 de evenimente: erori JavaScript, poze/scripturi care nu se încarcă, avertismentele din consolă, indicatorii de performanță (`perf.summary` la 4 secunde după încărcare: TTFB, FCP, LCP, CLS, TBT, verdict) și acțiunile importante (categorii deschise, căutări, pachete și poze, rezervări, comenzi, conturi, chat, AI, limbă, temă). **Nu se trimite nicăieri și nu conține date personale**: cheile de tip e-mail, telefon, nume, mesaj, text, parolă, token sunt înlocuite cu „[redactat]”, iar e-mailurile și telefoanele din șiruri sunt mascate; căutările și mesajele din chat se scriu doar ca lungime. Din cod: `fvLog('categorie', 'eveniment', { ...date fără date personale })` sau `FVLog.warn/error(...)`; `FVLog.time('cat', 'ev')` măsoară durate. `?debug=1` în adresă afișează evenimentele și în consola browserului. Dacă vrei ca jurnalul să ajungă la un server propriu, `FVLog.addSink(fn)` primește fiecare eveniment nou (nu e folosit implicit; ar trebui menționat în Politica de Confidențialitate).
- **Vizualizator (administrator):** butonul „Jurnal” din profilul administratorului (lângă „Utilizatori”, `js/logviewer.js`) arată statistici, ultimul rezumat de performanță, evenimentele filtrabile pe nivel / categorie / text, cu export JSON și CSV și ștergere. Jurnalul e cel al dispozitivului de pe care îl deschizi.
- **Modul rapid** (`js/perf.js`, clasele `perf-low` și `motion-off` de pe `<html>`, puse din `<head>` înainte de prima afișare): pornește automat pe dispozitive cu ≤ 2 GB memorie, ≤ 2 nuclee, „economisire de date” sau rețea 2G; după încărcare un sondaj de fluiditate îl pornește singur dacă pagina rulează sub ~25 de cadre pe secundă de două ori la rând. Ce schimbă: fără estompări (backdrop blur), umbre simple, fără zoom pe poze, secțiunile de jos randate leneș (`content-visibility`), poza din hero la dimensiunea mică, pozele de pe carduri la 500 px, lista de destinații în loturi de 4 (în loc de 8) și fără animații. Butonul „Mod rapid” din subsol îl schimbă manual (se ține minte în `fv_perf`); `?lite=1` / `?lite=0` în adresă îl forțează. „Reduce motion” din sistem oprește doar animațiile (`motion-off`), nu pornește modul rapid. În teste modul rămâne „full” (`window.__FV_PERF`), pentru că mediul de test are 1 nucleu.
- **Fluiditate pentru toate dispozitivele:** lista de destinații se randează în loturi (primul lot, un ecran, imediat; restul câte un lot pe cadru; o listă nouă anulează randarea veche); fonturile Google și iconițele Font Awesome nu mai blochează prima afișare (`media="print"` + `onload`, cu `<noscript>` de rezervă); poza din hero se preîncarcă la dimensiunea potrivită ecranului; preconnect către Wikimedia.
- **Animații** (`js/motion.js` + `css/styles.css`): apariție la derulare pentru titluri, carduri, servicii și contact (după apariție elementele revin la stilurile normale; nimic nu rămâne ascuns: după 4 secunde totul apare oricum), carduri din fereastra cu destinații care intră în cascadă, răspuns la apăsarea butoanelor, fade la schimbarea pozei mari, mânerul sertarului care se mișcă o dată pe sesiune (doar de la 1024 px) și bară de progres la derulare. Toate se opresc în modul rapid și la „reduce motion”.
- **Limite:** fluiditatea pe telefoane slabe a fost simulată (procesor încetinit în Chromium), nu măsurată pe telefoane reale. Regula „≤ 2 nuclee” poate trece în modul rapid și unele telefoane ieftine care merg bine; oricine îl poate opri din subsol. Testele: `test18` acoperă jurnalul, modul rapid, loturile, animațiile și vizualizatorul.

## Categorii noi: Halloween, Iarnă, Paște, Ziua Îndrăgostiților (67 de destinații în total)

- **4 categorii tematice noi**, fiecare cu cel puțin 6 destinații: `halloween`, `iarna`, `paste`, `valentine`. Butoane noi de filtru + opțiuni noi în dropdown-ul de căutare din antet, traduse în toate cele 5 limbi.
- **8 destinații complet noi**, cu poze reale (surse Wikimedia), prețuri, descrieri și facilități, traduse integral în RO/EN/IT/FR/ES: **Halloween** — Salem (SUA), New Orleans (SUA), Sleepy Hollow (SUA), Castelul Corvinilor (România); **Iarnă** — Laponia Finlandeză; **Paște** — Ierusalim; **Ziua Îndrăgostiților** — Veneția, Verona.
- **15 destinații deja existente** au primit suplimentar noua categorie, prin `extraCategories` (fără să li se schimbe conținutul): Castelul Bran și Edinburgh (Halloween); Alpii Elvețieni, Norvegia, Islanda, Viena, Lofoten (Iarnă); Roma, Maramureș, Barcelona, Sibiu-Sighișoara, Santorini (Paște); Santorini, Paris, Bali, Maldive (Ziua Îndrăgostiților).
- **Catalogul total a ajuns la 67 de destinații** (de la 59). Asta a cerut actualizarea numărului „59” în **peste 10 locuri diferite** unde apărea scris direct (nu calculat automat din listă): contoarele din prima pagină, din „Despre noi” și butonul „Vezi toate”, mai multe răspunsuri ale chatbot-ului clasic (în toate cele 5 limbi) și promptul trimis către asistentul AI. Toate verificate și corectate.
- **Reparat pe parcurs, găsit din întâmplare:** o editare anterioară ștersese din greșeală `id`, `title` și `category` de la destinația Santorini — ar fi blocat complet chatbot-ul (eroare JavaScript la orice întrebare despre o destinație). Depistat prin teste, reparat și verificat.
- **Promptul AI** (`js/ai.js`) descrie fiecare destinație pe scurt, într-un buget strict de caractere, ca să rămână rapid și ieftin de interogat; cu 8 destinații în plus, descrierile din prompt au fost scurtate puțin (de la 100 la 70 de caractere) ca totalul să rămână sub prag.
- **Ca să adaugi o nouă categorie tematică** (de sărbători sau orice altceva): un buton `data-filter` nou + opțiune în dropdown (`index.html`), cheile `dest.filter...` în toate limbile, și fie `category` nouă pe destinații noi, fie `extraCategories: ['...']` pe destinații existente potrivite. Minim 6 destinații pe categorie e doar o convenție, nu o regulă impusă de cod.
- Testare: suită nouă dedicată, `test33.js` (54 de verificări — existența categoriilor, minim 6 destinații fiecare, randarea catalogului, traducerea completă a celor 8 destinații noi în 5 limbi, traducerea etichetelor de categorie, regresia listei complete).

## Reduceri după data comenzii/durată + destinații sezoniere (schi, plajă de vară)

- **Reducere de rezervare din timp (12%):** pentru o destinație sezonieră, dacă plasezi comanda în sezonul **opus** celui al destinației — de exemplu rezervi o stațiune de schi vara, sau o stațiune de plajă iarna — primești automat 12% reducere. Se calculează după data la care se plasează comanda (azi), nu după data călătoriei.
- **Reducere de sejur lung (5%):** peste 14 nopți, la orice pachet (practic, doar categoriile `exotic`/`asia` permit peste 14 nopți — celelalte sunt deja limitate la 14 nopți maxim, o regulă veche, neschimbată).
- **Destinații sezoniere** (`seasonal: 'iarna'` sau `'vara'` în `destinations.js`) — data de plecare poate fi aleasă **doar în sezon ± 15 zile**; în afara acelei ferestre, ziua e dezactivată direct în calendar, iar trimiterea comenzii e blocată cu un mesaj clar, care spune exact perioada permisă. Marcate ca sezoniere: **Poiana Brașov, Alpii Elvețieni, Laponia** (iarnă: 16 noiembrie – 30 martie) și **Mamaia** (vară: 17 mai – 30 septembrie).
- Ambele reduceri apar ca linii separate, clare, în estimarea de preț din fereastra de rezervare, traduse în toate cele 5 limbi; o notă separată explică fereastra de rezervare pentru destinațiile sezoniere.
- Cod: `js/pricing.js` (`seasonalInfo`, `isDateAllowed`, `offSeasonDiscount`, liniile noi `longstay`/`offseason` din `quote()`), `js/daterange.js` (`cfg.seasonalWindow`, zilele din calendar + `validate()` cu noul cod `'season'`), `js/app.js` (configurarea ferestrei la deschiderea pachetului, nota din estimare, mesajul de eroare la trimitere).
- **Notă de design:** la pragul de 14→15 nopți, prețul total poate scădea o singură dată (reducerea de sejur lung depășește costul unei nopți în plus) — e intenționat, nu o eroare; testul de monotonie a prețului (`test5`) ignoră explicit acel prag.
- **Compatibilitate:** am găsit și reparat un test existent (`test3.js`) care folosea Poiana Brașov ca destinație „oarecare" pentru un test nelegat de sezon, cu o dată arbitrară care pica acum în afara ferestrei ei — schimbat să folosească o destinație nesezonieră.
- Testare: suită nouă dedicată, `test34.js` (38 de verificări — calculele de sezon izolat, liniile de reducere în `quote()`, cele 4 destinații marcate corect, zilele dezactivate în calendar, mesajul de eroare, reducerile vizibile și traduse în interfața reală).

## Titlul din hero (litere mici la mijloc) + busolă pixel-art în subsol

- **Titlul din prima secțiune**: **„Descoperă”** și **„FeelVoyage”** rămân neschimbate (aceeași mărime ca înainte), iar „lumea fără limite cu” e scris acum cu **litere mici** — toate trei la aceeași dimensiune de font, doar mijlocul e cu `text-transform: lowercase` (clasa `.lowercase`, adăugată în `css/styles.css` — nu există în Tailwind-ul precompilat al site-ului). Cheia nouă de traducere `hero.titleMid` ține partea din mijloc; `hero.title1`/`hero.title2` au rămas cheile deja existente, dar acum conțin doar primul cuvânt, respectiv „FeelVoyage”. Actualizat în toate cele 5 limbi.
- **Notă:** prima variantă pe care am făcut-o micșorase mărimea literelor din mijloc, în loc să le scrie cu litere mici — corectat la cererea ta.
- **Subsolul arată acum o busolă pixel-art, stil retro de joc** (originală, desenată pixel cu pixel pe o grilă 16×16, nu o copie a vreunui sprite protejat prin drepturi de autor), **în locul insignei obișnuite cu peisaj și avion** — doar în subsol; antetul și fereastra „Mulțumim” au rămas neschimbate, cu insigna obișnuită. Simbol nou, separat: `#fv-badge-minecraft`.
- **Compatibilitate:** am găsit și actualizat un test mai vechi (`test30.js`) care verifica explicit insigna obișnuită în subsol — acum verifică busola nouă.
- Testare: suită nouă dedicată, `test35.js` (22 de verificări — structura titlului, dimensiunile reale randate, traducerea în toate limbile cu contrastul de mărime păstrat, prezența și construcția pe pixeli a busolei).

## Bifă obligatorie (Termeni + Confidențialitate) și newsletter opțional la crearea contului

- **La crearea contului, apare acum o bifă reală** (nu doar un text pasiv ca înainte) — „Am citit și accept Termenii și Condițiile și Politica de Confidențialitate" — cu linkuri către ambele documente. Fără ea bifată, crearea contului e blocată, cu un mesaj clar. Dacă documentele fuseseră deja acceptate din altă parte (pagina documentului, o rezervare anterioară), bifa apare deja bifată și blocată — aceeași sursă de adevăr ca peste tot pe site (`js/consent.js`).
- **A doua bifă, opțională:** „Vreau să primesc pe e-mail oferte și noutăți de la FeelVoyage (newsletter)" — nebifată implicit, salvată pe cont la creare (`newsletter: true/false`), în ambele moduri (Firebase și local).
- **Bug real găsit și reparat:** regulile Firebase (`firebase-rules.json`) au o clauză care respinge orice câmp nelistat explicit pe profilul contului (`"$other": { ".validate": false }`). Fără actualizarea regulilor, adăugarea câmpului `newsletter` ar fi blocat **toată salvarea profilului** în producție (cu reguli reale publicate), nu doar preferința de newsletter. Adăugat `"newsletter": { ".validate": "newData.isBoolean()" }`.
- **Compatibilitate:** mai multe teste mai vechi (`test2`, `test9`, `test10`, `test14`, `test28`) creau conturi direct prin formular, fără să bifeze noua casetă (normal, nu exista înainte) — actualizate să bifeze automat unde are sens. Un caz special, `test15.js` (testează strict mecanismul de migrare a consimțămintelor, izolat de restul), a fost schimbat să creeze conturile direct prin `FVBackend.register()`, ocolind formularul, ca noua bifă să nu amestece scenariile controlate de-acolo.
- Testare: suită nouă dedicată, `test36.js` (24 de verificări — structura HTML, blocarea fără bifă, crearea reușită cu bifă (Firebase), salvarea corectă a `newsletter` și a ambelor consimțăminte, modul local fără Firebase, și cazul în care consimțământul exista deja).

## Târguri de Crăciun, Luna de Miere, Pentru Seniori, Sfântul Patrick + Constanța nouă + Insula Paștelui (87 de destinații)

- **Târguri de Crăciun** (9 destinații, minim 4 din România): **Cluj-Napoca, Timișoara, Craiova** (toate trei noi) + **Sibiu-Sighișoara, Castelul Bran** (deja existente, etichetate suplimentar) = 5 românești; plus **Budapesta, Strasbourg** (noi) + **Viena, Praga** (etichetate suplimentar) = 4 internaționale.
- **Luna de Miere** (6 destinații): **Seychelles** (nouă) + Santorini, Bali, Maldive, Veneția, Paris (deja existente, etichetate suplimentar).
- **Pentru Seniori** (6 destinații): **Croazieră pe Dunăre — Viena, Bratislava, Budapesta** (nouă, pachet gândit special pentru ritm lin, fără cărat bagaje, medic la bord) + Viena, Praga, Roma, Barcelona, Sibiu-Sighișoara (deja existente, etichetate suplimentar).
- **Sfântul Patrick** (3 destinații, toate noi, în Anglia, cum ai cerut): **Londra** (parada cu peste 50.000 de participanți, cea mai mare din afara Irlandei), **Birmingham** (a doua cea mai mare comunitate irlandeză din UK), **Manchester** (propriul festival irlandez).
- **Constanța nouă**, separată de Mamaia: Delfinariu, Grădina Zoo, Cazinoul Art Nouveau din 1910.
- **Insula Paștelui**: statuile moai, cariera Rano Raraku, Chile.
- Toate cele 12 destinații noi au traduceri complete în toate cele 5 limbi (titlu, descriere, facilități, perioadă), verificate funcțional una câte una.
- **Despre numărul de poze:** pentru orașele mari, internaționale (Budapesta, Strasbourg, Londra, Birmingham, Manchester, Seychelles, Insula Paștelui) am găsit 17-20 de poze reale per destinație. Pentru Craiova și Constanța, acoperirea foto disponibilă online e mult mai mică (confirmat după căutări extinse pe mai multe surse) — au rămas cu 7, respectiv 3 poze, toate reale și verificate, dar mai puține decât pragul standard de pe restul site-ului.
- **Compatibilitate tehnică:** sesiunea de lucru s-a întrerupt la jumătate (resetare de container); proiectul a fost restaurat din ultima arhivă livrată, fără pierderi, dar infrastructura de testare automată construită în sesiunile anterioare (36 de fișiere de test) nu a mai putut fi recuperată. Tot ce e descris mai sus a fost verificat manual, direct în browser, dar nu mai există o suită de regresie automată pentru întregul site.

## Reorganizare „Pentru Seniori" (83 de destinații)

Categoria **Pentru Seniori** a fost reconstruită de la zero, dedicată exclusiv stațiunilor balneare și de relaxare, conform cerinței:
- **Băile Herculane** (nouă) — Cădițele istorice, Valea Cernei
- **Sovata** (nouă) — Lacul Ursu, unicul lac helioterm cu dată de formare cunoscută exact
- **Karlovy Vary, Cehia** (nouă) — colonade termale Art Nouveau
- **Baden-Baden, Germania** (nouă) — Termele Friedrichsbad, Patrimoniu UNESCO

Cele 6 destinații mutate anterior la seniori (Viena, Praga, Roma, Barcelona, Sibiu-Sighișoara, Croazieră pe Dunăre) au fost scoase din această categorie și au rămas doar în categoriile lor proprii (city-break, românia, paște, târguri de Crăciun) — nimic nu a fost șters, doar reatribuit.

**Notă onestă despre poze:** Karlovy Vary (15) și Baden-Baden (14) au acoperire foto excelentă de pe Unsplash. Pentru Sovata a rămas o singură poză găsită online. Pentru **Băile Herculane**, utilizatorul a furnizat ulterior 17 poze proprii (Cădițele, Termele Neptun, cascada, statuia lui Hercule, bazine, poteca din stâncă) — acestea au înlocuit poza unică găsită inițial și sunt salvate local în `img/destinations/baile-herculane/`, nu mai depind de Unsplash. Băile Săcelu, menționată explicit, nu a avut nicio poză găsibilă pe nicio sursă verificată, motiv pentru care a fost înlocuită cu Sovata.

**Actualizare poze Sovata:** utilizatorul a furnizat ulterior 15 poze proprii (Lacul Ursu cu stabilimentele de pe mal, hotelurile stațiunii, vederi aeriene, mănăstirea din apropiere) — acestea au înlocuit poza unică găsită inițial și sunt salvate local în `img/destinations/sovata/`.

**Actualizare Băile Săcelu:** utilizatorul a furnizat ulterior 14 poze proprii (Baza de Tratament Săcelu, bazinele naturale, vederi aeriene ale văii) — Băile Săcelu a fost adăugată ca destinație nouă, separată de Sovata (nu a înlocuit-o), cu poze salvate local în `img/destinations/baile-sacelu/`. Categoria „Pentru Seniori" are acum 5 destinații: Băile Herculane, Sovata, Băile Săcelu, Karlovy Vary, Baden-Baden.

**Actualizare Constanța:** utilizatorul a furnizat 15 poze proprii (statuia cu delfini, spectacolul de la Delfinariu, Cazinoul, faleza, Roata Panoramică, digul de piatră, plaja) — acestea au înlocuit complet cele 3 poze Unsplash inițiale. La cererea utilizatorului, mențiunea „Grădina Zoo" a fost eliminată din titlu, descriere și facilități (înlocuită cu „Plimbare Ghidată pe Faleză"), în toate cele 5 limbi. Poze salvate local în `img/destinations/constanta-oras/`.

**Actualizare Craiova:** utilizatorul a furnizat 16 poze proprii ale Târgului de Crăciun (Piața Centrală cu ursuleții de pluș, patinoarul, roata panoramică, bradul luminat, artificii) — acestea au înlocuit complet cele 7 poze Unsplash inițiale. 6 dintre poze aveau rezoluție mică (sub 800px pe latura mică) și au fost mărite și clarificate (upscale + sharpen) înainte de salvare. Poze locale în `img2/destinations/craiova/`.

**Actualizare Timișoara:** utilizatorul a furnizat poze proprii ale Târgului de Crăciun din Piața Victoriei (în prezent 18 poze în galerie) (coroana de lumini, bradul, patinoarul, roata panoramică, căsuțele tradiționale, vederi aeriene, Moș Crăciun) — acestea au înlocuit complet cele 15 poze Unsplash inițiale. 11 poze aveau latura lungă sub 1280px: 7 (900–1270px) au fost mărite 2× cu FSRCNN, iar 4 foarte mici (de la 387×516 la 675×453) au fost mărite 4× cu EDSR, toate cu reducere ușoară de artefacte JPEG și sharpen fin; celelalte au fost doar redimensionate la max 1600px. Rezultatul este o clarificare, nu detalii noi — pozele cele mai mici rămân mai moi decât cele originale mari. Pozele 18 și 19 nu au putut fi confirmate ca fiind din Timișoara și sunt ultimele din galerie. Poze locale în `img2/destinations/timisoara/`.

**Actualizare Cluj-Napoca:** utilizatorul a furnizat 17 poze proprii ale Târgului de Crăciun din Piața Unirii (Roata panoramică în fața Bisericii Sf. Mihail, bradul luminat, coroana de lumini, poarta „Planeta Crăciun", bastoanele de acadea, vederi aeriene) — acestea au înlocuit complet cele 13 poze Unsplash inițiale. 7 poze aveau latura lungă sub 1280px: 3 (1000–1200px) au fost mărite 2× cu FSRCNN, iar 4 mici (de la 547×365 la 827×551) au fost mărite cu EDSR (2× sau 4×, după caz), toate cu reducere ușoară de artefacte JPEG și sharpen fin; celelalte au fost doar redimensionate la max 1600px. Rezultatul este o clarificare, nu detalii noi. Poze locale în `img2/destinations/cluj-napoca/`.

**Structura folderelor de imagini (două foldere conectate):** pentru că GitHub acceptă maximum 100 de fișiere la o singură încărcare prin interfața web, folderul de poze a fost împărțit în două, ambele cu aceeași structură internă (`destinations/<nume-destinatie>/`):
- `img/` — `og-preview.png` (imaginea de previzualizare la distribuirea link-ului, referită din `index.html`) și pozele pentru Băile Herculane, Băile Săcelu, Sovata și Constanța;
- `img2/` — pozele pentru târgurile de Crăciun: Craiova, Cluj-Napoca și Timișoara.

Conexiunea dintre cele două foldere este în `js/destinations.js`: fiecare destinație își listează pozele cu calea completă (`img/…` sau `img2/…`), deci nu depinde de altceva. O destinație nouă cu poze locale se adaugă în folderul care are mai puține fișiere (ținta: sub 100 de fișiere pe încărcare).

**Curățare categorie „Târguri de Crăciun":** la cererea utilizatorului, categoria a fost restrânsă la cele 5 destinații construite special pentru ea, cu poze proprii dedicate (Cluj-Napoca, Timișoara, Craiova, Budapesta, Strasbourg). Viena, Praga, Castelul Bran și Sibiu-Sighișoara, care aveau eticheta suplimentară „târg de Crăciun" fără să fie gândite ca atare, au fost scoase din această categorie — rămân neschimbate în categoriile lor proprii (city-break, românia, Halloween, Paște).

**Rotație automată a vitrinei de pe prima pagină:** cele 6 destinații afișate pe prima pagină nu mai sunt fixe (eticheta `featured: true` a fost eliminată din toate destinațiile) — acum se schimbă automat la fiecare 3 ore, cu alte 6 destinații, identice pentru toți vizitatorii în același interval (calculat din ora curentă, nu per sesiune — nu e nevoie de server). Logica (`getFeaturedDestinations()` în `js/app.js`) amestecă toate cele 84 de destinații o singură dată, cu o ordine fixă, apoi alunecă o fereastră de 6 prin acea ordine, avansând la fiecare tură — fără repetări în cadrul unei parcurgeri complete (~14 ture, adică ~42 de ore până se reia ciclul). Dacă pagina rămâne deschisă peste granița dintre două ture, vitrina se reîmprospătează singură, fără refresh manual.

**Street View la sediu:** click pe eticheta hărții din secțiunea de Contact deschide acum o fereastră dedicată (aceeași logică și același stil ca la Termeni/Confidențialitate/ANPC), cu Google Street View chiar pe adresă — Str. Tudor Vladimirescu nr 127, Târgu Jiu (coordonate confirmate: 45.0379553, 23.2863048). Nu necesită cheie API Google (format `output=svembed`, gratuit și fără limite de utilizare). Fereastra are și un link „Deschide în Google Maps" ca variantă de rezervă, care se deschide într-o filă nouă.

## Notificare pe e-mail la fiecare solicitare (rezervare sau formular de contact)

Pe lângă salvarea în baza de date (care se întâmplă deja automat, prin Firebase, în `orders/`), solicitările trimise prin formularul de rezervare sau cel de contact pot fi trimise și pe e-mail la **crucrudenis@gmail.com**.

**Trimiterea pe e-mail e opțională și separată** de baza de date — foloseşte [EmailJS](https://www.emailjs.com/) (gratuit până la 200 de e-mailuri/lună), care trimite direct din browser, fără server propriu. Cheile se completează în `js/emailjs-config.js` — fișierul conține instrucțiuni pas cu pas (cont gratuit, conectarea Gmail-ului, un șablon de e-mail, 3 valori de copiat). Până le completezi, site-ul funcționează exact ca înainte — comenzile tot ajung în baza de date, doar notificarea pe e-mail e sărită (cu un mesaj clar în consolă, nu o eroare).

Trimiterea e „cel mai bun efort": dacă e-mailul eșuează din orice motiv (internet oprit, cheie greșită), comanda tot a fost deja salvată în baza de date — nimic nu blochează sau întrerupe trimiterea formularului pentru vizitator.

Fișiere noi: `js/emailjs-config.js` (cheile tale), `js/emailnotify.js` (logica de trimitere, apelată automat din `js/app.js → sendOrder()`, după ce comanda e deja salvată în baza de date).

## Facilități deselectabile, restricții de sezon pentru sărbători, reducere de rezervare din timp, popup newsletter

**Facilități deselectabile, cu scăderea prețului:** în fereastra fiecărui pachet, „Servicii & Facilități Incluse" au devenit bife (bifate implicit — sunt incluse). Dacă debifezi una, prețul scade pe loc, live, și apare o linie nouă în estimare. Fără o defalcare reală pe fiecare facilitate (sunt text liber, diferit la fiecare pachet), fiecare facilitate a unei destinații reprezintă o parte egală dintr-un procent fix din preț (30% împărțit egal, ex. 1 din 4 facilități debifată = -7,5%).

**Restricții de dată pentru sărbători** (Halloween, Sfântul Patrick, Târguri de Crăciun, Ziua Îndrăgostiților, Paște): extins mecanismul sezonier existent (iarnă/vară) cu 5 ferestre noi, fiecare cu marja standard de ±15 zile. Aplicat **doar** la destinațiile construite special pentru sărbătoarea respectivă (ex. Salem, Sleepy Hollow, New Orleans, Corvin Castle pentru Halloween; cele 3 orașe engleze pentru Sf. Patrick; cele 5 orașe pentru Târguri de Crăciun; Veneția și Verona pentru Valentine; Ierusalim pentru Paște) — **nu** la destinațiile unde sărbătoarea e doar o etichetă suplimentară (Paris, Bali, Santorini, Maramureș, Sibiu etc. rămân rezervabile tot anul, pentru city-break/exotic/românia). Paștele, fiind o sărbătoare mobilă (dată diferită în fiecare an, diferită catolic/ortodox), folosește o fereastră mai largă (22 martie – 8 mai) care acoperă ambele calendare, în loc de o dată fixă.

**Reducere de rezervare din timp (15%):** nouă, separată de reducerea existentă de „sezon opus" — se aplică la **orice** destinație dacă data plecării e la 8-13 luni distanță de ziua comenzii. Dacă s-ar califica și la reducerea de sezon opus (doar la destinațiile iarnă/vară), se aplică automat doar reducerea mai mare dintre cele două, nu se adună.

**Pop-up newsletter:** mic, în colțul din dreapta sus, pe tema site-ului (gradient brand), cu o bifă „Da, vreau să primesc oferte pe e-mail". Apare **doar** dacă vizitatorul are cont (e autentificat) și nu s-a abonat deja; dacă îl închide fără să bifeze, nu mai apare 7 zile. Am adăugat și partea de bază de date care lipsea: citirea și salvarea preferinței de newsletter pe cont (`FVBackend.setNewsletter`), în ambele moduri (Firebase și local).

**CSS reconstruit:** proiectul folosește Tailwind precompilat (`npm run build:css`), nu generat live — a fost reconstruit ca să includă toate clasele noi folosite de popup (altfel apărea nepoziționat corect). Dacă mai adaugi clase Tailwind noi pe viitor, rulează din nou `npm run build:css` înainte de a publica.

**Bug reparat pe parcurs:** căsuțele de bifare ale facilităților erau în afara `<form>`-ului de rezervare, deci un prim ascultător de evenimente nu le prindea; acum au propriul ascultător, pe un container stabil.

## Norișor din chatbot, reamintire de newsletter în chat, difuzare actualizări către abonați

**Norișor din chatbot:** un mic mesaj-bulă („Ai vreo întrebare sau o problemă? Mă poți întreba orice! 😊") iese din butonul de chat la ~9 secunde după încărcarea paginii, cu codiță vizuală îndreptată spre robot, ca botul să pară mai viu. Click pe el deschide chatul direct; X îl închide. Apare o singură dată per vizită și nu mai revine 6 ore dacă e închis manual.

**Reamintire de newsletter în chat:** când deschizi chatul, dacă ai cont și nu ești abonat la newsletter, botul trimite un mesaj separat, firesc, la scurt timp după salut, cu un buton „📩 Da, abonează-mă" direct în conversație — nu mai trebuie să cauți popup-ul din altă parte a paginii.

**Difuzare actualizări către abonați (panoul de administrator):** buton nou, „Trimite actualizare" (lângă „Utilizatori"), unde administratorul scrie un mesaj scurt și îl trimite tuturor celor abonați la newsletter — niciodată automat, doar la cerere. Spre deosebire de notificarea de comandă (care merge la tine, la fiecare rezervare), asta e un șablon EmailJS separat (`updateTemplateId` în `js/emailjs-config.js`, cu propriile instrucțiuni acolo) — newsletter-ul rămâne complet independent și trimite doar când TU alegi să anunți ceva nou, nu la fiecare comandă. Trimiterea arată progres live („3 din 7") și un rezumat final („5 trimise, 0 eșuate"), cu o mică pauză între fiecare e-mail (EmailJS, pe planul gratuit, nu e gândit pentru trimiteri masive instant).

Toate trei verificate funcțional, cu date simulate (panou de admin, listă de abonați, trimitere).

## Abonare/dezabonare la newsletter direct din chat, și comutator de admin pe profilul fiecărui utilizator

**Din chat, cu Accept/Refuz:** dacă scrii în chat ceva ce conține „newsletter”, „abonez”, „abonare” etc. (în orice limbă a site-ului), botul recunoaște intenția și întreabă direct, cu două butoane — „📩 Da, abonează-mă” / „Nu, mulțumesc” — nu doar la reamintirea automată de la deschiderea chatului (care acum are și ea ambele butoane). Dacă nu ai cont, botul îți spune clar că ai nevoie de unul; dacă ești deja abonat, te anunță că ești deja abonat, fără să mai întrebe degeaba.

**Comutator în panoul de administrator:** pe profilul fiecărui utilizator (din „Utilizatori”), lângă celelalte detalii doar-citire, administratorul are acum un comutator real — poate abona sau dezabona pe oricine la newsletter, cu un click, cu confirmare „Salvat.” Panoul rămâne doar-citire pentru tot restul (nume, telefon, documente acceptate) — newsletter-ul e singurul lucru editabil de acolo, intenționat.

**Important — pas manual necesar:** regulile bazei de date (`firebase-rules.json`) au fost actualizate ca să permită administratorului să scrie în câmpul `newsletter` al altor conturi (înainte, fiecare cont își putea modifica doar propriile date). **Trebuie să urci din nou acest fișier în Firebase Console** (Realtime Database → Rules → lipești conținutul din `firebase-rules.json` → Publish), altfel comutatorul din panoul de administrator va da eroare de permisiune pe site-ul real, deși în cod totul e corect.

**Bug reparat — intenția de newsletter nu funcționa pentru contul de administrator:** recunoașterea cuvintelor-cheie („vreau să mă abonez la newsletter" etc.) excludea din greșeală contul de administrator, lăsând mesajul să ajungă la AI — care, necunoscând mecanismul real, inventa un răspuns (o secțiune de abonare în subsol care nu există pe site). Acum funcționează identic pentru orice cont, inclusiv administratorul. Reamintirea AUTOMATĂ (la deschiderea chatului) rămâne sărită pentru admin, intenționat — doar răspunsul la întrebarea explicită a fost reparat.

## Recenzii pe destinații (stele 1-5, text, poze) + site separat „FeelVoyage Reviews"

### Pe site-ul principal
- Fiecare destinație are acum o secțiune „Recenzii Călători" în fereastra pachetului, cu nota live (medie reală, calculată automat) și un buton „Lasă un review".
- Fereastra de review (ca la Termeni și Condiții): stele 1-5, nume auto-completat din cont, câmpuri separate pentru ce ți-a plăcut / ce nu ți-a plăcut / alte observații, până la 4 poze (comprimate automat în browser, fără Firebase Storage).
- **Fără cont, nu poți lăsa recenzie** — mesaj clar, cu buton spre autentificare.
- **Nota de bază**: fiecare destinație „pornește" cu 5★ (ca un review invizibil); media afișată e calculată automat din acel 5★ plus toate recenziile reale, pe măsură ce apar.
- Secțiune nouă pe prima pagină, **„Ce spun călătorii noștri"** (între Destinații și Servicii) — cele mai bune 3 recenzii de pe tot site-ul, **în timp real** (apar fără refresh de pagină), cu buton „Vezi mai multe recenzii" spre site-ul separat.

### Site separat „FeelVoyage Reviews" (folder `reviews/`)
Site nou, complet separat, cu propriul `index.html`/`css`/`js`, gata de propriul repo GitHub dacă vrei:
- Siglă **„FeelVoyage Reviews"** (globul colorat + text), temă **alb-negru**, aceleași 5 limbi.
- Aceleași 84 de destinații (`reviews/js/destinations.js` — **copie** din proiectul principal; dacă adaugi destinații noi acolo, copiază din nou fișierul aici ca să rămână sincronizate 1-la-1).
- **Doar citire** — nu poți lăsa recenzie de pe acest site, exact cum ai cerut; recenziile se adaugă exclusiv de pe FeelVoyage.ro.
- Folosește **aceeași bază de date Firebase** (`reviews/js/firebase-config.js`, copiat din proiectul principal) — recenziile scrise pe site-ul principal apar aici automat, live.
- Căutare destinații, click pe oricare → fereastră cu toate recenziile ei (stele, nume, dată, text, poze).

### Decizii tehnice importante, pe care vreau să le știi clar
1. **Fără autentificare pe site-ul de recenzii** — nu e nevoie, de vreme ce acolo nu poți scrie nimic, doar citești. Dacă vrei totuși login acolo (de exemplu pentru un pas viitor), spune-mi și îl adaug separat.
2. **Traducerea recenziilor**: NU am făcut traducere automată reală — ar necesita un serviciu plătit (cheie API Google Translate sau similar), cu cost recurent. În schimb, fiecare recenzie se afișează exact cum a fost scrisă, cu o etichetă clară a limbii originale (ex. „🇬🇧 Scris în English"), dacă diferă de limba selectată pe site. E o soluție corectă și de încredere, fără costuri ascunse — dar nu e traducere automată propriu-zisă. Spune-mi dacă vrei să mergem mai departe cu un serviciu plătit de traducere.
3. **Poze**: comprimate direct în browser (redimensionate, JPEG, sub ~340KB), stocate în baza de date — nu am configurat Firebase Storage (ar necesita cont plătit Google).
4. **CSS separat**: site-ul de recenzii are propriul `tailwind.config.js`/`package.json` în `reviews/`, independent de cel principal — dacă adaugi clase Tailwind noi acolo, rulează `npm run build:css` din folderul `reviews/`, nu din rădăcina proiectului.

### Pas manual necesar
Ca de obicei la schimbări de reguli Firebase: **urcă din nou `firebase-rules.json`** în Firebase Console (Realtime Database → Rules → Publish) — am adăugat nodurile `reviews`, `reviewStats` și `reviewsFeed`. Fără asta, recenziile nu se vor putea nici scrie, nici citi pe site-ul real.

## Corecții la site-ul FeelVoyage Reviews (design, logo, poze)

- **Design identic cu site-ul principal** (nu alb-negru cum fusese prima variantă): aceleași culori brand, același logo complet (globul + „Feelvoyage” desenat), cu eticheta „REVIEWS” adăugată lângă el.
- **Comutator luminos/întunecat** — lipsea, acum există, identic cu cel de pe site-ul principal (`css/dark.css` + `js/theme.js`, copiate de acolo).
- **Pozele destinațiilor sunt colorate din start**, nu doar la trecerea cursorului peste ele.
- **Poze locale reparate** — 7 destinații (Băile Herculane, Băile Săcelu, Constanța, Sovata, Cluj-Napoca, Craiova, Timișoara) foloseau poze locale (nu Unsplash); folderele lor de poze (`img/`, `img2/`) au fost copiate și în `reviews/`, altfel apăreau sparte acolo.
- **Linkuri corectate cu adresele reale**: cele două site-uri sunt repo-uri GitHub separate (https://fjun8n.github.io/FeelVoyage/ și https://fjun8n.github.io/FeelVoyage-Reviews/) — linkurile dintre ele foloseau căi relative, greșite pentru această configurație; acum sunt adrese complete, în ambele sensuri.

**Actualizare mare — parcuri tematice, sincronizare recenzii, fix-uri (sesiune curentă):**
- Secțiune nouă **„Parcuri Tematice"**: Disneyland Paris (14 poze), Legoland Billund (14 poze), Minecraft World (1 poză — parcul chiar e în construcție, deschidere anunțată 2027 la Chessington World of Adventures, UK). Toate 3 apar ca „ÎN CURÂND" — fereastra lor are un formular simplu „Anunță-mă la lansare" în loc de calculatorul complet de preț/date.
- **Băile Săcelu**: 14 poze locale proprii, deja puse în galerie.
- **Recenziile (text + poze)** apar acum și pe site-ul principal, în fiecare fereastră de pachet, nu doar pe FeelVoyage Reviews — aceeași sursă Firebase.
- **Lightbox**: click pe o poză de recenzie o mărește pe tot ecranul, pe ambele site-uri.
- **Site-ul reviews**: fereastra cu recenziile unei destinații are acum un banner cu poza destinației (nu mai e un antet gol).
- **Norișorul de chat**: nu se mai „pune pe pauză" 6 ore dacă doar dispare singur — reapare la fiecare vizită nouă.
- `reviews/js/destinations.js` sincronizat manual cu `js/destinations.js` (identice) — orice destinație nouă trebuie copiată în ambele, la fel ca imaginile locale din `img/`/`img2/`.

**Actualizare — Disneyland/Legoland deschise, poze noi, fix-uri (sesiune curentă):**
- **Disneyland Paris (780 €/3 nopți) și Legoland Billund (850 €/3 nopți)** sunt acum deschise pentru comenzi reale — prețuri calibrate după cercetare de piață (pachete reale hotel+bilet multi-zi+zbor, nivel „moderat"). Minecraft World rămâne „în curând" (parcul chiar nu există încă, deschidere 2027).
- **Poză Minecraft World primită de la utilizator NU a fost folosită** — era artă oficială de brand Mojang/Microsoft (logo + personaje), protejată prin drepturi de autor. A rămas poza generică neutră.
- **Folder nou `img3/`** cu poze proprii ale utilizatorului pentru 3 destinații existente, înlocuind pozele Wikimedia Commons:
  - `img3/destinations/castelul-corvinilor/` → 13 poze (id destinație: `corvin-castle`)
  - `img3/destinations/laponia/` → 16 poze
  - `img3/destinations/ierusalim/` → 11 poze (din 12 primite; una a fost exclusă — foto de presă cu o persoană publică identificabilă)
- **Fix bife rezervare:** debifarea „Transport Inclus”/„Zbor Inclus” din Servicii & Facilități Incluse acum debifează automat și căsuța „Transport” din Alege Serviciile Dorite (sincronizare vizuală; prețul nu era afectat oricum, un serviciu „inclus” nu se taxează separat).
- **Panoul „Recenzii Călători”** din fiecare pachet: fundal neutru (gri deschis) în loc de galben-portocaliu vibrant.

**Fix important — descoperire sesiune curentă:** `css/tailwind.css` era un fișier precompilat care NU se regenera automat; orice clasă Tailwind nouă, nefolosită deja undeva în site la ultima compilare, era eliminată silențios (z-index, înălțimi, culori etc. rămâneau fără efect, fără nicio eroare vizibilă). Asta explica bug-ul cu zoom-ul pe poze care nu funcționa. Am reconstruit corect `css/tailwind.css` din `src/tailwind-input.css` cu `npm run build:css` (necesită `npm install` o singură dată) și am mutat tot ce era critic (z-index lightbox, dimensiuni) în reguli scrise manual în `styles.css`, care nu trece prin acest proces și nu mai poate păți la fel. **La orice modificare viitoare a claselor Tailwind folosite, rulează `npm install && npm run build:css` în ambele foldere (principal și `reviews/`) înainte de livrare.**

**Alte reparații sesiune curentă:**
- **Lightbox rescris**: acum funcționează pe ambele site-uri (z-index corect), are cadru alb „profi” în jurul pozei, săgeți de navigare stânga/dreapta + contor „X / Y”, X rămâne în colțul dreapta-sus.
- **Recenziile cu poze** au fost mutate din fereastra fiecărui pachet (unde nu trebuiau să apară) în secțiunea dedicată de pe prima pagină („Ce spun călătorii noștri”), pe site-ul principal.
- **Bannerul din fereastra de recenzii** (site-ul reviews) e mai mic (6-7rem în loc de 9-11rem).
- Confirmat: modul întunecat există deja, identic, pe ambele site-uri.
- Poza Minecraft World trimisă a doua oară a fost tot artă oficială de brand (logo + personaje) — nu a fost folosită, din același motiv de drepturi de autor.

**Poză Minecraft World:** ilustrație originală (desenată de Claude, SVG), un parc tematic generic — fără nicio referință la Minecraft (fără cuburi, fără personaje din joc, fără logo). Înlocuiește atât poza Unsplash inițială, cât și desenul trimis de utilizator (care conținea logo-ul oficial „Minecraft World” și personaje din joc — artă de brand protejată, nu putea fi folosită).

**Actualizare — sincronizare facilități, formular cont, stele live (sesiune curentă):**
- **Sincronizare facilități extinsă**: pe lângă transport, acum se sincronizează automat și mic dejun/pensiune/all inclusive, ghid, transfer și mașină de închiriat — debifarea oricăreia dintre acestea din „Servicii & Facilități Incluse” debifează automat și căsuța corespunzătoare din „Alege Serviciile Dorite” (și invers). Fiecare regulă a fost verificată manual pe toate destinațiile, ca să nu prindă text nepotrivit (ex: „Tur Panoramic Auto” sau „Pensiune Tradițională” ca tip de cazare).
- **„Trimite Cerere de Ofertă” necesită cont**: câmpurile sunt dezactivate (efectiv, nu doar vizual) până te autentifici, cu mesaj explicativ + buton direct spre înregistrare. O dată logat, numele/e-mailul/telefonul se precompletează automat, la fel ca la pachete.
- **Stelele de pe carduri sincronizate cu baza de date**: fiecare card (prima pagină + fereastra de destinații) se abonează acum la numărul real de recenzii; cât timp nu există recenzii reale rămâne nota curatoriată din destinations.js, dar se actualizează automat imediat ce apar recenzii adevărate (același mecanism care exista deja pe site-ul reviews).
- **„Ce spun călătorii noștri” (prima pagină)**: fiecare recenzie arată acum toate 3 câmpurile — „Ce i-a plăcut” (verde), „Ce nu i-a plăcut” (roșu) și „Alte observații” (gri) — la fel ca pe site-ul reviews, nu doar primul disponibil.

## Poză de profil (Firebase Storage) — sesiune curentă

Fiecare cont își poate pune acum o poză de profil (din galerie sau fișiere), cu buton de cameră lângă avatar, în „Profilul meu”. Necesită un pas de activare, o singură dată:

1. În [Firebase Console](https://console.firebase.google.com) → proiectul tău → **Storage** → „Get started” (dacă nu exista deja activat) → alege regiunea.
2. Verifică numele bucket-ului afișat acolo (ex. `gs://feelvoyage.appspot.com`). Dacă diferă de ce e în `js/firebase-config.js` (`storageBucket`), actualizează valoarea acolo.
3. Publică regulile din `storage.rules` (din acest folder): Storage → Rules → lipește conținutul → Publică. Fără asta, încărcarea va eșua cu eroare de permisiuni, chiar dacă Storage e activat.
4. Gata — nu mai e nevoie de nimic în cod. Până activezi Storage, butonul de poză arată un mesaj clar de eroare, nu rămâne agățat la „Se încarcă”.

**Alte actualizări din această sesiune:**
- **Panoul de admin**: poate schimba acum numele afișat al oricărui cont (buton „Salvează” lângă câmpul de nume, în fișa fiecărui utilizator). ID-ul contului (UID) rămâne needitabil — e cheia primară pentru toate comenzile/recenziile acelui cont; schimbarea lui ar rupe legătura cu istoricul contului, deci nu e ceva editabil în siguranță.
- **Hash-urile parolelor**: rămân neafișate și nedecodabile — Firebase Authentication nu le expune niciodată, nici către aplicație, nici către administrator (vezi mesajul deja existent din Jurnal).

## Poză de profil — acum pe Cloudinary (nu Firebase Storage)

Am renunțat la Firebase Storage (necesită card, din 2026) — poza de profil se încarcă acum pe **Cloudinary**, gratuit, fără card:

1. Cont nou pe [cloudinary.com](https://cloudinary.com) (gratuit).
2. Dashboard → numele de cloud e afișat sus → copiază-l.
3. Settings → Upload → Upload presets → Add upload preset: **Signing Mode: Unsigned**, Folder: `feelvoyage_avatars`, Allowed formats: `jpg`, Max file size: 2 MB.
4. Pune cele două valori (cloud name + preset name) în `js/cloudinary-config.js`.

Interacțiunea s-a schimbat și ea: nu mai e un buton separat de cameră — treci cu mouse-ul (sau apeși, pe telefon) direct pe poza de profil.

**Despre ștergerea automată a pozelor vechi**: nu e sigur de implementat momentan. Ștergerea pe Cloudinary necesită un apel semnat cu cheia secretă a contului, care NU trebuie niciodată pusă în cod vizibil (oricine ar putea șterge orice poză din tot contul). Fără un mic server care să țină cheia secretă în siguranță, varianta sigură e să lăsăm pozele vechi (nefolosite) acolo — ocupă loc neglijabil (o poză comprimată are ~50-100 KB; chiar și 1000 de schimbări de poză ar însuma sub 100 MB, din cei 25 GB gratuiți). Dacă vrei totuși curățare automată, following opțiune e un mic „Cloudflare Worker" (gratuit, fără card) care ține cheia secretă — spune-mi dacă vrei să mergem pe acolo.

## Actualizări sesiune curentă (progres parțial — vezi mesajul din chat pentru lista completă)
- Căutare fără diacritice pe ambele site-uri („Baile Herculane” găsește „Băile Herculane”)
- Bară de scroll personalizată (culorile site-ului), pe ambele site-uri, inclusiv mod întunecat
- Filtru după stele (5★+, 4★+ etc.) pentru recenziile fiecărui pachet, pe site-ul reviews
- „RECENZII VERIFICATE”: galben în loc de portocaliu închis
- „Alte observații” (prima pagină): albastru în loc de gri
- Limita de 4 poze per recenzie eliminată (prima pagină)

## Roluri — sesiune curentă

Pe lângă „Membru”, acum există 4 roluri vizuale (cel mult 2 se arată pe profil, cele mai importante):
1. **Călător Loial** (mov, monedă) — automat la 10+ comenzi (pachete + cereri simple, la fel), SAU manual de la admin, oricând.
2. **Helper** (indigo, căști) — manual de la admin. Singurul rol cu o funcție reală: vede Jurnalul (doar citire — fără tab-ul de Conturi, fără ștergere).
3. **Bug Finder** (roșu, insectă) — manual de la admin, doar vizual.
4. **Beta Tester** (turcoaz, eprubetă) — manual de la admin, doar vizual.

Admin poate da/retrage oricare dintre ele din fișa fiecărui utilizator (panoul „Utilizatori”). „Membru” nu e un rol de dat manual — ține de existența contului.

## Țară / cetățenie — sesiune curentă

Formularul „Trimite Cerere de Ofertă” are acum un câmp nou, „Țară / Cetățenie” — dropdown căutabil, cu steag pentru fiecare din cele 192 de țări (listă în `js/countries.js`), fără diacritice la căutare. Salvat în Firebase la `contactRequests/{id}/country`.

## Aeroport apropiat + bilet de avion inteligent (geolocație) — sesiune curentă

Fiecare destinație are acum o țară (`country`, cod ISO) și un aeroport cel mai apropiat (`nearestAirport`) în `destinations.js` — afișate pe fiecare card și în fiecare fereastră de pachet.

**Geolocație**: un banner discret (o singură dată, niciodată din nou dacă refuzi) cere permisiunea de a-ți detecta țara. Dacă accepți și ești deja în țara destinației (ex: ești în Italia și te uiți la pachetul Roma), biletul de avion apare automat nebifat, cu explicația „Nu ai nevoie — ești deja acolo”, în loc de „Inclus” blocat. Alte pachete, din alte țări, nu sunt afectate.

Notă: asta schimbă doar starea vizuală a biletului (nebifat + explicat clar), nu recalculează automat prețul total — ar necesita o reproiectare mai amplă a formulei de preț (partea „zbor” e în prezent inclusă fix în prețul de bază pentru pachetele internaționale). Spune-mi dacă vrei să mergem și pe partea asta.

## Raportează un bug + Cloudinary + poză Google — sesiune curentă

- **Buton „Raportează un bug"** în subsolul ambelor site-uri (text mic, gri, discret). Funcționează fără cont. Salvat separat în Firebase, la `bugReports` — citibil doar de admin, dintr-un tab nou „Rapoarte Bug” în Jurnal (Helper nu îl vede).
- **Cloudinary configurat** cu datele reale (`cloud: nglqkywm`, preset: `FeelVoyage`). Nu am putut testa live upload-ul din acest mediu (rețeaua blochează explicit `api.cloudinary.com`), dar codul e verificat logic — testează tu odată urcat pe GitHub Pages.
- **Poză de profil automată la Google** — prima dată când cineva se loghează cu Google, poza din contul Google devine poza de profil FeelVoyage. O poate schimba oricând după, normal, din profil.

## Rapoarte Bug — despărțite pe site (sesiune curentă)

Tab-ul „Rapoarte Bug” din Jurnal are acum două sub-categorii clare — „FeelVoyage” și „FeelVoyage Reviews” — fiecare cu propriul număr de rapoarte; nu se amestecă niciodată într-o singură listă.

## Țara pe profil + admin (sesiune curentă)

Geolocația (deja construită) se conectează acum la cont: țara detectată (doar țara, nimic mai precis) se salvează automat pe cont și apare ca un mic ecuson pe profil (steag + nume țară), lângă „Membru FeelVoyage”. Admin o vede și el, în fișa fiecărui utilizator.

## SEO, viteză chat, poze mai clare (sesiune curentă)

- **SEO de bază**: `meta description`, link canonic, date structurate Schema.org (TravelAgency / WebSite) pe ambele site-uri, plus `robots.txt` și `sitemap.xml`. **Important**: astea ajută motoarele de căutare să înțeleagă și să indexeze corect site-ul, dar nu pot garanta apariția la „recomandate” — asta ține de algoritmul Google, vechimea domeniului și linkurile către site, nu doar de cod.
- **Chat puțin mai rapid**: răspunsurile AI sunt acum limitate la un text ceva mai scurt (generare mai rapidă), iar botul clasic (fără AI) răspunde după 0,35-0,7 secunde în loc de 0,6-1,2 secunde.
- **152 de poze locale ascuțite** (Herculane, Săcelu, Constanța, Sovata, Cluj-Napoca, Craiova, Timișoara, Castelul Corvinilor, Ierusalim, Laponia) — filtru unsharp mask aplicat tuturor.
- **Toate pozele Unsplash (278)**: cerute acum la rezoluție mai mare (1600px în loc de 1000px) — poze vizibil mai clare pe ecrane mari, fără nicio modificare de cod suplimentară (galeria mare le folosește direct; cardurile mici rămân la rezoluție redusă, pentru viteză).

## Site reviews — mobil mai curat (sesiune curentă)

Filtrul „N★+” din fereastra fiecărei destinații nu mai sare pe 2 rânduri pe telefon — acum derulează orizontal, într-un singur rând, fără bară de scroll vizibilă (ca filtrele de categorii de pe site-ul principal).

## Anunțuri cu șabloane (sesiune curentă)

Butonul de megafon din panoul de admin (deja exista, trimitea actualizări abonaților la newsletter) are acum un prim pas nou: alege între 5 șabloane predefinite (scrise în engleză: New Update, New Destinations, Special Offer, Seasonal Greeting, We'd Love Your Feedback), orice șablon creat anterior de tine, sau „Scrie mesaj propriu" (fluxul vechi, neschimbat). Poți crea șabloane noi direct din acel ecran („Creează șablon nou") — se salvează în Firebase și rămân disponibile de atunci încolo, pe orice dispozitiv de pe care te loghezi ca admin.

## Preț recalculat când ești deja în țara destinației (sesiune curentă)

Ultima piesă rămasă din cererea de geolocație: acum, când ești deja în țara destinației, prețul chiar scade — nu doar bifa de la transport. Testat exact pe Roma (Italia): 2 adulți, 840 € → 546 €, cu o linie clară în estimare: „Fără zbor — ești deja acolo (2 × 147 €) -294 €". Suma scăzută e partea de zbor „coaptă” în prețul de bază (fixă, nu depinde de câte nopți stai — la fel cum funcționează și restul formulei). Destinațiile din România (care oricum nu au zbor copt în preț) rămân neafectate. Totul apare automat și în detaliile comenzii trimise către tine.

Cu asta, lista ta mare de cereri din acest fir e completă.

## Prețuri reale de zbor dus-întors, pentru toate destinațiile (sesiune curentă)

Fiecare destinație are acum un preț real de zbor dus-întors (`flightPriceRT`, în euro, per adult) — cercetat din surse reale (KAYAK, Wizz Air, rute din București, sezon redus), nu mai e o estimare abstractă (procent din preț). Exemple verificate: Roma 80 €, Dubai 230 €, Kenya (safari) 580 €, Sydney 1.100 €. Destinațiile din România rămân la 0 € (fără zbor necesar).

**Bug găsit și reparat pe parcurs**: 7 destinații din România (Castelul Corvinilor, Cluj-Napoca, Timișoara, Craiova, Băile Herculane, Sovata, Băile Săcelu) foloseau o categorie diferită de „romania" (ex: „seniori", „halloween", „târguri de Crăciun") și, din cauza asta, formula de preț le reducea greșit prețul cu ~35%, fără niciun motiv real. Acum formula se uită la **țara** destinației (deja catalogată), nu la eticheta de categorie — toate cele 7 au prețul corect confirmat (egal cu prețul de bază afișat).

Reducerea „ești deja în țară" (din sesiunea trecută) folosește acum prețul real de zbor în loc de vechea estimare.

## Calibrare prețuri + curs valutar live (sesiune curentă)

**Recalibrare**: acum că fiecare destinație are un preț real de zbor (sesiunea trecută), am scos vechea estimare abstractă de zbor din prețul de bază — `dest.price` reprezintă acum doar partea de teren (hotel/masă), iar totalul afișat = teren + zbor real. Rezultatul: majoritatea prețurilor au scăzut, reflectând zboruri low-cost reale din București (Wizz Air/Ryanair), ceea ce înseamnă prețuri mai competitive.

**Excepție**: pentru destinațiile cu logistică internă scumpă — safari (Kenya, Serengeti, Namibia, Victoria Falls), insule izolate (Maldive, Seychelles, Zanzibar, Insula Paștelui), circuite lungi (Machu Picchu, Patagonia) — reducerea a fost mult mai blândă, pentru că acolo costul real nu e zborul internațional, ci cazările specializate și transferurile interne.

**Bug găsit și reparat pe parcurs**: formula de preț, folosită cu fixedShare-ul vechi al categoriei, afecta incorect destinațiile din România cu categorie diferită de „romania" — am eliminat complet acel mecanism, nu mai există risc de recurență.

**Curs valutar live**: prețurile în euro NU se schimbă (reflectă costuri reale), dar echivalentul în lei se recalculează automat cu cursul real EUR/RON de azi (Frankfurter.app, bazat pe cursurile BCE, gratuit, fără cheie) — exact cum ai cerut: dacă euro „crește" (ia mai mulți lei), suma în lei afișată crește automat; dacă scade, scade. Se reîmprospătează din rețea cel mult o dată la 12 ore (cursul BCE oricum se actualizează o dată pe zi); dacă rețeaua nu răspunde, site-ul rămâne pe cursul de rezervă, fără să se strice nimic. Testat matematic: 706 € la curs 5,45 → 3.848 lei; la curs 6,00 → 4.236 lei, recalculat live chiar și cu fereastra de pachet deja deschisă.

## Scanare completă a site-ului — bug-uri găsite și reparate (sesiune curentă)

Verificare sistematică: sintaxă, structură date, reguli Firebase vs. cod, HTML, traduceri, teste live extinse.

### 🔴 Bug critic (ar fi afectat clienți reali)
**`amenitiesExcluded` lipsea din regulile Firebase pentru `orders`.** Acest câmp era scris la FIECARE comandă de pachet trimisă, dar regulile nu-l permiteau explicit — cum regulile resping orice câmp nelistat, fiecare comandă reală ar fi fost respinsă silențios de Firebase odată urcat pe server (clientul ar fi crezut că a trimis-o, dar nu ar fi ajuns la tine niciodată). Reparat și verificat riguros, câmp cu câmp, pentru toate cele 3 tipuri de formulare.

### 🟡 Bug-uri de UX (minore, dar reale)
- Bannerul de cerere a locației (fixat jos) se putea suprapune cu butonul „Raportează un bug" din subsol — mutat sus, sub antet.
- Butonul X de închidere din modalul „Raportează un bug" nu avea dimensiuni explicite (spre deosebire de toate celelalte butoane de închidere din site, care au `w-10 h-10` sau similar) — reparat, aliniat la tiparul restului site-ului.

### ✅ Verificat temeinic, fără probleme
- Sintaxă JS (55 fișiere), JSON (reguli + date structurate SEO)
- Zero ID-uri HTML duplicate, zero referințe moarte către elemente inexistente
- CSS (Tailwind) perfect sincronizat cu codul curent, pe ambele site-uri
- Toate cele 87 de destinații: structură completă, fără date aberante, fără poze lipsă
- Traduceri: 923 chei identice pe toate 4 limbile (EN/IT/ES/FR) de pe site-ul principal, 14 chei identice pe toate 5 limbile (RO/EN/IT/FR/ES) de pe reviews — sistem de fallback robust confirmat (nicio cheie lipsă nu poate afișa text gol sau „undefined")
- Zero erori JavaScript la teste live extinse (peste 20 de destinații diferite, catalog, căutare, formulare, autentificare, bug report) pe ambele site-uri

## Reparații din sesiunea curentă

- **Eroarea „Nu am putut citi de pe server" la Rapoarte Bug**: regulile locale (`firebase-rules.json`) sunt deja corecte (admin poate citi). Cel mai probabil regulile LIVE din Firebase Console nu au fost încă actualizate cu conținutul curent al fișierului — **te rog copiază din nou tot conținutul `firebase-rules.json` în Firebase Console → Realtime Database → Rules → Publică**, ori de câte ori primești o arhivă nouă cu modificări la acest fișier. Am și îmbunătățit mesajul de eroare: acum, dacă problema e chiar de permisiuni, apare un mesaj clar care spune exact asta, în loc de mesajul generic de rețea.
- **Dropdown țară (și alte hover-uri „albe" din tot site-ul)**: culoarea de hover (`hover:bg-slate-50`) nu avea variantă pentru mod întunecat — se vedea alb/foarte deschis pe fundal închis. Reparat generic, o singură dată, pentru toate cele 3 locuri unde apărea (dropdown țară, butoanele de rol din admin, butonul de login cu Google).
- **Poza de profil, acum și în antet**: lângă nume, în colțul din dreapta sus, apare acum poza de profil (dacă ai una încărcată), nu doar iconița generică. Se actualizează imediat, fără reîncărcarea paginii, în clipa în care schimbi poza din profil.
- **Rolurile de pe profil**: am re-verificat codul — sunt deja afișate lângă eticheta Membru/Admin, în ordinea ierarhiei, limitate la maximum 2 chiar dacă ai mai multe roluri. Nu era nimic de reparat aici.

## Șablon EmailJS pentru „Trimite Cerere de Ofertă" (sesiune curentă)

Fișier nou: `emailjs-template-contact.html` — instrucțiunile complete de instalare sunt chiar în comentariul din capul fișierului (EmailJS → template-ul tău → „Code Editor" → lipești tot conținutul).

Funcționează pentru AMBELE tipuri de cereri (cerere simplă de ofertă ȘI rezervare de pachet), cu secțiuni care apar sau dispar automat: la o cerere simplă, vezi doar nume/telefon/e-mail/destinație/țară/mesaj; la o rezervare de pachet, apare și caseta cu perioadă/călători/servicii/preț total. Testat vizual pentru ambele cazuri.

**Bug mic găsit și reparat pe parcurs**: câmpul „Țară / Cetățenie" era salvat corect în baza de date, dar NU era trimis și către e-mail — acum apare și acolo.

## „Trimite Cerere de Ofertă" — acum completă (sesiune curentă)

Formularul de contact are acum aceleași categorii de informații ca rezervarea unui pachet:
- **Perioadă dorită**: nopți + dată aproximativă de plecare (opțional)
- **Călători**: adulți, copii 0-4 ani, copii 5-12 ani
- **Servicii Dorite**: aceleași 8 categorii ca la pachete (Transport, Cazare, Transfer, Mese, Bilete, Asigurare, Ghid, Mașină), ca listă de bife — fără blocaje, fără prețuri, toate nebifate implicit

E-mailul primit arată acum, pentru o cerere simplă: perioadă, călători, **servicii alese** ȘI **facilități nealese** (restul din cele 8, nebifate) — exact simetric cu ce ai la rezervările de pachete. Testat complet, cu date reale.

**Totalul/prețul a fost scos din e-mail** (șablonul `emailjs-template-contact.html`), pentru ambele tipuri de cereri — prețul rămâne să se discute la telefon, cum ai cerut.

**Bug reparat pe parcurs**: am folosit din greșeală `t(...)` în loc de `tr(...)` la primul draft — ar fi dat eroare JS la fiecare trimitere de cerere simplă. Găsit și reparat prin testare directă, înainte de livrare.

**Important**: dacă ai deja instalat `emailjs-template-contact.html` în EmailJS, va trebui să înlocuiești conținutul cu versiunea nouă din această arhivă (secțiunea de total a fost scoasă, iar cea de „detalii călătorie" funcționează acum independent de perioadă).

## Buton de apel direct în e-mail (sesiune curentă)

Pe lângă „Răspunde pe e-mail", acum apare și un buton verde **„Sună pe [Nume]"** (`tel:{{phone}}`) — pe telefon, un singur tap deschide direct aplicația de apeluri, cu numărul deja completat.

**Rafinare mică găsită pe parcurs**: am observat că o cerere veche, fără niciunul din noile câmpuri (perioadă/călători/servicii), lăsa o casetă „Detalii călătorie" goală în e-mail. Reparat — caseta dispare complet când nu are ce arăta, verificat vizual pentru toate 3 situațiile (cerere veche, cerere nouă completă, rezervare de pachet).

## Spațiere reparată în Jurnal (sesiune curentă)

Tab-ul „Rapoarte Bug" din Jurnal: lipsea complet spațiul dintre rândul cu „FeelVoyage / FeelVoyage Reviews" și butonul „Actualizează" de dedesubt — se atingeau direct. Adăugat puțin spațiu, verificat vizual.

## Șablon EmailJS pentru anunțuri/newsletter (sesiune curentă)

Fișier nou: `emailjs-template-newsletter.html` — pentru `updateTemplateId` (butonul de megafon din admin), diferit de `emailjs-template-contact.html` (care e pentru notificările de comandă). Instrucțiunile de instalare sunt în comentariul din capul fișierului.

Design nou, cu degrade pe antet (albastru → auriu, culorile site-ului), mesajul pus în evidență într-o casetă cu bordură, și buton clar **„🌍 Vizitează Site-ul"** către site. Testat vizual pe desktop și telefon.

**Bug onest găsit și reparat**: varianta ta inițială promitea „te poți dezabona din contul tău, din secțiunea Profil" — dar am verificat codul și **nu există niciun comutator de genul ăsta în profil** (doar adminul poate abona/dezabona pe cineva, din panoul lui). Am înlocuit cu un link de e-mail real și funcțional, care chiar face ce promite. Dacă vrei, pot să construiesc un comutator propriu-zis în profil, ca oamenii să se poată dezabona singuri — spune-mi dacă te interesează.

## Țara contului — reproiectată complet (sesiune curentă)

Rezolvă exact problema semnalată: logica veche ținea cont doar de dispozitiv (localStorage), nu de cont — de-asta, deși ai acceptat locația, putea să nu se vadă pe profil dacă ceva se întrerupea pe parcurs (reverse-geocoding eșuat, sau nu erai încă logat în acel moment).

**Acum**:
- Dacă **ești logat și contul tău are deja o țară salvată** → nu te mai întreabă NICIODATĂ, pe niciun dispozitiv — testat exact acest caz.
- Dacă **ești logat și contul tău NU are țară** → te întreabă, chiar dacă pe alt dispozitiv ai răspuns cândva „nu, mulțumesc" (situația de cont-fără-țară e nouă și merită întrebată din nou) — testat.
- **Opțiune nouă: alegere manuală** — dacă geolocația browserului nu merge sau o refuzi, apare un buton „Aleg manual țara" cu o listă simplă din care alegi — testat, salvează corect atât local cât și pe cont.
- **O singură dată, cu adevărat**: regula din Firebase a fost schimbată să permită scrierea câmpului `country` al propriului cont DOAR dacă nu există deja o valoare — practic imposibil de schimbat din aplicație a doua oară, exact cum ai cerut; doar un admin o poate schimba, direct din baza de date.

## Servicii restrânse + validare completă (sesiune curentă)

„Servicii Dorite" nu mai apare ca listă deschisă (ca la pachete) — e acum un buton cu săgetuță; apeși, se deschide; nu apeși, rămâne ascunsă. Testat vizual, ambele stări.

**Validare completă la trimitere** — nu mai poți trimite cererea până nu completezi TOT, mai puțin „Mesaj sau Alte Detalii" (rămâne opțional, cum ai cerut):
- Lipsește țara → butonul de țară se marchează cu roșu și primește focus
- Niciun serviciu bifat → panoul se deschide singur, cu mesaj clar „Alege cel puțin un serviciu dorit"
- Restul (destinație, nopți, dată, adulți, copii) — validare nativă de browser

Testat complet, pas cu pas: blocare fără țară, blocare fără serviciu, trimitere reușită cu tot completat.

**Bug real găsit și reparat pe parcurs**: existau două câmpuri VECHI, moarte, din o versiune anterioară — „Perioadă Dorită" (text liber) și „Număr de Persoane" (text liber) — complet neconectate la cod (nu se citeau, nu se trimiteau nicăieri), rămase dublate față de câmpurile noi, structurate (Nopți/Dată/Adulți/Copii) pe care le-am construit sesiunea trecută. Le-am eliminat — formularul arată acum curat, fără duplicate confuze.

## Reparație critică: e-mailul care nu se trimitea (sesiune curentă)

**Cauza exactă**: EmailJS NU suportă deloc sintaxa `{{#if}}` (am verificat în documentația lor oficială) — e doar înlocuire simplă de variabile, nu Handlebars complet. Orice `{{#if}}` din template producea exact eroarea „Template: One or more dynamic variables are corrupted".

**Reparat la rădăcină**: am mutat toată logica condițională (destinație/țară/mesaj/detalii călătorie apar-sau-nu) direct în `js/emailnotify.js`, care acum construiește bucățile de HTML corespunzătoare și le trimite gata făcute. Template-ul (`emailjs-template-contact.html`) a fost complet rescris, fără niciun `{{#if}}` — doar `{{variabilă}}` simplă și `{{{variabilă}}}` cu triple-acolade pentru HTML (sintaxă oficială EmailJS, documentată). Testat cu funcția reală din cod (nu o aproximare) — arată identic vizual cu înainte, pentru ambele situații (cerere completă și cerere fără detalii).

**Important**: trebuie să înlocuiești din nou conținutul template-ului din EmailJS cu versiunea nouă din acest fișier — cea veche va continua să dea eroarea „corrupted" oricât ai aștepta.

## Țara se completează automat din profil (sesiune curentă)

Dacă ești logat și contul tău are deja o țară salvată, câmpul „Țară / Cetățenie" din „Trimite Cerere de Ofertă" se completează singur — rămâne editabilă, dacă vrei să specifici alta pentru cererea respectivă. Testat: completare automată corectă, și confirmat că NU suprascrie o alegere manuală deja făcută.

(Nu am găsit câmpuri duplicate la „numărul de persoane” sau „nopți dorite” — au fost deja curățate sesiunea trecută.)

## E-mail reparat din nou, mai robust de data asta (sesiune curentă)

Am găsit un incident real, documentat public, cu exact aceeași eroare EmailJS — care arăta că problema poate veni și din câmpul **„To Email"** din dashboard-ul EmailJS, nu doar din corpul șablonului.

Am refăcut totul mai defensiv: în loc de 3 bucăți de HTML inserate separat în mijlocul unui tabel (risc ca editorul EmailJS să le „repare" structura la salvare), acum e **un singur bloc complet** (`{{{body_html}}}`), construit integral în `js/emailnotify.js`, cu tabele de sine stătătoare — nimic fragmentat.

**Verificat riguros, câmp cu câmp, cu funcția reală din cod**: nume, telefon, e-mail, destinație, țară, mesaj, perioadă, călători, servicii alese, facilități nealese — toate 10 confirmate prezente.

**Te rog verifică și în dashboard-ul EmailJS**, pe lângă conținutul din fișier: câmpul „To Email" trebuie să fie exact `{{to_email}}` — dacă e altceva (sau gol), poate da aceeași eroare „corrupted", indiferent cât de corect e restul șablonului.

## E-mail refăcut complet de la zero (sesiune curentă)

Pentru că eroarea „corrupted” persista și cu variantele anterioare, am renunțat COMPLET la orice sintaxă specială — nici `{{#if}}`, nici triple-acolade `{{{...}}}`. Noul template folosește DOAR variabile simple `{{...}}`, exact ca newsletter-ul care a mers dintotdeauna. Fiecare criteriu are rândul lui, mereu vizibil — dacă nu a fost completat, apare „—” în loc de valoare, nu dispare rândul.

**Dacă tot persistă eroarea** după acest fișier, problema nu mai e în conținutul șablonului (l-am redus la sintaxa minimă posibilă) — verifică în dashboard-ul EmailJS: „To Email” trebuie să fie `{{to_email}}`, și mai ales confirmă că `templateId` din `js/emailjs-config.js` e EXACT id-ul template-ului în care ai lipit conținutul nou.

## Formular „Trimite Cerere de Ofertă” — perioadă reală de calendar (sesiune curentă)

- **„Nopți Dorite” a dispărut** — era un câmp separat, acum eliminat.
- **„Perioadă Dorită” e acum identică cu „Perioadă Estimată” de la pachete** — același calendar dublu (Plecare/Întoarcere), aceeași componentă de cod, exact același aspect.
- **Nu poți alege o dată din trecut** — zilele dinaintea lui azi sunt dezactivate în calendar (de fapt, ca la pachete, nici măcar ziua de azi nu e selectabilă — minim mâine), testat vizual.
- **Țara se completează automat din profil** (reconfirmat că funcționează, neschimbat față de ultima sesiune).

Testat complet: blocare corectă dacă perioada lipsește, trimitere reușită cu toate câmpurile completate — `periodText` arată acum „03/11/2026 – 06/11/2026 (3 nopți)”, construit din calendarul real, nu din text liber.

## Avertismentul „Cursul EUR/RON live nu s-a putut încărca" (sesiune curentă)

Nu era un bug — site-ul gestionează deja perfect această situație (trece automat pe cursul de rezervă, totul funcționează normal). Apare când rețeaua/browserul unui VIZITATOR (ad-blocker, extensie de confidențialitate etc.) blochează cererea către serviciul extern de curs valutar — ceva complet în afara controlului nostru, care nu afectează cu nimic experiența acelui vizitator.

Cum Jurnalul captează doar mesajele de tip „warning"/„error" din consolă, am coborât acest mesaj la un nivel simplu de depanare — nu mai apare deloc în Jurnal, dar rămâne vizibil pentru oricine vrea să investigheze din propria consolă de browser. Testat: cursul de rezervă funcționează identic ca înainte, doar vizibilitatea în Jurnal s-a schimbat.

## Ascuțire și redimensionare pentru ultimele 4 destinații cu poze locale (Herculane, Săcelu, Constanța, Sovata)

Din cele 7 destinații cu poze proprii, doar Cluj-Napoca, Craiova și Timișoara primiseră anterior tratamentul de clarificare (vezi mai sus); celelalte 4 au rămas netratate — asta a fost reparat acum, cu exact același standard: pozele cu latura lungă sub 1280px au fost mărite (Lanczos, factor variabil până la 2.5×, plafonat ca să nu devină neclare) și apoi clarificate cu Unsharp Mask (radius 1.6, percent 130, threshold 2), salvate la calitate 85; cele cu latura lungă peste 1600px au fost doar redimensionate în jos la maximum 1600px; cele deja în intervalul 1280–1600px au rămas neatinse.

- **Băile Herculane**: 12 din 17 poze mărite și clarificate (cea mai mică, 480×480, dusă la 1200×1200), 2 doar redimensionate în jos, 3 lăsate neatinse.
- **Băile Săcelu**: 2 din 14 poze mărite și clarificate, 1 doar redimensionată în jos, 11 lăsate neatinse (erau deja la 1600px).
- **Constanța**: 6 din 15 poze mărite și clarificate, 9 lăsate neatinse.
- **Sovata**: 9 din 15 poze mărite și clarificate, 6 lăsate neatinse.

Niciun nume de fișier nu s-a schimbat (doar conținutul), deci referințele din `js/destinations.js` rămân valide fără nicio altă modificare de cod. Folderele corespunzătoare din `reviews/img/destinations/` au fost sincronizate 1-la-1 cu cele din proiectul principal, ca pe site-ul de recenzii să se vadă aceleași poze clarificate.

## Link-ul hărții din subsol: revenit la nr. 127 (adresa reală, pe coordonate)

O schimbare dintr-o sesiune anterioară, care făcea linkul din subsol și cel din fereastra Street View să deschidă harta pe „nr. 124" (cu textul vizibil rămas tot „nr. 127"), a fost anulată complet, la cerere: ambele linkuri arată din nou spre nr. 127 — cel din subsol caută direct adresa „nr. 127", iar cel din fereastra Street View („Deschide în Google Maps") a fost restaurat la linkul original, pe coordonate GPS (`cbll=45.0379553,23.2863048`), exact cum era înainte de acea schimbare.

## Reducere aleatorie, personală, pentru fiecare cont (sesiune curentă)

Fiecare cont primește automat, o dată la 7-14 zile (interval aleator), o reducere de 2-5% valabilă pentru o fereastră aleatoare de 24-48H, pe o destinație aleasă tot aleator — dar nu cu șanse egale: pachetele mai ieftine au o șansă mai mare de a fi alese decât cele mai scumpe (greutate de selecție = 1 / preț). Cât timp reducerea contului e activă chiar acum, pachetul respectiv apare într-un banner chiar pe prima pagină, cu prețul redus și timpul rămas până expiră.

Site-ul fiind static (fără server/cron), „rularea" se verifică de la sine la fiecare autentificare/încărcare a sesiunii (`js/discount.js`, cuplat la `FVBackend.onAuth`): dacă termenul de reînnoire al reducerii curente a trecut (sau contul nu a avut niciodată una), se trimite automat una nouă. Protecția reală e în regulile bazei de date (`firebase-rules.json`, nodul `users/$uid/discount`): un cont își poate rescrie singur reducerea DOAR când termenul a trecut cu adevărat — nu o poate forța mai des, indiferent ce ar încerca din consola browserului.

Administratorul poate acorda manual aceeași reducere (ales de același algoritm ponderat) oricui, din panoul de utilizatori — dar cu un cooldown de 24H **pe propriul cont de administrator** (nu pe contul căruia i se acordă), impus tot din regulile bazei de date (nodul `adminDiscountCooldown/<uid-administrator>`), printr-o scriere atomică pe două căi deodată (reducerea + ștampila de cooldown): dacă nu au trecut cele 24H, Firebase respinge întreaga scriere, deci limita nu poate fi forțată din aplicație — exact ca la restricția de țară a contului, se poate „reseta" doar editând direct baza de date.

**Reducerea se vede și se aplică și în fereastra pachetului** (nu doar în banner-ul de pe prima pagină): când deschizi exact pachetul pentru care ai reducerea activă, apare un ecuson cu procentul (ex. „-4% reducere"), lângă preț apare prețul vechi tăiat urmat de cel redus, iar reducerea e integrată direct în motorul de calcul (`js/pricing.js`, ca o linie separată „Reducerea ta personală (-X%)", care se adună la celelalte reduceri existente — sejur lung, rezervare din timp etc.) — deci prețul final afișat în estimare, totalul în lei și comanda trimisă în baza de date reflectă cu adevărat reducerea, nu e doar un afișaj. Pentru orice altă destinație (fără reducere activă acum), totul rămâne exact ca până acum.

Testat: distribuția algoritmului ponderat (20.000 de rulări), rularea automată la autentificare (inclusiv faptul că NU se re-rulează cât termenul n-a trecut), apariția/dispariția corectă a banner-ului de pe prima pagină, acordarea manuală din panoul de administrator cu blocarea celei de-a doua acordări cât timp cooldown-ul de 24H e activ, și afișarea corectă a ecusonului + prețului vechi/redus în fereastra pachetului (atât pentru destinația cu reducere activă, cât și confirmarea că o altă destinație rămâne neschimbată).

## Jurnal cu rotație pe priorități, bug-uri reparate, admin pe site-ul de recenzii și filtru de conținut (sesiune curentă)

Sesiune mare, pornită de la jurnalul de server exportat (`feelvoyage-jurnal-server-2026-10-11.csv`, 400 de intrări, citit linie cu linie).

**Bug-urile din jurnal.** Aproape toate avertismentele erau `resource.fail` cu `host: fjun8n.github.io` și `file: "FeelVoyage"` — un „fișier" fără extensie, care nu exista. Cauza: pozele-placeholder scrise `<img src="">`. Un `src` gol nu e „niciun src": browserul îl rezolvă față de adresa paginii curente și cere **pagina însăși** ca imagine, care firește nu e o imagine, deci dă `error`. Reparat în 10 locuri: 7 atribute `src=""` scoase din HTML (`index.html`, `reviews/index.html`) și 3 atribuiri `img.src = ''` din JavaScript înlocuite cu `removeAttribute('src')` (`js/lightbox.js`, `reviews/js/lightbox.js`, `js/country-select.js`), fiecare cu un comentariu care explică de ce, ca să nu reapară.

Al doilea: o intrare `perf.summary` cu `dcl/load/fcp/lcp` de ~17 **minute** și verdict „slab". Nu site-ul era lent — fila fusese trecută în fundal înainte să se încarce, iar browserul amână randarea. Acum `js/logger.js` ține minte dacă pagina a pornit ascunsă (`document.visibilityState`) și, în acest caz, calculează verdictul **doar** din CLS / blocaje lungi / răspuns la atingere (valori de încredere), marcând intrarea cu `backgrounded: true`, ca să se vadă de ce.

Al treilea nu era în jurnal, l-am găsit urmărind codul: `item.priceRon` din `js/destinations.js` era un text fix, scris la mână la crearea pachetului, deci prețul în lei de pe carduri **rămânea vechi** oricât s-ar fi schimbat cursul. Acum se calculează live (`FVPricing.toRON`) în toate cele 4 locuri care îl foloseau, iar `js/app.js` reafișează cardurile și la evenimentul `fv:exchange-rate`, deci suma se actualizează singură când vine cursul nou.

**Un bug real, nedescoperit până acum.** Urmărind același câmp mai departe: `order.priceRon`, pe care `js/emailnotify.js` îl pune în e-mailul de confirmare ca `total_price`, **nu era setat niciodată** la construirea comenzii. Adică în fiecare e-mail de confirmare trimis până acum totalul arăta „1234 EUR (≈ )" — cu suma în lei goală. Reparat în `js/app.js`; a cerut și o regulă nouă în `firebase-rules.json` (nodul `orders/$orderId` are `"$other": { ".validate": false }`, deci un câmp nou **fără** validator ar fi făcut Firebase să respingă **toată** comanda — prins înainte să ajungă în producție).

**Plafonul jurnalului: 300 → 900, cu rotație pe priorități.** Nu se mai șterg „cele mai vechi", ci cele mai puțin importante, în ordine: `debug` → `info` → `warn` → `error`, iar în interiorul unui nivel cele mai vechi primele. Dacă jurnalul se umple **numai** cu atenționări, se șterg și acelea (rămân erorile); dacă se umple numai cu erori, se șterg și ele — altfel jurnalul s-ar bloca plin și n-ar mai intra nimic nou. Aceeași logică în ambele locuri: în browser (`js/logger.js`, plafon 900, plus la depășirea spațiului din localStorage) și pe server (`js/backend.js` → `pruneLogs(cap)`, plafon 1000, rescris de la „mai vechi de N zile" la „plafon + priorități").

**Șabloanele de mail, traduse în engleză.** Două fișiere noi (`emailjs-template-contact-en.html`, `emailjs-template-newsletter-en.html`), traduse integral, cu aceeași structură și aceleași două reguli de aur ca originalele (fără apostrofuri în `style="..."`, fără tabele imbricate mai mult de un nivel — altfel EmailJS dă eroarea „corrupted variables"). Alegerea limbii: **automată** pentru confirmările de comandă (după `order.lang`, care exista deja) și **manuală** pentru newsletter (un comutator RO/EN în panoul de administrator, pentru că limba fiecărui abonat nu e salvată nicăieri). Ambele sunt opționale: dacă lași `templateIdEn` / `updateTemplateIdEn` goale în `js/emailjs-config.js`, totul funcționează exact ca înainte, în română.

**Verificare generală + „friendly" pe toate dispozitivele.** Automatizat: 9 rezoluții (320px → 1920px) × ambele site-uri, plus ferestrele deschise (meniul de telefon, fereastra pachetului, profilul, panoul de utilizatori, jurnalul, autentificarea de admin, mini chatul) la 4 lățimi înguste — **zero** depășiri pe orizontală. Verificat și: zero erori în consolă pe ambele site-uri × 3 stări (nelogat / cont obișnuit / administrator), zero id-uri HTML duplicate, toate cele 308 referințe către poze locale există, niciun link intern „mort". Singura corecție necesară: butonul „X Foto" de pe carduri avea 20px înălțime (sub minimul recomandat de 24px pentru atingere) — acum are ~32px.

**Două bug-uri noi, găsite pe site-ul de recenzii.** `reviews/js/theme.js` și `reviews/js/bugreport.js` sunt copii identice ale fișierelor de pe site-ul principal și își caută traducerile prin `typeof tr === 'function'` — dar pe site-ul de recenzii `tr()` era închisă în IIFE-ul din `app-reviews.js`, deci nu exista global: **ambele rămâneau mereu în română**, în toate cele 5 limbi. Pe lângă asta, comutatorul de limbă de acolo nu trimitea evenimentul `fv:language`, pe care `theme.js` îl ascultă ca să-și reactualizeze eticheta. Reparate amândouă. Și, legat: cheile `bug.*` + `footer.reportBug` (10 texte, tot modulul „Raportează un bug") nu existau în **nicio** limbă, pe **niciunul** din site-uri — adăugate acum în engleză, italiană, spaniolă și franceză.

**Conturi de administrator pe site-ul de recenzii.** Site-ul n-avea deloc autentificare. Acum are, dar **numai** pentru administratori: te conectezi cu un cont care există deja pe FeelVoyage.ro și care e marcat administrator în baza de date — adică exact `admins/<uid>: true`, verificat pe identificatorul contului, fără nicio listă separată de administratori pe acest site. Un cont obișnuit, chiar cu parola corectă, e **deconectat imediat** și primește „acest cont nu are rol de administrator". Fișiere noi: `reviews/js/admin-auth.js` (autentificare + bara de administrator), `reviews/js/logviewer.js`, `reviews/js/ai-reviews.js`, `reviews/js/chat-admin.js`, `reviews/js/logger.js`, `reviews/js/logremote.js`; `reviews/js/backend-reviews.js` a primit partea de autentificare și jurnal. Modulul de autentificare Firebase se încarcă abia la nevoie, deci vizitatorii obișnuiți nu descarcă nimic în plus.

Administratorul primește acolo două lucruri. **Jurnalul propriu al acelui site**, pe un nod separat în baza de date (`reviewsLogs/`, reguli noi în `firebase-rules.json`, identice cu cele de la `logs/`: oricine poate crea o intrare validată, doar administratorul o poate citi sau șterge) — intenționat separat, ca jurnalele celor două site-uri să nu se amestece; din același motiv jurnalul local folosește cheia `fvr_logs`, nu `fv_logs` (cele două site-uri sunt pe aceeași origine `fjun8n.github.io`, deci **împart** localStorage-ul). Fereastra are două file, „Acest dispozitiv" și „Server", fără filele de conturi și rapoarte de bug — acelea rămân pe site-ul principal, unde rapoartele din ambele site-uri se văd oricum într-o singură listă. Și un **mini chat bot** doar pentru el, pe Gemini prin Firebase AI Logic (aceeași configurație care exista deja, nicio cheie nouă), fără restricție de subiect — ca „modul administrator" al chatului principal, dar fără catalog și fără calculator de preț. Bula de chat nu există în pagină pentru nimeni altcineva: se creează la autentificare și dispare complet la deconectare.

**Filtru de conținut indecent (text + poze).** Fișier nou `js/moderation.js`, identic pe ambele site-uri, legat în: recenzii (cele 3 texte + pozele), chatul cu asistentul, mini chatul de administrator, „Raportează un bug" (ambele site-uri), mesajul din formularul de contact, poza de profil și numele contului (care avea deja un filtru propriu, mai mic — acum îl deleagă pe cel comun).

Textul: listă în cele 5 limbi ale site-ului plus germană, rusă transliterat, turcă, maghiară și arabă transliterat. Normalizarea prinde și variantele deghizate: fără diacritice, litere repetate („puuulaaa"), cifre în loc de litere („p0rn", „5hit"), litere despărțite cu semne („p.u.l.a", „f-u-c-k") și câteva substituții de litere („fvck"). Potrivirea se face pe **cuvinte întregi**, nu pe bucăți — altfel „curat", „curs", „curte" sau „Constanța" ar fi respinse degeaba; doar câteva rădăcini fără echivoc se caută și în interiorul cuvintelor. Am testat ambele direcții: 37 de texte care **trebuie** blocate și 22 de texte curate (românești, engleze, franceze, italiene, spaniole) care **trebuie** să treacă.

Pozele: se verifică cu Gemini înainte de a fi adăugate — modelul se uită la imagine și spune dacă are nuditate, conținut sexual, violență grafică **sau scris indecent în imagine** (exact cazul „poze cu scrisuri indecente"). Dacă verificarea nu poate rula (fără internet, limită depășită), poza **nu** se trimite și omul primește un mesaj că poate reîncerca — am ales intenționat varianta asta, pentru că o poză nepotrivită publicată costă mai mult decât o încărcare amânată un minut. În plus, recenziile sunt filtrate **și la afișare**, pe ambele site-uri: una mai veche, scrisă înainte de filtru, nu mai apare (nu se șterge nimic din baza de date — doar nu se afișează, iar tu o vezi și o poți șterge din panou).

**Ce poate și ce nu poate filtrul — fără înflorituri.** Verificarea rulează în browser. Pentru folosirea normală a site-ului e o barieră reală: nimeni nu poate trimite din interfață un text obscen sau o poză indecentă. Dar **nu** e o barieră de securitate: cine se pricepe poate ocoli orice cod din browser. Site-ul fiind static (GitHub Pages + Firebase), regulile bazei de date pot verifica doar forma datelor (tip, lungime, prefixul `data:image/`), nu înțelesul unui text sau conținutul unei poze; o barieră de neocolit ar cere o funcție pe server (Firebase Cloud Functions, plan plătit). Până atunci cele două niveluri reale sunt filtrul de aici plus verificarea ta ca administrator (jurnalul + posibilitatea de a șterge orice recenzie). Scris și în capul fișierului `js/moderation.js`, ca să rămână clar peste șase luni.

**Testat** (14 fișiere de test, toate trec): filtrul de text în ambele direcții (67 de cazuri); legarea filtrului în recenzii / chat / rapoarte / contact / afișare (23 + 4 + 9 verificări); fluxul complet de administrator pe site-ul de recenzii — vizitator anonim care nu vede nimic, parolă greșită, cont valid dar **neadministrator** respins, administrator cu acces complet, jurnalul (cele două file, intrările de pe server, explicațiile prietenoase, extinderea unui rând, închiderea cu Escape), mini chatul și dispariția completă a tot la deconectare (38 de verificări); responsive pe 9 rezoluții × 2 site-uri + ferestrele deschise la 4 lățimi înguste; rotația jurnalului pe cele 3 scenarii (plin de info / numai atenționări / numai erori); plus suita de regresie existentă (reducerile, bug-urile din jurnal, cursul live). Verificat și că nu există regresii: cele două teste mai vechi care pică (`test_contact.py`, `test_cruises.py`) pică **identic** și pe copia nemodificată a proiectului — unul are un port vechi scris în el, celălalt folosește un mod de simulare care nu mai deblochează câmpurile.

## Estimare de preț la cererea de ofertă, texte scrise ca de om, newsletter pe limba fiecăruia (sesiune curentă)

**Litere mici, ca în română.** În română (și în italiană, franceză, spaniolă) majuscula se pune doar la începutul propoziției și după `.` `!` `?` — nu la fiecare cuvânt, ca în engleză. Am trecut 173 de texte de interfață la forma corectă: „Trimite o solicitare de ofertă", „Destinații & pachete", „Despre noi", „Nume complet", „Buget max. (€)". **Engleza a rămas Title Case**, pentru că acolo e corect gramatical la titluri și butoane — altfel textele ar fi arătat neîngrijit unui vorbitor nativ.

Nu am făcut-o cu un „lowercase" pe tot: ar fi distrus numele proprii. Am construit un dicționar din textele proprii ale site-ului — un cuvânt care apare măcar o dată cu literă mică e substantiv comun, deci poate fi trecut la mic; unul care apare mereu cu majusculă e tratat ca nume propriu și rămâne neatins — plus o listă explicită de protejat (branduri, acronime, cele 192 de țări, numele proprii din toate titlurile catalogului). Previzualizarea a prins patru greșeli pe care altfel le-aș fi scris în site: „Popescu" devenea „popescu" (apare cu literă mică în exemplul `ion.popescu@email.ro`, deci dicționarul îl credea substantiv comun), „Bonjour ! 👋 **Je**" devenea „je" (emoji-ul dintre semnul de punctuație și cuvânt păcălea detectarea începutului de propoziție), bulina „•" era ștearsă chiar de curățarea care trebuia s-o folosească drept semnal, iar „Autoritatea **Națională** pentru Protecția Consumatorilor" (numele oficial al ANPC) ar fi fost stricat. **Nu am atins conținutul destinațiilor** (titluri, descrieri, facilități) și nici textele lungi din chat și întrebări frecvente: acelea sunt nume și etichete, nu proză — „Timișoara - Le Marché de Noël de la Place de la Victoire" sau „la Petite France" arătau mai rău trecute la litere mici, nu mai bine.

**Estimare de preț la „Trimite o solicitare de ofertă".** Scrii o localitate și, deasupra butonului de trimitere, apare o estimare: zbor, cazare pe nopțile alese, serviciile bifate, total în euro și în lei, plus prețul pe persoană. Se reface singură când schimbi perioada, numărul de călători sau serviciile.

**De unde vine prețul — și de ce nu dintr-un API de zboruri.** Ai cerut un API care să scaneze prețurile din toată lumea. Nu se poate de pe site-ul acesta, și nu din lipsă de efort: API-urile reale (Amadeus, Travelpayouts, Booking) cer o cheie care trebuie să rămână **secretă**, iar orice cheie pusă în JavaScript e publică — o vede oricine deschide fișierul și ți-o poate consuma; pe lângă asta, aproape toate refuză cererile venite direct din browser (CORS), fiind făcute server-la-server. Pe un site static nu există unde să ascunzi cheia. Așa că estimarea se calculează din datele **noastre**, care sunt prețuri reale:

- **zborul** — catalogul are, pentru fiecare dintre cele 92 de pachete, un preț real de zbor dus-întors, cercetat manual (`flightPriceRT`). Pentru cele 43 de țări în care zburăm deja se folosește exact media prețurilor reale pentru țara aceea. Pentru restul lumii, o curbă potrivită pe aceleași prețuri reale, în funcție de distanța de la București. Curba e pe două segmente, pentru că prima încercare pe unul singur dădea rezultate absurde: zborurile low-cost din Europa sunt aproape independente de distanță (Londra 90 € la 2082 km, dar Istanbul 100 € la 461 km), așa că un singur model estima Turcia la 19 € și Anglia la 201 €. Cu pragul la 2000 km, eroarea medie a scăzut de la 64 € la 59 €, iar cazurile extreme s-au reparat;
- **cazarea** — tot din catalog: prețul de teren pe noapte, mediat pe țară unde avem pachete, altfel pe regiune;
- **restul** (nopți, copii, sezon, cameră single, serviciile bifate) nu se recalculează separat: se construiește o destinație „sintetică" și se trece prin motorul de preț existent (`js/pricing.js`), exact cel folosit la pachetele din catalog — deci estimarea rămâne consecventă cu tot restul site-ului.

Localitatea se identifică prin Nominatim (OpenStreetMap): gratuit, fără cheie, merge din browser, și e deja folosit de `js/geo.js`. Dacă nu răspunde, nu se blochează nimic — cererea se trimite ca până acum și o calculezi tu. Dacă vrei prețuri live mai târziu, se schimbă **o singură funcție** (`priceSource` din `js/estimate.js`): pui acolo un fetch către propria funcție Firebase (Cloud Functions, plan Blaze), care ține cheia API ascunsă pe server. Restul fișierului și toată interfața rămân neschimbate.

**Blocator de țară + sugestie pentru ce avem deja.** La „Destinație dorită" o țară e respinsă cu explicație („scrie un oraș sau o localitate, nu o țară — de exemplu «Paris», nu «Franța»"), pentru că dintr-o țară nu se poate estima nimic serios: Franța poate însemna Paris sau un sat din Normandia, cu prețuri complet diferite. Verificarea e dublă: instantaneu, local, pe lista de 192 de țări a site-ului (deci merge și fără internet), iar pentru ce scapă listei, din răspunsul geocodării (`addresstype = country`) — așa se prinde și „Kiribati". Cererea nu poate fi trimisă cu o țară nici forțat. Iar dacă locul scris e deja în catalog, apare un text care spune asta și un buton care deschide pachetul existent — fără să te blocheze, poate vrea totuși altceva.

**Estimarea ajunge și la tine în mail.** Cifra exactă pe care a văzut-o clientul înainte să trimită, plus din ce e compusă (loc, nopți, zbor pe adult, cazare pe noapte, dacă prețul a venit din catalog sau din curbă), în ambele șabloane de ofertă. A cerut și opt validatori noi în `firebase-rules.json`: nodul `contactRequests` are `"$other": { ".validate": false }`, deci un câmp nou fără validator ar fi făcut Firebase să respingă **toată** cererea — aceeași capcană prinsă și la `priceRon` în sesiunea trecută.

**Newsletter pe limba fiecăruia.** Scrii anunțul o singură dată, în română. Limba fiecărui abonat se deduce din țara contului lui (Franța → franceză, Italia → italiană, Spania și America Latină → spaniolă, România și Moldova → română, restul → engleză), mesajul se traduce automat cu Gemini (`js/translate.js`, aceeași configurație AI care exista deja — nicio cheie nouă) și fiecare primește șablonul limbii lui. Traducerea se cere **o singură dată** pentru toate limbile necesare, nu o dată per abonat. În panou vezi înainte de trimitere pe ce limbi va pleca („3 × RO, 2 × EN, 1 × FR"), iar la final raportul pe limbi.

Trei șabloane noi (`emailjs-template-newsletter-it/fr/es.html`). Nu trebuie să le adaugi pe toate deodată: ce lași gol în `js/emailjs-config.js` cade pe șablonul englez, iar dacă nici acela nu e completat, pe cel românesc — textul tradus pleacă oricum. Dacă traducerea eșuează (fără internet, limită depășită), fiecare primește textul original: newsletterul pleacă, în cel mai rău caz în limba în care l-ai scris.

**Testat** (16 fișiere, toate trec): potrivirile țară→limbă (12 cazuri), rutarea pe limbi și pe șabloane la trimitere, inclusiv rezervele (japonezul primește engleză; spaniolul primește text tradus dar șablonul englez dacă cel spaniol nu e completat; cine n-are țară salvată primește limba în care ai scris), faptul că traducerea se cere o singură dată, compatibilitatea cu apelul vechi; estimarea pe 8 scenarii (țară respinsă din listă locală, țară respinsă din geocodare, destinație deja în catalog, oraș nou cu estimare completă, refacerea la schimbarea serviciilor și a călătorilor, loc inexistent, estimarea ajunsă în cerere, țară care nu poate fi trimisă nici forțat); plus toată suita existentă. Două „erori" raportate de teste s-au dovedit comportament corect: bifarea transportului nu schimbă totalul (e **inclus** la destinațiile din afara României), iar Barcelona nu dă estimare pentru că **e** în catalog, deci intră pe ramura „avem deja pachet".

**Ce rămâne la tine:** publică regulile noi din `firebase-rules.json` în Firebase Console (au apărut cele opt câmpuri `estimate*`) — altfel cererile de ofertă care conțin o estimare vor fi respinse în întregime. Șabloanele de newsletter în italiană/franceză/spaniolă le adaugi când vrei; până atunci totul merge cu rezervele descrise mai sus.

### Completare: newsletterul merge după limba ȚĂRII din cont (sesiune curentă)

Am încercat mai întâi varianta „după limba pe care omul o are aleasă pe site" (ar fi cerut salvarea limbii pe cont, un câmp nou și o regulă nouă în baza de date). Nu e ce voiai: limba se ia **din țara salvată pe cont**, deci am dat înapoi acea schimbare și am scos și salvarea limbii — altfel ar fi rămas cod care scrie degeaba în baza de date un câmp pe care nimic nu-l citește.

**Cum se alege limba fiecărui abonat:**
1. limba țării salvate pe contul lui (Franța → franceză, Italia → italiană, Spania și America Latină → spaniolă, România și Moldova → română, orice altă țară → engleză);
2. dacă pe cont nu e salvată nicio țară, limba în care ai scris tu anunțul.

Limba în care scrii tu e doar punctul de pornire al traducerii — nu ajunge la nimeni care are țara salvată pe cont. Scrii în engleză, iar un abonat cu România pe cont primește română. Cine are deja limba în care ai scris primește textul original, netradus, nu o traducere dus-întors.

În panou scrie și limba de pornire („Îl scrii o dată, în EN; fiecare îl primește pe limba țării din contul lui: 3 × RO, 2 × EN, 1 × FR"), iar limba de pornire e cea în care folosești tu site-ul în acel moment, nu română fixă.

Țara ajunge pe cont prin geolocalizare (`js/geo.js`) sau pentru că omul a ales-o în formularul de ofertă — deci pentru majoritatea conturilor există deja. Cine n-are țară salvată primește limba în care ai scris, ca înainte.

**Testat** (22 de verificări): că ȚARA decide și limba de pe cont nu mai e luată în seamă (6 combinații, inclusiv o țară fără limbă proprie pe site, care cade corect pe engleză); trimiterea către 9 abonați, din care doi aveau pe cont și o limbă diferită de țara lor — amândoi primesc limba țării; același lucru scriind anunțul în engleză (traducerea se cere din engleză în ro+fr, iar cel din Anglia primește textul original); plus compatibilitatea cu apelul vechi, pe o listă simplă de e-mailuri.
