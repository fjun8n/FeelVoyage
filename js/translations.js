/* FeelVoyage — traduceri (EN / IT). Româna este limba implicită din index.html. */
const i18n = {
    en: {
        // Navigation
        'nav.acasa': 'Home',
        'nav.destinatii': 'Destinations & Packages',
        'nav.despre': 'About Us',
        'nav.servicii': 'Services',
        'nav.contact': 'Contact',
        'nav.facebook': 'Follow us on Facebook',
        'nav.language': 'Language:',
        'nav.searchBtn': 'Search Offers',

        // Hero Section
        'hero.badge': 'Premium National & International Travel Agency',
        'hero.title1': 'Discover the World',
        'hero.title2': 'Without Limits with FeelVoyage',
        'hero.subtitle': 'Exclusive travel packages, exotic vacations, beach getaways and urban adventures tailored to your travel emotions.',
        'hero.destinatie': 'Destination',
        'hero.destinatiePlaceholder': 'Ex: Danube Delta, Rome, Maldives...',
        'hero.tipVacanta': 'Vacation Type',
        'hero.buget': 'Max Budget (€)',
        'hero.toateCategoriile': 'All Categories',
        'hero.categRomania': '🇷🇴 Romania & Local',
        'hero.categPlaja': '🏖️ Beach & Sea',
        'hero.categMunte': '⛰️ Mountain & Nature',
        'hero.categCityBreak': '🏛️ City Break',
        'hero.categExotic': '🌴 Exotic Vacations',
        'hero.categAsia': '🌏 China & South Korea',
        'hero.oriceBuget': 'Any Budget',
        'hero.sub300': 'Under 300 €',
        'hero.sub600': 'Under 600 €',
        'hero.sub1200': 'Under 1,200 €',
        'hero.sub2500': 'Under 2,500 €',
        'hero.cautaBtn': 'Search Offers',
        'hero.stat1': 'Happy Travelers',
        'hero.stat2': 'Active Destinations',
        'hero.stat3': 'Quality Guarantee',
        'hero.stat4': 'Travel Support',

        // Destinations Section
        'dest.badge': 'Exclusive Destinations',
        'dest.title': 'Explore the FeelVoyage Selection',
        'dest.subtitle': 'Over 30 fabulous destinations — from Romanian mountain landscapes, through European capitals, to America, Africa, China, South Korea and exotic getaways.',
        'dest.filterAll': '🌍 All Destinations',
        'dest.filterRomania': '🇷🇴 Vacations in Romania',
        'dest.filterPlaja': '🏖️ Beach & Sea',
        'dest.filterMunte': '⛰️ Mountain & Nature',
        'dest.filterCityBreak': '🏛️ City Break',
        'dest.filterExotic': '🌴 Exotic Vacations',
        'dest.filterAsia': '🌏 China & South Korea',
        'dest.filterAmerica': '🗽 Americas & Canada',
        'dest.filterAfrica': '🦁 Africa & Safari',
        'dest.filterNord': '❄️ Northern Europe & Isles',
        'dest.filterAsiaOceania': '🏯 Asia & Oceania',
        'catwin.badge': 'Destinations',
        'catwin.subtitle': 'Pick a package to see its details and photos and to book.',
        'catwin.count': '{n} destinations',
        'catwin.count1': '1 destination',
        'catwin.searchPh': 'Search this list…',
        'catwin.empty': 'No destination matches your search.',
        'catwin.viewAll': 'See all {n} destinations',
        'catwin.homeHint': 'Pick a category to see all its packages.',
        'catwin.results': 'Search results',
        'catwin.budget': 'Maximum budget: €{b}',
        'card.pullOpen': 'Open photo gallery',
        'card.pullClose': 'Close photo gallery',
        'card.drawerTitle': '{n} photos',
        'card.openPhoto': 'Open photo {n}',
        'card.seePhotos': 'See all photos of this package',
        'modal.galleryTitle': 'Photo gallery',
        'modal.galleryClose': 'Close the photo gallery',
        'modal.galleryOpen': 'Photo gallery ({n})',
        'footer.edu': 'This website was made for educational purposes and no real orders can be placed.',
        'perf.on': 'Fast mode: on',
        'perf.off': 'Fast mode: off',
        'perf.title': 'Reduces effects and animations for a smoother site on older phones',
        'log.btn': 'Log',
        'log.title': 'Site log',
        'log.hint': 'Stays on this device, with no personal data.',
        'log.events': 'events',
        'log.errors': 'errors',
        'log.warnings': 'warnings',
        'log.sessions': 'visits',
        'log.perf': 'Performance',
        'log.modeLite': 'fast mode',
        'log.modeFull': 'full mode',
        'log.longTasks': 'Long tasks',
        'log.verdict': 'Verdict',
        'log.perfWait': 'The summary appears 4 seconds after the page loads.',
        'log.level': 'Level',
        'log.category': 'Category',
        'log.search': 'Search the log…',
        'log.refresh': 'Refresh',
        'log.clear': 'Clear',
        'log.confirmClear': 'Delete the whole log from this device?',
        'log.allLevels': 'All levels',
        'log.allCats': 'All categories',
        'log.empty': 'No events match the chosen filters.',
        'log.older': 'older: export JSON / CSV for the whole log',
        'log.adminOnly': 'Administrator only. No personal data in the log; passwords cannot be seen.',
        'log.tabDevice': 'This device',
        'log.tabServer': 'Server',
        'log.tabAccounts': 'Accounts',
        'log.loading': 'Loading from the server…',
        'log.forbidden': 'Access denied: the server log can only be read by an administrator account.',
        'log.unsupported': 'The server (Firebase) is not configured: the log stays on this device only.',
        'log.networkErr': 'Could not read from the server. Check your internet and the Firebase rules (firebase-rules.json).',
        'log.pruneOld': 'Delete older than 30 days',
        'log.clearServer': 'Delete everything on the server',
        'log.confirmPrune': 'Delete from the server the entries older than 30 days?',
        'log.confirmClearServer': 'Delete the WHOLE log from the server (all visitors)?',
        'log.pruned': 'Deleted: {n}',
        'log.serverCleared': 'The server log was deleted.',
        'log.accounts': 'accounts',
        'log.created': 'Created',
        'log.lastLogin': 'Last sign-in',
        'log.logins': 'Sign-ins',
        'log.password': 'Password',
        'log.pwHidden': 'cannot be shown (hash only)',
        'log.pwNote': 'Passwords cannot be shown: Firebase keeps only an encrypted fingerprint (hash) that neither the app nor you can read as text. If someone forgot their password you can send them a reset e-mail.',
        'log.resetPass': 'Send reset e-mail',
        'log.confirmReset': 'Send a password reset e-mail to {email}?',
        'log.resetSent': 'The reset e-mail was sent.',
        'log.resetFail': 'Could not send the reset e-mail.',
        'log.noAccounts': 'No accounts in the database.',
        'dest.noResultsTitle': 'No matching offers found',
        'dest.noResultsMsg': 'Try resetting the filters or searching for a different term.',
        'dest.resetBtn': 'Reset Filters',
        'dest.deLa': 'From',
        'dest.detaliiBtn': 'Package Details',
        'dest.foto': '4 Photos',

        'modal.photoLicense': 'Author and licence',
        'modal.photoCredit': 'Photo: Wikimedia Commons, free licence.',
        'modal.nextPhoto': 'Next photo',
        'modal.prevPhoto': 'Previous photo',
        'dest.fotoN': '{n} Photos',
        // Services Section
        'serv.badge': 'Complete Services',
        'serv.title': 'Everything for a Worry-Free Trip',
        'serv.subtitle': 'We provide you with an integrated package of services so you just need to pack your bags.',
        'serv.card1Title': 'Flights & Airline Tickets',
        'serv.card1Desc': 'Quick bookings with top airlines, charter flights and flexible flight options with baggage included.',
        'serv.card2Title': 'Premium Accommodation & Resorts',
        'serv.card2Desc': 'Direct partnerships with 4-star and 5-star hotels, All Inclusive resorts and guaranteed private villas.',
        'serv.card3Title': 'Luxury Cruises',
        'serv.card3Desc': 'Sea adventures on the most spectacular cruise ships in the Caribbean, Mediterranean and Northern Europe.',

        // About Us Section
        'despre.badge': 'Our Story',
        'despre.title': 'About FeelVoyage — Travel with Soul',
        'despre.subtitle': 'A travel agency born in the heart of Gorj County, today opening up the whole world: from the Romanian seaside to China and South Korea.',
        'despre.p1': 'Welcome to FeelVoyage, the travel agency created to turn your dream vacations into reality!',
        'despre.p2': 'This site is much more than a simple booking platform; it is a team project into which we have poured a great deal of passion. We are a group of students from Virgil Madgearu Economic High School in Târgu Jiu, eager to combine our knowledge of tourism with an entrepreneurial spirit. More precisely, we are 11th grade E students, and we designed every section of this site with the goal of offering you the most beautiful destinations and travel experiences.',
        'despre.p3': 'The entire FeelVoyage concept came to life, was organized and successfully implemented together with our teacher, who guided us step by step in developing this agency.',
        'despre.p4': 'We invite you to explore our offers and discover the world with FeelVoyage!',
        'despre.cta': 'Come meet us',
        'despre.stat1': 'Destinations in portfolio',
        'despre.stat2': 'Happy travelers',
        'despre.stat3': 'Continents connected',
        'despre.stat4': 'Real support while traveling',
        'despre.val1Title': 'Personalized experiences',
        'despre.val1Desc': 'We don\'t sell off-the-shelf packages — we build itineraries around your budget, pace and passions.',
        'despre.val2Title': 'Total transparency',
        'despre.val2Desc': 'The displayed price is the final price: no hidden commissions, no surprises at your destination.',
        'despre.val3Title': 'Dedicated consultant',
        'despre.val3Desc': 'One person who knows you by name, from the first quote to your safe return home.',
        'despre.val4Title': 'Global network',
        'despre.val4Desc': 'Vetted local partners on three continents — from Mamaia to Beijing, Busan and the Maldives.',
        'despre.whyTitle': 'Why do travelers choose FeelVoyage?',
        'despre.why1': 'Free consultation and a personalized quote within 24 hours',
        'despre.why2': 'Prices shown in EUR and RON, with interest-free installments on booking',
        'despre.why3': 'Optional travel insurance and medical assistance in every package',
        'despre.why4': 'A dedicated consultant and a WhatsApp support group for the length of your stay',

        'about.close': 'Close',

        // Documente legale, acceptare, contor conturi

        'legal.badge': 'Legal documents',

        'terms.subtitle': 'The rules for using the site and the conditions for booking, paying for and cancelling FeelVoyage services.',

        'legal.toc': 'Contents',

        'terms.co.label': 'Site operator',

        'terms.co.address': 'Registered office',

        'terms.co.trade': 'Trade Register',

        'terms.co.cui': 'CUI (tax ID)',

        'terms.co.license': 'Travel licence',

        'terms.co.licenseVal': 'No. 5678, issued by the Ministry of Tourism',

        'terms.s1.title': 'Introduction',

        'terms.s2.title': 'Services offered and the role of the agency',

        'terms.s3.title': 'Bookings, prices and payment methods',

        'terms.s4.title': 'Cancellations, changes and penalties',

        'terms.s5.title': 'Travel documents, visas and health requirements',

        'terms.s6.title': 'Limitation of liability',

        'terms.s7.title': 'Force majeure',

        'terms.s8.title': 'Intellectual property',

        'terms.s9.title': 'Personal data protection (GDPR)',

        'terms.s10.title': 'Complaints, applicable law and disputes',

        'terms.s11.title': 'Contact details',

        'terms.s1.p1': 'This document (the “Terms and Conditions”) sets out the rules for using the www.feelvoyage.ro web platform and the conditions for booking, purchasing and paying for the travel services and packages offered through it.',

        'terms.s1.p2': 'By accessing, browsing and using the site, and by making any booking, you confirm that you have read, understood and fully and unconditionally accepted these Terms and Conditions.',

        'terms.s1.p3': 'The site is operated by:',

        'terms.s2.intro': 'FeelVoyage acts, as the case may be, in one of the following capacities:',

        'terms.s2.r1.title': 'Organiser (tour operator)',

        'terms.s2.r1.text': 'When it creates and sells its own travel packages.',

        'terms.s2.r2.title': 'Intermediary (retail agency)',

        'terms.s2.r2.text': 'When it sells tourism services, holiday packages, plane tickets or accommodation provided by other tour operators, airlines or booking systems. In that case, responsibility for actually providing the services lies exclusively with the final suppliers.',

        'terms.s3.b1.lead': 'Booking process',

        'terms.s3.b1.text': 'Any booking request sent through the site is considered firm only after a FeelVoyage agent confirms availability and the price. The e-mail generated automatically when a request is received is not a firm confirmation of the booking.',

        'terms.s3.b2.lead': 'Prices',

        'terms.s3.b2.text': 'Prices are shown in EUR and RON and include VAT, in accordance with the legislation in force. Plane ticket fares, airport taxes and hotel quotations may change, independently of the agency\'s will, until the tickets or vouchers are issued.',

        'terms.s3.b3.lead': 'Payment',

        'terms.s3.b3.text': 'Depending on the type of service and how close the departure date is, payment may be made in full at booking or in instalments (a deposit followed by the balance). The deposit required and the payment deadlines are stated clearly when the offer is made.',

        'terms.s3.b4.lead': 'Payment methods',

        'terms.s3.b4.text': 'No payments are made on the website. Payment is made only after you have spoken with a FeelVoyage agent and received the confirmed offer. The payment method (for example, bank transfer or cash at the agency\'s office) is agreed together with the agent, within the legal cash-payment limits.',

        'terms.s4.b1.lead': 'Cancellation by the client',

        'terms.s4.b1.text': 'If the client wishes to cancel or change a confirmed booking, the client bears the penalties imposed by the service providers. Depending on when the cancellation is made, penalties can reach up to 100% of the value of the package or service (for example, non-refundable plane tickets or Early Booking offers).',

        'terms.s4.b2.lead': 'Cancellation insurance',

        'terms.s4.b2.text': 'To avoid financial loss if a cancellation becomes necessary for objective reasons (for example, a sudden illness), the agency strongly recommends taking out a cancellation insurance policy when the contract is signed or the deposit is paid.',

        'terms.s4.b3.lead': 'Cancellation by the agency or supplier',

        'terms.s4.b3.text': 'If the supplier cancels the service, or the agency has to cancel because the minimum number of participants (for groups) has not been reached, the client is entitled either to a full refund of the amounts paid or to accept an alternative package of equivalent or higher quality.',

        'terms.s5.p1': 'It is the tourist\'s sole responsibility to make sure they hold valid travel documents: an ID card, a passport valid for at least 6 months after the return date, and a transit or destination visa, where applicable.',

        'terms.s5.p2': 'The tourist is responsible for complying with the customs, border and health requirements (mandatory vaccinations, medical certificates) imposed by the destination or transit country. FeelVoyage cannot be held liable and will not refund the cost of the services if the tourist is refused boarding or entry into the destination country.',

        'terms.s5.p3': 'For minors (under 18) travelling alone or accompanied by only one parent, the specific rules of the Romanian Border Police apply.',

        'terms.s6.intro': 'FeelVoyage is not responsible for:',

        'terms.s6.l1': 'delays, schedule or route changes, overbookings or cancellations of flights operated by airlines;',

        'terms.s6.l2': 'the loss of or damage to luggage during flights or transfers;',

        'terms.s6.l3': 'dissatisfaction with the quality of services actually provided by the hotel (cleanliness, noise, room location), the agency acting only as an intermediary in taking requests.',

        'terms.s7.p1': 'Neither party is liable for failing to perform its obligations if the failure is caused by an event of force majeure, as defined by law (for example: wars, pandemics, strikes, extreme weather, natural disasters, decisions of government authorities). In such cases, the refund or rescheduling policies of the final service suppliers apply.',

        'terms.s8.p1': 'All content on the site (texts, images, logos, graphic elements, design) belongs to FeelVoyage or its partners and is protected by copyright law. Copying, reproducing or using it without the agency\'s written consent is strictly prohibited.',

        'terms.s9.p1': 'The collection and processing of personal data (name, address, e-mail, telephone, identity document details) are carried out in accordance with Regulation (EU) 2016/679 (GDPR). Your data is used strictly for processing bookings, issuing travel documents and invoicing.',

        'terms.s10.b1.lead': 'Complaints',

        'terms.s10.b1.text': 'Any dissatisfaction arising on site must be reported promptly and in writing to the local provider and to the agency\'s representative, so that it can be remedied on the spot. Later complaints must be submitted in writing within 14 days of the end of the trip.',

        'terms.s10.b2.lead': 'Applicable law and disputes',

        'terms.s10.b2.text': 'These Terms and Conditions are governed by Romanian law. Any dispute will first be settled amicably. Where that is not possible, the dispute is submitted to the competent courts at FeelVoyage\'s registered office, and consumers may also refer the matter to ANPC (the National Authority for Consumer Protection).',

        'terms.s11.intro': 'For assistance, bookings or further information, our team is at your service:',

        'legal.ct.address': 'Address',

        'legal.ct.phone': 'Support and emergency phone',

        'legal.ct.email': 'E-mail',

        'legal.ct.hours': 'Opening hours',

        'legal.ct.hoursVal': 'Non-stop (24/7)',

        'legal.note': 'This document is drafted in Romanian. Translations are for guidance only; in case of any discrepancy, the Romanian version prevails.',

        'legal.updated': 'Last updated: September 2026',

        'privacy.subtitle': 'How we collect, use, store and protect your personal data.',

        'privacy.lead1': 'Welcome to the FeelVoyage website. We are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, store and protect your information when you visit our website and use our travel services.',

        'privacy.lead2': 'By using the website and our services, you agree to the practices described in this policy.',

        'privacy.s1.title': 'What personal data do we collect?',

        'privacy.s2.title': 'How do we use your data?',

        'privacy.s3.title': 'Who do we share your data with?',

        'privacy.s4.title': 'How long do we keep your data?',

        'privacy.s5.title': 'Your rights (under the GDPR)',

        'privacy.s6.title': 'Contact details and non-stop support',

        'privacy.s1.intro': 'To offer you the best travel experiences, we collect the following types of information:',

        'privacy.s1.b1.lead': 'Identification and contact data',

        'privacy.s1.b1.text': 'First and last name, e-mail address, telephone number and home / billing address.',

        'privacy.s1.b2.lead': 'Data needed for travel',

        'privacy.s1.b2.text': 'Passenger information (including date of birth or identity document / passport details, where airlines or hotels strictly require it for a booking), travel preferences and booking history.',

        'privacy.s1.b3.lead': 'Billing data',

        'privacy.s1.b3.text': 'The details needed to issue invoices.',

        'privacy.s1.b4.lead': 'Technical data',

        'privacy.s1.b4.text': 'IP address, browser type, operating system and how you browse our website, collected through cookies and similar technologies.',

        'privacy.s1.b5.lead': 'Account and chat',

        'privacy.s1.b5.text': 'If you create an account, we keep your name, telephone number and e-mail address; your password is handled by the authentication service and we cannot see it. Chat messages are processed by the virtual assistant: please do not write personal data in the chat, use the forms instead.',

        'privacy.s2.intro': 'The information we collect is used exclusively for the following purposes:',

        'privacy.s2.l1': 'processing, confirming and managing your bookings (flights, accommodation, holiday packages);',

        'privacy.s2.l2': 'providing customer assistance and non-stop (24/7) support for any issue related to your trip;',

        'privacy.s2.l3': 'sending important notifications about flight changes, check-in or travel rules;',

        'privacy.s2.l4': 'issuing invoices and meeting the financial and accounting obligations set by Romanian law;',

        'privacy.s2.l5': 'improving our services and, only with your prior consent, sending special offers or newsletters.',

        'privacy.s3.intro': 'We do not sell or trade your personal data. However, to honour your bookings we must share part of your data with trusted partners:',

        'privacy.s3.b1.lead': 'Travel service providers',

        'privacy.s3.b1.text': 'Airlines, hotels, transfer companies or local tour operators (who need your name to validate the booking).',

        'privacy.s3.b2.lead': 'Public authorities',

        'privacy.s3.b2.text': 'Customs or border police, only where the legislation of the destination countries requires it.',

        'privacy.s3.b3.lead': 'Technical partners',

        'privacy.s3.b3.text': 'Web hosting and infrastructure providers (including Google / Firebase, for accounts, booking requests and the virtual assistant), who are contractually required to protect your data.',

        'privacy.s4.p1': 'We keep your personal data only for as long as necessary for the purposes above or for the period required by applicable law (for example, financial and accounting documents must be kept by law for several years).',

        'privacy.s1.b6.lead': 'Technical log (no personal data)',

        'privacy.s1.b6.text': 'To fix errors and make the site faster we record technical events: errors, loading times, the general type of your device (screen size, memory, connection) and actions on the site (for example the category opened or the package viewed). We do not record names, e-mail addresses, phone numbers, passwords or texts you type into forms, searches or the chat. For account events (account creation, sign-in) we keep the account identifier, never the password. The log is stored in Firebase (Google) and can only be read by the administrator. We do not send the log if your browser sends “Do Not Track” or “Global Privacy Control”.',

        'privacy.s4.p2': 'Technical log entries are kept for at most 30 days and are then deleted by the administrator.',

        'privacy.s5.intro': 'Under the General Data Protection Regulation (GDPR), you have the following rights:',

        'privacy.s5.b1.lead': 'Right of access',

        'privacy.s5.b1.text': 'To find out what personal data we process about you.',

        'privacy.s5.b2.lead': 'Right to rectification',

        'privacy.s5.b2.text': 'To ask for incorrect or incomplete data to be corrected.',

        'privacy.s5.b3.lead': 'Right to erasure (“right to be forgotten”)',

        'privacy.s5.b3.text': 'To ask for your data to be deleted from our records if there is no longer a legal basis for keeping it.',

        'privacy.s5.b4.lead': 'Right to restriction of processing and data portability',

        'privacy.s5.b4.text': 'To ask us to limit how we process your data and to receive it in a structured format.',

        'privacy.s5.b5.lead': 'Right to object to direct marketing',

        'privacy.s5.b5.text': 'To refuse marketing communications at any time.',

        'privacy.s5.b6.lead': 'Right to lodge a complaint',

        'privacy.s5.b6.text': 'You can contact the National Supervisory Authority for Personal Data Processing (ANSPDCP).',

        'privacy.s5.exercise': 'To exercise your rights, write to us at the e-mail address in the contact section; we reply within one month at most.',

        'privacy.s6.intro': 'The FeelVoyage team is at your service 24/7 for any question about the privacy of your data or for planning your next holiday. You can contact us using the details below:',

        'privacy.ct.name': 'Agency name',

        'privacy.s6.p2': 'We reserve the right to change this Privacy Policy. Any update will be published on this page.',

        'anpc.subtitle': 'Alternative dispute resolution: what SAL is and where to turn if you have a complaint.',

        'anpc.s1.title': 'Contact us first',

        'anpc.s2.title': 'What is SAL?',

        'anpc.s3.title': 'How to request SAL resolution',

        'anpc.s4.title': 'Other ways to resolve a dispute',

        'anpc.s5.title': 'Official sources',

        'anpc.s1.p1': 'If you are unhappy with a booking or with FeelVoyage\'s services, write or call us: often the problem can be solved directly and quickly. Keep your evidence (the offer, confirmations, e-mails, invoices).',

        'anpc.s1.p2': 'See also the section on complaints in the',

        'anpc.s2.p1': 'Alternative dispute resolution (SAL, from the Romanian “soluționarea alternativă a litigiilor”) is a legal procedure that lets consumers settle disagreements with traders amicably, without going to court. The procedure is regulated and coordinated by ANPC (the National Authority for Consumer Protection).',

        'anpc.s2.p2': 'SAL is voluntary and, as a rule, free of charge or low-cost. It applies to disputes arising from sales or service contracts between consumers and traders, in the sectors where ANPC is competent. Your right to go to court always remains valid.',

        'anpc.s2.tip': 'The European online dispute resolution platform (ODR) has been abolished by Regulation (EU) 2024/3228 and is no longer available.',

        'anpc.s3.l1': 'Contact the trader (FeelVoyage) first and try to solve the problem directly; keep your evidence.',

        'anpc.s3.l2': 'If you have not reached a solution, fill in the SAL request online on the ANPC portal (reclamatiisal.anpc.ro) or download the form from anpc.ro.',

        'anpc.s3.l3': 'Attach the relevant documents (the contract or offer, proof of payment, correspondence) and proof that you contacted the trader.',

        'anpc.s3.l4': 'The SAL entity examines the request and communicates the proposed solution; the court route remains open.',

        'anpc.s3.tip': 'As a general rule, the request must be submitted within 1 year of the date you contacted the trader or of the event complained about (Government Ordinance No. 38/2015). The exact conditions are those published on the ANPC website.',

        'anpc.s4.b1.lead': 'Complaint to ANPC',

        'anpc.s4.b1.text': 'You can file a complaint with the National Authority for Consumer Protection, using your real details (not anonymously), the name of the trader, a description of the situation and supporting documents. Head office: Bulevardul Aviatorilor no. 72, sector 1, Bucharest.',

        'anpc.s4.b2.lead': 'European Consumer Centre Romania (ECC Romania)',

        'anpc.s4.b2.text': 'If the dispute involves a trader from another EU country (for example, an airline or a hotel abroad), ECC Romania provides free information and support with an amicable settlement.',

        'anpc.s4.b3.lead': 'Court',

        'anpc.s4.b3.text': 'You can always take the matter to the competent courts, under the conditions set by law.',

        'anpc.s5.p1': 'The information above is general and for guidance only; it does not replace legal advice. The official and most up-to-date source is the ANPC website.',

        'accept.label': 'Acceptance',

        'accept.terms': 'I have read and accept the Terms and Conditions',

        'accept.privacy': 'I have read and accept the Privacy Policy',

        'accept.anpc': 'I have read and taken note of the ANPC / SAL information',

        'accept.btn': 'Accept',

        'accept.done': 'Accepted on {date}',

        'accept.withdraw': 'Withdraw acceptance',


        'accept.status': 'Acceptance status',

        'accept.toast': 'Thank you! Your acceptance has been saved.',

        'accept.toastOff': 'Acceptance withdrawn.',

        'accept.noteOut': 'Acceptance given without an account is saved only on this device. Log in to save it to your account and see it on any device.',

        'accept.noteIn': 'Your acceptance is saved to your account, with the date and the document version, and you can see it on any device. FeelVoyage can view it.',

        'accept.login': 'Log in',

        'accept.error': 'I couldn\'t save your acceptance to your account. Check your internet connection and try again.',

        'admin.consents': 'Document acceptances',

        'admin.consentNone': 'not accepted',

        'admin.consentOff': 'withdrawn on {date}',

        'admin.consentOld': 'old version ({v})',

        'hero.statAccounts': 'Accounts Created',

































































        // Auth System
        'auth.loginBtn': 'My Account',
        'auth.modalTitle': 'Welcome to FeelVoyage',
        'auth.modalSubtitle': 'Sign in for faster bookings and personalized offers',
        'auth.tabLogin': 'Sign In',
        'auth.tabRegister': 'Sign Up',
        'auth.emailLabel': 'E-mail',
        'auth.passwordLabel': 'Password',
        'auth.password2Label': 'Confirm password',
        'auth.nameLabel': 'Full name',
        'auth.phoneLabel': 'Phone',
        'auth.errorPhone': 'Enter a valid phone number, in Romanian (07XX XXX XXX) or international format (ex: +40 7XX XXX XXX).',
        'auth.loginSubmit': 'Sign in',
        'auth.registerSubmit': 'Create free account',
        'auth.optionalNote': 'The account is optional — you can always book without one. Demo account data is stored only locally, on your device.',
        'nav.toDark': 'Switch to dark mode',
        'nav.toLight': 'Switch to light mode',
        'nav.menu': 'Menu',
        'counter.live': 'Live: every visitor sees the same number',
        'counter.error': 'Could not save your click. Check your internet connection.',
        'order.error': 'We could not send your request. Please try again or call us at 0799 927 590.',
        'chat.ai.note': 'Answers are generated by AI and may contain mistakes. Please do not share personal data in the chat.',
        'chat.ai.short': 'AI-generated answers · may contain mistakes',
        'auth.adminChip': 'Administrator',
        'admin.usersBtn': 'Users',
        'admin.panelTitle': 'Admin panel',
        'admin.viewSub': 'Profile view · read only',
        'admin.count': '{n} users',
        'admin.countOf': '{n} of {total} users',
        'admin.search': 'Search by name, e-mail or phone',
        'admin.refresh': 'Refresh',
        'admin.close': 'Close',
        'admin.loading': 'Loading users...',
        'admin.empty': 'There are no users with a saved profile yet.',
        'admin.noMatch': 'No users match.',
        'admin.errForbidden': 'You do not have permission to see the users. Check that you published the rules from firebase-rules.json and that your account is marked as administrator in the database.',
        'admin.errNetwork': 'I could not reach the server. Check your internet connection and try again.',
        'admin.errUnsupported': 'The admin panel only works with Firebase configured.',
        'admin.retry': 'Try again',
        'admin.back': 'Back to the list',
        'admin.viewBanner': 'You are seeing this user\'s profile the way they see it. Administrator mode, read only: you cannot change anything.',
        'admin.details': 'Account details (only you can see them)',
        'admin.phone': 'Phone',
        'admin.email': 'E-mail',
        'admin.since': 'Member since',
        'admin.uid': 'Account ID',
        'admin.copy': 'Copy',
        'admin.copied': 'Copied!',
        'admin.noEmail': 'unknown (appears after the user\'s next login)',
        'admin.noPhone': 'not provided',
        'admin.you': 'you',
        'chat.admin.status': 'Administrator mode • No topic limits',
        'chat.admin.note': 'Administrator mode: AI answers, no topic limit',
        'chat.admin.greeting': 'Hello, administrator! 🛡️ You have free access: ask me anything, not only about the site or travel (code, texts, ideas, calculations...). What would you like to know?',
        'chat.admin.placeholder': 'Ask anything...',
        'chat.admin.aiDown': 'The AI assistant is not available right now (details in the browser console, F12). I will answer with the prepared answers.',
        'chat.ai.recaptcha': 'Protected by reCAPTCHA; the Google',
        'chat.ai.privacy': 'Privacy Policy',
        'chat.ai.and': 'and',
        'chat.ai.terms': 'Terms of Service',
        'chat.ai.offTopic': 'I can only help with questions about the FeelVoyage agency, our website and holiday destinations. 🌍 Ask me, for example, about the available packages, prices or what to see in a destination!',
        'chat.ai.limit': 'You have reached the question limit for this session. You can call us at **0799 927 590** or pick one of the options below.',
        'dest.perPerson': 'pers.',
        'modal.adults': 'Adults',
        'modal.adultsHint': 'over 12 years',
        'modal.kids04': 'Children 0–4',
        'modal.kids04Hint': 'under 5 years',
        'modal.kids512': 'Children 5–12',
        'modal.kids512Hint': '5 to 12 years',
        'modal.kidsHint': 'Children sharing a room with 2 adults get a reduced rate; a child travelling with only one adult pays the full price.',
        'modal.included': 'Included',
        'modal.unavailable': 'Unavailable',
        'modal.unitPerson': '/ person',
        'modal.unitGroup': '/ group',
        'modal.unitDay': '/ day',
        'quote.title': 'Price estimate',
        'quote.nightsWord': 'nights',
        'quote.total': 'Total',
        'quote.perPerson': 'Average price / person',
        'quote.person': 'person',
        'quote.persons': 'people',
        'quote.adultsLine': '{n} × adult ({unit})',
        'quote.kids04Line': '{n} × child 0–4 ({pct}% of price)',
        'quote.kids512Line': '{n} × child 5–12 ({pct}% of price)',
        'quote.singleLine': 'Single room supplement ({perNight} × {nights} nights)',
        'quote.seasonLine': 'Seasonal supplement: {month} (+{pct}%)',
        'quote.groupLine': '{name} (per group)',
        'quote.carLine': '{name} ({cars} × {days} days × {unit})',
        'quote.noteDate': 'The "from" price is for low season. Pick your departure date to see the exact seasonal price.',
        'quote.noteLow': 'The chosen date is in low season: the base price applies.',
        'quote.disclaimer': 'Estimate for a double room, for information only. The final offer and availability are confirmed by a consultant. Personal expenses, local city taxes and optional sights or excursions you did not select are not included.',
        'modal.dateFrom': 'Departure',
        'modal.dateTo': 'Return',
        'modal.datePlaceholder': 'dd/mm/yyyy',
        'modal.dateHintStart': 'Pick your departure date in the calendar.',
        'modal.dateHintEnd': 'Pick your return date ({min}–{max} nights).',
        'modal.dateHintFixed': 'Fixed-length tour of {n} nights: the return date is filled in automatically.',
        'modal.dateDuration': 'Length of stay: {n} nights',
        'modal.dateDurationStd': 'Length of stay: {n} nights (standard package: {std})',
        'modal.dateChangeEnd': 'you can change the return date',
        'modal.dateClear': 'Clear',
        'modal.dateDone': 'Done',
        'modal.datePrev': 'Previous month',
        'modal.dateNext': 'Next month',
        'modal.dateRequired': 'Please choose your departure and return dates.',
        'quote.noteDuration': 'The price is adjusted to your chosen length of stay (the standard package is {std} nights).',
        'auth.forgot': 'Forgot your password?',
        'auth.resetSent': 'If an account exists for this e-mail, we sent you a password reset link.',
        'auth.resetNeedEmail': 'Please type your e-mail address in the field above first.',
        'auth.errorInvalidEmail': 'This e-mail address is not valid.',
        'auth.errorNetwork': 'Could not reach the server. Check your internet connection and try again.',
        'auth.errorTooMany': 'Too many attempts. Please try again in a few minutes.',
        'auth.errorGeneric': 'Something went wrong. Please try again.',
        'auth.optionalNoteCloud': 'The account is optional — you can always book without one. You can sign in from any device with the same e-mail and password.',
        'auth.termsNote': 'By registering you accept the FeelVoyage Terms & Conditions and Privacy Policy.',
        'auth.errorLogin': 'Incorrect e-mail or password.',
        'auth.errorName': 'Please enter your first and last name.',
        'auth.errorPasswordShort': 'The password must be at least 6 characters long.',
        'auth.errorPasswordMatch': 'Passwords do not match.',
        'auth.errorEmailUsed': 'An account with this e-mail already exists. Please sign in.',
        'auth.welcomeBack': 'Welcome back',
        'auth.googleBtn': 'Continue with Google',
        'auth.orDivider': 'or',
        'auth.googleWelcome': 'Welcome',
        'auth.errorPopupBlocked': 'Your browser blocked the Google window. Allow pop-ups for this site and try again.',
        'auth.errorAccountExists': 'An account with this e-mail already exists, created with a password. Sign in with the password, then you can also use Google.',
        'auth.registerSuccess': 'Your account has been created. Welcome',
        'auth.loggedOut': 'You have been signed out. See you soon!',
        'auth.dropdownHello': 'Hello',
        'auth.dropdownGuest': 'Sign in for faster bookings and exclusive offers.',
        'auth.profileBtn': 'My profile',
        'auth.viewDestinations': 'Browse destinations',
        'auth.logoutBtn': 'Sign out',
        'auth.memberChip': 'FeelVoyage Member',
        'auth.perksTitle': 'Your account benefits',
        'auth.perk1': 'Pre-filled bookings — no more typing your details',
        'auth.perk2': 'Exclusive member offers',
        'auth.perk3': 'Priority response from your consultant',

        // Contact Section
        'contact.badge': 'Let\'s Talk',
        'contact.title': 'We Are Here for You',
        'contact.subtitle': 'You can visit us at our office in Tg-Jiu or contact us directly by phone, email or social media.',
        'contact.addressTitle': 'Office Address',
        'contact.address': 'Tudor Vladimirescu Street, No. 124, Tg-Jiu, Romania',
        'contact.phoneTitle': 'Phone & WhatsApp',
        'contact.facebookTitle': 'Official Facebook Page',
        'contact.emailTitle': 'Support & Offers Email',
        'contact.mapLabel': 'Str. Tudor Vladimirescu No. 124, Tg-Jiu',
        'contact.formTitle': 'Send a Quote Request',
        'contact.formSubtitle': 'Fill out the form below and a consultant will contact you within 2 business hours at most.',
        'contact.formName': 'Full Name',
        'contact.formNamePlaceholder': 'ex: John Smith',
        'contact.formPhone': 'Phone Number',
        'contact.formPhonePlaceholder': 'ex: +40 722 000 000',
        'contact.formEmail': 'Email Address',
        'contact.formEmailPlaceholder': 'john.smith@email.com',
        'contact.formDest': 'Desired Destination',
        'contact.formDestPlaceholder': 'ex: Maldives, Santorini, etc.',
        'contact.formMsg': 'Message or Travel Details',
        'contact.formMsgPlaceholder': 'Specify the number of people, estimated period, budget or any other special requirements...',
        'contact.formBtn': 'Send Quote Request',
        'contact.success': 'Thank you! Your request has been registered. We will contact you shortly!',

        // Footer
        'footer.descAddr': 'Tudor Vladimirescu Street, No. 124, Tg-Jiu, Romania.',
        'footer.descTagline': 'Travel agency dedicated to memorable experiences worldwide.',
        'footer.navTitle': 'Quick Navigation',
        'footer.navHome': 'Home',
        'footer.navDest': 'Packages & Destinations',
        'footer.navAbout': 'About FeelVoyage',
        'footer.navServ': 'Travel Services',
        'footer.navContact': 'Contact & Support',
        'footer.destTitle': 'Exclusive Destinations',
        'footer.fbTitle': 'Follow Us on Facebook',
        'footer.fbDesc': 'Connect with us on Facebook for daily offers and travel news!',
        'footer.fbBtn': 'Open Facebook Page',
        'footer.copyright': '© 2026 FeelVoyage Romania. All rights reserved.',
        'footer.terms': 'Terms and Conditions',
        'footer.privacy': 'Privacy Policy',
        'footer.anpc': 'ANPC / SAL',

        // Chat Widget
        'chat.headerTitle': 'FeelVoyage Assistant',
        'chat.headerStatus': 'Online • Replies in seconds',
        'chat.placeholder': 'Type a message...',

        // Booking Modal
        'modal.priceLabel': 'Price / person',
        'modal.descTitle': 'Package & Destination Description',
        'modal.amenitiesTitle': 'Included Services & Amenities',
        'modal.bookingTitle': 'Book or Request Additional Information',
        'modal.namePlaceholder': 'Your name',
        'modal.phonePlaceholder': 'Phone',
        'modal.emailPlaceholder': 'Email',
        'modal.emailError': 'Email must contain @business.com, @gmail.com or @yahoo.com',
        'modal.nameError': 'Please enter your First and Last Name (ex: John Smith)',
        'modal.phoneError': 'Invalid phone number. Use international format (ex: +40 7XX XXX XXX)',
        'modal.dateError': 'Date must be from 2026 or later',
        'modal.travelersLabel': 'Number of Travelers',
        'modal.travelers1': '1 Person',
        'modal.travelers2': '2 People',
        'modal.travelers3': '3 People',
        'modal.travelers4': '4+ People (Group)',
        'modal.periodLabel': 'Estimated Period',
        'modal.servicesTitle': 'Choose Desired Services',
        'modal.serviceTransport': 'Transport (flight/coach)',
        'modal.serviceCazare': 'Hotel accommodation',
        'modal.serviceTransfer': 'Airport-hotel transfer',
        'modal.serviceMeals': 'Half board / Breakfast',
        'modal.serviceTickets': 'Attraction tickets',
        'modal.serviceInsurance': 'Travel insurance',
        'modal.serviceGuide': 'Local guide',
        'modal.serviceCar': 'Car rental',
        'modal.submitBtn': 'Send Booking Request',

        // Thank You Overlay
        'thankyou.title': 'Thank You!',
        'thankyou.msg': 'Your booking request has been successfully sent. A FeelVoyage agent will contact you as soon as possible.',

        // Destinations
        'dest.delta-dunarii.title': 'Danube Delta - Nature Sanctuary',
        'dest.delta-dunarii.tagLabel': 'Romania • Nature',
        'dest.delta-dunarii.period': '4 Nights / Full Board',
        'dest.delta-dunarii.description': 'Boat rides through meandering channels, pelican colonies, white water lilies and traditional fish gastronomy in Sfântu Gheorghe and Sulina. Accommodation in a 4-star floating resort with breakfast and fishermen\'s lunch.',
        'dest.delta-dunarii.amenities': 'Boat Excursions|4★ Resort|Full Board|Sturgeon Tasting|Local Guide',

        'dest.poiana-brasov.title': 'Poiana Brașov - Alpine Indulgence',
        'dest.poiana-brasov.tagLabel': 'Romania • Mountain',
        'dest.poiana-brasov.period': '3 Nights / Spa & Half Board',
        'dest.poiana-brasov.description': 'Relaxation at the foot of Postăvarul Massif! Enjoy fresh mountain air, fascinating hiking trails, unlimited access to the luxury Spa center and a gondola ride to Postăvarul Peak.',
        'dest.poiana-brasov.amenities': 'Spa & Sauna Access|4★ Spa Hotel|Half Board|Gondola Ticket|Free Parking',

        'dest.bran-brasov.title': 'Bran Castle & Medieval Brașov',
        'dest.bran-brasov.tagLabel': 'Romania • Culture',
        'dest.bran-brasov.period': '3 Nights / Breakfast',
        'dest.bran-brasov.description': 'Discover the legend of Bran Castle, the Black Church in Brașov\'s Council Square and the charming atmosphere of medieval streets. The package includes guided access and a traditional banquet dinner.',
        'dest.bran-brasov.amenities': 'Bran Castle Tour|4★ Boutique Hotel|Traditional Dinner|Guided Brașov Tour',

        'dest.transfagarasan.title': 'Transfăgărășan & Bâlea Lake',
        'dest.transfagarasan.tagLabel': 'Romania • Adventure',
        'dest.transfagarasan.period': '3 Nights / Half Board',
        'dest.transfagarasan.description': 'The most spectacular mountain road in the world! Drive the amazing serpentines of the Făgăraș Mountains, visit the glacial Bâlea Lake and Bâlea Waterfall with guided hiking options.',
        'dest.transfagarasan.amenities': 'Hotel at Bâlea Lake|Half Board|Mountain Guide|Panoramic Drive Tour',

        'dest.cazanele-dunarii.title': 'Danube Gorge & Decebalus Statue',
        'dest.cazanele-dunarii.tagLabel': 'Romania • Cruising',
        'dest.cazanele-dunarii.period': '3 Nights / Half Board',
        'dest.cazanele-dunarii.description': 'Spectacular Danube cruise through the Great and Small Danube Boilers. Admire the monumental sculpture of Decebalus, Trajan\'s Tablet and Ponicova Cave in the Danube Clisura.',
        'dest.cazanele-dunarii.amenities': 'Boat Cruise|4★ Guesthouse with Pool|Half Board|Local Guide',

        'dest.maramures.title': 'Maramureș - Tradition & Wooden Churches',
        'dest.maramures.tagLabel': 'Romania • Tradition',
        'dest.maramures.period': '5 Nights / Full Board',
        'dest.maramures.description': 'Feel the authentic Maramureș spirit! Ride the Mocănița on the Vaser Valley, visit the Merry Cemetery in Săpânța and the UNESCO heritage wooden churches.',
        'dest.maramures.amenities': 'Mocănița Ticket|Traditional Guesthouse|Full Board|Horincă Tasting',

        'dest.sibiu-sighisoara.title': 'Sibiu & Sighișoara - Heart of Transylvania',
        'dest.sibiu-sighisoara.tagLabel': 'Romania • Historic',
        'dest.sibiu-sighisoara.period': '3 Nights / Breakfast',
        'dest.sibiu-sighisoara.description': 'The Bridge of Lies in Sibiu and the inhabited medieval citadel of Sighișoara. A fascinating journey into Saxon architecture and Transylvanian cuisine.',
        'dest.sibiu-sighisoara.amenities': '4★ Central Hotel|Breakfast|Guided Walking Tour|Wine Tasting',

        'dest.mamaia-constanta.title': 'Mamaia & Romanian Seaside',
        'dest.mamaia-constanta.tagLabel': 'Romania • Beach',
        'dest.mamaia-constanta.period': '5 Nights / All Inclusive',
        'dest.mamaia-constanta.description': 'Black Sea coastal stay at Blue Flag beaches, modern resorts in Mamaia Nord and a visit to the Constanța Casino and Tomis Port.',
        'dest.mamaia-constanta.amenities': '4★ Beachfront Resort|All Inclusive|Sunbeds Included|Aquapark Access',

        'dest.roma.title': 'Rome - The Eternal City, Italy',
        'dest.roma.tagLabel': 'City Break • Culture',
        'dest.roma.period': '4 Nights / Breakfast',
        'dest.roma.description': 'Step into history! The Colosseum, Trevi Fountain, Roman Forum and Vatican await you with authentic gelato and exquisite Italian cuisine.',
        'dest.roma.amenities': 'Flight Included|4★ Central Hotel|Breakfast|Colosseum Fast-Track Ticket',

        'dest.barcelona.title': 'Barcelona - Sagrada Familia & Sea',
        'dest.barcelona.tagLabel': 'City Break • Beach',
        'dest.barcelona.period': '4 Nights / Breakfast',
        'dest.barcelona.description': 'Gaudi\'s masterpieces, Park Güell, La Rambla boulevard and the vibrant beaches of Barceloneta. A spectacular combination of culture and Mediterranean atmosphere.',
        'dest.barcelona.amenities': 'Direct Flight|4★ Hotel Near Beach|Breakfast|Sagrada Entrance',

        'dest.londra.title': 'London - Royal Metropolis',
        'dest.londra.tagLabel': 'City Break • Shopping',
        'dest.londra.period': '4 Nights / Breakfast',
        'dest.londra.description': 'Big Ben, London Eye, Buckingham Palace and the cosmopolitan atmosphere of Covent Garden. Includes a double-decker bus tour and access to top British museums.',
        'dest.londra.amenities': 'Flight Included|4★ Central Hotel|London Eye Pass|Breakfast',

        'dest.praga.title': 'Prague - City of 100 Spires',
        'dest.praga.tagLabel': 'City Break • Romantic',
        'dest.praga.period': '3 Nights / Breakfast',
        'dest.praga.description': 'Charles Bridge at sunrise, the Astronomical Clock in Old Town Square and Prague Castle. A relaxing Vltava River cruise with romantic dinner included.',
        'dest.praga.amenities': 'Direct Flight|4★ Central Hotel|Vltava Cruise|Breakfast',

        'dest.viena.title': 'Vienna - Elegance of Imperial Palaces',
        'dest.viena.tagLabel': 'City Break • Elegance',
        'dest.viena.period': '3 Nights / Breakfast',
        'dest.viena.description': 'Schönbrunn Palace, Viennese opera and the famous Sachertorte cake. A royal-class experience in the heart of Central Europe.',
        'dest.viena.amenities': 'Flight Included|4★ Superior Hotel|Schönbrunn Entrance|Breakfast',

        'dest.paris.title': 'Paris - City of Lights & Eiffel Tower',
        'dest.paris.tagLabel': 'City Break • Romance',
        'dest.paris.period': '3 Nights / Breakfast',
        'dest.paris.description': 'Discover the romance of Paris, the Eiffel Tower, the Louvre Museum and charming French restaurants. Includes direct flight and 4-star boutique hotel accommodation.',
        'dest.paris.amenities': 'Direct Flight|4★ Central Hotel|Breakfast|Private Guided Tour',

        'dest.maldive-deluxe.title': 'Maldives - Water Villa Deluxe Resort',
        'dest.maldive-deluxe.tagLabel': 'Exotic • Luxury',
        'dest.maldive-deluxe.period': '7 Nights / Premium All Inclusive',
        'dest.maldive-deluxe.description': 'Exclusive villas built directly over the turquoise waters of the ocean. Snorkeling with manta rays, romantic beach dinners and world-class Spa treatments.',
        'dest.maldive-deluxe.amenities': 'Flight Included|5★ Overwater Villa|Premium All Inclusive|Seaplane Transfer',

        'dest.kenya-safari.title': 'Kenya - Safari in Masai Mara & Beach',
        'dest.kenya-safari.tagLabel': 'Exotic • Adventure',
        'dest.kenya-safari.period': '8 Nights / Circuit & Resort',
        'dest.kenya-safari.description': 'An unforgettable safari adventure to see lions, elephants and giraffes in the Masai Mara reserve, followed by relaxation on exotic white-sand beaches in Diani Beach.',
        'dest.kenya-safari.amenities': 'Flight Included|5★ Safari Lodge|4x4 Game Drives|Full Board',

        'dest.bali.title': 'Bali - Ubud & Seminyak Beach',
        'dest.bali.tagLabel': 'Exotic • Relaxation',
        'dest.bali.period': '10 Nights / Half Board',
        'dest.bali.description': 'A magical combination of historic temples and rice terraces in Ubud with relaxation at luxury villas with private pools on the exotic beaches of Seminyak.',
        'dest.bali.amenities': 'Flight Included|5★ Pool Villas|Temple Excursions|Spa Massage Included',

        'dest.santorini.title': 'Santorini - Dream Sunsets, Greece',
        'dest.santorini.tagLabel': 'Beach • Romance',
        'dest.santorini.period': '5 Nights / Breakfast',
        'dest.santorini.description': 'White houses with blue domes suspended above the Aegean Sea. Stay in Oia with direct views of the famous Santorini sunset and a catamaran cruise.',
        'dest.santorini.amenities': 'Direct Flight|4★ Boutique Hotel|Catamaran Cruise|Breakfast',

        'dest.tokyo.title': 'Tokyo & Kyoto - Japan Circuit',
        'dest.tokyo.tagLabel': 'Exotic • Culture',
        'dest.tokyo.period': '9 Nights / Guided Circuit',
        'dest.tokyo.description': 'Fascinating contrasts between ultra-modern skyscrapers and traditional Shinto temples. Complete circuit with the Shinkansen bullet train and a Romanian-speaking guide.',
        'dest.tokyo.amenities': 'Flight Included|JR Pass Bullet Train|4★ Hotels|Romanian Guide',

        'dest.alpi-elvetia.title': 'Swiss Alps & Matterhorn',
        'dest.alpi-elvetia.tagLabel': 'Mountain • Landscapes',
        'dest.alpi-elvetia.period': '6 Nights / Half Board',
        'dest.alpi-elvetia.description': 'Spectacular alpine mountain landscapes, rides on the iconic Glacier Express train and fresh air in Zermatt near the Matterhorn Mountain.',
        'dest.alpi-elvetia.amenities': 'Flight & Train Included|4★ Mountain Resort|Glacier Express Pass|Alpine Spa',

        'dest.dubai.title': 'Dubai - Skyscrapers & Safari',
        'dest.dubai.tagLabel': 'City Break • Luxury',
        'dest.dubai.period': '5 Nights / Half Board',
        'dest.dubai.description': 'Burj Khalifa, 4x4 jeep safari on golden sand dunes, fountain shows and ultramodern beaches in Jumeirah.',
        'dest.dubai.amenities': 'Direct Flight|5★ Hotel|Desert Safari|Burj Khalifa Ticket',

        'dest.cappadocia.title': 'Cappadocia - Hot Air Balloons',
        'dest.cappadocia.tagLabel': 'Exotic • Adventure',
        'dest.cappadocia.period': '4 Nights / Breakfast',
        'dest.cappadocia.description': 'Fabulous sunsets dotted with hundreds of colorful balloons, hotels carved into rock and amazing lunar valleys in Turkey.',
        'dest.cappadocia.amenities': 'Flight Included|Cave Hotel|Optional Balloon Flight|Valley Tour',

        'dest.newyork.title': 'New York - City of Dreams',
        'dest.newyork.tagLabel': 'City Break • Shopping',
        'dest.newyork.period': '6 Nights / Accommodation',
        'dest.newyork.description': 'Times Square, Central Park, the Statue of Liberty and Broadway shows. The heart of the modern world awaits you with a memorable atmosphere.',
        'dest.newyork.amenities': 'Flight Included|4★ Manhattan Hotel|CityPass Included|Tourist Assistance',

        // Asia Destinations
        'dest.beijing-marele-zid.title': 'Beijing & the Great Wall of China',
        'dest.beijing-marele-zid.tagLabel': 'China • Culture & History',
        'dest.beijing-marele-zid.period': '7 Nights / Guided Tour',
        'dest.beijing-marele-zid.description': 'The Great Wall at Mutianyu, the Forbidden City, Tiananmen Square and the Temple of Heaven. Guided tour in Romanian with a traditional Peking Opera evening and a Peking Duck dinner.',
        'dest.beijing-marele-zid.amenities': 'Flight Included|Guided Tour (RO)|Central 4★ Hotel|Great Wall & Forbidden City|Peking Duck Dinner',
        'dest.shanghai-metropola-futurului.title': 'Shanghai - Metropolis of the Future',
        'dest.shanghai-metropola-futurului.tagLabel': 'China • City Break',
        'dest.shanghai-metropola-futurului.period': '5 Nights / Breakfast',
        'dest.shanghai-metropola-futurului.description': 'The futuristic Pudong skyline, strolls along the Bund on the Huangpu river, Yu Garden and the former French Concession. An evening cruise with views of the illuminated metropolis.',
        'dest.shanghai-metropola-futurului.amenities': 'Flight Included|4★ Pudong Hotel|Huangpu River Cruise|Yu Garden|Panoramic Tour',
        'dest.zhangjiajie-avatar.title': 'Zhangjiajie - The Avatar Mountains',
        'dest.zhangjiajie-avatar.tagLabel': 'China • Nature & Adventure',
        'dest.zhangjiajie-avatar.period': '6 Nights / Full Board',
        'dest.zhangjiajie-avatar.description': 'The quartzite pillars that inspired the mountains in the movie Avatar, the Zhangjiajie Glass Bridge (the longest in the world) and the Bailong elevator carved into the cliff face. An unforgettable adventure in the National Forest Park.',
        'dest.zhangjiajie-avatar.amenities': 'Flight Included|UNESCO National Park|Glass Bridge|Bailong Elevator|Mountain Guide',
        'dest.seoul-coreea.title': 'Seoul - Heart of South Korea',
        'dest.seoul-coreea.tagLabel': 'South Korea • City Break',
        'dest.seoul-coreea.period': '6 Nights / Breakfast',
        'dest.seoul-coreea.description': 'Gyeongbokgung Palace with the changing of the guard ceremony, the Bukchon hanok village, N Seoul Tower, the Gangnam and Myeongdong districts plus a street food gastronomic tour through the night markets.',
        'dest.seoul-coreea.amenities': 'Flight Included|4★ Myeongdong Hotel|Palace & Hanok Tour|Street Food Tour|T-Money Transport Card',
        'dest.busan-coreea.title': 'Busan - South Korea\'s Marine City',
        'dest.busan-coreea.tagLabel': 'South Korea • Beach & City',
        'dest.busan-coreea.period': '6 Nights / Breakfast',
        'dest.busan-coreea.description': 'The spectacular illuminated Gwangan Bridge, Haeundae Beach, the Haedong Yonggungsa temple on cliffs above the sea and the pojangmacha tents serving delicious Korean street food.',
        'dest.busan-coreea.amenities': 'Flight Included|4★ Haeundae Hotel|Temple by the Sea|Jagalchi Fish Market|Gwangan View',
        'dest.jeju-insula-vulcanica.title': 'Jeju - South Korea\'s Volcanic Island',
        'dest.jeju-insula-vulcanica.tagLabel': 'South Korea • Beach & Nature',
        'dest.jeju-insula-vulcanica.period': '7 Nights / All Inclusive',
        'dest.jeju-insula-vulcanica.description': 'Seongsan Ilchulbong volcano, turquoise beaches like Hamdeok, the Manjanggul lava tube and the famous haenyeo women divers. South Korea\'s island paradise and a UNESCO heritage site.',
        'dest.jeju-insula-vulcanica.amenities': 'Flight Included|5★ Beachfront Resort|All Inclusive|UNESCO Volcano Tour|Rental Car Included',

        // Pachete noi: America, Marea Britanie, Norvegia, Africa
        'dest.yosemite.title': 'Yosemite - California\'s National Park',
        'dest.yosemite.tagLabel': 'USA • Nature',
        'dest.yosemite.period': '8 Nights / Breakfast',
        'dest.yosemite.description': 'Towering granite walls, huge waterfalls and sequoia forests in the heart of the Sierra Nevada. See El Capitan and Half Dome, walk through Yosemite Valley and drive up to Glacier Point, staying in a lodge inside the park.',
        'dest.yosemite.amenities': 'Flight Included|Lodge in the Park|Guided Valley Tour|Park Entry Included',
        'dest.grand-canyon.title': 'Grand Canyon - South Rim',
        'dest.grand-canyon.tagLabel': 'USA • Adventure',
        'dest.grand-canyon.period': '7 Nights / Breakfast',
        'dest.grand-canyon.description': 'Endless views from the South Rim at sunrise and sunset, walks along the canyon edge and stops at Mather Point and Desert View. Flight included, accommodation near the park and a guided tour of the viewpoints.',
        'dest.grand-canyon.amenities': 'Flight Included|Hotel Near the Park|South Rim Sunrise|Guided Viewpoint Tour',
        'dest.san-francisco.title': 'San Francisco - Golden Gate & Alcatraz',
        'dest.san-francisco.tagLabel': 'USA • City Break',
        'dest.san-francisco.period': '6 Nights / Breakfast',
        'dest.san-francisco.description': 'Cross the Golden Gate Bridge, ride a cable car, photograph the Painted Ladies at Alamo Square and see Alcatraz across the bay. A city of hills, fog and unforgettable views.',
        'dest.san-francisco.amenities': 'Flight Included|4★ Central Hotel|Golden Gate Tour|Cable Car Ticket',
        'dest.hawaii.title': 'Hawaii - Maui & Big Island',
        'dest.hawaii.tagLabel': 'USA • Beach',
        'dest.hawaii.period': '9 Nights / Breakfast',
        'dest.hawaii.description': 'Golden and black sand beaches, sunsets at Kaanapali, the Road to Hana and volcanic shores on the Big Island. Nine nights between ocean, waterfalls and lava landscapes, staying at a beachfront resort.',
        'dest.hawaii.amenities': 'Flight Included|Beachfront Resort|Road to Hana Excursion|Big Island Tour',
        'dest.banff.title': 'Banff & Lake Louise - Canadian Rockies',
        'dest.banff.tagLabel': 'Canada • Mountains',
        'dest.banff.period': '8 Nights / Breakfast',
        'dest.banff.description': 'Turquoise lakes, snowy peaks and conifer forests in the Canadian Rockies. Canoeing on Lake Louise, hikes with glacier views and evenings at your hotel in Banff.',
        'dest.banff.amenities': 'Flight Included|Hotel in Banff|Lake Louise Canoeing|Park Entry Included',
        'dest.machu-picchu.title': 'Machu Picchu - The Inca Citadel',
        'dest.machu-picchu.tagLabel': 'Peru • Culture & History',
        'dest.machu-picchu.period': '9 Nights / Guided Circuit',
        'dest.machu-picchu.description': 'Cusco, the Sacred Valley and the climb to Machu Picchu, the Inca citadel hidden between mountains and clouds. A guided circuit with a panoramic train, 4★ hotels and a full visit of the ruins and terraces.',
        'dest.machu-picchu.amenities': 'Flight Included|Panoramic Train|4★ Hotels|Machu Picchu Ticket',
        'dest.rio.title': 'Rio de Janeiro - Christ the Redeemer & Copacabana',
        'dest.rio.tagLabel': 'Brazil • City & Beach',
        'dest.rio.period': '8 Nights / Breakfast',
        'dest.rio.description': 'Ride up to the Christ the Redeemer statue, admire Sugarloaf Mountain and enjoy Copacabana and Ipanema beaches. A city between mountains, ocean and samba rhythms.',
        'dest.rio.amenities': 'Flight Included|Beach Hotel|Christ the Redeemer Tour|Sugarloaf Cable Car',
        'dest.patagonia.title': 'Patagonia - Torres del Paine',
        'dest.patagonia.tagLabel': 'Chile • Adventure',
        'dest.patagonia.period': '10 Nights / Full Board',
        'dest.patagonia.description': 'The granite Torres del Paine towers, milky-blue lakes, glaciers and waterfalls in southern Chile. Daily guided hikes and stays in lodges at the edge of the park.',
        'dest.patagonia.amenities': 'Flight Included|Lodge at the Park Edge|Guided Hikes|Full Board',
        'dest.edinburgh.title': 'Edinburgh - Scotland\'s Capital',
        'dest.edinburgh.tagLabel': 'Scotland • City Break',
        'dest.edinburgh.period': '4 Nights / Breakfast',
        'dest.edinburgh.description': 'The castle on the rock, the Royal Mile, Calton Hill and the view from Arthur\'s Seat in a medieval city full of legends. Walks through the Old Town and New Town, with evenings at the pub.',
        'dest.edinburgh.amenities': 'Flight Included|4★ Central Hotel|Old Town Guided Tour|Breakfast',
        'dest.norvegia-fiorduri.title': 'Norway - Geirangerfjord',
        'dest.norvegia-fiorduri.tagLabel': 'Norway • Fjords',
        'dest.norvegia-fiorduri.period': '6 Nights / Breakfast',
        'dest.norvegia-fiorduri.description': 'A cruise on Geirangerfjord, the Seven Sisters waterfall, viewpoints at Flydalsjuvet and the road up to Dalsnibba. Light summer nights and villages between mountains and water.',
        'dest.norvegia-fiorduri.amenities': 'Flight Included|Fjord Cruise|Fjord-View Hotel|Flydalsjuvet Viewpoint',
        'dest.cape-town.title': 'Cape Town - Table Mountain',
        'dest.cape-town.tagLabel': 'South Africa • Adventure',
        'dest.cape-town.period': '8 Nights / Breakfast',
        'dest.cape-town.description': 'The cable car up Table Mountain, Lion\'s Head at sunset, the V&A Waterfront and the beaches around the peninsula. The Constantia vineyards and a city framed by mountains and ocean.',
        'dest.cape-town.amenities': 'Flight Included|4★ City Hotel|Table Mountain Cable Car|Constantia Wine Tasting',
        // Lot 2: mai multe destinații din lume
        'dest.niagara.title': 'Niagara Falls - Horseshoe Falls',
        'dest.niagara.tagLabel': 'Canada • Waterfalls',
        'dest.niagara.period': '6 Nights / Breakfast',
        'dest.niagara.description': 'The roar of water, rainbows and mist in front of Horseshoe Falls on the Canadian side. A boat trip near the falls, views from the Skylon Tower and illuminated evenings along the Niagara River.',
        'dest.niagara.amenities': 'Flight Included|Hotel with Falls View|Falls Boat Trip|Skylon Tower',
        'dest.skye.title': 'Isle of Skye - Old Man of Storr',
        'dest.skye.tagLabel': 'Scotland • Nature',
        'dest.skye.period': '6 Nights / Breakfast',
        'dest.skye.description': 'Basalt pinnacles, green ridges and waterfalls into the sea on the Trotternish peninsula: the Old Man of Storr, the Quiraing, Fairy Glen and Kilt Rock. Easy hikes, narrow scenic roads and evenings in coastal villages.',
        'dest.skye.amenities': 'Flight Included|Stay in Portree|Trotternish Peninsula Tour|Local Guide',
        'dest.lofoten.title': 'Lofoten - Northern Lights & Fishing Villages',
        'dest.lofoten.tagLabel': 'Norway • Arctic',
        'dest.lofoten.period': '7 Nights / Breakfast',
        'dest.lofoten.description': 'Steep peaks above the sea, red cabins on stilts in Hamnøy and Reine, Arctic beaches and, in winter, a chance to see the northern lights. Stay in a rorbu, a traditional fishermen\'s cabin.',
        'dest.lofoten.amenities': 'Flight Included|Stay in a Rorbu|Reine & Hamnøy Excursion|Local Guide',
        'dest.irlanda.title': 'Ireland - Cliffs of Moher & the Atlantic Coast',
        'dest.irlanda.tagLabel': 'Ireland • Nature',
        'dest.irlanda.period': '5 Nights / Breakfast',
        'dest.irlanda.description': 'Sea cliffs up to 214 metres above the Atlantic, O\'Brien\'s Tower, the limestone landscape of the Burren and villages with pubs and live music. A coastal route through County Clare, starting from Dublin.',
        'dest.irlanda.amenities': 'Flight Included|Stay in Dublin & Clare|Cliffs of Moher Tour|Local Guide',
        'dest.islanda.title': 'Iceland - The Waterfalls',
        'dest.islanda.tagLabel': 'Iceland • Nature',
        'dest.islanda.period': '6 Nights / Breakfast',
        'dest.islanda.description': 'Gullfoss, Seljalandsfoss, Skógafoss, Goðafoss and Selfoss: Iceland\'s most famous waterfalls, on a circuit starting from Reykjavík. Scenic roads, geothermal springs and bright summer nights.',
        'dest.islanda.amenities': 'Flight Included|Circuit from Reykjavík|Gullfoss & Seljalandsfoss Trip|Local Guide',
        'dest.marrakech.title': 'Marrakech - Medina & Jemaa el-Fnaa Square',
        'dest.marrakech.tagLabel': 'Morocco • City Break',
        'dest.marrakech.period': '5 Nights / Breakfast',
        'dest.marrakech.description': 'Jemaa el-Fnaa square at sunset, the Koutoubia mosque, the medina gates, colourful souks and dinner in a riad. A red-walled city just a few hours\' flight away.',
        'dest.marrakech.amenities': 'Flight Included|Riad in the Medina|Medina Guided Tour|Breakfast',
        'dest.egipt.title': 'Egypt - Giza Pyramids & the Sphinx',
        'dest.egipt.tagLabel': 'Egypt • Culture & History',
        'dest.egipt.period': '8 Nights / Guided Circuit',
        'dest.egipt.description': 'The pyramids of Khufu, Khafre and Menkaure, the Sphinx of Giza and a camel ride in the desert. A guided circuit with Cairo, the Egyptian Museum and a Nile cruise.',
        'dest.egipt.amenities': 'Flight Included|4★ Hotels|Nile Cruise|Local Guide',
        'dest.zanzibar.title': 'Zanzibar - White Beaches & Stone Town',
        'dest.zanzibar.tagLabel': 'Tanzania • Beach',
        'dest.zanzibar.period': '8 Nights / Breakfast',
        'dest.zanzibar.description': 'White sand and turquoise water at Nungwi, dhow boats at sunset and the alleys of Stone Town, an old town on the UNESCO list. Eight nights at a beachfront resort, with island excursions.',
        'dest.zanzibar.amenities': 'Flight Included|Beachfront Resort|Stone Town Tour|Dhow Excursion',
        'dest.serengeti.title': 'Tanzania - Serengeti Safari',
        'dest.serengeti.tagLabel': 'Tanzania • Safari',
        'dest.serengeti.period': '8 Nights / Full Board',
        'dest.serengeti.description': 'Endless plains, acacias at sunset, lions, elephants and hippos in Serengeti National Park. 4x4 game drives, safari lodges and, in season, the great wildebeest migration.',
        'dest.serengeti.amenities': 'Flight Included|Safari Lodge|4x4 Game Drives|Full Board',
        'dest.victoria-falls.title': 'Victoria Falls - Zambia & Zimbabwe',
        'dest.victoria-falls.tagLabel': 'Zimbabwe • Waterfalls',
        'dest.victoria-falls.period': '6 Nights / Breakfast',
        'dest.victoria-falls.description': 'One of the largest curtains of falling water in the world, "the smoke that thunders" (Mosi-oa-Tunya), rainbows and views from above. Walks along the trails around the falls and a Zambezi sunset cruise.',
        'dest.victoria-falls.amenities': 'Flight Included|Lodge Near the Falls|Zambezi Cruise|Falls Entry Included',
        'dest.namibia.title': 'Namibia - Sossusvlei Dunes',
        'dest.namibia.tagLabel': 'Namibia • Adventure',
        'dest.namibia.period': '10 Nights / Guided Circuit',
        'dest.namibia.description': 'Huge red dunes, the dead trees of Dead Vlei and sunrise over Dune 45 in the Namib Desert. A 10-night guided circuit with Windhoek, Sesriem and gravel roads through arid landscapes.',
        'dest.namibia.amenities': 'Flight Included|Desert Lodge|Sunrise at Dune 45|Local Guide',
        'dest.india.title': 'India - Taj Mahal & Jaipur',
        'dest.india.tagLabel': 'India • Culture & History',
        'dest.india.period': '8 Nights / Guided Circuit',
        'dest.india.description': 'The Taj Mahal at sunrise in Agra, Amber Fort and Hawa Mahal in Jaipur, colourful bazaars and maharaja palaces. A guided Golden Triangle circuit, with road transfers between cities.',
        'dest.india.amenities': 'Flight Included|4★ Hotels|Taj Mahal at Sunrise|Local Guide',
        'dest.halong.title': 'Vietnam - Ha Long Bay',
        'dest.halong.tagLabel': 'Vietnam • Nature',
        'dest.halong.period': '9 Nights / Breakfast',
        'dest.halong.description': 'Thousands of limestone islands rising from emerald-green water, a cruise on a traditional junk, kayaking among the rocks and floating villages in Lan Ha Bay. Includes a stop in Hanoi, in the Old Quarter.',
        'dest.halong.amenities': 'Flight Included|Bay Cruise|Kayaking Among the Islands|Hanoi Old Quarter',
        'dest.noua-zeelanda.title': 'New Zealand - Milford Sound & Fiordland',
        'dest.noua-zeelanda.tagLabel': 'New Zealand • Nature',
        'dest.noua-zeelanda.period': '12 Nights / Breakfast',
        'dest.noua-zeelanda.description': 'A cruise on Milford Sound, with Mitre Peak and waterfalls, views across Fiordland and days around Queenstown. Twelve nights on the South Island, at the other end of the world.',
        'dest.noua-zeelanda.amenities': 'Flight Included|Milford Sound Cruise|4★ Hotels|Fiordland Excursions',
        'dest.sydney.title': 'Sydney - Opera House & Harbour Bridge',
        'dest.sydney.tagLabel': 'Australia • City Break',
        'dest.sydney.period': '9 Nights / Breakfast',
        'dest.sydney.description': 'The Sydney Opera House and Harbour Bridge at sunset, walks along Circular Quay, ferries across the harbour and beaches such as Bondi. A vibrant city at the other end of the world.',
        'dest.sydney.amenities': 'Flight Included|4★ Central Hotel|Port Jackson Cruise|Opera House Tour',
        'dest.petra.title': 'Jordan - Petra, the Rock-Cut City',
        'dest.petra.tagLabel': 'Jordan • Culture & History',
        'dest.petra.period': '6 Nights / Guided Circuit',
        'dest.petra.description': 'Walk down the Siq gorge to Al-Khazneh (the Treasury), royal tombs carved in pink sandstone and a climb to the Ad Deir Monastery. A six-night guided circuit, with an optional evening in the Wadi Rum desert.',
        'dest.petra.amenities': 'Flight Included|4★ Hotels|Petra Ticket Included|Local Guide',
        'dest.krabi.title': 'Thailand - Krabi & the Phi Phi Islands',
        'dest.krabi.tagLabel': 'Thailand • Beach',
        'dest.krabi.period': '9 Nights / Breakfast',
        'dest.krabi.description': 'Railay Beach, reachable only by boat, limestone cliffs, turquoise water and trips to the Phi Phi islands. Nine nights at a beachfront resort, with breakfast and an archipelago tour.',
        'dest.krabi.amenities': 'Flight Included|Beachfront Resort|Phi Phi Islands Trip|Longtail Boat',
        'dest.cornwall.title': 'Cornwall - St Michael\'s Mount & the Wild Coast',
        'dest.cornwall.tagLabel': 'England • Coast',
        'dest.cornwall.period': '5 Nights / Breakfast',
        'dest.cornwall.description': 'The castle island of St Michael\'s Mount, linked to the mainland by a causeway at low tide, the picturesque harbour of St Ives, surf beaches and the ruins at Tintagel. Fishing villages and clifftop paths.',
        'dest.cornwall.amenities': 'Flight Included|Stay in St Ives|St Michael\'s Mount Tour|Coastal Paths',
        'dest.horseshoe-bend.title': 'Horseshoe Bend & Page (Arizona)',
        'dest.horseshoe-bend.tagLabel': 'USA • Adventure',
        'dest.horseshoe-bend.period': '8 Nights / Breakfast',
        'dest.horseshoe-bend.description': 'The Colorado River bend almost 300 metres below the overlook, sunset over red sandstone and a base in Page, near Lake Powell. A route through the Grand Circle of the American Southwest.',
        'dest.horseshoe-bend.amenities': 'Flight Included|Hotel in Page|Horseshoe Bend Overlook|Guided Tour',
        // Chat Bot Responses
        'chat.greeting.text': 'Hello! 👋 I\'m the FeelVoyage virtual assistant. I can help you with information about destinations, offers, prices, bookings and much more. How can I help you today?',
        'chat.greeting.qr0': '🌴 Available destinations',
        'chat.greeting.qr1': '💰 Prices and budget',
        'chat.greeting.qr2': '📞 Contact',
        'chat.greeting.qr3': '📍 Agency office',

        'chat.destinations.text': 'We have **59 destinations** available in our portfolio! 🌍\n\n**Romania:** Danube Delta, Poiana Brașov, Bran & Brașov, Transfăgărășan, Danube Gorge, Maramureș, Sibiu & Sighișoara, Mamaia & Constanța\n\n**Europe:** Rome, Barcelona, London, Prague, Vienna, Paris\n\n**Exotic:** Maldives, Kenya Safari, Bali, Santorini, Tokyo & Kyoto, Swiss Alps, Dubai, Cappadocia, New York\n\n**China & South Korea:** Beijing & the Great Wall, Shanghai, Zhangjiajie (the Avatar mountains), Seoul, Busan, Jeju\n\n**New:** America (Yosemite, Grand Canyon, Horseshoe Bend, San Francisco, Hawaii, Niagara, Banff, Machu Picchu, Rio de Janeiro, Patagonia), the UK and Ireland (Edinburgh, Isle of Skye, Cornwall, Ireland), Northern Europe (Norway, Iceland), Africa (Cape Town, Marrakech, Egypt, Zanzibar, Serengeti, Victoria Falls, Namibia) and Asia & Oceania (India, Vietnam, Thailand, Jordan, New Zealand, Sydney)\n\nWould you like details about a specific destination?',
        'chat.destinations.qr0': '🏖️ Exotic destinations',
        'chat.destinations.qr1': '🏔️ Destinations in Romania',
        'chat.destinations.qr2': '🌍 Destinations in Europe',
        'chat.destinations.qr3': '📋 See all packages',

        'chat.exotic.text': 'The most sought-after exotic destinations are: 🏝️\n\n• **Maldives Deluxe** - Overwater villa, 7 nights\n• **Bali, Indonesia** - Temples and rice plantations\n• **Santorini, Greece** - Legendary sunsets\n• **Kenya Safari** - Wild animals\n• **Dubai** - City of the future\n• **Tokyo & Kyoto** - Japanese culture\n• **Cappadocia** - Hot air balloons\n• **New York** - The city that never sleeps\n\nAre you interested in any particular destination?',
        'chat.exotic.qr0': '💰 Prices',
        'chat.exotic.qr1': '📞 I want to book',
        'chat.exotic.qr2': '⬅️ Back',

        'chat.romania.text': 'Discover the beauties of Romania! 🇷🇴\n\n• **Danube Delta** - UNESCO nature reserve\n• **Poiana Brașov** - Mountain resort\n• **Bran & Brașov** - Dracula\'s Castle\n• **Transfăgărășan** - The most beautiful road in the world\n• **Danube Gorge** - Spectacular gorge\n• **Maramureș** - UNESCO heritage wooden churches\n• **Sibiu & Sighișoara** - Medieval cities\n• **Mamaia & Constanța** - Beach at the Black Sea\n\nWould you like details about any of them?',
        'chat.romania.qr0': '💰 Prices',
        'chat.romania.qr1': '📞 I want to book',
        'chat.romania.qr2': '⬅️ Back',

        'chat.europe.text': 'The most popular European destinations: 🇪🇺\n\n• **Rome, Italy** - Colosseum and Vatican\n• **Barcelona, Spain** - Sagrada Familia\n• **London, England** - Tower Bridge and Big Ben\n• **Prague, Czechia** - The golden city\n• **Vienna, Austria** - Schönbrunn Palace\n• **Paris, France** - Eiffel Tower\n\nDoes any destination attract you?',
        'chat.europe.qr0': '💰 Prices',
        'chat.europe.qr1': '📞 I want to book',
        'chat.europe.qr2': '⬅️ Back',

        'chat.packages.text': 'All 59 travel packages are displayed in the **Destinations & Packages** section on the site. Each package includes a photo gallery with several images, detailed description, price and duration of stay. You can filter by category (Beach, City Break, Exotic, etc.) and by budget.\n\nWould you like to see the packages now?',
        'chat.packages.qr0': '📋 See packages',
        'chat.packages.qr1': '💰 Prices',
        'chat.packages.qr2': '⬅️ Main menu',

        'chat.pricing.text': 'Prices vary by destination, season, length of stay and number of travelers. 💰\n\n**Romania:** from 190 EUR / person\n**Europe (city breaks):** from 380 EUR / person\n**Exotic & Asia:** from 1,040 EUR / person\n\nOpen any package and choose the number of travelers and extras to see the estimated total instantly. For a personalized offer, call us at **0799 927 590** or write to us at **crucrudenis@gmail.com**.',
        'chat.pricing.qr0': '📞 Contact',
        'chat.pricing.qr1': '🌴 See destinations',
        'chat.pricing.qr2': '⬅️ Main menu',

        'chat.booking.text': 'To book, you have several options: 🎫\n\n1. **Phone:** 0799 927 590\n2. **Email:** crucrudenis@gmail.com\n3. **At our office:** Str. Tudor Vladimirescu No. 124, Tg-Jiu\n4. **Facebook:** Direct message on the FeelVoyage page\n\nOur consultants will help you choose the perfect package and complete the booking. Which destination interests you?',
        'chat.booking.qr0': '🌴 See destinations',
        'chat.booking.qr1': '📍 Office',
        'chat.booking.qr2': '🔵 Facebook',

        'chat.contact.text': 'You can contact us as follows: 📞\n\n**Phone:** 0799 927 590\n**Email:** crucrudenis@gmail.com\n**Office:** Str. Tudor Vladimirescu No. 124, Tg-Jiu, Gorj\n**Facebook:** [FeelVoyage Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr)\n\nWe look forward to hearing from you!',
        'chat.contact.qr0': '🌴 Destinations',
        'chat.contact.qr1': '💰 Prices',
        'chat.contact.qr2': '⬅️ Main menu',

        'chat.location.text': 'The FeelVoyage office is located at **Tudor Vladimirescu Street, No. 124, Tg-Jiu, Gorj, Romania**. 📍\n\nHours: Monday - Friday: 09:00 - 18:00, Saturday: 10:00 - 14:00. We look forward to seeing you!',
        'chat.location.qr0': '📞 Contact',
        'chat.location.qr1': '🔵 Facebook',
        'chat.location.qr2': '⬅️ Main menu',

        'chat.facebook.text': 'You can also follow us on our official Facebook page for offers, promotions and news: [FeelVoyage Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr) 🔵\n\nGive us a like to stay up to date with the latest offers!',
        'chat.facebook.qr0': '🌴 Destinations',
        'chat.facebook.qr1': '📞 Contact',
        'chat.facebook.qr2': '⬅️ Main menu',

        'chat.services.text': 'Our services include: 🛫\n\n• Complete travel packages (flight + accommodation + transfer)\n• Personalized city breaks\n• Beach and mountain stays\n• Cultural and gastronomic tours\n• Safari and exotic adventures\n• Travel insurance\n• 24/7 vacation assistance\n• Group bookings (weddings, team building)\n\nAre you interested in a specific type of service?',
        'chat.services.qr0': '🌴 Destinations',
        'chat.services.qr1': '💰 Prices',
        'chat.services.qr2': '📞 Contact',

        'chat.payment.text': 'Payment is made only after you have spoken with a FeelVoyage agent and received the confirmed offer; you don\'t pay on the site. 🤝\n\nMethods available, agreed with the agent:\n• Bank transfer\n• Instalments (for packages > 500 EUR; interest-free on some packages)\n• Cash at our office\n\nContact us for details!',
        'chat.payment.qr0': '📞 Contact',
        'chat.payment.qr1': '🌴 Destinations',
        'chat.payment.qr2': '⬅️ Main menu',

        'chat.default.text': 'Thank you for your message! 🙏 A FeelVoyage consultant can help you with details. You can contact us at **0799 927 590**, via **crucrudenis@gmail.com** or at our office in **Tg-Jiu, Str. Tudor Vladimirescu No. 124**. Here\'s how I can help you further:',
        'chat.default.qr0': '🌴 Destinations',
        'chat.default.qr1': '💰 Prices',
        'chat.default.qr2': '📞 Contact',
        'chat.default.qr3': '📍 Office'
    },

    it: {
        // Navigation
        'nav.acasa': 'Home',
        'nav.destinatii': 'Destinazioni & Pacchetti',
        'nav.despre': 'Chi Siamo',
        'nav.servicii': 'Servizi',
        'nav.contact': 'Contatti',
        'nav.facebook': 'Seguici su Facebook',
        'nav.language': 'Lingua:',
        'nav.searchBtn': 'Cerca Offerte',

        // Hero Section
        'hero.badge': 'Agenzia di Viaggi Premium Nazionale & Internazionale',
        'hero.title1': 'Scopri il Mondo',
        'hero.title2': 'Senza Limiti con FeelVoyage',
        'hero.subtitle': 'Pacchetti turistici esclusivi, vacanze esotiche, soggiorni al mare e avventure urbane su misura per le tue emozioni di viaggio.',
        'hero.destinatie': 'Destinazione',
        'hero.destinatiePlaceholder': 'Es: Delta del Danubio, Roma, Maldive...',
        'hero.tipVacanta': 'Tipo di Vacanza',
        'hero.buget': 'Budget Max. (€)',
        'hero.toateCategoriile': 'Tutte le Categorie',
        'hero.categRomania': '🇷🇴 Romania & Locale',
        'hero.categPlaja': '🏖️ Spiaggia & Mare',
        'hero.categMunte': '⛰️ Montagna & Natura',
        'hero.categCityBreak': '🏛️ City Break',
        'hero.categExotic': '🌴 Vacanze Esotiche',
        'hero.categAsia': '🌏 Cina & Corea del Sud',
        'hero.oriceBuget': 'Qualsiasi Budget',
        'hero.sub300': 'Sotto 300 €',
        'hero.sub600': 'Sotto 600 €',
        'hero.sub1200': 'Sotto 1.200 €',
        'hero.sub2500': 'Sotto 2.500 €',
        'hero.cautaBtn': 'Cerca Offerte',
        'hero.stat1': 'Viaggiatori Felici',
        'hero.stat2': 'Destinazioni Attive',
        'hero.stat3': 'Garanzia di Qualità',
        'hero.stat4': 'Assistenza di Viaggio',

        // Destinations Section
        'dest.badge': 'Destinazioni Esclusive',
        'dest.title': 'Esplora la Selezione FeelVoyage',
        'dest.subtitle': 'Quasi 30 destinazioni favolose — dai paesaggi montani della Romania, attraverso le capitali europee, fino a Cina, Corea del Sud e atolli esotici.',
        'dest.filterAll': '🌍 Tutte le Destinazioni',
        'dest.filterRomania': '🇷🇴 Vacanze in Romania',
        'dest.filterPlaja': '🏖️ Spiaggia & Mare',
        'dest.filterMunte': '⛰️ Montagna & Natura',
        'dest.filterCityBreak': '🏛️ City Break',
        'dest.filterExotic': '🌴 Vacanze Esotiche',
        'dest.filterAsia': '🌏 Cina & Corea del Sud',
        'dest.filterAmerica': '🗽 Americhe & Canada',
        'dest.filterAfrica': '🦁 Africa & Safari',
        'dest.filterNord': '❄️ Nord Europa & Isole',
        'dest.filterAsiaOceania': '🏯 Asia & Oceania',
        'catwin.badge': 'Destinazioni',
        'catwin.subtitle': 'Scegli un pacchetto per vedere dettagli e foto e per prenotare.',
        'catwin.count': '{n} destinazioni',
        'catwin.count1': '1 destinazione',
        'catwin.searchPh': 'Cerca in questo elenco…',
        'catwin.empty': 'Nessuna destinazione corrisponde alla ricerca.',
        'catwin.viewAll': 'Vedi tutte le {n} destinazioni',
        'catwin.homeHint': 'Scegli una categoria per vedere tutti i suoi pacchetti.',
        'catwin.results': 'Risultati della ricerca',
        'catwin.budget': 'Budget massimo: {b} €',
        'card.pullOpen': 'Apri la galleria foto',
        'card.pullClose': 'Chiudi la galleria foto',
        'card.drawerTitle': '{n} foto',
        'card.openPhoto': 'Apri la foto {n}',
        'card.seePhotos': 'Vedi tutte le foto del pacchetto',
        'modal.galleryTitle': 'Galleria foto',
        'modal.galleryClose': 'Chiudi la galleria foto',
        'modal.galleryOpen': 'Galleria foto ({n})',
        'footer.edu': 'Questo sito è stato realizzato a scopo educativo e non è possibile effettuare ordini reali.',
        'perf.on': 'Modalità veloce: attiva',
        'perf.off': 'Modalità veloce: disattiva',
        'perf.title': 'Riduce effetti e animazioni per un sito più fluido sui telefoni meno recenti',
        'log.btn': 'Registro',
        'log.title': 'Registro del sito',
        'log.hint': 'Resta su questo dispositivo, senza dati personali.',
        'log.events': 'eventi',
        'log.errors': 'errori',
        'log.warnings': 'avvisi',
        'log.sessions': 'visite',
        'log.perf': 'Prestazioni',
        'log.modeLite': 'modalità veloce',
        'log.modeFull': 'modalità completa',
        'log.longTasks': 'Attività lunghe',
        'log.verdict': 'Verdetto',
        'log.perfWait': 'Il riepilogo appare 4 secondi dopo il caricamento della pagina.',
        'log.level': 'Livello',
        'log.category': 'Categoria',
        'log.search': 'Cerca nel registro…',
        'log.refresh': 'Aggiorna',
        'log.clear': 'Elimina',
        'log.confirmClear': 'Eliminare tutto il registro da questo dispositivo?',
        'log.allLevels': 'Tutti i livelli',
        'log.allCats': 'Tutte le categorie',
        'log.empty': 'Nessun evento corrisponde ai filtri scelti.',
        'log.older': 'più vecchi: esporta JSON / CSV per tutto il registro',
        'log.adminOnly': 'Solo per l\'amministratore. Nessun dato personale nel registro; le password non si possono vedere.',
        'log.tabDevice': 'Questo dispositivo',
        'log.tabServer': 'Server',
        'log.tabAccounts': 'Account',
        'log.loading': 'Caricamento dal server…',
        'log.forbidden': 'Accesso negato: il registro sul server può essere letto solo da un account amministratore.',
        'log.unsupported': 'Il server (Firebase) non è configurato: il registro resta solo su questo dispositivo.',
        'log.networkErr': 'Impossibile leggere dal server. Controlla internet e le regole Firebase (firebase-rules.json).',
        'log.pruneOld': 'Elimina oltre 30 giorni',
        'log.clearServer': 'Elimina tutto dal server',
        'log.confirmPrune': 'Eliminare dal server le voci più vecchie di 30 giorni?',
        'log.confirmClearServer': 'Eliminare TUTTO il registro dal server (tutti i visitatori)?',
        'log.pruned': 'Eliminate: {n}',
        'log.serverCleared': 'Il registro sul server è stato eliminato.',
        'log.accounts': 'account',
        'log.created': 'Creato',
        'log.lastLogin': 'Ultimo accesso',
        'log.logins': 'Accessi',
        'log.password': 'Password',
        'log.pwHidden': 'non può essere mostrata (solo hash)',
        'log.pwNote': 'Le password non possono essere mostrate: Firebase conserva solo un\'impronta cifrata (hash) che né l\'app né tu potete leggere come testo. Se qualcuno ha dimenticato la password puoi inviargli un\'e-mail di reimpostazione.',
        'log.resetPass': 'Invia e-mail di reimpostazione',
        'log.confirmReset': 'Inviare un\'e-mail di reimpostazione password a {email}?',
        'log.resetSent': 'L\'e-mail di reimpostazione è stata inviata.',
        'log.resetFail': 'Impossibile inviare l\'e-mail di reimpostazione.',
        'log.noAccounts': 'Nessun account nel database.',
        'dest.noResultsTitle': 'Nessuna offerta corrispondente trovata',
        'dest.noResultsMsg': 'Prova a reimpostare i filtri o a cercare un altro termine.',
        'dest.resetBtn': 'Reimposta Filtri',
        'dest.deLa': 'Da',
        'dest.detaliiBtn': 'Dettagli Pacchetto',
        'dest.foto': '4 Foto',

        'dest.subtitle': 'Oltre 30 destinazioni favolose — dai paesaggi montani della Romania, attraverso le capitali europee, fino all\'America, all\'Africa, alla Cina, alla Corea del Sud e alle mete esotiche.',
        'modal.photoLicense': 'Autore e licenza',
        'modal.photoCredit': 'Foto: Wikimedia Commons, licenza libera.',
        'modal.nextPhoto': 'Foto successiva',
        'modal.prevPhoto': 'Foto precedente',
        'dest.fotoN': '{n} Foto',
        // Services Section
        'serv.badge': 'Servizi Completi',
        'serv.title': 'Tutto per un Viaggio Senza Pensieri',
        'serv.subtitle': 'Ti mettiamo a disposizione un pacchetto integrato di servizi affinché tu debba solo fare le valigie.',
        'serv.card1Title': 'Voli & Biglietti Aerei',
        'serv.card1Desc': 'Prenotazioni rapide con le migliori compagnie, voli charter e opzioni di volo flessibili con bagagli inclusi.',
        'serv.card2Title': 'Soggiorni Premium & Resort',
        'serv.card2Desc': 'Partnership dirette con hotel a 4 e 5 stelle, resort All Inclusive e ville private garantite.',
        'serv.card3Title': 'Crociere di Lusso',
        'serv.card3Desc': 'Avventure sul mare sulle navi da crociera più spettacolari nei Caraibi, nel Mediterraneo e nell\'Europa del Nord.',

        // About Us Section
        'despre.badge': 'La Nostra Storia',
        'despre.title': 'Chi è FeelVoyage — Viaggiare con l\'Anima',
        'despre.subtitle': 'Un\'agenzia di viaggi nata nel cuore del distretto di Gorj, che oggi apre il mondo intero: dal Mar Nero rumeno fino a Cina e Corea del Sud.',
        'despre.p1': 'Benvenuti su FeelVoyage, l\'agenzia di turismo creata per trasformare le vostre vacanze da sogno in realtà!',
        'despre.p2': 'Questo sito rappresenta molto più di una semplice piattaforma di prenotazioni; è un progetto di squadra in cui abbiamo messo molta passione. Siamo un gruppo di studenti del liceo economico Virgil Madgearu di Târgu Jiu, desiderosi di unire le conoscenze di turismo allo spirito imprenditoriale. Più precisamente, siamo studenti della classe XI E e abbiamo pensato ogni sezione di questo sito con l\'obiettivo di offrirvi le destinazioni e le esperienze di viaggio più belle.',
        'despre.p3': 'L\'intero concetto FeelVoyage ha preso vita, è stato organizzato e realizzato con successo insieme alla nostra insegnante, che ci ha guidato passo dopo passo nello sviluppo di questa agenzia.',
        'despre.p4': 'Vi invitiamo a esplorare le nostre offerte e a scoprire il mondo con FeelVoyage!',
        'despre.cta': 'Vieni a conoscerci',
        'despre.stat1': 'Destinazioni in portafoglio',
        'despre.stat2': 'Viaggiatori felici',
        'despre.stat3': 'Continenti collegati',
        'despre.stat4': 'Assistenza reale in viaggio',
        'despre.val1Title': 'Esperienze personalizzate',
        'despre.val1Desc': 'Non vendiamo pacchetti standard — costruiamo itinerari intorno al tuo budget, ritmo e passioni.',
        'despre.val2Title': 'Trasparenza totale',
        'despre.val2Desc': 'Il prezzo mostrato è il prezzo finale: nessuna commissione nascosta, nessuna sorpresa a destinazione.',
        'despre.val3Title': 'Consulente dedicato',
        'despre.val3Desc': 'Una persona che ti conosce per nome, dal primo preventivo al tuo ritorno a casa.',
        'despre.val4Title': 'Rete globale',
        'despre.val4Desc': 'Partner locali verificati su tre continenti — da Mamaia a Pechino, Busan e le Maldive.',
        'despre.whyTitle': 'Perché i viaggiatori scelgono FeelVoyage?',
        'despre.why1': 'Consulenza gratuita e preventivo personalizzato entro 24 ore',
        'despre.why2': 'Prezzi mostrati in EUR e RON, con rate senza interessi alla prenotazione',
        'despre.why3': 'Assicurazione di viaggio opzionale e assistenza medica in ogni pacchetto',
        'despre.why4': 'Un consulente dedicato e un gruppo di supporto WhatsApp per tutta la durata del soggiorno',

        'about.close': 'Chiudi',

        // Documente legale, acceptare, contor conturi

        'legal.badge': 'Documenti legali',

        'terms.subtitle': 'Le regole d\'uso del sito e le condizioni di prenotazione, pagamento e annullamento dei servizi FeelVoyage.',

        'legal.toc': 'Indice',

        'terms.co.label': 'Gestore del sito',

        'terms.co.address': 'Sede',

        'terms.co.trade': 'Registro del Commercio',

        'terms.co.cui': 'CUI (codice fiscale)',

        'terms.co.license': 'Licenza turistica',

        'terms.co.licenseVal': 'n. 5678, rilasciata dal Ministero del Turismo',

        'terms.s1.title': 'Introduzione',

        'terms.s2.title': 'Servizi offerti e ruolo dell\'agenzia',

        'terms.s3.title': 'Prenotazioni, tariffe e modalità di pagamento',

        'terms.s4.title': 'Annullamenti, modifiche e penali',

        'terms.s5.title': 'Documenti di viaggio, visti e requisiti sanitari',

        'terms.s6.title': 'Limitazione di responsabilità',

        'terms.s7.title': 'Forza maggiore',

        'terms.s8.title': 'Proprietà intellettuale',

        'terms.s9.title': 'Protezione dei dati personali (GDPR)',

        'terms.s10.title': 'Reclami, legge applicabile e controversie',

        'terms.s11.title': 'Recapiti',

        'terms.s1.p1': 'Il presente documento (i «Termini e Condizioni») stabilisce le regole di utilizzo della piattaforma web www.feelvoyage.ro e le condizioni di prenotazione, acquisto e pagamento dei servizi e dei pacchetti turistici offerti tramite essa.',

        'terms.s1.p2': 'Accedendo al sito, navigando e utilizzandolo, così come effettuando qualsiasi prenotazione, l\'utente conferma di aver letto, compreso e accettato integralmente e senza riserve i presenti Termini e Condizioni.',

        'terms.s1.p3': 'Il sito è gestito da:',

        'terms.s2.intro': 'FeelVoyage agisce, a seconda dei casi, in una delle seguenti vesti:',

        'terms.s2.r1.title': 'Organizzatore (tour operator)',

        'terms.s2.r1.text': 'Quando crea e vende pacchetti di viaggio propri.',

        'terms.s2.r2.title': 'Intermediario (agenzia dettagliante)',

        'terms.s2.r2.text': 'Quando commercializza servizi turistici, pacchetti vacanza, biglietti aerei o alloggi forniti da altri tour operator, compagnie aeree o sistemi di prenotazione. In questo caso la responsabilità per l\'effettiva prestazione dei servizi ricade esclusivamente sui fornitori finali.',

        'terms.s3.b1.lead': 'Processo di prenotazione',

        'terms.s3.b1.text': 'Qualsiasi richiesta di prenotazione inviata tramite il sito è considerata definitiva solo dopo che un agente FeelVoyage ha confermato la disponibilità e la tariffa. L\'e-mail generata automaticamente alla ricezione della richiesta non costituisce una conferma definitiva della prenotazione.',

        'terms.s3.b2.lead': 'Tariffe',

        'terms.s3.b2.text': 'I prezzi sono espressi in EUR e RON e comprendono l\'IVA, ai sensi della normativa vigente. Le tariffe dei biglietti aerei, le tasse aeroportuali o le quotazioni degli albergatori possono variare, indipendentemente dalla volontà dell\'agenzia, fino all\'emissione dei biglietti o dei voucher.',

        'terms.s3.b3.lead': 'Pagamento',

        'terms.s3.b3.text': 'A seconda del tipo di servizio e della vicinanza della data di partenza, il pagamento può essere effettuato integralmente al momento della prenotazione o a rate (un acconto seguito dal saldo). L\'acconto richiesto e le scadenze di pagamento vengono comunicati chiaramente al momento dell\'offerta.',

        'terms.s3.b4.lead': 'Modalità di pagamento',

        'terms.s3.b4.text': 'Sul sito non si effettuano pagamenti. Il pagamento avviene esclusivamente dopo aver parlato con un agente FeelVoyage e aver ricevuto l\'offerta confermata. La modalità di pagamento (ad esempio, bonifico bancario o contanti presso la sede dell\'agenzia) viene concordata con l\'agente, nel rispetto dei limiti di legge per gli incassi.',

        'terms.s4.b1.lead': 'Annullamento da parte del cliente',

        'terms.s4.b1.text': 'Se il cliente desidera annullare o modificare una prenotazione confermata, sostiene le penali imposte dai fornitori dei servizi. A seconda del momento dell\'annullamento, le penali possono arrivare fino al 100% del valore del pacchetto o del servizio (ad esempio, biglietti aerei non rimborsabili o offerte Early Booking).',

        'terms.s4.b2.lead': 'Assicurazione annullamento',

        'terms.s4.b2.text': 'Per evitare perdite economiche in caso di annullamento per motivi oggettivi (ad esempio, una malattia improvvisa), l\'agenzia raccomanda vivamente di stipulare una polizza di assicurazione annullamento al momento della firma del contratto o del pagamento dell\'acconto.',

        'terms.s4.b3.lead': 'Annullamento da parte dell\'agenzia o del fornitore',

        'terms.s4.b3.text': 'Se il fornitore annulla il servizio o l\'agenzia è costretta ad annullare per mancato raggiungimento del numero minimo di partecipanti (nel caso dei gruppi), il cliente ha diritto al rimborso integrale delle somme versate oppure ad accettare un pacchetto alternativo di qualità equivalente o superiore.',

        'terms.s5.p1': 'È responsabilità esclusiva del turista assicurarsi di essere in possesso di documenti di viaggio validi: carta d\'identità, passaporto valido per almeno 6 mesi dalla data di rientro, visto di transito o di destinazione, ove necessario.',

        'terms.s5.p2': 'Il turista è tenuto a rispettare le condizioni doganali, di frontiera e sanitarie (vaccinazioni obbligatorie, certificati medici) imposte dal paese di destinazione o di transito. FeelVoyage non può essere ritenuta responsabile e non rimborsa il costo dei servizi se al turista viene negato l\'imbarco o l\'ingresso nel paese di destinazione.',

        'terms.s5.p3': 'Per i minori (sotto i 18 anni) che viaggiano da soli o accompagnati da un solo genitore si applicano le norme specifiche della Polizia di Frontiera rumena.',

        'terms.s6.intro': 'FeelVoyage non è responsabile per:',

        'terms.s6.l1': 'ritardi, modifiche di orario o di rotta, overbooking o cancellazioni dei voli operati dalle compagnie aeree;',

        'terms.s6.l2': 'lo smarrimento o il danneggiamento dei bagagli durante i voli o i trasferimenti;',

        'terms.s6.l3': 'le insoddisfazioni relative alla qualità dei servizi effettivamente prestati dall\'albergo (pulizia, rumore, posizione della camera), poiché l\'agenzia agisce solo come intermediario nella raccolta delle richieste.',

        'terms.s7.p1': 'Nessuna delle parti è responsabile dell\'inadempimento dei propri obblighi se questo è causato da un evento di forza maggiore, ai sensi di legge (ad esempio: guerre, pandemie, scioperi, condizioni meteorologiche estreme, calamità naturali, decisioni delle autorità governative). In tali casi si applicano le politiche di rimborso o di riprogrammazione dei fornitori finali dei servizi.',

        'terms.s8.p1': 'L\'intero contenuto del sito (testi, immagini, loghi, elementi grafici, design) appartiene a FeelVoyage o ai suoi partner ed è tutelato dalla legge sul diritto d\'autore. È severamente vietato riprenderlo, copiarlo o utilizzarlo senza il consenso scritto dell\'agenzia.',

        'terms.s9.p1': 'La raccolta e il trattamento dei dati personali (nome, indirizzo, e-mail, telefono, dati del documento d\'identità) avvengono in conformità al Regolamento (UE) 2016/679 (GDPR). I dati forniti vengono utilizzati esclusivamente per l\'elaborazione delle prenotazioni, l\'emissione dei documenti di viaggio e la fatturazione.',

        'terms.s10.b1.lead': 'Reclami',

        'terms.s10.b1.text': 'Eventuali disservizi riscontrati sul posto devono essere segnalati tempestivamente e per iscritto al fornitore locale e al rappresentante dell\'agenzia, in modo da poter essere risolti immediatamente. I reclami successivi devono essere presentati per iscritto entro 14 giorni dalla fine del viaggio.',

        'terms.s10.b2.lead': 'Legge applicabile e controversie',

        'terms.s10.b2.text': 'I presenti Termini e Condizioni sono disciplinati dalla legge rumena. Qualsiasi controversia sarà risolta, in primo luogo, in via amichevole. Ove ciò non sia possibile, la controversia è sottoposta ai tribunali competenti presso la sede di FeelVoyage; il consumatore può inoltre rivolgersi all\'ANPC (Autorità nazionale per la protezione dei consumatori).',

        'terms.s11.intro': 'Per assistenza, prenotazioni o ulteriori informazioni, il nostro team è a vostra disposizione:',

        'legal.ct.address': 'Indirizzo',

        'legal.ct.phone': 'Telefono assistenza e urgenze',

        'legal.ct.email': 'E-mail',

        'legal.ct.hours': 'Orario',

        'legal.ct.hoursVal': 'Non-stop (24/7)',

        'legal.note': 'Il presente documento è redatto in lingua rumena. Le traduzioni hanno valore puramente indicativo; in caso di discrepanze prevale la versione in lingua rumena.',

        'legal.updated': 'Ultimo aggiornamento: settembre 2026',

        'privacy.subtitle': 'Come raccogliamo, utilizziamo, conserviamo e proteggiamo i tuoi dati personali.',

        'privacy.lead1': 'Benvenuto sul sito FeelVoyage. Ci impegniamo a proteggere la tua privacy e i tuoi dati personali. La presente Informativa sulla Privacy spiega come raccogliamo, utilizziamo, conserviamo e proteggiamo le tue informazioni quando visiti il nostro sito e utilizzi i nostri servizi turistici.',

        'privacy.lead2': 'Utilizzando il sito e i nostri servizi, accetti le pratiche descritte in questa informativa.',

        'privacy.s1.title': 'Quali dati personali raccogliamo?',

        'privacy.s2.title': 'Come utilizziamo i tuoi dati?',

        'privacy.s3.title': 'A chi trasmettiamo i tuoi dati?',

        'privacy.s4.title': 'Per quanto tempo conserviamo i dati?',

        'privacy.s5.title': 'I tuoi diritti (ai sensi del GDPR)',

        'privacy.s6.title': 'Recapiti e assistenza non-stop',

        'privacy.s1.intro': 'Per offrirti le migliori esperienze di viaggio, raccogliamo le seguenti tipologie di informazioni:',

        'privacy.s1.b1.lead': 'Dati identificativi e di contatto',

        'privacy.s1.b1.text': 'Nome, cognome, indirizzo e-mail, numero di telefono e indirizzo di residenza / fatturazione.',

        'privacy.s1.b2.lead': 'Dati necessari per il viaggio',

        'privacy.s1.b2.text': 'Informazioni sui passeggeri (inclusi data di nascita o dati del documento d\'identità / passaporto, quando le compagnie aeree o gli alberghi li richiedono strettamente per la prenotazione), preferenze di viaggio e storico delle prenotazioni.',

        'privacy.s1.b3.lead': 'Dati di fatturazione',

        'privacy.s1.b3.text': 'I dettagli necessari per emettere le fatture.',

        'privacy.s1.b4.lead': 'Dati tecnici',

        'privacy.s1.b4.text': 'Indirizzo IP, tipo di browser, sistema operativo e modalità di navigazione sul nostro sito, raccolti tramite cookie e tecnologie simili.',

        'privacy.s1.b5.lead': 'Account e chat',

        'privacy.s1.b5.text': 'Se crei un account, conserviamo nome, telefono e indirizzo e-mail; la password è gestita dal servizio di autenticazione e non possiamo vederla. I messaggi della chat sono elaborati dall\'assistente virtuale: ti preghiamo di non scrivere dati personali nella chat, ma di usare i moduli.',

        'privacy.s2.intro': 'Le informazioni che raccogliamo sono utilizzate esclusivamente per le seguenti finalità:',

        'privacy.s2.l1': 'elaborare, confermare e gestire le tue prenotazioni (voli, alloggi, pacchetti turistici);',

        'privacy.s2.l2': 'offrire assistenza clienti e supporto non-stop (24/7) per qualsiasi problema legata al tuo viaggio;',

        'privacy.s2.l3': 'inviare notifiche importanti su modifiche dei voli, check-in o regole di viaggio;',

        'privacy.s2.l4': 'emettere le fatture e rispettare gli obblighi finanziari e contabili previsti dalla legislazione rumena;',

        'privacy.s2.l5': 'migliorare i nostri servizi e, solo con il tuo consenso preventivo, inviare offerte speciali o newsletter.',

        'privacy.s3.intro': 'Non vendiamo né commercializziamo i tuoi dati personali. Tuttavia, per onorare le tue prenotazioni, dobbiamo trasmettere una parte dei dati a partner di fiducia:',

        'privacy.s3.b1.lead': 'Fornitori di servizi turistici',

        'privacy.s3.b1.text': 'Compagnie aeree, alberghi, società di trasferimento o tour operator locali (che hanno bisogno del tuo nome per convalidare la prenotazione).',

        'privacy.s3.b2.lead': 'Autorità pubbliche',

        'privacy.s3.b2.text': 'Dogane o polizia di frontiera, esclusivamente se la legislazione dei paesi di destinazione lo impone.',

        'privacy.s3.b3.lead': 'Partner tecnici',

        'privacy.s3.b3.text': 'Fornitori di servizi di hosting e infrastruttura (inclusi Google / Firebase, per account, richieste di prenotazione e assistente virtuale), contrattualmente obbligati a proteggere i tuoi dati.',

        'privacy.s4.p1': 'Conserviamo i tuoi dati personali solo per il tempo necessario alle finalità sopra indicate o per il periodo imposto dalle leggi applicabili (ad esempio, i documenti finanziari e contabili devono essere conservati per legge per diversi anni).',

        'privacy.s1.b6.lead': 'Registro tecnico (senza dati personali)',

        'privacy.s1.b6.text': 'Per correggere errori e rendere il sito più veloce registriamo eventi tecnici: errori, tempi di caricamento, il tipo generale del tuo dispositivo (dimensione dello schermo, memoria, connessione) e azioni sul sito (ad esempio la categoria aperta o il pacchetto visualizzato). Non registriamo nomi, indirizzi e-mail, numeri di telefono, password o testi che scrivi in moduli, ricerche o chat. Per gli eventi dell\'account (creazione account, accesso) conserviamo l\'identificativo dell\'account, mai la password. Il registro è conservato in Firebase (Google) e può essere letto solo dall\'amministratore. Non inviamo il registro se il tuo browser trasmette “Do Not Track” o “Global Privacy Control”.',

        'privacy.s4.p2': 'Le voci del registro tecnico sono conservate al massimo 30 giorni e poi eliminate dall\'amministratore.',

        'privacy.s5.intro': 'Ai sensi del Regolamento generale sulla protezione dei dati (GDPR), hai i seguenti diritti:',

        'privacy.s5.b1.lead': 'Diritto di accesso',

        'privacy.s5.b1.text': 'Sapere quali dati personali trattiamo su di te.',

        'privacy.s5.b2.lead': 'Diritto di rettifica',

        'privacy.s5.b2.text': 'Chiedere la correzione di dati errati o incompleti.',

        'privacy.s5.b3.lead': 'Diritto alla cancellazione («diritto all\'oblio»)',

        'privacy.s5.b3.text': 'Chiedere la cancellazione dei tuoi dati dai nostri archivi, se non esiste più una base giuridica per conservarli.',

        'privacy.s5.b4.lead': 'Diritto di limitazione del trattamento e alla portabilità dei dati',

        'privacy.s5.b4.text': 'Chiedere di limitare il trattamento dei tuoi dati e di riceverli in un formato strutturato.',

        'privacy.s5.b5.lead': 'Diritto di opposizione al marketing diretto',

        'privacy.s5.b5.text': 'Rifiutare in qualsiasi momento le comunicazioni di marketing.',

        'privacy.s5.b6.lead': 'Diritto di proporre reclamo',

        'privacy.s5.b6.text': 'Puoi rivolgerti all\'Autorità nazionale di controllo per il trattamento dei dati personali (ANSPDCP).',

        'privacy.s5.exercise': 'Per esercitare i tuoi diritti, scrivici all\'indirizzo e-mail indicato nella sezione dei recapiti; rispondiamo entro un mese al massimo.',

        'privacy.s6.intro': 'Il team FeelVoyage è a tua disposizione 24 ore su 24 per qualsiasi domanda sulla privacy dei tuoi dati o per pianificare la tua prossima vacanza. Puoi contattarci usando i recapiti qui sotto:',

        'privacy.ct.name': 'Denominazione agenzia',

        'privacy.s6.p2': 'Ci riserviamo il diritto di modificare la presente Informativa sulla Privacy. Ogni aggiornamento sarà pubblicato in questa pagina.',

        'anpc.subtitle': 'Risoluzione alternativa delle controversie: cos\'è il SAL e a chi rivolgersi in caso di reclamo.',

        'anpc.s1.title': 'Contattaci per primo',

        'anpc.s2.title': 'Che cos\'è il SAL?',

        'anpc.s3.title': 'Come richiedere la risoluzione tramite SAL',

        'anpc.s4.title': 'Altre vie di risoluzione',

        'anpc.s5.title': 'Fonti ufficiali',

        'anpc.s1.p1': 'Se hai un problema con una prenotazione o con i servizi FeelVoyage, scrivici o chiamaci: spesso la questione si risolve direttamente e in fretta. Conserva le prove (offerta, conferme, e-mail, fatture).',

        'anpc.s1.p2': 'Vedi anche la sezione sui reclami nei',

        'anpc.s2.p1': 'La soluzione alternativa delle controversie (SAL, dal rumeno «soluționarea alternativă a litigiilor») è una procedura legale con cui i consumatori possono risolvere in via amichevole le controversie con i professionisti, senza ricorrere al giudice. La procedura è disciplinata e coordinata dall\'ANPC (Autorità nazionale per la protezione dei consumatori).',

        'anpc.s2.p2': 'Il SAL è volontario e, di regola, gratuito o a costi minimi. Si applica alle controversie derivanti da contratti di vendita o di prestazione di servizi tra consumatori e professionisti, nei settori in cui l\'ANPC è competente. Il diritto di rivolgersi all\'autorità giudiziaria resta sempre valido.',

        'anpc.s2.tip': 'La piattaforma europea di risoluzione online delle controversie (ODR) è stata abrogata dal Regolamento (UE) 2024/3228 e non è più disponibile.',

        'anpc.s3.l1': 'Contatta prima il professionista (FeelVoyage) e cerca di risolvere il problema direttamente; conserva le prove.',

        'anpc.s3.l2': 'Se non avete trovato una soluzione, compila la richiesta SAL online sul portale ANPC (reclamatiisal.anpc.ro) oppure scarica il modulo da anpc.ro.',

        'anpc.s3.l3': 'Allega i documenti pertinenti (contratto o offerta, prova di pagamento, corrispondenza) e la prova di aver contattato il professionista.',

        'anpc.s3.l4': 'L\'entità SAL esamina la richiesta e comunica la soluzione proposta; resta aperta la via giudiziaria.',

        'anpc.s3.tip': 'In linea generale, la richiesta deve essere presentata entro 1 anno dalla data in cui hai contattato il professionista o dal fatto contestato (Ordinanza del Governo n. 38/2015). Le condizioni esatte sono quelle pubblicate sul sito dell\'ANPC.',

        'anpc.s4.b1.lead': 'Reclamo all\'ANPC',

        'anpc.s4.b1.text': 'Puoi presentare un reclamo all\'Autorità nazionale per la protezione dei consumatori, con i tuoi dati reali (non in forma anonima), la denominazione del professionista, la descrizione della situazione e i documenti a supporto. Sede centrale: Bulevardul Aviatorilor n. 72, settore 1, Bucarest.',

        'anpc.s4.b2.lead': 'Centro europeo dei consumatori Romania (ECC Romania)',

        'anpc.s4.b2.text': 'Se la controversia riguarda un professionista di un altro Stato UE (ad esempio una compagnia aerea o un albergo all\'estero), l\'ECC Romania offre gratuitamente informazioni e assistenza per una soluzione amichevole.',

        'anpc.s4.b3.lead': 'Autorità giudiziaria',

        'anpc.s4.b3.text': 'Puoi sempre rivolgerti ai tribunali competenti, alle condizioni previste dalla legge.',

        'anpc.s5.p1': 'Le informazioni sopra riportate sono di carattere generale e informativo; non sostituiscono la consulenza legale. La fonte ufficiale e più aggiornata è il sito dell\'ANPC.',

        'accept.label': 'Accettazione',

        'accept.terms': 'Ho letto e accetto i Termini e Condizioni',

        'accept.privacy': 'Ho letto e accetto l\'Informativa sulla Privacy',

        'accept.anpc': 'Ho letto e preso atto delle informazioni su ANPC / SAL',

        'accept.btn': 'Accetta',

        'accept.done': 'Accettato il {date}',

        'accept.withdraw': 'Revoca l\'accettazione',


        'accept.status': 'Stato delle accettazioni',

        'accept.toast': 'Grazie! L\'accettazione è stata salvata.',

        'accept.toastOff': 'Accettazione revocata.',

        'accept.noteOut': 'L\'accettazione data senza account viene salvata solo su questo dispositivo. Accedi per salvarla sul tuo account e vederla su qualsiasi dispositivo.',

        'accept.noteIn': 'L\'accettazione è salvata sul tuo account, con la data e la versione del documento, e la vedi su qualsiasi dispositivo. FeelVoyage può consultarla.',

        'accept.login': 'Accedi',

        'accept.error': 'Non sono riuscito a salvare l\'accettazione sul tuo account. Controlla la connessione e riprova.',

        'admin.consents': 'Accettazioni documenti',

        'admin.consentNone': 'non accettato',

        'admin.consentOff': 'revocato il {date}',

        'admin.consentOld': 'versione precedente ({v})',

        'hero.statAccounts': 'Account Creati',

































































        // Auth System
        'auth.loginBtn': 'Il Mio Account',
        'auth.modalTitle': 'Benvenuto su FeelVoyage',
        'auth.modalSubtitle': 'Accedi per prenotare più velocemente e ricevere offerte personalizzate',
        'auth.tabLogin': 'Accedi',
        'auth.tabRegister': 'Registrati',
        'auth.emailLabel': 'E-mail',
        'auth.passwordLabel': 'Password',
        'auth.password2Label': 'Conferma password',
        'auth.nameLabel': 'Nome e Cognome',
        'auth.phoneLabel': 'Telefono',
        'auth.errorPhone': 'Inserisci un numero di telefono valido, in formato rumeno (07XX XXX XXX) o internazionale (es: +39 3XX XXX XXXX).',
        'auth.loginSubmit': 'Accedi',
        'auth.registerSubmit': 'Crea account gratuito',
        'auth.optionalNote': 'L\'account è opzionale — puoi sempre prenotare senza. I dati dell\'account demo sono salvati solo localmente, sul tuo dispositivo.',
        'nav.toDark': 'Passa alla modalità scura',
        'nav.toLight': 'Passa alla modalità chiara',
        'nav.menu': 'Menu',
        'counter.live': 'In diretta: tutti i visitatori vedono lo stesso numero',
        'counter.error': 'Impossibile salvare il click. Controlla la connessione a internet.',
        'order.error': 'Non siamo riusciti a inviare la richiesta. Riprova o chiamaci al 0799 927 590.',
        'chat.ai.note': 'Le risposte sono generate dall\'IA e possono contenere errori. Non condividere dati personali nella chat.',
        'chat.ai.short': 'Risposte generate dall\'IA · possono contenere errori',
        'auth.adminChip': 'Amministratore',
        'admin.usersBtn': 'Utenti',
        'admin.panelTitle': 'Pannello amministratore',
        'admin.viewSub': 'Vista profilo · sola lettura',
        'admin.count': '{n} utenti',
        'admin.countOf': '{n} di {total} utenti',
        'admin.search': 'Cerca per nome, e-mail o telefono',
        'admin.refresh': 'Aggiorna',
        'admin.close': 'Chiudi',
        'admin.loading': 'Caricamento utenti...',
        'admin.empty': 'Non ci sono ancora utenti con un profilo salvato.',
        'admin.noMatch': 'Nessun utente corrisponde.',
        'admin.errForbidden': 'Non hai il permesso di vedere gli utenti. Controlla di aver pubblicato le regole di firebase-rules.json e che il tuo account sia segnato come amministratore nel database.',
        'admin.errNetwork': 'Non sono riuscito a contattare il server. Controlla la connessione e riprova.',
        'admin.errUnsupported': 'Il pannello amministratore funziona solo con Firebase configurato.',
        'admin.retry': 'Riprova',
        'admin.back': 'Torna all\'elenco',
        'admin.viewBanner': 'Stai vedendo il profilo di questo utente come lo vede lui. Modalità amministratore, sola lettura: non puoi modificare nulla.',
        'admin.details': 'Dettagli account (li vedi solo tu)',
        'admin.phone': 'Telefono',
        'admin.email': 'E-mail',
        'admin.since': 'Membro dal',
        'admin.uid': 'ID account',
        'admin.copy': 'Copia',
        'admin.copied': 'Copiato!',
        'admin.noEmail': 'sconosciuta (appare al prossimo accesso dell\'utente)',
        'admin.noPhone': 'non indicato',
        'admin.you': 'tu',
        'chat.admin.status': 'Modalità amministratore • Nessun limite di argomento',
        'chat.admin.note': 'Modalità amministratore: risposte IA, senza limiti di argomento',
        'chat.admin.greeting': 'Ciao, amministratore! 🛡️ Hai accesso libero: chiedimi qualsiasi cosa, non solo sul sito o sui viaggi (codice, testi, idee, calcoli...). Cosa vuoi sapere?',
        'chat.admin.placeholder': 'Chiedi qualsiasi cosa...',
        'chat.admin.aiDown': 'L\'assistente IA non è disponibile in questo momento (dettagli nella console del browser, F12). Ti rispondo con le risposte preparate.',
        'chat.ai.recaptcha': 'Protetto da reCAPTCHA; si applicano',
        'chat.ai.privacy': 'l\'Informativa sulla privacy',
        'chat.ai.and': 'e i',
        'chat.ai.terms': 'Termini di servizio',
        'chat.ai.offTopic': 'Posso aiutarti solo con domande sull\'agenzia FeelVoyage, sul nostro sito e sulle destinazioni di vacanza. 🌍 Chiedimi, ad esempio, dei pacchetti disponibili, dei prezzi o di cosa visitare in una destinazione!',
        'chat.ai.limit': 'Hai raggiunto il limite di domande per questa sessione. Puoi chiamarci allo **0799 927 590** o scegliere una delle opzioni qui sotto.',
        'dest.perPerson': 'pers.',
        'modal.adults': 'Adulti',
        'modal.adultsHint': 'oltre 12 anni',
        'modal.kids04': 'Bambini 0–4',
        'modal.kids04Hint': 'sotto i 5 anni',
        'modal.kids512': 'Bambini 5–12',
        'modal.kids512Hint': 'da 5 a 12 anni',
        'modal.kidsHint': 'I bambini in camera con 2 adulti hanno una tariffa ridotta; un bambino che viaggia con un solo adulto paga la tariffa intera.',
        'modal.included': 'Incluso',
        'modal.unavailable': 'Non disponibile',
        'modal.unitPerson': '/ pers.',
        'modal.unitGroup': '/ gruppo',
        'modal.unitDay': '/ giorno',
        'quote.title': 'Stima del prezzo',
        'quote.nightsWord': 'notti',
        'quote.total': 'Totale',
        'quote.perPerson': 'Prezzo medio / persona',
        'quote.person': 'persona',
        'quote.persons': 'persone',
        'quote.adultsLine': '{n} × adulto ({unit})',
        'quote.kids04Line': '{n} × bambino 0–4 ({pct}% del prezzo)',
        'quote.kids512Line': '{n} × bambino 5–12 ({pct}% del prezzo)',
        'quote.singleLine': 'Supplemento camera singola ({perNight} × {nights} notti)',
        'quote.seasonLine': 'Supplemento stagionale: {month} (+{pct}%)',
        'quote.groupLine': '{name} (per gruppo)',
        'quote.carLine': '{name} ({cars} × {days} giorni × {unit})',
        'quote.noteDate': 'Il prezzo "da" è per la bassa stagione. Scegli la data di partenza per vedere il prezzo esatto della stagione.',
        'quote.noteLow': 'La data scelta è in bassa stagione: si applica il prezzo base.',
        'quote.disclaimer': 'Stima indicativa per camera doppia. L\'offerta finale e la disponibilità sono confermate da un consulente. Non includono spese personali, tasse di soggiorno locali e attrazioni o escursioni opzionali non selezionate.',
        'modal.dateFrom': 'Partenza',
        'modal.dateTo': 'Ritorno',
        'modal.datePlaceholder': 'gg/mm/aaaa',
        'modal.dateHintStart': 'Scegli la data di partenza dal calendario.',
        'modal.dateHintEnd': 'Scegli la data di ritorno ({min}–{max} notti).',
        'modal.dateHintFixed': 'Tour a durata fissa di {n} notti: la data di ritorno viene compilata automaticamente.',
        'modal.dateDuration': 'Durata: {n} notti',
        'modal.dateDurationStd': 'Durata: {n} notti (pacchetto standard: {std})',
        'modal.dateChangeEnd': 'puoi cambiare la data di ritorno',
        'modal.dateClear': 'Cancella',
        'modal.dateDone': 'Fatto',
        'modal.datePrev': 'Mese precedente',
        'modal.dateNext': 'Mese successivo',
        'modal.dateRequired': 'Scegli le date di partenza e di ritorno.',
        'quote.noteDuration': 'Il prezzo è adeguato alla durata scelta (il pacchetto standard prevede {std} notti).',
        'auth.forgot': 'Password dimenticata?',
        'auth.resetSent': 'Se esiste un account con questa e-mail, ti abbiamo inviato il link per reimpostare la password.',
        'auth.resetNeedEmail': 'Scrivi prima il tuo indirizzo e-mail nel campo qui sopra.',
        'auth.errorInvalidEmail': 'L\'indirizzo e-mail non è valido.',
        'auth.errorNetwork': 'Impossibile raggiungere il server. Controlla la connessione e riprova.',
        'auth.errorTooMany': 'Troppi tentativi. Riprova tra qualche minuto.',
        'auth.errorGeneric': 'Qualcosa è andato storto. Riprova.',
        'auth.optionalNoteCloud': 'L\'account è opzionale — puoi sempre prenotare senza. Puoi accedere da qualsiasi dispositivo con la stessa e-mail e password.',
        'auth.termsNote': 'Registrandoti accetti i Termini e Condizioni e la Privacy Policy di FeelVoyage.',
        'auth.errorLogin': 'E-mail o password errati.',
        'auth.errorName': 'Inserisci nome e cognome.',
        'auth.errorPasswordShort': 'La password deve avere almeno 6 caratteri.',
        'auth.errorPasswordMatch': 'Le password non coincidono.',
        'auth.errorEmailUsed': 'Esiste già un account con questa e-mail. Accedi.',
        'auth.welcomeBack': 'Bentornato',
        'auth.googleBtn': 'Continua con Google',
        'auth.orDivider': 'oppure',
        'auth.googleWelcome': 'Benvenuto',
        'auth.errorPopupBlocked': 'Il browser ha bloccato la finestra di Google. Consenti i pop-up per questo sito e riprova.',
        'auth.errorAccountExists': 'Esiste già un account con questa e-mail, creato con una password. Accedi con la password, poi potrai usare anche Google.',
        'auth.registerSuccess': 'Account creato. Benvenuto',
        'auth.loggedOut': 'Sei uscito. A presto!',
        'auth.dropdownHello': 'Ciao',
        'auth.dropdownGuest': 'Accedi per prenotare più velocemente e ricevere offerte esclusive.',
        'auth.profileBtn': 'Il mio profilo',
        'auth.viewDestinations': 'Vedi le destinazioni',
        'auth.logoutBtn': 'Esci',
        'auth.memberChip': 'Membro FeelVoyage',
        'auth.perksTitle': 'I vantaggi del tuo account',
        'auth.perk1': 'Prenotazioni precompilate — niente più dati da digitare',
        'auth.perk2': 'Offerte esclusive per membri',
        'auth.perk3': 'Risposta prioritaria dal tuo consulente',

        // Contact Section
        'contact.badge': 'Parliamone',
        'contact.title': 'Siamo Qui per Te',
        'contact.subtitle': 'Puoi visitarci nella nostra sede a Tg-Jiu o contattarci direttamente per telefono, email o social media.',
        'contact.addressTitle': 'Indirizzo Sede',
        'contact.address': 'Via Tudor Vladimirescu, nr 124, Tg-Jiu, Romania',
        'contact.phoneTitle': 'Telefono & WhatsApp',
        'contact.facebookTitle': 'Pagina Ufficiale Facebook',
        'contact.emailTitle': 'Email Assistenza & Offerte',
        'contact.mapLabel': 'Via Tudor Vladimirescu nr 124, Tg-Jiu',
        'contact.formTitle': 'Invia una Richiesta di Preventivo',
        'contact.formSubtitle': 'Compila il modulo qui sotto e un consulente ti contatterà entro massimo 2 ore lavorative.',
        'contact.formName': 'Nome Completo',
        'contact.formNamePlaceholder': 'es: Mario Rossi',
        'contact.formPhone': 'Numero di Telefono',
        'contact.formPhonePlaceholder': 'es: +39 333 000 0000',
        'contact.formEmail': 'Indirizzo Email',
        'contact.formEmailPlaceholder': 'mario.rossi@email.it',
        'contact.formDest': 'Destinazione Desiderata',
        'contact.formDestPlaceholder': 'es: Maldive, Santorini, ecc.',
        'contact.formMsg': 'Messaggio o Dettagli di Viaggio',
        'contact.formMsgPlaceholder': 'Specifica il numero di persone, il periodo stimato, il budget o qualsiasi altra richiesta speciale...',
        'contact.formBtn': 'Invia Richiesta di Preventivo',
        'contact.success': 'Grazie! La tua richiesta è stata registrata. Ti contatteremo a breve!',

        // Footer
        'footer.descAddr': 'Via Tudor Vladimirescu, nr 124, Tg-Jiu, Romania.',
        'footer.descTagline': 'Agenzia turistica dedicata a esperienze memorabili a livello globale.',
        'footer.navTitle': 'Navigazione Rapida',
        'footer.navHome': 'Home',
        'footer.navDest': 'Pacchetti & Destinazioni',
        'footer.navAbout': 'Chi Siamo FeelVoyage',
        'footer.navServ': 'Servizi Turistici',
        'footer.navContact': 'Contatti & Assistenza',
        'footer.destTitle': 'Destinazioni Esclusive',
        'footer.fbTitle': 'Seguici su Facebook',
        'footer.fbDesc': 'Connettiti con noi su Facebook per offerte giornaliere e notizie di viaggio!',
        'footer.fbBtn': 'Apri Pagina Facebook',
        'footer.copyright': '© 2026 FeelVoyage Romania. Tutti i diritti riservati.',
        'footer.terms': 'Termini e Condizioni',
        'footer.privacy': 'Informativa sulla Privacy',
        'footer.anpc': 'ANPC / SAL',

        // Chat Widget
        'chat.headerTitle': 'Assistente FeelVoyage',
        'chat.headerStatus': 'Online • Risponde in pochi secondi',
        'chat.placeholder': 'Scrivi un messaggio...',

        // Booking Modal
        'modal.priceLabel': 'Prezzo / persona',
        'modal.descTitle': 'Descrizione Pacchetto & Destinazione',
        'modal.amenitiesTitle': 'Servizi & Comfort Inclusi',
        'modal.bookingTitle': 'Prenota o Richiedi Informazioni Aggiuntive',
        'modal.namePlaceholder': 'Il tuo nome',
        'modal.phonePlaceholder': 'Telefono',
        'modal.emailPlaceholder': 'Email',
        'modal.emailError': 'L\'email deve contenere @business.com, @gmail.com o @yahoo.com',
        'modal.nameError': 'Inserisci Nome e Cognome (es: Mario Rossi)',
        'modal.phoneError': 'Numero di telefono non valido. Usa il formato internazionale (es: +39 3XX XXX XXXX)',
        'modal.dateError': 'La data deve essere dal 2026 o successiva',
        'modal.travelersLabel': 'Numero di Viaggiatori',
        'modal.travelers1': '1 Persona',
        'modal.travelers2': '2 Persone',
        'modal.travelers3': '3 Persone',
        'modal.travelers4': '4+ Persone (Gruppo)',
        'modal.periodLabel': 'Periodo Stimato',
        'modal.servicesTitle': 'Scegli i Servizi Desiderati',
        'modal.serviceTransport': 'Trasporto (volo/autobus)',
        'modal.serviceCazare': 'Soggiorno in hotel',
        'modal.serviceTransfer': 'Trasferimento aeroporto-hotel',
        'modal.serviceMeals': 'Mezza pensione / Prima colazione',
        'modal.serviceTickets': 'Biglietti per le attrazioni',
        'modal.serviceInsurance': 'Assicurazione di viaggio',
        'modal.serviceGuide': 'Guida locale',
        'modal.serviceCar': 'Noleggio auto',
        'modal.submitBtn': 'Invia Richiesta di Prenotazione',

        // Thank You Overlay
        'thankyou.title': 'Grazie!',
        'thankyou.msg': 'La tua richiesta di prenotazione è stata inviata con successo. Un agente FeelVoyage ti contatterà il prima possibile.',

        // Destinations
        'dest.delta-dunarii.title': 'Delta del Danubio - Santuario della Natura',
        'dest.delta-dunarii.tagLabel': 'Romania • Natura',
        'dest.delta-dunarii.period': '4 Notti / Pensione Completa',
        'dest.delta-dunarii.description': 'Gite in barca attraverso canali tortuosi, colonie di pellicani, ninfee bianche e gastronomia tradizionale di pesce a Sfântu Gheorghe e Sulina. Soggiorno in resort galleggiante a 4 stelle con colazione e pranzo di pesce.',
        'dest.delta-dunarii.amenities': 'Escursioni in Barca|Resort 4★|Pensione Completa|Degustazione Storione|Guida Locale',

        'dest.poiana-brasov.title': 'Poiana Brașov - Delizia Alpina',
        'dest.poiana-brasov.tagLabel': 'Romania • Montagna',
        'dest.poiana-brasov.period': '3 Notti / Spa & Mezza Pensione',
        'dest.poiana-brasov.description': 'Relax ai piedi del Massiccio Postăvarul! Goditi l\'aria pura di montagna, sentieri escursionistici affascinanti, accesso illimitato al centro Spa di lusso e un viaggio in gondola verso la Cima Postăvarul.',
        'dest.poiana-brasov.amenities': 'Accesso Spa & Sauna|Hotel 4★ Spa|Mezza Pensione|Biglietto Gondola|Parcheggio Gratuito',

        'dest.bran-brasov.title': 'Castello di Bran & Brașov Medievale',
        'dest.bran-brasov.tagLabel': 'Romania • Cultura',
        'dest.bran-brasov.period': '3 Notti / Prima Colazione',
        'dest.bran-brasov.description': 'Scopri la leggenda del Castello di Bran, la Chiesa Nera in Piazza del Consiglio di Brașov e l\'atmosfera affascinante delle stradine medievali. Il pacchetto include accesso guidato e una cena tradizionale.',
        'dest.bran-brasov.amenities': 'Tour Castello di Bran|Hotel Boutique 4★|Cena Tradizionale|Tour Guidato Brașov',

        'dest.transfagarasan.title': 'Transfăgărășan & Lago Bâlea',
        'dest.transfagarasan.tagLabel': 'Romania • Avventura',
        'dest.transfagarasan.period': '3 Notti / Mezza Pensione',
        'dest.transfagarasan.description': 'La strada di montagna più spettacolare del mondo! Percorri le straordinarie curve dei Monti Făgăraș, visita il lago glaciale Bâlea e la Cascata Bâlea con opzioni di escursioni guidate.',
        'dest.transfagarasan.amenities': 'Hotel al Lago Bâlea|Mezza Pensione|Guida Alpina|Tour Panoramico in Auto',

        'dest.cazanele-dunarii.title': 'Gole del Danubio & Statua di Decebal',
        'dest.cazanele-dunarii.tagLabel': 'Romania • Crociere',
        'dest.cazanele-dunarii.period': '3 Notti / Mezza Pensione',
        'dest.cazanele-dunarii.description': 'Spettacolare crociera sul Danubio attraverso le Gole del Danubio Grandi e Piccole. Ammira la scultura monumentale di Decebalo, la Tavola Traiana e la Grotta Ponicova nella Clisura del Danubio.',
        'dest.cazanele-dunarii.amenities': 'Crociera in Barca|Pensione 4★ con Piscina|Mezza Pensione|Guida Locale',

        'dest.maramures.title': 'Maramureș - Tradizione & Chiese in Legno',
        'dest.maramures.tagLabel': 'Romania • Tradizione',
        'dest.maramures.period': '5 Notti / Pensione Completa',
        'dest.maramures.description': 'Sentì lo spirito autentico del Maramureș! Viaggio sul trenino a vapore Mocănița nella Valle del Vaser, visita al Cimitero Allegro di Săpânța e alle chiese in legno patrimonio UNESCO.',
        'dest.maramures.amenities': 'Biglietto Mocănița|Pensione Tradizionale|Pensione Completa|Degustazione Horincă',

        'dest.sibiu-sighisoara.title': 'Sibiu & Sighișoara - Cuore della Transilvania',
        'dest.sibiu-sighisoara.tagLabel': 'Romania • Storico',
        'dest.sibiu-sighisoara.period': '3 Notti / Prima Colazione',
        'dest.sibiu-sighisoara.description': 'Il Ponte delle Bugie di Sibiu e la cittadella medievale abitata di Sighișoara. Un affascinante viaggio nell\'architettura sassone e nella cucina transilvana.',
        'dest.sibiu-sighisoara.amenities': 'Hotel 4★ Centrale|Prima Colazione|Tour Guidato a Piedi|Degustazione Vini',

        'dest.mamaia-constanta.title': 'Mamaia & Costa Rumena',
        'dest.mamaia-constanta.tagLabel': 'Romania • Spiaggia',
        'dest.mamaia-constanta.period': '5 Notti / All Inclusive',
        'dest.mamaia-constanta.description': 'Soggiorno sulla costa del Mar Nero con spiagge premiate Blue Flag, resort moderni a Mamaia Nord e visita al Casinò di Costanza e al Porto Tomis.',
        'dest.mamaia-constanta.amenities': 'Resort 4★ sul Mare|All Inclusive|Lettini Inclusi|Accesso Aquapark',

        'dest.roma.title': 'Roma - La Città Eterna, Italia',
        'dest.roma.tagLabel': 'City Break • Cultura',
        'dest.roma.period': '4 Notti / Prima Colazione',
        'dest.roma.description': 'Entra nella storia! Il Colosseo, la Fontana di Trevi, il Foro Romano e il Vaticano ti aspettano con autentico gelato e squisita cucina italiana.',
        'dest.roma.amenities': 'Volo Incluso|Hotel 4★ Centrale|Prima Colazione|Biglietto Colosseo Fast-Track',

        'dest.barcelona.title': 'Barcellona - Sagrada Familia & Mare',
        'dest.barcelona.tagLabel': 'City Break • Spiaggia',
        'dest.barcelona.period': '4 Notti / Prima Colazione',
        'dest.barcelona.description': 'I capolavori di Gaudí, il Park Güell, il viale La Rambla e le vibranti spiagge di Barceloneta. Una combinazione spettacolare di cultura e atmosfera mediterranea.',
        'dest.barcelona.amenities': 'Volo Diretto|Hotel 4★ Vicino Spiaggia|Prima Colazione|Ingresso Sagrada',

        'dest.londra.title': 'Londra - Metropoli Reale',
        'dest.londra.tagLabel': 'City Break • Shopping',
        'dest.londra.period': '4 Notti / Prima Colazione',
        'dest.londra.description': 'Big Ben, London Eye, Palazzo di Buckingham e l\'atmosfera cosmopolita di Covent Garden. Include tour con autobus a due piani e accesso ai migliori musei britannici.',
        'dest.londra.amenities': 'Volo Incluso|Hotel 4★ Centrale|London Eye Pass|Prima Colazione',

        'dest.praga.title': 'Praga - La Città dei 100 Campanili',
        'dest.praga.tagLabel': 'City Break • Romantico',
        'dest.praga.period': '3 Notti / Prima Colazione',
        'dest.praga.description': 'Il Ponte Carlo all\'alba, l\'Orologio Astronomico in Piazza della Città Vecchia e il Castello di Praga. Relassante crociera sul fiume Vltava con cena romantica inclusa.',
        'dest.praga.amenities': 'Volo Diretto|Hotel 4★ Centrale|Crociera sul Vltava|Prima Colazione',

        'dest.viena.title': 'Vienna - Eleganza dei Palazzi Imperiali',
        'dest.viena.tagLabel': 'City Break • Eleganza',
        'dest.viena.period': '3 Notti / Prima Colazione',
        'dest.viena.description': 'Palazzo di Schönbrunn, l\'opera viennese e la famosa torta Sachertorte. Un\'esperienza di classe reale nel cuore dell\'Europa Centrale.',
        'dest.viena.amenities': 'Volo Incluso|Hotel 4★ Superiore|Ingresso Schönbrunn|Prima Colazione',

        'dest.paris.title': 'Parigi - La Città delle Luci & Torre Eiffel',
        'dest.paris.tagLabel': 'City Break • Romanticismo',
        'dest.paris.period': '3 Notti / Prima Colazione',
        'dest.paris.description': 'Scopri il romanticismo di Parigi, la Torre Eiffel, il Museo del Louvre e gli accoglienti ristoranti francesi. Include volo diretto e soggiorno in hotel boutique a 4 stelle.',
        'dest.paris.amenities': 'Volo Diretto|Hotel 4★ Centrale|Prima Colazione|Tour Guidato Privato',

        'dest.maldive-deluxe.title': 'Maldive - Water Villa Deluxe Resort',
        'dest.maldive-deluxe.tagLabel': 'Esotico • Lusso',
        'dest.maldive-deluxe.period': '7 Notti / Premium All Inclusive',
        'dest.maldive-deluxe.description': 'Ville esclusive costruite direttamente sulle acque turchesi dell\'oceano. Snorkeling con mante, cene romantiche sulla spiaggia e trattamenti Spa di livello mondiale.',
        'dest.maldive-deluxe.amenities': 'Volo Incluso|Villa sull\'Acqua 5★|Premium All Inclusive|Trasferimento in Idrovolante',

        'dest.kenya-safari.title': 'Kenya - Safari nel Masai Mara & Spiaggia',
        'dest.kenya-safari.tagLabel': 'Esotico • Avventura',
        'dest.kenya-safari.period': '8 Notti / Circuito & Resort',
        'dest.kenya-safari.description': 'Un\'indimenticabile avventura di safari per vedere leoni, elefanti e giraffe nella riserva del Masai Mara, seguita dal relax sulle esotiche spiagge di sabbia bianca di Diani Beach.',
        'dest.kenya-safari.amenities': 'Volo Incluso|Lodge Safari 5★|Game Drives 4x4|Pensione Completa',

        'dest.bali.title': 'Bali - Ubud & Spiaggia di Seminyak',
        'dest.bali.tagLabel': 'Esotico • Relax',
        'dest.bali.period': '10 Notti / Mezza Pensione',
        'dest.bali.description': 'Una combinazione magica tra templi storici e terrazze di riso a Ubud con il relax in ville di lusso con piscina privata sulle esotiche spiagge di Seminyak.',
        'dest.bali.amenities': 'Volo Incluso|Ville con Piscina 5★|Escursioni Templi|Massaggio Spa Incluso',

        'dest.santorini.title': 'Santorini - Tramonti da Sogno, Grecia',
        'dest.santorini.tagLabel': 'Spiaggia • Romanticismo',
        'dest.santorini.period': '5 Notti / Prima Colazione',
        'dest.santorini.description': 'Case bianche con cupole blu sospese sopra il Mar Egeo. Soggiorno a Oia con vista diretta sul famoso tramonto di Santorini e crociera in catamarano.',
        'dest.santorini.amenities': 'Volo Diretto|Hotel Boutique 4★|Crociera in Catamarano|Prima Colazione',

        'dest.tokyo.title': 'Tokyo & Kyoto - Circuito Giappone',
        'dest.tokyo.tagLabel': 'Esotico • Cultura',
        'dest.tokyo.period': '9 Notti / Circuito Guidato',
        'dest.tokyo.description': 'Affascinanti contrasti tra grattacieli ultra-moderni e templi shinto tradizionali. Circuito completo con il treno proiettile Shinkansen e guida in lingua rumena.',
        'dest.tokyo.amenities': 'Volo Incluso|JR Pass Treno Proiettile|Hotel 4★|Guida in Romeno',

        'dest.alpi-elvetia.title': 'Alpi Svizzere & Matterhorn',
        'dest.alpi-elvetia.tagLabel': 'Montagna • Paesaggi',
        'dest.alpi-elvetia.period': '6 Notti / Mezza Pensione',
        'dest.alpi-elvetia.description': 'Paesaggi alpini montani spettacolari, viaggi sul trenino iconico Glacier Express e aria fresca a Zermatt vicino al Monte Matterhorn.',
        'dest.alpi-elvetia.amenities': 'Volo & Treno Incluso|Resort di Montagna 4★|Glacier Express Pass|Spa Alpino',

        'dest.dubai.title': 'Dubai - Grattacieli & Safari',
        'dest.dubai.tagLabel': 'City Break • Lusso',
        'dest.dubai.period': '5 Notti / Mezza Pensione',
        'dest.dubai.description': 'Burj Khalifa, safari con jeep 4x4 sulle dune dorate di sabbia, spettacoli di fontane e spiagge ultramoderne a Jumeirah.',
        'dest.dubai.amenities': 'Volo Diretto|Hotel 5★|Safari nel Deserto|Biglietto Burj Khalifa',

        'dest.cappadocia.title': 'Cappadocia - Mongolfiere',
        'dest.cappadocia.tagLabel': 'Esotico • Avventura',
        'dest.cappadocia.period': '4 Notti / Prima Colazione',
        'dest.cappadocia.description': 'Albe favolose cosparse di centinaia di mongolfiere colorate, hotel scavati nella roccia e straordinarie vallate lunari in Turchia.',
        'dest.cappadocia.amenities': 'Volo Incluso|Hotel nella Roccia|Volo in Mongolfiera Opzionale|Tour Vallate',

        'dest.newyork.title': 'New York - La Città dei Sogni',
        'dest.newyork.tagLabel': 'City Break • Shopping',
        'dest.newyork.period': '6 Notti / Soggiorno',
        'dest.newyork.description': 'Times Square, Central Park, la Statua della Libertà e spettacoli di Broadway. Il cuore del mondo moderno ti aspetta con un\'atmosfera memorabile.',
        'dest.newyork.amenities': 'Volo Incluso|Hotel Manhattan 4★|CityPass Incluso|Assistenza Turistica',

        // Asia Destinations
        'dest.beijing-marele-zid.title': 'Pechino & la Grande Muraglia Cinese',
        'dest.beijing-marele-zid.tagLabel': 'Cina • Cultura & Storia',
        'dest.beijing-marele-zid.period': '7 Notti / Tour Guidato',
        'dest.beijing-marele-zid.description': 'La Grande Muraglia a Mutianyu, la Città Proibita, Piazza Tiananmen e il Tempio del Cielo. Tour guidato in rumeno con una serata di Opera di Pechino e cena di anatra laccata.',
        'dest.beijing-marele-zid.amenities': 'Volo Incluso|Tour Guidato (RO)|Hotel 4★ Centrale|Grande Muraglia & Città Proibita|Cena Anatra Laccata',
        'dest.shanghai-metropola-futurului.title': 'Shanghai - Metropoli del Futuro',
        'dest.shanghai-metropola-futurului.tagLabel': 'Cina • City Break',
        'dest.shanghai-metropola-futurului.period': '5 Notti / Colazione',
        'dest.shanghai-metropola-futurului.description': 'Lo skyline futuristico di Pudong, le passeggiate sul Bund lungo il fiume Huangpu, il Giardino Yu e l\'ex Concessione Francese. Crociera serale con vista sulla metropoli illuminata.',
        'dest.shanghai-metropola-futurului.amenities': 'Volo Incluso|Hotel 4★ Pudong|Crociera sul Fiume Huangpu|Giardino Yu|Tour Panoramico',
        'dest.zhangjiajie-avatar.title': 'Zhangjiajie - Le Montagne di Avatar',
        'dest.zhangjiajie-avatar.tagLabel': 'Cina • Natura & Avventura',
        'dest.zhangjiajie-avatar.period': '6 Notti / Pensione Completa',
        'dest.zhangjiajie-avatar.description': 'Le guglie di quarzite che hanno ispirato le montagne del film Avatar, il ponte di vetro di Zhangjiajie (il più lungo del mondo) e l\'ascensore Bailong scavato nella parete rocciosa. Un\'avventura indimenticabile nel Parco Nazionale della Foresta.',
        'dest.zhangjiajie-avatar.amenities': 'Volo Incluso|Parco Nazionale UNESCO|Ponte di Vetro|Ascensore Bailong|Guida di Montagna',
        'dest.seoul-coreea.title': 'Seul - Cuore della Corea del Sud',
        'dest.seoul-coreea.tagLabel': 'Corea del Sud • City Break',
        'dest.seoul-coreea.period': '6 Notti / Colazione',
        'dest.seoul-coreea.description': 'Il Palazzo Gyeongbokgung con il cambio della guardia, il villaggio hanok di Bukchon, la N Seoul Tower, i quartieri Gangnam e Myeongdong più un tour gastronomico street food nei mercati notturni.',
        'dest.seoul-coreea.amenities': 'Volo Incluso|Hotel 4★ Myeongdong|Tour Palazzi & Hanok|Tour Street Food|Card Trasporti T-Money',
        'dest.busan-coreea.title': 'Busan - Città Marittima della Corea del Sud',
        'dest.busan-coreea.tagLabel': 'Corea del Sud • Spiaggia & Città',
        'dest.busan-coreea.period': '6 Notti / Colazione',
        'dest.busan-coreea.description': 'Lo spettacolare ponte Gwangan illuminato, la spiaggia di Haeundae, il tempio Haedong Yonggungsa su scogliere a picco sul mare e le tende pojangmacha con delizioso street food coreano.',
        'dest.busan-coreea.amenities': 'Volo Incluso|Hotel 4★ Haeundae|Tempio sul Mare|Mercato del Pesce Jagalchi|Vista Gwangan',
        'dest.jeju-insula-vulcanica.title': 'Jeju - Isola Vulcanica della Corea del Sud',
        'dest.jeju-insula-vulcanica.tagLabel': 'Corea del Sud • Spiaggia & Natura',
        'dest.jeju-insula-vulcanica.period': '7 Notti / All Inclusive',
        'dest.jeju-insula-vulcanica.description': 'Il vulcano Seongsan Ilchulbong, spiagge turchese come Hamdeok, il tubo di lava Manjanggul e le famose pescatrici haenyeo. L\'isola paradisiaca della Corea del Sud, patrimonio UNESCO.',
        'dest.jeju-insula-vulcanica.amenities': 'Volo Incluso|Resort 5★ sul Mare|All Inclusive|Tour Vulcano UNESCO|Auto a Noleggio Inclusa',

        // Pachete noi: America, Marea Britanie, Norvegia, Africa
        'dest.yosemite.title': 'Yosemite - Parco Nazionale della California',
        'dest.yosemite.tagLabel': 'USA • Natura',
        'dest.yosemite.period': '8 Notti / Prima Colazione',
        'dest.yosemite.description': 'Pareti di granito alte centinaia di metri, cascate imponenti e foreste di sequoie nel cuore della Sierra Nevada. Vedi El Capitan e Half Dome, cammina nella Yosemite Valley e sali a Glacier Point, con soggiorno in un lodge nel parco.',
        'dest.yosemite.amenities': 'Volo Incluso|Lodge nel Parco|Tour Guidato della Valle|Ingresso al Parco Incluso',
        'dest.grand-canyon.title': 'Grand Canyon - South Rim',
        'dest.grand-canyon.tagLabel': 'USA • Avventura',
        'dest.grand-canyon.period': '7 Notti / Prima Colazione',
        'dest.grand-canyon.description': 'Panorami infiniti dal South Rim all\'alba e al tramonto, passeggiate lungo il bordo del canyon e soste a Mather Point e Desert View. Volo incluso, alloggio vicino al parco e tour guidato dei punti panoramici.',
        'dest.grand-canyon.amenities': 'Volo Incluso|Hotel Vicino al Parco|Alba sul South Rim|Tour Guidato dei Belvedere',
        'dest.san-francisco.title': 'San Francisco - Golden Gate e Alcatraz',
        'dest.san-francisco.tagLabel': 'USA • City Break',
        'dest.san-francisco.period': '6 Notti / Prima Colazione',
        'dest.san-francisco.description': 'Attraversa il Golden Gate Bridge, sali sul cable car, fotografa le Painted Ladies ad Alamo Square e ammira Alcatraz dalla baia. Una città di colline, nebbia e panorami indimenticabili.',
        'dest.san-francisco.amenities': 'Volo Incluso|Hotel 4★ Centrale|Tour Golden Gate|Biglietto Cable Car',
        'dest.hawaii.title': 'Hawaii - Maui e Big Island',
        'dest.hawaii.tagLabel': 'USA • Spiaggia',
        'dest.hawaii.period': '9 Notti / Prima Colazione',
        'dest.hawaii.description': 'Spiagge di sabbia dorata e nera, tramonti a Kaanapali, la Road to Hana e coste vulcaniche sulla Big Island. Nove notti tra oceano, cascate e paesaggi di lava, con soggiorno in un resort sulla spiaggia.',
        'dest.hawaii.amenities': 'Volo Incluso|Resort sulla Spiaggia|Escursione Road to Hana|Tour della Big Island',
        'dest.banff.title': 'Banff e Lake Louise - Montagne Rocciose',
        'dest.banff.tagLabel': 'Canada • Montagna',
        'dest.banff.period': '8 Notti / Prima Colazione',
        'dest.banff.description': 'Laghi turchesi, cime innevate e foreste di conifere nelle Montagne Rocciose canadesi. Canoa sul Lake Louise, escursioni con vista sui ghiacciai e serate nell\'hotel di Banff.',
        'dest.banff.amenities': 'Volo Incluso|Hotel a Banff|Canoa sul Lake Louise|Ingresso al Parco Incluso',
        'dest.machu-picchu.title': 'Machu Picchu - La Cittadella Inca',
        'dest.machu-picchu.tagLabel': 'Perù • Cultura e Storia',
        'dest.machu-picchu.period': '9 Notti / Circuito Guidato',
        'dest.machu-picchu.description': 'Cusco, la Valle Sacra e la salita a Machu Picchu, la cittadella inca nascosta tra montagne e nuvole. Circuito guidato con treno panoramico, hotel 4★ e visita completa delle rovine e dei terrazzamenti.',
        'dest.machu-picchu.amenities': 'Volo Incluso|Treno Panoramico|Hotel 4★|Biglietto Machu Picchu',
        'dest.rio.title': 'Rio de Janeiro - Cristo Redentore e Copacabana',
        'dest.rio.tagLabel': 'Brasile • Città e Spiaggia',
        'dest.rio.period': '8 Notti / Prima Colazione',
        'dest.rio.description': 'Sali alla statua del Cristo Redentore, ammira il Pan di Zucchero e goditi le spiagge di Copacabana e Ipanema. Una città tra montagne, oceano e ritmo di samba.',
        'dest.rio.amenities': 'Volo Incluso|Hotel sulla Spiaggia|Tour Cristo Redentore|Funivia Pan di Zucchero',
        'dest.patagonia.title': 'Patagonia - Torres del Paine',
        'dest.patagonia.tagLabel': 'Cile • Avventura',
        'dest.patagonia.period': '10 Notti / Pensione Completa',
        'dest.patagonia.description': 'Le torri di granito Torres del Paine, laghi azzurro latte, ghiacciai e cascate nel sud del Cile. Escursioni quotidiane con guida e soggiorno in lodge ai margini del parco.',
        'dest.patagonia.amenities': 'Volo Incluso|Lodge ai Margini del Parco|Escursioni con Guida|Pensione Completa',
        'dest.edinburgh.title': 'Edimburgo - La Capitale della Scozia',
        'dest.edinburgh.tagLabel': 'Scozia • City Break',
        'dest.edinburgh.period': '4 Notti / Prima Colazione',
        'dest.edinburgh.description': 'Il castello sulla roccia, il Royal Mile, Calton Hill e la vista da Arthur\'s Seat in una città medievale piena di leggende. Passeggiate tra Old Town e New Town, con serate al pub.',
        'dest.edinburgh.amenities': 'Volo Incluso|Hotel 4★ Centrale|Tour Guidato Old Town|Prima Colazione',
        'dest.norvegia-fiorduri.title': 'Norvegia - Fiordo di Geiranger',
        'dest.norvegia-fiorduri.tagLabel': 'Norvegia • Fiordi',
        'dest.norvegia-fiorduri.period': '6 Notti / Prima Colazione',
        'dest.norvegia-fiorduri.description': 'Crociera sul fiordo di Geiranger, la cascata delle Sette Sorelle, belvedere a Flydalsjuvet e la strada per Dalsnibba. Notti luminose d\'estate e villaggi tra montagne e acqua.',
        'dest.norvegia-fiorduri.amenities': 'Volo Incluso|Crociera sul Fiordo|Hotel con Vista sul Fiordo|Belvedere Flydalsjuvet',
        'dest.cape-town.title': 'Città del Capo - Table Mountain',
        'dest.cape-town.tagLabel': 'Sudafrica • Avventura',
        'dest.cape-town.period': '8 Notti / Prima Colazione',
        'dest.cape-town.description': 'La funivia per Table Mountain, Lion\'s Head al tramonto, il V&A Waterfront e le spiagge intorno alla penisola. I vigneti di Constantia e una città incorniciata da montagne e oceano.',
        'dest.cape-town.amenities': 'Volo Incluso|Hotel 4★ in Città|Funivia Table Mountain|Degustazione Vini Constantia',
        // Lot 2: mai multe destinații din lume
        'dest.niagara.title': 'Cascate del Niagara - Horseshoe Falls',
        'dest.niagara.tagLabel': 'Canada • Cascate',
        'dest.niagara.period': '6 Notti / Prima Colazione',
        'dest.niagara.description': 'Il fragore dell\'acqua, arcobaleni e nebbiolina di fronte alle Horseshoe Falls sul lato canadese. Giro in barca vicino alle cascate, vista dalla Skylon Tower e serate illuminate lungo il fiume Niagara.',
        'dest.niagara.amenities': 'Volo Incluso|Hotel con Vista sulle Cascate|Giro in Barca alle Cascate|Skylon Tower',
        'dest.skye.title': 'Isola di Skye - Old Man of Storr',
        'dest.skye.tagLabel': 'Scozia • Natura',
        'dest.skye.period': '6 Notti / Prima Colazione',
        'dest.skye.description': 'Guglie di basalto, creste verdi e cascate che si tuffano in mare sulla penisola di Trotternish: Old Man of Storr, Quiraing, Fairy Glen e Kilt Rock. Escursioni facili, strade strette panoramiche e serate nei villaggi costieri.',
        'dest.skye.amenities': 'Volo Incluso|Alloggio a Portree|Tour Penisola di Trotternish|Guida Locale',
        'dest.lofoten.title': 'Lofoten - Aurora Boreale e Villaggi di Pescatori',
        'dest.lofoten.tagLabel': 'Norvegia • Artico',
        'dest.lofoten.period': '7 Notti / Prima Colazione',
        'dest.lofoten.description': 'Cime ripide sul mare, casette rosse su palafitte a Hamnøy e Reine, spiagge artiche e, in inverno, la possibilità di vedere l\'aurora boreale. Soggiorno in un rorbu, la tradizionale capanna dei pescatori.',
        'dest.lofoten.amenities': 'Volo Incluso|Soggiorno in Rorbu|Escursione Reine e Hamnøy|Guida Locale',
        'dest.irlanda.title': 'Irlanda - Cliffs of Moher e la Costa Atlantica',
        'dest.irlanda.tagLabel': 'Irlanda • Natura',
        'dest.irlanda.period': '5 Notti / Prima Colazione',
        'dest.irlanda.description': 'Scogliere fino a 214 metri sull\'Atlantico, la Torre di O\'Brien, il paesaggio calcareo del Burren e villaggi con pub e musica dal vivo. Un itinerario costiero nella contea di Clare, con partenza da Dublino.',
        'dest.irlanda.amenities': 'Volo Incluso|Alloggio a Dublino e Clare|Tour Cliffs of Moher|Guida Locale',
        'dest.islanda.title': 'Islanda - Le Cascate',
        'dest.islanda.tagLabel': 'Islanda • Natura',
        'dest.islanda.period': '6 Notti / Prima Colazione',
        'dest.islanda.description': 'Gullfoss, Seljalandsfoss, Skógafoss, Goðafoss e Selfoss: le cascate più famose dell\'Islanda, in un circuito con partenza da Reykjavík. Strade panoramiche, sorgenti geotermiche e notti luminose in estate.',
        'dest.islanda.amenities': 'Volo Incluso|Circuito da Reykjavík|Gita a Gullfoss e Seljalandsfoss|Guida Locale',
        'dest.marrakech.title': 'Marrakech - Medina e Piazza Jemaa el-Fnaa',
        'dest.marrakech.tagLabel': 'Marocco • City Break',
        'dest.marrakech.period': '5 Notti / Prima Colazione',
        'dest.marrakech.description': 'Piazza Jemaa el-Fnaa al tramonto, la moschea Koutoubia, le porte della medina, souk colorati e una cena in un riad. Una città dalle mura rosse a poche ore di volo.',
        'dest.marrakech.amenities': 'Volo Incluso|Riad nella Medina|Tour Guidato della Medina|Prima Colazione',
        'dest.egipt.title': 'Egitto - Piramidi di Giza e Sfinge',
        'dest.egipt.tagLabel': 'Egitto • Cultura e Storia',
        'dest.egipt.period': '8 Notti / Circuito Guidato',
        'dest.egipt.description': 'Le piramidi di Cheope, Chefren e Micerino, la Sfinge di Giza e un giro in cammello nel deserto. Circuito guidato con il Cairo, il Museo Egizio e una crociera sul Nilo.',
        'dest.egipt.amenities': 'Volo Incluso|Hotel 4★|Crociera sul Nilo|Guida Locale',
        'dest.zanzibar.title': 'Zanzibar - Spiagge Bianche e Stone Town',
        'dest.zanzibar.tagLabel': 'Tanzania • Spiaggia',
        'dest.zanzibar.period': '8 Notti / Prima Colazione',
        'dest.zanzibar.description': 'Sabbia bianca e acqua turchese a Nungwi, dhow al tramonto e i vicoli di Stone Town, città vecchia patrimonio UNESCO. Otto notti in un resort sulla spiaggia, con escursioni sull’isola.',
        'dest.zanzibar.amenities': 'Volo Incluso|Resort sulla Spiaggia|Tour di Stone Town|Escursione in Dhow',
        'dest.serengeti.title': 'Tanzania - Safari nel Serengeti',
        'dest.serengeti.tagLabel': 'Tanzania • Safari',
        'dest.serengeti.period': '8 Notti / Pensione Completa',
        'dest.serengeti.description': 'Pianure infinite, acacie al tramonto, leoni, elefanti e ippopotami nel Parco Nazionale del Serengeti. Game drive in 4x4, lodge da safari e, in stagione, la grande migrazione degli gnu.',
        'dest.serengeti.amenities': 'Volo Incluso|Lodge da Safari|Game Drive 4x4|Pensione Completa',
        'dest.victoria-falls.title': 'Cascate Vittoria - Zambia e Zimbabwe',
        'dest.victoria-falls.tagLabel': 'Zimbabwe • Cascate',
        'dest.victoria-falls.period': '6 Notti / Prima Colazione',
        'dest.victoria-falls.description': 'Una delle più grandi cortine d’acqua del mondo, «il fumo che tuona» (Mosi-oa-Tunya), arcobaleni e vedute dall’alto. Passeggiate sui sentieri intorno alle cascate e una crociera al tramonto sullo Zambesi.',
        'dest.victoria-falls.amenities': 'Volo Incluso|Lodge Vicino alle Cascate|Crociera sullo Zambesi|Ingresso alle Cascate',
        'dest.namibia.title': 'Namibia - Dune di Sossusvlei',
        'dest.namibia.tagLabel': 'Namibia • Avventura',
        'dest.namibia.period': '10 Notti / Circuito Guidato',
        'dest.namibia.description': 'Enormi dune rosse, gli alberi morti di Dead Vlei e l’alba su Dune 45 nel deserto del Namib. Circuito guidato di 10 notti con Windhoek, Sesriem e strade sterrate tra paesaggi aridi.',
        'dest.namibia.amenities': 'Volo Incluso|Lodge nel Deserto|Alba su Dune 45|Guida Locale',
        'dest.india.title': 'India - Taj Mahal e Jaipur',
        'dest.india.tagLabel': 'India • Cultura e Storia',
        'dest.india.period': '8 Notti / Circuito Guidato',
        'dest.india.description': 'Il Taj Mahal all’alba ad Agra, l’Amber Fort e l’Hawa Mahal a Jaipur, bazar colorati e palazzi dei maharaja. Circuito guidato del Triangolo d’Oro, con trasferimenti su strada tra le città.',
        'dest.india.amenities': 'Volo Incluso|Hotel 4★|Taj Mahal all\'Alba|Guida Locale',
        'dest.halong.title': 'Vietnam - Baia di Ha Long',
        'dest.halong.tagLabel': 'Vietnam • Natura',
        'dest.halong.period': '9 Notti / Prima Colazione',
        'dest.halong.description': 'Migliaia di isole calcaree che emergono da acque verde smeraldo, crociera su una giunca tradizionale, kayak tra le rocce e villaggi galleggianti nella baia di Lan Ha. Include una sosta a Hanoi, nel Quartiere Vecchio.',
        'dest.halong.amenities': 'Volo Incluso|Crociera nella Baia|Kayak tra le Isole|Hanoi - Quartiere Vecchio',
        'dest.noua-zeelanda.title': 'Nuova Zelanda - Milford Sound e Fiordland',
        'dest.noua-zeelanda.tagLabel': 'Nuova Zelanda • Natura',
        'dest.noua-zeelanda.period': '12 Notti / Prima Colazione',
        'dest.noua-zeelanda.description': 'Crociera sul Milford Sound, con il Mitre Peak e le cascate, panorami del Fiordland e giornate intorno a Queenstown. Dodici notti nell\'Isola del Sud, all\'altro capo del mondo.',
        'dest.noua-zeelanda.amenities': 'Volo Incluso|Crociera Milford Sound|Hotel 4★|Escursioni Fiordland',
        'dest.sydney.title': 'Sydney - Opera House e Harbour Bridge',
        'dest.sydney.tagLabel': 'Australia • City Break',
        'dest.sydney.period': '9 Notti / Prima Colazione',
        'dest.sydney.description': 'L\'Opera House e l\'Harbour Bridge di Sydney al tramonto, passeggiate a Circular Quay, traghetti nella baia e spiagge come Bondi. Una città vibrante all\'altro capo del mondo.',
        'dest.sydney.amenities': 'Volo Incluso|Hotel 4★ Centrale|Crociera nel Port Jackson|Tour Opera House',
        'dest.petra.title': 'Giordania - Petra, la Città Scolpita nella Roccia',
        'dest.petra.tagLabel': 'Giordania • Cultura e Storia',
        'dest.petra.period': '6 Notti / Circuito Guidato',
        'dest.petra.description': 'Discesa nella gola del Siq fino ad Al-Khazneh (il Tesoro), tombe reali scavate nell’arenaria rosa e salita al Monastero di Ad Deir. Circuito guidato di sei notti, con una serata facoltativa nel deserto del Wadi Rum.',
        'dest.petra.amenities': 'Volo Incluso|Hotel 4★|Biglietto Petra Incluso|Guida Locale',
        'dest.krabi.title': 'Thailandia - Krabi e Isole Phi Phi',
        'dest.krabi.tagLabel': 'Thailandia • Spiaggia',
        'dest.krabi.period': '9 Notti / Prima Colazione',
        'dest.krabi.description': 'La spiaggia di Railay, raggiungibile solo in barca, scogliere calcaree, acque turchesi e gite alle isole Phi Phi. Nove notti in un resort sulla spiaggia, con colazione e tour dell\'arcipelago.',
        'dest.krabi.amenities': 'Volo Incluso|Resort sulla Spiaggia|Gita alle Isole Phi Phi|Barca Longtail',
        'dest.cornwall.title': 'Cornovaglia - St Michael\'s Mount e la Costa Selvaggia',
        'dest.cornwall.tagLabel': 'Inghilterra • Costa',
        'dest.cornwall.period': '5 Notti / Prima Colazione',
        'dest.cornwall.description': 'L\'isola-castello di St Michael\'s Mount, collegata alla terraferma da una strada che affiora con la bassa marea, il pittoresco porto di St Ives, spiagge per il surf e le rovine di Tintagel. Villaggi di pescatori e sentieri sulle scogliere.',
        'dest.cornwall.amenities': 'Volo Incluso|Alloggio a St Ives|Tour di St Michael\'s Mount|Sentieri Costieri',
        'dest.horseshoe-bend.title': 'Horseshoe Bend e Page (Arizona)',
        'dest.horseshoe-bend.tagLabel': 'USA • Avventura',
        'dest.horseshoe-bend.period': '8 Notti / Prima Colazione',
        'dest.horseshoe-bend.description': 'L’ansa del fiume Colorado a quasi 300 metri sotto il belvedere, tramonto sull’arenaria rossa e base a Page, vicino al Lago Powell. Un itinerario nel Grand Circle del Sud-Ovest americano.',
        'dest.horseshoe-bend.amenities': 'Volo Incluso|Hotel a Page|Belvedere Horseshoe Bend|Tour Guidato',
        // Chat Bot Responses
        'chat.greeting.text': 'Ciao! 👋 Sono l\'assistente virtuale di FeelVoyage. Posso aiutarti con informazioni su destinazioni, offerte, prezzi, prenotazioni e molto altro. Come posso aiutarti oggi?',
        'chat.greeting.qr0': '🌴 Destinazioni disponibili',
        'chat.greeting.qr1': '💰 Prezzi e budget',
        'chat.greeting.qr2': '📞 Contatti',
        'chat.greeting.qr3': '📍 Sede dell\'agenzia',

        'chat.destinations.text': 'Abbiamo **59 destinazioni** disponibili nel nostro portafoglio! 🌍\n\n**Romania:** Delta del Danubio, Poiana Brașov, Bran & Brașov, Transfăgărășan, Gole del Danubio, Maramureș, Sibiu & Sighișoara, Mamaia & Costanza\n\n**Europa:** Roma, Barcellona, Londra, Praga, Vienna, Parigi\n\n**Esotiche:** Maldive, Safari in Kenya, Bali, Santorini, Tokyo & Kyoto, Alpi Svizzere, Dubai, Cappadocia, New York\n\n**Cina & Corea del Sud:** Pechino & Grande Muraglia, Shanghai, Zhangjiajie (le montagne di Avatar), Seul, Busan, Jeju\n\n**Novità:** America (Yosemite, Grand Canyon, Horseshoe Bend, San Francisco, Hawaii, Niagara, Banff, Machu Picchu, Rio de Janeiro, Patagonia), Regno Unito e Irlanda (Edimburgo, Isola di Skye, Cornovaglia, Irlanda), Nord Europa (Norvegia, Islanda), Africa (Città del Capo, Marrakech, Egitto, Zanzibar, Serengeti, Cascate Vittoria, Namibia) e Asia e Oceania (India, Vietnam, Thailandia, Giordania, Nuova Zelanda, Sydney)\n\nVuoi dettagli su una destinazione specifica?',
        'chat.destinations.qr0': '🏖️ Destinazioni esotiche',
        'chat.destinations.qr1': '🏔️ Destinazioni in Romania',
        'chat.destinations.qr2': '🌍 Destinazioni in Europa',
        'chat.destinations.qr3': '📋 Vedi tutti i pacchetti',

        'chat.exotic.text': 'Le destinazioni esotiche più richieste sono: 🏝️\n\n• **Maldive Deluxe** - Villa sull\'acqua, 7 notti\n• **Bali, Indonesia** - Templi e piantagioni di riso\n• **Santorini, Grecia** - Tramonti leggendari\n• **Safari in Kenya** - Animali selvatici\n• **Dubai** - La città del futuro\n• **Tokyo & Kyoto** - Cultura giapponese\n• **Cappadocia** - Mongolfiere\n• **New York** - La città che non dorme mai\n\nTi interessa qualche destinazione in particolare?',
        'chat.exotic.qr0': '💰 Prezzi',
        'chat.exotic.qr1': '📞 Voglio prenotare',
        'chat.exotic.qr2': '⬅️ Indietro',

        'chat.romania.text': 'Scopri le bellezze della Romania! 🇷🇴\n\n• **Delta del Danubio** - Riserva naturale UNESCO\n• **Poiana Brașov** - Stazione montana\n• **Bran & Brașov** - Il castello di Dracula\n• **Transfăgărășan** - La strada più bella del mondo\n• **Gole del Danubio** - Gola spettacolare\n• **Maramureș** - Chiese in legno patrimonio UNESCO\n• **Sibiu & Sighișoara** - Città medievali\n• **Mamaia & Costanza** - Spiaggia al Mar Nero\n\nVuoi dettagli su qualcuna?',
        'chat.romania.qr0': '💰 Prezzi',
        'chat.romania.qr1': '📞 Voglio prenotare',
        'chat.romania.qr2': '⬅️ Indietro',

        'chat.europe.text': 'Le destinazioni europee più popolari: 🇪🇺\n\n• **Roma, Italia** - Colosseo e Vaticano\n• **Barcellona, Spagna** - Sagrada Familia\n• **Londra, Inghilterra** - Tower Bridge e Big Ben\n• **Praga, Repubblica Ceca** - La città d\'oro\n• **Vienna, Austria** - Palazzo di Schönbrunn\n• **Parigi, Francia** - Torre Eiffel\n\nTi attira qualche destinazione?',
        'chat.europe.qr0': '💰 Prezzi',
        'chat.europe.qr1': '📞 Voglio prenotare',
        'chat.europe.qr2': '⬅️ Indietro',

        'chat.packages.text': 'Tutti i 59 pacchetti turistici sono visualizzati nella sezione **Destinazioni & Pacchetti** del sito. Ogni pacchetto include una galleria fotografica con diverse immagini, descrizione dettagliata, prezzo e durata del soggiorno. Puoi filtrare per categoria (Spiaggia, City Break, Esotico, ecc.) e per budget.\n\nVuoi vedere i pacchetti ora?',
        'chat.packages.qr0': '📋 Vedi i pacchetti',
        'chat.packages.qr1': '💰 Prezzi',
        'chat.packages.qr2': '⬅️ Menu principale',

        'chat.pricing.text': 'I prezzi variano a seconda di destinazione, stagione, durata e numero di viaggiatori. 💰\n\n**Romania:** da 190 EUR / persona\n**Europa (city break):** da 380 EUR / persona\n**Esotiche e Asia:** da 1.040 EUR / persona\n\nApri un pacchetto e scegli il numero di viaggiatori e i servizi extra per vedere subito il totale stimato. Per un\'offerta personalizzata, chiamaci allo **0799 927 590** o scrivici a **crucrudenis@gmail.com**.',
        'chat.pricing.qr0': '📞 Contatti',
        'chat.pricing.qr1': '🌴 Vedi le destinazioni',
        'chat.pricing.qr2': '⬅️ Menu principale',

        'chat.booking.text': 'Per prenotare, hai diverse opzioni: 🎫\n\n1. **Telefono:** 0799 927 590\n2. **Email:** crucrudenis@gmail.com\n3. **In sede:** Via Tudor Vladimirescu nr 124, Tg-Jiu\n4. **Facebook:** Messaggio diretto sulla pagina FeelVoyage\n\nI nostri consulenti ti aiuteranno a scegliere il pacchetto perfetto e a completare la prenotazione. Quale destinazione ti interessa?',
        'chat.booking.qr0': '🌴 Vedi le destinazioni',
        'chat.booking.qr1': '📍 Sede',
        'chat.booking.qr2': '🔵 Facebook',

        'chat.contact.text': 'Puoi contattarci così: 📞\n\n**Telefono:** 0799 927 590\n**Email:** crucrudenis@gmail.com\n**Sede:** Via Tudor Vladimirescu nr 124, Tg-Jiu, Gorj\n**Facebook:** [FeelVoyage Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr)\n\nTi aspettiamo con piacere!',
        'chat.contact.qr0': '🌴 Destinazioni',
        'chat.contact.qr1': '💰 Prezzi',
        'chat.contact.qr2': '⬅️ Menu principale',

        'chat.location.text': 'La sede dell\'agenzia FeelVoyage si trova in **Via Tudor Vladimirescu, nr 124, Tg-Jiu, Gorj, Romania**. 📍\n\nOrari: Lunedì - Venerdì: 09:00 - 18:00, Sabato: 10:00 - 14:00. Ti aspettiamo!',
        'chat.location.qr0': '📞 Contatti',
        'chat.location.qr1': '🔵 Facebook',
        'chat.location.qr2': '⬅️ Menu principale',

        'chat.facebook.text': 'Puoi seguirci anche sulla nostra pagina Facebook ufficiale per offerte, promozioni e novità: [FeelVoyage Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr) 🔵\n\nDacci un like per rimanere aggiornato sulle ultime offerte!',
        'chat.facebook.qr0': '🌴 Destinazioni',
        'chat.facebook.qr1': '📞 Contatti',
        'chat.facebook.qr2': '⬅️ Menu principale',

        'chat.services.text': 'I nostri servizi includono: 🛫\n\n• Pacchetti turistici completi (volo + alloggio + trasferimento)\n• City break personalizzati\n• Soggiorni al mare e in montagna\n• Tour culturali e gastronomici\n• Safari e avventure esotiche\n• Assicurazione di viaggio\n• Assistenza 24/7 in vacanza\n• Prenotazioni di gruppo (matrimoni, team building)\n\nTi interessa un tipo specifico di servizio?',
        'chat.services.qr0': '🌴 Destinazioni',
        'chat.services.qr1': '💰 Prezzi',
        'chat.services.qr2': '📞 Contatti',

        'chat.payment.text': 'Il pagamento avviene solo dopo aver parlato con un agente FeelVoyage e aver ricevuto l\'offerta confermata; non si paga sul sito. 🤝\n\nModalità disponibili, concordate con l\'agente:\n• Bonifico bancario\n• Pagamento a rate (per pacchetti > 500 EUR; senza interessi per alcuni pacchetti)\n• Contanti in sede\n\nContattaci per i dettagli!',
        'chat.payment.qr0': '📞 Contatti',
        'chat.payment.qr1': '🌴 Destinazioni',
        'chat.payment.qr2': '⬅️ Menu principale',

        'chat.default.text': 'Grazie per il tuo messaggio! 🙏 Un consulente FeelVoyage può aiutarti con i dettagli. Puoi contattarci allo **0799 927 590**, via **crucrudenis@gmail.com** o presso la sede in **Tg-Jiu, Via Tudor Vladimirescu nr 124**. Ecco come posso aiutarti ulteriormente:',
        'chat.default.qr0': '🌴 Destinazioni',
        'chat.default.qr1': '💰 Prezzi',
        'chat.default.qr2': '📞 Contatti',
        'chat.default.qr3': '📍 Sede'
    }
};
