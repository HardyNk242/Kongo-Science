/****************
 * KONGO SCIENCE — INSCRIPTIONS AUX CONFÉRENCES
 *
 * Reçoit les envois de src/components/RegistrationView.tsx.
 *
 * Reprend votre script d'origine, avec trois ajouts :
 *   1. Les RAPPELS sont réellement envoyés. Le courriel de confirmation
 *      annonçait « un rappel vous sera transmis 1 heure avant le début » et
 *      la colonne « Rappel envoyé » existait, mais aucune fonction ne les
 *      expédiait. Voir envoyerRappels() et installerDeclencheurRappels().
 *   2. Le bureau est prévenu à chaque inscription (désactivable).
 *   3. Les index de colonnes sont nommés, pour qu'un changement d'ordre ne
 *      casse plus silencieusement l'anti-doublon.
 *
 * Les colonnes sont identiques à celles de votre ancienne feuille : vous
 * pouvez recopier vos inscriptions existantes telles quelles.
 *
 * ---------------------------------------------------------------------
 * INSTALLATION
 * ---------------------------------------------------------------------
 * 1. Depuis kongoscience25@gmail.com, créer (ou ouvrir) le classeur des
 *    inscriptions, puis Extensions > Apps Script.
 * 2. Coller ce fichier entier et renseigner SPREADSHEET_ID ci-dessous.
 * 3. Exécuter initInscriptions() une fois (autorisation demandée).
 * 4. Exécuter installerDeclencheurRappels() une fois, pour activer les
 *    rappels automatiques.
 * 5. Déployer > Nouveau déploiement > Application Web :
 *       Exécuter en tant que : Moi
 *       Qui a accès          : Tout le monde   <-- indispensable
 * 6. M'envoyer l'URL /exec : je la place dans src/config/forms.ts.
 *
 * Le tableau de bord s'ouvre en visitant l'URL /exec dans un navigateur.
 ****************/

/****************
 * CONFIGURATION
 ****************/
// ⚠️ À REMPLACER par l'identifiant du classeur créé sous le compte Kongo Science.
// C'est la portion entre /d/ et /edit dans l'URL du Google Sheet.
const SPREADSHEET_ID = "1Ceb59_MoOsLsvD3kE4V5DxkTZ8JguK7Mnm9JGTsoPho";

const SHEET_REG = "Registrations";
const SHEET_DASH = "Dashboard";
const SHEET_PRIVATE = "EventsPrivate";

const ORG_TZ = "Africa/Brazzaville";
const ORG_OFFSET_ISO = "+01:00"; // Brazzaville ne change pas d'heure

// Boîte institutionnelle : alertes internes et adresse de réponse.
const NOTIFY_EMAIL = "kongoscience25@gmail.com";

// Passer à false pour ne plus recevoir un courriel par inscription.
const ALERTER_BUREAU = true;

// Fenêtre de déclenchement des rappels, en minutes avant le début.
const RAPPEL_AVANT_MIN = 60;
const RAPPEL_TOLERANCE_MIN = 20; // le déclencheur tourne toutes les 15 min

// Colonnes, dans l'ordre. Identiques à l'ancienne feuille.
const COLS = [
  "Timestamp", "Nom complet", "Email", "Institution", "Pays", "EventId",
  "Date Événement", "Heure Événement", "Rappel envoyé", "OrgTZ", "PartTZ", "EventTitle"
];
const IDX_NOM     = COLS.indexOf("Nom complet");      // 1
const IDX_EMAIL   = COLS.indexOf("Email");            // 2
const IDX_PAYS    = COLS.indexOf("Pays");             // 4
const IDX_EVENT   = COLS.indexOf("EventId");          // 5
const IDX_DATE    = COLS.indexOf("Date Événement");   // 6
const IDX_HEURE   = COLS.indexOf("Heure Événement");  // 7
const IDX_RAPPEL  = COLS.indexOf("Rappel envoyé");    // 8
const IDX_PARTTZ  = COLS.indexOf("PartTZ");           // 10
const IDX_TITRE   = COLS.indexOf("EventTitle");       // 11
const COL_EMAIL_LETTER = "C";                          // doit suivre IDX_EMAIL

