/**
 * =====================================================================
 * KONGO SCIENCE — Collecte des candidatures « Rejoindre »
 * =====================================================================
 *
 * Reçoit les candidatures envoyées par src/components/JoinView.tsx,
 * les enregistre dans un Google Sheet, prévient le bureau et accuse
 * réception auprès du candidat.
 *
 * Même principe que les scripts déjà utilisés pour les inscriptions
 * aux conférences et les propositions d'intervention.
 *
 * ---------------------------------------------------------------------
 * INSTALLATION (10 minutes, une seule fois)
 * ---------------------------------------------------------------------
 * 1. Créer un Google Sheet nommé « Kongo Science — Candidatures ».
 * 2. Menu Extensions > Apps Script. Coller ce fichier entier.
 * 3. Renseigner SHEET_ID ci-dessous (NOTIFY_EMAILS est déjà rempli).
 * 4. Exécuter une fois la fonction initSheet() pour créer les en-têtes
 *    (Google demandera d'autoriser l'accès : accepter).
 * 5. Déployer > Nouveau déploiement > type « Application Web » :
 *       - Exécuter en tant que : Moi
 *       - Qui a accès          : Tout le monde
 * 6. Copier l'URL /exec fournie, puis la coller dans JOIN_SCRIPT_URL
 *    en haut de src/components/JoinView.tsx.
 *
 * Tant que JOIN_SCRIPT_URL reste vide, le formulaire bascule
 * automatiquement sur un envoi par courriel : aucune candidature
 * n'est perdue entre-temps.
 * =====================================================================
 */

// --- À RENSEIGNER ---------------------------------------------------
var SHEET_ID   = "COLLER_ICI_L_ID_DU_GOOGLE_SHEET";
var SHEET_NAME = "Candidatures";

/**
 * Destinataires de l'alerte interne, séparés par des virgules.
 * Les deux adresses reçoivent chaque candidature.
 */
var NOTIFY_EMAILS = "contact@kongoscience.com,kongoscience25@gmail.com";

/**
 * Adresse de réponse affichée aux candidats dans l'accusé de réception.
 * Si contact@kongoscience.com n'est pas encore opérationnelle,
 * remplacer cette ligne par "kongoscience25@gmail.com".
 */
var REPLY_TO = "contact@kongoscience.com";
// --------------------------------------------------------------------

/** Colonnes du tableau, dans l'ordre. */
var HEADERS = [
  "Date de réception",
  "Profil souhaité",
  "Prénom",
  "Nom",
  "Email",
  "WhatsApp",
  "Pays",
  "Institution",
  "Fonction",
  "Statut académique",
  "ORCID",
  "Lien publications",
  "Domaines",
  "Contributions",
  "Disponibilité",
  "Langues",
  "Message",
  "Accord affichage du nom",
  "Fuseau horaire",
  "Statut du dossier"
];

/**
 * À exécuter une seule fois, à la main, pour préparer la feuille.
 */
function initSheet() {
  var ss = SpreadsheetApp.openById(SHEET_ID);
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);

  var entete = sheet.getRange(1, 1, 1, HEADERS.length);
  entete.setFontWeight("bold");
  entete.setBackground("#1e3a8a");
  entete.setFontColor("#ffffff");
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

/**
 * Réception d'une candidature (POST depuis le site).
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var ss = SpreadsheetApp.openById(SHEET_ID);
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      initSheet();
      sheet = ss.getSheetByName(SHEET_NAME);
    }

    var recu = data.dateEnvoi ? new Date(data.dateEnvoi) : new Date();

    sheet.appendRow([
      recu,
      data.profil        || "",
      data.prenoms       || "",
      data.nom           || "",
      data.email         || "",
      data.whatsapp      || "",
      data.pays          || "",
      data.institution   || "",
      data.fonction      || "",
      data.niveau        || "",
      data.orcid         || "",
      data.profilLink    || "",
      data.domaines      || "",
      data.contributions || "",
      data.disponibilite || "",
      data.langues       || "",
      data.motivation    || "",
      data.consentNom    || "Non",
      data.clientTz      || "",
      "À examiner"
    ]);

    notifierBureau(data);
    accuserReception(data);

    return reponseJson({ status: "ok" });
  } catch (err) {
    // On trace l'erreur sans jamais renvoyer 500 : le site est en mode no-cors.
    console.error(err);
    return reponseJson({ status: "error", message: String(err) });
  }
}

/**
 * Vérification d'une candidature déjà envoyée (GET via JSONP),
 * sur le même modèle que le script des inscriptions.
 *   ?action=check&email=...
 */
