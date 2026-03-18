/**
 * printReport — Opens a properly formatted RBSK Field Survey Report in a new window and triggers print.
 */
export const printReport = (surveyData) => {
  const surveyId  = surveyData.surveyId  || surveyData.linkedId || '—';
  const deicId    = surveyData.deicId    || '';
  const date      = surveyData.date      || new Date().toISOString().split('T')[0];
  const generated = new Date().toLocaleString('en-IN');

  // All clinical conditions to display
  const ALL_CONDITIONS = [
    ['Visible Congenital Defect', surveyData.visibleDefect],
    ['Anemia',                    surveyData.anemia],
    ['Vitamin A Deficiency',      surveyData.vitA],
    ['Vitamin D / Rickets',       surveyData.vitD],
    ['Severe Acute Malnutrition', surveyData.sam],
    ['Goiter / Thyroid',          surveyData.goiter],
    ['Skin Infections',           surveyData.skinInfections],
    ['Ear Infections',            surveyData.earInfections],
    ['Rheumatic Heart Disease',   surveyData.rhd],
    ['Asthma / Respiratory',      surveyData.asthma],
    ['Dental Caries',             surveyData.dentalCaries],
    ['Seizures / Convulsions',    surveyData.convulsions],
    ['Vision Difficulty',         surveyData.visionDiff],
    ['Hearing Difficulty',        surveyData.hearingDiff],
    ['Walking Difficulty',        surveyData.walkingDiff],
    ['Speech / Language Delay',   surveyData.speechDelay],
    ['Learning Delay',            surveyData.learningDelay],
    ['Autism Spectrum',           surveyData.autism],
    ['ADHD',                      surveyData.adhd],
    ['Behavioral Difficulty',     surveyData.behavioral],
  ].filter(([, val]) => val);   // only show fields that have a value

  const condRows = ALL_CONDITIONS.map(([label, val], i) => `
    <tr style="background:${i % 2 === 0 ? '#f8fafb' : '#ffffff'};">
      <td style="padding:7px 14px;border-bottom:1px solid #e2e8f0;font-size:10.5pt;color:#2d3748;">${label}</td>
      <td style="padding:7px 14px;border-bottom:1px solid #e2e8f0;font-size:10.5pt;font-weight:700;color:${val === 'Yes' ? '#c0392b' : '#2d3748'};">${val}</td>
    </tr>`).join('');

  const metaParts = [`Survey ID: ${surveyId}`, `Date: ${date}`];
  if (deicId) metaParts.push(`DEIC ID: ${deicId}`);
  const metaLine = metaParts.join('&nbsp;&nbsp;|&nbsp;&nbsp;');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>RBSK Field Survey Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #ffffff;
      color: #1a202c;
      font-size: 11pt;
    }
    @page { size: A4; margin: 0; }

    /* ── HEADER ─────────────────────────────────────── */
    .rpt-header {
      background: #0d7377;
      color: #ffffff;
      padding: 20px 28px 16px;
    }
    .rpt-header h1 {
      font-size: 21pt;
      font-weight: 900;
      letter-spacing: -0.3px;
      margin-bottom: 5px;
    }
    .rpt-header .meta {
      font-size: 9pt;
      color: rgba(255,255,255,0.72);
      font-weight: 500;
    }

    /* ── BODY ───────────────────────────────────────── */
    .rpt-body { padding: 22px 28px 80px; }

    /* ── SECTION HEADING ────────────────────────────── */
    .section-title {
      font-size: 13pt;
      font-weight: 800;
      color: #1a202c;
      margin: 22px 0 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid #e2e8f0;
    }

    /* ── INFO TABLE (label | value) ─────────────────── */
    .info-table {
      width: 100%;
      border-collapse: collapse;
    }
    .info-table td {
      padding: 6px 8px;
      font-size: 10.5pt;
      vertical-align: top;
    }
    .info-table td:first-child {
      width: 38%;
      color: #0d7377;
      font-weight: 600;
    }
    .info-table td:last-child {
      color: #2d3748;
      font-weight: 500;
    }

    /* ── RISK FLAGS ─────────────────────────────────── */
    .risk-flags {
      font-size: 13pt;
      font-weight: 800;
      color: #c0392b;
      margin: 22px 0 10px;
    }

    /* ── CONDITIONS TABLE ───────────────────────────── */
    .cond-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #e2e8f0;
    }
    .cond-header td {
      background: #0d7377;
      color: #ffffff;
      padding: 9px 14px;
      font-size: 10.5pt;
      font-weight: 700;
    }

    /* ── FOOTER ─────────────────────────────────────── */
    .rpt-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 8px 28px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #94a3b8;
      background: #ffffff;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="rpt-header">
    <h1>RBSK Field Survey Report</h1>
    <div class="meta">${metaLine}</div>
  </div>

  <!-- BODY -->
  <div class="rpt-body">

    <!-- Child Information -->
    <div class="section-title">Child Information</div>
    <table class="info-table">
      <tr><td>Name</td>          <td>${surveyData.childName  || '—'}</td></tr>
      <tr><td>Date of Birth</td> <td>${surveyData.dob         || '—'}</td></tr>
      <tr><td>Age</td>           <td>${surveyData.ageDisplay  || '—'}</td></tr>
      <tr><td>Sex</td>           <td>${surveyData.sex         || '—'}</td></tr>
      <tr><td>District</td>      <td>${surveyData.district    || '—'}</td></tr>
      <tr><td>Category</td>      <td>${surveyData.category || surveyData.sum_primaryDx || '—'}</td></tr>
    </table>

    <!-- Risk Flags -->
    <div class="risk-flags">Risk Flags: ${surveyData.redFlagsCount ?? 0}</div>

    <!-- Conditions table -->
    ${ALL_CONDITIONS.length > 0 ? `
    <table class="cond-table">
      <tr class="cond-header"><td>Condition</td><td>Status</td></tr>
      ${condRows}
    </table>` : '<p style="font-size:10pt;color:#64748b;">No clinical conditions recorded.</p>'}

    <!-- Referral Details -->
    <div class="section-title">Referral Details</div>
    <table class="info-table">
      <tr><td>Referred</td>        <td>${surveyData.referred         || '—'}</td></tr>
      <tr><td>Referral Place</td>  <td>${surveyData.referralPlace    || '—'}</td></tr>
      <tr><td>DEIC Confirmed</td>  <td>${surveyData.deicConfirmed    || '—'}</td></tr>
      <tr><td>Intervention</td>    <td>${surveyData.deicIntervention || '—'}</td></tr>
    </table>

    ${surveyData.gapsIdentified ? `
    <!-- Surveyor Observations -->
    <div class="section-title">Surveyor Observations</div>
    <p style="font-size:10.5pt;color:#4a5568;line-height:1.65;">${surveyData.gapsIdentified}</p>` : ''}

  </div><!-- /rpt-body -->

  <!-- FOOTER -->
  <div class="rpt-footer">
    <span>RBSK Surveyor &mdash; Page 1/1</span>
    <span>Generated: ${generated}</span>
  </div>

</body>
</html>`;

  const win = window.open('', '_blank', 'width=850,height=1000');
  if (!win) return; // popup blocked
  win.document.write(html);
  win.document.close();
  win.focus();
  // Small delay so fonts load before the print dialog
  setTimeout(() => { win.print(); }, 700);
};
