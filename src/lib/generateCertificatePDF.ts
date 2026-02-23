// // import jsPDF from "jspdf";
// // import html2canvas from "html2canvas";

// // export interface CertificateData {
// //   learnerName: string;
// //   courseName: string;
// //   certificateNumber: string;
// //   issuedAt: string;
// //   instructor?: string;
// // }

// // const createCertificateElement = (data: CertificateData): HTMLDivElement => {
// //   const dateAr = new Date(data.issuedAt).toLocaleDateString("ar-EG", {
// //     year: "numeric",
// //     month: "long",
// //     day: "numeric",
// //   });
// //   const dateEn = new Date(data.issuedAt).toLocaleDateString("en-US", {
// //     year: "numeric",
// //     month: "long",
// //     day: "numeric",
// //   });

// //   const el = document.createElement("div");
// //   el.style.cssText = `
// //     position: fixed;
// //     left: -9999px;
// //     top: -9999px;
// //     width: 1122px;
// //     height: 794px;
// //     background: #fff;
// //     font-family: 'Tajawal', 'Arial', sans-serif;
// //     direction: rtl;
// //     overflow: hidden;
// //     display: flex;
// //     z-index: -1;
// //   `;

// //   el.innerHTML = `
// //     <div style="
// //       display: flex;
// //       width: 1122px;
// //       height: 794px;
// //       background: #ffffff;
// //       position: relative;
// //     ">

// //       <!-- Right green sidebar -->
// //       <div style="
// //         width: 300px;
// //         min-width: 300px;
// //         background: linear-gradient(170deg, #1b5e37 0%, #0d3d22 100%);
// //         display: flex;
// //         flex-direction: column;
// //         align-items: center;
// //         justify-content: flex-start;
// //         padding: 50px 28px 40px;
// //         gap: 0;
// //         position: relative;
// //       ">
// //         <!-- Gold top border line -->
// //         <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#c8a84b,#f0d97a,#c8a84b);"></div>
// //         <!-- Gold bottom border line -->
// //         <div style="position:absolute;bottom:0;left:0;right:0;height:4px;background:linear-gradient(90deg,#c8a84b,#f0d97a,#c8a84b);"></div>

// //         <!-- Medal Icon -->
// //         <div style="
// //           width: 110px; height: 110px;
// //           border-radius: 50%;
// //           border: 3px solid rgba(200,168,75,0.6);
// //           background: rgba(255,255,255,0.07);
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           margin-bottom: 30px;
// //           position: relative;
// //         ">
// //           <div style="
// //             position:absolute; inset:7px;
// //             border-radius:50%;
// //             border:1px solid rgba(200,168,75,0.35);
// //           "></div>
// //           <span style="font-size:44px;line-height:1;">🏅</span>
// //         </div>

// //         <!-- Academy seal text -->
// //         <div style="
// //           text-align: center;
// //           margin-bottom: 32px;
// //         ">
// //           <div style="font-size:11px;color:rgba(200,168,75,0.85);letter-spacing:2px;font-weight:700;margin-bottom:4px;">
// //             AGRISMART
// //           </div>
// //           <div style="font-size:9px;color:rgba(255,255,255,0.45);letter-spacing:1px;">
// //             ACADEMY
// //           </div>
// //         </div>

// //         <!-- Divider -->
// //         <div style="width:100%;height:1px;background:rgba(200,168,75,0.2);margin-bottom:28px;"></div>

// //         <!-- Cert Number -->
// //         <div style="text-align:center;margin-bottom:24px;width:100%;">
// //           <div style="font-size:9px;color:rgba(200,168,75,0.7);letter-spacing:1.5px;margin-bottom:6px;font-weight:600;">رقم الشهادة</div>
// //           <div style="font-size:11px;color:#fff;font-weight:700;direction:ltr;word-break:break-all;">${data.certificateNumber}</div>
// //         </div>

// //         <!-- Divider -->
// //         <div style="width:100%;height:1px;background:rgba(200,168,75,0.15);margin-bottom:24px;"></div>

// //         <!-- Date -->
// //         <div style="text-align:center;margin-bottom:24px;width:100%;">
// //           <div style="font-size:9px;color:rgba(200,168,75,0.7);letter-spacing:1.5px;margin-bottom:6px;font-weight:600;">تاريخ الإصدار</div>
// //           <div style="font-size:12px;color:#fff;font-weight:700;">${dateAr}</div>
// //           <div style="font-size:9px;color:rgba(255,255,255,0.4);margin-top:3px;">${dateEn}</div>
// //         </div>

