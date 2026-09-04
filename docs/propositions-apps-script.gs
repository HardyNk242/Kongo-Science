/****************
 * KONGO SCIENCE — PROPOSITIONS D'INTERVENTION SCIENTIFIQUE
 *
 * Reçoit les envois de src/components/ProposalView.tsx : conférences,
 * formations, ateliers et séminaires proposés par des intervenants externes.
 *
 * Même architecture que les scripts « Inscriptions » et « Candidatures » :
 * routeur doGet/doPost, verrou d'écriture, anti-doublon par TextFinder,
 * tableau de bord, courriels mis en forme.
 *
 * Volontairement séparé du script des inscriptions : celles-ci tournent en
 * production et ne doivent pas dépendre d'un déploiement lié à autre chose.
 *
 * ---------------------------------------------------------------------
 * INSTALLATION
 * ---------------------------------------------------------------------
 * 1. Depuis kongoscience25@gmail.com, créer un classeur
 *    « KongoScience — Propositions », puis Extensions > Apps Script.
 * 2. Coller ce fichier entier et renseigner SPREADSHEET_ID ci-dessous
 *    (la portion entre /d/ et /edit dans l'URL du classeur).
 * 3. Exécuter initPropositions() une fois (autorisation demandée).
 * 4. Déployer > Nouveau déploiement > Application Web :
 *       Exécuter en tant que : Moi
 *       Qui a accès          : Tout le monde   <-- indispensable
 * 5. M'envoyer l'URL /exec : je la place dans src/config/forms.ts.
 *
 * Le tableau de bord s'ouvre en visitant l'URL /exec dans un navigateur.
 ****************/

/****************
 * CONFIGURATION
 ****************/
// ⚠️ À REMPLACER par l'identifiant du classeur des propositions.
const SPREADSHEET_ID = "1hQJPZMy9ZGIgEB2EfdBKG5WHBh_NdmYxGZghcviU3-g";

const SHEET_PROP = "Propositions";
const SHEET_DASH = "Dashboard";

const ORG_TZ = "Africa/Brazzaville";

// Boîte institutionnelle : alertes internes et adresse de réponse.
const NOTIFY_EMAIL = "kongoscience25@gmail.com";

// Colonnes, dans l'ordre. Les index nommés évitent tout décalage silencieux.
const COLS = [
  "Timestamp", "Nom complet", "Email", "WhatsApp", "Pays", "Institution",
  "Titre proposé", "Format", "Modalité", "Date souhaitée", "Durée", "Tarif",
  "Lien CV", "Résumé d'expertise", "Fuseau horaire", "Statut du dossier"
];
const IDX_NOM     = COLS.indexOf("Nom complet");        // 1
const IDX_EMAIL   = COLS.indexOf("Email");              // 2
const IDX_PAYS    = COLS.indexOf("Pays");               // 4
const IDX_TITRE   = COLS.indexOf("Titre proposé");      // 6
const IDX_FORMAT  = COLS.indexOf("Format");             // 7
const IDX_DATE    = COLS.indexOf("Date souhaitée");     // 9
const IDX_STATUT  = COLS.indexOf("Statut du dossier");  // 15
const COL_EMAIL_LETTER = "C";                            // doit suivre IDX_EMAIL

/****************
 * ROUTER (GET)
 ****************/
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : "";
  if (action === "check") return handleCheckDuplicate_(e);
  return renderDashboard_();
}

/****************
 * POST : DÉPÔT D'UNE PROPOSITION
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

  const nomComplet = String(data.name || `${data.prenoms || ""} ${data.nom || ""}`)
    .replace(/\s+/g, " ").trim();
  const cleanEmail = String(data.email || "").trim().toLowerCase();
  const titre = String(data.titre || "").trim();
  const expertise = String(data.expertiseSummary || "").trim();

  if (!nomComplet || !cleanEmail || !titre) return text_("error:donnees_incompletes");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return text_("error:email_invalide");
  if (titre.length < 6) return text_("error:titre_trop_court");
  if (expertise.length < 20) return text_("error:expertise_trop_courte");

  const format = String(data.format || "Recherche scientifique").trim();

  // 2. VERROU — zone critique
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return text_("error:server_busy");
  }

  try {
    const sheet = getSheetByName_(SHEET_PROP);
    ensureHeaders_(sheet);

    // Anti-doublon : même personne, même titre. Une même personne peut
    // proposer plusieurs interventions différentes.
    if (isDuplicate_(sheet, cleanEmail, titre)) {
      return text_("error:deja_propose");
    }

    sheet.appendRow([
      new Date(),
      nomComplet,
      cleanEmail,
      String(data.whatsapp || "N/A"),
      String(data.country || data.pays || "N/A"),
      String(data.institution || "N/A"),
      titre,
      format,
      String(data.type || "En ligne"),
      String(data.date || "N/A"),
      String(data.duree || "N/A"),
      String(data.tarif || "Gratuit"),
      String(data.cvLink || "N/A"),
      expertise,
      String(data.clientTz || ORG_TZ),
      "À examiner"
    ]);

    SpreadsheetApp.flush();

  } catch (err) {
    return text_("error:" + String(err));
  } finally {
    lock.releaseLock();
  }

  // 3. COURRIELS (hors verrou)
  try {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: `[Proposition] ${format} — ${titre}`,
      replyTo: cleanEmail,
      htmlBody: buildAlerteBureauHtml_(data, nomComplet, titre, format, expertise)
    });

    MailApp.sendEmail({
      to: cleanEmail,
      subject: "Votre proposition d'intervention a bien été reçue",
      replyTo: NOTIFY_EMAIL,
      htmlBody: buildConfirmationHtml_(nomComplet, titre, format)
    });

    updateDashboardSheet_();
  } catch (err) {
    console.error("Erreur post-traitement : " + err);
  }

  return text_("success");
}

/****************
 * ANTI-DOUBLON
 ****************/
