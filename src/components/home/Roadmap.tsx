import { motion } from "framer-motion";
import { 
  Zap, Sprout, BookOpenCheck, Trophy, 
  ArrowLeft 
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const journeySteps = [
  {
    title: "1. الأساسيات",
    desc: "هنبسطلك علوم التربة، الطقس، ونمو النبات من غير تعقيد عشان نبني أرضية صح.",
    icon: Sprout,
    badge: "البداية"
  },
  {
    title: "2. التخصص",
    desc: "اختار السكة اللي تحبها.. سواء هيدروبونيك، وقاية، أو إدارة مزارع.",
    icon: BookOpenCheck,
    badge: "المسار"
  },
  {
    title: "3. الشغل العملي",
    desc: "هتشوف بعينك تطبيق حقيقي جوه المزارع وإزاي بنحل المشاكل الواقعية.",
    icon: Zap,
    badge: "التطبيق"
  },
  {
    title: "4. الاحتراف",
    desc: "تطلع جاهز تدير شغلك وتكون مهندس فاهم ومتمكن في مجالك.",
    icon: Trophy,
    badge: "الهدف"
  }
];

const Roadmap = () => {
  return (
    <section className="py-20 bg-background font-tajawal text-foreground border-t border-border/40">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* رأس القسم */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
            خطوات التعلم
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            هنتعلم إزاي سوا؟
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            من أول ما تبدأ من الصفر لحد ما تقف على رجلك وتشتغل باحتراف.
          </p>
        </div>

        {/* الكروت */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {journeySteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="flex flex-col h-full bg-card border border-border rounded-2xl p-6 relative group hover:border-primary/40 transition-colors"
              >
                {/* رأس الكارت */}
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-xl bg-muted border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-1 rounded-md">
                    {step.badge}
                  </span>
                </div>

                {/* المحتوى */}
                <div className="space-y-2 mt-auto">
                  <h3 className="text-lg font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* زر الانتقال */}
        <div className="mt-12 text-center">
          <Link to="/courses">
            <Button variant="outline" className="border-border hover:bg-primary hover:text-primary-foreground px-8 h-12 rounded-xl text-sm font-medium gap-2 transition-all">
              <span>استكشف الكورسات المتاحة</span>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Roadmap;