// //         ${data.instructor ? `
// //         <!-- Divider -->
// //         <div style="width:100%;height:1px;background:rgba(200,168,75,0.15);margin-bottom:24px;"></div>
// //         <!-- Instructor -->
// //         <div style="text-align:center;width:100%;">
// //           <div style="font-size:9px;color:rgba(200,168,75,0.7);letter-spacing:1.5px;margin-bottom:6px;font-weight:600;">المدرب</div>
// //           <div style="font-size:12px;color:#fff;font-weight:700;">${data.instructor}</div>
// //         </div>
// //         ` : ""}
// //       </div>

// //       <!-- Main content -->
// //       <div style="
// //         flex: 1;
// //         padding: 56px 60px 44px 50px;
// //         display: flex;
// //         flex-direction: column;
// //         justify-content: space-between;
// //         background: #fff;
// //         position: relative;
// //       ">
// //         <!-- Top decorative corner accent -->
// //         <div style="position:absolute;top:0;right:0;width:120px;height:120px;background:linear-gradient(225deg,rgba(27,94,55,0.06) 0%,transparent 60%);pointer-events:none;"></div>

// //         <!-- Header -->
// //         <div>
// //           <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:28px;">
// //             <div>
// //               <div style="
// //                 font-size:11px;
// //                 font-weight:700;
// //                 color:#1b5e37;
// //                 letter-spacing:3px;
// //                 text-transform:uppercase;
// //                 font-family:'Arial',sans-serif;
// //                 margin-bottom:4px;
// //               ">AGRISMART ACADEMY</div>
// //               <div style="font-size:10px;color:#aaa;letter-spacing:1px;">أكاديمية أجريسمارت للتعلم الزراعي</div>
// //             </div>
// //             <!-- Logo circle -->
// //             <div style="
// //               width:52px;height:52px;
// //               border-radius:50%;
// //               background:linear-gradient(135deg,#1b5e37,#2d8a56);
// //               display:flex;align-items:center;justify-content:center;
// //               color:#fff;
// //               font-weight:700;
// //               font-size:16px;
// //               font-family:'Arial',sans-serif;
// //               letter-spacing:1px;
// //             ">AS</div>
// //           </div>

// //           <!-- Gradient divider -->
// //           <div style="
// //             height: 2.5px;
// //             background: linear-gradient(90deg, #1b5e37 0%, #c8a84b 45%, rgba(200,168,75,0.15) 100%);
// //             border-radius: 2px;
// //             margin-bottom: 34px;
// //           "></div>

// //           <!-- Certificate label -->
// //           <div style="
// //             font-size: 9px;
// //             font-weight: 700;
// //             color: #c8a84b;
// //             letter-spacing: 3px;
// //             font-family:'Arial',sans-serif;
// //             margin-bottom: 6px;
// //           ">CERTIFICATE OF COMPLETION</div>
// //           <div style="font-size:10px;color:#999;margin-bottom:28px;">شهادة إتمام الكورس</div>

// //           <!-- Presented to -->
// //           <div style="font-size:13px;color:#888;margin-bottom:10px;">
// //             تُمنح هذه الشهادة إلى
// //           </div>

// //           <!-- Learner Name -->
// //           <div style="
// //             font-size: 48px;
// //             font-weight: 900;
// //             color: #111;
// //             line-height: 1.1;
// //             margin-bottom: 10px;
// //           ">${data.learnerName}</div>

// //           <!-- Name underline -->
// //           <div style="
// //             height: 3px;
// //             width: 110px;
// //             background: linear-gradient(90deg,#1b5e37,#c8a84b);
// //             border-radius: 2px;
// //             margin-bottom: 22px;
// //           "></div>

// //           <!-- Completing label -->
// //           <div style="font-size:12px;color:#888;margin-bottom:8px;">لإتمامه بنجاح كورس</div>

// //           <!-- Course Name -->
// //           <div style="
// //             font-size: 22px;
// //             font-weight: 800;
// //             color: #1b5e37;
// //             line-height: 1.4;
// //             max-width: 580px;
// //           ">${data.courseName}</div>
// //         </div>

