import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, ShieldCheck, ShieldX, Users, Search, Eye, 
  UserX, UserCheck, X, Mail, Phone, Calendar, 
  BookOpen, Filter, UserCog, GraduationCap, Crown,
  CheckCircle2, Trash2, Send, History, Award, Zap, Clock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";

const AdminUsers = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // 1. جلب البيانات الأساسية (Profiles + Roles + Enrollments)
  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users-pro"],
    queryFn: async () => {
      const { data: profiles, error: pErr } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (pErr) throw pErr;
      
      const { data: roles } = await supabase.from("user_roles").select("*");
      const { data: enrollments } = await supabase.from("enrollments").select("*, courses(title)");

      return (profiles || []).map((p: any) => {
        const userEnrollments = (enrollments || []).filter((e: any) => e.user_id === p.user_id);
        const userRoles = (roles || []).filter((r: any) => r.user_id === p.user_id).map((r: any) => r.role);
        
        let badge = { label: "مستكشف", color: "text-blue-400", bg: "bg-blue-400/10" };
        if (userEnrollments.length >= 5) badge = { label: "خبير زراعي", color: "text-purple-400", bg: "bg-purple-400/10" };
        else if (userEnrollments.length >= 2) badge = { label: "طالب مثابر", color: "text-emerald-400", bg: "bg-emerald-400/10" };

        return {
          ...p,
          roles: userRoles,
          enrollments: userEnrollments,
          enrollmentCount: userEnrollments.length,
          badge,
          isOnline: new Date().getTime() - new Date(p.updated_at).getTime() < 600000
        };
      });
    },
  });

  // 2. العمليات (Mutations)
  const toggleAdmin = useMutation({
    mutationFn: async ({ userId, isAdmin }: { userId: string; isAdmin: boolean }) => {
      if (isAdmin) await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", "admin");
      else await supabase.from("user_roles").insert({ user_id: userId, role: "admin" });
    },
    onSuccess: () => {
      toast({ title: "تم تحديث الصلاحيات بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["admin-users-pro"] });
    }
  });

  const suspendUser = useMutation({
    mutationFn: async ({ userId, currentStatus }: { userId: string; currentStatus: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_suspended: !currentStatus })
        .eq("user_id", userId);
      
      if (error) throw error;

      await supabase.from("activity_log").insert({
        user_id: userId,
        action: !currentStatus ? "إيقاف حساب" : "تنشيط حساب",
        details: { date: new Date().toISOString() },
      });
    },
    onSuccess: (_, variables) => {
      toast({ 
        title: variables.currentStatus ? "تم تنشيط الحساب بنجاح ✅" : "تم إيقاف الحساب بنجاح 🚫",
        variant: variables.currentStatus ? "default" : "destructive" 
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users-pro"] });
    },
  });

  const deleteUsers = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase.from("profiles").delete().in("user_id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: `تم حذف المستهدفين بنجاح` });
      setSelectedUsers([]);
      queryClient.invalidateQueries({ queryKey: ["admin-users-pro"] });
    }
  });

  const filtered = useMemo(() => {
    return (users || []).filter((u: any) => {
      const searchLower = search.toLowerCase();
      const matchesSearch = u.full_name?.toLowerCase().includes(searchLower) || 
                           u.email?.toLowerCase().includes(searchLower) ||
                           u.phone?.includes(search); // أضفنا البحث برقم التليفون
      if (activeTab === "admins") return matchesSearch && (u.roles.includes("admin") || u.roles.includes("owner"));
      if (activeTab === "students") return matchesSearch && !u.roles.includes("admin") && !u.roles.includes("owner");
      if (activeTab === "online") return matchesSearch && u.isOnline;
      if (activeTab === "suspended") return matchesSearch && u.is_suspended;
      return matchesSearch;
    });
  }, [users, search, activeTab]);

  const toggleSelectUser = (id: string) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6 p-2 font-tajawal relative" dir="rtl">
        
        {/* Header Section */}
        <div className="bg-[#0a0f0c] p-6 rounded-[2rem] border border-neutral-800/60 shadow-xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl" />
          <div className="text-center md:text-right">
            <h1 className="text-3xl font-black text-white flex items-center justify-center md:justify-start gap-3">
              <Users className="w-8 h-8 text-emerald-500" /> رادار المستخدمين
            </h1>
            <p className="text-neutral-500 font-bold mt-1">إدارة الصلاحيات، متابعة النشاط، والتحكم في الحسابات.</p>
          </div>
          <div className="flex gap-2">
             <div className="bg-[#121A15] p-3 rounded-2xl border border-neutral-800 text-center min-w-[100px]">
                <p className="text-[10px] text-neutral-500 font-black uppercase mb-1">نشط الآن</p>
                <p className="text-xl font-black text-emerald-500">{users?.filter(u => u.isOnline && !u.is_suspended).length || 0}</p>
             </div>
             <div className="bg-[#121A15] p-3 rounded-2xl border border-neutral-800 text-center min-w-[100px]">
                <p className="text-[10px] text-neutral-500 font-black uppercase mb-1">الإجمالي</p>
                <p className="text-xl font-black text-white">{users?.length || 0}</p>
             </div>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex items-center gap-2 bg-[#0a0f0c] p-1.5 rounded-2xl border border-neutral-800/60 overflow-x-auto w-full md:w-auto">
            <Button onClick={() => setActiveTab("all")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold ${activeTab === "all" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-white"}`}>الكل</Button>
            <Button onClick={() => setActiveTab("online")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold ${activeTab === "online" ? "bg-emerald-500/10 text-emerald-500" : "text-neutral-500"}`}>النشطين</Button>
            <Button onClick={() => setActiveTab("admins")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold ${activeTab === "admins" ? "bg-primary/10 text-primary" : "text-neutral-500"}`}>المشرفين</Button>
            <Button onClick={() => setActiveTab("suspended")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold ${activeTab === "suspended" ? "bg-rose-500/10 text-rose-500" : "text-neutral-500"}`}>الموقوفين</Button>
          </div>
          
          <div className="relative flex-1 w-full group">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text" placeholder="ابحث بالاسم، البريد، أو رقم التليفون..." 
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0a0f0c] border border-neutral-800 rounded-2xl pr-12 pl-4 py-3 text-white text-sm focus:border-emerald-500/50 outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-32 rounded-3xl animate-pulse" />)
            ) : filtered.map((user: any) => (
                <motion.div
                  key={user.user_id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`group relative bg-[#0a0f0c] border rounded-[2rem] p-5 transition-all duration-300 ${user.is_suspended ? 'border-rose-500/20 bg-rose-500/5 opacity-70' : 'border-neutral-800/60 hover:border-neutral-700'} ${selectedUsers.includes(user.user_id) ? 'ring-2 ring-emerald-500' : ''}`}
                >
                  <div onClick={() => toggleSelectUser(user.user_id)} className={`absolute top-4 left-4 w-5 h-5 rounded-md border flex items-center justify-center cursor-pointer transition-all z-20 ${selectedUsers.includes(user.user_id) ? 'bg-emerald-500 border-emerald-500 text-black' : 'border-neutral-700 bg-black/20 opacity-0 group-hover:opacity-100'}`}>
                    {selectedUsers.includes(user.user_id) && <CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden border border-neutral-800 shadow-inner">
                        {user.avatar_url ? <img src={user.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-xl font-black text-neutral-600">{(user.full_name || "M").charAt(0)}</div>}
                      </div>
                      {user.isOnline && !user.is_suspended && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-4 border-[#0a0f0c] animate-pulse" />}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-white truncate text-base">{user.full_name || "مستخدم نبتة"}</h3>
                        {user.roles.includes("owner") && <Crown className="w-3.5 h-3.5 text-yellow-500 shrink-0" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium truncate flex items-center gap-1.5 mb-1">
                        <Mail className="w-3 h-3" /> {user.email}
                      </p>
                      {/* 🔥 إظهار رقم التليفون في الكارت الرئيسي */}
                      <p className={`text-[11px] font-bold flex items-center gap-1.5 ${user.phone ? 'text-emerald-500/80' : 'text-neutral-600'}`}>
                        <Phone className="w-3 h-3" /> {user.phone || "بدون رقم تليفون"}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${user.badge.bg} ${user.badge.color}`}>{user.badge.label}</span>
                        {user.is_suspended && <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase bg-rose-500/20 text-rose-500">موقوف</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-5 pt-4 border-t border-neutral-800/50">
                    <div className="flex items-center gap-1.5 text-neutral-500">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="text-xs font-black">{user.enrollmentCount} كورس</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)} className="h-8 rounded-xl bg-[#121A15] border border-neutral-800 text-xs font-bold hover:text-emerald-500 transition-colors">
                      <Eye className="w-3.5 h-3.5 ml-1.5" /> التفاصيل
                    </Button>
                  </div>
                </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectedUsers.length > 0 && (
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 p-4 rounded-3xl shadow-2xl flex items-center gap-6 border border-white/20 backdrop-blur-xl">
              <div className="flex flex-col pr-2">
                <span className="text-[10px] font-black text-emerald-100 uppercase">تم تحديد</span>
                <span className="text-lg font-black text-white leading-none">{selectedUsers.length}</span>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => deleteUsers.mutate(selectedUsers)} className="bg-black/20 hover:bg-black/40 text-white font-bold h-11 px-5 rounded-2xl gap-2">
                  <Trash2 className="w-4 h-4" /> حذف المحدد
                </Button>
                <Button className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold h-11 px-5 rounded-2xl gap-2 shadow-lg">
                  <Send className="w-4 h-4" /> رسالة جماعية
                </Button>
              </div>
              <button onClick={() => setSelectedUsers([])} className="p-2 text-white/70 hover:text-white"><X className="w-5 h-5" /></button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌟 User Detail Modal (المُعدل لإظهار التليفون) 🌟 */}
        <AnimatePresence>
          {selectedUser && (
            <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }} className="bg-[#0a0f0c] border border-neutral-800 rounded-[2.5rem] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6 text-center">
                    <div className="relative mx-auto w-24 h-24 rounded-[2rem] bg-[#121A15] p-1.5 border border-neutral-800 shadow-2xl">
                      {selectedUser.avatar_url ? <img src={selectedUser.avatar_url} className="w-full h-full rounded-[1.6rem] object-cover" /> : <div className="w-full h-full rounded-[1.6rem] bg-emerald-500/10 flex items-center justify-center text-3xl font-black text-emerald-500">{(selectedUser.full_name || "M").charAt(0)}</div>}
                      <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#0a0f0c] ${selectedUser.isOnline ? 'bg-emerald-500' : 'bg-neutral-700'}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">{selectedUser.full_name || "مستخدم مجهول"}</h2>
                      <p className="text-neutral-500 text-sm mb-4">{selectedUser.email}</p>
                      <span className={`px-4 py-1 rounded-xl font-black text-[10px] uppercase border ${selectedUser.badge.bg} ${selectedUser.badge.color} border-current/20`}>
                        <Award className="w-3.5 h-3.5 inline ml-1.5" /> {selectedUser.badge.label}
                      </span>
                    </div>
                    
                    {/* 🔥 عرض البيانات الإحصائية + رقم التليفون */}
                    <div className="bg-[#121A15] p-4 rounded-2xl border border-neutral-800/50 space-y-3 text-right" dir="rtl">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-bold flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> رقم الهاتف:</span>
                        <span className="text-emerald-400 font-black" dir="ltr">{selectedUser.phone || "غير متوفر"}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-bold flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> آخر ظهور:</span>
                        <span className="text-white font-black">{selectedUser.isOnline ? 'نشط الآن' : new Date(selectedUser.updated_at).toLocaleDateString("ar-EG")}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-500 font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> تاريخ الانضمام:</span>
                        <span className="text-white font-black">{new Date(selectedUser.created_at).toLocaleDateString("ar-EG")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <h3 className="text-sm font-black text-emerald-500 mb-4 flex items-center gap-2"><History className="w-4 h-4" /> سجل التعلم</h3>
                    <div className="flex-1 overflow-y-auto max-h-[250px] pr-2 custom-scrollbar space-y-4">
                      {selectedUser.enrollments.length > 0 ? selectedUser.enrollments.map((enr: any, idx: number) => (
                        <div key={idx} className="flex items-start gap-3 border-r-2 border-emerald-500/30 pr-3">
                          <div><p className="text-xs font-black text-white">{enr.courses?.title}</p><p className="text-[9px] text-neutral-500">سجل في {new Date(enr.enrolled_at).toLocaleDateString("ar-EG")}</p></div>
                        </div>
                      )) : <p className="text-xs text-neutral-600 text-center py-10">لا يوجد سجل تعلم</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-6">
                      {!selectedUser.roles.includes("owner") && (
                        <Button onClick={() => { toggleAdmin.mutate({ userId: selectedUser.user_id, isAdmin: selectedUser.roles.includes("admin") }); setSelectedUser(null); }} className={`h-11 rounded-xl font-bold text-xs ${selectedUser.roles.includes("admin") ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-emerald-600 text-white"}`}>
                          {selectedUser.roles.includes("admin") ? "سحب الإشراف" : "ترقية لمشرف"}
                        </Button>
                      )}
                      <Button onClick={() => { suspendUser.mutate({ userId: selectedUser.user_id, currentStatus: !!selectedUser.is_suspended }); setSelectedUser(null); }} className={`h-11 rounded-xl font-bold text-xs ${selectedUser.is_suspended ? "bg-emerald-600" : "bg-rose-600"} text-white`}>
                        {selectedUser.is_suspended ? "تنشيط الحساب" : "إيقاف الحساب"}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
