import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, User, Clock, Search, Trash2, 
  PlusCircle, Edit, LogIn, AlertCircle, Terminal 
} from "lucide-react";
import { useState } from "react";

const AdminActivityLog = () => {
  const [filter, setFilter] = useState("");

  const { data: logs, isLoading, error } = useQuery({
    queryKey: ["activity-logs"],
    queryFn: async () => {
      const { data: rawLogs, error: logsErr } = await supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(200);
      if (logsErr) throw logsErr;

      const userIds = [...new Set((rawLogs || []).map((l: any) => l.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", userIds);
        (profiles || []).forEach((p: any) => { profilesMap[p.user_id] = p; });
      }

      return (rawLogs || []).map((log: any) => ({
        ...log,
        profile: profilesMap[log.user_id] || null,
      }));
    },
  });

  const filtered = filter
    ? (logs || []).filter((log: any) =>
        log.action.includes(filter) ||
        log.profile?.full_name?.includes(filter) ||
        JSON.stringify(log.details).includes(filter)
      )
    : logs || [];

  // دالة ذكية لتحديد لون وأيقونة الأكشن
  const getActionStyle = (action: string) => {
    if (action.includes("حذف") || action.includes("إزالة")) 
      return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: Trash2 };
    if (action.includes("إضافة") || action.includes("إنشاء") || action.includes("تسجيل")) 
      return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: PlusCircle };
    if (action.includes("تحديث") || action.includes("تعديل")) 
      return { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: Edit };
    if (action.includes("دخول") || action.includes("خروج")) 
      return { color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20", icon: LogIn };
    
    return { color: "text-neutral-400", bg: "bg-neutral-800/50", border: "border-neutral-700/50", icon: Activity };
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-2 font-tajawal" dir="rtl">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a0f0c] p-6 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10" />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-emerald-500" />
              مراقب النظام (سجل النشاطات)
            </h1>
            <p className="text-neutral-500 text-sm font-bold mt-2">تتبع كل شاردة وواردة تحدث داخل منصة نبتة لحظة بلحظة.</p>
          </div>

          {/* Search Box */}
          <div className="w-full md:w-96 relative group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" />
            <input
              placeholder="ابحث عن مستخدم، حدث، أو تفاصيل..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl pr-12 pl-4 py-3.5 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-neutral-600 text-sm font-medium shadow-inner"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
            <AlertCircle className="w-5 h-5" /> خطأ في تحميل السجلات: {(error as any).message}
          </div>
        )}

        {/* Logs List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-24 rounded-2xl animate-pulse" />
            ))
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-[#0a0f0c] rounded-[2rem] border border-neutral-800/50">
              <Terminal className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
              <p className="text-neutral-500 font-bold text-lg">لا توجد أي نشاطات مسجلة حتى الآن.</p>
            </div>
          ) : (
            <AnimatePresence>
              {filtered.map((log: any, i: number) => {
                const style = getActionStyle(log.action);
                const Icon = style.icon;
                
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#0a0f0c] border border-neutral-800/60 p-5 rounded-2xl shadow-lg hover:border-neutral-700 transition-colors group"
                  >
                    <div className="flex flex-col md:flex-row md:items-start gap-5">
                      
                      {/* Icon Badge */}
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${style.bg} ${style.border} ${style.color} shadow-inner`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <span className={`text-sm font-black px-3 py-1.5 rounded-lg border ${style.bg} ${style.border} ${style.color}`}>
                              {log.action}
                            </span>
                            <div className="flex items-center gap-1.5 text-sm font-bold text-neutral-300 bg-[#121A15] px-3 py-1.5 rounded-lg border border-neutral-800">
                              <User className="w-4 h-4 text-emerald-500" />
                              {log.profile?.full_name || "مستخدم مجهول/نظام"}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span dir="ltr">
                              {new Date(log.created_at).toLocaleString("ar-EG", { 
                                year: "numeric", month: "short", day: "numeric", 
                                hour: "2-digit", minute: "2-digit" 
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Details JSON Block (Beautifully formatted) */}
                        {log.details && Object.keys(log.details).length > 0 && (
                          <div className="bg-[#050806] border border-neutral-800/80 rounded-xl p-3 mt-2 overflow-x-auto custom-scrollbar">
                            <div className="text-[10px] text-neutral-600 font-black uppercase mb-2 flex items-center gap-1">
                              <Terminal className="w-3 h-3" /> تفاصيل العملية (Payload)
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                              {Object.entries(log.details).map(([key, value]) => (
                                <div key={key} className="flex flex-col">
                                  <span className="text-[10px] text-neutral-500 font-mono">{key}:</span>
                                  <span className="text-xs font-medium text-emerald-50/70 truncate" title={String(value)}>
                                    {String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
