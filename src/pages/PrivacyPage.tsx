import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

const PrivacyPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-24 pb-20 md:pb-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <ShieldCheck className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-black text-foreground mb-2">سياسة الخصوصية</h1>
            <p className="text-muted-foreground">آخر تحديث: فبراير 2026</p>
          </div>
          <div className="glass-card p-6 space-y-6 text-muted-foreground leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">جمع المعلومات</h2>
              <p>نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند التسجيل في المنصة، مثل الاسم والبريد الإلكتروني ورقم الهاتف. كما نجمع بيانات الاستخدام تلقائياً لتحسين تجربتك.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">استخدام المعلومات</h2>
              <p>نستخدم معلوماتك لتقديم الخدمات التعليمية، إرسال الشهادات، التواصل معك بخصوص تحديثات المنصة، وتحسين المحتوى التعليمي.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">حماية المعلومات</h2>
              <p>نلتزم بحماية بياناتك الشخصية باستخدام تقنيات التشفير وإجراءات الأمان المتقدمة. لن نشارك معلوماتك مع أطراف ثالثة دون موافقتك.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">حقوقك</h2>
              <p>يحق لك طلب الاطلاع على بياناتك الشخصية أو تعديلها أو حذفها في أي وقت من خلال التواصل مع فريق الدعم.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default PrivacyPage;
