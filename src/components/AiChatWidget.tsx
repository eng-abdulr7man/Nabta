import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageCircle, X, Send, Bot, User, 
  Loader2, Sparkles, Trash2, ShoppingBag, ArrowRight 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client"; // تأكد من المسار عندك

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
  const [products, setProducts] = useState<any[]>([]); // مخزن منتجات المتجر
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. جلب منتجات المتجر للبحث فيها
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // دالة البحث عن منتج متعلق بالرد
  const findRelatedProduct = (aiText: string) => {
    if (!aiText) return null;
    return products.find(p => 
      aiText.toLowerCase().includes(p.name.toLowerCase()) || 
      aiText.toLowerCase().includes(p.category.toLowerCase())
    );
  };

  const clearChat = () => {
    setMessages([{ role: "assistant", content: WELCOME_MESSAGE }]);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    const userMessage: Message = { role: "user", content: userMsg };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const SYSTEM_PROMPT: Message = {
      role: "system",
      content: `أنت مستشار زراعي خبير في 'نبتة'. 
      1. قدم حلولاً علمية دقيقة.
      2. إذا اقترحت استخدام سماد أو مبيد أو أداة، تفقد قائمة المنتجات التالية: ${products.map(p => p.name).join(', ')}.
      3. إذا كان المنتج متاحاً، انصح المستخدم بشرائه من متجر نبتة بأسلوب ودود.`
    };

    const exitWords = ["شكرا", "مع السلامة", "سلام", "قفلنا", "شكراً", "تم"];
    const isExit = exitWords.some(word => userMsg.toLowerCase().includes(word));

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
          messages: [SYSTEM_PROMPT, ...chatHistory, userMessage],
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        const aiContent = data.choices[0].message.content;
        setMessages((prev) => [...prev, { role: "assistant", content: aiContent }]);

        if (isExit) {
          setTimeout(() => { setIsOpen(false); setTimeout(clearChat, 500); }, 5000);
        }
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "معلش يا هندسة، حصل دروب في الشبكة. جرب تاني." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[200] font-tajawal">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-0 w-[350px] md:w-[400px] h-[600px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121A15] border-b border-white/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">مساعد نبتة الذكي</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] text-emerald-500/80 font-medium">نشط الآن</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={clearChat} className="p-2 text-neutral-500 hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-2 text-neutral-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-[#0a0f0c] to-[#050806] no-scrollbar">
              {messages.map((msg, idx) => {
                const product = msg.role === "assistant" ? findRelatedProduct(msg.content) : null;
                
                return (
                  <div key={idx} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                      <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${msg.role === "user" ? "bg-blue-500/10 text-blue-400" : "bg-emerald-500/10 text-emerald-400"}`}>
                        {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                        msg.role === "user" 
                        ? "bg-emerald-600 text-white rounded-tr-none" 
                        : "bg-[#121A15] text-neutral-200 border border-white/5 rounded-tl-none"
                      }`} dir="rtl">
                        {msg.content}
                      </div>
                    </div>

                    {/* 🛒 كارت المنتج الذكي */}
                    {product && (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        className="mt-3 ml-10 w-[240px] bg-[#121A15] border border-emerald-500/30 rounded-2xl overflow-hidden shadow-xl group"
                      >
                        <div className="h-28 bg-neutral-900 relative">
                          <img src={product.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          <div className="absolute top-2 right-2 bg-emerald-500 text-[9px] font-bold px-2 py-0.5 rounded-full text-white">متوفر</div>
                        </div>
                        <div className="p-3">
                          <h5 className="text-white font-bold text-xs mb-1 truncate">{product.name}</h5>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-emerald-400 font-black text-sm">{product.price}</span>
                            <a 
                              href={`https://wa.me/201234567890?text=محتاج أطلب ${product.name} اللي اقترحه المساعد`}
                              className="bg-emerald-600 p-1.5 rounded-lg text-white hover:bg-emerald-500 transition-all"
                            >
                              <ShoppingBag size={14} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex gap-2 items-center p-2 opacity-60">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-4 bg-[#121A15] border-t border-white/5">
              <div className="relative flex items-center gap-2 bg-[#0a0f0c] border border-white/10 rounded-2xl px-3 py-2 focus-within:border-emerald-500/50 transition-all">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                  placeholder="اسأل مستشارك الزراعي..."
                  className="flex-1 bg-transparent text-white text-sm resize-none h-[40px] outline-none text-right py-2"
                  dir="rtl"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white disabled:opacity-30 hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative w-16 h-16 rounded-2xl bg-[#121A15] border border-emerald-500/20 flex items-center justify-center shadow-2xl transition-all"
      >
        <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-xl group-hover:bg-emerald-500/20 transition-all" />
        <MessageCircle className="w-7 h-7 text-emerald-500 relative z-10" />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
