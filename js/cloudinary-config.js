/* FeelVoyage — contul Cloudinary pentru poze de profil (js/avatar.js).
   Gratuit, fără card: cloudinary.com → cont nou → Dashboard (numele de cloud e afișat sus) →
   Settings → Upload → Upload presets → Add upload preset:
     - Signing Mode: Unsigned
     - Folder: feelvoyage_avatars
     - Allowed formats: jpg
     - Max file size: 2 MB
   Pune mai jos numele de cloud și numele preset-ului creat. Până le completezi, butonul de poză
   de profil arată un mesaj clar de eroare, nu rămâne agățat la „Se încarcă”. */
window.FV_CLOUDINARY_CONFIG = {
    cloudName: "nglqkywm",
    uploadPreset: "FeelVoyage"   // preset-ul are deja folderul "feelvoyage_avatars" fixat în el, nu mai trebuie trimis separat
};
