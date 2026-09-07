// import { useEffect } from "react";
// import { motion } from "framer-motion";
// import { 
//   Search, MessageCircle, Mail, Phone, 
//   User, CreditCard, BookOpen, Award, 
//   Send, HelpCircle, ChevronLeft
// } from "lucide-react";
// import { Button } from "@/components/ui/button";

// // ==========================================
// // إعدادات الأنيميشن
// // ==========================================
// const staggerContainer = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: { staggerChildren: 0.1 },
//   },
// };

// const fadeInUp = {
//   hidden: { opacity: 0, y: 30 },
//   show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
// };

// // ==========================================
// // بيانات تصنيفات المساعدة
// // ==========================================
// const helpCategories = [
//   {
//     icon: User,
//     title: "الحساب الشخصي",
//     desc: "إدارة حسابك، تغيير كلمة المرور، وإعدادات الملف الشخصي.",
//   },
//   {
//     icon: CreditCard,
//     title: "المدفوعات والفواتير",
//     desc: "طرق الدفع المتاحة، مشاكل الدفع، وسياسة استرداد الأموال.",
//   },
//   {
//     icon: BookOpen,
//     title: "الكورسات والمحتوى",
//     desc: "كيفية الوصول للكورسات، ومشاكل تشغيل الفيديوهات.",
//   },
//   {
//     icon: Award,
//     title: "الشهادات والاعتمادات",
//     desc: "كيفية استخراج شهادتك بعد إتمام الكورس وتوثيقها.",
//   },
// ];

// const SupportPage = () => {
//   // لضمان فتح الصفحة من الأعلى دائماً
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="min-h-screen bg-background text-foreground pt-24 pb-16 font-tajawal selection:bg-accent">
      
//       {/* ======================================= */}
//       {/* 1. قسم الهيرو والبحث (Hero & Search) */}
//       {/* ======================================= */}
//       <section className="relative py-16 lg:py-24 overflow-hidden border-b border-border">
//         <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[60vw] h-[60vw] rounded-full bg-accent blur-[150px] pointer-events-none" />
        
//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="max-w-3xl mx-auto text-center space-y-8"
//           >
//             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-primary text-sm font-medium shadow-inner">
//               <HelpCircle className="w-4 h-4" />
//               مركز المساعدة والدعم
//             </div>
            
//             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
//               كيف يمكننا <span className="text-transparent bg-clip-text text-primary">مساعدتك اليوم؟</span>
//             </h1>
            
//             {/* شريط البحث المتقدم */}
//             <div className="relative max-w-2xl mx-auto group">
//               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
//                 <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="ابحث عن سؤالك هنا (مثال: كيف أحصل على شهادتي؟)"
//                 className="w-full bg-muted border border-border rounded-2xl py-5 pr-14 pl-6 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
//               />
//               <div className="absolute inset-y-2 left-2 flex items-center">
//                 <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-full transition-colors">
//                   بحث
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* ======================================= */}
//       {/* 2. تصنيفات المساعدة (Help Topics Grid) */}
//       {/* ======================================= */}
//       <section className="py-20">
//         <div className="container mx-auto px-4 lg:px-8">
//           <motion.div 
//             variants={staggerContainer}
//             initial="hidden"
//             whileInView="show"
//             viewport={{ once: true, margin: "-50px" }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           >
//             {helpCategories.map((cat, index) => {
//               const Icon = cat.icon;
//               return (
//                 <motion.div key={index} variants={fadeInUp}>
//                   <div className="group bg-muted border border-border rounded-3xl p-8 hover:bg-muted hover:border-primary/20 transition-all duration-300 cursor-pointer h-full flex flex-col">
//                     <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-primary/20 transition-colors">
//                       <Icon className="w-7 h-7 text-primary" />
//                     </div>
//                     <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.title}</h3>
//                     <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{cat.desc}</p>
//                     <div className="flex items-center text-sm font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-auto">
//                       تصفح المقالات
//                       <ChevronLeft className="w-4 h-4 mr-1" />
//                     </div>
//                   </div>
//                 </motion.div>
//               );
//             })}
//           </motion.div>
//         </div>
//       </section>

//       {/* ======================================= */}
//       {/* 3. نموذج التواصل السريع (Contact Section) */}
//       {/* ======================================= */}
//       <section className="py-12">
//         <div className="container mx-auto px-4 lg:px-8">
//           <div className="bg-muted border border-border rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative">
            
//             {/* إضاءة داخلية للمربع */}
//             <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-accent blur-[120px] pointer-events-none" />
            
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
              
//               {/* معلومات التواصل السريعة (يمين) */}
//               <div className="lg:col-span-4 space-y-8">
//                 <div>
//                   <h2 className="text-3xl font-black text-foreground mb-4">لم تجد إجابتك؟</h2>
//                   <p className="text-muted-foreground text-sm leading-relaxed">
//                     فريق الدعم الفني متواجد دائماً لمساعدتك. اختر الوسيلة الأنسب لك للتواصل معنا وسنقوم بالرد عليك في أقرب وقت.
//                   </p>
//                 </div>

