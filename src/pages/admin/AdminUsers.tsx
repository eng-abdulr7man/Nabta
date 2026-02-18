import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Shield, ShieldCheck, ShieldX, Users, Search, Eye, UserX, UserCheck, X, Mail, Phone, Calendar, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      const { data: roles } = await supabase.from("user_roles").select("*");
      
      // Get enrollment counts per user
      const { data: enrollments } = await supabase.from("enrollments").select("user_id");
      const enrollmentCounts: Record<string, number> = {};
      (enrollments || []).forEach((e: any) => {
        enrollmentCounts[e.user_id] = (enrollmentCounts[e.user_id] || 0) + 1;
      });

      return (profiles || []).map((p: any) => ({
        ...p,
        roles: (roles || []).filter((r: any) => r.user_id === p.user_id).map((r: any) => r.role),
        enrollmentCount: enrollmentCounts[p.user_id] || 0,
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

  // Note: actual account suspension requires auth admin API via edge function
  // For now we track it via activity_log
  const suspendUser = useMutation({
    mutationFn: async ({ userId, fullName }: { userId: string; fullName: string }) => {
      await supabase.from("activity_log").insert({
        user_id: userId,
        action: "إيقاف حساب",
        details: { full_name: fullName, suspended_at: new Date().toISOString() },
      });
    },
    onSuccess: () => {
      toast({ title: "تم تسجيل إيقاف الحساب في سجل النشاطات" });
    },
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

        {/* User Detail Modal */}
        <AnimatePresence>
          {selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
              onClick={() => setSelectedUser(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="glass-card p-6 max-w-md w-full space-y-5"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-black text-foreground text-lg">بيانات المستخدم</h2>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedUser(null)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {selectedUser.avatar_url ? (
                      <img src={selectedUser.avatar_url} alt={`صورة ${selectedUser.full_name}`} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-primary">{(selectedUser.full_name || "م").charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-foreground text-lg">{selectedUser.full_name || "بدون اسم"}</p>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      selectedUser.roles.includes("owner") ? "bg-yellow-500/10 text-yellow-600" :
                      selectedUser.roles.includes("admin") ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    }`}>
                      {selectedUser.roles.includes("owner") ? "مالك" : selectedUser.roles.includes("admin") ? "مشرف" : "مستخدم"}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4 shrink-0" />
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span>{selectedUser.phone || "لم يُحدد"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>انضم في {new Date(selectedUser.created_at).toLocaleDateString("ar", { dateStyle: "long" })}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="w-4 h-4 shrink-0" />
                    <span>{selectedUser.enrollmentCount} كورس مسجل</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  {!selectedUser.roles.includes("owner") && (
                    <>
                      <Button
                        variant={selectedUser.roles.includes("admin") ? "destructive" : "outline"}
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => {
                          toggleAdmin.mutate({
                            userId: selectedUser.user_id,
                            isAdmin: selectedUser.roles.includes("admin"),
                          });
                          setSelectedUser(null);
                        }}
                      >
                        {selectedUser.roles.includes("admin") ? (
                          <><ShieldX className="w-3.5 h-3.5" /> إزالة مشرف</>
                        ) : (
                          <><ShieldCheck className="w-3.5 h-3.5" /> ترقية لمشرف</>
                        )}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="gap-1.5 text-xs"
                        onClick={() => {
                          suspendUser.mutate({ userId: selectedUser.user_id, fullName: selectedUser.full_name });
                          setSelectedUser(null);
                        }}
                      >
                        <UserX className="w-3.5 h-3.5" />
                        إيقاف الحساب
                      </Button>
                    </>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedUser(user)}
                      title="عرض البيانات"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!isOwner && (
                      <Button
                        variant={isAdmin ? "destructive" : "outline"}
                        size="sm"
                        className="gap-1.5 text-xs h-8"
                        onClick={() => toggleAdmin.mutate({ userId: user.user_id, isAdmin })}
                      >
                        {isAdmin ? (
                          <><ShieldX className="w-3.5 h-3.5" /> إزالة مشرف</>
                        ) : (
                          <><ShieldCheck className="w-3.5 h-3.5" /> ترقية لمشرف</>
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
