import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Play,
  Star,
  BadgeCheck,
  Users,
  Search,
  Award,
  Sprout,
  Leaf,
  Wheat,
  Beef,
  Fish,
  Apple,
  FlaskConical,
  Tractor,
  Milk,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// ===== الأقسام مع أيقونة وصورة مصغرة لكل قسم =====
const departments = [
  { name: "الإنتاج الحيواني", icon: Beef, coursesCount: "12 كورس", desc: "أساسيات تربية وتغذية الحيوانات وادارة المزارع الحديثة" },
  { name: "الإنتاج الداجني", icon: Wheat, coursesCount: "9 كورسات", desc: "إدارة مزارع الدواجن وبرامج التحصين والتغذية المتقدمة" },
  { name: "الثروة السمكية", icon: Fish, coursesCount: "7 كورسات", desc: "إنشاء وإدارة المزارع السمكية وأنظمة الاستزراع المكثف" },
  { name: "الإنتاج النباتي والمحاصيل", icon: Sprout, coursesCount: "15 كورس", desc: "استراتيجيات زراعة وإنتاج المحاصيل الحقلية الاستراتيجية" },
  { name: "علوم البساتين", icon: Apple, coursesCount: "11 كورس", desc: "تكنولوجيا إنتاج الفاكهة الخضر وزراعة الأسطح والبساتين" },
  { name: "وقاية النبات", icon: Leaf, coursesCount: "10 كورسات", desc: "مكافحة الآفات الزراعية والأمراض النباتية بالطرق الحديثة" },
  { name: "علوم التربة", icon: FlaskConical, coursesCount: "8 كورسات", desc: "تحليل خواص التربة، التسميد الحيوي، وإصلاح الأراضي" },
  { name: "الهندسة الزراعية", icon: Tractor, coursesCount: "6 كورسات", desc: "صيانة الماكنات الزراعية وتصميم شبكات الري الحديثة" },
  { name: "تصنيع الأغذية", icon: Milk, coursesCount: "10 كورسات", desc: "حفظ وتصنيع منتجات الألبان والصناعات الغذائية الزراعية" },
];

