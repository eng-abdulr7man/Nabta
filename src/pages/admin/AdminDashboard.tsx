import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { BookOpen, Users, Award, MessageSquare, TrendingUp, Star } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const CHART_COLORS = ["hsl(142,60%,45%)", "hsl(200,70%,50%)", "hsl(30,80%,55%)", "hsl(45,80%,50%)", "hsl(0,70%,55%)", "hsl(270,60%,55%)"];

const AdminDashboard = () => {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [courses, enrollments, certificates, messages, profiles, ratings] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("ratings").select("*", { count: "exact", head: true }),
      ]);
      return {
        courses: courses.count || 0,
        enrollments: enrollments.count || 0,
        certificates: certificates.count || 0,
        unreadMessages: messages.count || 0,
        users: profiles.count || 0,
        ratings: ratings.count || 0,
      };
    },
  });

  // Enrollments per course for bar chart
  const { data: courseEnrollments } = useQuery({
    queryKey: ["admin-course-enrollments"],
    queryFn: async () => {
      const { data: courses } = await supabase.from("courses").select("id, title");
      const { data: enrollments } = await supabase.from("enrollments").select("course_id");
      const counts: Record<string, number> = {};
      (enrollments || []).forEach((e: any) => { counts[e.course_id] = (counts[e.course_id] || 0) + 1; });
      return (courses || []).map((c: any) => ({
        name: c.title.length > 15 ? c.title.slice(0, 15) + "..." : c.title,
        طلاب: counts[c.id] || 0,
      })).sort((a: any, b: any) => b.طلاب - a.طلاب).slice(0, 8);
    },
  });

  // Specialization distribution for pie chart
  const { data: specDistribution } = useQuery({
    queryKey: ["admin-spec-distribution"],
    queryFn: async () => {
      const { data: specs } = await supabase.from("specializations").select("id, name");
      const { data: courses } = await supabase.from("courses").select("specialization_id");
      const counts: Record<string, number> = {};
      (courses || []).forEach((c: any) => { if (c.specialization_id) counts[c.specialization_id] = (counts[c.specialization_id] || 0) + 1; });
      return (specs || []).map((s: any) => ({
        name: s.name,
        value: counts[s.id] || 0,
      })).filter((s: any) => s.value > 0);
    },
  });

  // Monthly enrollments for line chart
  const { data: monthlyData } = useQuery({
    queryKey: ["admin-monthly-enrollments"],
    queryFn: async () => {
      const { data: enrollments } = await supabase.from("enrollments").select("enrolled_at");
      const months: Record<string, number> = {};
      (enrollments || []).forEach((e: any) => {
        const month = new Date(e.enrolled_at).toLocaleDateString("ar", { year: "numeric", month: "short" });
        months[month] = (months[month] || 0) + 1;
      });
      return Object.entries(months).map(([name, تسجيلات]) => ({ name, تسجيلات })).slice(-6);
    },
  });

  const statCards = [
    { label: "المستخدمين", value: stats?.users || 0, icon: Users, color: "200 70% 50%" },
    { label: "الكورسات", value: stats?.courses || 0, icon: BookOpen, color: "142 60% 45%" },
    { label: "التسجيلات", value: stats?.enrollments || 0, icon: TrendingUp, color: "30 80% 55%" },
    { label: "الشهادات", value: stats?.certificates || 0, icon: Award, color: "45 80% 50%" },
    { label: "التقييمات", value: stats?.ratings || 0, icon: Star, color: "270 60% 55%" },
    { label: "رسائل جديدة", value: stats?.unreadMessages || 0, icon: MessageSquare, color: "0 70% 55%" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">لوحة التحكم</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enrollments per course */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-5">
            <h3 className="font-bold text-foreground mb-4">الطلاب لكل كورس</h3>
            {(courseEnrollments || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={courseEnrollments} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis dataKey="name" type="category" width={100} stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fill: "hsl(var(--foreground))" }} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                  <Bar dataKey="طلاب" fill="hsl(142,60%,45%)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-10">لا توجد بيانات بعد</p>
            )}
          </motion.div>

          {/* Specialization distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-5">
            <h3 className="font-bold text-foreground mb-4">توزيع الكورسات حسب التخصص</h3>
            {(specDistribution || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={specDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false} fontSize={10}>
                    {(specDistribution || []).map((_: any, idx: number) => (
                      <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-sm text-center py-10">لا توجد بيانات بعد</p>
            )}
          </motion.div>
        </div>

        {/* Monthly enrollments line chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-5">
          <h3 className="font-bold text-foreground mb-4">التسجيلات الشهرية</h3>
          {(monthlyData || []).length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Line type="monotone" dataKey="تسجيلات" stroke="hsl(200,70%,50%)" strokeWidth={2} dot={{ fill: "hsl(200,70%,50%)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted-foreground text-sm text-center py-10">لا توجد بيانات بعد</p>
          )}
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