function doGet(e) {
  var params   = (e && e.parameter) || {};
  var callback = params.callback;

  var resultat = { status: "ok", exists: false };

  try {
    if (params.action === "check" && params.email) {
      var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
      if (sheet && sheet.getLastRow() > 1) {
        var emails = sheet.getRange(2, 5, sheet.getLastRow() - 1, 1).getValues();
        var cible = String(params.email).trim().toLowerCase();
        for (var i = 0; i < emails.length; i++) {
          if (String(emails[i][0]).trim().toLowerCase() === cible) {
            resultat.exists = true;
            break;
          }
        }
      }
    }
  } catch (err) {
    resultat = { status: "error", exists: false, message: String(err) };
  }

  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(resultat) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return reponseJson(resultat);
}

/** Alerte au bureau, avec l'essentiel lisible dès l'objet du message. */
function notifierBureau(data) {
  var nom = ((data.prenoms || "") + " " + (data.nom || "")).trim();

  var corps =
    "Nouvelle candidature reçue sur kongoscience.com\n\n" +
    "Profil souhaité : " + (data.profil || "") + "\n" +
    "Nom             : " + nom + "\n" +
    "Email           : " + (data.email || "") + "\n" +
    "WhatsApp        : " + (data.whatsapp || "") + "\n" +
    "Pays            : " + (data.pays || "") + "\n" +
    "Institution     : " + (data.institution || "") + "\n" +
    "Fonction        : " + (data.fonction || "") + "\n" +
    "Statut          : " + (data.niveau || "") + "\n" +
    "ORCID           : " + (data.orcid || "") + "\n" +
    "Publications    : " + (data.profilLink || "") + "\n" +
    "Domaines        : " + (data.domaines || "") + "\n" +
    "Contributions   : " + (data.contributions || "") + "\n" +
    "Disponibilité   : " + (data.disponibilite || "") + "\n" +
    "Langues         : " + (data.langues || "") + "\n" +
    "Affichage nom   : " + (data.consentNom || "Non") + "\n\n" +
    "--- Message du candidat ---\n" +
    (data.motivation || "");

  MailApp.sendEmail({
    to: NOTIFY_EMAILS,
    subject: "[Candidature] " + (data.profil || "Kongo Science") + " — " + nom,
    body: corps,
    replyTo: data.email || REPLY_TO
  });
}

/** Accusé de réception au candidat : la revue s'engage sur un délai. */
function accuserReception(data) {
  if (!data.email) return;

  var prenom = (data.prenoms || "").trim() || "Bonjour";

  var corps =
    prenom + ",\n\n" +
    "Nous avons bien reçu votre candidature pour rejoindre Kongo Science " +
    "en tant que « " + (data.profil || "membre") + " ».\n\n" +
    "Le bureau examine chaque dossier et vous répondra sous deux semaines, " +
    "quelle que soit l'issue.\n\n" +
    "Merci de l'intérêt que vous portez à la science congolaise.\n\n" +
    "— Le bureau exécutif\n" +
    "Kongo Science · https://kongoscience.com";

  MailApp.sendEmail({
    to: data.email,
    subject: "Votre candidature Kongo Science a bien été reçue",
    body: corps,
    replyTo: REPLY_TO
  });
}

/** Réponse JSON standard. */
function reponseJson(objet) {
  return ContentService
    .createTextOutput(JSON.stringify(objet))
    .setMimeType(ContentService.MimeType.JSON);
}
