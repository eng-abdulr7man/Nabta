import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquareHeart, BookOpen, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_REVIEWS = [
  { id: "f1", name: "م. أحمد محمود", initial: "أ", rating: 5, comment: "الكورسات هنا غيرت نظرتي للزراعة الحديثة، محتوى دسم وعملي جداً وربط العلم بالسوق.", courseTitle: "أساسيات الزراعة المائية" },
  { id: "f2", name: "محمود سعد", initial: "م", rating: 5, comment: "اشتريت تقاوي الطماطم من المتجر والإنتاجية كانت ممتازة. شكراً نبتة على المصداقية!", courseTitle: "" },
  { id: "f3", name: "د. فاطمة علي", initial: "ف", rating: 4, comment: "المستشار الذكي ساعدني كتير في تشخيص نقص العناصر في محصولي ووفر عليا وقت طويل.", courseTitle: "تسميد المحاصيل الحقلية" },
  { id: "f4", name: "يوسف إبراهيم", initial: "ي", rating: 5, comment: "منصة متكاملة فعلاً، من التعليم لتوفير المستلزمات. أنصح بها بشدة لكل مهندس ومزارع.", courseTitle: "إدارة المزارع الذكية" },
  { id: "f5", name: "كريم حسن", initial: "ك", rating: 5, comment: "شرح المهندسين في الكورسات مبسط جداً، والشهادة فرقت معايا في شغلي.", courseTitle: "لاندسكيب وتنسيق حدائق" }
];

const TestimonialsWall = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("ratings")
          .select("*")
          .gte("rating", 4)
          .order("created_at", { ascending: false })
          .limit(8);

        if (ratingsError) throw ratingsError;

        if (!ratingsData || ratingsData.length < 3) {
          setReviews(FALLBACK_REVIEWS);
          setIsLoading(false);
          return;
        }

        const userIds = [...new Set(ratingsData.map((r) => r.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        const profilesMap: Record<string, any> = {};
        if (profilesData) {
          profilesData.forEach((p) => { profilesMap[p.user_id] = p; });
        }

        const courseIds = [...new Set(ratingsData.map((r) => r.course_id).filter(Boolean))];
        const { data: coursesData } = await supabase
          .from("courses")
          .select("id, title")
          .in("id", courseIds);

        const coursesMap: Record<string, string> = {};
        if (coursesData) {
          coursesData.forEach((c) => { coursesMap[c.id] = c.title; });
        }

        const formattedReviews = ratingsData.map((r) => {
          const profile = profilesMap[r.user_id];
          const name = profile?.full_name || "مستخدم نبتة";
          const courseTitle = coursesMap[r.course_id] || ""; 

          return {
            id: r.id,
            name: name,
            initial: name.charAt(0).toUpperCase(),
            avatar: profile?.avatar_url,
            rating: r.rating,
            comment: r.comment || "تقييم إيجابي بدون تعليق.",
            courseTitle: courseTitle
          };
        });

        const reviewsWithComments = formattedReviews.filter(r => r.comment && r.comment.length > 10);
        setReviews(reviewsWithComments.length >= 3 ? reviewsWithComments : FALLBACK_REVIEWS);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews(FALLBACK_REVIEWS); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopReviews();
  }, []);

  // تكرار العناصر 3 مرات لضمان حركة مستمرة وسلسة بدون فراغات
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  if (isLoading) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-background font-tajawal border-t border-border">
      
      {/* خلفية جمالية مضيئة */}

      {/* عنوان القسم */}
      <div className="container mx-auto px-4 relative z-10 mb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 text-primary text-sm font-bold mb-4 shadow-sm">
            <MessageSquareHeart className="w-4 h-4" />
            جدار الثقة
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground leading-tight">
            آراء طلابنا عن <span className="text-primary">نبتة</span>
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            نفخر بثقة المهندسين والمزارعين في كورساتنا ومنتجاتنا، نجاحكم في الغيط هو معيارنا الأول.
          </p>
        </motion.div>
      </div>

      {/* شريط التحريك السلس (CSS Marquee) */}
      <div className="relative w-full overflow-hidden py-4" dir="ltr">
        
        {/* تدرجات أطراف الشاشة لإنهاء الحركة بشكل ناعم */}
        <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-[#050806] via-[#050806]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-[#050806] via-[#050806]/80 to-transparent z-20 pointer-events-none" />

        <div className="flex gap-6 w-max marquee-track hover:[animation-play-state:paused]">
          {duplicatedReviews.map((review, idx) => (
            <div 
              key={`${review.id}-${idx}`} 
              dir="rtl"
              className="w-[340px] md:w-[400px] shrink-0 bg-muted border border-border rounded-3xl p-6 md:p-8 hover:border-primary/20 hover:bg-muted transition-all duration-300 relative group flex flex-col justify-between shadow-xl"
            >
              <Quote className="absolute top-6 left-6 w-10 h-10 text-primary/10 group-hover:text-primary/20 transition-colors rotate-180 pointer-events-none" />
              
              <div>
                {/* النجوم */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-800"}`} 
                    />
                  ))}
                </div>

                {/* نص التقييم */}
                <p className="text-foreground text-sm md:text-base leading-relaxed mb-6 line-clamp-4"> "{review.comment}"
                </p>
              </div>

              {/* بيانات صاحب التقييم */}
              <div className="flex items-center gap-3.5 border-t border-border pt-5 mt-auto">
                <div className="w-12 h-12 rounded-full bg-accent border border-primary/20 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-lg">{review.initial}</span>
                  )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <h4 className="text-foreground font-bold text-sm mb-1 truncate">{review.name}</h4>
                  
                  {review.courseTitle ? (
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-muted-foreground">
                      <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="shrink-0">كورس:</span>
                      <span className="text-primary font-bold truncate">{review.courseTitle}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[11px] md:text-xs text-primary font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>طالب وعميل موثق</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* كود CSS المخصص للحركة الناعمة (GPU Accelerated) */}
      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .marquee-track {
          animation: marquee 35s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsWall;
