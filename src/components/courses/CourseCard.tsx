// import { Star, Users, BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { getSpecIcon } from "@/lib/icons";
// import { useSpecializations, useEnrollmentsCount, useLessonsCount, useCourseRating } from "@/hooks/useCourses";

// interface CourseCardProps {
//   id: string;
//   title: string;
//   description: string;
//   instructor: string;
//   specialization_id: string | null;
//   thumbnail_url?: string;
//   index?: number;
// }

// const CourseCard = ({
//   id,
//   title,
//   description,
//   instructor,
//   specialization_id,
//   thumbnail_url,
//   index = 0,
// }: CourseCardProps) => {
//   const { data: specs } = useSpecializations();
//   const { data: enrolledCount } = useEnrollmentsCount(id);
//   const { data: lessonsCount } = useLessonsCount(id);
//   const { data: ratingData } = useCourseRating(id);
//   const spec = specs?.find((s) => s.id === specialization_id);
//   const Icon = spec ? getSpecIcon(spec.icon) : BookOpen;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.1, duration: 0.4 }}
//       viewport={{ once: true }}
//     >
//       <Link to={`/courses/${id}`}>
//         <div className="glass-card hover-lift overflow-hidden group cursor-pointer">
//           <div className="h-44 bg-gradient-to-br from-primary/20 to-accent/10 relative overflow-hidden">
//             {thumbnail_url ? (
//               <img src={thumbnail_url} alt={`صورة كورس ${title}`} className="w-full h-full object-cover" />
//             ) : (
//               <div className="absolute inset-0 flex items-center justify-center">
//                 <Icon className="w-16 h-16 text-primary/30" />
//               </div>
//             )}
//             {spec && (
//               <div className="absolute top-3 left-3">
//                 <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground">
//                   {spec.name}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="p-5 space-y-3">
//             <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
//               {title}
//             </h3>
//             <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
//             <p className="text-xs text-muted-foreground">بواسطة {instructor}</p>

//             <div className="flex items-center justify-between pt-2 border-t border-border">
//               <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                 <BookOpen className="w-3.5 h-3.5" />
//                 <span>{lessonsCount ?? 0} درس</span>
//               </div>
//               <div className="flex items-center gap-1 text-xs text-muted-foreground">
//                 <Users className="w-3.5 h-3.5" />
//                 <span>{enrolledCount ?? 0} طالب</span>
//               </div>
//               {ratingData && ratingData.avg > 0 && (
//                 <div className="flex items-center gap-1 text-xs text-yellow-500">
//                   <Star className="w-3.5 h-3.5 fill-current" />
//                   <span>{ratingData.avg}</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </Link>
//     </motion.div>
//   );
// };

// export default CourseCard;

import { Star, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { getSpecIcon } from "@/lib/icons";
import {
  useSpecializations,
  useEnrollmentsCount,
  useLessonsCount,
  useCourseRating,
} from "@/hooks/useCourses";

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

  // Memoized specialization lookup
  const spec = useMemo(
    () => specs?.find((s) => s.id === specialization_id),
    [specs, specialization_id]
  );

  const Icon = spec ? getSpecIcon(spec.icon) : BookOpen;

  // Memoized formatted rating
  const formattedRating = useMemo(() => {
    if (!ratingData || ratingData.avg <= 0) return null;
    return ratingData.avg.toFixed(1);
  }, [ratingData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.45,
        ease: "easeOut",
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <Link to={`/courses/${id}`} className="block">
        <div className="glass-card hover-lift overflow-hidden group cursor-pointer transition-all duration-300 border border-border/40 hover:border-primary/40">

          {/* Thumbnail */}
          <div className="h-44 relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/10">
            {thumbnail_url ? (
              <>
                <img
                  src={thumbnail_url}
                  alt={`صورة كورس ${title}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Premium overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className="w-16 h-16 text-primary/30 group-hover:scale-110 transition-transform duration-300" />
              </div>
            )}

            {spec && (
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-md text-foreground shadow-sm">
                  {spec.name}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>

            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
              {description}
            </p>

            <p className="text-xs text-muted-foreground">
              بواسطة <span className="text-foreground font-medium">{instructor}</span>
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">

              <div className="flex items-center gap-1 text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lessonsCount ?? 0} درس</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{enrolledCount ?? 0} طالب</span>
              </div>

              {formattedRating && (
                <div className="flex items-center gap-1 text-warning font-medium">
                  <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                  <span>{formattedRating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
