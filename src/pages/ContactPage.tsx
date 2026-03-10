// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Send, MessageCircle, LogIn } from "lucide-react";
// import { useState } from "react";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "react-router-dom";

// const ContactPage = () => {
//   const [type, setType] = useState("inquiry");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//   const { toast } = useToast();

//   const types = [
//     { value: "inquiry", label: "استفسار" },
//     { value: "suggestion", label: "اقتراح" },
//     { value: "complaint", label: "شكوى" },
//     { value: "support", label: "دعم فني" },
//   ];

//   const handleSubmit = async () => {
//     if (!subject.trim() || !message.trim()) {
//       toast({ title: "يرجى ملء جميع الحقول", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     const { error } = await supabase.from("contact_messages").insert({
//       user_id: user!.id,
//       type,
//       subject,
//       message,
//     });
//     setLoading(false);
//     if (error) {
//       toast({ title: "خطأ", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "تم إرسال رسالتك بنجاح" });
//       setSubject("");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-24 pb-20 md:pb-8">
//         <div className="container mx-auto px-4">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-black text-foreground mb-2">تواصل معنا</h1>
//               <p className="text-muted-foreground">نحن هنا لمساعدتك، أرسل لنا رسالتك</p>
//             </div>

//             {!user ? (
//               <div className="glass-card p-8 text-center space-y-4">
//                 <LogIn className="w-12 h-12 text-muted-foreground/30 mx-auto" />
//                 <p className="text-lg text-foreground font-bold">يجب تسجيل الدخول أولاً</p>
//                 <p className="text-sm text-muted-foreground">قم بتسجيل الدخول لإرسال رسالتك</p>
//                 <div className="flex gap-3 justify-center">
//                   <Link to="/login">
//                     <Button className="bg-primary text-primary-foreground">تسجيل الدخول</Button>
//                   </Link>
//                   <Link to="/register">
//                     <Button variant="outline" className="border-border text-foreground">إنشاء حساب</Button>
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               <div className="glass-card p-6 space-y-5">
//                 <div>
//                   <label className="text-sm font-medium text-foreground mb-2 block">نوع الرسالة</label>
//                   <div className="flex flex-wrap gap-2">
//                     {types.map((t) => (
//                       <button
//                         key={t.value}
//                         onClick={() => setType(t.value)}
//                         className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                           type === t.value
//                             ? "bg-primary text-primary-foreground"
//                             : "bg-secondary text-muted-foreground hover:text-foreground"
//                         }`}
//                       >
//                         {t.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-foreground mb-1.5 block">الموضوع</label>
//                   <input
//                     type="text"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     placeholder="عنوان الرسالة"
//                     className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm font-medium text-foreground mb-1.5 block">الرسالة</label>
//                   <textarea
//                     rows={5}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="اكتب رسالتك هنا..."
//                     className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
//                   />
//                 </div>

//                 <Button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="w-full bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
//                   size="lg"
//                 >
//                   <Send className="w-4 h-4" />
//                   {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
//                 </Button>
//               </div>
//             )}

//             <div className="mt-8 flex flex-col sm:flex-row gap-4">
//               <a href="https://wa.me/201019715490" target="_blank" rel="noopener noreferrer" className="flex-1 glass-card p-4 flex items-center gap-3 hover-lift cursor-pointer">
//                 <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
//                   <MessageCircle className="w-5 h-5 text-green-500" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-foreground text-sm">واتساب</p>
//                   <p className="text-xs text-muted-foreground">تواصل مباشر</p>
//                 </div>
//               </a>
//               <a href="https://t.me/eng_abdulr7man" target="_blank" rel="noopener noreferrer" className="flex-1 glass-card p-4 flex items-center gap-3 hover-lift cursor-pointer">
//                 <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
//                   <Send className="w-5 h-5 text-blue-500" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-foreground text-sm">تيليجرام</p>
//                   <p className="text-xs text-muted-foreground">تواصل مباشر</p>
//                 </div>
//               </a>
//             </div>
//           </motion.div>
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default ContactPage;

//v2

// import { useState, useEffect } from "react";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Send, MessageCircle, LogIn, Mail } from "lucide-react";
// import { useAuth } from "@/contexts/AuthContext";
// import { supabase } from "@/integrations/supabase/client";
// import { useToast } from "@/hooks/use-toast";
// import { Link } from "react-router-dom";

// const ContactPage = () => {
//   const [type, setType] = useState("inquiry");
//   const [subject, setSubject] = useState("");
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { user } = useAuth();
//   const { toast } = useToast();

