import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const { user } = useAuth();

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="خلفية زراعية" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              🌱 منصة تعليمية زراعية متكاملة
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground leading-tight"
          >
            تعلّم <span className="gradient-text">الزراعة الذكية</span>
            <br />
            مع أفضل المتخصصين
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            أكثر من 100 كورس متخصص في 8 تخصصات زراعية مختلفة. ابدأ رحلتك التعليمية اليوم مع AgriSmart Academy
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/courses">
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 gap-2">
                تصفح الكورسات
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            {!user && (
              <Link to="/register">
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary px-8">
                  إنشاء حساب مجاني
                </Button>
              </Link>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="flex items-center justify-center gap-8 pt-8"
          >
            {[
              { icon: BookOpen, label: "كورس", value: "100+" },
              { icon: Users, label: "متعلم", value: "5,000+" },
              { icon: Award, label: "شهادة", value: "2,000+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
