import { useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Search, MessageCircle, Mail, Phone, 
  User, CreditCard, BookOpen, Award, 
  Send, HelpCircle, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ==========================================
// إعدادات الأنيميشن
// ==========================================
const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ==========================================
// بيانات تصنيفات المساعدة
// ==========================================
const helpCategories = [
  {
    icon: User,
    title: "الحساب الشخصي",
    desc: "إدارة حسابك، تغيير كلمة المرور، وإعدادات الملف الشخصي.",
  },
  {
    icon: CreditCard,
    title: "المدفوعات والفواتير",
    desc: "طرق الدفع المتاحة، مشاكل الدفع، وسياسة استرداد الأموال.",
  },
  {
    icon: BookOpen,
    title: "الكورسات والمحتوى",
    desc: "كيفية الوصول للكورسات، ومشاكل تشغيل الفيديوهات.",
  },
  {
    icon: Award,
    title: "الشهادات والاعتمادات",
    desc: "كيفية استخراج شهادتك بعد إتمام الكورس وتوثيقها.",
  },
];

const SupportPage = () => {
  // لضمان فتح الصفحة من الأعلى دائماً
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#050806] text-white pt-24 pb-16 font-tajawal selection:bg-emerald-500/30">
      
      {/* ======================================= */}
      {/* 1. قسم الهيرو والبحث (Hero & Search) */}
      {/* ======================================= */}
      <section className="relative py-16 lg:py-24 overflow-hidden border-b border-neutral-800/40">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-800/50 border border-neutral-700 text-emerald-400 text-sm font-medium shadow-inner">
              <HelpCircle className="w-4 h-4" />
              مركز المساعدة والدعم
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
              كيف يمكننا <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">مساعدتك اليوم؟</span>
            </h1>
            
            {/* شريط البحث المتقدم */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <Search className="h-6 w-6 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="ابحث عن سؤالك هنا (مثال: كيف أحصل على شهادتي؟)"
                className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl py-5 pr-14 pl-6 text-base text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
              />
              <div className="absolute inset-y-2 left-2 flex items-center">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6 h-full transition-colors">
                  بحث
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 2. تصنيفات المساعدة (Help Topics Grid) */}
      {/* ======================================= */}
      <section className="py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {helpCategories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <motion.div key={index} variants={fadeInUp}>
                  <div className="group bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-8 hover:bg-[#121A15] hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(16,185,129,0.05)] cursor-pointer h-full flex flex-col">
                    <div className="w-14 h-14 rounded-2xl bg-[#121A15] border border-neutral-800 flex items-center justify-center mb-6 group-hover:bg-emerald-900/30 group-hover:border-emerald-500/30 transition-colors">
                      <Icon className="w-7 h-7 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">{cat.title}</h3>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6 flex-1">{cat.desc}</p>
                    <div className="flex items-center text-sm font-bold text-emerald-500 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-auto">
                      تصفح المقالات
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ======================================= */}
      {/* 3. نموذج التواصل السريع (Contact Section) */}
      {/* ======================================= */}
      <section className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative">
            
            {/* إضاءة داخلية للمربع */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              
              {/* معلومات التواصل السريعة (يمين) */}
              <div className="lg:col-span-4 space-y-8">
                <div>
                  <h2 className="text-3xl font-black text-white mb-4">لم تجد إجابتك؟</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    فريق الدعم الفني متواجد دائماً لمساعدتك. اختر الوسيلة الأنسب لك للتواصل معنا وسنقوم بالرد عليك في أقرب وقت.
                  </p>
                </div>

                <div className="space-y-4">
                  <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#121A15] border border-neutral-800 hover:border-[#25D366]/50 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors">
                      <MessageCircle className="w-6 h-6 text-neutral-400 group-hover:text-[#25D366]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">دعم الواتساب</p>
                      <p className="text-xs text-neutral-500">متاح من 9 ص إلى 5 م</p>
                    </div>
                  </a>

                  <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-[#121A15] border border-neutral-800 hover:border-emerald-500/50 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center group-hover:bg-emerald-900/30 transition-colors">
                      <Mail className="w-6 h-6 text-neutral-400 group-hover:text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">البريد الإلكتروني</p>
                      <p className="text-xs text-neutral-500">wwwbgaro59@gmail.com</p>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#121A15] border border-neutral-800">
                    <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center">
                      <Phone className="w-6 h-6 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white mb-1">رقم الهاتف</p>
                      <p className="text-xs text-neutral-500" dir="ltr">01019715490</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* نموذج إرسال رسالة (يسار) */}
              <div className="lg:col-span-8">
                <div className="bg-[#121A15] border border-neutral-800/80 rounded-3xl p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-white mb-6">إرسال رسالة مباشرة</h3>
                  
                  <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">الاسم بالكامل</label>
                        <input 
                          type="text" 
                          placeholder="أدخل اسمك" 
                          className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-[#0a0f0c] transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-neutral-400">البريد الإلكتروني</label>
                        <input 
                          type="email" 
                          placeholder="example@mail.com" 
                          className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-[#0a0f0c] transition-all text-left"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">نوع الاستفسار</label>
                      <select className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-neutral-300 focus:outline-none focus:border-emerald-500/50 focus:bg-[#0a0f0c] transition-all appearance-none cursor-pointer">
                        <option value="">اختر نوع المشكلة...</option>
                        <option value="account">مشكلة في الحساب</option>
                        <option value="payment">استفسار عن الدفع</option>
                        <option value="course">مشكلة تقنية في كورس</option>
                        <option value="other">أخرى</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-neutral-400">تفاصيل الرسالة</label>
                      <textarea 
                        rows={4}
                        placeholder="اشرح مشكلتك بالتفصيل هنا لنتمكن من مساعدتك..." 
                        className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-emerald-500/50 focus:bg-[#0a0f0c] transition-all resize-none"
                      ></textarea>
                    </div>

                    <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-12 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2">
                      إرسال الرسالة
                      <Send className="w-4 h-4 left-2" />
                    </Button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default SupportPage;
