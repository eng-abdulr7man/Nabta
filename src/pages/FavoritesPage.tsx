// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { supabase } from "@/integrations/supabase/client";
// import { useAuth } from "@/contexts/AuthContext";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { Heart, Trash2 } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import CourseCard from "@/components/courses/CourseCard";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";
// import BottomNav from "@/components/layout/BottomNav";

// const FavoritesPage = () => {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const { data: favorites, isLoading } = useQuery({
//     queryKey: ["my-favorites", user?.id],
//     queryFn: async () => {
//       const { data, error } = await supabase
//         .from("favorites")
//         .select("*, courses(*)")
//         .eq("user_id", user!.id)
//         .order("created_at", { ascending: false });
//       if (error) throw error;
//       return data;
//     },
//     enabled: !!user,
//   });

//   const removeFav = useMutation({
//     mutationFn: async (favId: string) => {
//       const { error } = await supabase.from("favorites").delete().eq("id", favId);
//       if (error) throw error;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["my-favorites"] });
//       toast({ title: "تمت إزالة الكورس من المفضلة" });
//     },
//   });

//   return (
//     <div className="min-h-screen flex flex-col bg-background">
//       <Navbar />
//       <main className="flex-1 pt-24 pb-20 md:pb-8">
//         <div className="container mx-auto px-4">
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
//             <h1 className="text-3xl font-black text-foreground mb-2">المفضلة</h1>
//             <p className="text-muted-foreground">الكورسات التي أعجبتك وحفظتها</p>
//           </motion.div>

//           {isLoading ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {Array.from({ length: 3 }).map((_, i) => (
//                 <div key={i} className="glass-card h-80 animate-pulse" />
//               ))}
//             </div>
//           ) : !favorites || favorites.length === 0 ? (
//             <div className="text-center py-16">
//               <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
//               <p className="text-lg text-muted-foreground mb-4">لا توجد كورسات في المفضلة</p>
//               <Link to="/courses">
//                 <Button className="bg-primary text-primary-foreground">تصفح الكورسات</Button>
//               </Link>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {favorites.map((fav: any, i: number) => {
//                 const course = fav.courses;
//                 if (!course) return null;
//                 return (
//                   <div key={fav.id} className="relative group">
//                     <CourseCard {...course} index={i} />
//                     <button
//                       onClick={(e) => { e.preventDefault(); removeFav.mutate(fav.id); }}
//                       className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </main>
//       <Footer />
//       <BottomNav />
//     </div>
//   );
// };

// export default FavoritesPage;

//v2
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trash2, HeartOff } from "lucide-react";
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

  // تمرير لأعلى الصفحة عند الفتح
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      toast({ title: "تمت إزالة الكورس من المفضلة", variant: "default" });
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#050806] font-tajawal selection:bg-emerald-500/30">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-24 md:pb-16 relative overflow-hidden">
        
        {/* إضاءات خلفية (Ambient Glows) */}
        <div className="absolute top-0 left-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-900/10 blur-[150px] pointer-events-none" />
        <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-emerald-900/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          
          {/* ======================================= */}
          {/* الهيدر */}
          {/* ======================================= */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-10 lg:mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#121A15] border border-neutral-800 text-emerald-400 text-sm font-medium shadow-[0_0_20px_rgba(16,185,129,0.05)] mb-4">
              <Heart className="w-4 h-4" />
              قائمتي
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
              الكورسات <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-green-600">المفضلة</span>
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl leading-relaxed">
              احتفظ ببرامجك التدريبية المفضلة هنا للعودة إليها والبدء في تعلمها في أي وقت.
            </p>
          </motion.div>

          {/* ======================================= */}
          {/* المحتوى (Loading, Empty State, Grid) */}
          {/* ======================================= */}
          {isLoading ? (
            
            // --- حالة التحميل (Premium Skeletons) ---
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 rounded-3xl p-4 h-[400px] flex flex-col animate-pulse shadow-lg">
                  <div className="w-full h-48 bg-[#121A15] rounded-2xl mb-4 border border-neutral-800/50" />
                  <div className="space-y-3 flex-1">
                    <div className="h-4 w-1/3 bg-emerald-900/20 rounded-md mb-3" />
                    <div className="h-6 w-full bg-[#121A15] rounded-md" />
                    <div className="h-6 w-3/4 bg-[#121A15] rounded-md" />
                  </div>
                  <div className="h-10 w-full bg-[#121A15] rounded-xl mt-4" />
                </div>
              ))}
            </div>

          ) : !favorites || favorites.length === 0 ? (
            
            // --- حالة القائمة الفارغة (Empty State) ---
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 px-4 text-center bg-[#0a0f0c] border border-dashed border-neutral-800 rounded-[2rem] shadow-lg max-w-2xl mx-auto mt-8"
            >
              <div className="w-20 h-20 bg-[#121A15] rounded-2xl flex items-center justify-center mb-6 border border-neutral-800 shadow-inner relative">
                <div className="absolute inset-0 bg-red-500/5 rounded-2xl blur-md" />
                <HeartOff className="w-10 h-10 text-neutral-500 relative z-10" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">قائمتك فارغة</h3>
              <p className="text-neutral-400 max-w-sm mb-8 leading-relaxed">
                لم تقم بإضافة أي كورسات إلى المفضلة بعد. تصفح مكتبتنا واحتفظ بالكورسات التي تهمك هنا.
              </p>
              <Link to="/courses">
                <Button className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 h-12 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  تصفح الكورسات
                </Button>
              </Link>
            </motion.div>

          ) : (
            
            // --- عرض الكورسات المفضلة ---
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((fav: any, i: number) => {
                const course = fav.courses;
                if (!course) return null;
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={fav.id} 
                    className="relative group h-full"
                  >
                    <CourseCard {...course} index={i} />
                    
                    {/* زرار الحذف (محسّن للموبايل والكمبيوتر) */}
                    <button
                      onClick={(e) => { 
                        e.preventDefault(); 
                        removeFav.mutate(fav.id); 
                      }}
                      className="absolute top-4 left-4 z-20 w-10 h-10 rounded-xl bg-[#0a0f0c]/80 backdrop-blur-md border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-red-500 hover:border-red-500 transition-all duration-300 shadow-lg"
                      title="إزالة من المفضلة"
                    >
                      {removeFav.isPending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </motion.div>
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