function isDuplicate_(sheet, cleanEmail, titre) {
  const finder = sheet.getRange(COL_EMAIL_LETTER + ":" + COL_EMAIL_LETTER)
    .createTextFinder(cleanEmail).matchEntireCell(true);
  const occurrences = finder.findAll();
  if (occurrences.length === 0) return false;

  const data = sheet.getDataRange().getValues();
  const cible = titre.toLowerCase();
  for (const cell of occurrences) {
    const rowIdx = cell.getRow() - 1;
    if (data[rowIdx] && String(data[rowIdx][IDX_TITRE]).trim().toLowerCase() === cible) return true;
  }
  return false;
}

function handleCheckDuplicate_(e) {
  const callback = (e && e.parameter && e.parameter.callback) ? String(e.parameter.callback) : "";
  const email = (e && e.parameter && e.parameter.email) ? String(e.parameter.email).trim().toLowerCase() : "";
  const titre = (e && e.parameter && e.parameter.titre) ? String(e.parameter.titre).trim() : "";

  const result = { status: "ok", exists: false, message: "" };

  if (!email || !titre) {
    result.status = "error";
    result.message = "Paramètres manquants.";
    return jsonp_(callback, result);
  }

  const sheet = getSheetByName_(SHEET_PROP);
  ensureHeaders_(sheet);

  if (isDuplicate_(sheet, email, titre)) {
    result.exists = true;
    result.message = "Proposition déjà enregistrée.";
  } else {
    result.message = "OK";
  }
  return jsonp_(callback, result);
}

/****************
 * TABLEAU DE BORD
 ****************/
