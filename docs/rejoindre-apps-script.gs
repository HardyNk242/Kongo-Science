/****************
 * KONGO SCIENCE — RÉCEPTION DES CANDIDATURES « REJOINDRE »
 *
 * Bâti sur le même modèle que le script des inscriptions aux conférences :
 * routeur doGet/doPost, verrou d'écriture, anti-doublon par TextFinder,
 * tableau de bord, courriel de confirmation mis en forme.
 *
 * Reçoit les envois de src/components/JoinView.tsx.
 *
 * ---------------------------------------------------------------------
 * INSTALLATION
 * ---------------------------------------------------------------------
 * 1. Ouvrir le Google Sheet des candidatures depuis le compte
 *    kongoscience25@gmail.com, puis Extensions > Apps Script.
 * 2. Coller ce fichier entier, vérifier SPREADSHEET_ID ci-dessous.
 * 3. Exécuter une fois initCandidatures() (Google demandera l'autorisation).
 * 4. Déployer > Nouveau déploiement > Application Web :
 *       Exécuter en tant que : Moi
 *       Qui a accès          : Tout le monde   <-- indispensable
 * 5. Coller l'URL /exec dans JOIN_SCRIPT_URL, en haut de JoinView.tsx.
 *
 * Le tableau de bord est consultable en ouvrant simplement l'URL /exec
 * dans un navigateur.
 ****************/

/****************
 * CONFIGURATION
 ****************/
// Feuille dédiée aux candidatures. Pour tout regrouper dans le classeur des
// inscriptions, remplacer par "1wEQ2ljHv6ZvVzFVdHly3XSJgiKlm0rMnZjNNFHqF42E".
const SPREADSHEET_ID = "1PoeolKU7qXFBtuaPR62JL-kytU-x4I7YPLLzqOoLWiY";

const SHEET_CAND = "Candidatures";
const SHEET_DASH = "Dashboard";

const ORG_TZ = "Africa/Brazzaville";

// Destinataire des alertes. contact@kongoscience.com n'etant pas
// operationnelle, tout arrive sur la boite institutionnelle.
const NOTIFY_EMAILS = "kongoscience25@gmail.com";

// Adresse de reponse affichee aux candidats.
const REPLY_TO = "kongoscience25@gmail.com";

// Colonnes de la feuille, dans l'ordre. Les index nommés évitent les
// décalages silencieux si l'ordre change un jour.
const COLS = [
  "Timestamp", "Profil", "Prénom", "Nom", "Email", "WhatsApp", "Pays",
  "Institution", "Fonction", "Statut académique", "ORCID", "Lien publications",
  "Domaines", "Contributions", "Disponibilité", "Langues", "Message",
  "Accord affichage du nom", "Fuseau horaire", "Statut du dossier"
];
const IDX_PROFIL = COLS.indexOf("Profil");   // 1
const IDX_EMAIL  = COLS.indexOf("Email");    // 4
const IDX_PAYS   = COLS.indexOf("Pays");     // 6
const COL_EMAIL_LETTER = "E";                // doit suivre IDX_EMAIL

/****************
 * ROUTER (GET)
 ****************/
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : "";
  if (action === "check") return handleCheckDuplicate_(e);
  return renderDashboard_();
}

/****************
 * POST : DÉPÔT D'UNE CANDIDATURE
 ****************/