/****************
 * ROUTER (GET)
 ****************/
function doGet(e) {
  const action = (e && e.parameter && e.parameter.action) ? String(e.parameter.action) : "";
  if (action === "check") return handleCheckDuplicate_(e);
  return renderDashboard_();
}

/****************
 * POST : INSCRIPTION
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

  const name = String(data.name || "").trim();
  const cleanEmail = String(data.email || "").trim().toLowerCase();
  const eventId = String(data.eventId || "").trim();
  const eventTitle = String(data.eventTitle || "").trim();
  const eventDate = String(data.eventDate || "").trim();
  const eventTime = String(data.eventTime || "").trim();

  let participantTz = String(data.participantTz || "").trim() || ORG_TZ;
  if (!isValidTimeZone_(participantTz)) participantTz = ORG_TZ;

  if (!name || !cleanEmail || !eventId || !eventDate || !eventTime) return text_("error:donnees_incompletes");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return text_("error:date_malformee");
  if (!/^\d{2}:\d{2}$/.test(eventTime)) return text_("error:heure_malformee");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return text_("error:email_invalide");

  const eventLabel = eventTitle || eventId;
  const eventDateTime = new Date(`${eventDate}T${eventTime}:00${ORG_OFFSET_ISO}`);
  if (isNaN(eventDateTime.getTime())) return text_("error:datetime_invalide");

  // 2. VERROU — zone critique
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    return text_("error:server_busy");
  }

  try {
    const sheet = getSheetByName_(SHEET_REG);
    ensureHeaders_(sheet);

    if (isDuplicate_(sheet, cleanEmail, eventId)) {
      return text_("error:deja_inscrit");
    }

    sheet.appendRow([
      new Date(),
      name,
      cleanEmail,
      String(data.institution || "N/A"),
      String(data.country || "N/A"),
      eventId,
      eventDate,
      eventTime,
      "NON",
      ORG_TZ,
      participantTz,
      eventLabel
    ]);

    SpreadsheetApp.flush();

  } catch (err) {
    return text_("error:" + String(err));
  } finally {
    lock.releaseLock();
  }

  // 3. COURRIELS (hors verrou)
  try {
    const privateEvent = getPrivateEventData_(eventId);
    const googleUrl = getGoogleCalendarLink_(name, eventLabel, eventDateTime);
    const icsBlob = buildIcsAttachment_(cleanEmail, name, eventLabel, eventDateTime);

    MailApp.sendEmail({
      to: cleanEmail,
      subject: `Confirmation - ${eventLabel}`,
      replyTo: NOTIFY_EMAIL,
      attachments: [icsBlob],
      htmlBody: buildConfirmationHtml_(name, eventLabel, eventDateTime, participantTz, googleUrl, privateEvent)
    });

    if (ALERTER_BUREAU) {
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `[Inscription] ${eventLabel} — ${name}`,
        replyTo: cleanEmail,
        body:
          `Nouvelle inscription\n\n` +
          `Conférence : ${eventLabel}\n` +
          `Date       : ${fmtNice_(eventDateTime, ORG_TZ)} (Brazzaville)\n\n` +
          `Nom        : ${name}\n` +
          `Email      : ${cleanEmail}\n` +
          `Institution: ${data.institution || "N/A"}\n` +
          `Pays       : ${data.country || "N/A"}\n`
      });
    }

    updateDashboardSheet_();
  } catch (err) {
    console.error("Erreur post-traitement : " + err);
  }

  return text_("success");
}

/****************
 * RAPPELS AUTOMATIQUES
 *
 * À exécuter par un déclencheur temporel (voir installerDeclencheurRappels).
 * Envoie un rappel aux inscrits dont la conférence commence dans environ une
 * heure, puis marque la ligne « OUI » pour ne jamais renvoyer deux fois.
 ****************/
