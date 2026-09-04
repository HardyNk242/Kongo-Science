/****************
 * KONGO SCIENCE — DIFFUSION DES ANNONCES DE CONFÉRENCES
 *
 * Envoie l'annonce d'une conférence à la banque d'abonnés, en respectant
 * automatiquement le quota d'envoi du compte Google.
 *
 * ---------------------------------------------------------------------
 * LE PROBLÈME QUE CE SCRIPT RÉSOUT
 * ---------------------------------------------------------------------
 * Un compte Gmail gratuit ne peut écrire qu'à 100 destinataires par jour.
 * Avec 239 abonnés, un envoi unique échouerait à mi-parcours — et rien ne
 * dirait qui a reçu le message et qui ne l'a pas reçu.
 *
 * Le script découpe donc l'envoi : chaque destinataire est inscrit dans une
 * file d'attente, et un déclencheur quotidien expédie ce que le quota permet.
 * Une campagne de 239 personnes se termine d'elle-même en trois jours, sans
 * doublon ni oubli.
 *
 * ---------------------------------------------------------------------
 * UTILISATION COURANTE
 * ---------------------------------------------------------------------
 * 1. Dans l'onglet « Campagnes », ajouter une ligne :
 *       Titre, EventId, Date, Heure, Lien affiche, Statut = « À préparer »
 *    (le lien d'inscription est construit automatiquement depuis EventId)
 * 2. Exécuter preparerCampagnes() : la file d'attente est constituée.
 * 3. Exécuter envoyerLot() pour partir tout de suite, ou laisser le
 *    déclencheur quotidien s'en charger.
 *
 * ---------------------------------------------------------------------
 * INSTALLATION (une seule fois)
 * ---------------------------------------------------------------------
 * 1. Ouvrir le classeur « KongoScience — Diffusion » depuis
 *    kongoscience25@gmail.com, puis Extensions > Apps Script.
 * 2. Coller ce fichier entier.
 * 3. Exécuter initDiffusion() (crée les onglets et la clé de désinscription).
 * 4. Exécuter installerDeclencheurEnvoi() (envoi quotidien automatique).
 * 5. Déployer > Nouveau déploiement > Application Web :
 *       Exécuter en tant que : Moi
 *       Qui a accès          : Tout le monde   <-- requis pour la désinscription
 * 6. M'envoyer l'URL /exec : elle sert de lien de désinscription.
 ****************/

/****************
 * CONFIGURATION
 ****************/
const SPREADSHEET_ID = "1gbcT8CZWgPUlTVz5ovz5wXsy_u0TO79WwcIZD33sxp8";

const SHEET_ABONNES = "Abonnes";
const SHEET_CAMPAGNES = "Campagnes";
const SHEET_FILE = "File";
const SHEET_DASH = "Dashboard";

const ORG_TZ = "Africa/Brazzaville";
const SITE_URL = "https://kongoscience.com";
const NOTIFY_EMAIL = "kongoscience25@gmail.com";

// Marge laissée sous le quota : on ne consomme jamais le dernier crédit,
// pour que les confirmations d'inscription et de candidature puissent
// toujours partir. Elles sont prioritaires sur une annonce.
const MARGE_QUOTA = 15;

// Plafond par exécution, indépendamment du quota restant.
const MAX_PAR_LOT = 90;

const COLS_ABONNES = [
  "Email", "Nom complet", "Institution", "Pays", "Statut", "Date d'ajout", "Source", "Note"
];
const A_EMAIL = 0, A_NOM = 1, A_STATUT = 4;

const COLS_CAMPAGNES = [
  "Titre", "EventId", "Date", "Heure", "Lien affiche", "Statut", "Créée le", "Total", "Envoyés"
];
const C_TITRE = 0, C_EVENT = 1, C_DATE = 2, C_HEURE = 3, C_AFFICHE = 4,
      C_STATUT = 5, C_CREEE = 6, C_TOTAL = 7, C_ENVOYES = 8;

const COLS_FILE = ["Campagne", "Email", "Nom", "Statut", "Date envoi", "Erreur"];
const F_CAMPAGNE = 0, F_EMAIL = 1, F_NOM = 2, F_STATUT = 3, F_DATE = 4, F_ERREUR = 5;

