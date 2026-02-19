// import jsPDF from "jspdf";

// interface CertificateData {
//   learnerName: string;
//   courseName: string;
//   certificateNumber: string;
//   issuedAt: string;
//   instructor?: string;
// }

// export const generateCertificatePDF = (data: CertificateData) => {
//   const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
//   const w = doc.internal.pageSize.getWidth();
//   const h = doc.internal.pageSize.getHeight();

//   // Background
//   doc.setFillColor(15, 25, 20);
//   doc.rect(0, 0, w, h, "F");

//   // Border frame
//   doc.setDrawColor(76, 175, 80);
//   doc.setLineWidth(2);
//   doc.roundedRect(10, 10, w - 20, h - 20, 5, 5, "S");
//   doc.setLineWidth(0.5);
//   doc.roundedRect(14, 14, w - 28, h - 28, 3, 3, "S");

//   // Corner decorations
//   const cornerSize = 20;
//   doc.setDrawColor(76, 175, 80);
//   doc.setLineWidth(1);
//   // Top-left
//   doc.line(18, 18, 18 + cornerSize, 18);
//   doc.line(18, 18, 18, 18 + cornerSize);
//   // Top-right
//   doc.line(w - 18, 18, w - 18 - cornerSize, 18);
//   doc.line(w - 18, 18, w - 18, 18 + cornerSize);
//   // Bottom-left
//   doc.line(18, h - 18, 18 + cornerSize, h - 18);
//   doc.line(18, h - 18, 18, h - 18 - cornerSize);
//   // Bottom-right
//   doc.line(w - 18, h - 18, w - 18 - cornerSize, h - 18);
//   doc.line(w - 18, h - 18, w - 18, h - 18 - cornerSize);

//   // Decorative line
//   doc.setDrawColor(76, 175, 80);
//   doc.setLineWidth(0.3);
//   const lineY = 55;
//   doc.line(60, lineY, w - 60, lineY);

//   // Logo / Icon area
//   doc.setFillColor(76, 175, 80);
//   doc.circle(w / 2, 38, 8, "F");
//   doc.setTextColor(15, 25, 20);
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "bold");
//   doc.text("AS", w / 2, 41, { align: "center" });

//   // Title
//   doc.setTextColor(76, 175, 80);
//   doc.setFontSize(28);
//   doc.setFont("helvetica", "bold");
//   doc.text("CERTIFICATE OF COMPLETION", w / 2, 70, { align: "center" });

//   // Subtitle in Arabic
//   doc.setTextColor(180, 210, 190);
//   doc.setFontSize(14);
//   doc.setFont("helvetica", "normal");
//   doc.text("AgriSmart Academy", w / 2, 80, { align: "center" });

//   // "This is to certify that"
//   doc.setTextColor(160, 180, 170);
//   doc.setFontSize(11);
//   doc.text("This is to certify that", w / 2, 95, { align: "center" });

//   // Learner name
//   doc.setTextColor(255, 255, 255);
//   doc.setFontSize(30);
//   doc.setFont("helvetica", "bold");
//   doc.text(data.learnerName, w / 2, 112, { align: "center" });

//   // Underline name
//   const nameWidth = doc.getTextWidth(data.learnerName);
//   doc.setDrawColor(76, 175, 80);
//   doc.setLineWidth(0.8);
//   doc.line(w / 2 - nameWidth / 2 - 5, 116, w / 2 + nameWidth / 2 + 5, 116);

//   // "has successfully completed"
//   doc.setTextColor(160, 180, 170);
//   doc.setFontSize(11);
//   doc.setFont("helvetica", "normal");
//   doc.text("has successfully completed the course", w / 2, 128, { align: "center" });

//   // Course name
//   doc.setTextColor(76, 175, 80);
//   doc.setFontSize(20);
//   doc.setFont("helvetica", "bold");
//   doc.text(data.courseName, w / 2, 142, { align: "center" });

