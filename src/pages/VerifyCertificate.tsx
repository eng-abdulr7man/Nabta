import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, XCircle, Award, Download, Calendar, User, BookOpen, Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";

const VerifyCertificate = () => {
  const { certificateId } = useParams();

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
    <div className="min-h-screen flex items-center justify-center bg-[#fcfcf9] dark:bg-[#050505] px-4 font-tajawal">
      {/* خلفية هادية جداً */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-white dark:bg-[#0a0a0a] border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-sm">
          
          {/* Header Bar */}
          <div className="h-2 bg-emerald-600 w-full" />
          
          <div className="p-8 lg:p-12">
            {/* Branding */}
            <div className="flex justify-between items-start mb-12">
              <div className="text-right">
                <h1 className="text-2xl font-black text-neutral-900 dark:text-white">توثيق الشهادات</h1>
                <p className="text-neutral-500 text-sm tracking-tight">أكاديمية نبتة التعليمية</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50/50 dark:bg-emerald-500/5 rounded-xl flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
            </div>

            {isLoading ? (
              <div className="py-20 text-center space-y-4">
                <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-neutral-400 text-sm">جاري الاستعلام عن الرقم التسلسلي...</p>
              </div>
            ) : data ? (
              <div className="space-y-10">
                
                {/* Success Indicator */}
                <div className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-500/5 rounded-2xl border border-emerald-100 dark:border-emerald-500/10">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/20">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900 dark:text-emerald-400">مستند رسمي معتمد</h3>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-500/50">تمت مطابقة البيانات بنجاح مع قاعدة بياناتنا</p>
                  </div>
                </div>

                {/* Data Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <DetailItem icon={<User size={16}/>} label="اسم الخريج" value={data.full_name} />
                  <DetailItem icon={<BookOpen size={16}/>} label="الدورة التدريبية" value={data.course_title} />
                  <DetailItem icon={<Fingerprint size={16}/>} label="رقم التوثيق" value={data.certificate_number} isMono />
                  <DetailItem icon={<Calendar size={16}/>} label="تاريخ الإصدار" value={new Date(data.issued_at).toLocaleDateString("ar-EG", {day:'numeric', month:'long', year:'numeric'})} />
                </div>

                {/* Footer Action */}
                <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-6">
                   <div className="text-right">
                      <p className="text-[10px] text-neutral-400 uppercase tracking-widest mb-1 font-bold">Verification Secure Link</p>
                      <p className="text-xs text-neutral-500 font-mono">nabta.vercel.app/verify/{data.certificate_number}</p>
                   </div>
                   <Button 
                    onClick={() => downloadCertificatePDF({
                      learnerName: data.full_name,
                      courseName: data.course_title,
                      certificateNumber: data.certificate_number,
                      issuedAt: data.issued_at,
                      instructor: data.instructor,
                    })}
                    className="bg-neutral-900 dark:bg-white text-white dark:text-black hover:opacity-90 rounded-full px-8 h-12 font-bold transition-all shadow-xl shadow-neutral-900/10"
                   >
                    <Download className="w-4 h-4 ml-2" />
                    تحميل الشهادة
                   </Button>
                </div>

              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-16 h-16 bg-red-50 dark:bg-red-500/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white">الشهادة غير صالحة</h2>
                <p className="text-neutral-500 text-sm mt-2 max-w-[250px] mx-auto">لم يتم العثور على أي سجلات مطابقة لهذا الرقم في منظومتنا.</p>
                <Button variant="link" className="mt-6 text-emerald-600" onClick={() => window.location.href = '/'}>العودة للرئيسية</Button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-8 text-neutral-400 text-[11px] uppercase tracking-[0.2em]">
          &copy; 2026 Nabta Agricultural Academy - Secure Verification System
        </p>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isMono = false }: { icon: any, label: string, value: string, isMono?: boolean }) => (
  <div className="space-y-2 text-right">
    <div className="flex items-center justify-start gap-2 text-neutral-400">
      <span className="opacity-60">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </div>
    <p className={`text-neutral-900 dark:text-neutral-200 font-bold text-base ${isMono ? 'font-mono tracking-tighter' : ''}`}>
      {value}
    </p>
  </div>
);

export default VerifyCertificate;
