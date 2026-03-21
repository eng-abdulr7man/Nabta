import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, ArrowRight, Loader2, LayoutGrid, Sparkles, 
  Edit3, User, Clock, CheckCircle2, ChevronDown, TreePine, ListVideo 
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
    const prompt = `أنت خبير محتوى تعليمي زراعي. اكتب وصفاً تسويقياً لكورس بعنوان '${courseName}' في 5 أسطر احترافية باللغة العربية فقط.`;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } catch (error) {
      return `كورس تدريبي متخصص في ${courseName}.`;
    } finally { setIsGenerating(false); }
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
    if (!previewData || !selectedSpec) return toast({ title: "اختر التخصص أولاً", variant: "destructive" });
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
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-white/[0.02] p-6 rounded-[2rem] border border-white/5 shadow-2xl">
          <div className="flex items-center gap-5">
            <Link to="/admin" className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-500 hover:scale-105 transition-transform">
              <ArrowRight className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-4xl font-black flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-emerald-500" /> استيراد كورس يوتيوب
              </h1>
              <p className="text-neutral-500 font-bold mt-1">توليد تلقائي للمحتوى باستخدام Gemini AI</p>
            </div>
          </div>
        </header>

        {/* Search & Selection Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/10 relative shadow-2xl">
          <div className="lg:col-span-7 space-y-3">
            <label className="text-emerald-500 text-xs font-black uppercase tracking-widest px-1">رابط قائمة التشغيل</label>
            <div className="relative group">
              <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-red-600 transition-transform group-focus-within:scale-110" />
              <input
                type="text"
                placeholder="ضع الرابط هنا..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pr-14 pl-6 py-5 text-lg outline-none focus:border-emerald-500/50 transition-all shadow-inner"
              />
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <label className="text-emerald-500 text-xs font-black uppercase tracking-widest px-1">التخصص</label>
            <div className="relative group">
              <TreePine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
              <select
                value={selectedSpec}
                onChange={(e) => setSelectedSpec(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pr-12 pl-10 py-5 font-bold outline-none focus:border-emerald-500/50 appearance-none transition-all cursor-pointer"
              >
                <option value="" className="bg-[#0a0f0c]">اختر تخصصاً...</option>
                {specializations.map(spec => (
                  <option key={spec.id} value={spec.id} className="bg-[#0a0f0c] font-bold text-white">{spec.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            </div>
          </div>

          <div className="lg:col-span-2">
            <Button onClick={handleFetchPlaylist} disabled={isLoading || !playlistUrl} className="w-full h-[68px] bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black text-xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all">
              {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "جلب"}
            </Button>
          </div>
        </section>

        {/* Preview Results Section */}
        <AnimatePresence>
          {previewData && (
            <motion.section 
              initial={{ opacity: 0, y: 50 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Card Thumbnail */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#0a0f0c] border border-white/5 rounded-[2.5rem] p-6 shadow-2xl sticky top-8">
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                    <img src={previewData.thumbnail} className="w-full aspect-video object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                    <div className="absolute bottom-4 inset-x-4 flex justify-between">
                      <div className="bg-emerald-600 px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 shadow-xl"><LayoutGrid className="w-3 h-3" /> {previewData.lessons.length} درس</div>
                      <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-2 border border-white/10"><Clock className="w-3 h-3 text-emerald-400" /> {previewData.lessons.reduce((acc, curr) => acc + curr.duration, 0)} د</div>
                    </div>
                  </div>
                  <div className="mt-8 p-5 bg-white/[0.02] rounded-2xl border border-white/5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30 text-emerald-500 font-black text-xl">{previewData.instructor.charAt(0)}</div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">مقدم الدورة</p>
                      <h4 className="font-black text-white text-lg">{previewData.instructor}</h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data & Lessons */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0a0f0c] border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
                  <div>
                    <h2 className="text-3xl font-black text-white leading-tight">{previewData.title}</h2>
                    <div className="h-1.5 w-24 bg-emerald-600 rounded-full mt-4 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Edit3 className="w-3 h-3" /> وصف الكورس الذكي</label>
                      {isGenerating && <span className="text-[10px] text-emerald-500 animate-pulse font-black italic">جاري التوليد...</span>}
                    </div>
                    <textarea
                      value={previewData.description}
                      onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                      rows={5}
                      className="w-full bg-black/40 border border-white/5 rounded-[1.5rem] px-6 py-5 text-neutral-400 text-sm leading-relaxed focus:border-emerald-500/40 outline-none resize-none shadow-inner"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-neutral-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 px-1"><ListVideo className="w-4 h-4 text-emerald-600" /> محتوى الدروس</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto custom-scrollbar pr-2">
                      {previewData.lessons.map((lesson) => (
                        <div key={lesson.video_id} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-xl group hover:border-emerald-500/20 transition-all cursor-default">
                          <span className="text-xs text-neutral-400 font-bold flex items-center gap-3">
                            <span className="text-emerald-500/40 font-mono text-[10px]">#{lesson.order}</span> {lesson.title}
                          </span>
                          <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-md">{lesson.duration} د</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <Button onClick={() => setPreviewData(null)} variant="ghost" className="flex-1 h-16 rounded-2xl text-neutral-500 hover:bg-red-500/10 hover:text-red-500">إلغاء</Button>
                    <Button onClick={handleImportCourse} disabled={isLoading} className="flex-[3] h-16 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black text-xl shadow-2xl active:scale-[0.98] transition-all flex gap-3">
                      {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> اعتماد ونشر الكورس</>}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminYoutubeImport;
