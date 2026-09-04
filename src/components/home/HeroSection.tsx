import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Play, Star, Users, X, Send, 
  MessageCircle, CheckCircle, Sparkles, GraduationCap 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg"; 

const specialties = [
  "الزراعة الحديثة",
  "الزراعة المائية",
  "الزراعة العضوية",
  "تنسيق الحدائق",
  "تغذية النباتات",
  "وقاية النبات",
  "إنتاج المحاصيل",
  "الإنتاج الحيواني",
  "إدارة المزارع",
  "التكنولوجيا الزراعية"
];

// إعدادات الأنيميشن المتسلسل
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const HeroDarkSection = () => {
  const { user, profile } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length);
    }, 3500);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const popupClosedTime = localStorage.getItem("agriPopupClosed");
    const waitTime = 1 * 24 * 60 * 60 * 1000; 
    
    let shouldShow = true;
    if (popupClosedTime) {
      const timePassed = new Date().getTime() - parseInt(popupClosedTime, 10);
      if (timePassed < waitTime) shouldShow = false; 
    }

    if (shouldShow) {
      const timer = setTimeout(() => setShowPopup(true), 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("agriPopupClosed", new Date().getTime().toString());
  };

  return (
    <>
      {/* --- النافذة المنبثقة (Premium Popup) --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
              animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
              exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
              onClick={handleClosePopup}
              className="absolute inset-0 bg-black/60 cursor-pointer transition-all"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-[#0a0f0c] border border-emerald-900/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(5,150,105,0.15)] z-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[60px] pointer-events-none rounded-full" />
              
              <button
                onClick={handleClosePopup}
                className="absolute top-4 left-4 p-2.5 text-neutral-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-5 mt-2">
                <div className="relative w-16 h-16 mx-auto">
                  <div className="absolute inset-0 bg-emerald-500/20 rounded-2xl rotate-6 animate-pulse" />
                  <div className="relative flex items-center justify-center w-full h-full bg-[#121c16] border border-emerald-500/30 rounded-2xl shadow-inner">
                    <Sparkles className="w-8 h-8 text-emerald-400" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white tracking-tight mb-2">مجتمع نبته الزراعي</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed mb-6 px-2">
                    ارتقِ بمهاراتك الزراعية! انضم لآلاف الخبراء والمهندسين وتوصل بأحدث الكورسات، النقاشات، والفرص الحصرية.
                  </p>
                </div>

                <div className="space-y-3">
                  <a 
                    href="https://chat.whatsapp.com/Ifb8sOwZiGr4cYcDfvqEIx?mode=hq2tcla" 
                    onClick={handleClosePopup} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full gap-3 py-3.5 px-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 rounded-xl transition-all font-semibold group"
                  >
                    <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    مجتمع الواتساب (VIP)
                  </a>
                  <a 
                    href="https://t.me/NabtaUpdates" 
                    onClick={handleClosePopup} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center justify-center w-full gap-3 py-3.5 px-4 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] border border-[#0088cc]/30 rounded-xl transition-all font-semibold group"
                  >
                    <Send className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    تحديثات التليجرام
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- قسم الهيرو الرئيسي (Hero Section) --- */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#050806] text-white pt-24 pb-16 lg:pt-28 lg:pb-24">
        
        {/* تأثيرات الخلفية (Background Gradients & Grid) */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-[-15%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/15 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-green-900/10 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
            
            {/* المحتوى النصي (يمين) */}
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8 text-center lg:text-right order-2 lg:order-1 flex flex-col items-center lg:items-start"
            >
              
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-emerald-400 text-sm font-medium">المنصة الرائدة في التعليم الزراعي</span>
              </motion.div>

              <motion.h1 variants={itemVariants} className="text-4xl lg:text-5xl xl:text-[3.5rem] font-black leading-[1.3] tracking-tight text-neutral-50">
                <span className="block text-2xl lg:text-3xl font-bold text-neutral-400 mb-2 font-normal">
                  أهلاً بك، {user && profile?.full_name ? <span className="text-white">{profile.full_name.split(' ')[0]}</span> : "يا صديقي"} 👋
                </span>
                احترف مهارات <br />
                <span className="inline-grid [grid-template-areas:'text'] mt-3">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSpecialty}
                      initial={{ y: 30, opacity: 0, filter: "blur(4px)" }}
                      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                      exit={{ y: -30, opacity: 0, filter: "blur(4px)" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="[grid-area:text] text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 via-green-500 to-emerald-300 pb-2"
                    >
                      {specialties[currentSpecialty]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              <motion.p variants={itemVariants} className="text-lg text-neutral-400 max-w-lg leading-relaxed">
                اكتسب المعرفة العملية واحصل على شهادات معتمدة من نخبة الخبراء. انطلق الآن وكن جزءاً من مستقبل الزراعة الذكية والمستدامة.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row w-full sm:w-auto gap-4 pt-2">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white px-8 text-base font-semibold gap-2 transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_30px_rgba(5,150,105,0.5)] hover:-translate-y-0.5 rounded-xl">
                    تصفح الكورسات
                    <ArrowLeft className="w-4 h-4 mr-1" />
                  </Button>
                </Link>
                
                {!user && (
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="group w-full h-14 bg-transparent hover:bg-white/5 text-white border-neutral-700 hover:border-emerald-500/50 px-8 text-base font-bold transition-all duration-300 rounded-xl">
                      <Play className="w-4 h-4 ml-2 text-emerald-500 transition-transform duration-300 group-hover:scale-110" />
                      ابدأ مجاناً
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* الإحصائيات المصغرة */}
              <motion.div variants={itemVariants} className="flex items-center gap-8 pt-8 border-t border-neutral-800/60 w-full max-w-lg justify-center lg:justify-start">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white leading-none">+100</h4>
                    <p className="text-xs text-neutral-500 mt-1">كورس معتمد</p>
                  </div>
                </div>
                <div className="w-px h-10 bg-neutral-800/80"></div>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white leading-none">+5K</h4>
                    <p className="text-xs text-neutral-500 mt-1">متدرب نشط</p>
                  </div>
                </div>
              </motion.div>

            </motion.div>

            {/* الصورة والتأثيرات (يسار) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative order-1 lg:order-2 w-full max-w-lg mx-auto"
            >
              {/* الديكورات الخلفية للصورة */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-600/20 to-transparent blur-2xl rounded-full z-0" />
              
              <div className="relative rounded-[2.5rem] overflow-hidden border border-neutral-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.5)] aspect-[4/3] lg:aspect-[4/4.5] z-10 group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-transparent opacity-80 z-10" />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10 transition-opacity group-hover:opacity-0" />
                <img 
                  src={heroBg} 
                  alt="تعلم الزراعة المتقدمة" 
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* بطاقة التقييم العائمة */}
              <motion.div 
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -right-4 lg:-right-8 bg-[#0a0f0c]/90 border border-neutral-700/50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-4 z-20"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 mb-0.5">تقييم المتدربين</p>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-bold text-white">4.9/5</span>
                    <span className="text-xs text-emerald-400">(2k+ مراجعة)</span>
                  </div>
                </div>
              </motion.div>

              {/* بطاقة الاعتماد العائمة */}
              <motion.div 
                animate={{ y: [8, -8, 8] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-12 -left-4 lg:-left-12 bg-[#0a0f0c]/90 border border-neutral-700/50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3 z-20"
              >
                 <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">محتوى معتمد</p>
                  <p className="text-xs text-neutral-400">من خبراء المجال</p>
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
