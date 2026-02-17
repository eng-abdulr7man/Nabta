import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "كيف أسجل في المنصة؟", a: "اضغط على زر 'إنشاء حساب' في أعلى الصفحة، ثم أدخل بياناتك الشخصية والبريد الإلكتروني وكلمة المرور." },
  { q: "هل الكورسات مجانية؟", a: "نعم، جميع الكورسات المتاحة حالياً على المنصة مجانية بالكامل." },
  { q: "كيف أحصل على شهادة إتمام؟", a: "بعد إكمال جميع دروس الكورس، ستتمكن من تحميل شهادة إتمام رقمية موثقة." },
  { q: "هل يمكنني مشاهدة الدروس أكثر من مرة؟", a: "بالتأكيد، يمكنك إعادة مشاهدة أي درس عدد غير محدود من المرات." },
  { q: "كيف أتواصل مع الدعم الفني؟", a: "يمكنك استخدام صفحة 'تواصل معنا' أو مراسلتنا عبر البريد الإلكتروني info@agrismart.academy." },
  { q: "هل تدعم المنصة الهواتف المحمولة؟", a: "نعم، المنصة مصممة للعمل بشكل ممتاز على جميع الأجهزة بما فيها الهواتف والأجهزة اللوحية." },
];

const FAQPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-24 pb-20 md:pb-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-3" />
          <h1 className="text-3xl font-black text-foreground mb-2">الأسئلة الشائعة</h1>
          <p className="text-muted-foreground">إجابات لأكثر الأسئلة شيوعاً</p>
        </motion.div>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <AccordionItem value={`faq-${i}`} className="glass-card px-4 border-none">
                <AccordionTrigger className="text-foreground font-bold text-sm hover:no-underline">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">{faq.a}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default FAQPage;
