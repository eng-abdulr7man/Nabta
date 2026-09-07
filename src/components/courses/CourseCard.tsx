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
import { useToast } from "@/hooks/use-toast";

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

  // دالة المشاركة بأسلوب بشري طبيعي
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const courseUrl = `${window.location.origin}/courses/${id}`;
    
    navigator.clipboard.writeText(courseUrl).then(() => {
      toast({
        title: "تمام، اتنسخ الرابط.",
        description: "تقدر تشاركه مع زمايلك دلوقتي.",
      });
    }).catch(() => {
      toast({
        title: "حصلت مشكلة",
        description: "معرفناش ننسخ الرابط، جرب تاني.",
        variant: "destructive"
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.35,
        ease: "easeOut",
      }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Link to={`/courses/${id}`} className="block group h-full">
        <div className="relative h-full flex flex-col rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:border-primary/50 transition-all duration-200">

          {/* صورة الكورس */}
          <div className="relative w-full aspect-video bg-muted overflow-hidden shrink-0">

            {/* زر المشاركة */}
            <button 
              onClick={handleShare}
              title="مشاركة الكورس"
              className="absolute top-3 left-3 z-20 bg-background/90 hover:bg-background p-2 rounded-xl border border-border text-foreground transition-all shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>

            {!imgLoaded && thumbnail_url && (
              <div className="absolute inset-0 animate-pulse bg-muted" />
            )}

            {thumbnail_url ? (
              <img
                src={thumbnail_url}
                alt={title}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                  imgLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-muted">
                <BookOpen className="w-10 h-10 text-muted-foreground/40" />
              </div>
            )}
          </div>

          {/* محتوى الكورس */}
          <div className="p-4 md:p-5 flex flex-col flex-1 justify-between">

            <div>
              <div className="mb-2.5 flex items-center justify-between">
                {spec && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-muted text-primary border border-border">
                    <Icon className="w-3 h-3" />
                    {spec.name}
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  بواسطة <strong className="text-foreground">{instructor}</strong>
                </span>
              </div>

              <h3 className="font-bold text-base line-clamp-1 group-hover:text-primary transition-colors text-foreground mb-1.5">
                {title}
              </h3>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {description}
              </p>
            </div>

            {/* الإحصائيات السفلية */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border text-xs text-muted-foreground font-medium">
              
              <div className="flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-primary" />
                <span>{lessonsCount ?? 0} درس</span>
              </div>

              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-primary" />
                <span>{enrolledCount ?? 0} طالب</span>
              </div>

              {ratingData && ratingData.avg > 0 && (
                <div className="flex items-center gap-1 text-foreground">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{ratingData.avg.toFixed(1)}</span>
                </div>
              )}

            </div>

          </div>
        </div>
      </Link>
    </motion.div>
  );
};

CourseCard.displayName = "CourseCard";

export default CourseCard;
