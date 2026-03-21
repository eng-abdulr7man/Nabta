import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, Star, ShieldCheck, Users, X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg"; 

// قائمة التخصصات التي ستتبدل في العنوان
const specialties = [
  "الزراعة الحديثة",
  "الزراعة المائية",
  "الزراعة العضوية",
  "تنسيق الحدائق (اللاندسكيب)",
  "تغذية النباتات",
  "وقاية النبات",
  "إنتاج المحاصيل",
  "الإنتاج الحيواني",
  "الإنتاج الداجني",
  "علوم التربة",
  "الهندسة الزراعية",
  "البيوت المحمية",
  "إدارة المزارع",
  "الري والصرف",
  "التكنولوجيا الزراعية"
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
    const waitTime = 1 * 24 * 60 * 60 * 1000; // يوم واحد (أو 3 أيام حسب رغبتك)
    
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
                  لا تفوت أحدث الكورسات، النصائح الزراعية، والنقاشات المفيدة. انضم لآلاف المهندسين والمهتمين بالمجال الآن مجاناً لمعرفة جميع تحديثات المنصه.
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
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#090D0A] text-white py-16 lg:py-0">
        
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-green-900/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* النص والمحتوى (يمين) */}
            <div className="space-y-8 text-center lg:text-right order-2 lg:order-1">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  المنصة الأولى للتعليم الزراعي المتقدم
                </span>
              </motion.div>

              {/* ============================================== */}
              {/* 2. الترحيب المخصص (Personalized Greeting) */}
              {/* ============================================== */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl lg:text-5xl xl:text-6xl font-black leading-[1.4] tracking-tight text-neutral-50"
              >
                أهلاً {user && profile?.full_name ? (
                  <span className="text-emerald-400">{profile.full_name.split(' ')[0]}</span>
                ) : (
                  "بك"
                )}<br /> جاهز تتعلم<br />
                
                {/* الحاوية الجديدة باستخدام Grid لمنع قص النص */}
                <span className="inline-grid [grid-template-areas:'text'] mt-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSpecialty}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="[grid-area:text] text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600 pb-2"
                    >
                      {specialties[currentSpecialty]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                اكتسب المعرفة العملية والشهادات المعتمدة من خبراء متخصصين. ابدأ الآن وانضم لآلاف المتدربين في مجالات الزراعة الذكية والمستدامة.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link to="/courses">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)]">
                    ابدأ التعلم الآن
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
                
                {!user && (
                  <Link to="/register">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="group w-full sm:w-auto bg-white hover:bg-emerald-600 text-black hover:text-white border-transparent hover:border-emerald-500 px-8 h-14 text-base font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                    >
                      <Play className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                      انشئ حسابك مجانا
                    </Button>
                  </Link>
                )}
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-8 pt-6 border-t border-neutral-800/50 mt-8"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">100+</span>
                  <span className="text-sm text-neutral-500">كورس متخصص</span>
                </div>
                <div className="w-px h-8 bg-neutral-800"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold text-white">5K+</span>
                  <span className="text-sm text-neutral-500">متدرب نشط</span>
                </div>
              </motion.div>
            </div>

            {/* الصورة والتأثيرات (يسار) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl aspect-[4/3] lg:aspect-square max-w-md mx-auto z-10">
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10"></div>
                <img 
                  src={heroBg} 
                  alt="تعلم الزراعة" 
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -right-6 lg:-right-10 bg-[#121A15] border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-20"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center text-emerald-400">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">تقييم المتدربين</p>
                  <p className="text-sm font-bold text-white">4.9/5 متوسط</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 -left-6 lg:-left-10 bg-[#121A15] border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-20"
              >
                 <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center text-blue-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">مجتمع زراعي</p>
                  <p className="text-sm font-bold text-white">+5,000 مهندس</p>
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
};

export default HeroDarkSection;

عاوز اغير ديزاين المنصة الأولى للتعليم الزراعي المتقدم الحته دي
