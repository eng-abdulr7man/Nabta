import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Star, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RatingSectionProps {
  courseId: string;
}

const RatingSection = ({ courseId }: RatingSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");

  // 1. جلب كل التقييمات الخاصة بالكورس مع بيانات المستخدمين
  const { data: ratings, isLoading: isLoadingRatings } = useQuery({
    queryKey: ["course-ratings-list", courseId],
    queryFn: async () => {
      // الخطوة الأولى: جلب التقييمات
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      if (!data || data.length === 0) return [];
      
      // الخطوة الثانية: استخراج معرفات المستخدمين وجلب بروفايلاتهم
      const userIds = [...new Set(data.map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);
      
      // الخطوة الثالثة: دمج البيانات
      return data.map((r: any) => ({
        ...r,
        profile: profiles?.find((p: any) => p.user_id === r.user_id),
      }));
    },
  });

  // 2. جلب تقييم المستخدم الحالي (لو موجود) عشان يقدر يعدله
  const { data: myRating } = useQuery({
    queryKey: ["my-rating", courseId, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("ratings")
        .select("*")
        .eq("course_id", courseId)
        .eq("user_id", user!.id)
        .maybeSingle();
        
      if (data) {
        setSelectedRating(data.rating);
        setComment(data.comment || "");
      }
      return data;
    },
    enabled: !!user,
  });

  // 3. دالة إرسال أو تحديث التقييم
  const submitRating = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول أولاً");
      if (selectedRating === 0) throw new Error("برجاء اختيار عدد النجوم أولاً");
      
      if (myRating) {
        // تحديث تقييم موجود
        const { error } = await supabase
          .from("ratings")
          .update({ rating: selectedRating, comment })
          .eq("id", myRating.id);
        if (error) throw error;
      } else {
        // إضافة تقييم جديد
        const { error } = await supabase
          .from("ratings")
          .insert({ user_id: user.id, course_id: courseId, rating: selectedRating, comment });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: myRating ? "تم تحديث تقييمك بنجاح ✨" : "شكراً لتقييمك الكورس! ✨" });
      queryClient.invalidateQueries({ queryKey: ["course-ratings-list", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-rating", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-rating", courseId] });
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-8 font-tajawal">
      
      <div className="flex items-center gap-3 border-b border-neutral-800/50 pb-4">
        <div className="w-10 h-10 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500/20" />
        </div>
        <h2 className="text-2xl font-bold text-white">التقييمات والمراجعات</h2>
      </div>

      {/* ========================================== */}
      {/* نموذج إضافة / تعديل التقييم (يظهر للمسجلين) */}
      {/* ========================================== */}
      {user && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-6 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900/10 blur-[50px] pointer-events-none" />
          
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <MessageSquarePlus className="w-5 h-5 text-emerald-500" />
            {myRating ? "تعديل تقييمك السابق" : "شاركنا رأيك في الكورس"}
          </h3>
          
          <div className="space-y-5 relative z-10">
            
            {/* النجوم التفاعلية */}
            <div className="flex gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setSelectedRating(star)}
                  className="p-1 transition-transform hover:scale-110 active:scale-90 outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-all duration-300 ${
                      star <= (hoveredStar || selectedRating)
                        ? "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                        : "text-neutral-700"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* مربع التعليق */}
            <textarea
              placeholder="اكتب مراجعتك عن الكورس وما الذي أعجبك فيه (اختياري)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-5 py-4 rounded-xl bg-[#121A15] border border-neutral-800 text-white text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none transition-all placeholder:text-neutral-600"
            />
            
            {/* زر الإرسال */}
            <Button
              onClick={() => submitRating.mutate()}
              disabled={submitRating.isPending || selectedRating === 0}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 h-12 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              {submitRating.isPending ? "جاري الحفظ..." : myRating ? "حفظ التعديلات" : "نشر التقييم"}
            </Button>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* قائمة التقييمات للطلاب */}
      {/* ========================================== */}
      {isLoadingRatings ? (
         <div className="text-center text-neutral-500 py-8 animate-pulse">جاري تحميل التقييمات...</div>
      ) : (ratings || []).length === 0 ? (
        <div className="text-center py-12 bg-[#121A15]/50 border border-dashed border-neutral-800 rounded-3xl">
          <Star className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
          <p className="text-neutral-400 font-medium">لا توجد تقييمات حتى الآن.</p>
          {!user && <p className="text-sm text-neutral-500 mt-2">سجل دخولك لتكون أول من يشارك رأيه!</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(ratings || []).map((r: any, i: number) => {
            const avatarUrl = r.profile?.avatar_url;
            const initial = (r.profile?.full_name || "م").charAt(0).toUpperCase();

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-[#121A15]/40 border border-white/5 p-5 rounded-2xl hover:border-emerald-500/20 transition-colors"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* صورة الطالب */}
                  <div className="w-12 h-12 shrink-0 rounded-full bg-emerald-900/20 border border-emerald-500/20 flex items-center justify-center overflow-hidden text-emerald-500 font-bold text-lg">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      initial
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-base font-bold text-white mb-1 truncate">
                      {r.profile?.full_name || "متعلم في نبتة"}
                    </p>
                    <div className="flex gap-1" dir="ltr">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= r.rating ? "text-yellow-500 fill-yellow-500" : "text-neutral-700"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                
                {r.comment && (
                  <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-3 mt-3">
                    {r.comment}
                  </p>
                )}
                
                <span className="text-[10px] text-neutral-600 block mt-3">
                  {new Date(r.created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RatingSection;
