import jsPDF from "jspdf";

interface CertificateData {
  learnerName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  instructor?: string;
}

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const w = doc.internal.pageSize.getWidth(); // 297
  const h = doc.internal.pageSize.getHeight(); // 210

  /* ── Background: clean white ── */
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, h, "F");

  /* ── Left green accent bar ── */
  doc.setFillColor(34, 100, 60);
  doc.rect(0, 0, 8, h, "F");

  /* ── Top thin gold line ── */
  doc.setDrawColor(180, 145, 30);
  doc.setLineWidth(0.8);
  doc.line(8, 14, w - 14, 14);

  /* ── Bottom thin gold line ── */
  doc.line(8, h - 14, w - 14, h - 14);

  /* ── Right thin border ── */
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.4);
  doc.line(w - 14, 14, w - 14, h - 14);

  /* ── Academy name top-right ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(34, 100, 60);
  doc.text("AGRISMART ACADEMY", w - 18, 11, { align: "right", charSpace: 2 });

  /* ── CERTIFICATE OF COMPLETION ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(160, 130, 20);
  doc.text("C E R T I F I C A T E   O F   C O M P L E T I O N", 18, 36);

  /* ── Arabic subtitle ── */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text("شهادة إتمام الكورس", 18, 44);

  /* ── Divider after heading ── */
  doc.setDrawColor(34, 100, 60);
  doc.setLineWidth(2);
  doc.line(18, 48, 60, 48);
  doc.setLineWidth(0.3);
  doc.setDrawColor(220, 220, 220);
  doc.line(62, 48, w - 20, 48);

  /* ── "Presented to" ── */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text("This certificate is awarded to", 18, 64);

  /* ── Learner Name ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(20, 20, 20);
  doc.text(data.learnerName, 18, 84);

  /* ── Name underline ── */
  const nameW = doc.getTextWidth(data.learnerName);
  doc.setDrawColor(34, 100, 60);
  doc.setLineWidth(0.6);
  doc.line(18, 87, Math.min(18 + nameW, w - 20), 87);

  /* ── "for completing" ── */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(130, 130, 130);
  doc.text("for successfully completing", 18, 100);
  doc.text("لإتمامه بنجاح كورس", 18, 108);

  /* ── Course Name ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(34, 100, 60);
  const courseLines = doc.splitTextToSize(data.courseName, 160);
  doc.text(courseLines, 18, 122);

  /* ── Instructor ── */
  if (data.instructor) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Instructor: ${data.instructor}`, 18, 138);
  }

  /* ── Right side seal area ── */
  // Light circle seal
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.circle(w - 50, h / 2, 28);

  doc.setDrawColor(34, 100, 60);
  doc.setLineWidth(1.2);
  doc.circle(w - 50, h / 2, 24);

  // "AS" monogram
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(34, 100, 60);
  doc.text("AS", w - 50, h / 2 + 4, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(34, 100, 60);
  doc.text("AGRISMART", w - 50, h / 2 + 11, { align: "center", charSpace: 1 });

  /* ── Bottom info row ── */
  // Date
  const dateStr = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("Date of Issue", 18, h - 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(dateStr, 18, h - 17);

  // Cert number
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(160, 160, 160);
  doc.text("Certificate No.", 90, h - 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40, 40, 40);
  doc.text(data.certificateNumber, 90, h - 17);

  // Verify URL
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(180, 180, 180);
  doc.text(`agrismart.app/verify/${data.certificateNumber}`, 18, h - 10);

  return doc;
};

export const downloadCertificatePDF = (data: CertificateData): void => {
  const doc = generateCertificatePDF(data);
  doc.save(`certificate-${data.certificateNumber}.pdf`);
};