function renderDashboard_() {
  const stats = getStats_();
  const esc = escapeHtml_;
  const updated = Utilities.formatDate(new Date(), ORG_TZ, "dd/MM/yyyy HH:mm:ss");

  const parFormat = Object.keys(stats.byFormat).sort((a, b) => stats.byFormat[b] - stats.byFormat[a]);
  const parPays = Object.keys(stats.byPays).sort((a, b) => stats.byPays[b] - stats.byPays[a]);

  const lignes = (cles, source) => cles.length
    ? cles.map(k => `<tr><td>${esc(k)}</td><td class="text-end fw-bold">${source[k]}</td></tr>`).join('')
    : `<tr><td class="text-muted">Aucune donnée</td><td class="text-end text-muted">0</td></tr>`;

  const dernieres = stats.recentes.length
    ? stats.recentes.map(p => `
        <tr>
          <td><div class="fw-bold">${esc(p.titre)}</div>
              <div class="text-muted small">${esc(p.nom)} · ${esc(p.format)}</div></td>
          <td class="text-end text-muted small">${esc(p.date)}</td>
        </tr>`).join('')
    : `<tr><td class="text-muted">Aucune proposition</td><td></td></tr>`;

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
          .stat-number { font-size:2.8rem; font-weight:800; color:#6610f2; }
          .stat-number.attente { color:#d97706; }
          .badge-live { animation:pulse 2s infinite; }
          @keyframes pulse { 0%{opacity:1} 50%{opacity:.5} 100%{opacity:1} }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold text-dark">🎤 Propositions d'intervention</h2>
            <span class="badge bg-success badge-live">Mise à jour</span>
          </div>

          <div class="row mb-2">
            <div class="col-md-6">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Propositions reçues</div>
                <div class="stat-number">${stats.total}</div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">À examiner</div>
                <div class="stat-number attente">${stats.aExaminer}</div>
              </div>
            </div>
          </div>

          <div class="card p-4">
            <h5 class="fw-bold mb-3 border-bottom pb-2">Dernières propositions</h5>
            <table class="table table-sm align-middle">${dernieres}</table>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card p-4">
                <h5 class="fw-bold mb-3 border-bottom pb-2">Par format</h5>
                <table class="table table-sm">${lignes(parFormat, stats.byFormat)}</table>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card p-4">
                <h5 class="fw-bold mb-3 border-bottom pb-2">Par pays</h5>
                <table class="table table-sm">${lignes(parPays, stats.byPays)}</table>
              </div>
            </div>
          </div>

          <p class="text-center text-muted small mt-4">Synchronisation : ${updated} (Brazzaville)</p>
        </div>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html).setTitle("Propositions Kongo Science");
}

/****************
 * COURRIELS
 ****************/
function buildAlerteBureauHtml_(data, nomComplet, titre, format, expertise) {
  const esc = escapeHtml_;
  const ligne = (cle, valeur) => valeur && String(valeur).trim() && String(valeur) !== "N/A"
    ? `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;">${esc(cle)}</td>
       <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:600;">${esc(valeur)}</td></tr>`
    : "";

  const lienCv = String(data.cvLink || "").trim();

  return `
  <div style="font-family:system-ui,Segoe UI,sans-serif;max-width:640px;margin:0 auto;padding:24px;">
    <div style="background:#6610f2;color:#fff;padding:20px 24px;border-radius:12px 12px 0 0;">
      <div style="font-size:12px;text-transform:uppercase;letter-spacing:2px;opacity:.85;">Nouvelle proposition · ${esc(format)}</div>
      <div style="font-size:20px;font-weight:800;margin-top:6px;line-height:1.3;">${esc(titre)}</div>
    </div>
    <div style="background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
      <table style="width:100%;border-collapse:collapse;">
        ${ligne("Intervenant", nomComplet)}
        ${ligne("Email", data.email)}
        ${ligne("WhatsApp", data.whatsapp)}
        ${ligne("Pays", data.country || data.pays)}
        ${ligne("Institution", data.institution)}
        ${ligne("Modalité", data.type)}
        ${ligne("Date souhaitée", data.date)}
        ${ligne("Durée", data.duree)}
        ${ligne("Tarif", data.tarif)}
      </table>

      ${lienCv && lienCv !== "N/A" ? `
      <div style="margin-top:18px;">
        <a href="${esc(lienCv)}" style="display:inline-block;background:#6610f2;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-size:14px;font-weight:700;">
          Consulter le CV
        </a>
      </div>` : ""}

      <div style="margin-top:20px;padding-top:16px;border-top:1px solid #e5e7eb;">
        <div style="font-size:12px;text-transform:uppercase;letter-spacing:1px;color:#6b7280;font-weight:700;margin-bottom:8px;">Résumé d'expertise</div>
        <div style="font-size:14px;line-height:1.7;color:#1f2937;white-space:pre-wrap;">${esc(expertise)}</div>
      </div>

      <p style="margin:20px 0 0;font-size:12px;color:#6b7280;">
        Répondre à ce message écrit directement à l'intervenant.
      </p>
    </div>
  </div>`;
}

function buildConfirmationHtml_(nomComplet, titre, format) {
  const esc = escapeHtml_;
  const bg = "#fff8e7", primary = "#d97706", accent = "#dc2626";

  return `
  <div style="margin:0;padding:0;background:${bg};width:100%;">
    <div style="max-width:650px;margin:0 auto;padding:28px 16px;">
      <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07),0 10px 20px rgba(0,0,0,0.04);">
        <div style="background:linear-gradient(135deg, ${primary} 0%, ${accent} 100%);padding:34px 26px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:28px;font-weight:700;">
            Proposition reçue ✅
          </h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
            Kongo Science — Communauté scientifique
          </p>
        </div>

        <div style="padding:32px 26px;line-height:1.7;color:#1f2937;font-family:Georgia,serif;">
          <p style="margin:0 0 16px;font-size:16px;">
            Bonjour <strong style="color:${primary};">${esc(nomComplet)}</strong>,
          </p>

          <p style="margin:0 0 18px;font-size:16px;">
            Nous avons bien reçu votre proposition d'intervention :
          </p>

          <div style="background:linear-gradient(135deg, ${primary}15 0%, ${accent}10 100%);border-left:4px solid ${primary};border-radius:10px;padding:18px;margin:18px 0;">
            <h2 style="margin:0 0 8px;color:${primary};font-size:18px;font-weight:800;">${esc(titre)}</h2>
            <p style="margin:0;font-size:14px;color:#6b7280;">${esc(format)}</p>
          </div>

          <p style="margin:0 0 18px;font-size:16px;">
            Le comité scientifique l'examine et revient vers vous
            <strong>sous deux semaines</strong>. Si elle est retenue, nous
            conviendrons ensemble de la date et des modalités techniques.
          </p>

          <!-- Rappel des conditions financières. Le site les annonce déjà avant
               l'envoi (voir PROPOSAL_PRICING dans src/constants.ts) ; les
               répéter ici évite toute surprise au moment de l'acceptation. -->
          <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px;margin:18px 0;">
            <p style="margin:0 0 10px;font-size:14px;color:#92400e;font-weight:700;">
              Conditions en cas d'acceptation
            </p>
            <p style="margin:0 0 10px;font-size:14px;color:#1f2937;line-height:1.6;">
              Une proposition retenue donne lieu à des frais de
              <strong>12 500 FCFA</strong>. Ils couvrent la promotion de
              l'événement sur les réseaux sociaux, l'abonnement Zoom et la
              délivrance d'un certificat reconnu par le CAMES, volet
              communication publique.
            </p>
            <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
              Aucun frais n'est dû si votre intervention est proposée sur
              invitation de Kongo Science, ou si vous êtes membre premium de
              l'association (25 000 FCFA par an).
            </p>
          </div>

          <div style="background:${accent}10;padding:14px;border-radius:10px;margin:18px 0;font-size:14px;">
            💡 Consultez l'agenda des prochaines conférences sur
            <a href="https://kongoscience.com/agenda" style="color:${primary};font-weight:700;">kongoscience.com/agenda</a>.
          </div>

          <p style="margin:18px 0 0;font-size:16px;">
            Merci de contribuer à la diffusion de la science en Afrique centrale.
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
 * STATISTIQUES
 ****************/
function getStats_() {
  const sheet = getSheetByName_(SHEET_PROP);
  const rows = sheet.getDataRange().getValues();
  const stats = { total: 0, aExaminer: 0, byFormat: {}, byPays: {}, recentes: [] };
  if (rows.length <= 1) return stats;

  for (let i = 1; i < rows.length; i++) {
    const titre = String(rows[i][IDX_TITRE] || "").trim();
    if (!titre) continue;

    stats.total++;

    const format = String(rows[i][IDX_FORMAT] || "").trim() || "Non précisé";
    stats.byFormat[format] = (stats.byFormat[format] || 0) + 1;

    const pays = String(rows[i][IDX_PAYS] || "").trim() || "Non renseigné";
    stats.byPays[pays] = (stats.byPays[pays] || 0) + 1;

    if (String(rows[i][IDX_STATUT] || "").trim() === "À examiner") stats.aExaminer++;

    stats.recentes.push({
      titre: titre,
      nom: String(rows[i][IDX_NOM] || "").trim(),
      format: format,
      date: String(rows[i][IDX_DATE] || "").trim()
    });
  }

  // Les cinq dernières reçues, la plus récente en tête.
  stats.recentes = stats.recentes.slice(-5).reverse();
  return stats;
}

function updateDashboardSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dash = ss.getSheetByName(SHEET_DASH) || ss.insertSheet(SHEET_DASH);
  const stats = getStats_();

  dash.clear();
  const data = [["Catégorie", "Élément", "Nombre"]];
  data.push(["Total", "Propositions reçues", stats.total]);
  data.push(["Total", "À examiner", stats.aExaminer]);

  Object.keys(stats.byFormat).sort((a, b) => stats.byFormat[b] - stats.byFormat[a])
    .forEach(k => data.push(["Format", k, stats.byFormat[k]]));
  Object.keys(stats.byPays).sort((a, b) => stats.byPays[b] - stats.byPays[a])
    .forEach(k => data.push(["Pays", k, stats.byPays[k]]));

  dash.getRange(1, 1, data.length, 3).setValues(data);
  dash.getRange("A1:C1").setBackground("#6610f2").setFontColor("white").setFontWeight("bold");
  dash.setFrozenRows(1);
  dash.autoResizeColumns(1, 3);
}

/****************
 * HELPERS
 ****************/
/** À exécuter une fois, à la main, pour préparer les feuilles. */
function initPropositions() {
  const sheet = getSheetByName_(SHEET_PROP);
  ensureHeaders_(sheet);
  sheet.autoResizeColumns(1, COLS.length);
  updateDashboardSheet_();
  Logger.log(`Feuille « ${SHEET_PROP} » prête (${COLS.length} colonnes).`);
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
      .setBackground("#4c1d95").setFontColor("#ffffff").setFontWeight("bold");
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
