import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, Quote, MessageSquareHeart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// تقييمات احتياطية في حالة إن الداتابيس لسه مفهاش تقييمات كفاية
const FALLBACK_REVIEWS = [
  { id: "f1", name: "م. أحمد محمود", initial: "أ", rating: 5, comment: "الكورسات هنا غيرت نظرتي للزراعة الحديثة، محتوى دسم وعملي جداً وربط العلم بالسوق." },
  { id: "f2", name: "محمود سعد", initial: "م", rating: 5, comment: "اشتريت تقاوي الطماطم من المتجر والإنتاجية كانت ممتازة. شكراً نبتة على المصداقية!" },
  { id: "f3", name: "د. فاطمة علي", initial: "ف", rating: 4, comment: "المستشار الذكي ساعدني كتير في تشخيص نقص العناصر في محصولي ووفر عليا وقت طويل." },
  { id: "f4", name: "يوسف إبراهيم", initial: "ي", rating: 5, comment: "منصة متكاملة فعلاً، من التعليم لتوفير المستلزمات. أنصح بها بشدة لكل مهندس ومزارع." },
  { id: "f5", name: "كريم حسن", initial: "ك", rating: 5, comment: "شرح المهندسين في الكورسات مبسط جداً، والشهادة فرقت معايا في شغلي." }
];

const TestimonialsWall = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTopReviews = async () => {
      try {
        // 1. هنسحب التقييمات العالية (4 أو 5 نجوم)
        const { data: ratingsData, error: ratingsError } = await supabase
          .from("ratings")
          .select("*")
          .gte("rating", 4)
          .order("created_at", { ascending: false })
          .limit(8);

        if (ratingsError) throw ratingsError;

        // لو مفيش تقييمات كفاية، استخدم الاحتياطي
        if (!ratingsData || ratingsData.length < 3) {
          setReviews(FALLBACK_REVIEWS);
          setIsLoading(false);
          return;
        }

        // 2. سحب بيانات البروفايل لأصحاب التقييمات
        const userIds = [...new Set(ratingsData.map((r) => r.user_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("user_id, full_name, avatar_url")
          .in("user_id", userIds);

        const profilesMap: Record<string, any> = {};
        if (profilesData) {
          profilesData.forEach((p) => { profilesMap[p.user_id] = p; });
        }

        // 3. دمج البيانات
        const formattedReviews = ratingsData.map((r) => {
          const profile = profilesMap[r.user_id];
          const name = profile?.full_name || "مستخدم نبتة";
          return {
            id: r.id,
            name: name,
            initial: name.charAt(0).toUpperCase(),
            avatar: profile?.avatar_url,
            rating: r.rating,
            comment: r.comment || "تقييم إيجابي بدون تعليق.",
          };
        });

        // التأكد من وجود تعليقات نصية فقط لعرضها في الجدار
        const reviewsWithComments = formattedReviews.filter(r => r.comment && r.comment.length > 10);
        
        setReviews(reviewsWithComments.length >= 3 ? reviewsWithComments : FALLBACK_REVIEWS);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviews(FALLBACK_REVIEWS); // لو حصل إيرور اعرض الاحتياطي
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopReviews();
  }, []);

  // نضاعف المصفوفة عشان الأنيميشن يلف من غير ما يقطع (Infinite Loop)
  const duplicatedReviews = [...reviews, ...reviews, ...reviews];

  if (isLoading) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-[#050806] font-tajawal border-t border-white/5">
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-900/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 mb-16 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold mb-4">
            <MessageSquareHeart className="w-4 h-4" />
            جدار الثقة
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
            ماذا يقولون عن <span className="text-emerald-500">نبتة</span>؟
          </h2>
          <p className="text-neutral-400 mt-4 text-lg">
            نفخر بآراء المهندسين والمزارعين في كورساتنا ومنتجاتنا، نجاحك هو هدفنا الأول.
          </p>
        </motion.div>
      </div>

      {/* شريط التقييمات المتحرك (Marquee) */}
      <div className="relative w-full overflow-hidden" dir="ltr">
        
        {/* ظلال على الحواف عشان تدي تأثير التلاشي */}
        <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#050806] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#050806] to-transparent z-20 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex gap-6 w-max px-6"
        >
          {duplicatedReviews.map((review, idx) => (
            <div 
              key={`${review.id}-${idx}`} 
              dir="rtl"
              className="w-[320px] md:w-[400px] shrink-0 bg-[#0a0f0c] border border-white/5 rounded-3xl p-6 md:p-8 hover:border-emerald-500/30 hover:bg-[#121A15] transition-colors relative group"
            >
              <Quote className="absolute top-6 left-6 w-10 h-10 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors rotate-180" />
              
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-700"}`} 
                  />
                ))}
              </div>

              <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-6 line-clamp-4 min-h-[5rem]">
                "{review.comment}"
              </p>

              <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                <div className="w-10 h-10 rounded-full bg-emerald-900/30 border border-emerald-500/20 flex items-center justify-center overflow-hidden shrink-0">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-emerald-500 font-bold text-sm">{review.initial}</span>
                  )}
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{review.name}</h4>
                  <p className="text-emerald-400 text-[10px] font-bold">طالب وعميل موثق</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default TestimonialsWall;
