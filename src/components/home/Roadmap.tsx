import { motion } from "framer-motion";
import { 
  Zap, Sprout, BookOpenCheck, Trophy, 
  ChevronLeft, Sparkles, ArrowLeft // ✅ ضفنا ArrowLeft هنا
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"; // ✅ ضفنا الـ Button هنا

// بيانات الخريطة الزراعية المهنية
const journeySteps = [
  {
    title: "بـذر الأساسيات",
    desc: "ابدأ بتأسيس معرفتك في علوم التربة، المناخ، وفسيولوجيا النبات مع كبار الخبراء.",
    icon: Sprout,
    gradient: "from-blue-600 to-blue-400",
    glow: "shadow-[0_0_20px_rgba(96,165,250,0.15)]"
  },
  {
    title: "تفرع التخصص",
    desc: "اختر مسارك الدقيق (هيدروبونيك، لاندسكيب، وقاية) وتعمق في أسرار المهنة.",
    icon: BookOpenCheck,
    gradient: "from-emerald-600 to-emerald-400",
    glow: "shadow-[0_0_20px_rgba(16,185,129,0.15)]"
  },
  {
    title: "نمو التطبيق العملي",
    desc: "شاهد تجارب حقيقية من كبرى المزارع وحل المشكلات الميدانية التي تواجه المهندسين.",
    icon: Zap,
    gradient: "from-orange-600 to-orange-400",
    glow: "shadow-[0_0_20px_rgba(251,146,60,0.15)]"
  },
  {
    title: "حصاد الإتقان والاعتماد",
    desc: "احصل على شهادتك الموثقة، وأتقن إدارة المزارع لتكون مستشاراً زراعياً ناجحاً.",
    icon: Trophy,
    gradient: "from-purple-600 to-purple-400",
    glow: "shadow-[0_0_20px_rgba(167,139,250,0.15)]"
  }
];

const Roadmap = () => {
  return (
    <section className="py-28 bg-[#090D0A] relative overflow-hidden font-tajawal">
      
      {/* تأثيرات الإضاءة الخلفية للجو العام للمنصة */}
      <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-emerald-900/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* رأس القسم بتصميم Typography فخم */}
        {/* <div className="text-right mb-24 max-w-2xl md:mr-0 mr-auto text-center md:text-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-5 justify-center md:justify-start"
          >
            <div className="h-[2px] w-14 bg-gradient-to-r from-emerald-500 to-transparent" /> */}
            {/* <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em]">
              دليلك نحو الاحتراف
            </span> */}
          {/* </motion.div> */}
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.3] tracking-tight"
          >
            رحلة نمو <span className="text-emerald-400 relative">مسارك <Sparkles className="absolute -top-6 -left-8 w-6 h-6 text-yellow-500/80 animate-pulse" /></span> المهني
          </motion.h2>
          <p className="text-xl text-neutral-400 mt-6 leading-relaxed max-w-xl md:mr-0 mr-auto font-medium">
             ارسم خريطة مستقبلك في هندسة الزراعة المستدامة والحديثة معنا، خطوة بخطوة.
          </p>
        </div>

        {/* شبكة الكروت بتصميم انسيابي ومتصل */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* خط الربط الانسيابي المتدرج (للشاشات الكبيرة) */}
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-neutral-800 to-transparent hidden lg:block -translate-y-1/2" />

          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="group relative"
              >
                {/* كارت المرحلة */}
                <div className={`relative p-8 rounded-[2.5rem] bg-[#121A15] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 ${step.glow} hover:-translate-y-3 shadow-2xl overflow-hidden`}>
                  
                  {/* الرقم الخلفي العائم */}
                  <span className={`absolute -top-3 -left-3 text-[120px] font-black text-white/[0.01] group-hover:text-emerald-500/[0.04] transition-colors pointer-events-none`}>
                    0{idx + 1}
                  </span>

                  <div className="relative z-10 space-y-8">
                    {/* أيقونة المرحلة بتدرج لوني خاص */}
                    <div className="flex items-center justify-between">
                       <div className={`w-16 h-16 rounded-[1.6rem] bg-gradient-to-br ${step.gradient} p-[1.5px] shadow-lg shadow-black/30 group-hover:scale-110 transition-transform duration-500`}>
                          <div className="w-full h-full bg-[#121A15] rounded-[1.5rem] flex items-center justify-center border border-white/10">
                             <Icon className={`w-7 h-7 text-white`} />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3 text-right">
                      <h3 className="text-2xl font-black text-white leading-snug group-hover:text-emerald-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-loose font-medium font-sans group-hover:text-neutral-300 transition-colors">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* سهم الربط الانسيابي (يتحرك مع الـ Hover) */}
                {idx < journeySteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -left-6 z-20 items-center justify-center">
                    <ChevronLeft className="w-6 h-6 text-white/10 group-hover:text-emerald-500 transition-all group-hover:translate-x-[-10px] group-hover:scale-110" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* زرار الـ CTA الأخير المدمج في الديزاين */}
        <div className="mt-20 text-center">
           <Link to="/courses">
              <Button size="lg" variant="outline" className="bg-[#121A15] border-neutral-800 hover:border-emerald-500/30 text-white px-10 h-16 rounded-2xl text-lg font-black gap-3 shadow-xl backdrop-blur-md transition-all active:scale-95 group">
                استعرض كورسات الأساسيات
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:translate-x-[-5px]" />
              </Button>
           </Link>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
