import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
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
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

// ===== الأقسام مع تفاصيل الكورسات المعروضة =====
const departments = [
  { name: "الإنتاج الحيواني", icon: Beef, courseTitle: "إدارة وتغذية مزارع الأبقار الحلوب", instructor: "د. أحمد مرسي", rating: "4.9", students: "1.2k" },
  { name: "الإنتاج الداجني", icon: Wheat, courseTitle: "برامج التحصين الحديثة في مزارع الدواجن", instructor: "د. محمد الشريف", rating: "4.8", students: "950" },
  { name: "الثروة السمكية", icon: Fish, courseTitle: "أنظمة الاستزراع السمكي المكثف والمياه العذبة", instructor: "م. طارق العشري", rating: "4.9", students: "810" },
  { name: "الإنتاج النباتي والمحاصيل", icon: Sprout, courseTitle: "استراتيجيات إنتاج القمح والذرة عالية الإنتاجية", instructor: "د. خالد عبد الله", rating: "5.0", students: "2.1k" },
  { name: "علوم البساتين", icon: Apple, courseTitle: "تكنولوجيا زراعة وإنتاج الفاكهة الاستوائية", instructor: "د. سامي الراوي", rating: "4.9", students: "1.5k" },
  { name: "وقاية النبات", icon: Leaf, courseTitle: "المكافحة المتكاملة للآفات والأمراض النباتية", instructor: "د. منى زكي", rating: "4.8", students: "1.8k" },
  { name: "علوم التربة", icon: FlaskConical, courseTitle: "تحليل خواص التربة وبرامج التسميد المتقدمة", instructor: "د. إبراهيم نصر", rating: "4.9", students: "1.1k" },
  { name: "الهندسة الزراعية", icon: Tractor, courseTitle: "تصميم وصيانة شبكات الري الحديثة (تخطيط ذكي)", instructor: "م. حازم فؤاد", rating: "4.9", students: "1.4k" },
  { name: "تصنيع الأغذية", icon: Milk, courseTitle: "تكنولوجيا تصنيع منتجات الألبان ومراقبة الجودة", instructor: "د. رانيا سعيد", rating: "4.8", students: "920" },
];

const deptNames = departments.map((d) => d.name);

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
});

const HeroSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ===== الآلة الكاتبة للأقسام =====
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
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#070B08] text-white">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(50%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
        .animate-marquee:hover { animation-play-state: paused; }
        .animate-spin-slow { animation: spin-slow 25s linear infinite; }
      `}</style>

      {/* ===== خلفية احترافية متطورة ===== */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="absolute top-[-10%] right-[10%] w-[50vw] h-[50vw] max-w-[800px] rounded-full bg-emerald-600/15 blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-green-700/10 blur-[140px] pointer-events-none" />

      {/* ===== المحتوى الرئيسي ===== */}
      <div className="container mx-auto px-4 lg:px-8 relative z-10 flex-1 flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full pt-32 pb-16">

          {/* ===== النصوص (يمين - يأخذ 7 أعمدة لراحة العين) ===== */}
          <div className="space-y-7 text-center lg:text-right order-2 lg:order-1 lg:col-span-7">

            <motion.div {...fadeUp(0)} className="flex justify-center lg:justify-start">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs sm:text-sm font-medium backdrop-blur-md">
                <BadgeCheck className="w-4 h-4 text-emerald-400" />
                المنصة العربية الأولى للتعليم الزراعي المتقدم
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.08)}
              className="text-4xl sm:text-5xl xl:text-[3.5rem] font-extrabold leading-[1.3] tracking-tight"
            >
              {firstName ? (
                <>أهلاً <span className="text-emerald-400">{firstName}</span>،</>
              ) : (
                "تعلّم الزراعة الحديثة"
              )}
              <br />
              <span className="text-neutral-400 text-2xl sm:text-3xl font-bold">واحترف تخصص</span>
              <br />
              <span className="inline-flex items-center justify-center lg:justify-start mt-3 min-h-[1.5em]">
                <ActiveIcon className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400 ml-3 shrink-0" />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-emerald-400 to-green-500">
                  {typedText}
                </span>
                <span className="inline-block w-[3px] h-[0.85em] bg-emerald-400 rounded-full mr-1.5 animate-pulse" />
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.16)}
              className="text-base sm:text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              كورسات عملية بشهادات معتمدة يقدمها نخبة من الأكاديميين والخبراء.
              ابدأ رحلتك المهنية اليوم وتعلم أحدث التقنيات الزراعية.
            </motion.p>

            <motion.form
              {...fadeUp(0.22)}
              onSubmit={(e) => {
                e.preventDefault();
                const q = searchQuery.trim();
                navigate(q ? `/courses?search=${encodeURIComponent(q)}` : "/courses");
              }}
              className="flex items-center gap-2 bg-[#111813] border border-neutral-800 focus-within:border-emerald-500/60 rounded-2xl p-2 max-w-xl mx-auto lg:mx-0 transition-all shadow-xl"
            >
              <Search className="w-5 h-5 text-neutral-500 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن تخصص، كورس، أو خبير..."
                className="flex-1 bg-transparent text-white placeholder:text-neutral-600 outline-none text-sm sm:text-base min-w-0"
              />
              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 h-11 rounded-xl font-semibold shrink-0 transition-all"
              >
                بحث
              </Button>
            </motion.form>

            <motion.div
              {...fadeUp(0.28)}
              className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-4"
            >
              <Link to="/courses" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-14 text-base font-semibold gap-2 shadow-[0_0_30px_rgba(5,150,105,0.35)] hover:shadow-[0_0_50px_rgba(5,150,105,0.6)] transition-all"
                >
                  استعرض كافة الكورسات
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              {!user && (
                <Link to="/register" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="group w-full sm:w-auto bg-white/5 hover:bg-white text-white hover:text-black border-neutral-700 hover:border-white px-8 h-14 text-base font-bold transition-all duration-300 backdrop-blur-sm"
                  >
                    <Play className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:scale-110" />
                    أنشئ حسابك مجاناً
                  </Button>
                </Link>
              )}
            </motion.div>

            {/* إحصائيات سريعة تحت الأزرار */}
            <motion.div
              {...fadeUp(0.34)}
              className="flex items-center justify-center lg:justify-start gap-8 pt-4 border-t border-neutral-800/80"
            >
              <div>
                <p className="text-2xl font-bold text-white">+100</p>
                <p className="text-xs text-neutral-400">كورس معتمد</p>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div>
                <p className="text-2xl font-bold text-white">+5,000</p>
                <p className="text-xs text-neutral-400">طالب نشط</p>
              </div>
              <div className="w-px h-8 bg-neutral-800" />
              <div>
                <p className="text-2xl font-bold text-emerald-400">4.9 / 5</p>
                <p className="text-xs text-neutral-400">تقييم المنصة</p>
              </div>
            </motion.div>
          </div>

          {/* ===== الجانب الأيسر (يأخذ 5 أعمدة - بطاقة تفاعلية فخمة تحاكي المنصات العالمية) ===== */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block order-1 lg:order-2 lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              {/* توهج خلف البطاقة */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600/20 to-green-400/10 rounded-3xl blur-xl pointer-events-none" />

              {/* الكارت الرئيسي */}
              <div className="relative bg-[#101712]/90 border border-neutral-800 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                
                {/* شريط علوي مصغر */}
                <div className="flex items-center justify-between mb-5 pb-4 border-b border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-emerald-400">كورس مميز الآن</span>
                  </div>
                  <span className="text-xs text-neutral-400 bg-neutral-800/60 px-2.5 py-1 rounded-lg">
                    {ActiveDept.name}
                  </span>
                </div>

                {/* محتوى الكورس الديناميكي */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={deptIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                        <ActiveIcon className="w-7 h-7" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white line-clamp-1">{ActiveDept.courseTitle}</h4>
                        <p className="text-xs text-neutral-400 mt-1">المدرب: <span className="text-neutral-200 font-medium">{ActiveDept.instructor}</span></p>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-4 border border-neutral-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-300">
                        <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-amber-400 fill-current" /> {ActiveDept.rating} تقييم الكورس</span>
                        <span className="flex items-center gap-1.5 text-emerald-400"><Users className="w-3.5 h-3.5" /> {ActiveDept.students} طالب مسجل</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full w-3/4 rounded-full" />
                      </div>
                    </div>

                    <Link
                      to={`/courses?department=${encodeURIComponent(ActiveDept.name)}`}
                      className="flex items-center justify-center w-full py-3.5 bg-emerald-600/15 hover:bg-emerald-600/25 border border-emerald-500/30 text-emerald-300 rounded-xl font-semibold text-sm transition-all group"
                    >
                      <span>انضم لهذا الكورس</span>
                      <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    </Link>
                  </motion.div>
                </AnimatePresence>

              </div>

              {/* بطاقات عائمة محسنة لا تؤثر على التناسق */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 bg-[#141E17] border border-neutral-800 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">شهادة معتمدة</span>
              </motion.div>

              <motion.div
                animate={{ y: [6, -6, 6] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-4 bg-[#141E17] border border-neutral-800 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5"
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white">محتوى عملي 100%</span>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>

      {/* ===== شريط الأقسام المتحرك الأسفل (Marquee) ===== */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="relative z-10 border-t border-neutral-800/80 bg-[#070B08]/90 backdrop-blur-md py-4 overflow-hidden"
      >
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#070B08] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#070B08] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee gap-3">
          {[...departments, ...departments].map((dept, i) => (
            <Link
              key={`${dept.name}-${i}`}
              to={`/courses?department=${encodeURIComponent(dept.name)}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] hover:bg-emerald-500/10 border border-neutral-800 hover:border-emerald-500/40 text-neutral-400 hover:text-emerald-300 text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300"
            >
              <dept.icon className="w-4 h-4 text-emerald-500" />
              {dept.name}
            </Link>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
