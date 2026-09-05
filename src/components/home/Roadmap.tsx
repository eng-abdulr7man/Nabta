
// export default Roadmap;
import { motion } from "framer-motion";
import { 
  Zap, Sprout, BookOpenCheck, Trophy, 
  ArrowLeft, Compass 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// الخطوات بلغة مصرية بسيطة وقريبة للواقع
const journeySteps = [
  {
    title: "1. البداية من الصفر (الأساسيات)",
    desc: "هنبسطلك علوم التربة، الطقس، وإزاي النبات بيكبر، عشان نبني عندك أرضية قوية مع أكفأ الخبراء.",
    icon: Sprout,
    gradient: "from-blue-500 to-cyan-400",
    badge: "الخطوة الأولى"
  },
  {
    title: "2. اختار سكتك (التخصص)",
    desc: "سواء هيدروبونيك، لاندسكيب، أو وقاية.. نقي الحتة اللي بتحبها واغوص في أسرارها.",
    icon: BookOpenCheck,
    gradient: "from-emerald-500 to-teal-400",
    badge: "الخطوة التانية"
  },
  {
    title: "3. انزل للغيط والشغل العملي",
    desc: "هتشوف بعينك تجارب حقيقية جوه مزارع كبييرة، وإزاي بنحل المشاكل اللي بتطلع للمهندس في الشغل.",
    icon: Zap,
    gradient: "from-amber-500 to-orange-400",
    badge: "الخطوة التالتة"
  },
  {
    title: "4. اقطف ثمرة تعبك (الاحتراف)",
    desc: "خد شهادة معتمدة تثبت كفاءتك، وابقى جاهز تدير مزارع وتكون استشاري زراعي معروف.",
    icon: Trophy,
    gradient: "from-purple-500 to-indigo-400",
    badge: "محطة الوصول"
  }
];

const Roadmap = () => {
  return (
    <section className="py-24 md:py-32 bg-[#070B08] relative overflow-hidden font-tajawal text-white">
      
       {/* إضاءة خفيفة في الخلفية */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/5 blur-[160px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* رأس القسم */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-semibold mb-4">
              <Compass className="w-4 h-4" />
              طريقك للنجاح خطوة بخطوة
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.2]">
              إزاي تبني <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-300 via-emerald-400 to-green-500">مستقبلك الزراعي؟</span>
            </h2>
            <p className="text-neutral-400 text-base sm:text-lg mt-4 leading-relaxed font-normal">
              مشوار الألف ميل بيبدأ بخطوة.. وهنا هنمشي معاك لحد ما تبقي مهندس شاطر ومحترف في مجالك.
            </p>
          </motion.div>
        </div>

        {/* الكروت */}
        <div className="relative">
          
          {/* خط التوصيل الأفقي للشاشات الكبيرة */}
          <div className="hidden lg:block absolute top-[45%] left-12 right-12 h-[2px] bg-gradient-to-r from-blue-500/30 via-emerald-500/30 to-purple-500/30 z-0 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {journeySteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  className="group flex flex-col h-full"
                >
                  <div className="relative flex flex-col flex-1 p-6 sm:p-7 rounded-3xl bg-[#0F1611]/90 border border-neutral-800/80 hover:border-emerald-500/40 transition-all duration-300 hover:-translate-y-2 shadow-xl hover:shadow-2xl hover:shadow-emerald-500/10 backdrop-blur-xl overflow-hidden">
                    
                    {/* رقم المرحلة */}
                    <span className="absolute top-3 left-4 text-7xl font-black text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors pointer-events-none select-none">
                      0{idx + 1}
                    </span>

                    {/* الأيقونة والشاّرة */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} p-[1px] shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="w-full h-full bg-[#0F1611] rounded-[15px] flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-neutral-400 bg-neutral-900 px-3 py-1 rounded-full border border-neutral-800">
                        {step.badge}
                      </span>
                    </div>

                    {/* النصوص */}
                    <div className="space-y-2.5 mt-auto">
                      <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed">
                        {step.desc}
                      </p>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* زر الانتقال */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <Link to="/courses">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white px-9 h-14 rounded-2xl text-base font-semibold gap-3 shadow-[0_0_25px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all group">
              ابدأ أول خطوة.. استكشف الكورسات
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default Roadmap;
