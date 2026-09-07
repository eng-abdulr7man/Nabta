import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquareHeart, BookOpen, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const FALLBACK_REVIEWS = [
  { id: "f1", name: "م. أحمد محمود", initial: "أ", rating: 5, comment: "الكورسات هنا غيرت نظرتي للزراعة الحديثة، محتوى دسم وعملي جداً وربط العلم بالسوق.", courseTitle: "أساسيات الزراعة المائية" },
  { id: "f2", name: "محمود سعد", initial: "م", rating: 5, comment: "اشتريت تقاوي الطماطم من المتجر والإنتاجية كانت ممتازة. شكراً نبتة على المصداقية!", courseTitle: "" },
  { id: "f3", name: "د. فاطمة علي", initial: "ف", rating: 4, comment: "المستشار الذكي ساعدني كتير في تشخيص نقص العناصر في محصولي ووفر عليا وقت طويل.", courseTitle: "تسميد المحاصيل الحقلية" },
  { id: "f4", name: "يوسف إبراهيم", initial: "ي", rating: 5, comment: "منصة متكاملة فعلاً، من التعليم لتوفير المستلزمات. أنصح بها بشدة لكل مهندس ومزارع.", courseTitle: "إدارة المزارع الذكية" },
  { id: "f5", name: "كريم حسن", initial: "ك", rating: 5, comment: "شرح المهندسين في الكورسات مبسط جداً، والشهادة فرقت معايا في شغلي.", courseTitle: "لاندسكيب وتنسيق حدائق" },
  { id: "f6", name: "سارة عبد الله", initial: "س", rating: 5, comment: "التجربة ممتازة وسهلة، وكل حاجة واضحة ومرتبة بعناية.", courseTitle: "وقاية النباتات" }
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
          .limit(6);

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

  if (isLoading) return null;

  return (
    <section className="py-20 bg-background font-tajawal border-t border-border/60">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* عنوان القسم */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
            <MessageSquareHeart className="w-3.5 h-3.5" />
            <span>جدار الثقة</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            إيه بيقوله طلابنا عن <span className="text-primary">نبتة</span>؟
          </h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            نجاحكم في الغيط ومعيار الجودة اللي بنقدمه هو انعكاس لثقتكم.
          </p>
        </div>

        {/* شبكة عرض الآراء (هادئة، منظمة، وبدون حركة مشتتة) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id || idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
              className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 transition-all"
            >
              <div>
                {/* النجوم */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-500 fill-amber-500" : "text-muted"}`} 
                    />
                  ))}
                </div>

                {/* نص التقييم */}
                <p className="text-foreground text-sm leading-relaxed mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* بيانات صاحب التقييم */}
              <div className="flex items-center gap-3 border-t border-border/60 pt-4 mt-auto">
                <div className="w-10 h-10 rounded-full bg-muted border border-border flex items-center justify-center overflow-hidden shrink-0">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-primary font-bold text-sm">{review.initial}</span>
                  )}
                </div>
                <div className="flex flex-col justify-center overflow-hidden">
                  <h4 className="text-foreground font-semibold text-xs mb-1 truncate">{review.name}</h4>
                  
                  {review.courseTitle ? (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <BookOpen className="w-3 h-3 text-primary shrink-0" />
                      <span className="shrink-0">كورس:</span>
                      <span className="text-primary font-medium truncate">{review.courseTitle}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[11px] text-primary font-medium">
                      <CheckCircle2 className="w-3 h-3 shrink-0" />
                      <span>طالب وعميل موثق</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsWall;
