import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2, User, Clock, Phone, ArrowRight, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const typeLabels: Record<string, string> = {
  inquiry: "استفسار",
  suggestion: "اقتراح",
  complaint: "شكوى",
  support: "دعم فني",
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

      // Fetch profiles separately since no FK
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
      toast({ title: "تم حذف الرسالة" });
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground flex items-center gap-2">
          <Mail className="w-6 h-6 text-primary" />
          الرسائل
        </h1>

        {error && (
          <div className="glass-card p-4 text-destructive text-sm">
            خطأ في تحميل الرسائل: {(error as any).message}
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedMsg ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <Button variant="ghost" size="sm" onClick={() => setSelectedMsg(null)} className="gap-1 text-muted-foreground">
                <ArrowRight className="w-4 h-4" />
                العودة للرسائل
              </Button>

              <div className="glass-card p-6 space-y-5">
                {/* Sender Info */}
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {selectedMsg.profile?.avatar_url ? (
                      <img src={selectedMsg.profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-bold text-foreground">{selectedMsg.profile?.full_name || "مستخدم مجهول"}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedMsg.profile?.email || "لا يوجد بريد"}
                    </p>
                    {selectedMsg.profile?.phone && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedMsg.profile.phone}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                        {typeLabels[selectedMsg.type] || selectedMsg.type}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(selectedMsg.created_at).toLocaleString("ar", { dateStyle: "long", timeStyle: "short" })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Message Content */}
                <div>
                  <h2 className="font-bold text-lg text-foreground mb-2">{selectedMsg.subject}</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{selectedMsg.message}</p>
                </div>

                {/* Reply Options */}
                <div className="pt-4 border-t border-border space-y-3">
                  <p className="text-sm font-bold text-foreground">طرق الرد:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedMsg.profile?.email && (
                      <a href={`mailto:${selectedMsg.profile.email}?subject=رد: ${selectedMsg.subject}`}>
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          رد بالبريد الإلكتروني
                        </Button>
                      </a>
                    )}
                    {selectedMsg.profile?.phone && (
                      <a href={`https://wa.me/${selectedMsg.profile.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5" />
                          رد عبر واتساب
                        </Button>
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-1"
                    onClick={() => deleteMsg.mutate(selectedMsg.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    حذف الرسالة
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card h-20 animate-pulse" />)}
                </div>
              ) : (messages || []).length === 0 ? (
                <div className="text-center py-16">
                  <Mail className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">لا توجد رسائل</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(messages || []).map((msg: any, i: number) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => openMessage(msg)}
                      className={`glass-card p-4 space-y-2 cursor-pointer hover-lift ${!msg.is_read ? "border-r-2 border-r-primary" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                            {typeLabels[msg.type] || msg.type}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {msg.profile?.full_name || "مستخدم"} • {new Date(msg.created_at).toLocaleDateString("ar")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {!msg.is_read && (
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => markRead.mutate(msg.id)} title="تحديد كمقروء">
                              <MailOpen className="w-3.5 h-3.5" />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => deleteMsg.mutate(msg.id)}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                      <h3 className="font-bold text-sm text-foreground">{msg.subject}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-1">{msg.message}</p>
                    </motion.div>
                  ))}
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
