/* FeelVoyage — asistentul de chat */
// === Live Chat Widget (Interactive) ===
const chatToggleBtn = document.getElementById('chatToggleBtn');
const chatWindow = document.getElementById('chatWindow');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatMessages = document.getElementById('chatMessages');
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const typingIndicator = document.getElementById('typingIndicator');
const quickRepliesContainer = document.getElementById('quickRepliesContainer');
const chatBadge = document.getElementById('chatBadge');

let isChatOpen = false;

let chatInitialized = false;

// Markdown renderer: converts **bold** and [text](url) to HTML
function renderMarkdown(text) {
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-brand-600 font-bold underline hover:text-brand-700">$1</a>')
        .replace(/\n/g, '<br>');
}

// Add a bot message to the chat
function addBotMessage(text, quickReplies = []) {
    const botMsgDiv = document.createElement('div');
    botMsgDiv.className = 'flex items-start gap-2';
    botMsgDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs flex-shrink-0 mt-1">
            <i class="fa-solid fa-plane-departure"></i>
        </div>
        <div class="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-slate-700 leading-relaxed max-w-[85%]">
            ${renderMarkdown(text)}
        </div>
    `;
    chatMessages.appendChild(botMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (quickReplies.length > 0) {
        showQuickReplies(quickReplies);
    } else {
        quickRepliesContainer.innerHTML = '';
    }
}

// Add a user message
function addUserMessage(text) {
    const userMsgDiv = document.createElement('div');
    userMsgDiv.className = 'flex items-end justify-end gap-2';
    userMsgDiv.innerHTML = `
        <div class="bg-gradient-to-r from-brand-600 to-brand-500 text-white p-3 rounded-2xl rounded-tr-none shadow-sm text-xs leading-relaxed max-w-[85%]">
            ${text}
        </div>
    `;
    chatMessages.appendChild(userMsgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show dynamic quick reply buttons
function showQuickReplies(replies) {
    quickRepliesContainer.innerHTML = '';
    replies.forEach(reply => {
        const btn = document.createElement('button');
        btn.className = 'quick-btn text-left px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium transition border border-brand-200/60 text-[11px]';
        btn.textContent = reply.label;
        btn.dataset.reply = reply.value;
        quickRepliesContainer.appendChild(btn);
    });
}

// Show typing indicator, then send bot reply
function sendBotReply(text, quickReplies = []) {
    typingIndicator.classList.remove('hidden');
    chatMessages.scrollTop = chatMessages.scrollHeight;
    const delay = 600 + Math.random() * 600;
    setTimeout(() => {
        typingIndicator.classList.add('hidden');
        addBotMessage(text, quickReplies);
    }, delay);
}

// Bot knowledge base
const botResponses = {
    greeting: {
        text: 'Salut! 👋 Sunt asistentul virtual FeelVoyage. Te pot ajuta cu informații despre destinații, oferte, prețuri, rezervări și multe altele. Cu ce te pot ajuta astăzi?',
        quickReplies: [
            { label: '🌴 Destinații disponibile', value: 'destinații' },
            { label: '💰 Prețuri și buget', value: 'prețuri' },
            { label: '📞 Contact', value: 'contact' },
            { label: '📍 Sediul agenției', value: 'sediul' }
        ]
    },
    destinations: {
        text: 'Avem **29 de destinații** disponibile în portofoliul nostru! 🌍\n\n**România:** Delta Dunării, Poiana Brașov, Bran & Brașov, Transfăgărășan, Cazanele Dunării, Maramureș, Sibiu & Sighișoara, Mamaia & Constanța\n\n**Europa:** Roma, Barcelona, Londra, Praga, Viena, Paris\n\n**Exotice:** Maldive, Kenya Safari, Bali, Santorini, Tokyo & Kyoto, Alpii Elvețieni, Dubai, Cappadocia, New York\n\n**China & Coreea de Sud:** Beijing & Marele Zid, Shanghai, Zhangjiajie (munții din Avatar), Seoul, Busan, Jeju\n\nVrei detalii despre o destinație anume?',
        quickReplies: [
            { label: '🏖️ Destinații exotice', value: 'exotice' },
            { label: '🏔️ Destinații în România', value: 'romania' },
            { label: '🌍 Destinații în Europa', value: 'europa' },
            { label: '📋 Vezi toate pachetele', value: 'pachete' }
        ]
    },
    exotic: {
        text: 'Cele mai căutate destinații exotice sunt: 🏝️\n\n• **Maldive Deluxe** - Vilă peste apă, 7 nopți\n• **Bali, Indonezia** - Temple și plantații de orez\n• **Santorini, Grecia** - Apusuri legendare\n• **Kenya Safari** - Animale sălbatice\n• **Dubai** - Orașul viitorului\n• **Tokyo & Kyoto** - Cultura japoneză\n• **Cappadocia** - Baloane cu aer cald\n• **New York** - Orașul care nu doarme\n\nTe interesează vreo destinație anume?',
        quickReplies: [
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '📞 Vreau să rezerv', value: 'rezervare' },
            { label: '⬅️ Înapoi', value: 'destinații' }
        ]
    },
    romania: {
        text: 'Descoperă frumusețile României! 🇷🇴\n\n• **Delta Dunării** - Rezervație naturală UNESCO\n• **Poiana Brașov** - Stațiune montană\n• **Bran & Brașov** - Castelul lui Dracula\n• **Transfăgărășan** - Cel mai frumos drum din lume\n• **Cazanele Dunării** - Defileu spectaculos\n• **Maramureș** - Bisericile de lemn patrimoniu UNESCO\n• **Sibiu & Sighișoara** - Orașe medievale\n• **Mamaia & Constanța** - Plajă la Marea Neagră\n\nVrei detalii despre vreuna?',
        quickReplies: [
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '📞 Vreau să rezerv', value: 'rezervare' },
            { label: '⬅️ Înapoi', value: 'destinații' }
        ]
    },
    europe: {
        text: 'Cele mai populare destinații europene: 🇪🇺\n\n• **Roma, Italia** - Coloseumul și Vaticanul\n• **Barcelona, Spania** - Sagrada Familia\n• **Londra, Anglia** - Tower Bridge și Big Ben\n• **Praga, Cehia** - Orașul de aur\n• **Viena, Austria** - Palatul Schönbrunn\n• **Paris, Franța** - Turnul Eiffel\n\nTe atrage vreo destinație?',
        quickReplies: [
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '📞 Vreau să rezerv', value: 'rezervare' },
            { label: '⬅️ Înapoi', value: 'destinații' }
        ]
    },
    packages: {
        text: 'Toate cele 23 de pachete turistice sunt afișate în secțiunea **Destinații & Pachete** de pe site. Fiecare pachet include galerie foto cu 4 imagini, descriere detaliată, preț și durata sejurului. Poți filtra după categorie (Litoral, City Break, Exotic, etc.) și după buget.\n\nVrei să vezi pachetele acum?',
        quickReplies: [
            { label: '📋 Vezi pachetele', value: 'scroll_packages' },
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '⬅️ Meniu principal', value: 'meniu' }
        ]
    },
    pricing: {
        text: 'Prețurile variază în funcție de destinație, sezon, durată și numărul de persoane. 💰\n\n**România:** de la 190 EUR / persoană\n**Europa (city break):** de la 380 EUR / persoană\n**Exotice și Asia:** de la 1.040 EUR / persoană\n\nDeschide orice pachet și alege numărul de călători și serviciile dorite: vezi imediat prețul total estimat. Pentru o ofertă personalizată, sună-ne la **0799 927 590** sau scrie-ne pe **crucrudenis@gmail.com**.',
        quickReplies: [
            { label: '📞 Contact', value: 'contact' },
            { label: '🌴 Vezi destinațiile', value: 'destinații' },
            { label: '⬅️ Meniu principal', value: 'meniu' }
        ]
    },
    booking: {
        text: 'Pentru a rezerva, ai mai multe variante: 🎫\n\n1. **Telefon:** 0799 927 590\n2. **Email:** crucrudenis@gmail.com\n3. **La sediu:** Str. Tudor Vladimirescu nr 124, Tg-Jiu\n4. **Facebook:** Mesaj direct pe pagina FeelVoyage\n\nConsultanții noștri te vor ajuta să alegi pachetul perfect și să finalizezi rezervarea. Ce destinație te interesează?',
        quickReplies: [
            { label: '🌴 Vezi destinațiile', value: 'destinații' },
            { label: '📍 Sediul', value: 'sediul' },
            { label: '🔵 Facebook', value: 'facebook' }
        ]
    },
    contact: {
        text: 'Ne poți contacta astfel: 📞\n\n**Telefon:** 0799 927 590\n**Email:** crucrudenis@gmail.com\n**Sediu:** Str. Tudor Vladimirescu nr 124, Tg-Jiu, Gorj\n**Facebook:** [FeelVoyage Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr)\n\nTe așteptăm cu drag!',
        quickReplies: [
            { label: '🌴 Destinații', value: 'destinații' },
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '⬅️ Meniu principal', value: 'meniu' }
        ]
    },
    location: {
        text: 'Sediul agenției FeelVoyage se află pe **Strada Tudor Vladimirescu, nr 124, Tg-Jiu, Gorj, România**. 📍\n\nProgram: Luni - Vineri: 09:00 - 18:00, Sâmbătă: 10:00 - 14:00. Te așteptăm!',
        quickReplies: [
            { label: '📞 Contact', value: 'contact' },
            { label: '🔵 Facebook', value: 'facebook' },
            { label: '⬅️ Meniu principal', value: 'meniu' }
        ]
    },
    facebook: {
        text: 'Ne poți urmări și pe pagina noastră oficială de Facebook pentru oferte, promoții și noutăți: [FeelVoyage Facebook](https://www.facebook.com/share/19XnMiUthZ/?mibextid=wwXlfr) 🔵\n\nDă-ne un like pentru a fi la curent cu cele mai noi oferte!',
        quickReplies: [
            { label: '🌴 Destinații', value: 'destinații' },
            { label: '📞 Contact', value: 'contact' },
            { label: '⬅️ Meniu principal', value: 'meniu' }
        ]
    },
    services: {
        text: 'Serviciile noastre includ: 🛫\n\n• Pachete turistice complete (zbor + cazare + transfer)\n• City break-uri personalizate\n• Sejururi la plajă și la munte\n• Tururi culturale și gastronomice\n• Safari și aventuri exotice\n• Asigurare de călătorie\n• Asistență 24/7 în vacanță\n• Rezervări de grup (nuntă, team building)\n\nTe interesează un anumit tip de serviciu?',
        quickReplies: [
            { label: '🌴 Destinații', value: 'destinații' },
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '📞 Contact', value: 'contact' }
        ]
    },
    payment: {
        text: 'Metode de plată disponibile: 💳\n\n• Transfer bancar\n• Card (Visa / Mastercard)\n• Plata în rate (pentru pachete > 500 EUR)\n• Cash la sediu\n\nAvem și opțiuni de plată în rate fără dobândă pentru anumite pachete. Contactează-ne pentru detalii!',
        quickReplies: [
            { label: '📞 Contact', value: 'contact' },
            { label: '🌴 Destinații', value: 'destinații' },
            { label: '⬅️ Meniu principal', value: 'meniu' }
        ]
    },
    default: {
        text: 'Îți mulțumesc pentru mesaj! 🙏 Un consultant FeelVoyage te poate ajuta cu detalii. Ne poți contacta la **0799 927 590**, pe **crucrudenis@gmail.com** sau la sediul din **Tg-Jiu, Str. Tudor Vladimirescu nr 124**. Iată ce te pot ajuta mai departe:',
        quickReplies: [
            { label: '🌴 Destinații', value: 'destinații' },
            { label: '💰 Prețuri', value: 'prețuri' },
            { label: '📞 Contact', value: 'contact' },
            { label: '📍 Sediul', value: 'sediul' }
        ]
    }
};

// Keyword matching engine
// Keyword lists per language for multi-language chat matching
const chatKeywords = {
    greeting: {
        ro: ['salut','buna','bună','neata','neața','meniu','principal','înapoi','inapoi'],
        en: ['hello','hi','hey','menu','main','back'],
        it: ['ciao','salve','menu','principale','indietro']
    },
    destinations: {
        ro: ['destinaț','destinat','pachet','ofertă','oferta','unde pot călători','ce oferiți'],
        en: ['destination','package','offer','where can i travel','what do you offer'],
        it: ['destinazione','pacchetto','offerta','dove posso viaggiare','cosa offrite']
    },
    exotic: {
        ro: ['exotic','maldive','bali','santorini','dubai','tokyo','cappadocia','new york','kenya','safari'],
        en: ['exotic','maldives','bali','santorini','dubai','tokyo','cappadocia','new york','kenya','safari'],
        it: ['esotico','maldive','bali','santorini','dubai','tokyo','cappadocia','new york','kenya','safari']
    },
    romania: {
        ro: ['român','romania','delta','brașov','brasov','bran','transfăgărășan','cazanele','maramureș','sibiu','sighișoara','mamaia','constanța'],
        en: ['romania','danube delta','brasov','bran','transfagarasan','maramures','sibiu','sighisoara','mamaia','constanta'],
        it: ['romania','delta del danubio','brasov','bran','transfagarasan','maramures','sibiu','sighisoara','mamaia','costanza']
    },
    europe: {
        ro: ['europa','roma','barcelona','londra','praga','viena','paris'],
        en: ['europe','rome','barcelona','london','prague','vienna','paris'],
        it: ['europa','roma','barcellona','londra','praga','vienna','parigi']
    },
    packages: {
        ro: ['pachete','vezi toate','oferte','listă'],
        en: ['packages','all offers','list'],
        it: ['pacchetti','tutte le offerte','lista']
    },
    pricing: {
        ro: ['preț','pret','buget','cât costă','cat costa','tarif','prețuri'],
        en: ['price','budget','how much','cost','rates'],
        it: ['prezzo','budget','quanto costa','tariffa','prezzi']
    },
    booking: {
        ro: ['rezerv','booking','vreau să plec','vreau sa plec','cumpăr'],
        en: ['book','booking','reservation','i want to travel','buy'],
        it: ['prenota','prenotazione','voglio viaggiare','comprare']
    },
    contact: {
        ro: ['contact','telefon','email','mail','yahoo'],
        en: ['contact','phone','email','mail'],
        it: ['contatto','telefono','email','mail']
    },
    location: {
        ro: ['sediul','adresa','unde sunteți','unde sunteti','tg-jiu','tg jiu','tudor vladimirescu'],
        en: ['office','address','where are you','tg-jiu','tudor vladimirescu'],
        it: ['sede','indirizzo','dove siete','tg-jiu','tudor vladimirescu']
    },
    facebook: {
        ro: ['facebook','pagina','social'],
        en: ['facebook','page','social'],
        it: ['facebook','pagina','social']
    },
    services: {
        ro: ['servici','ce faceți','ce faceti','ajut'],
        en: ['service','what do you do','help'],
        it: ['servizi','cosa fate','aiuto']
    },
    payment: {
        ro: ['plată','plata','rate','card','transfer'],
        en: ['payment','installment','card','transfer'],
        it: ['pagamento','rate','carta','bonifico']
    }
};

// Build a translated bot response object for a given category
function getTranslatedBotResponse(category) {
    const roResp = botResponses[category] || botResponses.default;
    const text = tr('chat.' + category + '.text', roResp.text);
    const replies = roResp.quickReplies || [];
    const quickReplies = replies.map((qr, i) => ({
        label: tr('chat.' + category + '.qr' + i, qr.label),
        value: qr.value
    }));
    return { text, quickReplies };
}

function getBotResponse(msg) {
    const lower = msg.toLowerCase();
    
    const categoryOrder = ['greeting','destinations','exotic','romania','europe','packages','pricing','booking','contact','location','facebook','services','payment'];
    
    for (const cat of categoryOrder) {
        const kws = chatKeywords[cat];
        if (!kws) continue;
        const langKws = (kws[currentLang] || []).concat(kws.ro || []);
        if (langKws.some(kw => lower.includes(kw))) {
            return getTranslatedBotResponse(cat);
        }
    }
    
    // Also check Romanian keywords as fallback for all languages
    for (const cat of categoryOrder) {
        const kws = chatKeywords[cat];
        if (!kws) continue;
        const allKws = Object.values(kws).flat();
        if (allKws.some(kw => lower.includes(kw))) {
            return getTranslatedBotResponse(cat);
        }
    }
    
    return getTranslatedBotResponse('default');
}

// Initialize chat with welcome message
function initChat() {
    if (chatInitialized) return;
    chatInitialized = true;
    chatMessages.innerHTML = '';
    const greeting = getTranslatedBotResponse('greeting');
    sendBotReply(greeting.text, greeting.quickReplies);
}

// Toggle chat window
function toggleChat() {
    isChatOpen = !isChatOpen;
    if (isChatOpen) {
        chatWindow.classList.remove('hidden');
        if (chatBadge) chatBadge.style.display = 'none';
        setTimeout(() => {
            chatWindow.classList.remove('scale-95', 'opacity-0');
            chatWindow.classList.add('scale-100', 'opacity-100');
            initChat();
            chatInput.focus();
        }, 10);
    } else {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            chatWindow.classList.add('hidden');
        }, 200);
    }
}

chatToggleBtn.addEventListener('click', toggleChat);
closeChatBtn.addEventListener('click', toggleChat);

// Handle quick reply button clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-btn')) {
        const replyValue = e.target.dataset.reply || e.target.innerText.trim();
        const displayText = e.target.innerText.trim();
        quickRepliesContainer.innerHTML = '';

        if (replyValue === 'scroll_packages') {
            addUserMessage(displayText);
            toggleChat();
            setTimeout(() => {
                document.getElementById('destinatii').scrollIntoView({ behavior: 'smooth' });
            }, 300);
            return;
        }

        handleUserMessage(replyValue, displayText);
    }
});

// Handle form submission
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
        chatInput.value = '';
        handleUserMessage(text);
    }
});

// Process user message and generate bot response
// `displayText` is what's shown in the chat bubble (translated label);
// `text` is the canonical value used for keyword/category matching.
function handleUserMessage(text, displayText) {
    addUserMessage(displayText !== undefined ? displayText : text);
    const response = getBotResponse(text);
    sendBotReply(response.text, response.quickReplies || []);
}
