import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface SpecializationCardProps {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  coursesCount?: number;
  index?: number;
}

const SpecializationCard = ({
  id,
  name,
  icon: Icon,
  color,
  coursesCount = 0,
  index = 0,
}: SpecializationCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      viewport={{ once: true }}
    >
      <Link to={`/specializations/${id}`}>
        <div className="glass-card hover-lift p-6 text-center group cursor-pointer">
          <div
            className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ backgroundColor: `hsla(${color}, 0.15)` }}
          >
            <Icon
              className="w-7 h-7"
              style={{ color: `hsl(${color})` }}
            />
          </div>
          <h3 className="font-bold text-foreground text-sm mb-1">{name}</h3>
          <p className="text-xs text-muted-foreground">{coursesCount} كورس</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default SpecializationCard;