/****************
 * PRÉPARATION D'UNE CAMPAGNE
 ****************/
/**
 * Parcourt l'onglet « Campagnes » et met en file d'attente tous les abonnés
 * actifs pour chaque ligne marquée « À préparer ».
 */
function preparerCampagnes() {
  const ssCamp = getSheet_(SHEET_CAMPAGNES);
  const lignes = ssCamp.getDataRange().getValues();
  if (lignes.length <= 1) { Logger.log("Aucune campagne."); return; }

  const abonnes = lireAbonnesActifs_();
  if (abonnes.length === 0) { Logger.log("Aucun abonné actif."); return; }

  const fileSheet = getSheet_(SHEET_FILE);
  let preparees = 0;

  for (let i = 1; i < lignes.length; i++) {
    if (String(lignes[i][C_STATUT] || "").trim().toLowerCase() !== "à préparer") continue;

    const titre = String(lignes[i][C_TITRE] || "").trim();
    if (!titre) continue;

    const idCampagne = `${normaliserDate_(lignes[i][C_DATE]) || "sans-date"}__${titre}`.slice(0, 90);

    // Les personnes déjà en file pour cette campagne ne sont jamais réinscrites :
    // relancer preparerCampagnes() ne provoque donc aucun doublon.
    const dejaEnFile = new Set(
      fileSheet.getDataRange().getValues()
        .filter(r => String(r[F_CAMPAGNE]) === idCampagne)
        .map(r => String(r[F_EMAIL]).trim().toLowerCase())
    );

    const nouvelles = abonnes
      .filter(a => !dejaEnFile.has(a.email))
      .map(a => [idCampagne, a.email, a.nom, "En attente", "", ""]);

    if (nouvelles.length > 0) {
      fileSheet.getRange(fileSheet.getLastRow() + 1, 1, nouvelles.length, COLS_FILE.length)
        .setValues(nouvelles);
    }

    ssCamp.getRange(i + 1, C_STATUT + 1).setValue("En cours");
    ssCamp.getRange(i + 1, C_CREEE + 1).setValue(new Date());
    ssCamp.getRange(i + 1, C_TOTAL + 1).setValue(dejaEnFile.size + nouvelles.length);
    preparees++;

    Logger.log(`Campagne « ${titre} » : ${nouvelles.length} destinataire(s) mis en file.`);
  }

  SpreadsheetApp.flush();
  if (preparees === 0) Logger.log("Aucune campagne au statut « À préparer ».");
}

/****************
 * ENVOI PAR LOTS
 ****************/
/**
 * Expédie ce que le quota du jour permet. À laisser tourner quotidiennement :
 * une campagne se termine d'elle-même au bout de quelques jours.
 */
function envoyerLot() {
  const quotaRestant = MailApp.getRemainingDailyQuota();
  const budget = Math.min(MAX_PAR_LOT, quotaRestant - MARGE_QUOTA);

  if (budget <= 0) {
    Logger.log(`Quota épuisé (${quotaRestant} restant, marge ${MARGE_QUOTA}). Réessai demain.`);
    return;
  }

  const fileSheet = getSheet_(SHEET_FILE);
  const file = fileSheet.getDataRange().getValues();
  if (file.length <= 1) { Logger.log("File vide."); return; }

  const campagnes = indexerCampagnes_();

  let envoyes = 0, echecs = 0;

  for (let i = 1; i < file.length && envoyes < budget; i++) {
    if (String(file[i][F_STATUT] || "").trim() !== "En attente") continue;

    const idCampagne = String(file[i][F_CAMPAGNE] || "").trim();
    const campagne = campagnes[idCampagne];
    if (!campagne) continue;

    const email = String(file[i][F_EMAIL] || "").trim();
    const nom = String(file[i][F_NOM] || "").trim();
    if (!email) continue;

    try {
      MailApp.sendEmail({
        to: email,
        subject: `${campagne.titre} — inscription ouverte`,
        replyTo: NOTIFY_EMAIL,
        htmlBody: buildAnnonceHtml_(nom, campagne, email)
      });
      // Marquage immédiat : une interruption ne doit jamais provoquer
      // un second envoi à la même personne.
      fileSheet.getRange(i + 1, F_STATUT + 1).setValue("Envoyé");
      fileSheet.getRange(i + 1, F_DATE + 1).setValue(new Date());
      envoyes++;
    } catch (err) {
      fileSheet.getRange(i + 1, F_STATUT + 1).setValue("Échec");
      fileSheet.getRange(i + 1, F_ERREUR + 1).setValue(String(err).slice(0, 200));
      echecs++;
    }
  }

  SpreadsheetApp.flush();
  majAvancementCampagnes_();
  updateDashboardSheet_();

  Logger.log(`${envoyes} envoi(s), ${echecs} échec(s). Quota restant : ${MailApp.getRemainingDailyQuota()}.`);
}

