import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Star } from "lucide-react";
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

  // Get all ratings for this course
  const { data: ratings } = useQuery({
    queryKey: ["course-ratings-list", courseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (!data || data.length === 0) return [];
      
      // Fetch profiles for rating users
      const userIds = [...new Set(data.map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, avatar_url")
        .in("user_id", userIds);
      
      return data.map((r: any) => ({
        ...r,
        profile: profiles?.find((p: any) => p.user_id === r.user_id),
      }));
    },
  });

  // Get user's existing rating
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

  const submitRating = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("يجب تسجيل الدخول");
      if (selectedRating === 0) throw new Error("اختر تقييماً");
      
      if (myRating) {
        const { error } = await supabase
          .from("ratings")
          .update({ rating: selectedRating, comment })
          .eq("id", myRating.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("ratings")
          .insert({ user_id: user.id, course_id: courseId, rating: selectedRating, comment });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: myRating ? "تم تحديث التقييم" : "شكراً لتقييمك!" });
      queryClient.invalidateQueries({ queryKey: ["course-ratings-list", courseId] });
      queryClient.invalidateQueries({ queryKey: ["my-rating", courseId] });
      queryClient.invalidateQueries({ queryKey: ["course-rating", courseId] });
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">التقييمات والمراجعات</h2>

      {/* Rating form */}
      {user && (
        <div className="glass-card p-5 space-y-4">
          <p className="text-sm font-medium text-foreground">{myRating ? "تعديل تقييمك" : "أضف تقييمك"}</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                onClick={() => setSelectedRating(star)}
                className="p-0.5"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= (hoveredStar || selectedRating)
                      ? "text-yellow-500 fill-current"
                      : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
          </div>
          <textarea
            placeholder="اكتب مراجعتك (اختياري)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
          />
          <Button
            size="sm"
            onClick={() => submitRating.mutate()}
            disabled={submitRating.isPending || selectedRating === 0}
            className="bg-primary text-primary-foreground"
          >
            {submitRating.isPending ? "جاري الإرسال..." : myRating ? "تحديث التقييم" : "إرسال التقييم"}
          </Button>
        </div>
      )}

      {/* Ratings list */}
      {(ratings || []).length === 0 ? (
        <p className="text-center text-muted-foreground py-8">لا توجد تقييمات بعد</p>
      ) : (
        <div className="space-y-3">
          {(ratings || []).map((r: any, i: number) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="glass-card p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {r.profile?.full_name?.charAt(0) || "م"}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{r.profile?.full_name || "متعلم"}</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3.5 h-3.5 ${star <= r.rating ? "text-yellow-500 fill-current" : "text-muted-foreground/20"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RatingSection;
