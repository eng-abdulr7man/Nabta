

// import { Star, Users, BookOpen } from "lucide-react";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useMemo, useState } from "react";
// import { getSpecIcon } from "@/lib/icons";
// import {
//   useSpecializations,
//   useEnrollmentsCount,
//   useLessonsCount,
//   useCourseRating,
// } from "@/hooks/useCourses";

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

//   const [imgLoaded, setImgLoaded] = useState(false);

//   const spec = useMemo(
//     () => specs?.find((s) => s.id === specialization_id),
//     [specs, specialization_id]
//   );

//   const Icon = spec ? getSpecIcon(spec.icon) : BookOpen;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 25 }}
//       whileInView={{ opacity: 1, y: 0 }}
//       transition={{
//         delay: index * 0.07,
//         duration: 0.45,
//         ease: "easeOut",
//       }}
//       viewport={{ once: true }}
//     >
//       <Link to={`/courses/${id}`} className="block group">

//         <div className="relative rounded-xl overflow-hidden border border-border/40 bg-card shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">

//           {/* Image Section */}
//           <div className="relative w-full aspect-video bg-muted overflow-hidden">

//             {!imgLoaded && thumbnail_url && (
//               <div className="absolute inset-0 animate-pulse bg-muted" />
//             )}

//             {thumbnail_url ? (
//               <img
//                 src={thumbnail_url}
//                 alt={title}
//                 loading="lazy"
//                 onLoad={() => setImgLoaded(true)}
//                 className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
//                   imgLoaded ? "opacity-100" : "opacity-0"
//                 }`}
//               />
//             ) : (
//               <div className="flex items-center justify-center w-full h-full">
//                 <BookOpen className="w-16 h-16 text-primary/30" />
//               </div>
//             )}
//           </div>

//           {/* Content */}
//           <div className="p-5 space-y-3">

//             <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
//               {title}
//             </h3>

//             <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
//               {description}
//             </p>

//             <p className="text-xs text-muted-foreground">
//               بواسطة <span className="text-foreground font-medium">{instructor}</span>
//             </p>

//             {/* Specialization */}
//             {spec && (
//               <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-primary/5 text-primary">
//                 <Icon className="w-3 h-3" />
//                 {spec.name}
//               </div>
//             )}

//             {/* Stats */}
//             <div className="flex items-center justify-between pt-3 border-t border-border/50 text-xs">

//               <div className="flex items-center gap-1 text-muted-foreground">
//                 <BookOpen className="w-3.5 h-3.5" />
//                 <span>{lessonsCount ?? 0} درس</span>
//               </div>

//               <div className="flex items-center gap-1 text-muted-foreground">
//                 <Users className="w-3.5 h-3.5" />
//                 <span>{enrolledCount ?? 0} طالب</span>
//               </div>

//               {ratingData && ratingData.avg > 0 && (
//                 <div className="flex items-center gap-1 text-yellow-500 font-semibold">
//                   <Star className="w-3.5 h-3.5 fill-current" />
//                   <span>{ratingData.avg.toFixed(1)}</span>
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

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, User, Star, Clock, ArrowLeft, Share2 } from "lucide-react";
import { useCourseRating, useEnrollmentsCount } from "@/hooks/useCourses";
import { useToast } from "@/hooks/use-toast";

interface CourseProps {
  id: string;
  title: string;
  description: string | null;
  instructor: string;
  thumbnail_url: string | null;
  specialization_id: string | null;
  index: number;
}

const CourseCard = ({ id, title, description, instructor, thumbnail_url, specialization_id, index }: CourseProps) => {
  const { data: ratingData } = useCourseRating(id);
  const { data: enrolledCount } = useEnrollmentsCount(id);
  const { toast } = useToast();

  // دالة المشاركة (نسخ الرابط)
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault(); // لمنع تحويل المتصفح لصفحة الكورس عند الضغط على الزرار
    const courseUrl = `${window.location.origin}/courses/${id}`;
    
    // استخدام الـ Clipboard API لنسخ الرابط
    navigator.clipboard.writeText(courseUrl).then(() => {
      toast({
        title: "تم نسخ الرابط! 🔗",
        description: "يمكنك الآن مشاركة الكورس مع أصدقائك.",
      });
    }).catch(() => {
      toast({
        title: "خطأ",
        description: "لم نتمكن من نسخ الرابط، حاول مرة أخرى.",
        variant: "destructive"
      });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group bg-gradient-to-br from-[#0a0f0c] to-[#0f1712] border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col h-full"
    >
      {/* Container الصورة */}
      <Link to={`/courses/${id}`} className="relative h-48 w-full bg-[#121A15] block overflow-hidden">
        {thumbnail_url ? (
          <>
            <img 
              src={thumbnail_url} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {/* ضل متدرج فوق الصورة */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0c] via-transparent to-transparent opacity-90" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center border-b border-white/5 bg-gradient-to-br from-emerald-900/10 to-transparent">
            <BookOpen className="w-12 h-12 text-emerald-500/20" />
          </div>
        )}

        {/* زرار المشاركة الطافي فوق الصورة */}
        <button 
          onClick={handleShare}
          title="مشاركة الكورس"
          className="absolute top-3 left-3 bg-black/50 hover:bg-emerald-600 backdrop-blur-md p-2.5 rounded-full border border-white/10 hover:border-emerald-500 transition-all duration-300 shadow-lg z-10"
        >
          <Share2 className="w-4 h-4 text-white" />
        </button>

        {/* Badge التخصص */}
        {specialization_id && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
             <span className="text-[10px] sm:text-xs font-bold text-emerald-400">
               كورس متخصص
             </span>
          </div>
        )}
      </Link>

      {/* تفاصيل الكورس */}
      <div className="p-5 sm:p-6 flex flex-col flex-1 relative z-10 -mt-4 bg-gradient-to-b from-[#0a0f0c] to-transparent rounded-t-3xl">
        <Link to={`/courses/${id}`} className="mb-auto">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
            {title}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-4">
            {description}
          </p>
        </Link>

        {/* الإحصائيات (المشتركين والتقييم) */}
        <div className="grid grid-cols-2 gap-3 mb-5 border-t border-b border-white/5 py-4">
          <div className="flex flex-col items-center justify-center text-center gap-1 border-l border-white/5">
             <Star className="w-4 h-4 text-yellow-500" />
             <span className="text-sm font-bold text-white">
               {ratingData && ratingData.avg > 0 ? ratingData.avg : "جديد"}
             </span>
          </div>
          <div className="flex flex-col items-center justify-center text-center gap-1">
             <User className="w-4 h-4 text-emerald-500/70" />
             <span className="text-sm font-bold text-white">
               {enrolledCount || 0} <span className="text-xs text-neutral-500 font-normal">طالب</span>
             </span>
          </div>
        </div>

        {/* زر الدخول للكورس */}
        <Link to={`/courses/${id}`} className="mt-auto block">
          <div className="flex items-center justify-center gap-2 w-full bg-[#121A15] hover:bg-emerald-600 border border-neutral-800 hover:border-emerald-500 text-white py-3.5 rounded-xl font-bold transition-all shadow-lg group-hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            تفاصيل الكورس
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default CourseCard;