/** À exécuter UNE FOIS : envoi automatique chaque jour à 8 h. */
function installerDeclencheurEnvoi() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "envoyerLot")
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger("envoyerLot").timeBased().atHour(8).everyDays(1)
    .inTimezone(ORG_TZ).create();
  Logger.log("Déclencheur installé : envoyerLot chaque jour à 8 h (Brazzaville).");
}

/****************
 * DÉSINSCRIPTION (lien en bas de chaque annonce)
 ****************/
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (String(p.action || "") === "desinscription") return traiterDesinscription_(p);
  return renderDashboard_();
}

function traiterDesinscription_(p) {
  const email = String(p.email || "").trim().toLowerCase();
  const jeton = String(p.jeton || "").trim();

  // Sans jeton, n'importe qui pourrait désinscrire n'importe quelle adresse
  // en devinant l'URL.
  if (!email || jeton !== jetonPour_(email)) {
    return pageHtml_("Lien invalide",
      "Ce lien de désinscription n'est pas valide. Écrivez-nous à " + NOTIFY_EMAIL + ".", "#dc2626");
  }

  const sheet = getSheet_(SHEET_ABONNES);
  const finder = sheet.getRange("A:A").createTextFinder(email).matchEntireCell(true);
  const trouve = finder.findNext();

  if (!trouve) {
    return pageHtml_("Adresse introuvable",
      "Cette adresse ne figure pas dans notre liste.", "#6b7280");
  }

  sheet.getRange(trouve.getRow(), A_STATUT + 1).setValue("Désinscrit");
  SpreadsheetApp.flush();

  return pageHtml_("Désinscription confirmée",
    "Vous ne recevrez plus nos annonces de conférences. " +
    "Vous restez libre de vous réinscrire à tout moment depuis kongoscience.com.", "#198754");
}

/** Jeton de désinscription, propre à chaque adresse. */
function jetonPour_(email) {
  const props = PropertiesService.getScriptProperties();
  let secret = props.getProperty("SECRET_DESINSCRIPTION");
  if (!secret) {
    secret = Utilities.getUuid();
    props.setProperty("SECRET_DESINSCRIPTION", secret);
  }
  const sig = Utilities.computeHmacSha256Signature(String(email).toLowerCase(), secret);
  return Utilities.base64EncodeWebSafe(sig).slice(0, 22);
}

/****************
 * COURRIEL D'ANNONCE
 ****************/