//   // التمرير لأعلى الصفحة عند الفتح
//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const types = [
//     { value: "inquiry", label: "استفسار" },
//     { value: "suggestion", label: "اقتراح" },
//     { value: "complaint", label: "شكوى" },
//     { value: "support", label: "دعم فني" },
//   ];

//   const handleSubmit = async () => {
//     if (!subject.trim() || !message.trim()) {
//       toast({ title: "تنبيه", description: "يرجى ملء جميع الحقول", variant: "destructive" });
//       return;
//     }
//     setLoading(true);
//     const { error } = await supabase.from("contact_messages").insert({
//       user_id: user!.id,
//       type,
//       subject,
//       message,
//     });
//     setLoading(false);
    
//     if (error) {
//       toast({ title: "خطأ", description: error.message, variant: "destructive" });
//     } else {
//       toast({ title: "تم الإرسال", description: "تم استلام رسالتك بنجاح، سنقوم بالرد قريباً." });
//       setSubject("");
//       setMessage("");
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
//       <Navbar />
      
//       <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
//         {/* إضاءات خلفية (Ambient Glows) */}
//         <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
//         <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

//         <div className="container mx-auto px-4 relative z-10">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }} 
//             animate={{ opacity: 1, y: 0 }} 
//             transition={{ duration: 0.5, ease: "easeOut" }}
//             className="max-w-2xl mx-auto"
//           >
            
//             {/* عنوان الصفحة */}
//             <div className="text-center mb-10 space-y-4">
//               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mx-auto">
//                 <Mail className="w-4 h-4" />
//                 تواصل معنا
//               </div>
//               <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
//                 نحن هنا <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">لمساعدتك</span>
//               </h1>
//               <p className="text-neutral-400 text-lg">أرسل لنا رسالتك وسنقوم بالرد عليك في أقرب وقت ممكن</p>
//             </div>

//             {/* التحقق من تسجيل الدخول */}
//             {!user ? (
//               // ==========================================
//               // حالة عدم تسجيل الدخول (Locked State)
//               // ==========================================
//               <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-10 text-center space-y-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
//                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
                
//                 <div className="w-20 h-20 rounded-2xl bg-[#121A15] border border-neutral-800 flex items-center justify-center mx-auto shadow-inner">
//                   <LogIn className="w-10 h-10 text-neutral-500" />
//                 </div>
                
//                 <div>
//                   <p className="text-2xl text-white font-bold mb-2">عذراً، يجب تسجيل الدخول أولاً</p>
//                   <p className="text-sm text-neutral-400 max-w-sm mx-auto">نحن نحتاج إلى معرفة هويتك لنتمكن من متابعة رسالتك والرد عليك بشكل صحيح.</p>
//                 </div>
                
//                 <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
//                   <Link to="/login" className="w-full sm:w-auto">
//                     <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 px-8 font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)]">
//                       تسجيل الدخول
//                     </Button>
//                   </Link>
//                   <Link to="/register" className="w-full sm:w-auto">
//                     <Button variant="outline" className="w-full bg-transparent border-neutral-700 text-neutral-300 hover:bg-[#121A15] hover:text-white h-12 px-8 font-bold rounded-xl transition-all">
//                       إنشاء حساب
//                     </Button>
//                   </Link>
//                 </div>
//               </div>
//             ) : (
//               // ==========================================
//               // نموذج التواصل (Contact Form)
//               // ==========================================
//               <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl space-y-6">
                
//                 {/* نوع الرسالة */}
//                 <div>
//                   <label className="text-sm font-bold text-neutral-300 mb-3 block">نوع الرسالة</label>
//                   <div className="flex flex-wrap gap-3">
//                     {types.map((t) => (
//                       <button
//                         key={t.value}
//                         onClick={() => setType(t.value)}
//                         className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
//                           type === t.value
//                             ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]"
//                             : "bg-[#121A15] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
//                         }`}
//                       >
//                         {t.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>

//                 {/* الموضوع */}
//                 <div>
//                   <label className="text-sm font-bold text-neutral-300 mb-2 block">الموضوع</label>
//                   <input
//                     type="text"
//                     value={subject}
//                     onChange={(e) => setSubject(e.target.value)}
//                     placeholder="مثال: استفسار عن الكورس الأساسي"
//                     className="w-full px-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
//                   />
//                 </div>