// //         <!-- Footer -->
// //         <div style="
// //           border-top: 1px solid #eee;
// //           padding-top: 16px;
// //           display: flex;
// //           align-items: flex-end;
// //           justify-content: space-between;
// //         ">
// //           <div style="font-size:9px;color:#ccc;letter-spacing:0.5px;">
// //             agrismart.app/verify/${data.certificateNumber}
// //           </div>
// //           <div style="text-align:center;">
// //             <div style="width:70px;height:1px;background:#ddd;margin:0 auto 6px;"></div>
// //             <div style="font-size:8px;color:#bbb;letter-spacing:1.5px;font-family:'Arial',sans-serif;text-transform:uppercase;">Official Certificate</div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   `;

// //   return el;
// // };

// // export const generateCertificatePDF = async (data: CertificateData): Promise<void> => {
// //   const el = createCertificateElement(data);
// //   document.body.appendChild(el);

// //   // Small delay for fonts/layout
// //   await new Promise((r) => setTimeout(r, 300));

// //   try {
// //     const canvas = await html2canvas(el, {
// //       scale: 2,
// //       useCORS: true,
// //       allowTaint: true,
// //       backgroundColor: "#ffffff",
// //       width: 1122,
// //       height: 794,
// //       logging: false,
// //     });

// //     const imgData = canvas.toDataURL("image/jpeg", 0.95);
// //     const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
// //     pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
// //     pdf.save(`certificate-${data.certificateNumber}.pdf`);
// //   } finally {
// //     document.body.removeChild(el);
// //   }
// // };

// // export const downloadCertificatePDF = (data: CertificateData): Promise<void> => {
// //   return generateCertificatePDF(data);
// // };

// // import jsPDF from "jspdf";

// // export interface CertificateData {
// //   learnerName: string;
// //   courseName: string;
// //   certificateNumber: string;
// //   issuedAt: string;
// //   instructor?: string;
// // }

// // export const generateCertificatePDF = async (
// //   data: CertificateData
// // ): Promise<void> => {
// //   const pdf = new jsPDF({
// //     orientation: "landscape",
// //     unit: "mm",
// //     format: "a4",
// //   });

// //   const pageWidth = 297;
// //   const pageHeight = 210;
// //   const centerX = pageWidth / 2;

// //   // ===== Background =====
// //   pdf.setFillColor(255, 255, 255);
// //   pdf.rect(0, 0, pageWidth, pageHeight, "F");

// //   // ===== Green Sidebar =====
// //   pdf.setFillColor(27, 94, 55);
// //   pdf.rect(0, 0, 60, pageHeight, "F");

// //   // Gold Lines
// //   pdf.setFillColor(200, 168, 75);
// //   pdf.rect(0, 0, 60, 2, "F");
// //   pdf.rect(0, pageHeight - 2, 60, 2, "F");

// //   // ===== Academy Text =====
// //   pdf.setFont("helvetica", "bold");
// //   pdf.setTextColor(200, 168, 75);
// //   pdf.setFontSize(14);
// //   pdf.text("MUAGRISMART", 30, 40, { align: "center" });

// //   pdf.setFontSize(10);
// //   pdf.setTextColor(255, 255, 255);
// //   pdf.text("ACADEMY", 30, 47, { align: "center" });

// //   // ===== Certificate Number =====
// //   pdf.setFontSize(9);
// //   pdf.setTextColor(200, 168, 75);
// //   pdf.text("CERT NO.", 30, 80, { align: "center" });

// //   pdf.setFontSize(10);
// //   pdf.setTextColor(255, 255, 255);
// //   pdf.text(data.certificateNumber, 30, 88, { align: "center" });

// //   // ===== Date =====
// //   const date = new Date(data.issuedAt).toLocaleDateString("en-US", {
// //     year: "numeric",
// //     month: "long",
// //     day: "numeric",
// //   });

// //   pdf.setFontSize(9);
// //   pdf.setTextColor(200, 168, 75);
// //   pdf.text("DATE", 30, 110, { align: "center" });

// //   pdf.setFontSize(10);
// //   pdf.setTextColor(255, 255, 255);
// //   pdf.text(date, 30, 118, { align: "center" });

// //   // ===== Main Title =====
// //   pdf.setTextColor(200, 168, 75);
// //   pdf.setFontSize(12);
// //   pdf.text("CERTIFICATE OF COMPLETION", centerX, 40, { align: "center" });

// //   pdf.setTextColor(150);
// //   pdf.setFontSize(10);
// //   pdf.text("This certificate is proudly presented to", centerX, 55, {
// //     align: "center",
// //   });