// أسماء الأقسام للآلة الكاتبة
const deptNames = departments.map((d) => d.name);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const HeroSection = () => {
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  // ===== الآلة الكاتبة =====
  const [deptIndex, setDeptIndex] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = deptNames[deptIndex];
    let delay = isDeleting ? 35 : 80;
    if (!isDeleting && typedText === current) delay = 2200;
    else if (isDeleting && typedText === "") delay = 400;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (typedText === current) setIsDeleting(true);
        else setTypedText(current.slice(0, typedText.length + 1));
      } else {
        if (typedText === "") {
          setIsDeleting(false);
          setDeptIndex((prev) => (prev + 1) % deptNames.length);
        } else {
          setTypedText(current.slice(0, typedText.length - 1));
        }
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [typedText, isDeleting, deptIndex]);

  const firstName = user && profile?.full_name ? profile.full_name.split(" ")[0] : null;
  const ActiveDept = departments[deptIndex];
  const ActiveIcon = ActiveDept.icon;

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#090D0A] text-white">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .animate-spin-slow { animation: spin-slow 24s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 30s linear infinite; }
      `}</style>

      {/* ===== الخلفية: شبكة + توهج + ضجيج ناعم ===== */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 90% 70% at 50% 30%, black 20%, transparent 100%)",
        }}
      />
      <div className="absolute top-[-25%] left-1/4 -translate-x-1/2 w-[65vw] h-[50vw] max-w-[1000px] rounded-full bg-emerald-800/25 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-30%] right-[-15%] w-[45vw] h-[45vw] rounded-full bg-green-900/15 blur-[130px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.35] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.18'/%3E%3C/svg%3E")`,
        }}
      />

      {/* ===== المحتوى الرئيسي ===== */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-12 items-center w-full pt-32 pb-14">

          {/* ===== النصوص (يمين) ===== */}
          <div className="space-y-7 text-center lg:text-right order-2 lg:order-1">

            <motion.div {...fadeUp(0)} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-medium">
                <BadgeCheck className="w-4 h-4" />
                المنصة العربية الأولى للتعليم الزراعي المتقدم
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.35] tracking-tight"
            >
              {firstName ? (
                <>أهلاً <span className="text-emerald-400">{firstName}</span>،</>
              ) : (
                "تعلّم الزراعة من الخبراء"
              )}
              <br />
              <span className="text-neutral-400 text-2xl sm:text-3xl font-bold">واحترف تخصص</span>
              <br />
              <span className="inline-flex items-center justify-center lg:justify-start mt-3 min-h-[1.5em]">
                <ActiveIcon className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400 ml-3 shrink-0" />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 to-green-500">
                  {typedText}
                </span>
                <span className="inline-block w-[3px] h-[0.85em] bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-base sm:text-lg text-neutral-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
            >
              كورسات عملية بشهادات معتمدة يقدمها أعضاء هيئة تدريس وخبراء من كليات الزراعة.
              تعلّم في وقتك الخاص، من أي مكان.
            </motion.p>

            <motion.form
              {...fadeUp(0.22)}
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                window.location.href = q ? `/courses?search=${encodeURIComponent(q)}` : "/courses";
              }}
              className="flex items-center gap-2 bg-white/[0.04] border border-neutral-800 focus-within:border-emerald-500/50 rounded-2xl p-1.5 max-w-lg mx-auto lg:mx-0 transition-colors shadow-lg"
            >
              <Search className="w-5 h-5 text-neutral-500 mr-2.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن كورس أو قسم..."
                className="flex-1 bg-transparent text-white placeholder:text-neutral-600 outline-none text-sm sm:text-base min-w-0"
              />
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 sm:px-7 h-11 rounded-xl font-semibold shrink-0"
              >
                بحث
              </Button>
            </motion.form>

            <motion.div
              {...fadeUp(0.28)}
              className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-3.5"
            >
              <Link to="/courses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 shadow-[0_0_25px_rgba(5,150,105,0.3)] hover:shadow-[0_0_45px_rgba(5,150,105,0.55)] transition-all"
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
                    className="group w-full sm:w-auto bg-white/5 hover:bg-white text-white hover:text-black border-white/15 hover:border-white px-8 h-14 text-base font-bold transition-all duration-300"
                  >
                    <Play className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                    أنشئ حسابك مجاناً
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* طلاب حقيقيين + تقييم */}
            <motion.div
              {...fadeUp(0.34)}
              className="flex items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <div className="flex -space-x-3 space-x-reverse">
                {["م", "س", "ع", "أ"].map((ch, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-[#090D0A] flex items-center justify-center text-xs font-bold"
                    style={{
                      background: `linear-gradient(135deg, hsl(${140 + i * 18}, 45%, ${22 + i * 6}%), hsl(${150 + i * 18}, 50%, ${14 + i * 4}%))`,
                      color: "#6ee7b7",
                    }}
                  >
                    {ch}
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#090D0A] bg-emerald-600 flex items-center justify-center text-[10px] font-bold text-white">
                  +5K
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  ))}
                  <span className="text-sm font-bold text-white mr-1">4.9</span>
                </div>
                <p className="text-xs text-neutral-500 mt-0.5">من تقييم آلاف المتدربين</p>
              </div>
            </motion.div>
          </div>

          {/* ===== التصميم البديل الأنيق للجانب الأيسر (معاينة كورس تفاعلية) ===== */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block order-1 lg:order-2"
          >
            {/* خلفية جمالية متوهجة */}
            <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/10 to-green-500/5 rounded-3xl blur-2xl pointer-events-none" />

            {/* البطاقة الرئيسية التفاعلية */}
            <div className="relative rounded-3xl bg-[#121814]/90 border border-neutral-800/80 shadow-2xl overflow-hidden backdrop-blur-xl p-6">
              
              {/* شريط علوي للبطاقة */}
              <div className="flex items-center justify-between pb-5 border-b border-neutral-800/80 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-xs text-neutral-400 font-mono flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  معاينة الأقسام الحية
                </span>
              </div>

              {/* محتوى القسم المتغير بناءً على الآلة الكاتبة */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={deptIndex}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* رأس الكورس المعروض */}
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-900/30 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-inner">
                      <ActiveIcon className="w-8 h-8 text-emerald-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-xs font-semibold">
                          {ActiveDept.coursesCount}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                          <Star className="w-3.5 h-3.5 fill-current" /> 4.9
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{ActiveDept.name}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-neutral-400 leading-relaxed bg-black/20 p-4 rounded-xl border border-neutral-800/50">
                    {ActiveDept.desc}
                  </p>

                  {/* مميزات سريعة للكورس */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2.5 text-xs text-neutral-300 bg-white/[0.02] p-3 rounded-xl border border-neutral-800">
                      <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>تطبيق عملي مباشر</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-neutral-300 bg-white/[0.02] p-3 rounded-xl border border-neutral-800">
                      <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>محتوى مرن ومحدث</span>
                    </div>
                  </div>

                  {/* زر الانتقال للقسم */}
                  <Link
                    to={`/courses?department=${encodeURIComponent(ActiveDept.name)}`}
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 font-semibold text-sm transition-all group mt-2"
                  >
                    <span>استكشف كورسات {ActiveDept.name}</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </motion.div>
              </AnimatePresence>

            </div>

            {/* بطاقة الشهادة العائمة */}
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-5 -right-6 bg-[#121814]/95 backdrop-blur-md border border-neutral-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-10"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center">
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">شهادة معتمدة</p>
                <p className="text-[10px] text-neutral-400">تفتح لك أبواب العمل</p>
              </div>
            </motion.div>

            {/* بطاقة المجتمع العائمة */}
            <motion.div
              animate={{ y: [8, -8, 8] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="absolute -bottom-5 -left-6 bg-[#121814]/95 backdrop-blur-md border border-neutral-800 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl z-10"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center">
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">+5,000 مهندس</p>
                <p className="text-[10px] text-neutral-400">في مجتمعنا الزراعي</p>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>

      {/* ===== شريط الأقسام المتحرك (Marquee) ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 border-t border-neutral-800/60 bg-[#0a0f0b]/80 backdrop-blur-sm py-5 overflow-hidden"
      >
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#090D0A] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#090D0A] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee gap-3">
          {[...departments, ...departments].map((dept, i) => (
            <Link
              key={`${dept.name}-${i}`}
              to={`/courses?department=${encodeURIComponent(dept.name)}`}
              className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/[0.03] hover:bg-emerald-500/10 border border-neutral-800 hover:border-emerald-500/40 text-neutral-400 hover:text-emerald-300 text-sm font-medium whitespace-nowrap transition-all duration-300"
            >
              <dept.icon className="w-4 h-4" />
              {dept.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
