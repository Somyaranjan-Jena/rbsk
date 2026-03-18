import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { FLAG_LABELS, FLAG_KEYS } from './helpers';

export function exportSurveyPDF(formData, redFlagsCount) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(13, 148, 136); // teal-600
  doc.rect(0, 0, w, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('RBSK Field Survey Report', 14, 18);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`Survey ID: ${formData.surveyId || '—'}  |  Date: ${formData.date || '—'}`, 14, 28);

  // Child Info
  doc.setTextColor(30, 41, 59);
  let y = 45;
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Child Information', 14, y); y += 8;

  const info = [
    ['Name', formData.childName || '—'],
    ['Date of Birth', formData.dob || '—'],
    ['Age', formData.ageDisplay || '—'],
    ['Sex', formData.sex || '—'],
    ['District', formData.district || '—'],
    ['Category', formData.category || '—'],
  ];

  doc.autoTable({
    startY: y,
    head: [],
    body: info,
    theme: 'plain',
    styles: { fontSize: 10, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 116, 139] } },
    margin: { left: 14 },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Red Flags Summary
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  if (redFlagsCount > 0) {
    doc.setTextColor(220, 38, 38);
    doc.text(`Risk Flags: ${redFlagsCount}`, 14, y);
    doc.setTextColor(30, 41, 59);
  } else {
    doc.setTextColor(5, 150, 105);
    doc.text('Risk Flags: 0 (Clear)', 14, y);
    doc.setTextColor(30, 41, 59);
  }
  y += 8;

  // Clinical Assessment Table
  const clinicalRows = FLAG_KEYS.map(k => [
    FLAG_LABELS[k] || k,
    formData[k] || 'N/A',
  ]).filter(([, val]) => val && val !== 'N/A');

  if (clinicalRows.length > 0) {
    doc.autoTable({
      startY: y,
      head: [['Condition', 'Status']],
      body: clinicalRows,
      theme: 'striped',
      headStyles: { fillColor: [13, 148, 136], textColor: 255, fontSize: 9, fontStyle: 'bold' },
      styles: { fontSize: 9, cellPadding: 3 },
      margin: { left: 14 },
      didParseCell: function (data) {
        if (data.section === 'body' && data.column.index === 1 && data.cell.raw === 'Yes') {
          data.cell.styles.textColor = [220, 38, 38];
          data.cell.styles.fontStyle = 'bold';
        }
      },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Referral Info
  if (formData.referred) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Referral Details', 14, y); y += 8;

    const refRows = [
      ['Referred', formData.referred],
      ['Referral Place', formData.referralPlace || '—'],
      ['DEIC Confirmed', formData.deicConfirmed || '—'],
      ['Intervention', formData.deicIntervention || '—'],
    ];

    doc.autoTable({
      startY: y,
      head: [],
      body: refRows,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50, textColor: [100, 116, 139] } },
      margin: { left: 14 },
    });
    y = doc.lastAutoTable.finalY + 10;
  }

  // Gaps
  if (formData.gapsIdentified) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Surveyor Observations', 14, y); y += 8;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    const lines = doc.splitTextToSize(formData.gapsIdentified, w - 28);
    doc.text(lines, 14, y);
  }

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`RBSK Surveyor — Page ${i}/${pages}`, 14, doc.internal.pageSize.getHeight() - 8);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, w - 14, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
  }

  doc.save(`RBSK_Survey_${formData.surveyId || 'report'}.pdf`);
}

export function exportDEICPDF(formData) {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(88, 28, 135); // purple-800
  doc.rect(0, 0, w, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont(undefined, 'bold');
  doc.text('DEIC Case Sheet', 14, 18);
  doc.setFontSize(9);
  doc.setFont(undefined, 'normal');
  doc.text(`Child: ${formData.deic_childName || '—'}  |  RBSK: ${formData.deic_rbsk_surveyId || '—'}`, 14, 28);

  // Basic info
  doc.setTextColor(30, 41, 59);
  let y = 45;
  const info = [
    ['Name', formData.deic_childName || '—'],
    ['DOB', formData.deic_dob || '—'],
    ['Age', formData.deic_age || '—'],
    ['Sex', formData.deic_sex || '—'],
    ['District', formData.deic_district || '—'],
  ];
  doc.autoTable({
    startY: y,
    head: [['Field', 'Value']],
    body: info,
    theme: 'striped',
    headStyles: { fillColor: [88, 28, 135], textColor: 255, fontSize: 9 },
    styles: { fontSize: 10, cellPadding: 3 },
    margin: { left: 14 },
  });
  y = doc.lastAutoTable.finalY + 10;

  // Collect all form entries into a readable table
  const entries = Object.entries(formData)
    .filter(([k, v]) => v && !['deic_childName','deic_dob','deic_age','deic_sex','deic_district','deic_rbsk_surveyId'].includes(k))
    .map(([k, v]) => [k.replace(/_/g, ' ').replace(/^deic /, ''), Array.isArray(v) ? v.join(', ') : String(v)]);

  if (entries.length > 0) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Assessment Data', 14, y); y += 8;

    doc.autoTable({
      startY: y,
      head: [['Field', 'Value']],
      body: entries,
      theme: 'striped',
      headStyles: { fillColor: [88, 28, 135], textColor: 255, fontSize: 9 },
      styles: { fontSize: 8, cellPadding: 2 },
      margin: { left: 14 },
    });
  }

  // Footer
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`DEIC Case Sheet — Page ${i}/${pages}`, 14, doc.internal.pageSize.getHeight() - 8);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, w - 14, doc.internal.pageSize.getHeight() - 8, { align: 'right' });
  }

  doc.save(`DEIC_CaseSheet_${formData.deic_childName || 'case'}.pdf`);
}
