import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, ArrowRight, Loader2, LayoutGrid, Sparkles, 
  Edit3, Clock, CheckCircle2, ChevronDown, TreePine, ListVideo 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const YOUTUBE_API_KEY = "AIzaSyAM5K8Aka_MvqfQNRmPITYExIIn9JmMWao";
const GROQ_API_KEY = "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";

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
    const prompt = `أنت خبير محتوى تعليمي زراعي في منصة نبتة. اكتب وصفاً تسويقياً لكورس بعنوان '${courseName}' في 4 أسطر احترافية باللغة العربية فقط. بدون مقدمات.`;
    
    try {
      const response = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: prompt }]
        })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);
      return data.choices[0].message.content.trim();

    } catch (error) {
      toast({ title: "الذكاء الاصطناعي معطل", description: "يرجى كتابة الوصف يدوياً", variant: "destructive" });
      return `كورس تدريبي متخصص ومبسط في ${courseName}.`;
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
      toast({ title: "تم النشر بنجاح" });
      navigate("/admin/courses");
    } catch (e) { toast({ title: "خطأ في الحفظ", variant: "destructive" }); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-4 md:p-8 font-tajawal overflow-x-hidden" dir="rtl">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header - Simple & Clean */}
        <div className="flex items-center gap-4 border-b border-neutral-800/50 pb-6">
          <Link to="/admin" className="p-2.5 bg-neutral-900/50 border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-500" /> استيراد كورس يوتيوب
            </h1>
            <p className="text-neutral-500 text-xs font-medium mt-1">توليد تلقائي للمحتوى باستخدام Groq AI</p>
          </div>
        </div>

        {/* 🌟 شريط الإدخال البسيط والمدمج 🌟 */}
        <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-3xl p-4 md:p-6 shadow-xl">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            
            {/* خانة الرابط */}
            <div className="flex-[2] w-full space-y-2">
              <label className="text-neutral-400 text-sm font-bold flex items-center gap-2 px-1">
                <Youtube className="w-4 h-4 text-red-500" /> رابط قائمة التشغيل
              </label>
              <input
                type="text"
                dir="ltr"
                placeholder="https://youtube.com/playlist?list=..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="w-full bg-[#121A15] border border-neutral-800/80 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all font-mono text-sm placeholder:font-tajawal placeholder:text-neutral-600 placeholder:text-right"
              />
            </div>

            {/* خانة التخصص */}
            <div className="flex-1 w-full space-y-2">
              <label className="text-neutral-400 text-sm font-bold flex items-center gap-2 px-1">
                <TreePine className="w-4 h-4 text-emerald-500" /> التخصص
              </label>
              <div className="relative">
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800/80 rounded-2xl pr-5 pl-10 py-3.5 text-sm font-bold text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 appearance-none cursor-pointer transition-all"
                >
                  <option value="" className="text-neutral-500">اختر التخصص...</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id} className="bg-[#0a0f0c]">{spec.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            {/* زر الجلب */}
            <div className="w-full md:w-auto">
              <Button 
                onClick={handleFetchPlaylist} 
                disabled={isLoading || !playlistUrl} 
                className="w-full md:w-32 h-[52px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-base shadow-md transition-all active:scale-95"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "معاينة"}
              </Button>
            </div>

          </div>
        </div>

        {/* Preview Section - Clean Layout */}
        <AnimatePresence>
          {previewData && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex flex-col lg:flex-row gap-6 items-start"
            >
              {/* Thumbnail Card */}
              <div className="w-full lg:w-[320px] shrink-0 space-y-4 sticky top-6">
                <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-4 shadow-xl">
                  <div className="relative rounded-2xl overflow-hidden mb-4 border border-neutral-800">
                    <img src={previewData.thumbnail} className="w-full aspect-video object-cover" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between">
                      <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold border border-white/10 flex items-center gap-1"><LayoutGrid className="w-3 h-3" /> {previewData.lessons.length}</span>
                      <span className="bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-400 border border-white/10 flex items-center gap-1"><Clock className="w-3 h-3" /> {previewData.lessons.reduce((a, b) => a + b.duration, 0)} د</span>
                    </div>
                  </div>
                  <div className="bg-[#121A15] p-3 rounded-xl flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500 font-black text-sm">{previewData.instructor.charAt(0)}</div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold">مقدم الدورة</p>
                      <h3 className="text-sm font-bold text-white line-clamp-1">{previewData.instructor}</h3>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 w-full bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-6 md:p-8 shadow-xl space-y-6">
                <h2 className="text-xl md:text-2xl font-black text-white">{previewData.title}</h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center px-1">
                    <label className="text-emerald-500 text-xs font-bold flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> الوصف التعريفي</label>
                    {isGenerating && <span className="text-[10px] text-emerald-500 animate-pulse font-bold">جاري الصياغة...</span>}
                  </div>
                  <textarea
                    value={previewData.description}
                    onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                    rows={4}
                    className="w-full bg-[#121A15] border border-neutral-800/80 rounded-2xl px-5 py-4 text-neutral-300 text-sm leading-relaxed focus:border-emerald-500/50 outline-none resize-none transition-colors"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-neutral-400 text-xs font-bold flex items-center gap-2 px-1"><ListVideo className="w-4 h-4" /> فهرس الدروس</label>
                  <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {previewData.lessons.map((lesson) => (
                      <div key={lesson.video_id} className="flex justify-between items-center p-3.5 bg-[#121A15] border border-neutral-800/50 rounded-xl hover:border-neutral-700 transition-colors">
                        <span className="text-sm text-neutral-300 font-medium flex items-center gap-3">
                          <span className="text-neutral-600 font-mono text-xs">#{lesson.order}</span> 
                          <span className="line-clamp-1">{lesson.title}</span>
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 bg-[#0a0f0c] px-2 py-1 rounded-md shrink-0 border border-neutral-800">{lesson.duration} د</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-800/50">
                  <Button onClick={() => setPreviewData(null)} variant="ghost" className="h-14 px-6 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800">إلغاء</Button>
                  <Button onClick={handleImportCourse} disabled={isLoading} className="flex-1 h-14 bg-white text-black hover:bg-neutral-200 rounded-xl font-bold text-lg flex gap-2">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> حفظ ونشر الكورس</>}
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
