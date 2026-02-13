import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

const typeLabels: Record<string, string> = {
  inquiry: "استفسار",
  suggestion: "اقتراح",
  complaint: "شكوى",
  support: "دعم فني",
};

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*, profiles:user_id(full_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
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
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-black text-foreground">الرسائل</h1>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="glass-card h-20 animate-pulse" />)}
          </div>
        ) : (messages || []).length === 0 ? (
          <p className="text-center text-muted-foreground py-12">لا توجد رسائل</p>
        ) : (
          <div className="space-y-3">
            {(messages || []).map((msg: any, i: number) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`glass-card p-4 space-y-2 ${!msg.is_read ? "border-r-2 border-r-primary" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                      {typeLabels[msg.type] || msg.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {msg.profiles?.full_name || "مستخدم"} • {new Date(msg.created_at).toLocaleDateString("ar")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
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
                <p className="text-sm text-muted-foreground">{msg.message}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