function doPost(e) {
  // 1. LECTURE ET VALIDATION (hors verrou)
  let data;
  try {
    const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : "";
    if (!raw) return text_("error:payload_vide");
    data = safeParseJson_(raw);
    if (!data) return text_("error:json_invalide");
  } catch (err) {
    return text_("error:parsing");
  }

  const profil = String(data.profil || "").trim();
  const prenoms = String(data.prenoms || "").trim();
  const nom = String(data.nom || "").trim();
  const cleanEmail = String(data.email || "").trim().toLowerCase();
  const motivation = String(data.motivation || "").trim();
  const institution = String(data.institution || "").trim();

  if (!profil || !prenoms || !nom || !cleanEmail) return text_("error:donnees_incompletes");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return text_("error:email_invalide");
  if (motivation.length < 100) return text_("error:message_trop_court");

  const nomComplet = (prenoms + " " + nom).replace(/\s+/g, " ").trim();

  // 2. VERROU — début de la zone critique
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return text_("error:server_busy");
  }

  try {
    const sheet = getSheetByName_(SHEET_CAND);
    ensureHeaders_(sheet);

    // 2a. Anti-doublon : même personne, même profil
    if (isDuplicate_(sheet, cleanEmail, profil)) {
      return text_("error:deja_candidat");
    }

    // 2b. Écriture
    sheet.appendRow([
      new Date(),
      profil,
      prenoms,
      nom,
      cleanEmail,
      String(data.whatsapp || "N/A"),
      String(data.pays || "N/A"),
      institution || "N/A",
      String(data.fonction || "N/A"),
      String(data.niveau || "N/A"),
      String(data.orcid || "N/A"),
      String(data.profilLink || "N/A"),
      String(data.domaines || ""),
      String(data.contributions || "N/A"),
      String(data.disponibilite || "N/A"),
      String(data.langues || ""),
      motivation,
      String(data.consentNom || "Non"),
      String(data.clientTz || ORG_TZ),
      "À examiner"
    ]);

    // 2c. Écriture forcée avant de relâcher le verrou
    SpreadsheetApp.flush();

  } catch (err) {
    return text_("error:" + String(err));
  } finally {
    // 3. LIBÉRATION DU VERROU
    lock.releaseLock();
  }

  // 4. COURRIELS (hors verrou : ne bloque pas le candidat)
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAILS,
      subject: "[Candidature] " + profil + " — " + nomComplet,
      replyTo: cleanEmail,
      htmlBody: buildAlerteBureauHtml_(data, nomComplet)
    });

    MailApp.sendEmail({
      to: cleanEmail,
      subject: "Votre candidature Kongo Science a bien été reçue",
      replyTo: REPLY_TO,
      htmlBody: buildConfirmationHtml_(prenoms, profil)
    });

    updateDashboardSheet_();
  } catch (err) {
    console.error("Erreur post-traitement : " + err);
  }

  return text_("success");
}

/****************
 * ANTI-DOUBLON (TextFinder)
 ****************/
function isDuplicate_(sheet, cleanEmail, profil) {
  const finder = sheet.getRange(COL_EMAIL_LETTER + ":" + COL_EMAIL_LETTER)
    .createTextFinder(cleanEmail).matchEntireCell(true);
  const occurrences = finder.findAll();
  if (occurrences.length === 0) return false;

  const data = sheet.getDataRange().getValues();
  for (const cell of occurrences) {
    const rowIdx = cell.getRow() - 1;
    // Une même personne peut candidater à deux profils différents :
    // le doublon n'existe que si le profil est identique.
    if (data[rowIdx] && String(data[rowIdx][IDX_PROFIL]).trim() === profil) {
      return true;
    }
  }
  return false;
}

function handleCheckDuplicate_(e) {
  const callback = (e && e.parameter && e.parameter.callback) ? String(e.parameter.callback) : "";
  const email = (e && e.parameter && e.parameter.email) ? String(e.parameter.email).trim().toLowerCase() : "";
  const profil = (e && e.parameter && e.parameter.profil) ? String(e.parameter.profil).trim() : "";

  const result = { status: "ok", exists: false, message: "" };

  if (!email || !profil) {
    result.status = "error";
    result.message = "Paramètres manquants.";
    return jsonp_(callback, result);
  }

  const sheet = getSheetByName_(SHEET_CAND);
  ensureHeaders_(sheet);

  if (isDuplicate_(sheet, email, profil)) {
    result.exists = true;
    result.message = "Candidature déjà enregistrée pour ce profil.";
  } else {
    result.message = "OK";
  }
  return jsonp_(callback, result);
}

/****************
 * TABLEAU DE BORD (ouvrir l'URL /exec)
 ****************/
