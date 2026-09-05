import { motion } from "framer-motion";
import { 
  Zap, Sprout, BookOpenCheck, Trophy, 
  ChevronLeft, ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <section className="py-24 md:py-32 bg-[#090D0A] relative overflow-hidden font-tajawal">
      
      {/* تأثيرات الإضاءة الخلفية للجو العام للمنصة */}
      <div className="absolute top-0 right-[-10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-emerald-900/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* رأس القسم */}
        <div className="text-center md:text-right mb-16 md:mb-24 max-w-3xl mx-auto md:mx-0 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center md:justify-start gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs md:text-sm font-bold mb-4 mx-auto md:mx-0">
              <Trophy className="w-4 h-4" />
              خريطة الطريق
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              رحلة نمو <span className="text-emerald-400 relative">
                مسارك
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-emerald-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" fill="transparent" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span> المهني
            </h2>
            <p className="text-base md:text-lg text-neutral-400 mt-6 leading-relaxed font-medium px-4 md:px-0">
              ارسم خريطة مستقبلك في هندسة الزراعة المستدامة والحديثة معنا، خطوة بخطوة من البذور حتى الاحتراف.
            </p>
          </motion.div>
        </div>

        {/* شبكة الكروت بتصميم انسيابي ومتجاوب */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="group relative flex h-full"
              >
                {/* كارت المرحلة - flex-1 و h-full لضمان تساوي الأطوال */}
                <div className={`flex flex-col flex-1 w-full relative p-6 sm:p-8 rounded-[2rem] bg-gradient-to-b from-[#121A15] to-[#0a0f0c] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 ${step.glow} hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] overflow-hidden`}>
                  
                  {/* الرقم الخلفي العائم */}
                  <span className="absolute -top-4 -left-4 text-[100px] sm:text-[130px] font-black text-white/[0.015] group-hover:text-emerald-500/[0.05] transition-colors duration-500 pointer-events-none select-none">
                    0{idx + 1}
                  </span>

                  <div className="relative z-10 flex flex-col h-full space-y-6 md:space-y-8">
                    {/* أيقونة المرحلة بتدرج لوني خاص */}
                    <div className="flex items-center justify-between">
                       <div className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-[1.2rem] sm:rounded-[1.5rem] bg-gradient-to-br ${step.gradient} p-[1px] shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <div className="w-full h-full bg-[#121A15] rounded-[1.1rem] sm:rounded-[1.4rem] flex items-center justify-center border border-white/10">
                             <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                          </div>
                       </div>
                    </div>

                    <div className="space-y-3 text-right flex-1 flex flex-col">
                      <h3 className="text-xl sm:text-2xl font-black text-white leading-snug group-hover:text-emerald-400 transition-colors">
                        {step.title}
                      </h3>
                      <p className="text-neutral-400 text-sm leading-relaxed font-medium">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>

                {/* سهم الربط بين الكروت (يظهر فقط في الشاشات الكبيرة lg) */}
                {idx < journeySteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -left-6 z-20 items-center justify-center -translate-y-1/2">
                    <div className="w-8 h-8 rounded-full bg-[#090D0A] flex items-center justify-center border border-white/5">
                      <ChevronLeft className="w-5 h-5 text-neutral-600 group-hover:text-emerald-500 transition-colors duration-300" />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* زرار الـ CTA الأخير */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 md:mt-24 text-center"
        >
           <Link to="/courses">
              <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 md:px-12 h-14 md:h-16 rounded-xl md:rounded-2xl text-base md:text-lg font-bold gap-3 shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all active:scale-95 group">
                استكشف كورسات الأساسيات
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              </Button>
           </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Roadmap;
