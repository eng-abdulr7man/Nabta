import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ShieldCheck, XCircle, Award, Download, Calendar, User, BookOpen, Fingerprint, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCertificatePDF } from "@/lib/generateCertificatePDF";
import { useToast } from "@/hooks/use-toast";

const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const { toast } = useToast();

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://nabta.vercel.app/verify/${data?.certificate_number}`);
    toast({
      title: "تم نسخ الرابط",
      description: "يمكنك الآن مشاركة رابط التوثيق مع من يهمه الأمر.",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050806] px-4 font-tajawal relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="w-full max-w-2xl z-10"
      >
        <div className="bg-[#0a0f0c] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl shadow-black">
          <div className="h-1.5 bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-900 w-full" />
          
          <div className="p-8 lg:p-12">
            <div className="flex justify-between items-center mb-12">
              <div className="text-right">
                <h1 className="text-2xl font-black text-white">توثيق الشهادات</h1>
                <p className="text-emerald-500/60 text-xs font-bold tracking-widest uppercase mt-1">Nabta Smart Verification</p>
              </div>
              <div className="w-14 h-14 bg-emerald-500/5 rounded-2xl flex items-center justify-center border border-emerald-500/10 shadow-inner">
                <Award className="w-7 h-7 text-emerald-500" />
              </div>
            </div>

            {isLoading ? (
              <div className="py-24 text-center">
                <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-neutral-500 text-sm animate-pulse">جاري فحص قاعدة البيانات الرقمية...</p>
              </div>
            ) : data ? (
              <div className="space-y-10">
                <div className="flex items-center gap-5 p-5 bg-white/[0.02] rounded-2xl border border-white/[0.05]">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
                    <ShieldCheck className="w-6 h-6 text-[#050806]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg">مستند رسمي معتمد</h3>
                    <p className="text-sm text-neutral-500">تم التحقق من ملكية الشهادة وصحة البيانات</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  <DetailItem icon={<User size={18}/>} label="اسم الخريج" value={data.full_name} />
                  <DetailItem icon={<BookOpen size={18}/>} label="الدورة التدريبية" value={data.course_title} />
                  <DetailItem icon={<Fingerprint size={18}/>} label="رقم التوثيق" value={data.certificate_number} isMono />
                  <DetailItem icon={<Calendar size={18}/>} label="تاريخ الإصدار" value={new Date(data.issued_at).toLocaleDateString("ar-EG", {day:'numeric', month:'long', year:'numeric'})} />
                </div>

                {/* Action Bar */}
                <div className="pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="group relative w-full lg:w-auto">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/20 to-emerald-900/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    <button 
                      onClick={handleCopyLink}
                      className="relative flex items-center justify-between gap-6 px-5 py-3 bg-[#0d120f] border border-white/5 rounded-2xl hover:border-emerald-500/40 transition-all w-full"
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-[9px] text-emerald-500/50 font-black uppercase tracking-[0.2em] mb-1">Blockchain ID</span>
                        <span className="text-xs font-mono text-neutral-400 group-hover:text-emerald-400 transition-colors">
                          {data.certificate_number.substring(0, 15)}...
                        </span>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center border border-emerald-500/10 group-hover:bg-emerald-500/20 transition-all">
                        <ExternalLink className="w-4 h-4 text-emerald-500" />
                      </div>
                    </button>
                  </div>

                  <Button 
                    onClick={() => downloadCertificatePDF({
                      learnerName: data.full_name,
                      courseName: data.course_title,
                      certificateNumber: data.certificate_number,
                      issuedAt: data.issued_at,
                      instructor: data.instructor,
                    })}
                    className="relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-bold transition-all shadow-2xl shadow-emerald-900/40 group w-full lg:w-auto"
                  >
                    <div className="relative z-10 flex items-center gap-3">
                      <Download className="w-5 h-5 group-hover:animate-bounce" />
                      <span className="text-lg">تحميل الوثيقة الرسمية</span>
                    </div>
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/10 opacity-40 group-hover:animate-shine" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/5 rounded-full flex items-center justify-center mx-auto border border-red-500/10">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">الشهادة غير صالحة</h2>
                  <p className="text-neutral-500 mt-2 max-w-[300px] mx-auto text-sm leading-relaxed">
                    لم يتم العثور على سجلات مطابقة. يرجى التأكد من أنك قمت بنسخ الرابط بشكل صحيح.
                  </p>
                </div>
                <Button variant="ghost" className="text-emerald-500 hover:bg-emerald-500/5" onClick={() => window.location.href = '/'}>العودة للرئيسية</Button>
              </div>
            )}
          </div>
        </div>

        <p className="text-center mt-10 text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-medium">
          &copy; 2026 Nabta Academy &bull; Secure Verification Infrastructure
        </p>
      </motion.div>
    </div>
  );
};

const DetailItem = ({ icon, label, value, isMono = false }: { icon: any, label: string, value: string, isMono?: boolean }) => (
  <div className="space-y-3 text-right group">
    <div className="flex items-center justify-start gap-2.5 text-neutral-500 group-hover:text-emerald-500 transition-colors">
      <span className="opacity-70">{icon}</span>
      <span className="text-[10px] font-black uppercase tracking-[0.15em]">{label}</span>
    </div>
    <p className={`text-neutral-200 font-bold text-lg leading-tight ${isMono ? 'font-mono tracking-tighter text-emerald-500/90' : ''}`}>
      {value}
    </p>
  </div>
);

export default VerifyCertificate;