function envoyerRappels() {
  const sheet = getSheetByName_(SHEET_REG);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return;

  const maintenant = Date.now();
  const bornBasse = maintenant + (RAPPEL_AVANT_MIN - RAPPEL_TOLERANCE_MIN) * 60000;
  const bornHaute = maintenant + (RAPPEL_AVANT_MIN + RAPPEL_TOLERANCE_MIN) * 60000;

  let envoyes = 0;

  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][IDX_RAPPEL] || "").trim().toUpperCase() === "OUI") continue;

    const eventDate = normaliserDate_(rows[i][IDX_DATE]);
    const eventTime = normaliserHeure_(rows[i][IDX_HEURE]);
    if (!eventDate || !eventTime) continue;

    const debut = new Date(`${eventDate}T${eventTime}:00${ORG_OFFSET_ISO}`);
    if (isNaN(debut.getTime())) continue;

    const t = debut.getTime();
    if (t < bornBasse || t > bornHaute) continue;

    const email = String(rows[i][IDX_EMAIL] || "").trim();
    if (!email) continue;

    const nom = String(rows[i][IDX_NOM] || "").trim();
    const label = String(rows[i][IDX_TITRE] || "").trim() || String(rows[i][IDX_EVENT] || "").trim();
    let tz = String(rows[i][IDX_PARTTZ] || "").trim() || ORG_TZ;
    if (!isValidTimeZone_(tz)) tz = ORG_TZ;

    try {
      const prive = getPrivateEventData_(String(rows[i][IDX_EVENT] || "").trim());
      MailApp.sendEmail({
        to: email,
        subject: `Rappel — ${label} dans 1 heure`,
        replyTo: NOTIFY_EMAIL,
        htmlBody: buildRappelHtml_(nom, label, debut, tz, prive)
      });
      // Marquage immédiat : un plantage plus loin ne doit pas provoquer
      // un second envoi au tour suivant.
      sheet.getRange(i + 1, IDX_RAPPEL + 1).setValue("OUI");
      envoyes++;
    } catch (err) {
      console.error(`Rappel non envoyé à ${email} : ${err}`);
    }
  }

  if (envoyes > 0) {
    SpreadsheetApp.flush();
    console.log(`${envoyes} rappel(s) envoyé(s).`);
  }
}

/** À exécuter UNE FOIS pour activer les rappels (toutes les 15 minutes). */
function installerDeclencheurRappels() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === "envoyerRappels")
    .forEach(t => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger("envoyerRappels").timeBased().everyMinutes(15).create();
  Logger.log("Déclencheur installé : envoyerRappels toutes les 15 minutes.");
}

/****************
 * ANTI-DOUBLON
 ****************/
function isDuplicate_(sheet, cleanEmail, eventId) {
  const finder = sheet.getRange(COL_EMAIL_LETTER + ":" + COL_EMAIL_LETTER)
    .createTextFinder(cleanEmail).matchEntireCell(true);
  const occurrences = finder.findAll();
  if (occurrences.length === 0) return false;

  const data = sheet.getDataRange().getValues();
  for (const cell of occurrences) {
    const rowIdx = cell.getRow() - 1;
    if (data[rowIdx] && String(data[rowIdx][IDX_EVENT]).trim() === eventId) return true;
  }
  return false;
}