// //   // ===== Learner Name =====
// //   pdf.setTextColor(0);
// //   pdf.setFontSize(30);
// //   pdf.setFont("helvetica", "bold");
// //   pdf.text(data.learnerName, centerX, 80, { align: "center" });

// //   // Underline
// //   pdf.setDrawColor(27, 94, 55);
// //   pdf.setLineWidth(1);
// //   pdf.line(centerX - 50, 88, centerX + 50, 88);

// //   // ===== Course Name =====
// //   pdf.setFontSize(14);
// //   pdf.setTextColor(120);
// //   pdf.setFont("helvetica", "normal");
// //   pdf.text("For successfully completing the course", centerX, 105, {
// //     align: "center",
// //   });

// //   pdf.setFontSize(18);
// //   pdf.setTextColor(27, 94, 55);
// //   pdf.setFont("helvetica", "bold");
// //   pdf.text(data.courseName, centerX, 120, {
// //     align: "center",
// //     maxWidth: 160,
// //   });

// //   // ===== Instructor (Centered & Cleaner) =====
// //   if (data.instructor) {
// //     pdf.setDrawColor(180);
// //     pdf.setLineWidth(0.5);
// //     pdf.line(centerX - 35, 150, centerX + 35, 150);

// //     pdf.setFontSize(12);
// //     pdf.setTextColor(0);
// //     pdf.setFont("helvetica", "bold");
// //     pdf.text(data.instructor, centerX, 160, { align: "center" });

// //     pdf.setFontSize(9);
// //     pdf.setTextColor(130);
// //     pdf.setFont("helvetica", "normal");
// //     pdf.text("Instructor", centerX, 168, { align: "center" });
// //   }

// //   pdf.save(`certificate-${data.certificateNumber}.pdf`);
// // };

// // export const downloadCertificatePDF = generateCertificatePDF;

// import jsPDF from "jspdf";

// export interface CertificateData {
//   learnerName: string;
//   courseName: string;
//   certificateNumber: string;
//   issuedAt: string;
//   instructor?: string;
// }

// const containsArabic = (text: string): boolean => {
//   const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
//   return arabicPattern.test(text);
// };

// // تحميل خط عربي وتحويله إلى base64
// const loadFont = async (url: string): Promise<string> => {
//   const response = await fetch(url);
//   const buffer = await response.arrayBuffer();
//   const bytes = new Uint8Array(buffer);
//   let binary = "";
//   for (let i = 0; i < bytes.length; i++) {
//     binary += String.fromCharCode(bytes[i]);
//   }
//   return btoa(binary);
// };

// let fontsLoaded = false;
// let amiriRegularBase64 = "";
// let amiriBoldBase64 = "";

// const ensureFontsLoaded = async (pdf: jsPDF) => {
//   if (!fontsLoaded) {
//     amiriRegularBase64 = await loadFont("/fonts/Amiri-Regular.ttf");
//     amiriBoldBase64 = await loadFont("/fonts/Amiri-Bold.ttf");
//     fontsLoaded = true;
//   }

//   pdf.addFileToVFS("Amiri-Regular.ttf", amiriRegularBase64);
//   pdf.addFont("Amiri-Regular.ttf", "Amiri", "normal");
//   pdf.addFileToVFS("Amiri-Bold.ttf", amiriBoldBase64);
//   pdf.addFont("Amiri-Bold.ttf", "Amiri", "bold");
// };

// // تعيين الخط المناسب بناءً على النص
// const setFontForText = (pdf: jsPDF, text: string, style: "normal" | "bold") => {
//   if (containsArabic(text)) {
//     pdf.setFont("Amiri", style);
//   } else {
//     pdf.setFont("helvetica", style);
//   }
// };

// export const generateCertificatePDF = async (
//   data: CertificateData
// ): Promise<void> => {
//   const pdf = new jsPDF({
//     orientation: "landscape",
//     unit: "mm",
//     format: "a4",
//   });

//   // تحميل الخطوط العربية
//   await ensureFontsLoaded(pdf);

//   const pageWidth = 297;
//   const pageHeight = 210;
//   const centerX = pageWidth / 2;

//   // ===== Background =====
//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(0, 0, pageWidth, pageHeight, "F");

//   // ===== Green Sidebar =====
//   pdf.setFillColor(27, 94, 55);
//   pdf.rect(0, 0, 60, pageHeight, "F");

