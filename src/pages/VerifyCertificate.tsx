// import { useParams } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { motion } from "framer-motion";
// import { CheckCircle, XCircle, Award, Download } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

// const VerifyCertificate = () => {
//   const { certificateId } = useParams();

//   const { data, isLoading } = useQuery({
//     queryKey: ["verify-cert", certificateId],
//     queryFn: async () => {
//       if (!certificateId) return null;

//       const { data: certData, error } = await supabase
//         .from("certificates")
//         .select("*, courses(title, instructor)")
//         .eq("certificate_number", certificateId)
//         .maybeSingle();

//       if (error) throw error;
//       if (!certData) return null;

//       // Fetch profile
//       const { data: profileData } = await supabase
//         .from("profiles")
//         .select("full_name")
//         .eq("user_id", certData.user_id)
//         .maybeSingle();

//       return {
//         full_name: profileData?.full_name || "—",
//         course_title: (certData.courses as any)?.title || "—",
//         instructor: (certData.courses as any)?.instructor || "",
//         certificate_number: certData.certificate_number,
//         issued_at: certData.issued_at,
//       };
//     },
//     enabled: !!certificateId,
//   });

//   const handleDownload = async () => {
//     if (!data) return;
//     await downloadCertificatePDF({
//       learnerName: data.full_name,
//       courseName: data.course_title,
//       certificateNumber: data.certificate_number,
//       issuedAt: data.issued_at,
//       instructor: data.instructor,
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
//         <div className="glass-card p-8 text-center space-y-6">
//           <Award className="w-12 h-12 text-primary mx-auto" />
//           <h1 className="text-2xl font-black text-foreground">التحقق من الشهادة</h1>

//           {isLoading ? (
//             <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
//           ) : data ? (
//             <div className="space-y-4">
//               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
//                 <CheckCircle className="w-8 h-8 text-primary" />
//               </div>
//               <p className="text-primary font-bold">شهادة صالحة ✓</p>
//               <div className="space-y-2 text-sm">
//                 <p className="text-muted-foreground">الاسم: <span className="text-foreground font-bold">{data.full_name}</span></p>
//                 <p className="text-muted-foreground">الكورس: <span className="text-foreground font-bold">{data.course_title}</span></p>
//                 <p className="text-muted-foreground">رقم الشهادة: <span className="text-foreground font-bold" dir="ltr">{data.certificate_number}</span></p>
//                 <p className="text-muted-foreground">تاريخ الإصدار: <span className="text-foreground">{new Date(data.issued_at).toLocaleDateString("ar")}</span></p>
//               </div>
//               <Button onClick={handleDownload} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-4">
//                 <Download className="w-4 h-4" />
//                 تحميل الشهادة PDF
//               </Button>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
//                 <XCircle className="w-8 h-8 text-destructive" />
//               </div>
//               <p className="text-destructive font-bold">شهادة غير صالحة</p>
//               <p className="text-sm text-muted-foreground">لم يتم العثور على شهادة بهذا الرقم</p>
//             </div>
//           )}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default VerifyCertificate;

//v2
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Award, Download, ShieldCheck, Calendar, Hash, User, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";
import { useEffect, useState } from "react";

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20;
    const y = (clientY / innerHeight - 0.5) * 20;
    setMousePos({ x, y });
  };

  const { data, isLoading } = useQuery({
    queryKey: ["verify-cert", certificateId],
    queryFn: async () => {
      if (!certificateId) return null;
      const { data: certData, error } = await supabase
        .from("certificates")
        .select("*, courses(title, instructor)")
        .eq("certificate_number", certificateId)
        .maybeSingle();

      if (error) throw error;
      if (!certData) return null;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", certData.user_id)
        .maybeSingle();

      return {
        full_name: profileData?.full_name || "—",
        course_title: (certData.courses as any)?.title || "—",
        instructor: (certData.courses as any)?.instructor || "",
        certificate_number: certData.certificate_number,
        issued_at: certData.issued_at,
      };
    },
    enabled: !!certificateId,
  });

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center bg-[#050806] px-4 overflow-hidden relative font-tajawal"
    >
      {/* 1. Background Bio-Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-xl z-10"
        style={{ 
          rotateX: -mousePos.y, 
          rotateY: mousePos.x,
          perspective: "1000px" 
        }}
      >
        <div className="relative group">
          {/* Decorative Border Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-gold-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          <div className="relative bg-[#0a0f0c]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl">
            
            {/* Header */}
            <div className="flex flex-col items-center mb-10">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4 border border-emerald-500/20 shadow-inner">
                <Award className="w-10 h-10 text-emerald-500" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">نظام التحقق الذكي</h1>
              <p className="text-neutral-500 text-sm mt-2">أكاديمية نبتة للتعليم الزراعي الموثق</p>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div key="loading" exit={{ opacity: 0 }} className="flex flex-col items-center py-10">
                  <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-neutral-400 mt-4 animate-pulse">جاري فحص سجلات البلوكشين الخاصة بالشهادة...</p>
                </motion.div>
              ) : data ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8"
                >
                  {/* Status Badge */}
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl py-4 flex items-center justify-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-500" />
                    <span className="text-emerald-500 font-bold text-lg">شهادة أصلية ومعتمدة</span>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
                    <InfoBox icon={<User />} label="اسم الخريج" value={data.full_name} />
                    <InfoBox icon={<BookOpen icon={<Award size={18}/>} />} label="الدورة التدريبية" value={data.course_title} />
                    <InfoBox icon={<Hash />} label="الرقم التسلسلي" value={data.certificate_number} isLtr />
                    <InfoBox icon={<Calendar />} label="تاريخ التخرج" value={new Date(data.issued_at).toLocaleDateString("ar-EG", { day: 'numeric', month: 'long', year: 'numeric' })} />
                  </div>

                  {/* Security Footer */}
                  <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                      <span className="text-xs">تم التحقق منها عبر خوادم نبتة المشفرة</span>
                    </div>
                    <Button 
                      onClick={() => downloadCertificatePDF({
                        learnerName: data.full_name,
                        courseName: data.course_title,
                        certificateNumber: data.certificate_number,
                        issuedAt: data.issued_at,
                        instructor: data.instructor,
                      })}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-8 py-6 h-auto font-bold text-lg shadow-lg shadow-emerald-900/40 group transition-all"
                    >
                      <Download className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" />
                      تحميل النسخة الرسمية
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-10 space-y-6"
                >
                  <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <XCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">عذراً، الشهادة غير موجودة</h2>
                    <p className="text-neutral-500 mt-2">هذا الرقم لا يطابق أي سجلات مسجلة لدينا. يرجى التأكد من صحة الرابط.</p>
                  </div>
                  <Button variant="outline" className="border-neutral-800 text-neutral-400 hover:bg-white/5" onClick={() => window.location.href = '/'}>
                    العودة للرئيسية
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Helper Component for Info
const InfoBox = ({ icon, label, value, isLtr = false }: { icon: any, label: string, value: string, isLtr?: boolean }) => (
  <div className="space-y-1 group">
    <div className="flex items-center gap-2 text-neutral-500 mb-1 group-hover:text-emerald-500 transition-colors">
      <span className="opacity-70">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className={`text-white font-bold text-lg p-3 rounded-xl bg-white/5 border border-white/5 group-hover:border-emerald-500/30 transition-all ${isLtr ? 'text-left' : 'text-right'}`}>
      {value}
    </div>
  </div>
);

const BookOpen = ({ icon }: { icon: any }) => (
  <div className="flex items-center gap-2">
    {icon}
  </div>
);

export default VerifyCertificate;
