import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, MailOpen, Trash2, User, Clock, Phone, 
  ArrowRight, ExternalLink, MessageSquare, CheckCircle2, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

// 🎨 تخصيص ألوان وأسماء أنواع الرسائل
const typeConfig: Record<string, { label: string, color: string, bg: string, border: string }> = {
  inquiry: { label: "استفسار", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  suggestion: { label: "اقتراح", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  complaint: { label: "شكوى", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  support: { label: "دعم فني", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMsg, setSelectedMsg] = useState<any>(null);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data: rawMsgs, error: msgsErr } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (msgsErr) throw msgsErr;

      const userIds = [...new Set((rawMsgs || []).map((m: any) => m.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email, phone, avatar_url")
          .in("user_id", userIds);
        (profiles || []).forEach((p: any) => { profilesMap[p.user_id] = p; });
      }

      return (rawMsgs || []).map((msg: any) => ({
        ...msg,
        profile: profilesMap[msg.user_id] || null,
      }));
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const deleteMsg = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم حذف الرسالة نهائياً" });
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      setSelectedMsg(null);
    },
  });

  const openMessage = (msg: any) => {
    setSelectedMsg(msg);
    if (!msg.is_read) {
      markRead.mutate(msg.id);
    }
  };

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-2 font-tajawal relative overflow-x-hidden" dir="rtl">
        
        {/* Ambient Glow */}
        <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* 🌟 Header Section 🌟 */}
        <div className="bg-[#0a0f0c] p-6 md:p-8 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 blur-3xl -z-10" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <MessageSquare className="w-8 h-8 text-blue-500" /> صندوق الوارد
            </h1>
            <p className="text-neutral-400 font-medium mt-2">قم بإدارة رسائل الطلاب، الاستفسارات، وشكاوى الدعم الفني.</p>
          </div>
          
          {/* Unread Badge */}
          <div className="bg-[#121A15] border border-neutral-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">غير مقروءة</span>
              <span className="text-2xl font-black text-white leading-none mt-1">{unreadCount}</span>
            </div>
            {unreadCount > 0 ? (
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-500 flex items-center justify-center border border-rose-500/30">
                <AlertCircle className="w-5 h-5 animate-pulse" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 p-4 rounded-2xl flex items-center gap-3 font-bold text-sm">
            <AlertCircle className="w-5 h-5" /> خطأ في تحميل الرسائل: {(error as any).message}
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedMsg ? (
            /* 🌟 Ticket Detail View (عرض تفاصيل الرسالة) 🌟 */
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              
              <Button variant="ghost" onClick={() => setSelectedMsg(null)} className="gap-2 text-neutral-400 hover:text-white hover:bg-[#121A15] rounded-xl h-12 px-5 font-bold transition-all">
                <ArrowRight className="w-5 h-5" /> العودة للقائمة
              </Button>

              <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2.5rem] shadow-2xl overflow-hidden">
                {/* رأس التذكرة (معلومات المرسل) */}
                <div className="bg-[#121A15] p-6 md:p-8 border-b border-neutral-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner">
                      {selectedMsg.profile?.avatar_url ? (
                        <img src={selectedMsg.profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover p-1" />
                      ) : (
                        <User className="w-7 h-7 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white mb-1.5">{selectedMsg.profile?.full_name || "مستخدم غير مسجل"}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-neutral-400">
                        <span className="flex items-center gap-1.5 bg-[#0a0f0c] px-2.5 py-1 rounded-md border border-neutral-800"><Mail className="w-3.5 h-3.5 text-neutral-500" /> {selectedMsg.profile?.email || "لا يوجد بريد"}</span>
                        {selectedMsg.profile?.phone && (
                          <span className="flex items-center gap-1.5 bg-[#0a0f0c] px-2.5 py-1 rounded-md border border-neutral-800"><Phone className="w-3.5 h-3.5 text-neutral-500" /> {selectedMsg.profile.phone}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-black border ${typeConfig[selectedMsg.type]?.bg} ${typeConfig[selectedMsg.type]?.border} ${typeConfig[selectedMsg.type]?.color}`}>
                      {typeConfig[selectedMsg.type]?.label || selectedMsg.type}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(selectedMsg.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })}
                    </span>
                  </div>
                </div>

                {/* محتوى الرسالة */}
                <div className="p-6 md:p-8 space-y-6">
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mb-3">موضوع الرسالة</h4>
                    <h2 className="font-black text-2xl text-white leading-tight">{selectedMsg.subject}</h2>
                  </div>
                  
                  <div className="bg-[#121A15] border border-neutral-800/80 rounded-2xl p-6 shadow-inner">
                    <p className="text-neutral-300 leading-loose whitespace-pre-wrap font-medium text-sm md:text-base">
                      {selectedMsg.message}
                    </p>
                  </div>
                </div>

                {/* شريط الإجراءات (Reply & Delete) */}
                <div className="bg-[#121A15] p-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {selectedMsg.profile?.email && (
                      <a href={`mailto:${selectedMsg.profile.email}?subject=رد من إدارة نبتة: ${selectedMsg.subject}`} className="flex-1 sm:flex-none">
                        <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white gap-2 font-bold h-12 rounded-xl shadow-lg shadow-blue-900/20">
                          <Mail className="w-4 h-4" /> رد بالإيميل
                        </Button>
                      </a>
                    )}
                    {selectedMsg.profile?.phone && (
                      <a href={`https://wa.me/${selectedMsg.profile.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                        <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 font-bold h-12 rounded-xl shadow-lg shadow-[#25D366]/20">
                          <ExternalLink className="w-4 h-4" /> واتساب
                        </Button>
                      </a>
                    )}
                  </div>
                  
                  <Button variant="destructive" onClick={() => { if(window.confirm("هل أنت متأكد من حذف هذه الرسالة؟")) deleteMsg.mutate(selectedMsg.id) }} className="w-full sm:w-auto bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white border border-rose-500/20 h-12 rounded-xl font-bold gap-2 transition-all">
                    <Trash2 className="w-4 h-4" /> حذف التذكرة
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            /* 🌟 Inbox List View (عرض قائمة الرسائل) 🌟 */
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-28 rounded-3xl animate-pulse" />)}
                </div>
              ) : (messages || []).length === 0 ? (
                <div className="text-center py-24 bg-[#0a0f0c] border border-neutral-800/50 rounded-[2.5rem]">
                  <MailOpen className="w-16 h-16 text-neutral-800 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white mb-2">صندوق الوارد فارغ</h3>
                  <p className="text-neutral-500 text-sm">لا توجد أي رسائل أو استفسارات في الوقت الحالي.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(messages || []).map((msg: any, i: number) => {
                    const config = typeConfig[msg.type] || typeConfig.inquiry;
                    const isUnread = !msg.is_read;

                    return (
                      <motion.div
                        key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                        onClick={() => openMessage(msg)}
                        className={`bg-[#0a0f0c] border p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 group hover:scale-[1.01] ${isUnread ? 'border-neutral-700 shadow-lg' : 'border-neutral-800/50 hover:border-neutral-700 opacity-75 hover:opacity-100'}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          
                          <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                            {/* Unread Indicator & Avatar */}
                            <div className="relative">
                              {isUnread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0a0f0c] animate-pulse z-10" />}
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${config.bg} ${config.border} ${config.color}`}>
                                {msg.profile?.avatar_url ? (
                                  <img src={msg.profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                  <User className="w-6 h-6" />
                                )}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className={`font-black text-base truncate ${isUnread ? 'text-white' : 'text-neutral-300'}`}>
                                  {msg.profile?.full_name || "مستخدم مجهول"}
                                </h3>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${config.bg} ${config.border} ${config.color}`}>
                                  {config.label}
                                </span>
                              </div>
                              <h4 className={`text-sm font-bold truncate ${isUnread ? 'text-neutral-200' : 'text-neutral-500'}`}>{msg.subject}</h4>
                              <p className="text-xs text-neutral-500 line-clamp-1">{msg.message}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-6 md:w-auto w-full border-t border-neutral-800/50 md:border-none pt-4 md:pt-0">
                            <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1.5 bg-[#121A15] px-3 py-1.5 rounded-lg border border-neutral-800">
                              <Clock className="w-3.5 h-3.5" />
                              <span dir="ltr">{new Date(msg.created_at).toLocaleDateString("ar-EG", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                            </span>
                            
                            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                              {isUnread && (
                                <Button variant="ghost" size="icon" className="h-9 w-9 text-blue-500 hover:bg-blue-500/10 rounded-xl" onClick={() => markRead.mutate(msg.id)} title="تحديد كمقروء">
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors" onClick={() => { if(window.confirm("حذف الرسالة؟")) deleteMsg.mutate(msg.id) }}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
