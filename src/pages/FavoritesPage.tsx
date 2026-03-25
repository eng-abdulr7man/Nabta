import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, BookOpen, PlayCircle, User, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar"; // تأكد إن ده مسار الناف بار بتاعك
import { toast } from "sonner";

const FavoritesPage = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from("favorites")
      .select(`
        id,
        created_at,
        courses (
          id,
          title,
          description,
          instructor,
          thumbnail_url
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("حدث خطأ أثناء تحميل المفضلة.");
    } else {
      setFavorites(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("id", favoriteId);

    if (error) {
      toast.error("لم نتمكن من إزالة الكورس، حاول مرة أخرى.");
    } else {
      toast.success("تم إزالة الكورس من المفضلة 💔");
      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#050806] text-white font-tajawal">
          <div className="text-center space-y-4">
            <Heart className="w-16 h-16 text-neutral-600 mx-auto opacity-50" />
            <h2 className="text-2xl font-bold">يجب تسجيل الدخول أولاً</h2>
            <Link to="/login" className="inline-block bg-emerald-600 px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-500 transition-colors">
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* استدعاء الناف بار هنا */}
      <Navbar />
      
      <div className="min-h-screen bg-[#050806] text-white font-tajawal pt-24 md:pt-32 pb-20 relative overflow-x-hidden selection:bg-emerald-500/30" dir="rtl">
        
        {/* إضاءات خلفية */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-5 pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-red-900/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-7xl">
          
          {/* Header */}
          <div className="flex items-center gap-4 mb-10 md:mb-16 border-b border-white/5 pb-8">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
              <Heart className="w-7 h-7 text-red-500 fill-red-500/20" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2 flex items-center gap-2">
                كورساتي المفضلة
              </h1>
              <p className="text-neutral-500 text-sm md:text-base">
                قائمة بالكورسات التي أضفتها لتشاهدها لاحقاً.
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
              <p className="text-neutral-400">جاري تحميل كورساتك المفضلة...</p>
            </div>
          ) : favorites.length === 0 ? (
            /* Empty State */
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-32 bg-[#0a0f0c] rounded-[2rem] border border-white/5 shadow-2xl text-center px-4"
            >
              <div className="w-24 h-24 rounded-full bg-neutral-900 border border-white/5 flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-neutral-600" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">القائمة فارغة حالياً</h3>
              <p className="text-neutral-400 max-w-md mb-8 leading-relaxed">
                لم تقم بإضافة أي كورسات للمفضلة بعد. تصفح مكتبة الكورسات وابدأ في إضافة ما يهمك لتعود إليه بسهولة.
              </p>
              <Link to="/courses" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-900/20">
                <BookOpen className="w-5 h-5" /> استكشف الكورسات
              </Link>
            </motion.div>
          ) : (
            /* شبكة الكورسات المفضلة */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              <AnimatePresence>
                {favorites.map((fav, idx) => {
                  const course = fav.courses; 
                  if (!course) return null; 

                  return (
                    <motion.div 
                      key={fav.id}
                      layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group flex flex-col bg-[#0a0f0c] rounded-[1.5rem] md:rounded-[2rem] border border-white/5 overflow-hidden hover:border-emerald-500/30 transition-all shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10"
                    >
                      {/* صورة الكورس */}
                      <Link to={`/courses/${course.id}`} className="block relative h-48 sm:h-56 bg-neutral-900 overflow-hidden">
                        {course.thumbnail_url ? (
                          <img src={course.thumbnail_url} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-700">
                            <BookOpen className="w-12 h-12 opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-90" />
                        
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/10 group-hover:bg-emerald-500/20 transition-colors">
                          <PlayCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                      </Link>

                      {/* تفاصيل الكورس */}
                      <div className="p-5 flex flex-col flex-1 relative z-10 -mt-6 bg-[#0a0f0c] rounded-t-2xl">
                        <Link to={`/courses/${course.id}`}>
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
                            {course.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 text-neutral-400 text-sm mb-4 mt-auto">
                          <User className="w-4 h-4 text-emerald-500/70" />
                          <span className="truncate">{course.instructor || "نبتة أكاديمي"}</span>
                        </div>

                        {/* أزرار التحكم */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <Link 
                            to={`/courses/${course.id}`}
                            className="flex-1 text-center bg-white/5 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors ml-3 border border-white/5"
                          >
                            بدء التعلم
                          </Link>
                          <button 
                            onClick={() => removeFavorite(fav.id)}
                            title="إزالة من المفضلة"
                            className="p-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