//   // Instructor
//   if (data.instructor) {
//     doc.setTextColor(160, 180, 170);
//     doc.setFontSize(10);
//     doc.setFont("helvetica", "normal");
//     doc.text(`Instructor: ${data.instructor}`, w / 2, 153, { align: "center" });
//   }

//   // Bottom section line
//   const bottomLineY = h - 50;
//   doc.setDrawColor(76, 175, 80);
//   doc.setLineWidth(0.3);
//   doc.line(40, bottomLineY, w - 40, bottomLineY);

//   // Date & Certificate number
//   doc.setTextColor(140, 160, 150);
//   doc.setFontSize(9);
//   doc.setFont("helvetica", "normal");

//   const dateStr = new Date(data.issuedAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   doc.text(`Date: ${dateStr}`, 50, bottomLineY + 12, { align: "left" });
//   doc.text(`Certificate No: ${data.certificateNumber}`, w - 50, bottomLineY + 12, { align: "right" });

//   // Verification URL
//   doc.setTextColor(76, 175, 80);
//   doc.setFontSize(8);

//   return doc;
// };

// export const downloadCertificatePDF = (data: CertificateData) => {
//   const doc = generateCertificatePDF(data);
//   doc.save(`certificate-${data.certificateNumber}.pdf`);
// };

import jsPDF from "jspdf";

interface CertificateData {
  learnerName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  instructor?: string;
}

export const generateCertificatePDF = (data: CertificateData) => {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  /* Background */
  doc.setFillColor(10, 20, 18);
  doc.rect(0, 0, w, h, "F");

  /* Outer Border */
  doc.setDrawColor(100, 200, 140);
  doc.setLineWidth(2);
  doc.roundedRect(8, 8, w - 16, h - 16, 6, 6, "S");

  doc.setLineWidth(0.5);
  doc.roundedRect(14, 14, w - 28, h - 28, 4, 4, "S");

  /* Academy Name */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(100, 200, 140);
  doc.text("AgriSmart Academy", w / 2, 35, { align: "center" });

  /* Title */
  doc.setFontSize(30);
  doc.setTextColor(255, 255, 255);
  doc.text("CERTIFICATE OF COMPLETION", w / 2, 55, { align: "center" });

  doc.setDrawColor(100, 200, 140);
  doc.setLineWidth(0.5);
  doc.line(w / 2 - 50, 60, w / 2 + 50, 60);

  /* Body */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(180, 200, 190);
  doc.text("This certificate is proudly presented to", w / 2, 75, {
    align: "center",
  });

  /* Learner Name */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text(data.learnerName, w / 2, 95, { align: "center" });

  const nameWidth = doc.getTextWidth(data.learnerName);
  doc.setLineWidth(0.8);
  doc.setDrawColor(100, 200, 140);
  doc.line(
    w / 2 - nameWidth / 2 - 5,
    100,
    w / 2 + nameWidth / 2 + 5,
    100
  );

  /* Course */
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(180, 200, 190);
  doc.text("For successfully completing the course", w / 2, 115, {
    align: "center",
  });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(100, 200, 140);
  doc.text(data.courseName, w / 2, 130, { align: "center" });

  /* Bottom Line */
  doc.setDrawColor(100, 200, 140);
  doc.setLineWidth(0.3);
  doc.line(40, h - 50, w - 40, h - 50);

  /* Date & Number */
  const formattedDate = new Date(data.issuedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  doc.setFontSize(9);
  doc.setTextColor(160, 180, 170);
  doc.text(`Date: ${formattedDate}`, 45, h - 35);

  doc.text(
    `Certificate No: ${data.certificateNumber}`,
    w - 45,
    h - 35,
    { align: "right" }
  );

  /* Instructor */
  if (data.instructor) {
    doc.setDrawColor(100, 200, 140);
    doc.line(60, h - 30, 110, h - 30);

    doc.setFontSize(10);
    doc.text(data.instructor, 85, h - 23, {
      align: "center",
    });
  }

  return doc;
};

export const downloadCertificatePDF = (data: CertificateData) => {
  const doc = generateCertificatePDF(data);
  doc.save(`certificate-${data.certificateNumber}.pdf`);
};