//                 {/* الرسالة */}
//                 <div>
//                   <label className="text-sm font-bold text-neutral-300 mb-2 block">الرسالة</label>
//                   <textarea
//                     rows={5}
//                     value={message}
//                     onChange={(e) => setMessage(e.target.value)}
//                     placeholder="اكتب تفاصيل رسالتك هنا..."
//                     className="w-full px-4 py-3.5 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
//                   />
//                 </div>

//                 {/* زر الإرسال */}
//                 <Button
//                   onClick={handleSubmit}
//                   disabled={loading}
//                   className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-base font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 mt-4"
//                 >
//                   {loading ? (
//                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//                   ) : (
//                     <Send className="w-5 h-5 ml-1" />
//                   )}
//                   {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
//                 </Button>
//               </div>
//             )}

//             {/* ========================================== */}
//             {/* طرق التواصل السريعة (Direct Contact Cards) */}
//             {/* ========================================== */}
//             <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
//               {/* كارت واتساب */}
//               <a 
//                 href="https://wa.me/201019715490" 
//                 target="_blank" 
//                 rel="noopener noreferrer" 
//                 className="group bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#121A15] hover:border-[#25D366]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors">
//                   <MessageCircle className="w-6 h-6 text-[#25D366]" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-white text-base mb-0.5">واتساب</p>
//                   <p className="text-xs text-neutral-400">تواصل مباشر وسريع</p>
//                 </div>
//               </a>

//               {/* كارت تيليجرام */}
//               <a 
//                 href="https://t.me/eng_abdulr7man" 
//                 target="_blank" 
//                 rel="noopener noreferrer" 
//                 className="group bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl p-5 flex items-center gap-4 hover:bg-[#121A15] hover:border-[#0088cc]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg"
//               >
//                 <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-[#0088cc]/10 transition-colors">
//                   <Send className="w-6 h-6 text-[#0088cc]" />
//                 </div>
//                 <div>
//                   <p className="font-bold text-white text-base mb-0.5">تيليجرام</p>
//                   <p className="text-xs text-neutral-400">دعم فني واستفسارات</p>
//                 </div>
//               </a>
              
//             </div>

//           </motion.div>
//         </div>
//       </main>
      
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default ContactPage;

