import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom"; // أضفنا useNavigate هنا
import {
  ArrowLeft,
  Play,
  Star,
  Users,
  X,
  Send,
  MessageCircle,
  Search,
  Award,
  BadgeCheck,
  TrendingUp,
  BookOpen,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

// قائمة التخصصات التي ستتبدل في العنوان
const specialties = [
  "الزراعة الحديثة",
  "الزراعة المائية",
  "الزراعة العضوية",
  "تنسيق الحدائق",
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
  "التكنولوجيا الزراعية",
];

// مميزات الثقة أسفل الهيرو
const trustBadges = [
  { icon: BadgeCheck, label: "شهادات معتمدة" },
  { icon: Award, label: "خبراء معتمدون" },
  { icon: TrendingUp, label: "محتوى عملي 100%" },
  { icon: BookOpen, label: "تعلم ذاتي مرن" },
];

// نقاط التقييم
const ratingPoints = [
  "محتوى عملي وحديث",
  "مدربون متخصصون",
  "متابعة ودعم مستمر",
];

const HeroDarkSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate(); // تهيئة useNavigate للانتقال السريع
  const [showPopup, setShowPopup] = useState(false);
  const [currentSpecialty, setCurrentSpecialty] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  // التحكم في تبديل النصوص كل 3 ثوانٍ
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCurrentSpecialty((prev) => (prev + 1) % specialties.length);
    }, 3000);
    return () => clearInterval(textInterval);
  }, []);

  // ظهور النافذة المنبثقة (مرة كل 24 ساعة)
  useEffect(() => {
    const popupClosedTime = localStorage.getItem("agriPopupClosed");
    const waitTime = 24 * 60 * 60 * 1000;
    let shouldShow = true;

    if (popupClosedTime) {
      const timePassed = Date.now() - parseInt(popupClosedTime, 10);
      if (timePassed < waitTime) shouldShow = false;
    }

    if (shouldShow) {
      const timer = setTimeout(() => setShowPopup(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    localStorage.setItem("agriPopupClosed", Date.now().toString());
  };

  const firstName = user && profile?.full_name ? profile.full_name.split(" ")[0] : null;

  return (
    <>
      {/* ================= النافذة المنبثقة (Popup) ================= */}
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
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-4 mt-2">
                <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20 shadow-inner">
                  <Users className="w-8 h-8 text-emerald-400" />
                </div>

                <h3 className="text-2xl font-bold text-white tracking-tight">
                  انضم لمجتمعنا الزراعي!
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">
                  لا تفوّت أحدث الكورسات، النصائح الزراعية، والنقاشات المفيدة.
                  انضم لآلاف المهندسين والمهتمين بالمجال مجاناً.
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

      {/* ================= شريط إعلانات علوي (Announcement Bar) ================= */}
      <div className="bg-gradient-to-l from-emerald-600 to-emerald-700 text-white text-center py-2.5 px-4 text-sm font-medium relative z-10">
        <span className="inline-flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          خصم يصل إلى 40% على جميع الكورسات لفترة محدودة
          <Link
            to="/courses"
            className="underline underline-offset-4 font-bold hover:text-emerald-100 transition-colors"
          >
            اكتشف العروض
          </Link>
        </span>
      </div>

      {/* ================= قسم الهيرو الرئيسي ================= */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#090D0A] text-white pt-16 pb-20 lg:pt-20">
        {/* خلفيات متدرجة */}
        <div className="absolute top-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-emerald-900/25 blur-[130px] pointer-events-none" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-green-900/15 blur-[110px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-10 items-center">

            {/* ===== النص والمحتوى (يمين) ===== */}
            <div className="space-y-7 text-center lg:text-right order-2 lg:order-1">

              {/* شارة الثقة */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-sm font-medium">
                  <BadgeCheck className="w-4 h-4" />
                  المنصة العربية الأولى للتعليم الزراعي المتقدم
                </span>
              </motion.div>

              {/* العنوان */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl lg:text-5xl xl:text-[3.6rem] font-extrabold leading-[1.35] tracking-tight text-neutral-50"
              >
                أهلاً {firstName ? (
                  <span className="text-emerald-400">{firstName}</span>
                ) : (
                  "بك"
                )}
                <br />
                طور مهاراتك في
                <span className="inline-grid [grid-template-areas:'text'] mt-2 min-h-[1.4em]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentSpecialty}
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -24, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="[grid-area:text] text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-emerald-400 to-green-500 pb-2"
                    >
                      {specialties[currentSpecialty]}
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              {/* الوصف */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                كورسات عملية بشهادات معتمدة، يقدمها خبراء ومهندسون متخصصون.
                تعلم في وقتك وبسرعتك الخاصة، وابدأ رحلتك المهنية في الزراعة الذكية والمستدامة.
              </motion.p>

              {/* شريط البحث */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                onSubmit={(e) => {
                  e.preventDefault();
                  // استخدام navigate بدلاً من window.location لانتقال أسرع
                  if (searchQuery.trim()) {
                    navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
                  } else {
                    navigate("/courses");
                  }
                }}
                className="flex items-center gap-2 bg-[#101711] border border-neutral-800 focus-within:border-emerald-500/50 rounded-2xl p-2 max-w-xl mx-auto lg:mx-0 transition-colors shadow-lg"
              >
                <Search className="w-5 h-5 text-neutral-500 mr-2 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث عن كورس أو تخصص... مثال: الزراعة المائية"
                  className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-sm sm:text-base min-w-0"
                />
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 sm:px-6 h-11 rounded-xl font-semibold shrink-0"
                >
                  بحث
                </Button>
              </motion.form>

              {/* الأزرار */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
              >
                <Link to="/courses" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 transition-all shadow-[0_0_25px_rgba(5,150,105,0.35)] hover:shadow-[0_0_40px_rgba(5,150,105,0.55)]"
                  >
                    ابدأ التعلم الآن
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>

                {!user && (
                  <Link to="/register" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="group w-full sm:w-auto bg-white/5 hover:bg-emerald-600 text-white hover:text-white border-neutral-700 hover:border-emerald-500 px-8 h-14 text-base font-bold transition-all duration-300 backdrop-blur-sm"
                    >
                      <Play className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                      أنشئ حسابك مجاناً
                    </Button>
                  </Link>
                )}
              </motion.div>

              {/* الإحصائيات */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center justify-center lg:justify-start gap-6 sm:gap-10 pt-6 border-t border-neutral-800/60"
              >
                <div className="text-center lg:text-right">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">+100</p>
                  <p className="text-xs sm:text-sm text-neutral-500">كورس متخصص</p>
                </div>
                <div className="w-px h-10 bg-neutral-800" />
                <div className="text-center lg:text-right">
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">+5K</p>
                  <p className="text-xs sm:text-sm text-neutral-500">متدرب نشط</p>
                </div>
                <div className="w-px h-10 bg-neutral-800" />
                <div className="text-center lg:text-right">
                  <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400">4.9</p>
                  <p className="text-xs sm:text-sm text-neutral-500">متوسط التقييم</p>
                </div>
              </motion.div>
            </div>

            {/* ===== الصورة والبطاقات العائمة (يسار) ===== */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative order-1 lg:order-2"
            >
              <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-[0_20px_60px_rgba(0,0,0,0.5)] aspect-[4/3] lg:aspect-square max-w-md mx-auto z-10">
                <div className="absolute inset-0 bg-gradient-to-t from-[#090D0A]/80 via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay z-10" />
                <img
                  src={heroBg}
                  alt="تعلم الزراعة الحديثة"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* بطاقة التقييم */}
              <motion.div
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-8 -right-4 sm:-right-6 lg:-right-10 bg-[#121A15]/90 border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md z-20 w-44"
              >
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-xl font-extrabold text-white">4.9/5</p>
                <p className="text-xs text-neutral-400">تقييم المتدربين</p>
                <ul className="mt-3 space-y-1.5">
                  {ratingPoints.map((point) => (
                    <li key={point} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* بطاقة المجتمع */}
              <motion.div
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-8 -left-4 sm:-left-6 lg:-left-10 bg-[#121A15]/90 border border-neutral-800/80 p-4 rounded-2xl shadow-xl backdrop-blur-md flex items-center gap-3 z-20"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">+5,000 مهندس</p>
                  <p className="text-xs text-neutral-400">في مجتمعنا الزراعي</p>
                </div>
              </motion.div>

              {/* شارة الشهادات */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -bottom-4 right-8 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/40 flex items-center gap-2 z-20"
              >
                <Award className="w-4 h-4" />
                <span className="text-xs font-bold">شهادات إتمام معتمدة</span>
              </motion.div>
            </motion.div>
          </div>

          {/* ===== شريط الثقة (Trust Bar) ===== */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 lg:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {trustBadges.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center justify-center gap-3 bg-[#101711]/80 border border-neutral-800/70 hover:border-emerald-500/30 rounded-2xl py-4 px-4 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-semibold text-neutral-200">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default HeroDarkSection;
