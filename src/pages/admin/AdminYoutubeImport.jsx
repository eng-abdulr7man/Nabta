import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, ArrowRight, Loader2, LayoutGrid, Sparkles, 
  Edit3, User, Clock, CheckCircle2, ChevronDown, TreePine 
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

  // جلب التخصصات من القاعدة عند تحميل الصفحة
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
    const prompt = `أنت خبير محتوى تعليمي في منصة "نبتة" الزراعية. اكتب وصفاً تسويقياً واحترافياً لكورس بعنوان '${courseName}'. يجب أن يكون الوصف باللغة العربية ومكوناً من 5 أسطر فقط. ركز على الفائدة التعليمية للمزارعين والطلاب. ممنوع أي مقدمات أو ملاحظات إضافية.`;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
    } catch (error) {
      return `كورس تدريبي متخصص في ${courseName} يهدف لتطوير المهارات الزراعية.`;
    } finally { setIsGenerating(false); }
  };

  const handleFetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) return toast({ title: "رابط غير صالح", variant: "destructive" });

    setIsLoading(true);
    try {
      const resPlaylist = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataPlaylist = await resPlaylist.json();
      if (!dataPlaylist.items?.length) throw new Error("لم يتم العثور على القائمة");

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
      toast({ title: "فشل الجلب", description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleImportCourse = async () => {
    if (!previewData) return;
    if (!selectedSpec) return toast({ title: "تنبيه", description: "يرجى اختيار تخصص الكورس أولاً", variant: "destructive" });
    
    setIsLoading(true);
    try {
      const { data: course, error: courseError } = await supabase.from("courses").insert([{
        title: previewData.title,
        description: previewData.description,
        thumbnail_url: previewData.thumbnail,
        instructor: previewData.instructor,
        specialization_id: selectedSpec, // <--- الربط مع التخصص المختار
        published: true
      }]).select().single();

      if (courseError) throw courseError;

      const { data: section } = await supabase.from("sections").insert([{
        course_id: course.id,
        title: "محتوى الدورة التعليمي",
        sort_order: 1
      }]).select().single();

      const lessonsToInsert = previewData.lessons.map(lesson => ({
        section_id: section.id,
        title: lesson.title,
        video_url: `https://www.youtube.com/embed/${lesson.video_id}`,
        sort_order: lesson.order,
        duration_minutes: lesson.duration,
        content: `درس مستورد بمدة ${lesson.duration} دقيقة.`
      }));

      await supabase.from("lessons").insert(lessonsToInsert);
      toast({ title: "نجاح باهر!", description: "تم استيراد الكورس وربطه بالتخصص بنجاح." });
      navigate("/admin/courses");
    } catch (error) {
      toast({ title: "خطأ في الحفظ", description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-4 md:p-10 font-tajawal relative overflow-hidden" dir="rtl">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-900/10 blur-[100px] rounded-full -z-10" />

      <div className="max-w-6xl mx-auto space-y-8 relative">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="p-3 bg-white/5 border border-white/10 rounded-2xl text-neutral-400 hover:text-white hover:bg-white/10 transition-all shadow-xl">
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-emerald-500" /> استيراد محتوى ذكي
              </h1>
              <p className="text-neutral-500 text-sm font-bold">حول أي قائمة تشغيل يوتيوب إلى كورس متكامل في ثوانٍ</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-12">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-[2.5rem] p-6 md:p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                <div className="space-y-3">
                  <label className="text-emerald-500 text-xs font-black uppercase tracking-widest mr-2">رابط البلاي ليست</label>
                  <div className="relative">
                    <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                    <input
                      type="text"
                      placeholder="https://youtube.com/playlist?list=..."
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all placeholder:text-neutral-700 font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-emerald-500 text-xs font-black uppercase tracking-widest mr-2">تخصص الكورس (Schema)</label>
                  <div className="relative">
                    <TreePine className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600" />
                    <select
                      value={selectedSpec}
                      onChange={(e) => setSelectedSpec(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl pr-12 pl-6 py-4 text-white focus:border-emerald-500/50 outline-none transition-all appearance-none font-bold"
                    >
                      <option value="" className="bg-[#0a0f0c]">اختر تخصصاً...</option>
                      {specializations.map(spec => (
                        <option key={spec.id} value={spec.id} className="bg-[#0a0f0c]">{spec.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                  </div>
                </div>

                <div className="md:col-span-2 mt-2">
                  <Button 
                    onClick={handleFetchPlaylist} 
                    disabled={isLoading || !playlistUrl} 
                    className="w-full bg-emerald-600 hover:bg-emerald-500 h-16 rounded-2xl font-black text-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-[0.98]"
                  >
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "جلب وتحليل المحتوى بالذكاء الاصطناعي"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {previewData && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10"
              >
                {/* Left: Thumbnail & Stats */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-4 shadow-xl">
                    <div className="relative group overflow-hidden rounded-2xl">
                      <img src={previewData.thumbnail} className="w-full aspect-video object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-4 inset-x-4 flex justify-between">
                        <div className="bg-emerald-600 px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 shadow-xl">
                          <LayoutGrid className="w-3 h-3" /> {previewData.lessons.length} درس
                        </div>
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-black flex items-center gap-2 border border-white/10">
                          <Clock className="w-3 h-3 text-emerald-400" /> {previewData.lessons.reduce((acc, curr) => acc + curr.duration, 0)} دقيقة
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black border border-emerald-500/20">
                          {previewData.instructor.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500 font-bold">مقدم الدورة</p>
                          <p className="text-sm font-black text-white">{previewData.instructor}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: AI Description & Lessons */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-8 shadow-xl space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-3xl font-black text-white tracking-tight">{previewData.title}</h2>
                      <div className="h-1 w-20 bg-emerald-500 rounded-full" />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <label className="text-emerald-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          وصف الكورس الذكي <Edit3 className="w-3 h-3 opacity-50" />
                        </label>
                        {isGenerating && <span className="text-[10px] text-emerald-500 animate-pulse font-bold">جاري الصياغة...</span>}
                      </div>
                      <textarea
                        value={previewData.description}
                        onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                        rows={6}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-4 text-neutral-400 text-sm leading-relaxed focus:border-emerald-500/30 outline-none resize-none transition-all shadow-inner"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-neutral-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">محتوى القائمة المستوردة</label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {previewData.lessons.map((lesson) => (
                          <div key={lesson.video_id} className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-xl group hover:border-emerald-500/30 transition-all">
                            <span className="text-xs text-neutral-400 font-bold line-clamp-1 flex items-center gap-3">
                              <span className="text-emerald-500/40 font-mono">#{lesson.order}</span> {lesson.title}
                            </span>
                            <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/5 px-2 py-1 rounded-md">{lesson.duration} د</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button onClick={() => setPreviewData(null)} variant="ghost" className="flex-1 text-neutral-500 hover:text-white h-16 rounded-2xl">إلغاء</Button>
                      <Button 
                        onClick={handleImportCourse} 
                        disabled={isLoading} 
                        className="flex-[2] bg-white text-black hover:bg-neutral-100 h-16 rounded-2xl font-black text-lg shadow-2xl flex items-center gap-3 active:scale-[0.97] transition-all"
                      >
                        {isLoading ? <Loader2 className="w-6 h-6 animate-spin text-black" /> : <><CheckCircle2 className="w-6 h-6" /> اعتماد ونشر الكورس فوراً</>}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AdminYoutubeImport;
