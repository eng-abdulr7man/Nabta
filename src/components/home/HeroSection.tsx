import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Star,
  BadgeCheck,
  Users,
  Search,
  ChevronDown,
  GraduationCap,
  Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// أقسام كليات الزراعة
const departments = [
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

const stats = [
  { value: "+100", label: "كورس متخصص" },
  { value: "+5K", label: "متدرب نشط" },
  { value: "4.9", label: "متوسط التقييم" },
];

// ===== نبضة دخول موحدة =====
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const HeroSection = () => {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // ===== نظام الآلة الكاتبة =====
  const [deptIndex, setDeptIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = departments[deptIndex];
    let delay = isDeleting ? 35 : 75;
    if (!isDeleting && typedText === current) delay = 2200;
    else if (isDeleting && typedText === "") delay = 400;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText === current) setIsDeleting(true);
        else setTypedText(current.slice(0, typedText.length + 1));
      } else {
        if (typedText === "") {
          setIsDeleting(false);
          setDeptIndex((prev) => (prev + 1) % departments.length);
        } else {
          setTypedText(current.slice(0, typedText.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, deptIndex]);

  const firstName = user && profile?.full_name ? profile.full_name.split(" ")[0] : null;

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden bg-[#090D0A] text-white">
      {/* ===== الخلفية: شبكة خافتة + توهج علوي + تدرج سفلي ===== */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 100%)",
        }}
      />
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[50vw] max-w-[900px] rounded-full bg-emerald-800/20 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#090D0A] to-transparent pointer-events-none" />

      {/* ===== المحتوى ===== */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto w-full text-center pt-28 pb-16">

          {/* الشارة */}
          <motion.div {...fadeUp(0)} className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-medium">
              <BadgeCheck className="w-4 h-4" />
              المنصة العربية الأولى للتعليم الزراعي المتقدم
            </span>
          </motion.div>

          {/* العنوان */}
          <motion.h1
            {...fadeUp(0.08)}
            className="text-4xl sm:text-5xl lg:text-[3.6rem] font-extrabold leading-[1.35] tracking-tight"
          >
            {firstName ? (
              <>أهلاً <span className="text-emerald-400">{firstName}</span>،</>
            ) : (
              "تعلّم الزراعة من الخبراء"
            )}
            <br />
            <span className="text-neutral-400 text-2xl sm:text-3xl lg:text-4xl font-bold">
              واحترف تخصص
            </span>
            <br />
            {/* الآلة الكاتبة */}
            <span className="inline-flex items-center justify-center mt-3 min-h-[1.5em]">
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 to-green-500">
                {typedText}
              </span>
              <span className="inline-block w-[3px] h-[0.85em] bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
            </span>
          </motion.h1>

          {/* الوصف */}
          <motion.p
            {...fadeUp(0.16)}
            className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto leading-relaxed mt-6"
          >
            كورسات عملية بشهادات معتمدة يقدمها أعضاء هيئة تدريس وخبراء من كليات الزراعة.
            تعلّم في وقتك الخاص، من أي مكان.
          </motion.p>

          {/* البحث */}
          <motion.form
            {...fadeUp(0.22)}
            onSubmit={(e) => {
              e.preventDefault();
              const q = searchQuery.trim();
              window.location.href = q ? `/courses?search=${encodeURIComponent(q)}` : "/courses";
            }}
            className="flex items-center gap-2 bg-white/[0.04] border border-neutral-800 focus-within:border-emerald-500/50 rounded-2xl p-1.5 max-w-xl mx-auto mt-8 transition-colors"
          >
            <Search className="w-5 h-5 text-neutral-500 mr-2.5 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن كورس... مثال: الإنتاج الحيواني"
              className="flex-1 bg-transparent text-white placeholder:text-neutral-600 outline-none text-sm sm:text-base min-w-0"
            />
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 sm:px-7 h-11 rounded-xl font-semibold shrink-0"
            >
              بحث
            </Button>
          </motion.form>

          {/* الأزرار */}
          <motion.div
            {...fadeUp(0.28)}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8"
          >
            <Link to="/courses" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 shadow-[0_0_25px_rgba(5,150,105,0.3)] hover:shadow-[0_0_40px_rgba(5,150,105,0.5)] transition-all"
              >
                <GraduationCap className="w-5 h-5" />
                ابدأ التعلم الآن
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            {!user && (
              <Link to="/register" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="group w-full sm:w-auto bg-white/5 hover:bg-white text-white hover:text-black border-white/15 hover:border-white px-8 h-14 text-base font-bold transition-all duration-300"
                >
                  <Play className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                  أنشئ حسابك مجاناً
                </Button>
              </Link>
            )}
          </motion.div>

          {/* الأقسام السريعة */}
          <motion.div
            {...fadeUp(0.34)}
            className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mt-10"
          >
            <span className="flex items-center gap-1.5 text-xs text-neutral-500 ml-1">
              <Sprout className="w-3.5 h-3.5" />
              تصفح حسب القسم:
            </span>
            {departments.slice(0, 5).map((dept) => (
              <Link
                key={dept}
                to={`/courses?department=${encodeURIComponent(dept)}`}
                className="px-3.5 py-1.5 rounded-full bg-white/[0.03] hover:bg-emerald-500/10 border border-neutral-800 hover:border-emerald-500/40 text-neutral-400 hover:text-emerald-300 text-xs sm:text-sm font-medium transition-all duration-300"
              >
                {dept}
              </Link>
            ))}
            <Link
              to="/courses"
              className="px-3.5 py-1.5 rounded-full text-emerald-400 hover:text-emerald-300 text-xs sm:text-sm font-semibold transition-colors"
            >
              كل الأقسام ←
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ===== شريط الإحصائيات السفلي ===== */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="relative z-10 border-t border-neutral-800/60"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-x-reverse divide-neutral-800/60 max-w-2xl mx-auto">
            {stats.map((stat, i) => (
              <div key={stat.label} className="flex items-center justify-center gap-2.5 py-6">
                {i === 0 && <GraduationCap className="w-4 h-4 text-emerald-500 hidden sm:block" />}
                {i === 1 && <Users className="w-4 h-4 text-emerald-500 hidden sm:block" />}
                {i === 2 && <Star className="w-4 h-4 text-emerald-500 fill-current hidden sm:block" />}
                <div className="text-center sm:text-right">
                  <p className="text-xl sm:text-2xl font-extrabold text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-neutral-500 mt-1.5">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* مؤشر التمرير */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-24 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-1.5 text-neutral-600"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-5 h-5" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
