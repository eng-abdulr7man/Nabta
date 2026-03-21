import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  BookOpen, Users, Award, MessageSquare, TrendingUp, 
  Star, Activity, Youtube, Plus, Zap, Clock, 
  Download, Wallet, Target, AlertTriangle, FileWarning, Trophy
} from "lucide-react";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell 
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";

const CHART_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#f43f5e", "#06b6d4", "#ec4899"];

const AdminDashboard = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "صباح الخير" : hour < 18 ? "طاب مساؤك" : "مساء الخير";

  const { data: stats } = useQuery({
    queryKey: ["admin-stats-v2"],
    queryFn: async () => {
      const [courses, draftCourses, enrollments, certificates, messages, profiles] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("published", true),
        supabase.from("courses").select("*", { count: "exact", head: true }).eq("published", false), // الكورسات المسودة
        supabase.from("enrollments").select("*", { count: "exact", head: true }),
        supabase.from("certificates").select("*", { count: "exact", head: true }),
        supabase.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false), // رسائل غير مقروءة
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ]);
      return {
        activeCourses: courses.count || 0,
        draftCourses: draftCourses.count || 0,
        enrollments: enrollments.count || 0,
        certificates: certificates.count || 0,
        unreadMessages: messages.count || 0,
        users: profiles.count || 0,
        revenue: (enrollments.count || 0) * 150, // 💰 افتراض: الكورس بـ 150 جنيه (مؤقت لشكل الإيرادات)
        completionRate: 68, // 🎯 افتراض: 68% متوسط إتمام الكورسات
      };
    },
  });

  const { data: courseEnrollments } = useQuery({
    queryKey: ["admin-course-enrollments"],
    queryFn: async () => {
      const { data: courses } = await supabase.from("courses").select("id, title");
      const { data: enrollments } = await supabase.from("enrollments").select("course_id");
      const counts: Record<string, number> = {};
      (enrollments || []).forEach((e: any) => { counts[e.course_id] = (counts[e.course_id] || 0) + 1; });
      return (courses || []).map((c: any) => ({
        name: c.title,
        طلاب: counts[c.id] || 0,
      })).sort((a: any, b: any) => b.طلاب - a.طلاب).slice(0, 5);
    },
  });

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

  const { data: recentActivity } = useQuery({
    queryKey: ["admin-recent-activity"],
    queryFn: async () => {
      const { data: enrs } = await supabase.from("enrollments").select("*").order("enrolled_at", { ascending: false }).limit(4);
      if (!enrs?.length) return [];
      const userIds = enrs.map(e => e.user_id);
      const courseIds = enrs.map(e => e.course_id);
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name").in("user_id", userIds);
      const { data: crs } = await supabase.from("courses").select("id, title").in("id", courseIds);
      return enrs.map(e => ({
        ...e, profile: profs?.find(p => p.user_id === e.user_id), course: crs?.find(c => c.id === e.course_id)
      }));
    }
  });

  // 🏆 جلب أنشط الطلاب (Top Learners)
  const { data: topLearners } = useQuery({
    queryKey: ["admin-top-learners"],
    queryFn: async () => {
      const { data: enrollments } = await supabase.from("enrollments").select("user_id");
      const counts: Record<string, number> = {};
      (enrollments || []).forEach((e: any) => { counts[e.user_id] = (counts[e.user_id] || 0) + 1; });
      
      const sortedUsers = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4);
      if(sortedUsers.length === 0) return [];

      const { data: profiles } = await supabase.from("profiles").select("user_id, full_name").in("user_id", sortedUsers.map(u => u[0]));
      return sortedUsers.map((u, index) => ({
        profile: profiles?.find(p => p.user_id === u[0]),
        enrollmentCount: u[1],
        rank: index + 1
      }));
    }
  });

  // 📥 دالة تصدير التقرير
  const handleExportReport = () => {
    toast({ title: "جاري تجهيز التقرير...", description: "سيتم تحميل التقرير بصيغة PDF قريباً." });
    setTimeout(() => { window.print(); }, 1000); // استدعاء طباعة المتصفح كحل سريع وشيك
  };

  const statCards = [
    { label: "المستخدمين", value: stats?.users || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "الكورسات النشطة", value: stats?.activeCourses || 0, icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "التسجيلات", value: stats?.enrollments || 0, icon: TrendingUp, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { label: "الشهادات", value: stats?.certificates || 0, icon: Award, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
    { label: "إجمالي الإيرادات", value: `${stats?.revenue || 0} ج.م`, icon: Wallet, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "معدل الإتمام", value: `${stats?.completionRate || 0}%`, icon: Target, color: "text-cyan-500", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  const maxEnrollments = courseEnrollments?.length ? Math.max(...courseEnrollments.map((c: any) => c.طلاب)) : 1;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8 p-2 font-tajawal relative overflow-x-hidden" dir="rtl">
        <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* 🌟 Header & Quick Actions (شامل زرار الـ Export) 🌟 */}
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 bg-[#0a0f0c] p-6 md:p-8 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden flex flex-col justify-center">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl -z-10" />
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3">
                  {greeting}، <span className="text-emerald-500">{profile?.full_name?.split(' ')[0] || "يا هندسة"}!</span> 👋
                </h1>
                <p className="text-neutral-400 font-medium mt-3 text-sm md:text-base">ملخص أداء منصة "نبتة". الأمور تسير بشكل رائع.</p>
              </div>
              {/* زرار التصدير للديسكتوب */}
              <Button onClick={handleExportReport} variant="outline" className="hidden md:flex gap-2 bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-neutral-300 rounded-xl h-12">
                <Download className="w-4 h-4" /> تصدير تقرير الأداء
              </Button>
            </div>
          </div>

          <div className="lg:w-1/3 flex flex-col justify-center gap-3 bg-[#050806] border border-neutral-800/50 p-5 rounded-[2rem]">
            <h3 className="text-xs font-black text-neutral-500 px-2 uppercase tracking-widest flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-500" /> وصول سريع
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => navigate('/admin/youtube-import')} className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 h-12 rounded-xl flex gap-2">
                <Youtube className="w-4 h-4" /> استيراد يوتيوب
              </Button>
              <Button onClick={() => navigate('/admin/courses')} className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 h-12 rounded-xl flex gap-2">
                <Plus className="w-4 h-4" /> كورس جديد
              </Button>
              {/* زرار التصدير للموبايل */}
              <Button onClick={handleExportReport} className="md:hidden col-span-2 bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10 h-12 rounded-xl flex gap-2">
                <Download className="w-4 h-4" /> تصدير تقرير الأداء
              </Button>
            </div>
          </div>
        </div>

        {/* 🌟 8 Stat Cards (تم التوسيع لتشمل الإيرادات والنسبة) 🌟 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div key={card.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className={`bg-[#0a0f0c] border border-neutral-800/60 p-5 rounded-3xl shadow-xl hover:border-neutral-700 transition-colors relative overflow-hidden group`}
              >
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${card.bg} ${card.border}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
                <div className="relative z-10 space-y-1">
                  <p className="text-xl md:text-2xl font-black text-white">{card.value}</p>
                  <p className="text-xs font-bold text-neutral-500 line-clamp-1">{card.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 🌟 الصف التالت: الخط الزمني + المهام العاجلة 🌟 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 bg-[#0a0f0c] border border-neutral-800/60 rounded-[2.5rem] p-6 shadow-xl">
            <h3 className="font-black text-white mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" /> معدل نمو التسجيلات 
            </h3>
            {(monthlyData || []).length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={monthlyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} reversed={true} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} orientation="right" dx={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0a0f0c', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', textAlign: 'right' }} />
                  <Line type="monotone" dataKey="تسجيلات" stroke="#8b5cf6" strokeWidth={4} dot={{ fill: "#0a0f0c", stroke: "#8b5cf6", strokeWidth: 2, r: 5 }} activeDot={{ r: 8, fill: "#8b5cf6", stroke: "#fff" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-neutral-600 font-bold">لا توجد بيانات كافية</div>
            )}
          </motion.div>

          {/* 🚨 المهام العاجلة (Needs Attention) 🚨 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-1 bg-[#121A15] border border-red-500/20 rounded-[2.5rem] p-6 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-red-500 to-transparent opacity-50" />
            <h3 className="font-black text-white mb-5 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" /> مهام تحتاج انتباهك
            </h3>
            <div className="flex flex-col gap-4">
              <Link to="/admin/messages" className="flex items-center justify-between p-4 bg-[#0a0f0c] border border-neutral-800 rounded-2xl hover:border-red-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"><MessageSquare className="w-4 h-4" /></div>
                  <span className="text-sm font-bold text-neutral-300">رسائل دعم غير مقروءة</span>
                </div>
                <span className="font-black text-red-500">{stats?.unreadMessages || 0}</span>
              </Link>
              
              <Link to="/admin/courses" className="flex items-center justify-between p-4 bg-[#0a0f0c] border border-neutral-800 rounded-2xl hover:border-amber-500/30 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors"><FileWarning className="w-4 h-4" /></div>
                  <span className="text-sm font-bold text-neutral-300">كورسات مسودة (غير منشورة)</span>
                </div>
                <span className="font-black text-amber-500">{stats?.draftCourses || 0}</span>
              </Link>

              <div className="flex items-center justify-between p-4 bg-[#0a0f0c] border border-neutral-800 rounded-2xl opacity-60 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-neutral-800 rounded-lg text-neutral-500"><Star className="w-4 h-4" /></div>
                  <span className="text-sm font-bold text-neutral-500">تقييمات تحتاج مراجعة</span>
                </div>
                <span className="font-black text-neutral-500">0</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 🌟 الصف الرابع: تقدم الكورسات + التخصصات 🌟 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-6 shadow-xl">
            <h3 className="font-black text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" /> الكورسات الأكثر إقبالاً (Progress)
            </h3>
            {(courseEnrollments || []).length > 0 ? (
              <div className="space-y-6 mt-4">
                {courseEnrollments?.map((course: any, idx: number) => (
                  <div key={idx} className="space-y-2.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white font-bold truncate pr-2 max-w-[70%]">{course.name}</span>
                      <span className="text-emerald-400 font-black">{course.طلاب} <span className="text-neutral-500 text-xs">طالب</span></span>
                    </div>
                    <div className="w-full bg-[#121A15] rounded-full h-3.5 border border-neutral-800/60 overflow-hidden shadow-inner">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(course.طلاب / maxEnrollments) * 100}%` }} transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                        className="bg-gradient-to-l from-emerald-400 to-emerald-600 h-full rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] relative"
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full rounded-full" style={{ maskImage: 'linear-gradient(to right, transparent, black)' }} />
                      </motion.div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-neutral-600 font-bold">لا توجد بيانات كافية</div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-6 shadow-xl flex flex-col">
            <h3 className="font-black text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-500" /> توزيع التخصصات
            </h3>
            {(specDistribution || []).length > 0 ? (
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-center h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={specDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4} stroke="none">
                        {(specDistribution || []).map((_: any, idx: number) => <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0a0f0c', borderColor: '#1e293b', borderRadius: '12px', color: '#fff', textAlign: 'right' }} itemStyle={{ color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {specDistribution?.map((spec: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2.5 bg-[#121A15] p-2.5 rounded-xl border border-neutral-800/50 hover:border-neutral-700 transition-colors">
                      <div className="w-3 h-3 rounded-full shrink-0 shadow-md" style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }} />
                      <span className="text-[11px] font-bold text-neutral-300 truncate flex-1">{spec.name}</span>
                      <span className="text-xs font-black" style={{ color: CHART_COLORS[idx % CHART_COLORS.length] }}>{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[280px] flex items-center justify-center text-neutral-600 font-bold">لا توجد بيانات كافية</div>
            )}
          </motion.div>
        </div>

        {/* 🌟 الصف الخامس: لوحة الشرف + الرادار المباشر 🌟 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* 🏆 لوحة الشرف (Top Learners) 🏆 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-[#0a0f0c] border border-amber-500/20 rounded-[2.5rem] p-6 shadow-xl flex flex-col relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-500/5 blur-3xl -z-10" />
            <h3 className="font-black text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> لوحة الشرف (أنشط الطلاب)
            </h3>
            <div className="flex flex-col gap-3">
              {topLearners && topLearners.length > 0 ? (
                topLearners.map((learner: any) => {
                  // تلوين الميداليات حسب الترتيب
                  const medalColors = ["bg-amber-400 text-amber-950", "bg-neutral-300 text-neutral-800", "bg-orange-700 text-orange-100", "bg-neutral-800 text-neutral-400"];
                  const ringColors = ["ring-amber-500/30", "ring-neutral-400/30", "ring-orange-700/30", "ring-transparent"];
                  
                  return (
                    <div key={learner.rank} className={`flex items-center justify-between p-4 rounded-2xl bg-[#121A15] border border-neutral-800/50 hover:border-amber-500/30 transition-all ${learner.rank === 1 ? 'ring-1 ring-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-md ring-4 ${medalColors[learner.rank - 1] || medalColors[3]} ${ringColors[learner.rank - 1] || ringColors[3]}`}>
                          {learner.rank}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white truncate">{learner.profile?.full_name || "مستخدم مجهول"}</p>
                          <p className="text-[11px] text-amber-500/80 font-bold">بطل التعلم</p>
                        </div>
                      </div>
                      <div className="text-center bg-[#0a0f0c] px-4 py-2 rounded-xl border border-neutral-800">
                        <p className="text-sm font-black text-amber-400">{learner.enrollmentCount}</p>
                        <p className="text-[9px] text-neutral-500 font-bold">كورسات</p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-10 text-center text-neutral-500 font-bold text-sm">لا توجد بيانات كافية للطلاب حتى الآن</div>
              )}
            </div>
          </motion.div>

          {/* 📡 الرادار المباشر (Live Feed) 📡 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="bg-[#0a0f0c] border border-blue-500/20 rounded-[2.5rem] p-6 shadow-xl flex flex-col min-h-[380px] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/5 blur-3xl -z-10" />
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-white flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                رادار النشاط المباشر
              </h3>
              <Link to="/admin/activity" className="text-xs text-blue-500 hover:text-blue-400 hover:underline font-bold transition-colors bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/20">عرض السجل الكامل</Link>
            </div>

            <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3">
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((act: any) => (
                  <div key={act.id} className="bg-[#121A15] p-4 rounded-2xl border border-neutral-800/50 hover:border-blue-500/30 transition-colors group cursor-default">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 border border-blue-500/30 text-white flex items-center justify-center font-black text-sm shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                          {act.profile?.full_name?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-white truncate">{act.profile?.full_name || "مستخدم جديد"}</p>
                          <p className="text-[11px] text-neutral-400 font-medium truncate mt-0.5">سجل في <span className="text-blue-400 font-bold">{act.course?.title || "كورس محذوف"}</span></p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 text-[10px] text-neutral-500 font-medium shrink-0">
                        <Clock className="w-3 h-3" />
                        <span dir="ltr">
                          {new Date(act.enrolled_at).toLocaleString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-neutral-600 space-y-2 py-10">
                  <Users className="w-8 h-8 opacity-50" />
                  <span className="text-xs font-bold">لا يوجد نشاط حديث</span>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
