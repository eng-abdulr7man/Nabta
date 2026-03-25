// import { useState } from "react";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/contexts/AuthContext";
// import { useToast } from "@/hooks/use-toast";
// import { Star } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { motion } from "framer-motion";

// interface RatingSectionProps {
//   courseId: string;
// }

// const RatingSection = ({ courseId }: RatingSectionProps) => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const [hoveredStar, setHoveredStar] = useState(0);
//   const [selectedRating, setSelectedRating] = useState(0);
//   const [comment, setComment] = useState("");

//   // Get all ratings for this course
//   const { data: ratings } = useQuery({
//     queryKey: ["course-ratings-list", courseId],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("ratings")
//         .select("*")
//         .eq("course_id", courseId)
//         .order("created_at", { ascending: false });
//       if (error) throw error;
//       if (!data || data.length === 0) return [];
      
//       // Fetch profiles for rating users
//       const userIds = [...new Set(data.map((r: any) => r.user_id))];
//       const { data: profiles } = await supabase
//         .from("profiles")
//         .select("user_id, full_name, avatar_url")
//         .in("user_id", userIds);
      
//       return data.map((r: any) => ({
//         ...r,
//         profile: profiles?.find((p: any) => p.user_id === r.user_id),
//       }));
//     },
//   });

//   // Get user's existing rating
//   const { data: myRating } = useQuery({
//     queryKey: ["my-rating", courseId, user?.id],
//     queryFn: async () => {
//       const { data } = await supabase
//         .from("ratings")
//         .select("*")
//         .eq("course_id", courseId)
//         .eq("user_id", user!.id)
//         .maybeSingle();
//       if (data) {
//         setSelectedRating(data.rating);
//         setComment(data.comment || "");
//       }
//       return data;
//     },
//     enabled: !!user,
//   });

//   const submitRating = useMutation({
//     mutationFn: async () => {
//       if (!user) throw new Error("يجب تسجيل الدخول");
//       if (selectedRating === 0) throw new Error("اختر تقييماً");
      
//       if (myRating) {
//         const { error } = await supabase
//           .from("ratings")
//           .update({ rating: selectedRating, comment })
//           .eq("id", myRating.id);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase
//           .from("ratings")
//           .insert({ user_id: user.id, course_id: courseId, rating: selectedRating, comment });
//         if (error) throw error;
//       }
//     },
//     onSuccess: () => {
//       toast({ title: myRating ? "تم تحديث التقييم" : "شكراً لتقييمك!" });
//       queryClient.invalidateQueries({ queryKey: ["course-ratings-list", courseId] });
//       queryClient.invalidateQueries({ queryKey: ["my-rating", courseId] });
//       queryClient.invalidateQueries({ queryKey: ["course-rating", courseId] });
//     },
//     onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
//   });

//   return (
//     <div className="space-y-6">
//       <h2 className="text-xl font-bold text-foreground">التقييمات والمراجعات</h2>

//       {/* Rating form */}
//       {user && (
//         <div className="glass-card p-5 space-y-4">
//           <p className="text-sm font-medium text-foreground">{myRating ? "تعديل تقييمك" : "أضف تقييمك"}</p>
//           <div className="flex gap-1">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <button
//                 key={star}
//                 onMouseEnter={() => setHoveredStar(star)}
//                 onMouseLeave={() => setHoveredStar(0)}
//                 onClick={() => setSelectedRating(star)}
//                 className="p-0.5"
//               >
//                 <Star
//                   className={`w-7 h-7 transition-colors ${
//                     star <= (hoveredStar || selectedRating)
//                       ? "text-yellow-500 fill-current"
//                       : "text-muted-foreground/30"
//                   }`}
//                 />
//               </button>
//             ))}
//           </div>
//           <textarea
//             placeholder="اكتب مراجعتك (اختياري)"
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             rows={3}
//             className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
//           />
//           <Button
//             size="sm"
//             onClick={() => submitRating.mutate()}
//             disabled={submitRating.isPending || selectedRating === 0}
//             className="bg-primary text-primary-foreground"
//           >
//             {submitRating.isPending ? "جاري الإرسال..." : myRating ? "تحديث التقييم" : "إرسال التقييم"}
//           </Button>
//         </div>
//       )}

//       {/* Ratings list */}
//       {(ratings || []).length === 0 ? (
//         <p className="text-center text-muted-foreground py-8">لا توجد تقييمات بعد</p>
//       ) : (
//         <div className="space-y-3">
//           {(ratings || []).map((r: any, i: number) => (
//             <motion.div
//               key={r.id}
//               initial={{ opacity: 0, y: 10 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ delay: i * 0.05 }}
//               viewport={{ once: true }}
//               className="glass-card p-4"
//             >
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
//                   {r.profile?.full_name?.charAt(0) || "م"}
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium text-foreground">{r.profile?.full_name || "متعلم"}</p>
//                   <div className="flex gap-0.5">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <Star
//                         key={star}
//                         className={`w-3.5 h-3.5 ${star <= r.rating ? "text-yellow-500 fill-current" : "text-muted-foreground/20"}`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               </div>
//               {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
//             </motion.div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default RatingSection;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Star, User } from "lucide-react";
import { motion } from "framer-motion";

const RatingSection = ({ courseId }: { courseId: string }) => {
  // جلب التقييمات مع بيانات اليوزر (الاسم والصورة) من جدول profiles
  const { data: reviews, isLoading } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="text-center text-neutral-500 py-8 animate-pulse">جاري تحميل التقييمات...</div>;
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10 bg-[#121A15] rounded-2xl border border-neutral-800/50">
        <Star className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
        <p className="text-neutral-400 font-medium">لا توجد تقييمات لهذا الكورس حتى الآن.</p>
        <p className="text-sm text-neutral-500 mt-1">كن أول من يشارك رأيه!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        آراء وتقييمات الطلاب
      </h3>

      <div className="space-y-4">
        {reviews.map((review, index) => {
          // استخراج بيانات اليوزر بأمان
          const userProfile = review.profiles;
          const fullName = userProfile?.full_name || "طالب في نبتة";
          const avatarUrl = userProfile?.avatar_url;
          // جلب أول حرف من الاسم لو مفيش صورة
          const initial = fullName.charAt(0).toUpperCase();

          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              key={review.id}
              className="bg-[#0a0f0c] border border-neutral-800/60 p-5 rounded-2xl shadow-sm"
            >
              <div className="flex items-start gap-4">
                
                {/* 🌟 صورة اليوزر أو الحرف الأول 🌟 */}
                <div className="shrink-0 w-12 h-12 rounded-full overflow-hidden bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt={fullName} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-emerald-500 font-bold text-lg">
                      {initial}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                    <h4 className="font-bold text-white truncate text-base">
                      {fullName}
                    </h4>
                    
                    {/* النجوم */}
                    <div className="flex items-center gap-1 shrink-0">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? "text-yellow-500 fill-yellow-500"
                              : "text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* التعليق */}
                  {review.comment && (
                    <p className="text-neutral-400 text-sm leading-relaxed whitespace-pre-wrap mt-2">
                      {review.comment}
                    </p>
                  )}
                  
                  {/* تاريخ التقييم (اختياري بس بيدي شكل حلو) */}
                  <span className="text-[10px] text-neutral-600 block mt-3">
                    {new Date(review.created_at).toLocaleDateString("ar-EG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default RatingSection;
