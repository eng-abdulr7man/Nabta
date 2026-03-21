import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Youtube, ArrowRight, Loader2, Plus, LayoutGrid, Sparkles, Edit3, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const YOUTUBE_API_KEY = "AIzaSyAM5K8Aka_MvqfQNRmPITYExIIn9JmMWao";
const DEEPSEEK_API_KEY = "DarkAI-DeepAI-EFF939A9130A0ABAE3A7414D";

const AdminYoutubeImport = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const extractPlaylistId = (url) => {
    const reg = /[&?]list=([^&]+)/i;
    const match = reg.exec(url);
    return match ? match[1] : url;
  };

  // دالة لتحويل وقت يوتيوب المعقد لدقائق (رقم صحيح)
  const parseYouTubeDuration = (durationStr) => {
    const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 60 + minutes + (seconds > 30 ? 1 : 0); // تقريب للـ دقيقة
  };

  const generateAIDescription = async (courseName) => {
    setIsGenerating(true);
    try {
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: `اكتب وصفاً احترافياً لكورس بعنوان '${courseName}'. 5 أسطر فقط باللغة العربية.` }]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      return `كورس شامل في ${courseName} لتعلم أهم المهارات الأساسية.`;
    } finally { setIsGenerating(false); }
  };

  const handleFetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) return toast({ title: "رابط غير صالح", variant: "destructive" });

    setIsLoading(true);
    try {
      const resPlaylist = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataPlaylist = await resPlaylist.json();
      const playlistInfo = dataPlaylist.items[0].snippet;

      // 1. جلب الدروس (العناوين والـ IDs)
      const resItems = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataItems = await resItems.json();
      const videoIds = dataItems.items.map(i => i.snippet.resourceId.videoId).join(',');

      // 2. جلب "تفاصيل" الفيديوهات عشان ناخد الـ Duration (دي API call تانية ضرورية)
      const resDetails = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds}&key=${YOUTUBE_API_KEY}`);
      const dataDetails = await resDetails.json();

      const aiDescription = await generateAIDescription(playlistInfo.title);

      setPreviewData({
        title: playlistInfo.title,
        instructor: playlistInfo.channelTitle,
        description: aiDescription,
        thumbnail: playlistInfo.thumbnails.high?.url,
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
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  const handleImportCourse = async () => {
    if (!previewData) return;
    setIsLoading(true);
    try {
      const { data: course } = await supabase.from("courses").insert([{
        title: previewData.title,
        description: previewData.description,
        thumbnail_url: previewData.thumbnail,
        instructor: previewData.instructor,
        published: true
      }]).select().single();

      const { data: section } = await supabase.from("sections").insert([{
        course_id: course.id,
        title: "محتوى الدورة",
        sort_order: 1
      }]).select().single();

      const lessonsToInsert = previewData.lessons.map(lesson => ({
        section_id: section.id,
        title: lesson.title,
        video_url: `https://www.youtube.com/embed/${lesson.video_id}`,
        sort_order: lesson.order,
        duration_minutes: lesson.duration, // <--- حفظ المدة الزمنية هنا
        content: `درس مستورد بمدة ${lesson.duration} دقيقة.`
      }));

      await supabase.from("lessons").insert(lessonsToInsert);
      toast({ title: "نجاح!", description: "تم رفع الكورس بمدد الفيديوهات الصحيحة." });
      navigate("/admin/courses");
    } catch (error) {
      toast({ title: "فشل", description: error.message, variant: "destructive" });
    } finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-6 md:p-10 font-tajawal" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-[#121A15] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white"><ArrowRight className="w-5 h-5" /></Link>
          <h1 className="text-3xl font-black flex items-center gap-3 tracking-tighter"><Sparkles className="w-8 h-8 text-emerald-500" /> استيراد ذكي كامل</h1>
        </div>

        <div className="bg-[#0a0f0c] border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-2xl">
          <div className="space-y-4">
            <label className="text-neutral-400 text-sm font-bold flex items-center gap-2 mr-1">رابط قائمة التشغيل <Youtube className="w-4 h-4 text-red-600" /></label>
            <div className="flex gap-3">
              <input type="text" placeholder="https://youtube.com/playlist?list=..." value={playlistUrl} onChange={(e) => setPlaylistUrl(e.target.value)} className="flex-1 bg-[#121A15] border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all shadow-inner" />
              <Button onClick={handleFetchPlaylist} disabled={isLoading || !playlistUrl} className="bg-emerald-600 hover:bg-emerald-500 h-14 px-8 rounded-2xl font-bold shadow-lg shadow-emerald-900/20">{isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "جلب البيانات"}</Button>
            </div>
          </div>

          {previewData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 border-t border-neutral-800 pt-8 mt-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative shrink-0 w-full md:w-72">
                  <img src={previewData.thumbnail} className="w-full rounded-3xl shadow-2xl border border-neutral-800 aspect-video object-cover" />
                  <div className="absolute -bottom-3 -right-3 bg-emerald-600 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2"><LayoutGrid className="w-4 h-4" /> {previewData.lessons.length} درس</div>
                  {/* عرض إجمالي وقت الكورس */}
                  <div className="absolute -bottom-3 -left-3 bg-neutral-900 border border-neutral-800 px-4 py-2 rounded-xl text-xs font-black shadow-xl flex items-center gap-2 text-white">
                    <Clock className="w-4 h-4 text-emerald-500" /> {previewData.lessons.reduce((acc, curr) => acc + curr.duration, 0)} دقيقة
                  </div>
                </div>

                <div className="flex-1 space-y-5">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-black text-white leading-tight">{previewData.title}</h2>
                    <div className="flex items-center gap-2 text-emerald-500 text-sm font-bold bg-emerald-500/5 w-fit px-3 py-1 rounded-lg"><User className="w-4 h-4" /><span>دكتور: {previewData.instructor}</span></div>
                  </div>
                  <textarea value={previewData.description} onChange={(e) => setPreviewData({...previewData, description: e.target.value})} rows={5} className="w-full bg-[#050806] border border-neutral-800 rounded-2xl px-5 py-4 text-neutral-400 text-sm leading-relaxed outline-none" />
                </div>
              </div>

              {/* قائمة الدروس مع مددها الزمنية */}
              <div className="bg-[#121A15]/30 rounded-2xl border border-neutral-800 p-4 max-h-64 overflow-y-auto">
                <h3 className="text-xs font-black text-neutral-500 mb-3 uppercase tracking-widest">معاينة الدروس والوقت</h3>
                {previewData.lessons.map((lesson) => (
                  <div key={lesson.video_id} className="flex justify-between items-center py-2 border-b border-neutral-800/50 last:border-0">
                    <span className="text-sm text-neutral-300 line-clamp-1">#{lesson.order} {lesson.title}</span>
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lesson.duration} د
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setPreviewData(null)} variant="ghost" className="flex-1 text-neutral-500 rounded-2xl h-14">إلغاء</Button>
                <Button onClick={handleImportCourse} disabled={isLoading} className="flex-[2] bg-white text-black hover:bg-neutral-100 h-14 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl">{isLoading ? "جاري الرفع..." : "تأكيد واعتماد الكورس"}</Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminYoutubeImport;
