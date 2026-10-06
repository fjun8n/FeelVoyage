/* FeelVoyage — cheile proiectului tău Firebase ("feelvoyage").
   Cheile de mai jos NU sunt secrete: securitatea o fac regulile din firebase-rules.json.
   Dacă lași valorile goale sau cu "PASTE...", site-ul revine automat la modul local (fără server). */
window.FV_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCNk8906sbwc4ncH-JI6jmuMwFgP9GH8DM",
    authDomain: "feelvoyage.firebaseapp.com",
    databaseURL: "https://feelvoyage-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "feelvoyage",
    appId: "1:581280196931:web:49aeaa93ec326ea75fa7f6"
};

/* Asistentul AI din chat (Gemini prin Firebase AI Logic). Nicio cheie Gemini nu se pune în cod.
   Pași: README.md → „Asistent AI (Gemini)". */
window.FV_AI_CONFIG = {
    enabled: true,                                    // false = chatul folosește doar răspunsurile clasice
    model: "gemini-3.5-flash-lite",                   // alt model: "gemini-3.5-flash" (mai precis, limite gratuite mai mici)
    appCheckSiteKey: "6Lfdc8UtAAAAAHWgMXwqmQ2xPMnujm88KhA58JGa", // cheia reCAPTCHA Enterprise creată în Google Cloud (e publică, nu e secretă)
    appCheckProvider: "enterprise",                   // "enterprise" (recomandat) sau "v3" (depreciat)
    appCheckDebug: false,                             // true doar la testare locală (vezi README)
    maxQuestionsPerSession: 30                        // câte întrebări poate pune un vizitator într-o sesiune
};
