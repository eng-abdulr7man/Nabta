import { Star, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { specializations } from "@/data/mockData";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  instructor: string;
  specialization: string;
  lessonsCount: number;
  enrolledCount: number;
  rating: number;
  index?: number;
}

const CourseCard = ({
  id,
  title,
  description,
  instructor,
  specialization,
  lessonsCount,
  enrolledCount,
  rating,
  index = 0,
}: CourseCardProps) => {
  const spec = specializations.find((s) => s.id === specialization);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Link to={`/courses/${id}`}>
        <div className="glass-card hover-lift overflow-hidden group cursor-pointer">
          {/* Thumbnail placeholder */}
          <div className="h-44 bg-gradient-to-br from-primary/20 to-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {spec && <spec.icon className="w-16 h-16 text-primary/30" />}
            </div>
            <div className="absolute top-3 left-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 backdrop-blur-sm text-foreground"
              >
                {spec?.name}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            <h3 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
            <p className="text-xs text-muted-foreground">بواسطة {instructor}</p>

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{lessonsCount} درس</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="w-3.5 h-3.5" />
                <span>{enrolledCount}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-yellow-500">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{rating}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
