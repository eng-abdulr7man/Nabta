import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, ArrowRight, Loader2, LayoutGrid, Sparkles, 
  Edit3, Clock, CheckCircle2, ChevronDown, TreePine, ListVideo, User 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
const YOUTUBE_API_KEY = "AIzaSyAM5K8Aka_MvqfQNRmPITYExIIn9JmMWao"; // ⚠️ لازم تقيّده بـ HTTP referrer في Google Cloud Console — شوف الشرح تحت

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
    if (!match) return 0;
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 60 + minutes + (seconds > 30 ? 1 : 0);
  };

  const generateAIDescription = async (courseName) => {
    setIsGenerating(true);

    try {
      const { data, error } = await supabase.functions.invoke("admin-ai", {
        body: { action: "course-description", data: { courseName } },
      });
      if (error || !data?.content) throw new Error(data?.error || "فشل توليد الوصف");
      return data.content;
    } catch (error) {
      console.error("AI Error:", error.message);
      toast({ title: "الذكاء الاصطناعي معطل", description: "يرجى كتابة الوصف يدوياً", variant: "destructive" });
      return `كورس تدريبي متخصص ومبسط في ${courseName}. يغطي أهم المبادئ والتقنيات الأساسية بأسلوب عملي.`;
    } finally { 
      setIsGenerating(false); 
    }
  };

  // 🔥 الدالة السحرية بعد التعديل لسحب القائمة كاملة 🔥
  const handleFetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) return toast({ title: "الرابط غير صحيح", variant: "destructive" });

    setIsLoading(true);
    try {
      // 1. جلب بيانات القائمة الأساسية
      const resPlaylist = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataPlaylist = await resPlaylist.json();
      if (!dataPlaylist.items?.length) throw new Error("لم يتم العثور على القائمة");

      const playlistInfo = dataPlaylist.items[0].snippet;

      // 2. حلقة تكرارية (Loop) لجلب كل الفيديوهات من القائمة مهما كان عددها
      let allPlaylistItems = [];
      let nextPageToken = "";

      do {
        const pageTokenParam = nextPageToken ? `&pageToken=${nextPageToken}` : "";
        const resItems = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}${pageTokenParam}`);
        const dataItems = await resItems.json();
        
        if (dataItems.items) {
          allPlaylistItems = [...allPlaylistItems, ...dataItems.items];
        }
        
        nextPageToken = dataItems.nextPageToken; // لو مفيش فيديوهات تانية، ده هيكون null واللوب تقف
      } while (nextPageToken);

      if (allPlaylistItems.length === 0) throw new Error("قائمة التشغيل فارغة");

      // 3. تقسيم الـ IDs لحزم (كل حزمة 50) عشان نجيب مدة الفيديوهات بدون ما الـ API يعترض
      let allVideoDetails = [];
      for (let i = 0; i < allPlaylistItems.length; i += 50) {
        const chunk = allPlaylistItems.slice(i, i + 50);
        const videoIds = chunk.map(item => item.snippet.resourceId.videoId).join(',');

        const resDetails = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
        const dataDetails = await resDetails.json();

        if (dataDetails.items) {
          allVideoDetails = [...allVideoDetails, ...dataDetails.items];
        }
      }

      // 4. توليد الوصف بالذكاء الاصطناعي
      const aiDescription = await generateAIDescription(playlistInfo.title);

      // 5. تجميع البيانات النهائية
      setPreviewData({
        title: playlistInfo.title,
        instructor: playlistInfo.channelTitle,
        description: aiDescription,
        thumbnail: playlistInfo.thumbnails.high?.url || playlistInfo.thumbnails.default?.url,
        lessons: allPlaylistItems.map((item, index) => {
          const detail = allVideoDetails.find(d => d.id === item.snippet.resourceId.videoId);
          return {
            title: item.snippet.title,
            video_id: item.snippet.resourceId.videoId,
            order: index + 1,
            duration: detail ? parseYouTubeDuration(detail.contentDetails.duration) : 0
          };
        }),
      });
      
      toast({ title: "تم الجلب", description: `تم سحب ${allPlaylistItems.length} فيديو بنجاح.` });
      
    } catch (error) {
      toast({ title: "فشل جلب البيانات", description: error.message, variant: "destructive" });
    } finally { 
      setIsLoading(false); 
    }
  };

  const handleImportCourse = async () => {
    if (!previewData || !selectedSpec) return toast({ title: "تنبيه", description: "اختر التخصص أولاً", variant: "destructive" });
    setIsLoading(true);
    try {
      const { data: course, error: courseError } = await supabase.from("courses").insert([{
        title: previewData.title,
        description: previewData.description,
        thumbnail_url: previewData.thumbnail,
        instructor: previewData.instructor,
        specialization_id: selectedSpec,
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

      // إذا كان عدد الدروس كبير (أكثر من 100 مثلاً)، يفضل إدخالهم على دفعات لتجنب حمل زائد على السيرفر
      await supabase.from("lessons").insert(lessonsToInsert);
      
      toast({ title: "نجاح!", description: "تم استيراد ونشر الكورس بنجاح على منصة نبتة 🌱" });
      navigate("/admin/courses");
    } catch (e) { 
      console.error(e);
      toast({ title: "خطأ في الحفظ", description: "فشل حفظ البيانات في القاعدة", variant: "destructive" });
    }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-4 md:p-8 font-tajawal overflow-x-hidden relative" dir="rtl">
      
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto space-y-10 relative">
        
        <div className="flex items-center gap-4 border-b border-neutral-800/60 pb-6 bg-[#0a0f0c] p-5 rounded-2xl border border-neutral-800/50 shadow-2xl">
          <Link to="/admin" className="p-3 bg-[#121A15] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-colors">
            <ArrowRight className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white flex items-center gap-3 tracking-tight">
              <Sparkles className="w-7 h-7 text-emerald-500" /> استيراد كورس يوتيوب
            </h1>
            <p className="text-neutral-500 text-sm font-medium mt-1">توليد تلقائي للمحتوى باستخدام Groq AI</p>
          </div>
        </div>

        <div className="bg-[#0a0f0c] border border-neutral-800/80 rounded-3xl p-5 md:p-6 shadow-xl relative">
          <div className="absolute top-0 left-10 w-40 h-1 bg-emerald-600 rounded-full opacity-30" />
          <div className="flex flex-col md:flex-row gap-4 items-end">
            
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
                className="w-full bg-[#121A15] border border-neutral-800/80 rounded-2xl px-5 py-3.5 text-white focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none transition-all font-mono text-sm placeholder:font-tajawal placeholder:text-neutral-600 placeholder:text-right shadow-inner"
              />
            </div>

            <div className="flex-1 w-full space-y-2">
              <label className="text-neutral-400 text-sm font-bold flex items-center gap-2 px-1">
                <TreePine className="w-4 h-4 text-emerald-500" /> التخصص (السكيمه)
              </label>
              <div className="relative">
                <select
                  value={selectedSpec}
                  onChange={(e) => setSelectedSpec(e.target.value)}
                  className="w-full bg-[#121A15] border border-neutral-800/80 rounded-2xl pr-5 pl-10 py-3.5 text-sm font-bold text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 appearance-none cursor-pointer transition-all shadow-inner"
                >
                  <option value="" className="text-neutral-500">اختر التخصص الزراعي...</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id} className="bg-[#0a0f0c] font-bold text-white">{spec.name}</option>
                  ))}
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
              </div>
            </div>

            <div className="w-full md:w-auto">
              <Button 
                onClick={handleFetchPlaylist} 
                disabled={isLoading || !playlistUrl} 
                className="w-full md:w-36 h-[52px] bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-base shadow-xl transition-all active:scale-95 flex gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "معاينة"}
              </Button>
            </div>

          </div>
        </div>

        <AnimatePresence>
          {previewData && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            >
              
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2rem] p-5 shadow-2xl space-y-5 sticky top-6">
                  <div className="relative rounded-3xl overflow-hidden border border-neutral-800 group shadow-lg">
                    <img src={previewData.thumbnail} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 flex justify-between gap-2">
                      <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black border border-white/10 flex items-center gap-1.5 shadow-xl">
                        <LayoutGrid className="w-3.5 h-3.5" /> <span>{previewData.lessons.length} درس</span>
                      </div>
                      <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-emerald-400 border border-white/10 flex items-center gap-1.5 shadow-xl">
                        <Clock className="w-3.5 h-3.5" /> <span>{previewData.lessons.reduce((a, b) => a + b.duration, 0)} دقيقة</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-[#121A15] p-4 rounded-2xl flex items-center gap-4 border border-neutral-800/50 shadow-inner">
                    <div className="w-12 h-12 rounded-full bg-emerald-900/30 flex items-center justify-center text-emerald-500 font-black text-xl border border-emerald-500/20 shadow-md">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">مقدم الدورة / القناة</p>
                      <h3 className="text-sm font-black text-white line-clamp-1">{previewData.instructor}</h3>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 flex flex-col gap-6">
                
                <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl -z-10" />
                  <h2 className="text-xl md:text-3xl font-black text-white leading-tight tracking-tight">{previewData.title}</h2>
                  <div className="h-1 w-20 bg-emerald-600 rounded-full" />
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-emerald-500 text-xs font-black flex items-center gap-2"><Edit3 className="w-3.5 h-3.5" /> الوصف التعريفي (AI-Generated)</label>
                      {isGenerating && <span className="text-[10px] text-emerald-500 animate-pulse font-bold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/>جاري الصياغة...</span>}
                    </div>
                    <textarea
                      value={previewData.description}
                      onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                      rows={5}
                      className="w-full bg-[#121A15] border border-neutral-800 rounded-2xl px-6 py-5 text-neutral-300 text-sm leading-relaxed focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 outline-none resize-none transition-colors shadow-inner font-tajawal placeholder:text-neutral-700"
                      placeholder="اكتب وصفاً احترافياً هنا..."
                    />
                  </div>
                </div>

                <div className="bg-[#0a0f0c] border border-neutral-800/60 rounded-[2.5rem] p-6 md:p-8 shadow-2xl space-y-5">
                  <label className="text-neutral-400 text-xs font-black uppercase tracking-widest flex items-center gap-2 px-1"><ListVideo className="w-4 h-4 text-emerald-600" /> محتوى الدورة التدريبية</label>
                  
                  <div className="flex flex-col gap-2.5 max-h-[350px] overflow-y-auto pr-3 custom-scrollbar">
                    {previewData.lessons.map((lesson) => (
                      <div key={lesson.video_id} className="flex justify-between items-center p-4 bg-[#121A15] border border-neutral-800/50 rounded-2xl hover:border-emerald-500/30 transition-all duration-300 group shadow-sm active:scale-[0.99]">
                        <span className="text-sm text-neutral-300 font-medium flex items-center gap-3.5">
                          <span className="text-neutral-600 font-mono text-xs w-6 text-left">#{lesson.order}</span> 
                          <span className="line-clamp-1 group-hover:text-white">{lesson.title}</span>
                        </span>
                        <span className="text-[11px] font-black text-neutral-400 bg-[#0a0f0c] px-2.5 py-1.5 rounded-lg shrink-0 border border-neutral-800 flex items-center gap-1 shadow-md">
                          <Clock className="w-3 h-3 text-emerald-600" /> {lesson.duration} د
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-2 border-t border-neutral-800/50">
                  <Button onClick={() => setPreviewData(null)} variant="ghost" className="h-16 px-6 rounded-2xl text-neutral-500 bg-[#0a0f0c] border border-neutral-800 hover:bg-neutral-800 hover:text-white transition-all">
                    إلغاء الأمر
                  </Button>
                  <Button onClick={handleImportCourse} disabled={isLoading} className="flex-1 h-16 bg-white text-black hover:bg-neutral-200 rounded-2xl font-black text-xl shadow-2xl flex gap-3 transition-all active:scale-[0.98]">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> حفظ ونشر الكورس 🌱</>}
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
