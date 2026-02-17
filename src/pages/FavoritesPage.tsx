import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import CourseCard from "@/components/courses/CourseCard";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";

const FavoritesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["my-favorites", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*, courses(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const removeFav = useMutation({
    mutationFn: async (favId: string) => {
      const { error } = await supabase.from("favorites").delete().eq("id", favId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
      toast({ title: "تمت إزالة الكورس من المفضلة" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 md:pb-8">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-black text-foreground mb-2">المفضلة</h1>
            <p className="text-muted-foreground">الكورسات التي أعجبتك وحفظتها</p>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-card h-80 animate-pulse" />
              ))}
            </div>
          ) : !favorites || favorites.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">لا توجد كورسات في المفضلة</p>
              <Link to="/courses">
                <Button className="bg-primary text-primary-foreground">تصفح الكورسات</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((fav: any, i: number) => {
                const course = fav.courses;
                if (!course) return null;
                return (
                  <div key={fav.id} className="relative group">
                    <CourseCard {...course} index={i} />
                    <button
                      onClick={(e) => { e.preventDefault(); removeFav.mutate(fav.id); }}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

export default FavoritesPage;
