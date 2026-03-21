import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, Play, Star, ShieldCheck, Users, X, Send, 
  MessageCircle, Sparkles, Flame, GraduationCap, TrendingUp 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg"; 

const specialties = [
  "الزراعة الحديثة", "الزراعة المائية", "الزراعة العضوية",
  "اللاندسكيب", "تغذية النباتات", "وقاية النبات",
  "الإنتاج الحيواني", "تكنولوجيا الري", "الزراعة الذكية"
];

const HeroDarkSection = () => {
  const { user, profile } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(0);
  const [totalStudents, setTotalStudents] = useState("5K+");
  const [isLoaded, setIsLoaded] = useState(false);

  // جلب إحصائيات حقيقية من السكيمه (اختياري لزيادة المصداقية)
  useEffect(() => {
    const fetchStats = async () => {
      const { count } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
      if (count) setTotalStudents(`${(count / 1000).toFixed(1)}K+`);
    };
    fetchStats();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    const popupClosedTime = localStorage.getItem("agriPopupClosed");
    const waitTime = 24 * 60 * 60 * 1000; 
    if (!popupClosedTime || (new Date().getTime() - parseInt(popupClosedTime) > waitTime)) {
      const timer = setTimeout(() => setShowPopup(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("agriPopupClosed", new Date().getTime().toString());
  };

  return (
    <>
      {/* --- Popup Modal --- */}
      <AnimatePresence>
        {showPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleClosePopup} className="absolute inset-0 bg-black/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-md bg-[#0a0f0c] border border-emerald-500/20 rounded-[2.5rem] p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] z-10 overflow-hidden text-center">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-[50px]" />
              <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
                <Sparkles className="w-10 h-10 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">انضم لنخبة المهندسين!</h3>
              <p className="text-neutral-400 text-sm leading-relaxed mb-8">كن أول من يعرف بالكورسات الجديدة والمنح الحصرية عبر مجتمعاتنا الرسمية.</p>
              <div className="grid grid-cols-1 gap-3">
                <a href="https://chat.whatsapp.com/..." target="_blank" rel="noopener" className="flex items-center justify-center gap-3 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-black rounded-2xl transition-all"><MessageCircle className="w-5 h-5" /> مجتمع واتساب</a>
                <a href="https://t.me/..." target="_blank" rel="noopener" className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all"><Send className="w-5 h-5 text-blue-400" /> قناة التليجرام</a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Hero Section --- */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050806] text-white pt-20 lg:pt-0">
        
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 8, repeat: Infinity }} className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-emerald-500/10 blur-[120px] rounded-full" />
          <div className="absolute -bottom-[10%] -left-[10%] w-[40vw] h-[40vw] bg-green-900/10 blur-[100px] rounded-full" />
        </div>

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Content (Right) */}
            <div className="space-y-8 text-center lg:text-right">
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-black text-emerald-100 uppercase tracking-widest">اكاديمية نبتة التعليمية</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight text-white">
                  {user ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-2xl lg:text-3xl text-neutral-400 font-medium">أهلاً بك يا بطل،</span>
                      <span className="text-emerald-400 flex items-center justify-center lg:justify-start gap-3">
                        {profile?.full_name?.split(' ')[0]} <Flame className="w-8 h-8 text-orange-500 animate-pulse" />
                      </span>
                    </div>
                  ) : "مستقبلك يبدأ"}
                  <div className="mt-4">بإتقان <br className="hidden lg:block" />
                    <span className="relative inline-block mt-2">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={currentSpecialty}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-500"
                        >
                          {specialties[currentSpecialty]}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                </h1>
              </motion.div>

              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-lg text-neutral-400 max-w-xl mx-auto lg:ml-0 lg:mr-0 leading-relaxed font-medium">
                {user 
                  ? "سعيدين برؤيتك مرة أخرى! هل أنت مستعد لإكمال رحلتك التعليمية وتطوير مهاراتك الزراعية اليوم؟" 
                  : "انضم لأكبر منصة عربية متخصصة في العلوم الزراعية الحديثة. تعلم من الخبراء، احصل على شهادات، وابدأ مسيرتك المهنية."}
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white px-10 h-16 rounded-2xl text-lg font-black gap-3 shadow-[0_20px_40px_rgba(5,150,105,0.2)] transition-all active:scale-95">
                    {user ? "اكمل تعلمك" : "استكشف الكورسات"}
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                </Link>
                
                {!user && (
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full bg-white/5 hover:bg-white/10 text-white border-white/10 px-10 h-16 rounded-2xl text-lg font-bold backdrop-blur-md transition-all">
                      انضم إلينا مجاناً
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* Stats Bar */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="flex items-center justify-center lg:justify-start gap-10 pt-10 border-t border-white/5 mt-10">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-emerald-500" />
                    <span className="text-2xl font-black">150+</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">ساعة تدريبية</span>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="text-2xl font-black">{totalStudents}</span>
                  </div>
                  <span className="text-xs text-neutral-500 font-bold uppercase tracking-wider">مهندس زراعي</span>
                </div>
              </motion.div>
            </div>

            {/* Visuals (Left) */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="relative">
              {/* Main Image Container */}
              <div className="relative z-10 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl aspect-square max-w-lg mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-t from-[#050806] via-transparent to-transparent z-10 opacity-60" />
                <img src={heroBg} alt="الزراعة الحديثة" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              {/* Floating Cards */}
              <motion.div animate={{ y: [-10, 10, -10] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 -right-6 lg:-right-12 bg-[#121A15]/90 border border-white/10 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl z-20 hidden sm:flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-black uppercase">معدل التوظيف</p>
                  <p className="text-sm font-black text-white">زيادة 40% سنوياً</p>
                </div>
              </motion.div>

              <motion.div animate={{ y: [10, -10, 10] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute bottom-10 -left-6 lg:-left-12 bg-[#121A15]/90 border border-white/10 p-5 rounded-[2rem] shadow-2xl backdrop-blur-xl z-20 hidden sm:flex items-center gap-4">
                <div className="flex -space-x-3 rtl:space-x-reverse">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#121A15] bg-neutral-800" />
                  ))}
                </div>
                <div>
                  <p className="text-[10px] text-neutral-500 font-black uppercase">مجتمعنا</p>
                  <p className="text-sm font-black text-white">طلاب متفاعلون الآن</p>
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
