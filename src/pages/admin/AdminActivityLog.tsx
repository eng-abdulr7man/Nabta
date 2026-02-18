import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { motion } from "framer-motion";
import { Activity, User, Clock, Filter } from "lucide-react";
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

      // Fetch profiles separately since there's no FK
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

  const getActionColor = (action: string) => {
    if (action.includes("حذف")) return "text-destructive bg-destructive/10";
    if (action.includes("إضافة") || action.includes("تسجيل")) return "text-primary bg-primary/10";
    if (action.includes("تحديث")) return "text-yellow-500 bg-yellow-500/10";
    return "text-muted-foreground bg-secondary";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            سجل النشاطات
          </h1>
          <p className="text-sm text-muted-foreground mt-1">تتبع جميع التغييرات والإجراءات في المنصة</p>
        </div>

        <div className="glass-card p-3 flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="ابحث في النشاطات..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground"
          />
        </div>

        {error && (
          <div className="glass-card p-4 text-destructive text-sm">
            خطأ في تحميل البيانات: {(error as any).message}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="glass-card h-16 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Activity className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground">لا توجد نشاطات بعد</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((log: any, i: number) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.02 }}
                className="glass-card p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${getActionColor(log.action)}`}>
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>{log.profile?.full_name || "مجهول"}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(log.created_at).toLocaleString("ar", { dateStyle: "short", timeStyle: "short" })}</span>
                      </div>
                    </div>
                    {log.details && Object.keys(log.details).length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg p-2 space-y-0.5">
                        {Object.entries(log.details).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-foreground/70">{key}:</span>{" "}
                            <span>{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminActivityLog;