function buildAnnonceHtml_(nom, campagne, email) {
  const esc = escapeHtml_;
  const bg = "#fff8e7", primary = "#d97706", accent = "#dc2626";

  const prenom = (nom || "").split(" ")[0] || "Bonjour";
  const lienInscription = campagne.eventId
    ? `${SITE_URL}/registration/${encodeURIComponent(campagne.eventId)}`
    : `${SITE_URL}/agenda`;

  const lienDesinscription =
    `${ScriptApp.getService().getUrl()}?action=desinscription` +
    `&email=${encodeURIComponent(email)}&jeton=${encodeURIComponent(jetonPour_(email))}`;

  const affiche = String(campagne.affiche || "").trim();
  const blocAffiche = affiche
    ? `<img src="${esc(affiche)}" alt="${esc(campagne.titre)}" style="width:100%;height:auto;display:block;">`
    : "";

  const quand = [campagne.dateLisible, campagne.heure].filter(Boolean).join(" à ");

  return `
  <div style="margin:0;padding:0;background:${bg};width:100%;">
    <div style="max-width:650px;margin:0 auto;padding:28px 16px;">
      <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07),0 10px 20px rgba(0,0,0,0.04);">

        ${blocAffiche}

        <div style="background:linear-gradient(135deg, ${primary} 0%, ${accent} 100%);padding:28px 26px;text-align:center;">
          <div style="color:rgba(255,255,255,0.85);font-size:11px;text-transform:uppercase;letter-spacing:2px;margin-bottom:8px;">
            Conférence scientifique
          </div>
          <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:24px;font-weight:700;line-height:1.3;">
            ${esc(campagne.titre)}
          </h1>
        </div>

        <div style="padding:30px 26px;line-height:1.7;color:#1f2937;font-family:Georgia,serif;">
          <p style="margin:0 0 16px;font-size:16px;">
            Bonjour <strong style="color:${primary};">${esc(prenom)}</strong>,
          </p>

          <p style="margin:0 0 18px;font-size:16px;">
            Kongo Science vous convie à sa prochaine conférence.
            ${quand ? `Elle se tiendra le <strong>${esc(quand)}</strong> (heure de Brazzaville).` : ""}
            La participation est gratuite, les places sont limitées.
          </p>

          <div style="text-align:center;margin:28px 0;">
            <a href="${lienInscription}" target="_blank" rel="noopener noreferrer"
              style="display:inline-block;background:${primary};color:#fff;text-decoration:none;padding:15px 30px;border-radius:10px;font-size:17px;font-weight:800;">
              Je m'inscris
            </a>
          </div>

          <p style="margin:0;font-size:13px;color:#6b7280;text-align:center;">
            Vous recevrez aussitôt une confirmation, ainsi qu'un rappel une heure
            avant le début.
          </p>
        </div>

        <div style="background:${bg};padding:18px 22px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0 0 8px;color:#6b7280;font-size:12px;">
            Kongo Science — Communauté scientifique · Brazzaville
          </p>
          <p style="margin:0;font-size:11px;color:#9ca3af;">
            Vous recevez ce message car votre adresse figure dans notre liste de diffusion.
            <a href="${lienDesinscription}" style="color:#6b7280;">Se désinscrire</a>
          </p>
        </div>
      </div>
    </div>
  </div>`;
}

/****************
 * TABLEAU DE BORD
 ****************/
function renderDashboard_() {
  const s = getStats_();
  const esc = escapeHtml_;
  const updated = Utilities.formatDate(new Date(), ORG_TZ, "dd/MM/yyyy HH:mm:ss");
  const quota = MailApp.getRemainingDailyQuota();

  const lignesCamp = s.campagnes.length
    ? s.campagnes.map(c => `
        <tr>
          <td><div class="fw-bold">${esc(c.titre)}</div>
              <div class="text-muted small">${esc(c.statut)}</div></td>
          <td class="text-end">
            <div class="fw-bold">${c.envoyes} / ${c.total}</div>
            <div class="progress mt-1" style="height:5px;width:120px;">
              <div class="progress-bar bg-success" style="width:${c.total ? Math.round(c.envoyes / c.total * 100) : 0}%"></div>
            </div>
          </td>
        </tr>`).join('')
    : `<tr><td class="text-muted">Aucune campagne</td><td></td></tr>`;

  const html = `
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <base target="_top">
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body { background:#f4f7f6; padding:25px; font-family:'Segoe UI',system-ui,sans-serif; }
          .card { border-radius:12px; border:none; box-shadow:0 8px 16px rgba(0,0,0,0.05); margin-bottom:25px; }
          .stat-number { font-size:2.6rem; font-weight:800; color:#d97706; }
          .stat-number.vert { color:#198754; }
          .stat-number.gris { color:#6b7280; }
        </style>
      </head>
      <body>
        <div class="container">
          <h2 class="fw-bold text-dark mb-4">📣 Diffusion Kongo Science</h2>

          <div class="row mb-2">
            <div class="col-md-3">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Abonnés actifs</div>
                <div class="stat-number vert">${s.actifs}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Désinscrits</div>
                <div class="stat-number gris">${s.desinscrits}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">En attente d'envoi</div>
                <div class="stat-number">${s.enAttente}</div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Quota restant aujourd'hui</div>
                <div class="stat-number">${quota}</div>
              </div>
            </div>
          </div>

          <div class="card p-4">
            <h5 class="fw-bold mb-3 border-bottom pb-2">Campagnes</h5>
            <table class="table table-sm align-middle">${lignesCamp}</table>
          </div>

          <p class="text-center text-muted small mt-4">Synchronisation : ${updated} (Brazzaville)</p>
        </div>
      </body>
    </html>`;

  return HtmlService.createHtmlOutput(html).setTitle("Diffusion Kongo Science");
}

