import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface CertificateData {
  learnerName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: string;
  instructor?: string;
}

const buildCertificateHTML = (data: CertificateData): string => {
  const dateStr = new Date(data.issuedAt).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dateStrEn = new Date(data.issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&family=Cinzel:wght@400;600;700&display=swap" rel="stylesheet"/>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{
    width:1122px;height:794px;
    font-family:'Tajawal',sans-serif;
    background:#fff;
    overflow:hidden;
  }
  .cert{
    width:1122px;height:794px;
    position:relative;
    background:#fff;
    display:flex;
    align-items:stretch;
  }

  /* Right green panel */
  .panel{
    width:320px;
    background:linear-gradient(160deg,#1a5c38 0%,#0f3d25 100%);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:28px;
    padding:40px 30px;
    position:relative;
    flex-shrink:0;
  }
  .panel::after{
    content:'';
    position:absolute;
    left:-1px;top:0;bottom:0;
    width:2px;
    background:linear-gradient(180deg,transparent,#c8a84b,transparent);
  }

  /* Seal */
  .seal{
    width:130px;height:130px;
    border-radius:50%;
    border:3px solid rgba(200,168,75,0.5);
    background:rgba(255,255,255,0.07);
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    gap:4px;
    position:relative;
  }
  .seal::before{
    content:'';
    position:absolute;
    inset:6px;
    border-radius:50%;
    border:1px solid rgba(200,168,75,0.35);
  }
  .seal-icon{
    font-size:42px;line-height:1;
  }
  .seal-label{
    font-family:'Tajawal',sans-serif;
    font-size:11px;
    font-weight:700;
    color:rgba(200,168,75,0.9);
    letter-spacing:2px;
    text-transform:uppercase;
  }
  .seal-sub{
    font-size:9px;
    color:rgba(255,255,255,0.5);
    letter-spacing:1px;
  }

  /* Panel info boxes */
  .info-box{
    width:100%;
    border-top:1px solid rgba(200,168,75,0.2);
    padding-top:16px;
    text-align:center;
  }
  .info-label{
    font-size:10px;
    color:rgba(200,168,75,0.7);
    letter-spacing:1px;
    margin-bottom:5px;
    font-weight:500;
  }
  .info-value{
    font-size:12px;
    color:rgba(255,255,255,0.9);
    font-weight:700;
    line-height:1.5;
    direction:ltr;
  }
  .info-value.rtl{
    direction:rtl;
  }

  /* Main content */
  .main{
    flex:1;
    padding:52px 56px 40px 52px;
    display:flex;
    flex-direction:column;
    justify-content:space-between;
    position:relative;
  }

  /* Top bar */
  .top-bar{
    display:flex;
    align-items:flex-start;
    justify-content:space-between;
    margin-bottom:32px;
  }
  .academy-name{
    font-family:'Cinzel',serif;
    font-size:13px;
    font-weight:700;
    color:#1a5c38;
    letter-spacing:3px;
    text-transform:uppercase;
  }
  .cert-type{
    font-size:10px;
    color:#999;
    letter-spacing:1.5px;
    text-transform:uppercase;
    margin-top:4px;
  }
  .logo-area{
    text-align:left;
  }
  .logo-circle{
    width:56px;height:56px;
    border-radius:50%;
    background:linear-gradient(135deg,#1a5c38,#2d8a56);
    display:flex;align-items:center;justify-content:center;
    font-family:'Cinzel',serif;
    font-weight:700;
    color:#fff;
    font-size:18px;
    letter-spacing:1px;
  }

  /* Divider */
  .divider{
    height:2px;
    background:linear-gradient(90deg,#1a5c38,#c8a84b 40%,#f0e0a0 60%,rgba(200,168,75,0.1));
    margin-bottom:28px;
    border-radius:2px;
  }

  /* Body */
  .cert-body{
    flex:1;
  }
  .presented{
    font-size:13px;
    color:#888;
    font-weight:400;
    margin-bottom:10px;
  }
  .learner-name{
    font-size:46px;
    font-weight:900;
    color:#111;
    line-height:1.1;
    margin-bottom:6px;
    text-align:right;
    direction:rtl;
  }
  .name-underline{
    height:3px;
    width:120px;
    background:linear-gradient(90deg,#1a5c38,#c8a84b);
    margin-bottom:20px;
    border-radius:2px;
    margin-right:0;
    margin-left:auto;
  }
  .completing-text{
    font-size:13px;
    color:#777;
    margin-bottom:8px;
  }
  .course-name{
    font-size:22px;
    font-weight:800;
    color:#1a5c38;
    line-height:1.4;
    margin-bottom:8px;
    direction:rtl;
  }
  .instructor-text{
    font-size:12px;
    color:#aaa;
  }
  .instructor-text span{
    color:#555;
    font-weight:600;
  }

  /* Bottom */
  .cert-bottom{
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    border-top:1px solid #eee;
    padding-top:14px;
  }
  .stamp{
    text-align:center;
  }
  .stamp-line{
    width:80px;height:1px;
    background:#ddd;
    margin:0 auto 6px;
  }
  .stamp-label{
    font-size:9px;
    color:#bbb;
    letter-spacing:1px;
    text-transform:uppercase;
  }
  .verify-url{
    font-size:9px;
    color:#bbb;
    letter-spacing:0.5px;
    text-align:right;
  }
</style>
</head>
<body>
<div class="cert">

  <!-- Right Panel -->
  <div class="panel">
    <div class="seal">
      <div class="seal-icon">🏅</div>
      <div class="seal-label">شهادة</div>
      <div class="seal-sub">CERTIFICATE</div>
    </div>

    <div class="info-box">
      <div class="info-label">رقم الشهادة</div>
      <div class="info-value">${data.certificateNumber}</div>
    </div>

    <div class="info-box">
      <div class="info-label">تاريخ الإصدار</div>
      <div class="info-value rtl">${dateStr}</div>
      <div class="info-value" style="font-size:10px;color:rgba(255,255,255,0.4);margin-top:2px;">${dateStrEn}</div>
    </div>

    ${data.instructor ? `
    <div class="info-box">
      <div class="info-label">المدرب</div>
      <div class="info-value rtl">${data.instructor}</div>
    </div>` : ""}
  </div>

  <!-- Main Content -->
  <div class="main">
    <div>
      <div class="top-bar">
        <div>
          <div class="academy-name">AgriSmart Academy</div>
          <div class="cert-type">أكاديمية أجريسمارت</div>
        </div>
        <div class="logo-area">
          <div class="logo-circle">AS</div>
        </div>
      </div>
      <div class="divider"></div>
    </div>

    <div class="cert-body">
      <div class="presented">تُمنح هذه الشهادة إلى</div>
      <div class="learner-name">${data.learnerName}</div>
      <div class="name-underline"></div>
      <div class="completing-text">لإتمامه بنجاح كورس</div>
      <div class="course-name">${data.courseName}</div>
      ${data.instructor ? `<div class="instructor-text">المدرب: <span>${data.instructor}</span></div>` : ""}
    </div>

    <div class="cert-bottom">
      <div class="verify-url">
        للتحقق: agrismart.app/verify/${data.certificateNumber}
      </div>
      <div class="stamp">
        <div class="stamp-line"></div>
        <div class="stamp-label">Official Certificate</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
};

export const generateCertificatePDF = async (data: CertificateData): Promise<void> => {
  // Create hidden iframe to render HTML
  const iframe = document.createElement("iframe");
  iframe.style.cssText =
    "position:fixed;left:-9999px;top:-9999px;width:1122px;height:794px;border:none;opacity:0;pointer-events:none;";
  document.body.appendChild(iframe);

  await new Promise<void>((resolve) => {
    iframe.onload = () => resolve();
    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(buildCertificateHTML(data));
      doc.close();
    }
  });

  // Wait for fonts to load
  await new Promise((r) => setTimeout(r, 1200));

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  const certEl = iframeDoc?.querySelector(".cert") as HTMLElement;

  if (!certEl) {
    document.body.removeChild(iframe);
    return;
  }

  const canvas = await html2canvas(certEl, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    width: 1122,
    height: 794,
  });

  document.body.removeChild(iframe);

  const imgData = canvas.toDataURL("image/jpeg", 0.97);
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  pdf.addImage(imgData, "JPEG", 0, 0, 297, 210);
  pdf.save(`certificate-${data.certificateNumber}.pdf`);
};

// Sync wrapper kept for backward compat — delegates to async
export const downloadCertificatePDF = (data: CertificateData): void => {
  generateCertificatePDF(data);
};
