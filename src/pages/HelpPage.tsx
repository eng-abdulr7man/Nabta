import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { LifeBuoy, Mail, MessageCircle, Send, BookOpen, UserCheck, Award } from "lucide-react";
import { Link } from "react-router-dom";

const guides = [
  { icon: UserCheck, title: "التسجيل وتسجيل الدخول", desc: "أنشئ حساباً جديداً أو سجل دخولك بالبريد الإلكتروني." },
  { icon: BookOpen, title: "التسجيل في الكورسات", desc: "تصفح الكورسات المتاحة واضغط 'التحق الآن' للبدء." },
  { icon: Award, title: "الحصول على الشهادة", desc: "أكمل جميع الدروس للحصول على شهادة إتمام رقمية." },
];

const HelpPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-24 pb-20 md:pb-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <LifeBuoy className="w-12 h-12 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-black text-foreground mb-2">مركز المساعدة</h1>
            <p className="text-muted-foreground">كيف يمكننا مساعدتك؟</p>
          </div>

          <div className="space-y-4 mb-8">
            <h2 className="text-lg font-bold text-foreground">دليل الاستخدام</h2>
            {guides.map((g, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <g.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-foreground">{g.title}</h3>
                  <p className="text-xs text-muted-foreground">{g.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="glass-card p-6 text-center space-y-4">
            <h2 className="text-lg font-bold text-foreground">لم تجد إجابتك؟</h2>
            <p className="text-sm text-muted-foreground">تواصل معنا مباشرة وسنرد عليك في أقرب وقت</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/contact">
                <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  تواصل معنا
                </button>
              </Link>
              <Link to="/faq">
                <button className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm font-medium flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  الأسئلة الشائعة
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default HelpPage;
