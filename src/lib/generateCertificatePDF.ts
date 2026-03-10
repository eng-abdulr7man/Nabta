
import jsPDF from "jspdf";

export interface CertificateData {
  learnerName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  instructor?: string;
}

const containsArabic = (text: string): boolean => {
  const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  return arabicPattern.test(text);
};

const loadFont = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

let fontsLoaded = false;
let amiriRegularBase64 = "";
let amiriBoldBase64 = "";

const ensureFontsLoaded = async (pdf: jsPDF) => {
  if (!fontsLoaded) {
    amiriRegularBase64 = await loadFont("/fonts/Amiri-Regular.ttf");
    amiriBoldBase64 = await loadFont("/fonts/Amiri-Bold.ttf");
    fontsLoaded = true;
  }
  pdf.addFileToVFS("Amiri-Regular.ttf", amiriRegularBase64);
  pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
  pdf.addFileToVFS("Amiri-Bold.ttf", amiriBoldBase64);
  pdf.addFont("Amiri-Bold.ttf", "Amiri", "bold");
};

const setFontForText = (pdf: jsPDF, text: string, style: "normal" | "bold") => {
  if (containsArabic(text)) {
    pdf.setFont("Amiri", style);
  } else {
    pdf.setFont("helvetica", style);
  }
};

export const generateCertificatePDF = async (data: CertificateData): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  await ensureFontsLoaded(pdf);

  const pageWidth = 297;
  const pageHeight = 210;
  const centerX = pageWidth / 2;

  // 1. ===== Background (Luxury Ivory) =====
  pdf.setFillColor(255, 255, 245); 
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // 2. ===== Outer Border (Double Gold Line) =====
  pdf.setDrawColor(180, 142, 60); // Gold
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, pageWidth - 20, pageHeight - 20, "S");
  pdf.setLineWidth(0.5);
  pdf.rect(12, 12, pageWidth - 24, pageHeight - 24, "S");

  // Corner Ornaments (Small Rectangles)
  pdf.setFillColor(180, 142, 60);
  pdf.rect(8, 8, 10, 10, "F"); // Top Left
  pdf.rect(pageWidth - 18, 8, 10, 10, "F"); // Top Right
  pdf.rect(8, pageHeight - 18, 10, 10, "F"); // Bottom Left
  pdf.rect(pageWidth - 18, pageHeight - 18, 10, 10, "F"); // Bottom Right

 // 3. ===== Header: Logo & Academy Name =====
  pdf.setTextColor(5, 46, 22); // الأخضر الداكن
  pdf.setFont("Amiri", "bold");
  pdf.setFontSize(45);
  pdf.text("نـَـبْـتـَـة", centerX, 40, { align: "center" });

  // السطر اللي محتاج سنترة دقيقة
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(180, 142, 60); // الذهبي

  const academyName = "NABTA AGRICULTURAL ACADEMY";
  
  // الحل السحري: هنخلي الـ charSpace صفر للحظة عشان نحسب العرض الحقيقي
  // وبعدين نستخدم الـ Center العادي بتاع jsPDF بدون ترحيل
  pdf.text(academyName, centerX, 48, { 
    align: "center",
    charSpace: 0.5 // مسافة صغيرة جداً لا تؤثر على السنترة لكن تعطي فخامة
  });
  
  // 4. ===== Title =====
  pdf.setTextColor(60, 60, 60);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "normal");
  pdf.text("This official certificate is awarded to", centerX, 65, { align: "center" });

  // 5. ===== Learner Name (The Star) =====
  pdf.setTextColor(5, 46, 22);
  pdf.setFontSize(42);
  setFontForText(pdf, data.learnerName, "bold");
  pdf.text(data.learnerName, centerX, 90, { align: "center" });

  // Decorative Divider under name
  pdf.setDrawColor(180, 142, 60);
  pdf.setLineWidth(0.5);
  pdf.line(centerX - 60, 98, centerX + 60, 98);
  pdf.circle(centerX, 98, 1, "F"); // Center dot

  // 6. ===== Course Completion Text =====
  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("For successfully mastering all requirements of the professional course:", centerX, 115, { align: "center" });

  pdf.setTextColor(180, 142, 60);
  pdf.setFontSize(24);
  setFontForText(pdf, data.courseName, "bold");
  pdf.text(data.courseName, centerX, 130, { align: "center", maxWidth: 200 });

  // 7. ===== Instructor & Seal Section =====
  const bottomY = 165;
  
  // Left: Instructor
  if (data.instructor) {
    pdf.setTextColor(100);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("AUTHORIZED INSTRUCTOR", centerX - 70, bottomY - 5, { align: "center" });
    
    pdf.setTextColor(5, 46, 22);
    pdf.setFontSize(14);
    setFontForText(pdf, data.instructor, "bold");
    pdf.text(data.instructor, centerX - 70, bottomY + 5, { align: "center" });
    
    pdf.setDrawColor(180, 142, 60);
    pdf.line(centerX - 100, bottomY + 8, centerX - 40, bottomY + 8);
  }

  // Right: Date
  const dateStr = new Date(data.issuedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
  pdf.setTextColor(100);
  pdf.setFontSize(9);
  pdf.text("DATE OF ISSUANCE", centerX + 70, bottomY - 5, { align: "center" });
  pdf.setTextColor(5, 46, 22);
  pdf.setFontSize(12);
  pdf.text(dateStr, centerX + 70, bottomY + 5, { align: "center" });
  pdf.line(centerX + 40, bottomY + 8, centerX + 100, bottomY + 8);

  // Center: The Golden Seal
  pdf.setDrawColor(180, 142, 60);
  pdf.setFillColor(180, 142, 60);
  pdf.circle(centerX, bottomY, 15, "S"); // Outer circle
  pdf.circle(centerX, bottomY, 13, "S"); // Inner circle
  pdf.setFont("Amiri", "bold");
  pdf.setFontSize(12);
  pdf.setTextColor(180, 142, 60);
  pdf.text("نبتة", centerX, bottomY + 2, { align: "center" });

  // 8. ===== Verification Footer =====
  const verifyUrl = `nabta.vercel.app/verify/${data.certificateNumber}`;
  pdf.setFontSize(8);
  pdf.setTextColor(150);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Certificate ID: ${data.certificateNumber}  |  Verify at: ${verifyUrl}`, centerX, pageHeight - 15, { align: "center" });

  // Save
  pdf.save(`Nabta_Luxury_Cert_${data.certificateNumber}.pdf`);
};

export const downloadCertificatePDF = generateCertificatePDF;
