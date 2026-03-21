import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Play, Star, ShieldCheck, Users, X, Send, 
  MessageCircle, Sprout, Sparkles, Trophy 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg"; 

const specialties = [
  "الزراعة الحديثة", "الزراعة المائية", "الزراعة العضوية",
  "تنسيق الحدائق (اللاندسكيب)", "تغذية النباتات", "وقاية النبات",
  "إنتاج المحاصيل", "الإنتاج الحيواني", "تكنولوجيا الري"
];

const HeroDarkSection = () => {
  const { user, profile } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(0);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const popupClosedTime = localStorage.getItem("agriPopupClosed");
    const waitTime = 1 * 24 * 60 * 60 * 1000;
    
    if (!popupClosedTime || (new Date().getTime() - parseInt(popupClosedTime) > waitTime)) {
      const timer = setTimeout(() => setShowPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("agriPopupClosed", new Date().getTime().toString());
  };

  return (
    <>
      {/* --- النافذة المنبثقة (Popup) بتصميم زجاجي عصري --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={handleClosePopup}
              className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-md bg-[#0a0f0c] border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-2xl z-10 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[50px] pointer-events-none" />
              <button onClick={handleClosePopup} className="absolute top-6 left-6 text-neutral-500 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-emerald-500/20">
                  <Sparkles className="w-10 h-10 text-emerald-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white">انضم لعائلة نبتة 🌱</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed px-4">
                    كن أول من يحصل على إشعارات الكورسات المجانية وشهادات التقدير عبر مجتمعاتنا الرسمية.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <a href="https://chat.whatsapp.com/..." target="_blank" className="flex items-center justify-center gap-3 py-4 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-black rounded-2xl transition-all font-black border border-[#25D366]/20">
                    <MessageCircle className="w-5 h-5" /> جروب الواتساب
                  </a>
                  <a href="https://t.me/..." target="_blank" className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all font-bold">
                    <Send className="w-5 h-5 text-blue-400" /> قناة التليجرام
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-[#050806] text-white py-20 lg:py-0">
        
        {/* Background Gradients */}
        <div className="absolute top-[-10%] right-[-5%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-green-900/5 blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Right Content */}
            <div className="space-y-10 text-center lg:text-right order-2 lg:order-1">
              
              {/* 🏆 الحتة اللي روقنا عليها (Custom Badge) */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative inline-flex items-center gap-4 group px-1 pb-2"
              >
                <div className="absolute bottom-0 right-0 h-[2px] w-full bg-gradient-to-l from-emerald-600 via-emerald-400 to-transparent rounded-full shadow-[0_2px_10px_rgba(16,185,129,0.2)]"></div>
                <div className="relative w-10 h-10 rounded-2xl bg-[#0a0f0c] border border-emerald-500/20 flex items-center justify-center shadow-xl group-hover:border-emerald-500/50 transition-all duration-500">
                  <Sprout className="w-6 h-6 text-emerald-500 group-hover:rotate-12 transition-transform" />
                </div>
                <div className="flex flex-col items-start -space-y-1">
                  <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.3em] mb-1">المنصة الأولى</span>
                  <span className="text-sm md:text-lg font-black text-white group-hover:text-emerald-400 transition-colors">للتـعليم الزراعي المتقدم</span>
                </div>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl lg:text-7xl font-black leading-[1.2] tracking-tight text-white"
              >
                أهلاً {user && profile?.full_name ? (
                  <span className="text-emerald-400 inline-flex items-center gap-3">
                    {profile.full_name.split(' ')[0]} <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </span>
                ) : "بك"}
                <br /> جاهز لتطوير خبرتك في<br />
                <span className="inline-grid [grid-template-areas:'text'] mt-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSpecialty}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                      className="[grid-area:text] text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600 pb-2"
                    >
                      {specialties[currentSpecialty]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-xl text-neutral-400 max-w-xl mx-auto lg:mr-0 leading-relaxed font-medium"
              >
                انتقل بمسيرتك المهنية من الهواية إلى الاحتراف مع أقوى المناهج المعتمدة من كبار الاستشاريين في الوطن العربي.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5"
              >
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 h-16 rounded-2xl text-lg font-black gap-3 shadow-[0_20px_40px_rgba(5,150,105,0.2)] transition-all">
                    ابدأ رحلتك الآن
                    <ArrowLeft className="w-5 h-5 mr-1" />
                  </Button>
                </Link>
                {!user && (
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border-white/10 px-10 h-16 rounded-2xl text-lg font-bold backdrop-blur-md transition-all">
                      انضم إلينا مجاناً
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Stats Footer */}
              <div className="flex items-center justify-center lg:justify-start gap-12 pt-10 border-t border-white/5 mt-10 opacity-60">
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">100+</span>
                  <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">كورس متخصص</span>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black text-white">5K+</span>
                  <span className="text-[10px] font-black uppercase text-neutral-500 tracking-widest">متدرب نشط</span>
                </div>
              </div>
            </div>

            {/* Left Visuals */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-[3.5rem] overflow-hidden border border-white/10 shadow-2xl aspect-square group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-transparent z-10 opacity-40" />
                <img src={heroBg} alt="تعلم الزراعة" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>

              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 -left-6 bg-[#0a0f0c] border border-emerald-500/20 p-5 rounded-[2.5rem] shadow-2xl backdrop-blur-xl z-20 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-tight">الأكثر ثقة</p>
                  <p className="text-sm font-black text-white">شهادات معتمدة</p>
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