function handleCheckDuplicate_(e) {
  const callback = (e && e.parameter && e.parameter.callback) ? String(e.parameter.callback) : "";
  const email = (e && e.parameter && e.parameter.email) ? String(e.parameter.email).trim().toLowerCase() : "";
  const eventId = (e && e.parameter && e.parameter.eventId) ? String(e.parameter.eventId).trim() : "";

  const result = { status: "ok", exists: false, message: "" };

  if (!email || !eventId) {
    result.status = "error";
    result.message = "Paramètres manquants.";
    return jsonp_(callback, result);
  }

  const sheet = getSheetByName_(SHEET_REG);
  ensureHeaders_(sheet);

  if (isDuplicate_(sheet, email, eventId)) {
    result.exists = true;
    result.message = "Déjà inscrit";
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

  const parEvent = Object.keys(stats.byEvent).sort((a, b) => stats.byEvent[b] - stats.byEvent[a]);
  const parPays = Object.keys(stats.byCountry).sort((a, b) => stats.byCountry[b] - stats.byCountry[a]);

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
          .stat-number.vert { color:#198754; }
          .badge-live { animation:pulse 2s infinite; }
          @keyframes pulse { 0%{opacity:1} 50%{opacity:.5} 100%{opacity:1} }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold text-dark">📊 Suivi Kongo Science</h2>
            <span class="badge bg-success badge-live">Mise à jour</span>
          </div>

          <div class="row mb-2">
            <div class="col-md-4">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Inscriptions totales</div>
                <div class="stat-number">${stats.total}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Rappels envoyés</div>
                <div class="stat-number vert">${stats.rappels}</div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card p-4 text-center">
                <div class="text-muted text-uppercase small fw-bold">Conférences</div>
                <div class="stat-number">${parEvent.length}</div>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-md-6">
              <div class="card p-4">
                <h5 class="fw-bold mb-3 border-bottom pb-2">Par conférence</h5>
                <table class="table table-sm">${lignes(parEvent, stats.byEvent)}</table>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card p-4">
                <h5 class="fw-bold mb-3 border-bottom pb-2">Top pays</h5>
                <table class="table table-sm">${lignes(parPays, stats.byCountry)}</table>
              </div>
            </div>
          </div>

          <p class="text-center text-muted small mt-4">Synchronisation : ${updated} (Brazzaville)</p>
        </div>
      </body>
    </html>
  `;

  return HtmlService.createHtmlOutput(html).setTitle("Inscriptions Kongo Science");
}

/****************
 * COURRIELS
 ****************/
function buildConfirmationHtml_(name, eventLabel, dt, participantTz, googleUrl, privateEvent) {
  const esc = escapeHtml_;
  let safeTz = String(participantTz || "").trim() || ORG_TZ;
  if (!isValidTimeZone_(safeTz)) safeTz = ORG_TZ;

  const bg = "#fff8e7", primary = "#d97706", accent = "#dc2626", text = "#1f2937";
  const orgDateTime = fmtNice_(dt, ORG_TZ);
  const localDateTime = fmtNice_(dt, safeTz);

  const zoomLink = (privateEvent && privateEvent.visibleInEmail) ? String(privateEvent.zoomLink || "").trim() : "";
  const zoomPass = (privateEvent && privateEvent.visibleInEmail) ? String(privateEvent.passcode || "").trim() : "";

  const zoomSection = zoomLink ? `
    <div style="background:#eef2ff;padding:14px;border-radius:10px;margin:18px 0;">
      <div style="font-weight:800;margin-bottom:6px;color:#1f2937;">🎥 Lien Zoom (confidentiel)</div>
      <div style="text-align:center;margin-top:10px;">
        <a href="${zoomLink}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:15px;font-weight:800;">
          Rejoindre la réunion Zoom
        </a>
      </div>
      ${zoomPass ? `<p style="margin:10px 0 0;font-size:13px;color:#111827;"><b>Code :</b> ${esc(zoomPass)}</p>` : ""}
      <p style="margin:10px 0 0;font-size:12px;color:#6b7280;">Merci de ne pas partager ce lien publiquement.</p>
    </div>` : `
    <div style="background:#f3f4f6;padding:14px;border-radius:10px;margin:18px 0;font-size:14px;color:#374151;">
      🔒 Le lien de participation vous sera transmis avant la conférence.
    </div>`;

  return `
  <div style="margin:0;padding:0;background:${bg};width:100%;">
    <div style="max-width:650px;margin:0 auto;padding:28px 16px;">
      <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07),0 10px 20px rgba(0,0,0,0.04);">
        <div style="background:linear-gradient(135deg, ${primary} 0%, ${accent} 100%);padding:34px 26px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-family:Georgia,serif;font-size:28px;font-weight:700;">
            Confirmation d'inscription ✅
          </h1>
          <p style="margin:10px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">
            Kongo Science — Communauté scientifique
          </p>
        </div>

        <div style="padding:32px 26px;line-height:1.7;color:${text};font-family:Georgia,serif;">
          <p style="margin:0 0 16px;font-size:16px;">
            Bonjour <strong style="color:${primary};">${esc(name)}</strong>,
          </p>
          <p style="margin:0 0 18px;font-size:16px;">
            Nous accusons réception de votre inscription à l'événement :
          </p>

          <div style="background:linear-gradient(135deg, ${primary}15 0%, ${accent}10 100%);border-left:4px solid ${primary};border-radius:10px;padding:18px;margin:18px 0;">
            <h2 style="margin:0 0 12px;color:${primary};font-size:18px;font-weight:800;">${esc(eventLabel)}</h2>
            <p style="margin:0 0 10px;font-size:15px;">📅 <strong>Brazzaville :</strong> ${esc(orgDateTime)}</p>
            <p style="margin:0;font-size:15px;">🕒 <strong>Votre heure locale :</strong> ${esc(localDateTime)} <span style="color:#6b7280;">(${esc(safeTz)})</span></p>
          </div>

          <div style="background:${accent}10;padding:14px;border-radius:10px;margin:18px 0;">
            🔔 <span style="font-size:14px;">Un rappel vous sera transmis 1 heure avant le début.</span>
          </div>

          ${zoomSection}

          <div style="text-align:center;margin:26px 0 12px;">
            <a href="${googleUrl}" target="_blank" rel="noopener noreferrer"
              style="display:inline-block;background:${primary};color:#fff;text-decoration:none;padding:14px 22px;border-radius:10px;font-size:16px;font-weight:700;">
              🔗 Ajouter à Google Calendar
            </a>
          </div>

          <p style="margin:18px 0 0;font-size:12px;color:#6b7280;text-align:center;">
            Fichier <b>.ics</b> joint (compatible Outlook / Apple Mail).
          </p>
        </div>

        <div style="background:${bg};padding:18px 22px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#6b7280;font-size:12px;">Kongo Science — Communauté scientifique</p>
        </div>
      </div>
    </div>
  </div>`;
}

function buildRappelHtml_(name, eventLabel, dt, participantTz, privateEvent) {
  const esc = escapeHtml_;
  const primary = "#d97706";
  const zoomLink = (privateEvent && privateEvent.visibleInEmail) ? String(privateEvent.zoomLink || "").trim() : "";
  const zoomPass = (privateEvent && privateEvent.visibleInEmail) ? String(privateEvent.passcode || "").trim() : "";

  return `
  <div style="margin:0;padding:0;background:#fff8e7;width:100%;">
    <div style="max-width:600px;margin:0 auto;padding:28px 16px;">
      <div style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <div style="background:${primary};padding:26px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-family:Georgia,serif;font-size:24px;">⏰ C'est dans une heure</h1>
        </div>
        <div style="padding:28px 24px;font-family:Georgia,serif;color:#1f2937;line-height:1.7;">
          <p style="margin:0 0 14px;font-size:16px;">Bonjour <strong style="color:${primary};">${esc(name)}</strong>,</p>
          <p style="margin:0 0 16px;font-size:16px;">
            La conférence <strong>${esc(eventLabel)}</strong> commence à
            <strong>${esc(fmtNice_(dt, participantTz))}</strong> (votre heure locale).
          </p>
          ${zoomLink ? `
          <div style="text-align:center;margin:24px 0;">
            <a href="${zoomLink}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:800;font-size:16px;">
              Rejoindre maintenant
            </a>
            ${zoomPass ? `<p style="margin:12px 0 0;font-size:13px;">Code : <b>${esc(zoomPass)}</b></p>` : ""}
          </div>` : `
          <p style="font-size:14px;color:#6b7280;">Le lien de participation vous a été transmis séparément.</p>`}
          <p style="margin:18px 0 0;font-size:14px;color:#6b7280;">À tout de suite.</p>
        </div>
        <div style="background:#fff8e7;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
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
  const sheet = getSheetByName_(SHEET_REG);
  const rows = sheet.getDataRange().getValues();
  const stats = { total: 0, rappels: 0, byEvent: {}, byCountry: {} };
  if (rows.length <= 1) return stats;

  for (let i = 1; i < rows.length; i++) {
    const eventId = String(rows[i][IDX_EVENT] || "").trim();
    if (!eventId) continue;

    const label = String(rows[i][IDX_TITRE] || "").trim() || eventId;
    const pays = String(rows[i][IDX_PAYS] || "").trim() || "Non renseigné";

    stats.total++;
    stats.byEvent[label] = (stats.byEvent[label] || 0) + 1;
    stats.byCountry[pays] = (stats.byCountry[pays] || 0) + 1;
    if (String(rows[i][IDX_RAPPEL] || "").trim().toUpperCase() === "OUI") stats.rappels++;
  }
  return stats;
}

function updateDashboardSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const dash = ss.getSheetByName(SHEET_DASH) || ss.insertSheet(SHEET_DASH);
  const stats = getStats_();

  dash.clear();
  const data = [["Catégorie", "Élément", "Nombre d'inscrits"]];
  data.push(["Total", "Inscriptions", stats.total]);

  Object.keys(stats.byEvent).sort((a, b) => stats.byEvent[b] - stats.byEvent[a])
    .forEach(k => data.push(["Conférence", k, stats.byEvent[k]]));
  Object.keys(stats.byCountry).sort((a, b) => stats.byCountry[b] - stats.byCountry[a])
    .forEach(k => data.push(["Pays", k, stats.byCountry[k]]));

  dash.getRange(1, 1, data.length, 3).setValues(data);
  dash.getRange("A1:C1").setBackground("#0d6efd").setFontColor("white").setFontWeight("bold");
  dash.setFrozenRows(1);
  dash.autoResizeColumns(1, 3);
}

