import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldCheck, ShieldX, Users, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("*");
      return (profiles || []).map((p: any) => ({
        ...p,
        roles: (roles || []).filter((r: any) => r.user_id === p.user_id).map((r: any) => r.role),
      }));
    },
  });

  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الدور بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) => toast({ title: "خطأ", description: err.message, variant: "destructive" }),
  });

  const filtered = (users || []).filter((u: any) =>
    u.full_name?.includes(search) || u.email?.includes(search)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            إدارة المستخدمين
          </h1>
          <span className="text-sm text-muted-foreground">{(users || []).length} مستخدم</span>
        </div>

        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ابحث عن مستخدم..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <div key={i} className="glass-card h-16 animate-pulse" />)}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((user: any, i: number) => {
              const isAdmin = user.roles.includes("admin") || user.roles.includes("owner");
              const isOwner = user.roles.includes("owner");
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="glass-card p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={`صورة ${user.full_name}`} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span className="text-sm font-bold text-primary">{(user.full_name || "م").charAt(0)}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{user.full_name || "بدون اسم"}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${isOwner ? "bg-yellow-500/10 text-yellow-600" : isAdmin ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                      {isOwner ? "مالك" : isAdmin ? "مشرف" : "مستخدم"}
                    </span>
                    {!isOwner && (
                      <Button
                        variant={isAdmin ? "destructive" : "outline"}
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => toggleAdmin.mutate({ userId: user.user_id, isAdmin })}
                      >
                        {isAdmin ? (
                          <>
                            <ShieldX className="w-3.5 h-3.5" />
                            إزالة مشرف
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            ترقية لمشرف
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
