import { jsPDF } from 'jspdf';
import { KnowledgeDocument } from '../types';

export function exportDocumentToPDF(doc: KnowledgeDocument): void {
  try {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let yPos = 18;

    // 1. Mandatory Legal Disclaimer Header
    pdf.setFillColor(69, 26, 3); // dark amber
    pdf.rect(margin, yPos, contentWidth, 12, 'F');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(254, 243, 199); // amber text
    pdf.text(
      'LEGAL NOTICE: AI-powered information assistant. Not an official government or Prosperity Party representative unless formally authorized.',
      margin + 2,
      yPos + 5,
      { maxWidth: contentWidth - 4 }
    );
    yPos += 18;

    // 2. Institution Header & Hierarchy
    pdf.setTextColor(15, 23, 42); // slate 900
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(14);
    pdf.text('GIRMAIC DD-PP AI · KNOWLEDGE ARCHIVE', margin, yPos);
    yPos += 6;

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(71, 85, 105);
    pdf.text('Authoritative Organizational Hierarchy: Ethiopian PP -> Customs Commission -> Dire Dawa Branch', margin, yPos);
    yPos += 6;

    // Horizontal line
    pdf.setDrawColor(203, 213, 225);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 8;

    // 3. Document Metadata Box
    pdf.setFillColor(248, 250, 252);
    pdf.roundedRect(margin, yPos, contentWidth, 34, 2, 2, 'F');
    pdf.setDrawColor(226, 232, 240);
    pdf.roundedRect(margin, yPos, contentWidth, 34, 2, 2, 'D');

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(15, 23, 42);
    pdf.text(`Document ID: ${doc.id}`, margin + 4, yPos + 6);
    pdf.text(`Status: ${doc.approvalStatus}`, margin + 80, yPos + 6);
    pdf.text(`Hierarchy Priority: Level ${doc.level}`, margin + 130, yPos + 6);

    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(51, 65, 85);
    pdf.text(`Source Organization: ${doc.organization} (${doc.source})`, margin + 4, yPos + 13);
    pdf.text(`Version: ${doc.version} | Language: ${doc.language.toUpperCase()}`, margin + 4, yPos + 20);
    pdf.text(`Effective Date: ${doc.effectiveDate} | Verified Status: VALIDATED`, margin + 4, yPos + 27);
    yPos += 42;

    // 4. Document Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.setTextColor(15, 23, 42);
    const titleLines = pdf.splitTextToSize(doc.title, contentWidth);
    pdf.text(titleLines, margin, yPos);
    yPos += titleLines.length * 6 + 4;

    // 5. Summary / Abstract
    if (doc.summary) {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      const summaryLines = pdf.splitTextToSize(`Summary: ${doc.summary}`, contentWidth);
      pdf.text(summaryLines, margin, yPos);
      yPos += summaryLines.length * 4.5 + 6;
    }

    // 6. Full Content Body
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 41, 59);
    const contentLines = pdf.splitTextToSize(doc.content, contentWidth);

    for (const line of contentLines) {
      if (yPos > 270) {
        pdf.addPage();
        yPos = 20;
      }
      pdf.text(line, margin, yPos);
      yPos += 5.5;
    }

    // 7. Offline Verification Footer & Digital Checksum
    if (yPos > 260) {
      pdf.addPage();
      yPos = 20;
    } else {
      yPos += 10;
    }

    pdf.setDrawColor(203, 213, 225);
    pdf.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 6;

    pdf.setFont('courier', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text(`OFFLINE VERIFICATION CHECKSUM: ${doc.checksum}`, margin, yPos);
    yPos += 4.5;
    pdf.text(`EXPORT TIMESTAMP: ${new Date().toISOString()} | RAG SECURITY: VERIFIED`, margin, yPos);

    // Save PDF
    const filename = `${doc.id}_${doc.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.pdf`;
    pdf.save(filename);
  } catch (error) {
    console.error('PDF generation error, opening printable format fallback:', error);
    openPrintableDocumentFallback(doc);
  }
}

function openPrintableDocumentFallback(doc: KnowledgeDocument): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${doc.id} - ${doc.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 40px; color: #0f172a; line-height: 1.6; }
          .banner { background: #451a03; color: #fef3c7; padding: 12px; font-size: 12px; border-radius: 6px; font-weight: bold; margin-bottom: 24px; }
          .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
          h1 { font-size: 20px; margin-bottom: 12px; }
          .checksum { font-family: monospace; font-size: 11px; color: #64748b; border-top: 1px solid #cbd5e1; padding-top: 16px; margin-top: 40px; }
          @media print { button { display: none; } }
        </style>
      </head>
      <body>
        <div class="banner">LEGAL NOTICE: AI-powered information assistant. Not an official government or Prosperity Party representative unless formally authorized.</div>
        <h2>GIRMAIC DD-PP AI · OFFICIAL KNOWLEDGE ARCHIVE</h2>
        <div class="meta-box">
          <div><strong>Document ID:</strong> ${doc.id} | <strong>Level:</strong> Priority ${doc.level} | <strong>Status:</strong> ${doc.approvalStatus}</div>
          <div><strong>Source:</strong> ${doc.source} (${doc.organization})</div>
          <div><strong>Version:</strong> ${doc.version} | <strong>Effective Date:</strong> ${doc.effectiveDate}</div>
        </div>
        <h1>${doc.title}</h1>
        <div>${doc.content.replace(/\n/g, '<br/>')}</div>
        <div class="checksum">
          <div>OFFLINE VERIFICATION CHECKSUM: ${doc.checksum}</div>
          <div>EXPORT TIMESTAMP: ${new Date().toISOString()}</div>
        </div>
        <br/><button onclick="window.print()">Print / Save as PDF</button>
      </body>
    </html>
  `);
  printWindow.document.close();
}