/****************
 * ÉVÉNEMENTS PRIVÉS (liens Zoom)
 ****************/
function getPrivateEventData_(eventId) {
  const id = String(eventId || "").trim();
  if (!id) return null;

  const sh = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_PRIVATE);
  if (!sh) return null;

  const values = sh.getDataRange().getValues();
  if (values.length < 2) return null;

  const headers = values[0].map(h => String(h || "").trim());
  const idxEventId = headers.indexOf("EventId");
  const idxZoom = headers.indexOf("ZoomLink");
  const idxPass = headers.indexOf("ZoomPasscode");
  const idxVis = headers.indexOf("VisibleInEmail");
  if (idxEventId === -1) return null;

  for (let r = 1; r < values.length; r++) {
    if (String(values[r][idxEventId] || "").trim() !== id) continue;
    return {
      zoomLink: idxZoom !== -1 ? String(values[r][idxZoom] || "").trim() : "",
      passcode: idxPass !== -1 ? String(values[r][idxPass] || "").trim() : "",
      visibleInEmail: ["YES", "OUI", "TRUE", "1"].includes(
        idxVis !== -1 ? String(values[r][idxVis] || "").trim().toUpperCase() : "YES")
    };
  }
  return null;
}

/****************
 * HELPERS
 ****************/