//                 <div className="space-y-4">
//                   <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border hover:border-[#25D366]/50 transition-all group">
//                     <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors">
//                       <MessageCircle className="w-6 h-6 text-muted-foreground group-hover:text-[#25D366]" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-foreground mb-1">دعم الواتساب</p>
//                       <p className="text-xs text-muted-foreground">متاح من 9 ص إلى 5 م</p>
//                     </div>
//                   </a>

//                   <a href="#" className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border hover:border-primary/20 transition-all group">
//                     <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
//                       <Mail className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-foreground mb-1">البريد الإلكتروني</p>
//                       <p className="text-xs text-muted-foreground">wwwbgaro59@gmail.com</p>
//                     </div>
//                   </a>

//                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
//                     <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
//                       <Phone className="w-6 h-6 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <p className="text-sm font-bold text-foreground mb-1">رقم الهاتف</p>
//                       <p className="text-xs text-muted-foreground" dir="ltr">01019715490</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* نموذج إرسال رسالة (يسار) */}
//               <div className="lg:col-span-8">
//                 <div className="bg-muted border border-border rounded-3xl p-6 md:p-8">
//                   <h3 className="text-2xl font-bold text-foreground mb-6">إرسال رسالة مباشرة</h3>
                  
//                   <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-muted-foreground">الاسم بالكامل</label>
//                         <input 
//                           type="text" 
//                           placeholder="أدخل اسمك" 
//                           className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all"
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
//                         <input 
//                           type="email" 
//                           placeholder="example@mail.com" 
//                           className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all text-left"
//                           dir="ltr"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-muted-foreground">نوع الاستفسار</label>
//                       <select className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all appearance-none cursor-pointer">
//                         <option value="">اختر نوع المشكلة...</option>
//                         <option value="account">مشكلة في الحساب</option>
//                         <option value="payment">استفسار عن الدفع</option>
//                         <option value="course">مشكلة تقنية في كورس</option>
//                         <option value="other">أخرى</option>
//                       </select>
//                     </div>

//                     <div className="space-y-2">
//                       <label className="text-sm font-medium text-muted-foreground">تفاصيل الرسالة</label>
//                       <textarea 
//                         rows={4}
//                         placeholder="اشرح مشكلتك بالتفصيل هنا لنتمكن من مساعدتك..." 
//                         className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all resize-none"
//                       ></textarea>
//                     </div>

//                     <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-bold rounded-xl transition-all  hover: flex items-center justify-center gap-2">
//                       إرسال الرسالة
//                       <Send className="w-4 h-4 left-2" />
//                     </Button>
//                   </form>
//                 </div>
//               </div>

//             </div>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// };

