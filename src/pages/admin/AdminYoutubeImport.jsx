import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Youtube, ArrowRight, Loader2, LayoutGrid, Sparkles, Edit3, User, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// المفاتيح الخاصة بك
const YOUTUBE_API_KEY = "AIzaSyAM5K8Aka_MvqfQNRmPITYExIIn9JmMWao";
const GEMINI_API_KEY = "AIzaSyBbw49D_xmkrNxl9JniPdCWWgD3aLGThSY"; 

const AdminYoutubeImport = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // دالة استخراج ID القائمة من الرابط
  const extractPlaylistId = (url) => {
    const reg = /[&?]list=([^&]+)/i;
    const match = reg.exec(url);
    return match ? match[1] : url;
  };

  // دالة تحويل وقت يوتيوب (ISO 8601) لدقائق
  const parseYouTubeDuration = (durationStr) => {
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 60 + minutes + (seconds > 30 ? 1 : 0);
  };

  // توليد وصف احترافي باستخدام Gemini AI
  const generateAIDescription = async (courseName) => {
    setIsGenerating(true);
    const prompt = `أنت خبير محتوى تعليمي في منصة "نبتة" الزراعية. اكتب وصفاً تسويقياً واحترافياً لكورس بعنوان '${courseName}'. يجب أن يكون الوصف باللغة العربية ومكوناً من 5 أسطر فقط. ركز على الفائدة التعليمية للمزارعين والطلاب. ممنوع أي مقدمات أو ملاحظات إضافية.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        return data.candidates[0].content.parts[0].text.trim();
      }
      throw new Error("فشل رد الذكاء الاصطناعي");
    } catch (error) {
      console.error("AI Error:", error);
      return `كورس تدريبي متخصص يتناول أهم المبادئ والتقنيات الحديثة في ${courseName}. يهدف المحتوى إلى تزويد المتدربين بالمهارات العملية اللازمة لتطوير الإنتاج وتحسين جودة العمل الزراعي بأسلوب علمي مبسط وشرح وافٍ لكل المحاور الأساسية.`;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      toast({ title: "خطأ", description: "يرجى إدخال رابط بلاي ليست صحيح", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // 1. جلب بيانات البلاي ليست
      const resPlaylist = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataPlaylist = await resPlaylist.json();
      if (!dataPlaylist.items?.length) throw new Error("لم يتم العثور على القائمة");

      const playlistInfo = dataPlaylist.items[0].snippet;

      // 2. جلب الفيديوهات والوقت الخاص بكل فيديو
      const resItems = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataItems = await resItems.json();
      const videoIds = dataItems.items.map(i => i.snippet.resourceId.videoId).join(',');

      const resDetails = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
      const dataDetails = await resDetails.json();

      // 3. توليد الوصف بالذكاء الاصطناعي
      const aiDescription = await generateAIDescription(playlistInfo.title);

      setPreviewData({
        title: playlistInfo.title,
        instructor: playlistInfo.channelTitle, // اسم الدكتور = اسم القناة
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportCourse = async () => {
    if (!previewData) return;
    setIsLoading(true);

    try {
      // 1. إضافة الكورس
      const { data: course, error: courseError } = await supabase.from("courses").insert([{
        title: previewData.title,
        description: previewData.description,
        thumbnail_url: previewData.thumbnail,
        instructor: previewData.instructor,
        published: true
      }]).select().single();

      if (courseError) throw courseError;

      // 2. إضافة القسم الرئيسي
      const { data: section, error: sectionError } = await supabase.from("sections").insert([{
        course_id: course.id,
        title: "محتوى الدورة التعليمي",
        sort_order: 1
      }]).select().single();

      if (sectionError) throw sectionError;

      // 3. إضافة الدروس مع أوقاتها
      const lessonsToInsert = previewData.lessons.map(lesson => ({
        section_id: section.id,
        title: lesson.title,
        video_url: `https://www.youtube.com/embed/${lesson.video_id}`,
        sort_order: lesson.order,
        duration_minutes: lesson.duration,
        content: `درس فيديو مستورد بمدة ${lesson.duration} دقيقة.`
      }));

      const { error: lessonsError } = await supabase.from("lessons").insert(lessonsToInsert);
      if (lessonsError) throw lessonsError;

      toast({ title: "تم الاستيراد!", description: "تم إضافة الكورس والدروس بنجاح إلى منصة نبتة." });
      navigate("/admin/courses");
    } catch (error) {
      toast({ title: "خطأ في الحفظ", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-6 md:p-10 font-tajawal" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-[#121A15] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-all">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black flex items-center gap-3 tracking-tighter text-emerald-500">
            <Sparkles className="w-8 h-8" /> استيراد محتوى ذكي
          </h1>
        </div>

        <div className="bg-[#0a0f0c] border border-neutral-800 rounded-[2.5rem] p-8 space-y-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-20" />
          
          <div className="space-y-4">
            <label className="text-neutral-400 text-sm font-bold flex items-center gap-2 mr-2">
              رابط يوتيوب <Youtube className="w-4 h-4 text-red-600" />
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="ضع رابط قائمة التشغيل هنا..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="flex-1 bg-[#121A15] border border-neutral-800 rounded-2xl px-6 py-4 text-white focus:border-emerald-500 outline-none transition-all placeholder:text-neutral-700"
              />
              <Button onClick={handleFetchPlaylist} disabled={isLoading || !playlistUrl} className="bg-emerald-600 hover:bg-emerald-500 h-[3.75rem] px-10 rounded-2xl font-black text-lg shadow-lg shadow-emerald-900/20">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "جلب البيانات"}
              </Button>
            </div>
          </div>

          {previewData && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 border-t border-neutral-800 pt-10">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4 space-y-4">
                  <div className="relative group">
                    <img src={previewData.thumbnail} className="w-full rounded-[2rem] shadow-2xl border border-neutral-800 aspect-video object-cover transition-transform group-hover:scale-[1.02]" />
                    <div className="absolute -bottom-4 inset-x-4 flex justify-between gap-2">
                      <div className="bg-emerald-600 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl flex items-center gap-2">
                        <LayoutGrid className="w-3 h-3" /> {previewData.lessons.length} درس
                      </div>
                      <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black shadow-xl flex items-center gap-2">
                        <Clock className="w-3 h-3 text-emerald-500" /> {previewData.lessons.reduce((acc, curr) => acc + curr.duration, 0)} دقيقة
                      </div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-white leading-tight mb-2">{previewData.title}</h2>
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full border border-emerald-500/20">
                      <User className="w-3.5 h-3.5" />
                      <span>تقديم: {previewData.instructor}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[10px] text-neutral-500 font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        وصف الكورس (مولّد بـ Gemini AI) <Edit3 className="w-3 h-3" />
                      </span>
                      {isGenerating && <span className="text-[10px] text-emerald-500 animate-pulse">جاري التحسين...</span>}
                    </div>
                    <textarea
                      value={previewData.description}
                      onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                      rows={6}
                      className="w-full bg-[#050806] border border-neutral-800 rounded-[1.5rem] px-6 py-5 text-neutral-400 text-sm leading-relaxed focus:border-emerald-500/50 outline-none resize-none transition-colors"
                      placeholder="اكتب وصفاً هنا..."
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#121A15]/20 rounded-[2rem] border border-neutral-800 p-6">
                <h3 className="text-[10px] font-black text-neutral-600 mb-4 uppercase tracking-[0.2em] mr-2">هيكل الدورة التدريبية</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                  {previewData.lessons.map((lesson) => (
                    <div key={lesson.video_id} className="flex justify-between items-center p-4 bg-black/40 border border-neutral-800/50 rounded-2xl group hover:border-emerald-500/30 transition-all">
                      <span className="text-xs text-neutral-400 font-bold line-clamp-1 flex items-center gap-3">
                        <span className="text-emerald-500/50">#{lesson.order}</span> {lesson.title}
                      </span>
                      <span className="text-[10px] font-black text-emerald-500 shrink-0 bg-emerald-500/5 px-2 py-1 rounded-md">
                        {lesson.duration} د
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setPreviewData(null)} variant="ghost" className="flex-1 text-neutral-500 hover:text-white rounded-2xl h-16 transition-colors">إلغاء العملية</Button>
                <Button onClick={handleImportCourse} disabled={isLoading} className="flex-[2] bg-white text-black hover:bg-neutral-100 h-16 rounded-[1.5rem] font-black text-xl transition-all active:scale-95 shadow-2xl flex items-center gap-3">
                  {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> اعتماد ونشر الدورة</>}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminYoutubeImport;