/** À exécuter une fois, à la main, pour préparer les feuilles. */
function initInscriptions() {
  const reg = getSheetByName_(SHEET_REG);
  ensureHeaders_(reg);
  reg.autoResizeColumns(1, COLS.length);

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let priv = ss.getSheetByName(SHEET_PRIVATE);
  if (!priv) {
    priv = ss.insertSheet(SHEET_PRIVATE);
    priv.getRange(1, 1, 1, 4).setValues([["EventId", "ZoomLink", "ZoomPasscode", "VisibleInEmail"]]);
    priv.getRange("A1:D1").setBackground("#1e3a8a").setFontColor("#ffffff").setFontWeight("bold");
    priv.setFrozenRows(1);
  }

  updateDashboardSheet_();
  Logger.log(`Feuilles prêtes : ${SHEET_REG}, ${SHEET_PRIVATE}, ${SHEET_DASH}.`);
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
    return;
  }
  // Ancienne feuille sans la colonne EventTitle : on la complète.
  if (!String(sheet.getRange(1, IDX_TITRE + 1).getValue() || "").trim()) {
    sheet.getRange(1, IDX_TITRE + 1).setValue("EventTitle");
  }
}

/**
 * Fuseau horaire du classeur, mis en cache.
 *
 * Une date écrite dans une cellule est enregistrée par Sheets comme minuit
 * DANS SON PROPRE fuseau. La relire dans un autre fuseau peut reculer d'un
 * jour — un rappel partirait alors le mauvais soir, ou jamais.
 *
 * Pour une heure seule, le piège est pire : Sheets la stocke au 30 décembre
 * 1899, époque où les fuseaux suivaient l'heure solaire locale. La conversion
 * décale de quelques minutes (19:30 devenant 19:34).
 */