//   // Gold Lines
//   pdf.setFillColor(200, 168, 75);
//   pdf.rect(0, 0, 60, 2, "F");
//   pdf.rect(0, pageHeight - 2, 60, 2, "F");

//   // ===== Academy Text =====
//   pdf.setFont("helvetica", "bold");
//   pdf.setTextColor(200, 168, 75);
//   pdf.setFontSize(14);
//   pdf.text("MUAGRISMART", 30, 40, { align: "center" });

//   pdf.setFontSize(10);
//   pdf.setTextColor(255, 255, 255);
//   pdf.text("ACADEMY", 30, 47, { align: "center" });

//   // ===== Certificate Number =====
//   pdf.setFontSize(9);
//   pdf.setTextColor(200, 168, 75);
//   pdf.text("CERT NO.", 30, 80, { align: "center" });

//   pdf.setFontSize(10);
//   pdf.setTextColor(255, 255, 255);
//   pdf.text(data.certificateNumber, 30, 88, { align: "center" });

//   // ===== Date =====
//   const date = new Date(data.issuedAt).toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   pdf.setFontSize(9);
//   pdf.setTextColor(200, 168, 75);
//   pdf.text("DATE", 30, 110, { align: "center" });

//   pdf.setFontSize(10);
//   pdf.setTextColor(255, 255, 255);
//   pdf.text(date, 30, 118, { align: "center" });

//   // ===== Main Title =====
//   pdf.setTextColor(200, 168, 75);
//   pdf.setFontSize(12);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("CERTIFICATE OF COMPLETION", centerX, 40, { align: "center" });

//   pdf.setTextColor(150);
//   pdf.setFontSize(10);
//   pdf.setFont("helvetica", "normal");
//   pdf.text("This certificate is proudly presented to", centerX, 55, {
//     align: "center",
//   });

//   // ===== Learner Name (مع دعم العربية) =====
//   pdf.setTextColor(0);
//   pdf.setFontSize(30);
//   setFontForText(pdf, data.learnerName, "bold");
//   pdf.text(data.learnerName, centerX, 80, { align: "center" });

//   // Underline
//   pdf.setDrawColor(27, 94, 55);
//   pdf.setLineWidth(1);
//   pdf.line(centerX - 50, 88, centerX + 50, 88);

//   // ===== Course Name (مع دعم العربية) =====
//   pdf.setFontSize(14);
//   pdf.setTextColor(120);
//   pdf.setFont("helvetica", "normal");
//   pdf.text("For successfully completing the course", centerX, 105, {
//     align: "center",
//   });

//   pdf.setFontSize(18);
//   pdf.setTextColor(27, 94, 55);
//   setFontForText(pdf, data.courseName, "bold");
//   pdf.text(data.courseName, centerX, 120, {
//     align: "center",
//     maxWidth: 160,
//   });

//   // ===== Instructor (مع دعم العربية) =====
//   if (data.instructor) {
//     pdf.setDrawColor(180);
//     pdf.setLineWidth(0.5);
//     pdf.line(centerX - 35, 150, centerX + 35, 150);

//     pdf.setFontSize(12);
//     pdf.setTextColor(0);
//     setFontForText(pdf, data.instructor, "bold");
//     pdf.text(data.instructor, centerX, 160, { align: "center" });

//     pdf.setFontSize(9);
//     pdf.setTextColor(130);
//     pdf.setFont("helvetica", "normal");
//     pdf.text("Instructor", centerX, 168, { align: "center" });
//   }

//   // حفظ الملف
//   pdf.save(`certificate-${data.certificateNumber}.pdf`);
// };

// export const downloadCertificatePDF = generateCertificatePDF;


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

// تحميل خط عربي وتحويله إلى base64
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

// تعيين الخط المناسب بناءً على النص
const setFontForText = (pdf: jsPDF, text: string, style: "normal" | "bold") => {
  if (containsArabic(text)) {
    pdf.setFont("Amiri", style);
  } else {
    pdf.setFont("helvetica", style);
  }
};

