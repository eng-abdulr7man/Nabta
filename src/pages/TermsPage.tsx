import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

const TermsPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-24 pb-20 md:pb-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <FileText className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-black text-foreground mb-2">شروط الاستخدام</h1>
            <p className="text-muted-foreground">آخر تحديث: فبراير 2026</p>
          </div>
          <div className="glass-card p-6 space-y-6 text-muted-foreground leading-relaxed text-sm">
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">القبول بالشروط</h2>
              <p>باستخدامك لمنصة AgriSmart Academy فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">حساب المستخدم</h2>
              <p>أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور. يجب ألا يقل عمرك عن 16 عاماً لاستخدام المنصة.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">المحتوى التعليمي</h2>
              <p>جميع المحتويات التعليمية محمية بحقوق الملكية الفكرية. يُمنع نسخ أو توزيع أو بيع أي محتوى من المنصة دون إذن مسبق.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">الشهادات</h2>
              <p>الشهادات الصادرة من المنصة تثبت إتمام الكورس فقط ولا تُعد بديلاً عن الشهادات الأكاديمية الرسمية.</p>
            </section>
            <section>
              <h2 className="text-lg font-bold text-foreground mb-2">إنهاء الحساب</h2>
              <p>يحق لإدارة المنصة تعليق أو إنهاء حسابك في حالة مخالفة هذه الشروط أو أي سلوك غير لائق.</p>
            </section>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default TermsPage;
