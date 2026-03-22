import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2, Sparkles, Trash2, ShoppingBag 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GROQ_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "أهلاً بك في نبتة! 🌱 أنا مستشارك الزراعي الذكي. إزاي أقدر أساعدك في مزرعتك أو محصولك النهاردة؟";

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME_MESSAGE }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. جلب المنتجات من الداتابيس عند التشغيل
  useEffect(() => {
    const fetchStore = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (!error && data) {
        setProducts(data);
        console.log("Products loaded for AI:", data.length);
      }
    };
    fetchStore();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 2. دالة البحث الذكي (Smart Matching)
  // بتبحث لو أي كلمة من اسم المنتج موجودة في رد الـ AI
  const findRelatedProduct = (aiText: string) => {
    if (!aiText || products.length === 0) return null;
    const text = aiText.toLowerCase();
    
    return products.find(p => {
      const name = p.name.toLowerCase();
      const cat = p.category?.toLowerCase() || "";
      // بيشيك لو الاسم موجود أو لو الرد فيه كلمات دلالية زي "يوريا" أو "مبيد"
      return text.includes(name) || name.includes(text) || text.includes(cat);
    });
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    // تجهيز قائمة الأسماء للـ AI عشان "يفهم" إحنا بنبيع إيه
    const storeInventory = products.map(p => p.name).join(' - ');

    const SYSTEM_PROMPT: Message = {
      role: "system",
      content: `أنت خبير زراعي في منصة 'نبتة'. 
      - أجب بلهجة مصرية مهذبة وعلمية.
      - هذه قائمة المنتجات المتاحة في متجرنا: (${storeInventory}).
      - إذا اقترحت حلاً يتضمن أحد هذه المنتجات، يجب أن تذكره باسمه الصريح وتنصح بشرائه من متجر نبتة.`
    };

    try {
      const chatHistory = messages.filter(msg => msg.content !== WELCOME_MESSAGE);
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [SYSTEM_PROMPT, ...chatHistory, { role: "user", content: userMsg }],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "حصل دروب في الشبكة يا هندسة، جرب تاني كمان شوية." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-28 md:bottom-6 left-6 z-[200] font-tajawal" dir="rtl">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-[320px] md:w-[400px] h-[550px] bg-[#0a0f0c] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-emerald-600/10 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Sparkles className="text-white w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">مساعد نبتة الذكي</h4>
                  <p className="text-[10px] text-emerald-500">متصل الآن</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-500">
                <button onClick={clearChat} className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                <button onClick={() => setIsOpen(false)} className="hover:text-white transition-colors"><X size={20} /></button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar bg-gradient-to-b from-[#0a0f0c] to-[#050806]">
              {messages.map((msg, i) => {
                const product = msg.role === "assistant" ? findRelatedProduct(msg.content) : null;
                
                return (
                  <div key={i} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed ${
                      msg.role === "user" 
                      ? "bg-emerald-600 text-white rounded-bl-none shadow-lg" 
                      : "bg-white/5 text-neutral-200 rounded-br-none border border-white/5"
                    }`}>
                      {msg.content}
                    </div>

                    {/* 🎁 كارت المنتج الذكي (يظهر تحت رد المساعد) */}
                    {product && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        className="mt-3 w-full bg-[#121A15] border border-emerald-500/30 rounded-2xl p-3 flex items-center gap-3 hover:border-emerald-500 transition-all shadow-xl"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 shrink-0 border border-white/5">
                          <img src={product.image_url} className="w-full h-full object-cover" alt={product.name} />
                        </div>
                        <div className="flex-1 min-w-0 text-right">
                          <p className="text-[9px] text-emerald-500 font-bold mb-0.5">اقتراح المتجر</p>
                          <h5 className="text-xs font-bold text-white truncate">{product.name}</h5>
                          <p className="text-emerald-400 font-black text-sm">{product.price}</p>
                        </div>
                        <a 
                          href={`https://wa.me/201234567890?text=أهلاً نبتة، محتاج أطلب المنتج اللي المساعد اقترحه: ${product.name}`}
                          className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
                        >
                          <ShoppingBag size={16} />
                        </a>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex items-center gap-2 text-neutral-600 text-[10px] animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" /> جاري البحث عن أفضل الحلول...
                </div>
              )}
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
                <button onClick={handleSendMessage} disabled={isLoading} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 hover:text-white transition-colors disabled:opacity-30">
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الزرار الدائري الفخم */}
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