export const generateCertificatePDF = async (
  data: CertificateData
): Promise<void> => {
  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  // تحميل الخطوط العربية
  await ensureFontsLoaded(pdf);

  const pageWidth = 297;
  const pageHeight = 210;
  const contentStartX = 60;
  const centerX = contentStartX + (pageWidth - contentStartX) / 2;

  // ===== Background =====
  pdf.setFillColor(255, 255, 255);
  pdf.rect(0, 0, pageWidth, pageHeight, "F");

  // ===== Green Sidebar =====
  pdf.setFillColor(27, 94, 55);
  pdf.rect(0, 0, 60, pageHeight, "F");

  // Gold Lines
  pdf.setFillColor(200, 168, 75);
  pdf.rect(0, 0, 60, 2, "F");
  pdf.rect(0, pageHeight - 2, 60, 2, "F");

  // ===== Academy Text =====
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(200, 168, 75);
  pdf.setFontSize(14);
  pdf.text("MUAGRISMART", 30, 40, { align: "center" });

  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text("ACADEMY", 30, 47, { align: "center" });

  // ===== Certificate Number =====
  pdf.setFontSize(9);
  pdf.setTextColor(200, 168, 75);
  pdf.text("CERT NO.", 30, 80, { align: "center" });

  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(data.certificateNumber, 30, 88, { align: "center" });

  // ===== Date =====
  const date = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  pdf.setFontSize(9);
  pdf.setTextColor(200, 168, 75);
  pdf.text("DATE", 30, 110, { align: "center" });

  pdf.setFontSize(10);
  pdf.setTextColor(255, 255, 255);
  pdf.text(date, 30, 118, { align: "center" });

  // ===== Main Title =====
  pdf.setTextColor(200, 168, 75);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("CERTIFICATE OF COMPLETION", centerX, 40, { align: "center" });

  pdf.setTextColor(150);
  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text("This certificate is proudly presented to", centerX, 55, {
    align: "center",
  });

  // ===== Learner Name (مع دعم العربية) =====
  pdf.setTextColor(0);
  pdf.setFontSize(30);
  setFontForText(pdf, data.learnerName, "bold");
  pdf.text(data.learnerName, centerX, 80, { align: "center" });

  // Underline
  pdf.setDrawColor(27, 94, 55);
  pdf.setLineWidth(1);
  pdf.line(centerX - 50, 88, centerX + 50, 88);

  // ===== Course Name (مع دعم العربية) =====
  pdf.setFontSize(14);
  pdf.setTextColor(120);
  pdf.setFont("helvetica", "normal");
  pdf.text("For successfully completing the course", centerX, 105, {
    align: "center",
  });

  pdf.setFontSize(18);
  pdf.setTextColor(27, 94, 55);
  setFontForText(pdf, data.courseName, "bold");
  pdf.text(data.courseName, centerX, 120, {
    align: "center",
    maxWidth: 160,
  });

  // ===== Instructor (مع دعم العربية) =====
  if (data.instructor) {
    // Label above the name
    pdf.setFontSize(8);
    pdf.setTextColor(160);
    pdf.setFont("helvetica", "normal");
    pdf.text("INSTRUCTOR", centerX, 146, { align: "center" });

    // Instructor name
    pdf.setFontSize(14);
    pdf.setTextColor(0);
    setFontForText(pdf, data.instructor, "bold");
    pdf.text(data.instructor, centerX, 156, { align: "center" });

    // Elegant signature line with gold color
    pdf.setDrawColor(200, 168, 75);
    pdf.setLineWidth(0.6);
    pdf.line(centerX - 40, 160, centerX + 40, 160);

    // Small decorative dots at line ends
    pdf.setFillColor(200, 168, 75);
    pdf.circle(centerX - 40, 160, 0.6, "F");
    pdf.circle(centerX + 40, 160, 0.6, "F");
  }

  // ===== Verification Footer =====
  const verificationUrl = `muagrismart.com/verify/${data.certificateNumber}`;
  const footerY = pageHeight - 14;

  // Rounded verification badge background
  pdf.setFillColor(245, 245, 240);
  pdf.roundedRect(centerX - 55, footerY - 5, 110, 12, 2, 2, "F");

  // Border for the badge
  pdf.setDrawColor(200, 168, 75);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(centerX - 55, footerY - 5, 110, 12, 2, 2, "S");

  // Verification text inside badge
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(100);
  pdf.text("VERIFY THIS CERTIFICATE", centerX, footerY, { align: "center" });

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(27, 94, 55);
  pdf.text(verificationUrl, centerX, footerY + 5, { align: "center" });

  // حفظ الملف
  pdf.save(`certificate-${data.certificateNumber}.pdf`);
};

export const downloadCertificatePDF = generateCertificatePDF;


