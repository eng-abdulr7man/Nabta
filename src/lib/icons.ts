import { Sprout, Bug, Droplets, Cpu, Factory, FlaskConical, TrendingUp, Wheat } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Wheat,
  Sprout,
  Bug,
  Droplets,
  Cpu,
  Factory,
  FlaskConical,
  TrendingUp,
};

export const getSpecIcon = (iconName: string): LucideIcon => {
  return iconMap[iconName] || Wheat;
};
