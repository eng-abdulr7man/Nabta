import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, MailOpen, User, Clock, Phone, ArrowRight, ExternalLink, 
  MessageSquare, CheckCircle2, AlertCircle, Bot, Zap, Filter, CheckCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const typeConfig: Record<string, { label: string, color: string, bg: string, border: string }> = {
  inquiry: { label: "استفسار", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  suggestion: { label: "اقتراح", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  complaint: { label: "شكوى", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  support: { label: "دعم فني", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
};

const cannedResponses = [
  { title: "استخراج الشهادة 🎓", text: "أهلاً بك. يتم إصدار الشهادة تلقائياً بمجرد إتمامك لجميع دروس الكورس بنسبة 100% واجتياز الاختبار النهائي. يمكنك إيجادها في ملفك الشخصي." },
  { title: "كلمة المرور 🔒", text: "مرحباً. يمكنك إعادة تعيين كلمة المرور بكل سهولة من خلال الضغط على 'نسيت كلمة المرور' في صفحة تسجيل الدخول، واتباع الخطوات المرسلة لبريدك." },
  { title: "مشكلة تقنية 🛠️", text: "نعتذر جداً عن هذا العطل التقني. لقد قمنا بتحويل المشكلة لفريق التطوير للعمل عليها فوراً، وسيتم حلها في أقرب وقت ممكن. شكراً لتفهمك." },
];

const AdminMessages = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMsg, setSelectedMsg] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  
  // Workspace States
  const [replyText, setReplyText] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const { data: messages, isLoading, error } = useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data: rawMsgs, error: msgsErr } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (msgsErr) throw msgsErr;

      const userIds = [...new Set((rawMsgs || []).map((m: any) => m.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const { data: profiles } = await supabase.from("profiles").select("user_id, full_name, email, phone, avatar_url").in("user_id", userIds);
        (profiles || []).forEach((p: any) => { profilesMap[p.user_id] = p; });
      }

      return (rawMsgs || []).map((msg: any) => ({ ...msg, profile: profilesMap[msg.user_id] || null }));
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });

  const resolveMsg = useMutation({
    mutationFn: async (id: string) => {
      // إحنا هنا بنحذفها عشان نعتبرها خلصت (Resolved)، أو ممكن تخليها update لـ status لو ضفت عمود في الداتابيز
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "تم إنهاء التذكرة بنجاح ✔️", description: "تم إغلاق المحادثة وإزالتها من صندوق الوارد." });
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      setSelectedMsg(null);
      setReplyText("");
    },
  });

  const openMessage = (msg: any) => {
    setSelectedMsg(msg);
    setReplyText(""); // تصفير منطقة الرد للتذكرة الجديدة
    if (!msg.is_read) markRead.mutate(msg.id);
  };

  const generateAIReply = async () => {
    if (!selectedMsg) return;
    setIsGeneratingAI(true);
    const userName = selectedMsg.profile?.full_name || "الطالب";

    try {
      const { data, error } = await supabase.functions.invoke("admin-ai", {
        body: { action: "message-reply", data: { userName, subject: selectedMsg.subject, message: selectedMsg.message } },
      });
      if (error || !data?.content) throw new Error(data?.error || "فشل توليد الرد");
      setReplyText(data.content);
      toast({ title: "الذكاء الاصطناعي 🤖", description: "تم توليد الرد بنجاح!" });
    } catch (err) {
      toast({ title: "فشل توليد الرد", description: "حاول تاني كمان شوية.", variant: "destructive" });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const filteredMessages = messages?.filter(msg => {
    if (activeFilter === "all") return true;
    if (activeFilter === "unread") return !msg.is_read;
    return msg.type === activeFilter;
  });

  const unreadCount = messages?.filter(m => !m.is_read).length || 0;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8 p-2 font-tajawal relative overflow-x-hidden" dir="rtl">
        <div className="absolute top-[-5%] right-[-5%] w-[300px] h-[300px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* 🌟 Header Section 🌟 */}
        <div className="bg-[#0a0f0c] p-6 md:p-8 rounded-[2rem] border border-neutral-800/60 shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 left-0 w-40 h-40 bg-blue-500/10 blur-3xl -z-10" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white flex items-center gap-3 tracking-tight">
              <MessageSquare className="w-8 h-8 text-blue-500" /> مركز الدعم والرسائل
            </h1>
            <p className="text-neutral-400 font-medium mt-2">نظام متكامل لإدارة تذاكر الدعم الفني، الشكاوى، واستفسارات الطلاب.</p>
          </div>
          
          <div className="bg-[#121A15] border border-neutral-800 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-inner">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">تذاكر مفتوحة</span>
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
            <AlertCircle className="w-5 h-5" /> خطأ في تحميل التذاكر: {(error as any).message}
          </div>
        )}

        <AnimatePresence mode="wait">
          {selectedMsg ? (
            /* 🌟 Ticket Workspace (منطقة العمل والرد) 🌟 */
            <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              
              <Button variant="ghost" onClick={() => setSelectedMsg(null)} className="gap-2 text-neutral-400 hover:text-white hover:bg-[#121A15] rounded-xl h-12 px-5 font-bold transition-all">
                <ArrowRight className="w-5 h-5" /> العودة للبريد
              </Button>

              <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
                
                {/* رأس التذكرة */}
                <div className="bg-[#121A15] p-6 md:p-8 border-b border-neutral-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 shadow-inner">
                      {selectedMsg.profile?.avatar_url ? (
                        <img src={selectedMsg.profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover p-1" />
                      ) : <User className="w-7 h-7 text-blue-500" />}
                    </div>
                    <div>
                      <h3 className="font-black text-xl text-white mb-1.5">{selectedMsg.profile?.full_name || "مستخدم مجهول"}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-neutral-400">
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {selectedMsg.profile?.email || "لا يوجد بريد"}</span>
                        {selectedMsg.profile?.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {selectedMsg.profile.phone}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`px-4 py-1.5 rounded-lg text-xs font-black border ${typeConfig[selectedMsg.type]?.bg} ${typeConfig[selectedMsg.type]?.border} ${typeConfig[selectedMsg.type]?.color}`}>
                      {typeConfig[selectedMsg.type]?.label || selectedMsg.type}
                    </span>
                    <span className="text-xs text-neutral-500 font-bold flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" /> {new Date(selectedMsg.created_at).toLocaleString("ar-EG", { dateStyle: "long", timeStyle: "short" })}
                    </span>
                  </div>
                </div>

                {/* محتوى الشكوى */}
                <div className="p-6 md:p-8">
                  <h4 className="text-[11px] font-black text-neutral-500 uppercase tracking-widest mb-3">موضوع الرسالة</h4>
                  <h2 className="font-black text-2xl text-white leading-tight mb-4">{selectedMsg.subject}</h2>
                  <div className="bg-[#121A15]/50 border border-neutral-800/80 rounded-2xl p-6 shadow-inner">
                    <p className="text-neutral-300 leading-loose whitespace-pre-wrap font-medium text-sm">{selectedMsg.message}</p>
                  </div>
                </div>

                {/* 🌟 منطقة الرد (Reply Workspace) 🌟 */}
                <div className="p-6 md:p-8 bg-[#050806] border-t border-blue-500/20 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-black text-blue-500 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" /> صياغة الرد (Workspace)
                    </h4>
                    
                    {/* أزرار الردود الجاهزة والذكاء الاصطناعي */}
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button onClick={generateAIReply} disabled={isGeneratingAI} className="bg-purple-600 hover:bg-purple-500 text-white text-xs h-9 rounded-lg gap-1.5 font-bold shadow-lg shadow-purple-900/20">
                        {isGeneratingAI ? <AlertCircle className="w-3.5 h-3.5 animate-spin" /> : <Bot className="w-3.5 h-3.5" />} رد بالذكاء الاصطناعي
                      </Button>
                      {cannedResponses.map((c, idx) => (
                        <Button key={idx} onClick={() => setReplyText(c.text)} variant="outline" className="text-xs h-9 rounded-lg border-neutral-700 bg-[#121A15] text-neutral-300 hover:text-white hover:border-emerald-500/50 gap-1.5">
                          <Zap className="w-3 h-3 text-emerald-500" /> {c.title}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="اكتب ردك هنا، أو استخدم المساعد الذكي والردود الجاهزة بالأعلى..."
                    rows={4}
                    className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl p-4 text-white text-sm focus:border-blue-500/50 outline-none resize-none shadow-inner"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    {/* إرسال الرد */}
                    <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                      {selectedMsg.profile?.email && (
                        <a href={`mailto:${selectedMsg.profile.email}?subject=رد من إدارة نبتة: ${selectedMsg.subject}&body=${encodeURIComponent(replyText)}`} className="flex-1 sm:flex-none">
                          <Button disabled={!replyText} className="w-full bg-blue-600 hover:bg-blue-500 text-white gap-2 font-bold h-12 rounded-xl shadow-lg shadow-blue-900/20">
                            <Mail className="w-4 h-4" /> إرسال بالإيميل
                          </Button>
                        </a>
                      )}
                      {selectedMsg.profile?.phone && (
                        <a href={`https://wa.me/${selectedMsg.profile.phone.replace(/\D/g, "")}?text=${encodeURIComponent(replyText)}`} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                          <Button disabled={!replyText} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white gap-2 font-bold h-12 rounded-xl shadow-lg shadow-[#25D366]/20">
                            <ExternalLink className="w-4 h-4" /> إرسال واتساب
                          </Button>
                        </a>
                      )}
                    </div>
                    
                    {/* إنهاء التذكرة (Resolved) */}
                    <Button onClick={() => { if(window.confirm("هل تم حل مشكلة الطالب وإغلاق التذكرة؟")) resolveMsg.mutate(selectedMsg.id) }} className="w-full sm:w-auto bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 h-12 rounded-xl font-bold gap-2 transition-all">
                      <CheckCheck className="w-4 h-4" /> تم الحل (إنهاء التذكرة)
                    </Button>
                  </div>
                </div>

              </div>
            </motion.div>
          ) : (
            /* 🌟 Inbox List View (شريط الفلترة وقائمة التذاكر) 🌟 */
            <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* شريط التبويبات الذكي */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <div className="flex items-center gap-2 bg-[#0a0f0c] p-1.5 rounded-2xl border border-neutral-800/60 shadow-lg shrink-0">
                  <Filter className="w-4 h-4 text-neutral-500 ml-2" />
                  <Button onClick={() => setActiveFilter("all")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold px-4 ${activeFilter === "all" ? "bg-neutral-800 text-white" : "text-neutral-500 hover:text-white"}`}>الكل</Button>
                  <Button onClick={() => setActiveFilter("unread")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold px-4 ${activeFilter === "unread" ? "bg-blue-600 text-white" : "text-neutral-500 hover:text-white"}`}>تذاكر مفتوحة {unreadCount > 0 && `(${unreadCount})`}</Button>
                  <div className="w-px h-5 bg-neutral-800 mx-1" />
                  <Button onClick={() => setActiveFilter("complaint")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold px-4 ${activeFilter === "complaint" ? "bg-rose-500/20 text-rose-400" : "text-neutral-500 hover:text-rose-400"}`}>الشكاوى</Button>
                  <Button onClick={() => setActiveFilter("support")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold px-4 ${activeFilter === "support" ? "bg-blue-500/20 text-blue-400" : "text-neutral-500 hover:text-blue-400"}`}>الدعم الفني</Button>
                  <Button onClick={() => setActiveFilter("inquiry")} variant="ghost" className={`h-9 rounded-xl text-xs font-bold px-4 ${activeFilter === "inquiry" ? "bg-emerald-500/20 text-emerald-400" : "text-neutral-500 hover:text-emerald-400"}`}>الاستفسارات</Button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-[#0a0f0c] border border-neutral-800/50 h-28 rounded-3xl animate-pulse" />)}
                </div>
              ) : (filteredMessages || []).length === 0 ? (
                <div className="text-center py-24 bg-[#0a0f0c] border border-neutral-800/50 rounded-[2.5rem]">
                  <CheckCheck className="w-16 h-16 text-emerald-900 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-white mb-2">الصندوق نظيف تماماً!</h3>
                  <p className="text-neutral-500 text-sm">لا توجد رسائل أو تذاكر حالياً تلبي هذا التصنيف.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(filteredMessages || []).map((msg: any, i: number) => {
                    const config = typeConfig[msg.type] || typeConfig.inquiry;
                    const isUnread = !msg.is_read;

                    return (
                      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} onClick={() => openMessage(msg)}
                        className={`bg-[#0a0f0c] border p-5 rounded-[1.5rem] cursor-pointer transition-all duration-300 group hover:scale-[1.01] ${isUnread ? 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]' : 'border-neutral-800/50 hover:border-neutral-700 opacity-75 hover:opacity-100'}`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start md:items-center gap-4 flex-1 min-w-0">
                            <div className="relative">
                              {isUnread && <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-[#0a0f0c] animate-pulse z-10" />}
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${config.bg} ${config.border} ${config.color}`}>
                                {msg.profile?.avatar_url ? <img src={msg.profile.avatar_url} alt="" className="w-full h-full rounded-2xl object-cover" /> : <User className="w-6 h-6" />}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-center gap-3">
                                <h3 className={`font-black text-base truncate ${isUnread ? 'text-white' : 'text-neutral-300'}`}>{msg.profile?.full_name || "مستخدم مجهول"}</h3>
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${config.bg} ${config.border} ${config.color}`}>{config.label}</span>
                              </div>
                              <h4 className={`text-sm font-bold truncate ${isUnread ? 'text-blue-100' : 'text-neutral-500'}`}>{msg.subject}</h4>
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
                                  <MailOpen className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" className="h-9 w-9 text-neutral-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-colors" onClick={() => { if(window.confirm("هل تم الحل؟")) resolveMsg.mutate(msg.id) }} title="تم الحل وإغلاق">
                                <CheckCheck className="w-4 h-4" />
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
