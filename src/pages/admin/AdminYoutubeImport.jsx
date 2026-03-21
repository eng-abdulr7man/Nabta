import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Youtube, ArrowRight, Loader2, Plus, LayoutGrid, Sparkles, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const YOUTUBE_API_KEY = "AIzaSyAM5K8Aka_MvqfQNRmPITYExIIn9JmMWao";
// إعدادات DeepSeek بناءً على الكود اللي بعته
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"; // أو الرابط اللي في الـ Settings عندك
const DEEPSEEK_API_KEY = "YOUR_DEEPSEEK_KEY"; // حط مفتاح DeepSeek هنا

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

  // فانكشن توليد الوصف بالـ AI (نفس منطق كود البايثون بتاعك)
  const generateAIDescription = async (courseName) => {
    setIsGenerating(true);
    const prompt = `اكتب وصفاً احترافياً لكورس بعنوان '${courseName}'. يجب أن يكون الوصف باللغة العربية ومكوناً من 5 أسطر فقط بالضبط. ممنوع كتابة أي مقدمات، أو خاتمة، أو ملاحظات، أو أي نص إضافي، فقط الوصف المكون من 5 أسطر.`;
    
    try {
      // ملحوظة: لو الـ API بتاعك بيقبل Payload مختلف زي اللي في البايثون (key و v3) عدل الـ Body هنا
      const response = await fetch("https://api.deepseek.com/v1/chat/completions", { // استبدله برابط الـ Proxy لو شغال بـ v3 مباشرة
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${DEEPSEEK_API_KEY}` },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error("AI Error:", error);
      return `وصف احترافي لكورس ${courseName} يتناول أهم المبادئ والأساسيات بشكل مبسط وعملي ليناسب جميع المستويات المهتمة بهذا المجال الزراعي المتطور.`;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleFetchPlaylist = async () => {
    const playlistId = extractPlaylistId(playlistUrl);
    if (!playlistId) {
      toast({ title: "خطأ", description: "رابط البلاي ليست غير صحيح", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      const resPlaylist = await fetch(`https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataPlaylist = await resPlaylist.json();
      if (!dataPlaylist.items?.length) throw new Error("لم يتم العثور على القائمة");

      const playlistInfo = dataPlaylist.items[0].snippet;

      // توليد الوصف بالذكاء الاصطناعي فوراً بعد الجلب
      const aiDescription = await generateAIDescription(playlistInfo.title);

      const resItems = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${YOUTUBE_API_KEY}`);
      const dataItems = await resItems.json();

      setPreviewData({
        title: playlistInfo.title,
        description: aiDescription, // نستخدم وصف الـ AI
        thumbnail: playlistInfo.thumbnails.high?.url || playlistInfo.thumbnails.default?.url,
        lessons: dataItems.items.map((item, index) => ({
          title: item.snippet.title,
          video_id: item.snippet.resourceId.videoId,
          order: index + 1,
        })),
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
      const { data: course, error: courseError } = await supabase.from("courses").insert([{
        title: previewData.title,
        description: previewData.description, // الوصف المعدل من قبلك
        thumbnail_url: previewData.thumbnail,
        instructor: "DeepSeek AI",
        published: true
      }]).select().single();

      if (courseError) throw courseError;

      const { data: section, error: sectionError } = await supabase.from("sections").insert([{
        course_id: course.id,
        title: "محتوى الدورة",
        sort_order: 1
      }]).select().single();

      if (sectionError) throw sectionError;

      const lessonsToInsert = previewData.lessons.map(lesson => ({
        section_id: section.id,
        title: lesson.title,
        video_url: `https://www.youtube.com/embed/${lesson.video_id}`,
        sort_order: lesson.order,
        content: `فيديو مستورد لدرس: ${lesson.title}`
      }));

      const { error: lessonsError } = await supabase.from("lessons").insert(lessonsToInsert);
      if (lessonsError) throw lessonsError;

      toast({ title: "تم بنجاح!", description: "تم استيراد الكورس بوصف AI بنجاح." });
      navigate("/admin");
    } catch (error) {
      toast({ title: "فشل الحفظ", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050806] text-white p-6 md:p-10 font-tajawal" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Link to="/admin" className="p-2 bg-[#121A15] border border-neutral-800 rounded-xl text-neutral-400 hover:text-white transition-all">
            <ArrowRight className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-black flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-emerald-500" /> استيراد كورس ذكي
          </h1>
        </div>

        <div className="bg-[#0a0f0c] border border-neutral-800 rounded-3xl p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10" />
          
          <div className="space-y-4">
            <label className="text-neutral-400 text-sm font-bold flex items-center gap-2">
              رابط بلاي ليست اليوتيوب <Youtube className="w-4 h-4 text-red-500" />
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="https://youtube.com/playlist?list=..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                className="flex-1 bg-[#121A15] border border-neutral-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 outline-none transition-all shadow-inner"
              />
              <Button onClick={handleFetchPlaylist} disabled={isLoading || !playlistUrl} className="bg-emerald-600 hover:bg-emerald-500 h-14 px-8 rounded-2xl font-bold shadow-lg shadow-emerald-900/20">
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "جلب وتوليد الوصف"}
              </Button>
            </div>
          </div>

          {previewData && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 border-t border-neutral-800 pt-8 mt-4">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="relative shrink-0 group">
                  <img src={previewData.thumbnail} className="w-full md:w-72 rounded-3xl shadow-2xl border border-neutral-800 object-cover aspect-video" />
                  <div className="absolute -bottom-3 -left-3 bg-[#121A15] border border-neutral-800 px-4 py-2 rounded-xl text-xs font-bold text-emerald-500 flex items-center gap-2 shadow-xl">
                    <LayoutGrid className="w-4 h-4" /> {previewData.lessons.length} درس
                  </div>
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">عنوان الكورس</span>
                    <h2 className="text-2xl font-black text-white leading-tight">{previewData.title}</h2>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-2">
                        وصف الكورس (مولّد بـ AI) <Edit3 className="w-3 h-3 opacity-50" />
                      </span>
                      {isGenerating && <Loader2 className="w-3 h-3 animate-spin text-emerald-500" />}
                    </div>
                    {/* التعديل المباشر: هنا تقدر تعدل الوصف بعد ما الـ AI يطلعه */}
                    <textarea
                      value={previewData.description}
                      onChange={(e) => setPreviewData({...previewData, description: e.target.value})}
                      rows={6}
                      className="w-full bg-[#050806] border border-neutral-800/50 rounded-2xl px-5 py-4 text-neutral-300 text-sm leading-relaxed focus:border-emerald-500/50 outline-none resize-none shadow-inner font-tajawal"
                      placeholder="جاري توليد الوصف..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button onClick={() => setPreviewData(null)} variant="outline" className="flex-1 border-neutral-800 rounded-2xl h-14 text-neutral-400">إلغاء</Button>
                <Button onClick={handleImportCourse} disabled={isLoading} className="flex-[2] bg-white text-black hover:bg-neutral-100 h-14 rounded-2xl font-black text-lg shadow-xl transition-all active:scale-95">
                  {isLoading ? "جاري الحفظ في نبتة..." : "تأكيد واعتماد الكورس"}
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
