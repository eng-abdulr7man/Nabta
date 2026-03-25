import { Star, Users, BookOpen, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { getSpecIcon } from "@/lib/icons";
import {
  useSpecializations,
  useEnrollmentsCount,
  useLessonsCount,
  useCourseRating,
} from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast"; // إضافة إشعارات التوست

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  specialization_id: string | null;
  thumbnail_url?: string;
  index?: number;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  specialization_id,
  thumbnail_url,
  index = 0,
}: CourseCardProps) => {
  const { data: specs } = useSpecializations();
  const { data: enrolledCount } = useEnrollmentsCount(id);
  const { data: lessonsCount } = useLessonsCount(id);
  const { data: ratingData } = useCourseRating(id);
  const { toast } = useToast();

  const [imgLoaded, setImgLoaded] = useState(false);

  const spec = useMemo(
    () => specs?.find((s) => s.id === specialization_id),
    [specs, specialization_id]
  );

  const Icon = spec ? getSpecIcon(spec.icon) : BookOpen;

  // دالة المشاركة (نسخ الرابط)
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // منع تفعيل الـ Link
    e.stopPropagation(); // منع انتشار الحدث
    
    const courseUrl = `${window.location.origin}/courses/${id}`;
    
    navigator.clipboard.writeText(courseUrl).then(() => {
      toast({
        title: "تم نسخ الرابط! 🔗",
        description: "الرابط جاهز للمشاركة مع أصدقائك.",
      });
    }).catch(() => {
      toast({
        title: "خطأ",
        description: "لم نتمكن من نسخ الرابط.",
        variant: "destructive"
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link to={`/courses/${id}`} className="block group h-full">
        <div className="relative h-full flex flex-col rounded-[2rem] overflow-hidden border border-neutral-800/60 bg-[#0a0f0c] shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1">

          {/* Image Section */}
          <div className="relative w-full aspect-[4/3] sm:aspect-video bg-[#121A15] overflow-hidden shrink-0">

            {/* زر المشاركة (Share) */}
            <button 
              onClick={handleShare}
              title="مشاركة الكورس"
              className="absolute top-3 left-3 z-20 bg-black/50 hover:bg-emerald-600 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:border-emerald-500 transition-all duration-300 shadow-lg opacity-90 group-hover:opacity-100"
            >
              <Share2 className="w-4 h-4 text-white" />
            </button>

            {!imgLoaded && thumbnail_url && (
              <div className="absolute inset-0 animate-pulse bg-[#1a241c]" />
            )}

            {thumbnail_url ? (
              <>
                <img
                  src={thumbnail_url}
                  alt={title}
                  loading="lazy"
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                    imgLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
                {/* ضل متدرج لتوضيح النصوص لو فيه */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-90 z-10 pointer-events-none" />
              </>
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-emerald-900/10 to-transparent">
                <BookOpen className="w-16 h-16 text-emerald-500/20" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 md:p-6 flex flex-col flex-1 relative z-20 -mt-3 bg-[#0a0f0c] rounded-t-3xl">

            <div className="mb-auto space-y-2.5">
              <h3 className="font-bold text-xl line-clamp-2 group-hover:text-emerald-400 transition-colors text-white leading-snug">
                {title}
              </h3>

              <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-neutral-500">
                بواسطة <span className="text-neutral-300 font-bold">{instructor}</span>
              </p>

              {/* Specialization */}
              {spec && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Icon className="w-3.5 h-3.5" />
                  {spec.name}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-800/60 text-xs font-medium">
                
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <BookOpen className="w-4 h-4 text-emerald-500/70" />
                  <span>{lessonsCount ?? 0} درس</span>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-400">
                  <Users className="w-4 h-4 text-emerald-500/70" />
                  <span>{enrolledCount ?? 0} طالب</span>
                </div>

                {ratingData && ratingData.avg > 0 && (
                  <div className="flex items-center gap-1.5 text-white">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span>{ratingData.avg.toFixed(1)}</span>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