//v3

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Send, MessageCircle, LogIn, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const [type, setType] = useState("inquiry");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const types = [
    { value: "inquiry", label: "استفسار" },
    { value: "suggestion", label: "اقتراح" },
    { value: "complaint", label: "شكوى" },
    { value: "support", label: "دعم فني" },
  ];

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({ title: "تنبيه", description: "يرجى ملء جميع الحقول", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert({
      user_id: user!.id,
      type,
      subject,
      message,
    });
    setLoading(false);
    
    if (error) {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "تم الإرسال", description: "تم استلام رسالتك بنجاح، سنقوم بالرد قريباً." });
      setSubject("");
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          {/* التخطيط اللامتماثل (Asymmetrical Layout) */}
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* ======================================= */}
            {/* الجانب الأيمن: لاصق (Sticky Info Side) */}
            {/* ======================================= */}
            <div className="lg:w-[40%] lg:sticky lg:top-32 space-y-8 z-20">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-semibold shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  دعم متواصل 24/7
                </div>
                
                <h1 className="text-4xl md:text-5xl font-black text-white leading-[1.2] tracking-tight">
                  نحن هنا <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600 relative">
                    لمساعدتك دائماً
                    <span className="absolute -bottom-2 right-0 w-1/2 h-1 bg-gradient-to-l from-emerald-500 to-transparent rounded-full" />
                  </span>
                </h1>
                
                <p className="text-lg text-neutral-400 leading-relaxed max-w-sm">
                  سواء كان لديك استفسار، مشكلة تقنية، أو اقتراح لتطوير المنصة، فريقنا مستعد لسماعك والرد عليك بأسرع وقت.
                </p>

                {/* شبكة التواصل المباشر (Bento Grid Style) */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <a href="https://wa.me/201019715490" target="_blank" rel="noopener noreferrer" className="group bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl p-5 hover:bg-[#121A15] hover:border-[#25D366]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-[#25D366]/10 transition-colors">
                      <MessageCircle className="w-5 h-5 text-[#25D366]" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">واتساب</p>
                      <p className="text-xs text-neutral-500 mt-0.5">رد سريع جداً</p>
                    </div>
                  </a>

                  <a href="https://t.me/eng_abdulr7man" target="_blank" rel="noopener noreferrer" className="group bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl p-5 hover:bg-[#121A15] hover:border-[#0088cc]/40 transition-all duration-300 hover:-translate-y-1 shadow-lg flex flex-col items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-[#0088cc]/10 transition-colors">
                      <Send className="w-5 h-5 text-[#0088cc]" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">تيليجرام</p>
                      <p className="text-xs text-neutral-500 mt-0.5">متابعة الدعم الفني</p>
                    </div>
                  </a>

                  <div className="col-span-2 bg-[#0a0f0c] border border-neutral-800/60 rounded-2xl p-5 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center">
                         <Phone className="w-5 h-5 text-emerald-500" />
                       </div>
                       <div>
                         <p className="font-bold text-white text-sm">رقم الهاتف</p>
                         <p className="text-sm text-neutral-400 mt-0.5" dir="ltr">01019715490</p>
                       </div>
                     </div>
                  </div>
                </div>

              </motion.div>
            </div>

            {/* ======================================= */}
            {/* الجانب الأيسر: متحرك (Form Side) */}
            {/* ======================================= */}
            <div className="lg:w-[60%] w-full">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              >
                {!user ? (
                  // --- حالة عدم تسجيل الدخول (Premium Locked State) ---
                  <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-10 md:p-14 text-center space-y-8 shadow-2xl backdrop-blur-xl relative overflow-hidden h-full flex flex-col justify-center min-h-[500px]">
                    {/* إضاءة داخلية */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-emerald-900/10 blur-[100px] pointer-events-none rounded-full" />
                    
                    <div className="w-24 h-24 rounded-3xl bg-[#121A15] border border-neutral-800 flex items-center justify-center mx-auto shadow-inner relative z-10 group">
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <LogIn className="w-10 h-10 text-neutral-400 group-hover:text-emerald-500 transition-colors relative z-10" />
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="text-3xl text-white font-black mb-3">سجل دخولك للتواصل</h3>
                      <p className="text-base text-neutral-400 max-w-sm mx-auto leading-relaxed">
                        نحن بحاجة لمعرفة هويتك لضمان تقديم أفضل مساعدة ممكنة ومتابعة رسالتك بدقة.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2 relative z-10">
                      <Link to="/login" className="w-full sm:w-auto">
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 px-10 text-base font-bold rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all">
                          تسجيل الدخول
                        </Button>
                      </Link>
                      <Link to="/register" className="w-full sm:w-auto">
                        <Button variant="outline" className="w-full bg-transparent border-neutral-700 text-neutral-300 hover:bg-[#121A15] hover:text-white h-14 px-10 text-base font-bold rounded-xl transition-all">
                          إنشاء حساب جديد
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  // --- نموذج إرسال الرسالة (The Form) ---
                  <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-8 md:p-12 shadow-2xl backdrop-blur-xl relative">
                    <h3 className="text-2xl font-bold text-white mb-8 border-b border-neutral-800/50 pb-4">إرسال رسالة مباشرة</h3>
                    
                    <div className="space-y-6">
                      
                      {/* نوع الرسالة (Pills) */}
                      <div>
                        <label className="text-sm font-bold text-neutral-400 mb-3 block">كيف يمكننا مساعدتك؟</label>
                        <div className="flex flex-wrap gap-3">
                          {types.map((t) => (
                            <button
                              key={t.value}
                              onClick={() => setType(t.value)}
                              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                                type === t.value
                                  ? "bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)] scale-105"
                                  : "bg-[#121A15] border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600"
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* الموضوع */}
                      <div>
                        <label className="text-sm font-bold text-neutral-400 mb-2 block">عنوان الرسالة (الموضوع)</label>
                        <input
                          type="text"
                          value={subject}
                          onChange={(e) => setSubject(e.target.value)}
                          placeholder="اكتب عنواناً يختصر طلبك..."
                          className="w-full px-5 py-4 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-base placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all"
                        />
                      </div>

                      {/* الرسالة */}
                      <div>
                        <label className="text-sm font-bold text-neutral-400 mb-2 block">تفاصيل الرسالة</label>
                        <textarea
                          rows={6}
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="اشرح لنا استفسارك أو مشكلتك بالتفصيل هنا..."
                          className="w-full px-5 py-4 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-base placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all resize-none"
                        />
                      </div>

                      {/* زر الإرسال */}
                      <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-14 text-lg font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 mt-4"
                      >
                        {loading ? (
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Send className="w-5 h-5 ml-1" />
                        )}
                        {loading ? "جاري الإرسال..." : "إرسال الرسالة الآن"}
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>

          </div>
        </div>
      </main>
      
      <Footer />
      <BottomNav />
    </div>
  );
};

export default ContactPage;
