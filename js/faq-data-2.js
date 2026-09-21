/* FeelVoyage — răspunsuri preprogramate, partea 2: prețuri, servicii extra, recomandări din catalog.
   Intrările cu „dyn", „cats" sau „list" adaugă sub text o listă calculată din js/destinations.js (prețuri reale, actualizate automat). */
(function (root) {
    'use strict';
    const F = root.FVFAQ;
    if (!F) return;

    F.register([

        /* ==================================================== PREȚURI ȘI CALCULATOR ==================================================== */
        { id: 'price-ranges', defer: true, dyn: 'ranges', next: ['price-from', 'budget', 'extras'],
          ro: { t: '💰 Prețuri', k: ['preturi', 'pretul', 'cat costa', 'tarife', 'cat costa o vacanta', 'preturile', 'costuri', 'cat ma costa'], a: `Prețurile depind de destinație, sezon, durată și numărul de persoane. „De la” înseamnă **per adult, în cameră dublă**. Ca reper:` },
          en: { t: '💰 Prices', k: ['prices', 'price', 'how much', 'how much does it cost', 'cost', 'rates', 'how much is a holiday'], a: `Prices depend on the destination, season, length and number of travellers. "From" means **per adult, in a double room**. As a guide:` },
          it: { t: '💰 Prezzi', k: ['prezzi', 'prezzo', 'quanto costa', 'costi', 'tariffe', 'quanto costa una vacanza'], a: `I prezzi dipendono da destinazione, stagione, durata e numero di viaggiatori. "Da" significa **a persona, in camera doppia**. Come riferimento:` } },

        { id: 'price-from', next: ['season-price', 'nights-flex', 'extras'],
          ro: { t: '❓ Ce înseamnă „de la”?', k: ['ce inseamna de la', 'de la pret', 'pret de la', 'pretul afisat', 'ce inseamna pretul', 'pret pe persoana', 'pretul din card'], a: `Prețul „de la” din card este **per adult**, în **cameră dublă**, în **sezon redus** și pentru **durata standard** a pachetului. Pentru totalul tău, deschide pachetul și alege persoanele, datele și serviciile: estimarea se recalculează pe loc.` },
          en: { t: '❓ What does "from" mean?', k: ['what does from mean', 'from price', 'displayed price', 'price per person', 'what does the price mean', 'the price on the card'], a: `The "from" price on the card is **per adult**, in a **double room**, in **low season** and for the package's **standard length**. For your own total, open the package and choose people, dates and extras: the estimate recalculates instantly.` },
          it: { t: '❓ Cosa significa "da"?', k: ['cosa significa da', 'prezzo da', 'prezzo indicato', 'prezzo a persona', 'cosa significa il prezzo', 'il prezzo nella scheda'], a: `Il prezzo "da" nella scheda è **a persona adulta**, in **camera doppia**, in **bassa stagione** e per la **durata standard** del pacchetto. Per il tuo totale, apri il pacchetto e scegli persone, date e servizi: la stima si ricalcola subito.` } },

        { id: 'single', next: ['kids-price', 'price-from'],
          ro: { t: '🛏️ Cameră single', k: ['supliment single', 'camera single', 'calatoresc singur', 'o singura persoana', 'singur', 'supliment camera', 'calatorie solo', 'sunt singur'], a: `Adultul care călătorește singur în cameră plătește un **supliment de cameră single** (pe noapte, în funcție de destinație). La 3 adulți, unul plătește supliment; cu un copil în cameră nu se aplică. Estimarea din fereastra pachetului îl calculează automat.` },
          en: { t: '🛏️ Single room', k: ['single supplement', 'single room', 'travelling alone', 'one person', 'solo traveller', 'traveling alone', 'i am alone'], a: `An adult travelling alone in a room pays a **single-room supplement** (per night, depending on the destination). With 3 adults, one pays the supplement; with a child in the room it doesn't apply. The estimate in the package window calculates it automatically.` },
          it: { t: '🛏️ Camera singola', k: ['supplemento singola', 'camera singola', 'viaggio da solo', 'una persona', 'viaggiatore singolo', 'sono solo'], a: `L'adulto che viaggia da solo in camera paga un **supplemento camera singola** (a notte, in base alla destinazione). Con 3 adulti, uno paga il supplemento; con un bambino in camera non si applica. La stima nella finestra del pacchetto lo calcola automaticamente.` } },

        { id: 'kids-price', next: ['single', 'travelers-how', 'kids-travel'],
          ro: { t: '🧒 Prețuri copii', k: ['pret copii', 'reducere copii', 'tarif copil', 'copil sub 5 ani', 'bebelus', 'copii gratis', 'pretul pentru copii', 'cat platesc pentru copil', 'cat costa un copil', 'cat costa copilul', 'cat costa pentru copii'], a: `Copiii plătesc un procent din prețul adultului, după vârstă: **România** 40% (0–4 ani) și 70% (5–12 ani); **city break, plajă, munte** 65% și 85%; **exotice și Asia** 75% și 85%. Copilul cazat cu **un singur adult** plătește preț întreg.` },
          en: { t: '🧒 Children\'s prices', k: ['children price', 'kids price', 'child discount', 'child rate', 'baby', 'kids free', 'infant', 'price for a child', 'how much for a child', 'price for children', 'how much do children pay'], a: `Children pay a percentage of the adult price by age: **Romania** 40% (0–4) and 70% (5–12); **city breaks, beach, mountains** 65% and 85%; **exotic and Asia** 75% and 85%. A child sharing a room with **only one adult** pays the full price.` },
          it: { t: '🧒 Prezzi bambini', k: ['prezzo bambini', 'sconto bambini', 'tariffa bambini', 'neonato', 'bambini gratis', 'prezzo per un bambino', 'quanto costa un bambino', 'quanto pagano i bambini', 'prezzo per i bambini', 'prezzo per bambini', 'prezzi per bambini'], a: `I bambini pagano una percentuale del prezzo adulto in base all'età: **Romania** 40% (0–4) e 70% (5–12); **city break, mare, montagna** 65% e 85%; **esotiche e Asia** 75% e 85%. Un bambino in camera con **un solo adulto** paga il prezzo intero.` } },

        { id: 'season-price', next: ['dates-how', 'price-from'],
          ro: { t: '🌞 Sezon și prețuri', k: ['sezon', 'sezon inalt', 'sezon redus', 'pret vara', 'pret iarna', 'de ce e mai scump', 'cand e mai ieftin', 'cel mai ieftin moment', 'cand costa mai putin'], a: `Prețul „de la” e pentru **sezon redus**. În lunile de vârf prețul crește (de ex.: la mare în iulie–august, la schi în decembrie, la city break în decembrie și primăvara). Alege data plecării în calendarul pachetului ca să vezi suplimentul exact.` },
          en: { t: '🌞 Season and prices', k: ['high season', 'low season', 'season price', 'summer price', 'winter price', 'why more expensive', 'when is cheaper', 'cheapest time', 'when is it cheapest'], a: `The "from" price is for **low season**. In peak months the price rises (e.g. at the seaside in July–August, skiing in December, city breaks in December and spring). Pick your departure date in the package calendar to see the exact supplement.` },
          it: { t: '🌞 Stagione e prezzi', k: ['alta stagione', 'bassa stagione', 'prezzo estate', 'prezzo inverno', 'perche costa di piu', 'quando costa meno', 'periodo piu economico'], a: `Il prezzo "da" è per la **bassa stagione**. Nei mesi di punta il prezzo sale (es. al mare a luglio–agosto, sci a dicembre, city break a dicembre e in primavera). Scegli la data di partenza nel calendario del pacchetto per vedere il supplemento esatto.` } },

        { id: 'extras', next: ['insurance', 'transfer', 'tickets-extra'],
          ro: { t: '➕ Servicii extra', k: ['servicii extra', 'servicii suplimentare', 'optiuni extra', 'costuri suplimentare', 'ce pot adauga', 'extra', 'optiuni', 'adaugiri'], a: `În fereastra pachetului alegi serviciile extra: **transfer aeroport–hotel**, **upgrade de masă**, **bilete la atracții**, **asigurare de călătorie**, **ghid local**, **închiriere auto** (și transport cu autocar la pachetele din România). Unele sunt deja incluse; prețul fiecăruia apare lângă serviciu.` },
          en: { t: '➕ Extra services', k: ['extras', 'extra services', 'add ons', 'options', 'additional services', 'what can i add'], a: `In the package window you choose extras: **airport–hotel transfer**, **meal upgrade**, **attraction tickets**, **travel insurance**, **local guide**, **car rental** (and coach transport on Romanian packages). Some are already included; each one's price appears next to it.` },
          it: { t: '➕ Servizi extra', k: ['servizi extra', 'servizi aggiuntivi', 'opzioni', 'extra', 'cosa posso aggiungere', 'costi aggiuntivi'], a: `Nella finestra del pacchetto scegli i servizi extra: **transfer aeroporto–hotel**, **upgrade dei pasti**, **biglietti per le attrazioni**, **assicurazione di viaggio**, **guida locale**, **noleggio auto** (e trasporto in pullman sui pacchetti in Romania). Alcuni sono già inclusi; il prezzo di ciascuno appare accanto.` } },

        { id: 'nights-flex', next: ['dates-how', 'fixed-tours'],
          ro: { t: '🌙 Câte nopți?', k: ['cate nopti', 'durata sejurului', 'pot prelungi', 'mai multe nopti', 'sejur mai lung', 'sejur mai scurt', 'nopti', 'durata vacantei'], a: `La pachetele flexibile poți alege între **2 și 14 nopți** (5–21 la exotice și Asia). Prețul se ajustează: o parte (zborul) e fixă, restul crește cu fiecare noapte. Alege datele în calendar și vezi estimarea.` },
          en: { t: '🌙 How many nights?', k: ['how many nights', 'length of stay', 'extend', 'more nights', 'longer stay', 'shorter stay', 'nights', 'how long can i stay'], a: `On flexible packages you can choose between **2 and 14 nights** (5–21 for exotic and Asia). The price adjusts: part of it (the flight) is fixed, the rest grows with each night. Pick your dates in the calendar to see the estimate.` },
          it: { t: '🌙 Quante notti?', k: ['quante notti', 'durata del soggiorno', 'prolungare', 'piu notti', 'soggiorno piu lungo', 'notti', 'quanto posso restare'], a: `Nei pacchetti flessibili puoi scegliere tra **2 e 14 notti** (5–21 per esotiche e Asia). Il prezzo si adegua: una parte (il volo) è fissa, il resto cresce a ogni notte. Scegli le date nel calendario per vedere la stima.` } },

        { id: 'fixed-tours', dyn: 'fixed', next: ['nights-flex', 'guide'],
          ro: { t: '🧭 Circuite cu durată fixă', k: ['circuit', 'circuite', 'durata fixa', 'tur ghidat', 'tururi ghidate'], a: `Circuitele ghidate au **durată fixă**, iar data întoarcerii se calculează singură. Acestea sunt:` },
          en: { t: '🧭 Fixed-length tours', k: ['tour', 'tours', 'fixed length', 'guided tour', 'guided tours', 'circuit'], a: `Guided tours have a **fixed length** and the return date is calculated automatically. They are:` },
          it: { t: '🧭 Tour a durata fissa', k: ['tour', 'circuito', 'circuiti', 'durata fissa', 'tour guidato', 'tour guidati'], a: `I tour guidati hanno **durata fissa** e la data di ritorno si calcola da sola. Sono:` } },

        { id: 'price-currency', next: ['price-from', 'money'],
          ro: { t: '💱 Euro sau lei?', k: ['euro sau lei', 'in ce moneda sunt preturile', 'curs 5 lei', 'preturile in euro', 'preturi in lei', 'moneda preturilor', 'in lei'], a: `Prețurile se afișează în **EUR** și în **lei** (curs de referință: 5 lei = 1 €). Suma finală, în lei sau euro, ți-o confirmă consultantul.` },
          en: { t: '💱 Euro or lei?', k: ['euro or lei', 'which currency are the prices', 'prices in euro', 'prices in lei', 'price currency', 'in lei'], a: `Prices are shown in **EUR** and in **lei** (reference rate: 5 lei = 1 €). Your consultant confirms the final amount, in lei or euro.` },
          it: { t: '💱 Euro o lei?', k: ['euro o lei', 'in che valuta sono i prezzi', 'prezzi in euro', 'prezzi in lei', 'valuta dei prezzi', 'in lei'], a: `I prezzi sono mostrati in **EUR** e in **lei** (cambio di riferimento: 5 lei = 1 €). L'importo finale, in lei o in euro, te lo conferma il consulente.` } },

        { id: 'hidden-fees', next: ['price-includes', 'insurance'],
          ro: { t: '🔎 Taxe și costuri ascunse', k: ['comisioane ascunse', 'taxe ascunse', 'costuri ascunse', 'taxe suplimentare', 'taxa de oras', 'taxa turistica', 'ce nu include pretul', 'alte costuri'], a: `Prețul afișat nu are comisioane ascunse. Estimarea **nu include** cheltuielile personale, **taxele locale de oraș** (unde se aplică) și intrările sau excursiile opționale neselectate. Oferta finală o confirmă un consultant.` },
          en: { t: '🔎 Fees and hidden costs', k: ['hidden fees', 'hidden costs', 'extra charges', 'city tax', 'tourist tax', 'what is not included', 'other costs'], a: `The displayed price has no hidden commissions. The estimate **doesn't include** personal expenses, **local city taxes** (where they apply) and optional entries or excursions you haven't selected. A consultant confirms the final offer.` },
          it: { t: '🔎 Tasse e costi nascosti', k: ['costi nascosti', 'commissioni nascoste', 'tassa di soggiorno', 'tassa turistica', 'cosa non e incluso', 'altri costi'], a: `Il prezzo mostrato non ha commissioni nascoste. La stima **non include** spese personali, **tasse di soggiorno locali** (dove previste) e ingressi o escursioni opzionali non selezionati. L'offerta finale la conferma un consulente.` } },

        { id: 'cheapest', dyn: 'cheapest', next: ['budget', 'price-ranges'],
          ro: { t: '🏷️ Cele mai ieftine', k: ['cea mai ieftina', 'cel mai ieftin', 'cele mai ieftine', 'pachete ieftine', 'vacante ieftine', 'pret mic', 'low cost', 'buget mic', 'cele mai accesibile'], a: `Cele mai accesibile pachete (prețul „de la”, per adult):` },
          en: { t: '🏷️ Cheapest', k: ['cheapest', 'cheap', 'lowest price', 'affordable', 'budget friendly', 'low cost', 'most affordable'], a: `Our most affordable packages ("from" price, per adult):` },
          it: { t: '🏷️ Più economici', k: ['piu economico', 'i piu economici', 'prezzo piu basso', 'a buon prezzo', 'low cost', 'piu convenienti'], a: `I nostri pacchetti più convenienti (prezzo "da", a persona):` } },

        { id: 'priciest', dyn: 'priciest', next: ['cheapest', 'romantic'],
          ro: { t: '💎 De lux', k: ['cea mai scumpa', 'cel mai scump', 'cele mai scumpe', 'de lux', 'lux', 'premium', 'exclusivist', 'cel mai bun'], a: `Cele mai exclusiviste (și mai scumpe) pachete:` },
          en: { t: '💎 Luxury', k: ['most expensive', 'luxury', 'premium', 'high end', 'deluxe', 'the best one'], a: `Our most exclusive (and priciest) packages:` },
          it: { t: '💎 Di lusso', k: ['piu costoso', 'di lusso', 'lusso', 'premium', 'esclusivo', 'il migliore'], a: `I nostri pacchetti più esclusivi (e cari):` } },

        { id: 'budget', dyn: 'budget', next: ['cheapest', 'price-ranges', 'weekend'],
          ro: { t: '🎯 După buget', k: ['buget*', 'am buget', 'am doar', 'am la dispozitie', 'imi permit', 'cu cat pot', 'sub', 'pana la', 'maxim'], a: `Spune-mi ce buget ai.` },
          en: { t: '🎯 By budget', k: ['budget', 'i have', 'i can spend', 'under', 'up to', 'no more than', 'max'], a: `Tell me your budget.` },
          it: { t: '🎯 Per budget', k: ['budget', 'ho a disposizione', 'posso spendere', 'sotto', 'fino a', 'massimo'], a: `Dimmi il tuo budget.` } },

        { id: 'discounts', next: ['facebook', 'request-offer'],
          ro: { t: '🎁 Reduceri și promoții', k: ['reduceri', 'promotii', 'oferte speciale', 'discount', 'early booking', 'last minute', 'cupon', 'cod de reducere', 'oferta', 'oferte'], a: `Promoțiile și noutățile apar pe [pagina noastră de Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr). Prețurile din site sunt cele de bază (sezon redus); pentru o ofertă personalizată în maximum 24 de ore, trimite formularul din **Contact** sau sună la **{phone}**.` },
          en: { t: '🎁 Discounts and offers', k: ['discounts', 'promotions', 'special offers', 'deals', 'early booking', 'last minute', 'coupon', 'promo code', 'offers'], a: `Promotions and news appear on [our Facebook page](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr). Prices on the site are the base ones (low season); for a personalised offer within 24 hours, send the **Contact** form or call **{phone}**.` },
          it: { t: '🎁 Sconti e promozioni', k: ['sconti', 'promozioni', 'offerte speciali', 'last minute', 'coupon', 'codice sconto', 'offerte', 'prenota in anticipo'], a: `Promozioni e novità compaiono sulla [nostra pagina Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr). I prezzi sul sito sono quelli base (bassa stagione); per un'offerta personalizzata entro 24 ore, invia il modulo **Contatti** o chiama il **{phone}**.` } },

        { id: 'price-includes', defer: true, next: ['extras', 'hidden-fees', 'flight-included'],
          ro: { t: '📋 Ce include prețul?', k: ['ce include pretul', 'ce e inclus', 'ce include pachetul', 'ce este inclus', 'ce contine', 'pretul include', 'ce include'], a: `Depinde de pachet: în fereastra pachetului vezi lista **Include** și marcajul **Inclus** la servicii. La pachetele din afara României **zborul este inclus**; în România nu. Nu sunt incluse cheltuielile personale, taxele locale și opționalele neselectate.` },
          en: { t: '📋 What does the price include?', k: ['what is included', 'what does the price include', 'package includes', 'what s included', 'what is in the price', 'what does it include'], a: `It depends on the package: in the package window you see the **Includes** list and the **Included** tag on services. On packages outside Romania the **flight is included**; in Romania it isn't. Personal expenses, local taxes and unselected optional items aren't included.` },
          it: { t: '📋 Cosa include il prezzo?', k: ['cosa e incluso', 'cosa include il prezzo', 'cosa comprende', 'il pacchetto include', 'cosa include', 'cosa e compreso'], a: `Dipende dal pacchetto: nella finestra del pacchetto vedi l'elenco **Include** e l'etichetta **Incluso** sui servizi. Nei pacchetti fuori dalla Romania il **volo è incluso**; in Romania no. Non sono incluse spese personali, tasse locali e opzioni non selezionate.` } },

        { id: 'insurance', topic: true, next: ['docs', 'vaccines', 'safety'],
          ro: { t: '🛡️ Asigurare de călătorie', k: ['asigurare', 'asigurare de calatorie', 'asigurare medicala', 'storno', 'fara asigurare', 'asigurari'], a: `**Asigurarea de călătorie** și asistența medicală sunt opționale în orice pachet (le adaugi ca serviciu extra, calculat pe persoană și zi). O recomandăm mereu, mai ales în afara UE. În UE poți avea și cardul european de sănătate, dar acesta nu acoperă tot (ex. repatrierea).` },
          en: { t: '🛡️ Travel insurance', k: ['insurance', 'travel insurance', 'medical insurance', 'cancellation insurance', 'do i need insurance'], a: `**Travel insurance** and medical assistance are optional on any package (you add them as an extra, priced per person and day). We always recommend it, especially outside the EU. Within the EU you may also have the European health card, but it doesn't cover everything (e.g. repatriation).` },
          it: { t: '🛡️ Assicurazione di viaggio', k: ['assicurazione', 'assicurazione di viaggio', 'assicurazione medica', 'assicurazione annullamento', 'serve l assicurazione'], a: `L'**assicurazione di viaggio** e l'assistenza medica sono opzionali su ogni pacchetto (si aggiungono come extra, calcolate a persona e al giorno). La consigliamo sempre, soprattutto fuori dall'UE. Nell'UE puoi avere anche la tessera sanitaria europea, ma non copre tutto (es. il rimpatrio).` } },

        { id: 'tickets-extra', topic: true, next: ['extras', 'guide'],
          ro: { t: '🎫 Bilete la atracții', k: ['bilete la atractii', 'bilete', 'intrari', 'tichete muzee', 'fast track', 'bilete muzee'], a: `Biletele la atracții pot fi adăugate ca **serviciu extra** (per persoană, în funcție de destinație și durată). Unele pachete includ deja o intrare, de exemplu Roma: **Colosseum Fast-Track**.` },
          en: { t: '🎫 Attraction tickets', k: ['attraction tickets', 'tickets', 'entrance fees', 'museum tickets', 'fast track', 'entry tickets'], a: `Attraction tickets can be added as an **extra service** (per person, depending on the destination and length). Some packages already include an entry, e.g. Rome: **Colosseum Fast-Track**.` },
          it: { t: '🎫 Biglietti attrazioni', k: ['biglietti attrazioni', 'biglietti', 'ingressi', 'biglietti musei', 'fast track', 'biglietti d ingresso'], a: `I biglietti per le attrazioni si possono aggiungere come **servizio extra** (a persona, in base a destinazione e durata). Alcuni pacchetti includono già un ingresso, ad esempio Roma: **Colosseo Fast-Track**.` } },

        { id: 'car-rental', topic: true, next: ['transfer', 'extras'],
          ro: { t: '🚗 Închiriere auto', k: ['inchiriere auto', 'inchiriez masina', 'masina', 'rent a car', 'autoturism', 'inchiriere masina'], a: `**Închirierea auto** se adaugă ca serviciu extra (preț pe zi și pe mașină; o mașină pentru până la 4 persoane). Nu este disponibilă la **Maldive**, în **China** și la **safari-ul din Kenya**.` },
          en: { t: '🚗 Car rental', k: ['car rental', 'rent a car', 'hire a car', 'car hire', 'rental car', 'renting a car'], a: `**Car rental** is added as an extra (priced per day and per car; one car for up to 4 people). It isn't available in the **Maldives**, in **China** or on the **Kenya safari**.` },
          it: { t: '🚗 Noleggio auto', k: ['noleggio auto', 'noleggiare', 'auto a noleggio', 'macchina a noleggio', 'noleggio macchina'], a: `Il **noleggio auto** si aggiunge come extra (prezzo al giorno e per auto; un'auto per un massimo di 4 persone). Non è disponibile alle **Maldive**, in **Cina** e nel **safari in Kenya**.` } },

        { id: 'transfer', topic: true, next: ['car-rental', 'extras'],
          ro: { t: '🚐 Transfer aeroport', k: ['transfer', 'transfer aeroport', 'transfer hotel', 'de la aeroport la hotel', 'taxi aeroport'], a: `**Transferul aeroport–hotel** se adaugă ca serviciu extra (preț per persoană, dus-întors). La **Maldive**, transferul (barcă rapidă sau hidroavion) costă mai mult.` },
          en: { t: '🚐 Airport transfer', k: ['transfer', 'airport transfer', 'hotel transfer', 'airport to hotel', 'shuttle'], a: `The **airport–hotel transfer** is added as an extra (priced per person, round trip). In the **Maldives**, the transfer (speedboat or seaplane) costs more.` },
          it: { t: '🚐 Transfer aeroporto', k: ['transfer', 'trasferimento aeroporto', 'trasferimento hotel', 'navetta', 'dall aeroporto all hotel'], a: `Il **transfer aeroporto–hotel** si aggiunge come extra (prezzo a persona, andata e ritorno). Alle **Maldive** il trasferimento (motoscafo o idrovolante) costa di più.` } },

        { id: 'guide', topic: true, next: ['fixed-tours', 'extras'],
          ro: { t: '🧑‍🏫 Ghid local', k: ['ghid', 'ghid local', 'ghid turistic', 'ghid privat', 'vreau ghid'], a: `**Ghidul local privat** se adaugă ca serviciu extra (preț per grup, pe zi, maximum 3 zile). La circuitele ghidate (ex.: Tokyo, Beijing, safari Kenya) ghidul este deja **inclus**.` },
          en: { t: '🧑‍🏫 Local guide', k: ['guide', 'local guide', 'tour guide', 'private guide', 'i want a guide'], a: `A **private local guide** is added as an extra (priced per group, per day, up to 3 days). On guided tours (e.g. Tokyo, Beijing, Kenya safari) the guide is already **included**.` },
          it: { t: '🧑‍🏫 Guida locale', k: ['guida', 'guida locale', 'guida turistica', 'guida privata', 'voglio una guida'], a: `Una **guida locale privata** si aggiunge come extra (prezzo per gruppo, al giorno, fino a 3 giorni). Nei tour guidati (es. Tokyo, Pechino, safari in Kenya) la guida è già **inclusa**.` } },

        { id: 'meals', next: ['allinclusive', 'price-includes'],
          ro: { t: '🍽️ Mese', k: ['mese', 'masa', 'mancare', 'demipensiune', 'pensiune completa', 'mic dejun', 'pranz', 'ce mananc'], a: `Masa depinde de pachet: **all inclusive**, pensiune completă, demipensiune sau doar mic dejun (vezi în cardul pachetului). Unde masa nu e inclusă, poți adăuga un **upgrade de masă** ca serviciu extra.` },
          en: { t: '🍽️ Meals', k: ['meals', 'food included', 'half board', 'full board', 'breakfast', 'dinner', 'lunch', 'what do we eat'], a: `Meals depend on the package: **all inclusive**, full board, half board or just breakfast (see the package card). Where meals aren't included, you can add a **meal upgrade** as an extra.` },
          it: { t: '🍽️ Pasti', k: ['pasti', 'cibo', 'mezza pensione', 'pensione completa', 'colazione', 'cena', 'pranzo', 'cosa si mangia'], a: `I pasti dipendono dal pacchetto: **all inclusive**, pensione completa, mezza pensione o solo colazione (vedi nella scheda). Dove i pasti non sono inclusi, puoi aggiungere un **upgrade dei pasti** come extra.` } },

        /* ==================================================== CATALOG: RECOMANDĂRI ==================================================== */
        { id: 'destinations-list', next: ['romania', 'europe', 'exotic', 'asia'],
          ro: { t: '🌍 Destinații', k: ['destinatii', 'ce destinatii aveti', 'lista destinatii', 'unde pot merge', 'toate destinatiile', 'ce oferte aveti', 'ce pachete aveti', 'portofoliu', 'pachete', 'pachete turistice'], a: `Avem **{count} de destinații** în catalog: **România** (Delta Dunării, Poiana Brașov, Bran, Transfăgărășan, Cazanele Dunării, Maramureș, Sibiu & Sighișoara, Mamaia), **city break în Europa** (Roma, Barcelona, Londra, Praga, Viena, Paris), **plajă și munte** (Santorini, Alpii Elvețieni), **exotice** (Maldive, Kenya, Bali, Tokyo, Dubai, Cappadocia, New York) și **China & Coreea de Sud** (Beijing, Shanghai, Zhangjiajie, Seoul, Busan, Jeju). Noutăți: **America** (Yosemite, Grand Canyon, Horseshoe Bend, San Francisco, Hawaii, Niagara, Banff, Machu Picchu, Rio de Janeiro, Patagonia), **Marea Britanie și Irlanda** (Edinburgh, Insula Skye, Cornwall, Irlanda), **nordul Europei** (Norvegia, Islanda), **Africa** (Cape Town, Marrakech, Egipt, Zanzibar, Serengeti, Cascada Victoria, Namibia) și **Asia & Oceania** (India, Vietnam, Thailanda, Iordania, Noua Zeelandă, Sydney)` },
          en: { t: '🌍 Destinations', k: ['destinations', 'which destinations', 'list of destinations', 'where can i go', 'all destinations', 'what packages do you have', 'packages', 'travel packages'], a: `We have **{count} destinations** in the catalogue: **Romania** (Danube Delta, Poiana Brașov, Bran, Transfăgărășan, Danube Gorge, Maramureș, Sibiu & Sighișoara, Mamaia), **city breaks in Europe** (Rome, Barcelona, London, Prague, Vienna, Paris), **beach and mountains** (Santorini, Swiss Alps), **exotic** (Maldives, Kenya, Bali, Tokyo, Dubai, Cappadocia, New York) and **China & South Korea** (Beijing, Shanghai, Zhangjiajie, Seoul, Busan, Jeju). New: **America** (Yosemite, Grand Canyon, Horseshoe Bend, San Francisco, Hawaii, Niagara, Banff, Machu Picchu, Rio de Janeiro, Patagonia), **the UK and Ireland** (Edinburgh, Isle of Skye, Cornwall, Ireland), **Northern Europe** (Norway, Iceland), **Africa** (Cape Town, Marrakech, Egypt, Zanzibar, Serengeti, Victoria Falls, Namibia) and **Asia & Oceania** (India, Vietnam, Thailand, Jordan, New Zealand, Sydney)` },
          it: { t: '🌍 Destinazioni', k: ['destinazioni', 'quali destinazioni', 'elenco destinazioni', 'dove posso andare', 'tutte le destinazioni', 'che pacchetti avete', 'pacchetti', 'pacchetti turistici'], a: `Abbiamo **{count} destinazioni** nel catalogo: **Romania** (Delta del Danubio, Poiana Brașov, Bran, Transfăgărășan, Gole del Danubio, Maramureș, Sibiu & Sighișoara, Mamaia), **city break in Europa** (Roma, Barcellona, Londra, Praga, Vienna, Parigi), **mare e montagna** (Santorini, Alpi svizzere), **esotiche** (Maldive, Kenya, Bali, Tokyo, Dubai, Cappadocia, New York) e **Cina & Corea del Sud** (Pechino, Shanghai, Zhangjiajie, Seoul, Busan, Jeju). Novità: **America** (Yosemite, Grand Canyon, Horseshoe Bend, San Francisco, Hawaii, Niagara, Banff, Machu Picchu, Rio de Janeiro, Patagonia), **Regno Unito e Irlanda** (Edimburgo, Isola di Skye, Cornovaglia, Irlanda), **Nord Europa** (Norvegia, Islanda), **Africa** (Città del Capo, Marrakech, Egitto, Zanzibar, Serengeti, Cascate Vittoria, Namibia) e **Asia e Oceania** (India, Vietnam, Thailandia, Giordania, Nuova Zelanda, Sydney)` } },

        { id: 'romania', cats: ['romania'], next: ['beach', 'mountain', 'weekend'],
          ro: { t: '🇷🇴 România', k: ['romania', 'in romania', 'vacanta in romania', 'destinatii din romania', 'in tara', 'pachete romania'], a: `Descoperă frumusețile României! 🇷🇴 Pachetele din țară:` },
          en: { t: '🇷🇴 Romania', k: ['romania', 'in romania', 'holiday in romania', 'romanian destinations', 'domestic'], a: `Discover the beauty of Romania! 🇷🇴 Our packages in the country:` },
          it: { t: '🇷🇴 Romania', k: ['romania', 'in romania', 'vacanza in romania', 'destinazioni in romania', 'nazionali'], a: `Scopri la bellezza della Romania! 🇷🇴 I nostri pacchetti nel Paese:` } },

        { id: 'europe', list: ['roma', 'barcelona', 'londra', 'praga', 'viena', 'paris'], next: ['city', 'weekend', 'romantic'],
          ro: { t: '🇪🇺 Europa', k: ['europa', 'in europa', 'europene', 'destinatii europene', 'city break europa', 'vacanta in europa'], a: `Cele mai căutate city break-uri în Europa: 🇪🇺` },
          en: { t: '🇪🇺 Europe', k: ['europe', 'in europe', 'european', 'european destinations', 'europe city break', 'holiday in europe'], a: `Our most popular city breaks in Europe: 🇪🇺` },
          it: { t: '🇪🇺 Europa', k: ['europa', 'in europa', 'europee', 'destinazioni europee', 'city break europa', 'vacanza in europa'], a: `I city break più richiesti in Europa: 🇪🇺` } },

        { id: 'exotic', list: ['maldive-deluxe', 'kenya-safari', 'bali', 'tokyo', 'dubai', 'cappadocia', 'newyork'], next: ['beach', 'adventure', 'priciest'],
          ro: { t: '🏝️ Exotice', k: ['exotic*', 'destinatii exotice', 'vacanta exotica', 'departe', 'peste ocean', 'alt continent'], a: `Destinații exotice și îndepărtate: 🏝️` },
          en: { t: '🏝️ Exotic', k: ['exotic*', 'exotic destinations', 'exotic holiday', 'far away', 'overseas', 'other continent'], a: `Exotic and far-away destinations: 🏝️` },
          it: { t: '🏝️ Esotiche', k: ['esotic*', 'destinazioni esotiche', 'vacanza esotica', 'lontano', 'oltreoceano', 'altro continente'], a: `Destinazioni esotiche e lontane: 🏝️` } },

        { id: 'beach', list: ['mamaia-constanta', 'santorini', 'maldive-deluxe', 'bali', 'jeju-insula-vulcanica'], next: ['summer', 'allinclusive', 'romantic'],
          ro: { t: '🏖️ Plajă și mare', k: ['plaja', 'mare', 'litoral', 'soare', 'la mare', 'vacanta la mare', 'nisip', 'insula', 'insule'], a: `Pentru plajă și mare, îți recomand: 🏖️` },
          en: { t: '🏖️ Beach and sea', k: ['beach', 'sea', 'seaside', 'sun', 'sunny holiday', 'beach holiday', 'sand', 'island', 'islands'], a: `For beach and sea, I recommend: 🏖️` },
          it: { t: '🏖️ Mare e spiaggia', k: ['spiaggia', 'mare', 'litorale', 'sole', 'vacanza al mare', 'sabbia', 'isola', 'isole'], a: `Per mare e spiaggia ti consiglio: 🏖️` } },

        { id: 'mountain', list: ['poiana-brasov', 'transfagarasan', 'alpi-elvetia', 'zhangjiajie-avatar'], next: ['winter', 'adventure'],
          ro: { t: '⛰️ Munte', k: ['munte', 'muntii', 'ski', 'schi', 'drumetii', 'la munte', 'vacanta la munte', 'natura montana'], a: `Pentru munte și natură: ⛰️` },
          en: { t: '⛰️ Mountains', k: ['mountain', 'mountains', 'ski', 'skiing', 'hiking', 'mountain holiday', 'alpine'], a: `For mountains and nature: ⛰️` },
          it: { t: '⛰️ Montagna', k: ['montagna', 'montagne', 'sci', 'sciare', 'escursioni', 'vacanza in montagna', 'alpino'], a: `Per montagna e natura: ⛰️` } },

        { id: 'city', list: ['roma', 'barcelona', 'londra', 'praga', 'viena', 'paris', 'newyork', 'dubai'], next: ['europe', 'weekend', 'culture'],
          ro: { t: '🏙️ City break', k: ['city break', 'orase', 'oras mare', 'capitale', 'vacanta in oras', 'city breakuri'], a: `Pentru city break: 🏙️` },
          en: { t: '🏙️ City break', k: ['city break', 'city breaks', 'cities', 'capital cities', 'urban holiday', 'city trip'], a: `For a city break: 🏙️` },
          it: { t: '🏙️ City break', k: ['city break', 'citta', 'capitali', 'vacanza in citta', 'viaggio in citta'], a: `Per un city break: 🏙️` } },

        { id: 'asia', list: ['beijing-marele-zid', 'shanghai-metropola-futurului', 'zhangjiajie-avatar', 'seoul-coreea', 'busan-coreea', 'jeju-insula-vulcanica'], next: ['exotic', 'adventure', 'longtrip'],
          ro: { t: '🐉 China și Coreea', k: ['china', 'coreea', 'asia', 'coreea de sud', 'chinezesc', 'in asia', 'vacanta in asia'], a: `Pentru China și Coreea de Sud: 🐉` },
          en: { t: '🐉 China and Korea', k: ['china', 'korea', 'south korea', 'asia', 'chinese', 'in asia', 'holiday in asia'], a: `For China and South Korea: 🐉` },
          it: { t: '🐉 Cina e Corea', k: ['cina', 'corea', 'corea del sud', 'asia', 'cinese', 'in asia', 'vacanza in asia'], a: `Per Cina e Corea del Sud: 🐉` } },

        { id: 'romantic', list: ['maldive-deluxe', 'santorini', 'paris', 'roma', 'bali'], next: ['beach', 'priciest'],
          ro: { t: '💑 Romantic', k: ['luna de miere', 'cuplu', 'romantic', 'aniversare', 'pentru doi', 'logodna', 'vacanta romantica', 'in doi'], a: `Pentru o vacanță romantică (lună de miere, aniversare): 💑` },
          en: { t: '💑 Romantic', k: ['honeymoon', 'couple', 'romantic', 'anniversary', 'for two', 'engagement', 'romantic getaway'], a: `For a romantic getaway (honeymoon, anniversary): 💑` },
          it: { t: '💑 Romantico', k: ['luna di miele', 'coppia', 'romantico', 'anniversario', 'per due', 'fidanzamento', 'vacanza romantica'], a: `Per una vacanza romantica (luna di miele, anniversario): 💑` } },

        { id: 'family', list: ['mamaia-constanta', 'bran-brasov', 'delta-dunarii', 'dubai'], next: ['kids-price', 'kids-travel'],
          ro: { t: '👨‍👩‍👧 Cu familia', k: ['familie', 'famili*', 'cu familia', 'unde pot merge cu familia', 'unde merg cu familia', 'cu copiii', 'vacanta cu copii', 'copii mici', 'pentru familie', 'in familie', 'vacanta de familie'], a: `Pentru o vacanță cu familia, îți propun: 👨‍👩‍👧` },
          en: { t: '👨‍👩‍👧 With the family', k: ['family', 'with kids', 'with children', 'family holiday', 'family trip', 'young children', 'for the family'], a: `For a family holiday, I suggest: 👨‍👩‍👧` },
          it: { t: '👨‍👩‍👧 In famiglia', k: ['famiglia', 'con bambini', 'con i bambini', 'vacanza in famiglia', 'bambini piccoli', 'per la famiglia'], a: `Per una vacanza in famiglia ti propongo: 👨‍👩‍👧` } },

        { id: 'adventure', list: ['kenya-safari', 'transfagarasan', 'zhangjiajie-avatar', 'bali'], next: ['mountain', 'exotic'],
          ro: { t: '🧗 Aventură', k: ['aventura', 'natura', 'adrenalina', 'vacanta activa', 'peisaje', 'animale salbatice'], a: `Pentru aventură și natură: 🧗` },
          en: { t: '🧗 Adventure', k: ['adventure', 'nature', 'adrenaline', 'active holiday', 'landscapes', 'wildlife', 'outdoor'], a: `For adventure and nature: 🧗` },
          it: { t: '🧗 Avventura', k: ['avventura', 'natura', 'adrenalina', 'vacanza attiva', 'paesaggi', 'animali selvatici', 'outdoor'], a: `Per avventura e natura: 🧗` } },

        { id: 'culture', list: ['roma', 'praga', 'viena', 'sibiu-sighisoara', 'maramures', 'cappadocia', 'tokyo'], next: ['city', 'europe'],
          ro: { t: '🏛️ Cultură și istorie', k: ['cultura', 'istorie', 'muzee', 'monumente', 'arhitectura', 'patrimoniu', 'vacanta culturala'], a: `Pentru cultură și istorie: 🏛️` },
          en: { t: '🏛️ Culture and history', k: ['culture', 'history', 'museums', 'monuments', 'architecture', 'heritage', 'cultural holiday'], a: `For culture and history: 🏛️` },
          it: { t: '🏛️ Cultura e storia', k: ['cultura', 'storia', 'musei', 'monumenti', 'architettura', 'patrimonio', 'vacanza culturale'], a: `Per cultura e storia: 🏛️` } },

        { id: 'weekend', dyn: 'weekend', next: ['city', 'cheapest'],
          ro: { t: '📆 Pentru un weekend', k: ['weekend', 'vacanta scurta', 'city break scurt', 'pentru un weekend', 'sejur scurt', 'cateva zile', 'plecare scurta'], a: `Pentru o escapadă scurtă (2–3 nopți): 📆` },
          en: { t: '📆 For a weekend', k: ['weekend', 'short trip', 'short break', 'a few days', 'quick getaway', 'short holiday'], a: `For a short escape (2–3 nights): 📆` },
          it: { t: '📆 Per un weekend', k: ['weekend', 'fine settimana', 'viaggio breve', 'pochi giorni', 'breve vacanza', 'fuga breve'], a: `Per una breve fuga (2–3 notti): 📆` } },

        { id: 'longtrip', dyn: 'longtrip', next: ['asia', 'exotic'],
          ro: { t: '🗓️ Sejur lung', k: ['sejur lung', '10 nopti', 'doua saptamani', 'vacanta lunga', 'circuit lung', 'mult timp', 'o saptamana', 'saptamana'], a: `Pentru un sejur mai lung (8+ nopți): 🗓️` },
          en: { t: '🗓️ Long trip', k: ['long trip', 'two weeks', 'long holiday', 'long stay', 'a week', 'for a week', 'plenty of time'], a: `For a longer stay (8+ nights): 🗓️` },
          it: { t: '🗓️ Viaggio lungo', k: ['viaggio lungo', 'due settimane', 'vacanza lunga', 'soggiorno lungo', 'una settimana', 'molto tempo'], a: `Per un soggiorno più lungo (8+ notti): 🗓️` } },

        { id: 'winter', list: ['poiana-brasov', 'alpi-elvetia', 'dubai', 'maldive-deluxe'], next: ['mountain', 'summer'],
          ro: { t: '❄️ Iarna', k: ['iarna', 'revelion', 'craciun', 'vacanta de iarna', 'sarbatori', 'zapada', 'sarbatori de iarna'], a: `Pentru vacanța de iarnă (schi sau soare, în funcție de gust): ❄️` },
          en: { t: '❄️ Winter', k: ['winter', 'christmas', 'new year', 'winter holiday', 'winter break', 'snow', 'festive season'], a: `For a winter holiday (snow or sun, as you prefer): ❄️` },
          it: { t: '❄️ Inverno', k: ['inverno', 'natale', 'capodanno', 'vacanza invernale', 'neve', 'feste natalizie', 'vacanza di natale'], a: `Per la vacanza invernale (neve o sole, come preferisci): ❄️` } },

        { id: 'summer', list: ['mamaia-constanta', 'santorini', 'delta-dunarii', 'maramures', 'bali'], next: ['beach', 'winter'],
          ro: { t: '☀️ Vara', k: ['vara', 'vacanta de vara', 'cald', 'sejur de vara', 'in iulie', 'in august', 'iulie', 'august'], a: `Pentru vacanța de vară: ☀️` },
          en: { t: '☀️ Summer', k: ['summer', 'summer holiday', 'hot weather', 'in july', 'in august', 'july', 'august', 'warm'], a: `For a summer holiday: ☀️` },
          it: { t: '☀️ Estate', k: ['estate', 'vacanza estiva', 'caldo', 'a luglio', 'ad agosto', 'luglio', 'agosto', 'vacanza d estate'], a: `Per una vacanza estiva: ☀️` } },

        { id: 'allinclusive', dyn: 'allinclusive', next: ['meals', 'beach'],
          ro: { t: '🍹 All inclusive', k: ['all inclusive', 'tot inclus', 'ultra all inclusive', 'bauturi incluse'], a: `Pachete **all inclusive**: 🍹` },
          en: { t: '🍹 All inclusive', k: ['all inclusive', 'everything included', 'drinks included', 'all in'], a: `**All-inclusive** packages: 🍹` },
          it: { t: '🍹 All inclusive', k: ['all inclusive', 'tutto incluso', 'bevande incluse', 'tutto compreso'], a: `Pacchetti **all inclusive**: 🍹` } },

        { id: 'flight-included', next: ['price-includes', 'transfer'],
          ro: { t: '✈️ Zbor inclus?', k: ['zbor inclus', 'cu avion', 'bilet de avion', 'zbor*', 'avion*', 'bilete de avion', 'cu zbor'], a: `La pachetele din afara României **zborul este inclus** (vezi „Zbor Inclus” la lista Include). La cele din România transportul nu e inclus, dar poți adăuga **transport cu autocar** ca serviciu extra. Detaliile despre zbor (aeroport, ore) ți le confirmă consultantul.` },
          en: { t: '✈️ Is the flight included?', k: ['flight included', 'by plane', 'plane ticket', 'flight', 'flights', 'airfare', 'do you include flights', 'with flight'], a: `On packages outside Romania the **flight is included** (see "Flight Included" in the Includes list). On Romanian packages transport isn't included, but you can add **coach transport** as an extra. Your consultant confirms the flight details (airport, times).` },
          it: { t: '✈️ Il volo è incluso?', k: ['volo incluso', 'in aereo', 'biglietto aereo', 'volo', 'voli', 'con volo', 'incluso il volo'], a: `Nei pacchetti fuori dalla Romania il **volo è incluso** (vedi "Volo Incluso" nell'elenco Include). Nei pacchetti in Romania il trasporto non è incluso, ma puoi aggiungere il **trasporto in pullman** come extra. I dettagli del volo (aeroporto, orari) te li conferma il consulente.` } }
    ]);
})(typeof window !== 'undefined' ? window : globalThis);
