import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, Copy, Check } from "lucide-react";

const GROQ_API_KEY = "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";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE = "جاهز يا هندسة! 🚀 أنا دلوقتي شغال بأحدث موديل (Llama 3.3). ابعتلي اسم الكورس أو رؤوس أقلام عنه، وهطلعلك وصف "نار" يليق بمنصة نبتة.";

const SYSTEM_PROMPT: Message = {
  role: "system",
  content: `أنت مساعد ذكي متخصص في استخراج وصياغة وصف الكورسات التعليمية لمنصة 'نبتة' الزراعية.
  مهمتك: تحويل أسماء الكورسات أو المواضيع التقنية البسيطة إلى وصف تسويقي وتعليمي احترافي.
  يجب أن يحتوي ردك على:
  1. عنوان جذاب للكورس.
  2. نبذة تعريفية (لماذا هذا الكورس مهم؟).
  3. محاور الدورة (نقاط واضحة لما سيتم تعلمه).
  4. الفئة المستهدفة (مهندسين، مزارعين، هواة).
  الأسلوب: مصري مهني، بسيط، ومحفز.`
};

const AiChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: WELCOME_MESSAGE }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const chatHistory = messages.filter(msg => msg.content !== WELCOME_MESSAGE);
      
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // الموديل اللي طلبته يا هندسة
          messages: [SYSTEM_PROMPT, ...chatHistory, userMessage],
          temperature: 0.6,
          max_tokens: 1200,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Groq API Error:", errorData);
        throw new Error("API Error");
      }

      const data = await response.json();
      if (data.choices?.[0]?.message) {
        setMessages((prev) => [...prev, {
          role: "assistant",
          content: data.choices[0].message.content,
        }]);
      }
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "حصلت مشكلة في السيرفر، جرب تاني يا ريس." }]);
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
            className="absolute bottom-20 left-0 w-[350px] md:w-[480px] h-[650px] bg-[#0a0f0c] border border-emerald-500/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121A15] border-b border-white/5 p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">نبتة AI (Llama 3.3)</h3>
                  <p className="text-[10px] text-emerald-500">خبير وصف الكورسات</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#0a0f0c]">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.role === "user" ? "bg-blue-600/20 text-blue-400" : "bg-emerald-600/20 text-emerald-400"}`}>
                    {msg.role === "user" ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className={`relative group max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-[#121A15] text-neutral-200 border border-white/5 rounded-tl-none"
                  }`}>
                    {msg.content.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}
                    
                    {msg.role === "assistant" && idx !== 0 && (
                      <button 
                        onClick={() => handleCopy(msg.content, idx)}
                        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/5 rounded hover:bg-white/10"
                      >
                        {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-neutral-400" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 items-center text-emerald-500 text-xs animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري تحليل المحتوى وكتابة الوصف...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-[#121A15] border-t border-white/5 flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                placeholder="مثلاً: كورس عن مكافحة آفات الطماطم..."
                className="flex-1 bg-[#0a0f0c] border border-white/10 rounded-xl p-3 text-white text-sm resize-none h-[55px] outline-none focus:border-emerald-500/50"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-emerald-600 w-12 rounded-xl text-white hover:bg-emerald-500 flex items-center justify-center transition-all disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl text-white"
      >
        <MessageCircle className="w-7 h-7" />
      </motion.button>
    </div>
  );
};

export default AiChatWidget;
