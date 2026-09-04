import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Star, ShieldCheck, Users, X, Send, MessageCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// قائمة التخصصات التي ستتبدل في العنوان
const specialties = [
  "الإنتاج الحيواني",
  "الإنتاج الداجني",
  "الثروة السمكية",
  "الإنتاج النباتي والمحاصيل",
  "علوم البساتين",
  "وقاية النبات",
  "علوم التربة",
  "الاقتصاد الزراعي",
  "الهندسة الزراعية",
  "تصنيع الأغذية",
  "الألبان وتكنولوجيا تصنيعها",
  "تكنولوجيا الأعلاف",
];

const HeroDarkSection = () => {
  // 1. استدعاء profile عشان نقدر نجيب منه اسم المستخدم
  const { user, profile } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(0);

  // التحكم في تبديل النصوص كل 3 ثوانٍ
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  // التحكم في ظهور النافذة المنبثقة بناءً على الـ Local Storage
  useEffect(() => {
    const popupClosedTime = localStorage.getItem("agriPopupClosed");
    const waitTime = 1 * 24 * 60 * 60 * 1000; // يوم واحد 
    
    let shouldShow = true;

    if (popupClosedTime) {
      const timePassed = new Date().getTime() - parseInt(popupClosedTime, 10);
      if (timePassed < waitTime) {
        shouldShow = false; 
      }
    }

    if (shouldShow) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("agriPopupClosed", new Date().getTime().toString());
  };

  return (
    <>
      {/* --- النافذة المنبثقة (Popup Modal) --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClosePopup}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0e1410] border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden cursor-default"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-[50px] pointer-events-none" />
              <button
                onClick={handleClosePopup}
                className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4 mt-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-inner">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>
                
                <h3 className="text-2xl font-bold text-white tracking-tight">انضم لمجتمعنا الزراعي!</h3>
                <p className="text-neutral-400 text-sm leading-relaxed mb-6">
                  لا تفوت أحدث الكورسات، النصائح الزراعية، والنقاشات المفيدة. انضم لآلاف المهندسين والمهتمين بالمجال الآن مجاناً لمعرفة جميع تحديثات المنصة.
                </p>

                <div className="space-y-3 pt-4">
                  <a 
                    href="https://chat.whatsapp.com/Ifb8sOwZiGr4cYcDfvqEIx?mode=hq2tcla" 
                    onClick={handleClosePopup}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full gap-3 py-3.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl transition-all font-semibold"
                  >
                    <MessageCircle className="w-5 h-5" />
                    جروب الواتساب
                  </a>
                  <a 
                    href="https://t.me/NabtaUpdates" 
                    onClick={handleClosePopup}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full gap-3 py-3.5 px-4 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 rounded-xl transition-all font-semibold"
                  >
                    <Send className="w-5 h-5" />
                    قناة التليجرام
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- قسم الهيرو الرئيسي (Hero Section) --- */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#090D0A] text-white pt-32 pb-20">

        {/* خلفية شبكية خافتة + إضاءات — بديل احترافي عن الصورة */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(140 20% 90%) 1px, transparent 1px), linear-gradient(90deg, hsl(140 20% 90%) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[60vw] h-[45vw] rounded-full bg-emerald-900/25 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-green-900/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-8">

            {/* شارة علوية */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="flex justify-center"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium ios-press">
                <ShieldCheck className="w-4 h-4" />
                المنصة الأولى للتعليم الزراعي المتقدم
              </span>
            </motion.div>

            {/* الترحيب المخصص (Personalized Greeting) */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.35] tracking-tight text-neutral-50"
            >
              أهلاً {user && profile?.full_name ? (
                <span className="text-emerald-400">{profile.full_name.split(' ')[0]}</span>
              ) : (
                "بك"
              )}<br /> جاهز تتعلم<br />

              <span className="inline-grid [grid-template-areas:'text'] mt-2">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentSpecialty}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                    className="[grid-area:text] text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600 pb-2"
                  >
                    {specialties[currentSpecialty]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12, ease: [0.4, 0, 0.2, 1] }}
              className="text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed"
            >
              اكتسب المعرفة العملية والشهادات المعتمدة من خبراء متخصصين. ابدأ الآن وانضم لآلاف المتدربين في مجالات الزراعة الذكية والمستدامة.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link to="/courses" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)]">
                  ابدأ التعلم الآن
                  <ArrowLeft className="w-4 h-4 mr-1" />
                </Button>
              </Link>

              {!user && (
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group w-full sm:w-auto bg-white/5 hover:bg-white text-white hover:text-black border-white/15 hover:border-white px-8 h-14 text-base font-bold"
                  >
                    <Play className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                    انشئ حسابك مجانا
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* شريط ثقة/إحصائيات */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="flex items-center justify-center flex-wrap gap-x-10 gap-y-6 pt-10 mt-4 border-t border-neutral-800/60"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <div className="flex flex-col text-right">
                  <span className="text-xl font-bold text-white leading-none">100+</span>
                  <span className="text-xs text-neutral-500 mt-1">كورس متخصص</span>
                </div>
              </div>
              <div className="w-px h-8 bg-neutral-800 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-emerald-500" />
                <div className="flex flex-col text-right">
                  <span className="text-xl font-bold text-white leading-none">5K+</span>
                  <span className="text-xs text-neutral-500 mt-1">متدرب نشط</span>
                </div>
              </div>
              <div className="w-px h-8 bg-neutral-800 hidden sm:block" />
              <div className="flex items-center gap-2.5">
                <Star className="w-4 h-4 text-emerald-500 fill-current" />
                <div className="flex flex-col text-right">
                  <span className="text-xl font-bold text-white leading-none">4.9/5</span>
                  <span className="text-xs text-neutral-500 mt-1">تقييم المتدربين</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroDarkSection;
