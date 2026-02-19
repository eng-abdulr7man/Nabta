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
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();

  // Background with elegant gradient effect (simulated with layered rectangles)
  doc.setFillColor(250, 250, 252);
  doc.rect(0, 0, w, h, "F");
  
  // Subtle pattern overlay
  doc.setFillColor(245, 247, 250);
  for (let i = 0; i < w; i += 15) {
    for (let j = 0; j < h; j += 15) {
      doc.setFillColor(245, 247, 250);
      doc.circle(i, j, 0.3, "F");
    }
  }

  // Main decorative border
  doc.setDrawColor(42, 76, 61); // Dark green
  doc.setLineWidth(0.5);
  doc.roundedRect(8, 8, w - 16, h - 16, 8, 8, "S");

  // Inner gold border
  doc.setDrawColor(193, 154, 107); // Gold
  doc.setLineWidth(1.5);
  doc.roundedRect(12, 12, w - 24, h - 24, 6, 6, "S");

  // Decorative corners with gold accents
  const cornerLength = 25;
  doc.setDrawColor(193, 154, 107);
  doc.setLineWidth(1.2);
  
  // Top-left corner
  doc.line(12, 20, 12, 12);
  doc.line(12, 12, 20, 12);
  
  // Top-right corner
  doc.line(w - 12, 20, w - 12, 12);
  doc.line(w - 20, 12, w - 12, 12);
  
  // Bottom-left corner
  doc.line(12, h - 20, 12, h - 12);
  doc.line(20, h - 12, 12, h - 12);
  
  // Bottom-right corner
  doc.line(w - 12, h - 20, w - 12, h - 12);
  doc.line(w - 20, h - 12, w - 12, h - 12);

  // Gold laurel wreath effect at top
  doc.setDrawColor(193, 154, 107);
  doc.setLineWidth(0.8);
  
  // Left wreath
  for (let i = 0; i < 5; i++) {
    const x = w / 2 - 40 + i * 8;
    const y = 28;
    doc.ellipse(x, y, 5, 8, 0.2, 'S');
  }
  
  // Right wreath
  for (let i = 0; i < 5; i++) {
    const x = w / 2 + 10 + i * 8;
    const y = 28;
    doc.ellipse(x, y, 5, 8, -0.2, 'S');
  }

  // Main title with gold underline
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(42);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFICATE", w / 2, 45, { align: "center" });
  
  doc.setTextColor(193, 154, 107);
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("OF COMPLETION", w / 2, 58, { align: "center" });

  // Gold decorative line under title
  doc.setDrawColor(193, 154, 107);
  doc.setLineWidth(1);
  doc.line(w / 2 - 40, 63, w / 2 + 40, 63);

  // Academy name with gold seal
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("AgriSmart Academy", w / 2, 75, { align: "center" });

  // This is to certify that
  doc.setTextColor(102, 102, 102);
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text("This is to certify that", w / 2, 95, { align: "center" });

  // Learner name with elegant styling
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(36);
  doc.setFont("helvetica", "bold");
  doc.text(data.learnerName, w / 2, 115, { align: "center" });

  // Decorative name underline
  const nameWidth = doc.getTextWidth(data.learnerName);
  doc.setDrawColor(193, 154, 107);
  doc.setLineWidth(0.8);
  doc.line(w / 2 - nameWidth / 2 - 10, 120, w / 2 + nameWidth / 2 + 10, 120);

  // has successfully completed
  doc.setTextColor(102, 102, 102);
  doc.setFontSize(13);
  doc.setFont("helvetica", "normal");
  doc.text("has successfully completed the course", w / 2, 135, { align: "center" });

  // Course name with gold background highlight
  doc.setFillColor(250, 245, 235);
  const courseWidth = doc.getTextWidth(data.courseName) + 20;
  doc.roundedRect(w / 2 - courseWidth / 2, 138, courseWidth, 18, 4, 4, "F");
  
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(data.courseName, w / 2, 152, { align: "center" });

  // Instructor with gold icon
  if (data.instructor) {
    doc.setTextColor(193, 154, 107);
    doc.setFontSize(10);
    doc.text("⭐", w / 2 - 35, 167);
    
    doc.setTextColor(102, 102, 102);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Instructor: ${data.instructor}`, w / 2, 167, { align: "center" });
  }

  // Bottom section with gold border
  const bottomY = h - 45;
  
  // Horizontal line
  doc.setDrawColor(193, 154, 107);
  doc.setLineWidth(0.5);
  doc.line(35, bottomY - 5, w - 35, bottomY - 5);

  // Left section - Date
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Date", 35, bottomY + 5);
  
  doc.setTextColor(102, 102, 102);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dateStr = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.text(dateStr, 35, bottomY + 13);

  // Center - Certificate Number
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Certificate No.", w / 2 - 25, bottomY + 5);
  
  doc.setTextColor(102, 102, 102);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(data.certificateNumber, w / 2 - 25, bottomY + 13);

  // Right section - Verification
  doc.setTextColor(42, 76, 61);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Verify at", w - 50, bottomY + 5);
  
  doc.setTextColor(193, 154, 107);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("www.agrismart.com/verify", w - 50, bottomY + 13);

  // Gold seal/stamp at bottom right
  doc.setDrawColor(193, 154, 107);
  doc.setLineWidth(0.8);
  doc.circle(w - 25, h - 30, 12, "S");
  
  doc.setFillColor(193, 154, 107);
  doc.circle(w - 25, h - 30, 3, "F");
  
  doc.setTextColor(193, 154, 107);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text("AS", w - 25, h - 28, { align: "center" });

  return doc;
};

export const downloadCertificatePDF = (data: CertificateData) => {
  const doc = generateCertificatePDF(data);
  doc.save(`certificate-${data.certificateNumber}.pdf`);
};
