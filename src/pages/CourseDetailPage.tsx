import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import { useParams } from "react-router-dom";
import { mockCourses, specializations } from "@/data/mockData";
import { motion } from "framer-motion";
import { BookOpen, Users, Star, Clock, Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CourseDetailPage = () => {
  const { id } = useParams();
  const course = mockCourses.find((c) => c.id === id);
  const spec = specializations.find((s) => s.id === course?.specialization);

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground text-lg">الكورس غير موجود</p>
      </div>
    );
  }

  const mockSections = [
    {
      title: "المقدمة والأساسيات",
      lessons: [
        { title: "مقدمة عن الكورس", duration: "10:00" },
        { title: "المفاهيم الأساسية", duration: "15:30" },
        { title: "الأدوات المطلوبة", duration: "8:45" },
      ],
    },
    {
      title: "المحتوى المتقدم",
      lessons: [
        { title: "التطبيقات العملية", duration: "20:00" },
        { title: "دراسات الحالة", duration: "18:20" },
        { title: "المشروع النهائي", duration: "25:00" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-20 pb-20 md:pb-8">
        {/* Hero */}
        <div className="bg-gradient-to-b from-primary/10 to-transparent">
          <div className="container mx-auto px-4 py-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-4">
                {spec?.name}
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-foreground mb-4">{course.title}</h1>
              <p className="text-muted-foreground text-lg mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" /> {course.rating}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" /> {course.enrolledCount} متعلم
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> {course.lessonsCount} درس
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 12 ساعة
                </span>
              </div>

              <p className="text-sm text-muted-foreground">بواسطة <span className="text-primary">{course.instructor}</span></p>

              <div className="mt-6 flex gap-3">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 px-8">
                  التسجيل في الكورس
                </Button>
                <Button size="lg" variant="outline" className="border-border text-foreground hover:bg-secondary">
                  إضافة للمفضلة
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl">
            {/* What you'll learn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass-card p-6 mb-8"
            >
              <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                ماذا ستتعلم
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "فهم الأساسيات والمبادئ العلمية",
                  "تطبيق التقنيات الحديثة",
                  "تحليل البيانات الزراعية",
                  "إدارة المشاريع الزراعية",
                  "حل المشكلات العملية",
                  "الحصول على شهادة إتمام",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sections */}
            <h2 className="text-xl font-bold text-foreground mb-4">محتوى الكورس</h2>
            <div className="space-y-3">
              {mockSections.map((section, i) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card overflow-hidden"
                >
                  <div className="px-5 py-3 bg-secondary/50 font-bold text-sm text-foreground">
                    {section.title}
                  </div>
                  <div className="divide-y divide-border">
                    {section.lessons.map((lesson) => (
                      <div
                        key={lesson.title}
                        className="px-5 py-3 flex items-center justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{lesson.title}</span>
                        <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default CourseDetailPage;