// export default SupportPage;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // تم إضافة هذا الاستيراد للربط
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { 
  Search, MessageCircle, Mail, Phone, 
  User, CreditCard, BookOpen, Award, 
  Send, HelpCircle, ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
// بيانات تصنيفات المساعدة (تم إضافة id للربط)
// ==========================================
const helpCategories = [
  {
    id: "account",
    icon: User,
    title: "الحساب الشخصي",
    desc: "إدارة حسابك، تغيير كلمة المرور، وإعدادات الملف الشخصي.",
  },
  {
    id: "payment",
    icon: CreditCard,
    title: "المدفوعات والفواتير",
    desc: "طرق الدفع المتاحة، مشاكل الدفع، وسياسة استرداد الأموال.",
  },
  {
    id: "course",
    icon: BookOpen,
    title: "الكورسات والمحتوى",
    desc: "كيفية الوصول للكورسات، ومشاكل تشغيل الفيديوهات.",
  },
  {
    id: "certificate",
    icon: Award,
    title: "الشهادات والاعتمادات",
    desc: "كيفية استخراج شهادتك بعد إتمام الكورس وتوثيقها.",
  },
];

const SupportPage = () => {
  const navigate = useNavigate(); // لتوجيه المستخدم لصفحة المقالات
  const [supportSearchQuery, setSupportSearchQuery] = useState(""); // لحفظ نص البحث

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const { toast } = useToast();

  // لضمان فتح الصفحة من الأعلى دائماً
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !type || !message.trim()) {
      toast({ title: "تنبيه", description: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }
    
    setLoading(true);
    
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user?.id || null,
      type,
      subject: `رسالة دعم من: ${name}`,
      message: `البريد الإلكتروني للرد: ${email}\n\nنص الرسالة:\n${message}`,
    });
    
    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الإرسال", description: "تم استلام رسالتك بنجاح، سنقوم بالرد قريباً." });
      setName("");
      setEmail("");
      setType("");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-tajawal selection:bg-accent">
      
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        {/* ======================================= */}
        {/* 1. قسم الهيرو والبحث (Hero & Search) */}
        {/* ======================================= */}
        <section className="relative py-16 lg:py-24 overflow-hidden border-b border-border">

          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border text-primary text-sm font-medium shadow-inner">
                <HelpCircle className="w-4 h-4" />
                مركز المساعدة والدعم
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-tight">
                كيف يمكننا <span className="text-transparent bg-clip-text text-primary">مساعدتك اليوم؟</span>
              </h1>
              
              {/* شريط البحث المتقدم (تم تحويله لـ Form للربط) */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (supportSearchQuery.trim()) {
                    navigate(`/articles?q=${encodeURIComponent(supportSearchQuery)}`);
                  } else {
                    navigate(`/articles`); // لو ضغط بحث وهو فاضي يدخله على كل المقالات
                  }
                }}
                className="relative max-w-2xl mx-auto group"
              >
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                  <Search className="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  value={supportSearchQuery}
                  onChange={(e) => setSupportSearchQuery(e.target.value)}
                  placeholder="ابحث عن سؤالك هنا (مثال: كيف أحصل على شهادتي؟)"
                  className="w-full bg-muted border border-border rounded-2xl py-5 pr-14 pl-6 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/20 focus:ring-1 focus:ring-primary transition-all shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute inset-y-2 left-2 flex items-center">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-full transition-colors">
                    بحث
                  </Button>
                </div>
              </form>
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
                    {/* تم إضافة دالة onClick للذهاب للمقالات حسب التصنيف المختار */}
                    <div 
                      onClick={() => navigate(`/articles?category=${cat.id}`)}
                      className="group bg-muted border border-border rounded-3xl p-8 hover:bg-muted hover:border-primary/20 transition-all duration-300 cursor-pointer h-full flex flex-col"
                    >
                      <div className="w-14 h-14 rounded-2xl bg-muted border border-border flex items-center justify-center mb-6 group-hover:bg-accent group-hover:border-primary/20 transition-colors">
                        <Icon className="w-7 h-7 text-primary" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{cat.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{cat.desc}</p>
                      <div className="flex items-center text-sm font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 mt-auto">
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
            <div className="bg-muted border border-border rounded-[2.5rem] p-8 lg:p-12 overflow-hidden relative">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
                
                {/* معلومات التواصل السريعة */}
                <div className="lg:col-span-4 space-y-8">
                  <div>
                    <h2 className="text-3xl font-black text-foreground mb-4">لم تجد إجابتك؟</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      فريق الدعم الفني متواجد دائماً لمساعدتك. اختر الوسيلة الأنسب لك للتواصل معنا وسنقوم بالرد عليك في أقرب وقت.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <a href="https://wa.me/201019715490" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border hover:border-[#25D366]/50 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors">
                        <MessageCircle className="w-6 h-6 text-muted-foreground group-hover:text-[#25D366]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-1">دعم الواتساب</p>
                        <p className="text-xs text-muted-foreground">متاح من 9 ص إلى 5 م</p>
                      </div>
                    </a>

                    <a href="mailto:wwwbgaro59@gmail.com" className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border hover:border-primary/20 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-accent transition-colors">
                        <Mail className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-1">البريد الإلكتروني</p>
                        <p className="text-xs text-muted-foreground">wwwbgaro59@gmail.com</p>
                      </div>
                    </a>

                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted border border-border">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                        <Phone className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground mb-1">رقم الهاتف</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">01019715490</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* نموذج إرسال رسالة */}
                <div className="lg:col-span-8">
                  <div className="bg-muted border border-border rounded-3xl p-6 md:p-8">
                    <h3 className="text-2xl font-bold text-foreground mb-6">إرسال رسالة مباشرة</h3>
                    
                    <form className="space-y-5" onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">الاسم بالكامل</label>
                          <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="أدخل اسمك" 
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-muted-foreground">البريد الإلكتروني</label>
                          <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="example@mail.com" 
                            className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all text-left"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">نوع الاستفسار</label>
                        <select 
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all appearance-none cursor-pointer"
                        >
                          <option value="">اختر نوع المشكلة...</option>
                          <option value="account">مشكلة في الحساب</option>
                          <option value="payment">استفسار عن الدفع</option>
                          <option value="course">مشكلة تقنية في كورس</option>
                          <option value="support">دعم فني عام</option>
                          <option value="other">أخرى</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">تفاصيل الرسالة</label>
                        <textarea 
                          rows={4}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="اشرح مشكلتك بالتفصيل هنا لنتمكن من مساعدتك..." 
                          className="w-full bg-muted border border-border rounded-xl px-4 py-3.5 text-sm text-foreground focus:outline-none focus:border-primary/20 focus:bg-muted transition-all resize-none"
                        ></textarea>
                      </div>

                      <Button 
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 text-base font-bold rounded-xl transition-all  hover: flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <>
                            إرسال الرسالة
                            <Send className="w-4 h-4 left-2" />
                          </>
                        )}
                      </Button>
                    </form>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default SupportPage;