/****************
 * LECTURES ET STATISTIQUES
 ****************/
function lireAbonnesActifs_() {
  const rows = getSheet_(SHEET_ABONNES).getDataRange().getValues();
  const vus = new Set();
  const actifs = [];
  for (let i = 1; i < rows.length; i++) {
    const email = String(rows[i][A_EMAIL] || "").trim().toLowerCase();
    // Seul « Actif » part : « À vérifier » signale un domaine douteux, dont
    // l'envoi ferait rebondir le message et dégraderait la réputation.
    if (!email || String(rows[i][A_STATUT] || "").trim() !== "Actif") continue;
    if (vus.has(email)) continue;
    vus.add(email);
    actifs.push({ email: email, nom: String(rows[i][A_NOM] || "").trim() });
  }
  return actifs;
}

function indexerCampagnes_() {
  const rows = getSheet_(SHEET_CAMPAGNES).getDataRange().getValues();
  const index = {};
  for (let i = 1; i < rows.length; i++) {
    const titre = String(rows[i][C_TITRE] || "").trim();
    if (!titre) continue;
    const date = normaliserDate_(rows[i][C_DATE]);
    index[`${date || "sans-date"}__${titre}`.slice(0, 90)] = {
      titre: titre,
      eventId: String(rows[i][C_EVENT] || "").trim(),
      dateLisible: date ? formaterDate_(date) : "",
      heure: normaliserHeure_(rows[i][C_HEURE]),
      affiche: String(rows[i][C_AFFICHE] || "").trim(),
      ligne: i + 1
    };
  }
  return index;
}

function majAvancementCampagnes_() {
  const campSheet = getSheet_(SHEET_CAMPAGNES);
  const file = getSheet_(SHEET_FILE).getDataRange().getValues();
  const index = indexerCampagnes_();

  const compte = {};
  for (let i = 1; i < file.length; i++) {
    const id = String(file[i][F_CAMPAGNE] || "").trim();
    if (!id) continue;
    compte[id] = compte[id] || { total: 0, envoyes: 0, attente: 0 };
    compte[id].total++;
    const st = String(file[i][F_STATUT] || "").trim();
    if (st === "Envoyé") compte[id].envoyes++;
    if (st === "En attente") compte[id].attente++;
  }

  for (const id in index) {
    const c = compte[id];
    if (!c) continue;
    const l = index[id].ligne;
    campSheet.getRange(l, C_TOTAL + 1).setValue(c.total);
    campSheet.getRange(l, C_ENVOYES + 1).setValue(c.envoyes);
    if (c.attente === 0) campSheet.getRange(l, C_STATUT + 1).setValue("Terminée");
  }
  SpreadsheetApp.flush();
}

function getStats_() {
  const abonnes = getSheet_(SHEET_ABONNES).getDataRange().getValues();
  let actifs = 0, desinscrits = 0;
  for (let i = 1; i < abonnes.length; i++) {
    const st = String(abonnes[i][A_STATUT] || "").trim();
    if (st === "Actif") actifs++;
    else if (st === "Désinscrit") desinscrits++;
  }

  const file = getSheet_(SHEET_FILE).getDataRange().getValues();
  let enAttente = 0;
  const parCampagne = {};
  for (let i = 1; i < file.length; i++) {
    const id = String(file[i][F_CAMPAGNE] || "").trim();
    if (!id) continue;
    parCampagne[id] = parCampagne[id] || { total: 0, envoyes: 0 };
    parCampagne[id].total++;
    const st = String(file[i][F_STATUT] || "").trim();
    if (st === "Envoyé") parCampagne[id].envoyes++;
    if (st === "En attente") enAttente++;
  }

  const camp = getSheet_(SHEET_CAMPAGNES).getDataRange().getValues();
  const campagnes = [];
  for (let i = 1; i < camp.length; i++) {
    const titre = String(camp[i][C_TITRE] || "").trim();
    if (!titre) continue;
    const id = `${normaliserDate_(camp[i][C_DATE]) || "sans-date"}__${titre}`.slice(0, 90);
    const c = parCampagne[id] || { total: 0, envoyes: 0 };
    campagnes.push({
      titre: titre,
      statut: String(camp[i][C_STATUT] || "").trim(),
      total: c.total,
      envoyes: c.envoyes
    });
  }

  return { actifs, desinscrits, enAttente, campagnes: campagnes.reverse() };
}

function updateDashboardSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dash = ss.getSheetByName(SHEET_DASH) || ss.insertSheet(SHEET_DASH);
  const s = getStats_();

  dash.clear();
  const data = [["Indicateur", "Valeur"]];
  data.push(["Abonnés actifs", s.actifs]);
  data.push(["Désinscrits", s.desinscrits]);
  data.push(["En attente d'envoi", s.enAttente]);
  data.push(["Quota restant aujourd'hui", MailApp.getRemainingDailyQuota()]);
  s.campagnes.forEach(c => data.push([`Campagne : ${c.titre}`, `${c.envoyes} / ${c.total}`]));

  dash.getRange(1, 1, data.length, 2).setValues(data);
  dash.getRange("A1:B1").setBackground("#d97706").setFontColor("white").setFontWeight("bold");
  dash.setFrozenRows(1);
  dash.autoResizeColumns(1, 2);
}

/****************
 * HELPERS
 ****************/
/** À exécuter une fois : crée les onglets manquants. */
function initDiffusion() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  creerSiAbsent_(ss, SHEET_ABONNES, COLS_ABONNES, "#198754");
  creerSiAbsent_(ss, SHEET_CAMPAGNES, COLS_CAMPAGNES, "#d97706");
  creerSiAbsent_(ss, SHEET_FILE, COLS_FILE, "#6b7280");

  jetonPour_("initialisation@kongoscience.com"); // force la création du secret
  updateDashboardSheet_();

  const actifs = lireAbonnesActifs_().length;
  Logger.log(`Diffusion prête. ${actifs} abonné(s) actif(s).`);
}

function creerSiAbsent_(ss, nom, colonnes, couleur) {
  let sh = ss.getSheetByName(nom);
  if (!sh) sh = ss.insertSheet(nom);
  if (!sh.getRange(1, 1).getValue()) {
    sh.getRange(1, 1, 1, colonnes.length).setValues([colonnes]);
    sh.getRange(1, 1, 1, colonnes.length)
      .setBackground(couleur).setFontColor("#ffffff").setFontWeight("bold");
    sh.setFrozenRows(1);
  }
}

function getSheet_(nom) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(nom) || ss.insertSheet(nom);
}

function normaliserDate_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return Utilities.formatDate(v, ORG_TZ, "yyyy-MM-dd");
  const s = String(v || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function normaliserHeure_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return Utilities.formatDate(v, ORG_TZ, "HH:mm");
  const s = String(v || "").trim();
  return /^\d{1,2}:\d{2}$/.test(s) ? s : "";
}

function formaterDate_(iso) {
  const mois = ["janvier","février","mars","avril","mai","juin",
                "juillet","août","septembre","octobre","novembre","décembre"];
  const [a, m, j] = iso.split("-");
  return `${parseInt(j, 10)} ${mois[parseInt(m, 10) - 1]} ${a}`;
}

function pageHtml_(titre, message, couleur) {
  return HtmlService.createHtmlOutput(`
    <!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    </head><body style="background:#f4f7f6;padding:60px 20px;font-family:system-ui,sans-serif;">
      <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:16px;padding:40px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.06);">
        <h1 style="color:${couleur};font-size:24px;margin:0 0 16px;">${escapeHtml_(titre)}</h1>
        <p style="color:#4b5563;line-height:1.7;margin:0 0 24px;">${escapeHtml_(message)}</p>
        <a href="${SITE_URL}" style="color:#d97706;font-weight:700;text-decoration:none;">Retour à kongoscience.com</a>
      </div>
    </body></html>`).setTitle(titre);
}

function escapeHtml_(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
