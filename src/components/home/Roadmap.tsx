import { motion } from "framer-motion";
import { BookOpen, Target, Zap, Award, ChevronLeft } from "lucide-react";

const steps = [
  {
    title: "تأسيس المعرفة",
    desc: "ابدأ بأساسيات التربة، المناخ، وفسيولوجيا النبات مع خبراء الأكاديمية.",
    icon: BookOpen,
    color: "from-blue-500/20 to-blue-600/5",
    iconColor: "text-blue-400"
  },
  {
    title: "التخصص الدقيق",
    desc: "اختر مسارك المهني (هيدروبونيك، لاندسكيب، وقاية) وتعمق في أسرار المهنة.",
    icon: Target,
    color: "from-emerald-500/20 to-emerald-600/5",
    iconColor: "text-emerald-400"
  },
  {
    title: "التطبيق العملي",
    desc: "مشاهدة تجارب حقيقية من المزارع وحل المشكلات التي تواجه المهندسين.",
    icon: Zap,
    color: "from-orange-500/20 to-orange-600/5",
    iconColor: "text-orange-400"
  },
  {
    title: "الاعتماد المهني",
    desc: "احصل على شهادتك الموثقة وابدأ مسيرتك في كبرى الشركات الزراعية.",
    icon: Award,
    color: "from-purple-500/20 to-purple-600/5",
    iconColor: "text-purple-400"
  }
];

const Roadmap = () => {
  return (
    <section className="py-24 bg-[#050806] relative overflow-hidden font-tajawal">
      {/* الخلفية المضيئة */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-right mb-20">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="h-[2px] w-12 bg-emerald-500" />
            <span className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em]">
              مسارك نحو الاحتراف
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black text-white leading-tight"
          >
            خريطة طريق <span className="text-emerald-400 underline decoration-emerald-500/30 underline-offset-8">المهندس الزراعي</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* الخط الرابط في الخلفية (للموبايل والديسك توب) */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent hidden lg:block" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="group relative"
            >
              {/* الكارت */}
              <div className="relative p-8 rounded-[2.5rem] bg-[#0a0f0c] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 shadow-2xl overflow-hidden">
                {/* تأثير التوهج عند الحوّم (Hover) */}
                <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* الرقم الخلفي */}
                <span className="absolute -top-2 -left-2 text-8xl font-black text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors pointer-events-none">
                  0{idx + 1}
                </span>

                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-[#121A15] border border-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-xl`}>
                    <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-black text-white mb-4 group-hover:text-emerald-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed font-medium group-hover:text-neutral-300 transition-colors">
                    {step.desc}
                  </p>
                </div>
              </div>

              {/* سهم الربط بين الكروت */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -left-6 z-20 items-center justify-center">
                  <ChevronLeft className="w-5 h-5 text-white/10 group-hover:text-emerald-500 transition-all group-hover:translate-x-[-5px]" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
