import jsPDF from "jspdf";

interface CertificateData {
  learnerName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  instructor?: string;
}

// Helper: draw text RTL-friendly (jsPDF doesn't natively support Arabic shaping,
// so we render transliterated info in English labels + Arabic values via reversed string trick)
// For a fully shaped Arabic PDF you'd need a custom Arabic font embedded.
// Here we use the standard approach with reversed text for display purposes.

const reverseArabic = (str: string) => str.split("").reverse().join("");

export const generateCertificatePDF = (data: CertificateData): jsPDF => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const w = doc.internal.pageSize.getWidth(); // 297
  const h = doc.internal.pageSize.getHeight(); // 210

  /* ─────────────────────────────────────────
     BACKGROUND: Deep dark green + warm cream
  ───────────────────────────────────────── */
  // Main dark green background
  doc.setFillColor(10, 30, 18);
  doc.rect(0, 0, w, h, "F");

  // Decorative side bands
  doc.setFillColor(20, 60, 35);
  doc.rect(0, 0, 18, h, "F");
  doc.rect(w - 18, 0, 18, h, "F");

  /* ─────────────────────────────────────────
     OUTER BORDER
  ───────────────────────────────────────── */
  doc.setDrawColor(183, 149, 11); // gold
  doc.setLineWidth(2.5);
  doc.rect(22, 10, w - 44, h - 20);

  doc.setLineWidth(0.6);
  doc.setDrawColor(210, 180, 50);
  doc.rect(26, 14, w - 52, h - 28);

  /* ─────────────────────────────────────────
     TOP DECORATIVE STRIP
  ───────────────────────────────────────── */
  doc.setFillColor(25, 75, 45);
  doc.rect(26, 14, w - 52, 22, "F");

  /* ─────────────────────────────────────────
     ACADEMY LOGO AREA (circle seal)
  ───────────────────────────────────────── */
  // Outer glow ring
  doc.setDrawColor(183, 149, 11);
  doc.setLineWidth(1.5);
  doc.circle(w / 2, 36, 14);

  // Inner circle fill
  doc.setFillColor(25, 75, 45);
  doc.circle(w / 2, 36, 12, "F");

  // "AS" monogram
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(183, 149, 11);
  doc.text("AS", w / 2, 39, { align: "center" });

  /* ─────────────────────────────────────────
     ACADEMY NAME
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(183, 149, 11);
  doc.text("AGRISMART ACADEMY", w / 2, 22, { align: "center", charSpace: 3 });

  /* ─────────────────────────────────────────
     MAIN TITLE
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.setTextColor(220, 200, 100);
  doc.text("CERTIFICATE OF COMPLETION", w / 2, 68, { align: "center", charSpace: 1.5 });

  // Arabic subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(13);
  doc.setTextColor(160, 190, 160);
  doc.text("شهادة إتمام الكورس", w / 2, 78, { align: "center" });

  /* ─────────────────────────────────────────
     GOLD DIVIDER
  ───────────────────────────────────────── */
  doc.setDrawColor(183, 149, 11);
  doc.setLineWidth(1.2);
  doc.line(50, 83, w - 50, 83);
  doc.setLineWidth(0.3);
  doc.line(50, 85.5, w - 50, 85.5);

  /* ─────────────────────────────────────────
     PRESENTED TO
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(160, 185, 160);
  doc.text("This certificate is proudly presented to", w / 2, 97, { align: "center" });
  doc.text("تُمنح هذه الشهادة إلى", w / 2, 105, { align: "center" });

  /* ─────────────────────────────────────────
     LEARNER NAME (large, gold)
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(220, 195, 80);
  doc.text(data.learnerName, w / 2, 122, { align: "center" });

  // Elegant underline
  const nameW = doc.getTextWidth(data.learnerName);
  doc.setDrawColor(183, 149, 11);
  doc.setLineWidth(0.8);
  doc.line(w / 2 - nameW / 2 - 8, 126, w / 2 + nameW / 2 + 8, 126);

  /* ─────────────────────────────────────────
     COURSE LABEL
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10.5);
  doc.setTextColor(140, 170, 145);
  doc.text("For successfully completing the course  •  لإتمام الكورس بنجاح", w / 2, 137, { align: "center" });

  /* ─────────────────────────────────────────
     COURSE NAME
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(100, 200, 130);
  const courseLines = doc.splitTextToSize(data.courseName, 180);
  doc.text(courseLines, w / 2, 149, { align: "center" });

  /* ─────────────────────────────────────────
     BOTTOM SECTION
  ───────────────────────────────────────── */
  // Bottom decorative strip
  doc.setFillColor(25, 75, 45);
  doc.rect(26, h - 36, w - 52, 22, "F");

  doc.setDrawColor(183, 149, 11);
  doc.setLineWidth(0.5);
  doc.line(26, h - 36, w - 26, h - 36);

  // Date (left)
  const dateStr = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(140, 170, 145);
  doc.text("Date of Issue", 40, h - 27);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 185, 100);
  doc.text(dateStr, 40, h - 21);

  // Certificate No (right)
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(140, 170, 145);
  doc.text("Certificate No.", w - 40, h - 27, { align: "right" });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(200, 185, 100);
  doc.text(data.certificateNumber, w - 40, h - 21, { align: "right" });

  // Instructor signature (center)
  if (data.instructor) {
    doc.setDrawColor(183, 149, 11);
    doc.setLineWidth(0.5);
    doc.line(w / 2 - 30, h - 24, w / 2 + 30, h - 24);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(160, 190, 160);
    doc.text(data.instructor, w / 2, h - 21, { align: "center" });
    doc.text("Instructor / المدرب", w / 2, h - 17, { align: "center" });
  }

  /* ─────────────────────────────────────────
     CORNER ORNAMENTS (top corners)
  ───────────────────────────────────────── */
  const ornament = (x: number, y: number, flipX: boolean, flipY: boolean) => {
    doc.setDrawColor(183, 149, 11);
    doc.setLineWidth(0.8);
    const sx = flipX ? -1 : 1;
    const sy = flipY ? -1 : 1;
    doc.line(x, y, x + sx * 14, y);
    doc.line(x, y, x, y + sy * 14);
    doc.line(x + sx * 4, y + sy * 4, x + sx * 10, y + sy * 4);
    doc.line(x + sx * 4, y + sy * 4, x + sx * 4, y + sy * 10);
  };

  ornament(27, 15, false, false); // TL
  ornament(w - 27, 15, true, false); // TR
  ornament(27, h - 15, false, true); // BL
  ornament(w - 27, h - 15, true, true); // BR

  /* ─────────────────────────────────────────
     VERIFICATION URL
  ───────────────────────────────────────── */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(100, 130, 105);
  doc.text(`Verify: agrismart.app/verify/${data.certificateNumber}`, w / 2, h - 12, { align: "center" });

  return doc;
};

export const downloadCertificatePDF = (data: CertificateData): void => {
  const doc = generateCertificatePDF(data);
  doc.save(`certificate-${data.certificateNumber}.pdf`);
};
