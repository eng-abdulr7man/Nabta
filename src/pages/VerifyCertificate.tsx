import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Award, Download } from "lucide-react";
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

      // Fetch profile
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

  const handleDownload = async () => {
    if (!data) return;
    await downloadCertificatePDF({
      learnerName: data.full_name,
      courseName: data.course_title,
      certificateNumber: data.certificate_number,
      issuedAt: data.issued_at,
      instructor: data.instructor,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
        <div className="glass-card p-8 text-center space-y-6">
          <Award className="w-12 h-12 text-primary mx-auto" />
          <h1 className="text-2xl font-black text-foreground">التحقق من الشهادة</h1>

          {isLoading ? (
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          ) : data ? (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <p className="text-primary font-bold">شهادة صالحة ✓</p>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">الاسم: <span className="text-foreground font-bold">{data.full_name}</span></p>
                <p className="text-muted-foreground">الكورس: <span className="text-foreground font-bold">{data.course_title}</span></p>
                <p className="text-muted-foreground">رقم الشهادة: <span className="text-foreground font-bold" dir="ltr">{data.certificate_number}</span></p>
                <p className="text-muted-foreground">تاريخ الإصدار: <span className="text-foreground">{new Date(data.issued_at).toLocaleDateString("ar")}</span></p>
              </div>
              <Button onClick={handleDownload} className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 mt-4">
                <Download className="w-4 h-4" />
                تحميل الشهادة PDF
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-destructive font-bold">شهادة غير صالحة</p>
              <p className="text-sm text-muted-foreground">لم يتم العثور على شهادة بهذا الرقم</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyCertificate;
