import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2, Sparkles, Trash2, ShoppingBag, 
  CheckCircle2, MessageSquarePlus 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GROQ_API_KEY = "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";
const WHATSAPP_NUMBER = "201019715490";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  showActions?: boolean; // خاصية للعرض فقط في الواجهة
}

const WELCOME_MESSAGE = "أهلاً بك في نبتة! 🌱 أنا مستشارك الزراعي الذكي. إزاي أقدر أساعدك في مزرعتك النهاردة؟";

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME_MESSAGE, showActions: false }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. جلب منتجات المتجر
  useEffect(() => {
    const fetchStore = async () => {
      const { data } = await supabase.from("products").select("*");
      if (data) setProducts(data);
    };
    fetchStore();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  // 2. دالة البحث الذكي عن منتج
  const findRelatedProduct = (aiText: string) => {
    if (!aiText || products.length === 0) return null;
    const text = aiText.toLowerCase();
    return products.find(p => text.includes(p.name.toLowerCase()) || text.includes(p.category?.toLowerCase()));
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: WELCOME_MESSAGE, showActions: false }]);
  };

  // 3. إنهاء الشات مع كود الخصم
  const handleCloseChat = () => {
    setMessages(prev => [...prev, { 
      role: "assistant", 
      content: "سعدت جداً بمساعدتك يا هندسة! 🍃 كتقدير مننا، ده كود خصم 5% (NABTA05) تقدر تستخدمه في المتجر. نهارك أخضر! 🎁",
      showActions: false 
    }]);

    setTimeout(() => {
      setIsOpen(false);
      setTimeout(clearChat, 1000);
    }, 7000);
  };

  // 4. إرسال الرسالة (مع تنظيف البيانات لحل Error 400)
  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || input.trim();
    if (!textToSend || isLoading) return;

    // إخفاء الأزرار من الرسائل السابقة
    setMessages(prev => prev.map(m => ({ ...m, showActions: false })));
    
    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const storeInventory = products.length > 0 ? products.map(p => p.name).join(' - ') : "متوفر أسمدة ومبيدات متنوعة";

    try {
      // 🔥 الحتة المهمة: نبعت بس role و content لـ Groq
      const cleanHistory = messages
        .filter(msg => msg.content !== WELCOME_MESSAGE)
        .map(({ role, content }) => ({ role, content }));

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: `أنت مستشار زراعي خبير في نبتة. قائمة منتجاتنا: (${storeInventory}). رد بلهجة مصرية مهذبة وانصح بمنتجاتنا.` },
            ...cleanHistory, 
            { role: "user", content: textToSend }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) throw new Error("API Error");

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        setMessages((prev) => [...prev, { 
          role: "assistant", 
          content: data.choices[0].message.content,
          showActions: true 
        }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "معلش يا هندسة، حصل دروب بسيط في السيرفر. جرب تاني." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 md:bottom-6 left-6 z-[200] font-tajawal text-right" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-[320px] md:w-[400px] h-[580px] bg-[#0a0f0c] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-[#121A15] border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                  <Sparkles className="text-emerald-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">مستشار نبتة الذكي</h4>
                  <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[10px] text-emerald-500">متصل الآن</span></div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-500 hover:text-white transition-colors"><X size={20} /></button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
              {messages.map((msg, i) => {
                const product = msg.role === "assistant" ? findRelatedProduct(msg.content) : null;
                return (
                  <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                      msg.role === "user" ? "bg-emerald-600 text-white rounded-bl-none shadow-lg shadow-emerald-900/10" : "bg-white/5 text-neutral-200 rounded-br-none border border-white/5"
                    }`}>
                      {msg.content}
                    </div>

                    {/* كارت المنتج */}
                    {product && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="mt-3 w-full bg-[#121A15] border border-emerald-500/20 rounded-2xl p-3 flex items-center gap-3 hover:border-emerald-500/40 transition-all"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 border border-white/5"><img src={product.image_url} className="w-full h-full object-cover" alt={product.name} /></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[9px] text-emerald-500 font-bold mb-0.5">اقتراح المتجر</p>
                          <h5 className="text-xs font-bold text-white truncate">{product.name}</h5>
                          <p className="text-emerald-400 font-black text-sm">{product.price}</p>
                        </div>
                        <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=محتاج أطلب: ${product.name}`} className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"><ShoppingBag size={16} /></a>
                      </motion.div>
                    )}

                    {/* أزرار التحكم */}
                    {msg.showActions && !isLoading && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-wrap gap-2 justify-start w-full">
                        <button 
                          onClick={handleCloseChat}
                          className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[11px] text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition-all shadow-sm"
                        >
                          <CheckCircle2 size={12} /> شكراً، اكتفيت
                        </button>
                        <button 
                          onClick={() => handleSendMessage("عندي سؤال تاني..")}
                          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600/10 border border-emerald-500/20 rounded-full text-[11px] text-emerald-400 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                          <MessageSquarePlus size={12} /> عندي سؤال تاني
                        </button>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              {isLoading && <div className="flex items-center gap-2 text-neutral-600 text-[10px] animate-pulse"><Loader2 className="w-3 h-3 animate-spin" /> جاري التفكير...</div>}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative">
                <input 
                  value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="اسأل مستشارك الزراعي..."
                  className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pr-4 pl-12 text-sm text-white outline-none focus:border-emerald-500 transition-all text-right"
                  dir="rtl"
                />
                <button onClick={() => handleSendMessage()} disabled={isLoading} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-white transition-colors disabled:opacity-30"><Send size={20} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* زرار المساعد الدائري الفخم */}
      <motion.button
        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-emerald-600 rounded-full shadow-2xl flex items-center justify-center text-white relative z-[210] border-4 border-[#050806]"
      >
        <AnimatePresence mode="wait">
          {isOpen ? <X key="x" /> : <MessageCircle key="msg" />}
        </AnimatePresence>
        <div className="absolute inset-0 bg-emerald-500 rounded-full blur-xl opacity-20 animate-pulse" />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
