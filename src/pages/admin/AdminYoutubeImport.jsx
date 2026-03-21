import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, ArrowRight, Loader2, LayoutGrid, Sparkles, 
  Edit3, User, Clock, CheckCircle2, ChevronDown, TreePine, PlayCircle 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const YOUTUBE_API_KEY = "AIzaSyAM5K8Aka_MvqfQNRmPITYExIIn9JmMWao";
const GEMINI_API_KEY = "AIzaSyBbw49D_xmkrNxl9JniPdCWWgD3aLGThSY";

const AdminYoutubeImport = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpecs = async () => {
      const { data } = await supabase.from("specializations").select("id, name").order("sort_order");
      if (data) setSpecializations(data);
    };
    fetchSpecs();
  }, []);

  const extractPlaylistId = (url) => {
    const reg = /[&?]list=([^&]+)/i;
    const match = reg.exec(url);
    return match ? match[1] : url;
  };

  const parseYouTubeDuration = (durationStr) => {
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 60 + minutes + (seconds > 30 ? 1 : 0);
  };

 const generateAIDescription = async (courseName) => {
    setIsGenerating(true);
    const prompt = `اكتب وصفاً تسويقياً لكورس بعنوان '${courseName}' في 5 أسطر احترافية باللغة العربية.`;
    
    try {
      console.log("جاري الاتصال بـ Gemini API..."); // رسالة تتبع
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      
      const data = await response.json();
      console.log("رد سيرفرات جوجل:", data); // هيطبع الرد هنا

      if (!response.ok) {
        throw new Error(data.error?.message || "مشكلة في الـ API Key أو السيرفر");
      }

      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text.trim();
      } else {
        throw new Error("جوجل مبعتتش نص مفيد");
      }

    } catch (error) {
      console.error("تفاصيل الخطأ:", error.message);
      // هيطلعلك إشعار بالخطأ عشان تبقى عارف
      toast({ title: "فشل توليد الوصف", description: error.message, variant: "destructive" });
      return `كورس تدريبي متخصص ومبسط في ${courseName}. (يرجى كتابة الوصف يدوياً)`;
    } finally { 
      setIsGenerating(false); 
    }
  };
  
  const handleFetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) return toast({ title: "الرابط غير صحيح", variant: "destructive" });

    setIsLoading(true);
    try {
      const resPlaylist = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataPlaylist = await resPlaylist.json();
      const playlistInfo = dataPlaylist.items[0].snippet;

      const resItems = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataItems = await resItems.json();
      const videoIds = dataItems.items.map(i => i.snippet.resourceId.videoId).join(',');

      const resDetails = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
      const dataDetails = await resDetails.json();

      const aiDescription = await generateAIDescription(playlistInfo.title);

      setPreviewData({
        title: playlistInfo.title,
        instructor: playlistInfo.channelTitle,
        description: aiDescription,
        thumbnail: playlistInfo.thumbnails.high?.url || playlistInfo.thumbnails.default?.url,
        lessons: dataItems.items.map((item, index) => {
          const detail = dataDetails.items.find(d => d.id === item.snippet.resourceId.videoId);
          return {
            title: item.snippet.title,
            video_id: item.snippet.resourceId.videoId,
            order: index + 1,
            duration: detail ? parseYouTubeDuration(detail.contentDetails.duration) : 0
          };
        }),
      });
    } catch (error) {
      toast({ title: "فشل جلب البيانات", description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleImportCourse = async () => {
    if (!previewData || !selectedSpec) return toast({ title: "تنبيه", description: "اختر التخصص أولاً", variant: "destructive" });
    setIsLoading(true);
    try {
      const { data: course } = await supabase.from("courses").insert([{
        title: previewData.title,
        description: previewData.description,
        thumbnail_url: previewData.thumbnail,
        instructor: previewData.instructor,
        specialization_id: selectedSpec,
        published: true
      }]).select().single();

      const { data: section } = await supabase.from("sections").insert([{ course_id: course.id, title: "المحتوى الرئيسي", sort_order: 1 }]).select().single();

      const lessons = previewData.lessons.map(l => ({
        section_id: section.id,
        title: l.title,
        video_url: `https://www.youtube.com/embed/${l.video_id}`,
        sort_order: l.order,
        duration_minutes: l.duration
      }));

      await supabase.from("lessons").insert(lessons);
      toast({ title: "نجاح!", description: "تم استيراد الكورس بالكامل" });
      navigate("/admin/courses");
    } catch (e) { toast({ title: "خطأ", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-4 md:p-8 font-tajawal" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-white/5 pb-6">
          <Link to="/admin" className="p-3 bg-[#121A15] border border-white/10 rounded-2xl text-neutral-400 hover:text-white transition-colors">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-emerald-500 flex items-center gap-2">
              <Sparkles className="w-7 h-7" /> المستورد الذكي
            </h1>
            <p className="text-neutral-500 text-sm font-bold mt-1">قم بتحويل قنوات اليوتيوب إلى كورسات احترافية</p>
          </div>
        </div>

        {/* Control Panel (Inputs) */}
        <div className="bg-[#0a0f0c] border border-emerald-900/30 rounded-[2rem] p-6 shadow-2xl">
          <div className="flex flex-col lg:flex-row gap-5 items-end">
            
            {/* YouTube Link Input */}
            <div className="flex-1 w-full space-y-2">
              <label className="text-emerald-500 text-xs font-black uppercase tracking-widest px-1">رابط قائمة التشغيل (Playlist)</label>
              <div className="relative">
                <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-500" />
                <input
                  type="text"
                  placeholder="https://youtube.com/playlist?list=..."
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  className="w-full bg-[#121A15] border border-white/10 rounded-2xl pr-14 pl-4 py-4 text-white focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Specialization Select */}
            <div className="w-full lg:w-72 space-y-2">
              <label className="text-emerald-500 text-xs font-black uppercase tracking-widest px-1">التخصص</label>
              <div className="relative">
                <TreePine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full bg-[#121A15] border border-white/10 rounded-2xl pr-12 pl-10 py-4 font-bold text-white outline-none focus:border-emerald-500 appearance-none cursor-pointer transition-all"
                >
                  <option value="" className="bg-[#0a0f0c] text-neutral-400">اختر تخصصاً...</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id} className="bg-[#0a0f0c]">{spec.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              </div>
            </div>

            {/* Action Button */}
            <Button 
              onClick={handleFetchPlaylist} 
              disabled={isLoading || !playlistUrl} 
              className="w-full lg:w-40 h-[60px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg shadow-lg"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "معاينة البيانات"}
            </Button>
            
          </div>
        </div>

        {/* Preview Section */}
        <AnimatePresence>
          {previewData && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col lg:flex-row gap-8 items-start"
            >
              {/* Right Side: Thumbnail & Stats Card */}
              <div className="w-full lg:w-1/3 bg-[#0a0f0c] border border-white/5 rounded-[2rem] p-5 shadow-xl flex flex-col gap-5 sticky top-6">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                  <img src={previewData.thumbnail} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                    <span className="bg-emerald-600 px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1 shadow-md">
                      <LayoutGrid className="w-3 h-3" /> {previewData.lessons.length}
                    </span>
                    <span className="bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-lg text-xs font-black text-emerald-400 flex items-center gap-1 shadow-md">
                      <Clock className="w-3 h-3" /> {previewData.lessons.reduce((a, b) => a + b.duration, 0)} د
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-[#121A15] p-4 rounded-2xl border border-white/5">
                  <div className="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-500/30 text-emerald-500 font-black text-xl">
                    {previewData.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase">المدرب / القناة</p>
                    <h3 className="text-sm font-black text-white">{previewData.instructor}</h3>
                  </div>
                </div>
              </div>

              {/* Left Side: Details & Lessons */}
              <div className="w-full lg:w-2/3 flex flex-col gap-6">
                
                {/* Description Card */}
                <div className="bg-[#0a0f0c] border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-5">
                  <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">{previewData.title}</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Edit3 className="w-3 h-3" /> وصف الذكاء الاصطناعي
                      </label>
                      {isGenerating && <span className="text-[10px] text-emerald-500 animate-pulse font-bold">جاري الكتابة...</span>}
                    </div>
                    <textarea
                      value={previewData.description}
                      onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                      rows={5}
                      className="w-full bg-[#121A15] border border-white/10 rounded-2xl px-5 py-4 text-neutral-300 text-sm leading-relaxed focus:border-emerald-500 outline-none resize-none"
                    />
                  </div>
                </div>

                {/* Lessons Card */}
                <div className="bg-[#0a0f0c] border border-white/5 rounded-[2rem] p-6 shadow-xl space-y-4">
                  <label className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <PlayCircle className="w-4 h-4" /> محتوى الدورة
                  </label>
                  
                  <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {previewData.lessons.map((lesson) => (
                      <div key={lesson.video_id} className="flex justify-between items-center p-4 bg-[#121A15] border border-white/5 rounded-xl hover:border-emerald-500/30 transition-colors">
                        <span className="text-sm text-neutral-300 font-bold flex items-center gap-3">
                          <span className="text-emerald-500/50 font-mono text-xs">#{lesson.order}</span> 
                          <span className="line-clamp-1">{lesson.title}</span>
                        </span>
                        <span className="text-xs font-black text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded shrink-0">
                          {lesson.duration} د
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-2">
                  <Button onClick={() => setPreviewData(null)} variant="ghost" className="flex-1 h-16 rounded-2xl text-neutral-500 bg-[#0a0f0c] border border-white/5 hover:bg-red-500/10 hover:text-red-500">
                    إلغاء الأمر
                  </Button>
                  <Button onClick={handleImportCourse} disabled={isLoading} className="flex-[2] h-16 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black text-xl shadow-xl flex gap-3">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> تأكيد ونشر الكورس</>}
                  </Button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminYoutubeImport;