let _tzClasseur = null;
function tzClasseur_() {
  if (!_tzClasseur) {
    _tzClasseur = SpreadsheetApp.openById(SPREADSHEET_ID).getSpreadsheetTimeZone() || ORG_TZ;
  }
  return _tzClasseur;
}

/** Une date de feuille peut revenir en objet Date ou en texte. */
function normaliserDate_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, tzClasseur_(), "yyyy-MM-dd");
  }
  const s = String(v || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : "";
}

function normaliserHeure_(v) {
  if (v instanceof Date && !isNaN(v.getTime())) {
    return Utilities.formatDate(v, tzClasseur_(), "HH:mm");
  }
  const s = String(v || "").trim();
  return /^\d{1,2}:\d{2}$/.test(s) ? s : "";
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

function isValidTimeZone_(tz) {
  try { Utilities.formatDate(new Date(), tz || "", "yyyy"); return true; } catch (e) { return false; }
}

/**
 * Date lisible en français.
 *
 * Utilities.formatDate avec « MMMM » suit la langue du projet Apps Script,
 * qui est l'anglais par défaut : les confirmations annonçaient « 22 September
 * 2026 » au milieu d'un texte français. Les mois sont donc écrits en clair.
 */
const MOIS_FR = ["janvier", "février", "mars", "avril", "mai", "juin",
                 "juillet", "août", "septembre", "octobre", "novembre", "décembre"];

function fmtNice_(d, tz) {
  const jour = Utilities.formatDate(d, tz, "d");
  const mois = MOIS_FR[parseInt(Utilities.formatDate(d, tz, "M"), 10) - 1];
  const annee = Utilities.formatDate(d, tz, "yyyy");
  const heure = Utilities.formatDate(d, tz, "HH:mm");
  return `${jour} ${mois} ${annee} à ${heure}`;
}

function getGoogleCalendarLink_(name, eventLabel, start) {
  const end = new Date(start.getTime() + 3600000);
  const f = d => Utilities.formatDate(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
  return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventLabel)}&dates=${f(start)}/${f(end)}&details=${encodeURIComponent("Inscription - " + name)}&location=En+ligne&ctz=Africa%2FBrazzaville`;
}

function escapeIcsText_(t) {
  return String(t || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

function buildIcsAttachment_(email, name, eventLabel, start) {
  const end = new Date(start.getTime() + 3600000);
  const f = d => Utilities.formatDate(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
  const uid = Utilities.base64EncodeWebSafe(`${email}${eventLabel}`).slice(0, 30);
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//KongoScience//FR", "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
    "BEGIN:VEVENT", `UID:${uid}@kongoscience`, `DTSTAMP:${f(new Date())}`, `DTSTART:${f(start)}`, `DTEND:${f(end)}`,
    `SUMMARY:${escapeIcsText_(eventLabel)}`,
    `DESCRIPTION:${escapeIcsText_(`Confirmation pour ${eventLabel}. Participant : ${name}`)}`,
    "LOCATION:En ligne", "END:VEVENT", "END:VCALENDAR"
  ].join("\r\n");
  return Utilities.newBlob(ics, "text/calendar", "invitation.ics");
}
