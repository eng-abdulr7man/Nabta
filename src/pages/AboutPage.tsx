import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { motion } from "framer-motion";
import { Sprout, Target, Award, Users } from "lucide-react";

const features = [
  { icon: Target, title: "رؤيتنا", desc: "أن نكون المنصة الرائدة في التعليم الزراعي الإلكتروني في الوطن العربي." },
  { icon: Award, title: "مهمتنا", desc: "تقديم محتوى تعليمي عالي الجودة يساهم في تطوير القطاع الزراعي وتأهيل الكوادر المتخصصة." },
  { icon: Users, title: "فريقنا", desc: "نخبة من الأساتذة والخبراء المتخصصين في مختلف فروع العلوم الزراعية." },
];

const AboutPage = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 pt-24 pb-20 md:pb-8">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-10">
            <Sprout className="w-14 h-14 text-primary mx-auto mb-3" />
            <h1 className="text-3xl font-black text-foreground mb-2">عن المنصة</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              أكاديمية MuAgriSmart هي منصة تعليمية إلكترونية متخصصة في العلوم الزراعية، تهدف إلى نشر المعرفة الزراعية وتطوير المهارات العملية من خلال كورسات احترافية.
            </p>
          </div>

          <div className="grid gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-6 flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground mb-1">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
    <Footer />
    <BottomNav />
  </div>
);

export default AboutPage;
