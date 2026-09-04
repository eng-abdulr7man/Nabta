import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, CheckCircle2, ShieldCheck, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const HeroSection = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const firstName = user && profile?.full_name ? profile.full_name.split(" ")[0] : null;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    navigate(q ? `/courses?search=${encodeURIComponent(q)}` : "/courses");
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center bg-[#070908] text-white px-4 overflow-hidden pt-24 pb-16">
      
      {/* خلفية هادئة جداً بدون إزعاج بصري */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[400px] bg-emerald-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-950/20 via-transparent to-transparent pointer-events-none" />

      <div className="container mx-auto max-w-4xl relative z-10 text-center space-y-8">

        {/* شارة علوية خفيفة */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium"
        >
          <ShieldCheck className="w-4 h-4" />
          المنصة الزراعية الأولى في العالم العربي
        </motion.div>

        {/* العنوان الرئيسي الضخم */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.2]"
        >
          {firstName ? (
            <>مرحباً بك، <span className="text-emerald-400">{firstName}</span></>
          ) : (
            "ارتقِ بمهاراتك الزراعية"
          )}
          <span className="block mt-2 text-neutral-400 font-semibold text-3xl sm:text-5xl">
            إلى المستوى الاحترافي
          </span>
        </motion.h1>

        {/* وصف قصير وواضح */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto leading-relaxed"
        >
          محتوى عملي، كورسات تخصصية، وشهادات معتمدة مقدمة من نخبة الخبراء والأكاديميين لتمكين مسيرتك المهنية.
        </motion.p>

        {/* مربع البحث الرئيسي (تصميم بسيط وواسع) */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          onSubmit={handleSearch}
          className="flex items-center bg-[#111713] border border-neutral-800 hover:border-emerald-500/50 focus-within:border-emerald-500 rounded-2xl p-2 max-w-2xl mx-auto shadow-2xl transition-all"
        >
          <Search className="w-5 h-5 text-neutral-500 mx-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن كورس، تخصص، أو مهارة معينة..."
            className="flex-1 bg-transparent text-white placeholder:text-neutral-600 outline-none text-sm sm:text-base py-2 min-w-0"
          />
          <Button
            type="submit"
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 h-11 rounded-xl font-medium shrink-0 transition-colors"
          >
            بحث
          </Button>
        </motion.form>

        {/* أزرار السريعة تحت البحث */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <Link to="/courses">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-neutral-200 font-semibold px-7 h-12 rounded-xl gap-2 transition-all"
            >
              استعراض كافة الكورسات
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          {!user && (
            <Link to="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent hover:bg-white/5 text-white border-neutral-800 hover:border-neutral-700 font-medium px-7 h-12 rounded-xl transition-all"
              >
                أنشئ حساباً جديداً
              </Button>
            </Link>
          )}
        </motion.div>

        {/* مميزات سريعة أفقية (Minimal Trust Bar) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 border-t border-neutral-900 max-w-3xl mx-auto text-neutral-400 text-xs sm:text-sm"
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>شهادات إتمام معتمدة</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>تطبيق عملي 100%</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-current shrink-0" />
            <span>تقييم 4.9 من آلاف الطلاب</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;
