import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, MessageSquare, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [courses, enrollments, certificates, messages, profiles] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      return {
        courses: courses.count || 0,
        enrollments: enrollments.count || 0,
        certificates: certificates.count || 0,
        unreadMessages: messages.count || 0,
        users: profiles.count || 0,
      };
    },
  });

  const statCards = [
    { label: "المستخدمين", value: stats?.users || 0, icon: Users, color: "200 70% 50%" },
    { label: "الكورسات", value: stats?.courses || 0, icon: BookOpen, color: "142 60% 45%" },
    { label: "التسجيلات", value: stats?.enrollments || 0, icon: TrendingUp, color: "30 80% 55%" },
    { label: "الشهادات", value: stats?.certificates || 0, icon: Award, color: "45 80% 50%" },
    { label: "رسائل جديدة", value: stats?.unreadMessages || 0, icon: MessageSquare, color: "0 70% 55%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">لوحة التحكم</h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `hsla(${card.color}, 0.15)` }}>
                    <Icon className="w-5 h-5" style={{ color: `hsl(${card.color})` }} />
                  </div>
                </div>
                <p className="text-2xl font-black text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