function renderDashboard_() {
  const stats = getStats_();
  const esc = escapeHtml_;
  const updated = Utilities.formatDate(new Date(), ORG_TZ, "dd/MM/yyyy HH:mm:ss");

  const parProfil = Object.keys(stats.byProfil).sort((a, b) => stats.byProfil[b] - stats.byProfil[a]);
  const parPays = Object.keys(stats.byPays).sort((a, b) => stats.byPays[b] - stats.byPays[a]);
  const parDomaine = Object.keys(stats.byDomaine).sort((a, b) => stats.byDomaine[b] - stats.byDomaine[a]);

  const lignes = (cles, source) => cles.length
    ? cles.map(k => `<tr><td>${esc(k)}</td><td class="text-end fw-bold">${source[k]}</td></tr>`).join('')
    : `<tr><td class="text-muted">Aucune donnée</td><td class="text-end text-muted">0</td></tr>`;

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
          .stat-number { font-size:2.8rem; font-weight:800; color:#0d6efd; }
          .stat-number.attente { color:#d97706; }
          .badge-live { animation:pulse 2s infinite; }
          @keyframes pulse { 0%{opacity:1} 50%{opacity:.5} 100%{opacity:1} }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold text-dark">🤝 Candidatures Kongo Science</h2>
            <span class="badge bg-success badge-live">Mise à jour</span>
          </div>

          <div class="row mb-2">
            <div class="col-md-4">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Candidatures totales</div>
                <div class="stat-number">${stats.total}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">À examiner</div>
                <div class="stat-number attente">${stats.aExaminer}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Accord affichage du nom</div>
                <div class="stat-number">${stats.accordNom}</div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card p-4">
                <h5 class="fw-bold mb-3 border-bottom pb-2">Par profil</h5>
                <table class="table table-sm">${lignes(parProfil, stats.byProfil)}</table>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card p-4">
                <h5 class="fw-bold mb-3 border-bottom pb-2">Top pays</h5>
                <table class="table table-sm">${lignes(parPays, stats.byPays)}</table>
              </div>
            </div>
          </div>

          <div class="card p-4">
            <h5 class="fw-bold mb-3 border-bottom pb-2">Domaines scientifiques</h5>
            <table class="table table-sm">${lignes(parDomaine, stats.byDomaine)}</table>
          </div>

          <p class="text-center text-muted small mt-4">Synchronisation : ${updated} (Brazzaville)</p>
        </div>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html).setTitle("Candidatures Kongo Science");
}

/****************
 * COURRIELS
 ****************/
function buildAlerteBureauHtml_(data, nomComplet) {
  const esc = escapeHtml_;
  const ligne = (cle, valeur) => valeur && String(valeur).trim() && String(valeur) !== "N/A"
    ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;">${esc(cle)}</td>
       <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${esc(valeur)}</td></tr>`
    : "";

  return `
  <div style="font-family:system-ui,Segoe UI,sans-serif;max-width:640px;margin:0 auto;padding:24px;">
    <div style="background:#0d6efd;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;opacity:.85;">Nouvelle candidature</div>
      <div style="font-size:22px;font-weight:800;margin-top:4px;">${esc(data.profil || "")}</div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${ligne("Nom", nomComplet)}
        ${ligne("Email", data.email)}
        ${ligne("WhatsApp", data.whatsapp)}
        ${ligne("Pays", data.pays)}
        ${ligne("Institution", data.institution)}
        ${ligne("Fonction", data.fonction)}
        ${ligne("Statut", data.niveau)}
        ${ligne("ORCID", data.orcid)}
        ${ligne("Publications", data.profilLink)}
        ${ligne("Domaines", data.domaines)}
        ${ligne("Contributions", data.contributions)}
        ${ligne("Disponibilité", data.disponibilite)}
        ${ligne("Langues", data.langues)}
        ${ligne("Affichage du nom", data.consentNom)}
      </table>
      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;margin-bottom:8px;">Message du candidat</div>
        <div style="font-size:14px;line-height:1.7;color:#1f2937;white-space:pre-wrap;">${esc(data.motivation || "")}</div>
      </div>
      <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">
        Répondre à ce message écrit directement au candidat.
      </p>
    </div>
  </div>`;
}

function buildConfirmationHtml_(prenom, profil) {
  const esc = escapeHtml_;
  const bg = "#fff8e7";
  const primary = "#d97706";
  const accent = "#dc2626";

  return `
  <div style="margin:0;padding:0;background:${bg};width:100%;">
    <div style="max-width:650px;margin:0 auto;padding:28px 16px;">
      <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07),0 10px 20px rgba(0,0,0,0.04);">
        <div style="background:linear-gradient(135deg, ${primary} 0%, ${accent} 100%);padding:34px 26px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:28px;font-weight:700;">
            Candidature reçue ✅
          </h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
            Kongo Science — Communauté scientifique
          </p>
        </div>

        <div style="padding:32px 26px;line-height:1.7;color:#1f2937;font-family:Georgia,serif;">
          <p style="margin:0 0 16px;font-size:16px;">
            Bonjour <strong style="color:${primary};">${esc(prenom)}</strong>,
          </p>

          <p style="margin:0 0 18px;font-size:16px;">
            Nous avons bien reçu votre candidature pour rejoindre Kongo Science en tant que :
          </p>

          <div style="background:linear-gradient(135deg, ${primary}15 0%, ${accent}10 100%);border-left:4px solid ${primary};border-radius:10px;padding:18px;margin:18px 0;">
            <h2 style="margin:0;color:${primary};font-size:18px;font-weight:800;">${esc(profil)}</h2>
          </div>

          <p style="margin:0 0 18px;font-size:16px;">
            Le bureau examine chaque dossier et vous répondra
            <strong>sous deux semaines</strong>, quelle que soit l'issue.
          </p>

          <div style="background:${accent}10;padding:14px;border-radius:10px;margin:18px 0;font-size:14px;">
            💡 En attendant, la bibliothèque et l'agenda scientifique restent
            librement accessibles sur
            <a href="https://kongoscience.com" style="color:${primary};font-weight:700;">kongoscience.com</a>.
          </div>

          <p style="margin:18px 0 0;font-size:16px;">
            Merci de l'intérêt que vous portez à la science congolaise.
          </p>
        </div>

        <div style="background:${bg};padding:18px 22px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:12px;">Kongo Science — Communauté scientifique</p>
        </div>
      </div>
    </div>
  </div>`;
}

/****************
 * STATISTIQUES ET FEUILLE DASHBOARD
 ****************/
function getStats_() {
  const sheet = getSheetByName_(SHEET_CAND);
  const rows = sheet.getDataRange().getValues();
  const stats = { total: 0, aExaminer: 0, accordNom: 0, byProfil: {}, byPays: {}, byDomaine: {} };
  if (rows.length <= 1) return stats;

  const idxDomaines = COLS.indexOf("Domaines");
  const idxAccord = COLS.indexOf("Accord affichage du nom");
  const idxStatut = COLS.indexOf("Statut du dossier");

  for (let i = 1; i < rows.length; i++) {
    const profil = String(rows[i][IDX_PROFIL] || "").trim();
    if (!profil) continue;

    stats.total++;
    stats.byProfil[profil] = (stats.byProfil[profil] || 0) + 1;

    const pays = String(rows[i][IDX_PAYS] || "").trim() || "Non renseigné";
    stats.byPays[pays] = (stats.byPays[pays] || 0) + 1;

    // Un candidat peut cocher plusieurs domaines : on les compte séparément.
    String(rows[i][idxDomaines] || "").split(";").forEach(d => {
      const nom = d.trim();
      if (nom) stats.byDomaine[nom] = (stats.byDomaine[nom] || 0) + 1;
    });

    if (String(rows[i][idxStatut] || "").trim() === "À examiner") stats.aExaminer++;
    if (String(rows[i][idxAccord] || "").trim().toLowerCase() === "oui") stats.accordNom++;
  }
  return stats;
}

function updateDashboardSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dash = ss.getSheetByName(SHEET_DASH) || ss.insertSheet(SHEET_DASH);
  const stats = getStats_();

  dash.clear();
  const data = [["Catégorie", "Élément", "Nombre"]];
  data.push(["Total", "Candidatures reçues", stats.total]);
  data.push(["Total", "À examiner", stats.aExaminer]);

  Object.keys(stats.byProfil).sort((a, b) => stats.byProfil[b] - stats.byProfil[a])
    .forEach(k => data.push(["Profil", k, stats.byProfil[k]]));
  Object.keys(stats.byPays).sort((a, b) => stats.byPays[b] - stats.byPays[a])
    .forEach(k => data.push(["Pays", k, stats.byPays[k]]));
  Object.keys(stats.byDomaine).sort((a, b) => stats.byDomaine[b] - stats.byDomaine[a])
    .forEach(k => data.push(["Domaine", k, stats.byDomaine[k]]));

  const range = dash.getRange(1, 1, data.length, 3);
  range.setValues(data);
  dash.getRange("A1:C1").setBackground("#0d6efd").setFontColor("white").setFontWeight("bold");
  dash.setFrozenRows(1);
  dash.autoResizeColumns(1, 3);
}

/****************
 * HELPERS
 ****************/
/** À exécuter une fois, à la main, pour préparer la feuille. */
function initCandidatures() {
  const sheet = getSheetByName_(SHEET_CAND);
  ensureHeaders_(sheet);
  sheet.autoResizeColumns(1, COLS.length);
  updateDashboardSheet_();
  Logger.log("Feuille « " + SHEET_CAND + " » prête (" + COLS.length + " colonnes).");
}

function getSheetByName_(name) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function ensureHeaders_(sheet) {
  const a1 = sheet.getRange(1, 1).getValue();
  if (!a1) {
    sheet.getRange(1, 1, 1, COLS.length).setValues([COLS]);
    sheet.getRange(1, 1, 1, COLS.length)
      .setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function safeParseJson_(raw) {
  try { return JSON.parse(raw); } catch (_) {}
  try { const t = String(raw || "").trim(); if (t.startsWith("{") && t.endsWith("}")) return JSON.parse(t); } catch (_) {}
  return null;
}

function text_(s) {
  return ContentService.createTextOutput(String(s)).setMimeType(ContentService.MimeType.TEXT);
}

function jsonp_(callback, obj) {
  const payload = JSON.stringify(obj);
  return callback
    ? ContentService.createTextOutput(callback + "(" + payload + ");").setMimeType(ContentService.MimeType.JAVASCRIPT)
    : ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}

function escapeHtml_(s) {
  return String(s || "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
