import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCourse, useCourseSections, useSectionLessons } from "@/hooks/useCourses";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Circle, ChevronDown, ChevronUp, ArrowRight, PlayCircle, FileText, Check, Plus, Clock, Trash2, Edit3, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CertificateModal from "@/components/courses/CertificateModal";

const LearnPage = () => {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const ytPlayerRef = useRef<any>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout>();

  const { data: course } = useCourse(id!);
  const { data: sections } = useCourseSections(id!);
  const sectionIds = (sections || []).map((s) => s.id);
  const { data: lessons } = useSectionLessons(sectionIds);

  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showCertModal, setShowCertModal] = useState(false);
  const [certData, setCertData] = useState<any>(null);

  // حالات النوتات الذكية
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [capturedVideoTime, setCapturedVideoTime] = useState(0);

  // التمرير لأعلى الصفحة عند تبديل الدرس
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentLessonId]);

  // Get progress
  const { data: progress } = useQuery({
    queryKey: ["lesson-progress", id, user?.id],
    queryFn: async () => {
      if (!lessons) return [];
      const lessonIds = lessons.map((l) => l.id);
      const { data } = await supabase
        .from("lesson_progress")
        .select("*")
        .eq("user_id", user!.id)
        .in("lesson_id", lessonIds);
      return data || [];
    },
    enabled: !!lessons && !!user,
  });

  // Get enrollment
  const { data: enrollment } = useQuery({
    queryKey: ["enrollment-learn", id, user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("enrollments")
        .select("*")
        .eq("course_id", id!)
        .eq("user_id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  // Get notes for current lesson
  const { data: lessonNotes } = useQuery({
    queryKey: ["lesson-notes", currentLessonId, user?.id],
    queryFn: async () => {
      if (!currentLessonId || !user) return [];
      const { data, error } = await supabase
        .from("lesson_notes")
        .select("*")
        .eq("user_id", user.id)
        .eq("lesson_id", currentLessonId)
        .order("video_timestamp", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentLessonId && !!user,
  });

  // Set initial lesson
  useEffect(() => {
    if (lessons && lessons.length > 0 && !currentLessonId) {
      const lastLesson = enrollment?.last_lesson_id;
      setCurrentLessonId(lastLesson || lessons[0].id);
      setExpandedSections(new Set(sectionIds));
    }
  }, [lessons, enrollment]);

  const currentLesson = lessons?.find((l) => l.id === currentLessonId);
  const completedCount = (progress || []).filter((p: any) => p.completed).length;
  const totalLessons = lessons?.length || 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // YouTube player
  useEffect(() => {
    if (!currentLesson?.video_url) return;
    const videoId = extractYouTubeId(currentLesson.video_url);
    if (!videoId) return;

    const loadPlayer = () => {
      if (ytPlayerRef.current) ytPlayerRef.current.destroy();
      ytPlayerRef.current = new (window as any).YT.Player("yt-player", {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, hl: "ar", color: "white" },
        events: {
          onReady: (e: any) => {
            const savedProgress = (progress || []).find((p: any) => p.lesson_id === currentLessonId);
            if (savedProgress && savedProgress.video_position > 0) {
              e.target.seekTo(savedProgress.video_position, true);
            }
          },
        },
      });
    };

    if ((window as any).YT?.Player) {
      loadPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      (window as any).onYouTubeIframeAPIReady = loadPlayer;
    }

    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [currentLessonId, currentLesson?.video_url]);

  // Auto-save position
  useEffect(() => {
    if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    saveIntervalRef.current = setInterval(() => {
      if (ytPlayerRef.current?.getCurrentTime && currentLessonId && user) {
        const pos = ytPlayerRef.current.getCurrentTime();
        supabase.from("lesson_progress").upsert({
          user_id: user.id,
          lesson_id: currentLessonId,
          video_position: pos,
        }, { onConflict: "user_id,lesson_id" }).then(() => {});
      }
    }, 10000);
    return () => { if (saveIntervalRef.current) clearInterval(saveIntervalRef.current); };
  }, [currentLessonId, user]);

  // Update last_lesson_id
  useEffect(() => {
    if (currentLessonId && user && id) {
      supabase.from("enrollments").update({ last_lesson_id: currentLessonId }).eq("user_id", user.id).eq("course_id", id).then(() => {});
    }
  }, [currentLessonId]);

  const markComplete = useMutation({
    mutationFn: async (lessonId: string) => {
      const { error } = await supabase.from("lesson_progress").upsert({
        user_id: user!.id,
        lesson_id: lessonId,
        completed: true,
        completed_at: new Date().toISOString(),
      }, { onConflict: "user_id,lesson_id" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-progress", id] });
      const newCompleted = completedCount + 1;
      if (newCompleted >= totalLessons && totalLessons > 0) {
        issueCertificate();
      } else {
        toast({ title: "ممتاز!", description: "تم إكمال الدرس بنجاح." });
      }
    },
  });

  // إضافة ملاحظة جديدة
  const addNoteMutation = useMutation({
    mutationFn: async () => {
      if (!newNoteTitle.trim()) throw new Error("عنوان الملاحظة مطلوب");
      const { error } = await supabase.from("lesson_notes").insert({
        user_id: user!.id,
        lesson_id: currentLessonId!,
        title: newNoteTitle,
        content: newNoteContent,
        video_timestamp: capturedVideoTime,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-notes", currentLessonId] });
      toast({ title: "تم الحفظ", description: "تم إضافة الملاحظة الذكية بنجاح." });
      setNewNoteTitle("");
      setNewNoteContent("");
      setShowNoteModal(false);
    },
    onError: (err: any) => {
      toast({ title: "خطأ", description: err.message || "فشل حفظ الملاحظة", variant: "destructive" });
    },
  });

  // حذف ملاحظة
  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      const { error } = await supabase.from("lesson_notes").delete().eq("id", noteId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lesson-notes", currentLessonId] });
      toast({ title: "تم الحذف", description: "تم حذف الملاحظة بنجاح." });
    },
  });

  const handleOpenNoteModal = () => {
    const currentTime = ytPlayerRef.current?.getCurrentTime ? ytPlayerRef.current.getCurrentTime() : 0;
    setCapturedVideoTime(currentTime);
    setShowNoteModal(true);
  };

  const seekToTime = (seconds: number) => {
    if (ytPlayerRef.current?.seekTo) {
      ytPlayerRef.current.seekTo(seconds, true);
      toast({ title: "الانتقال للتوقيت", description: `تم الانتقال للدقيقة ${formatTime(seconds)}` });
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const issueCertificate = async () => {
    try {
      const { data: existing } = await supabase
        .from("certificates")
        .select("*")
        .eq("user_id", user!.id)
        .eq("course_id", id!)
        .maybeSingle();
      if (existing) {
        setCertData({
          learnerName: profile?.full_name || user!.email || "",
          courseName: course?.title || "",
          certificateNumber: existing.certificate_number,
          issuedAt: existing.issued_at,
          instructor: course?.instructor,
        });
        setShowCertModal(true);
        return;
      }
      const { data: newCert, error } = await supabase.from("certificates").insert({
        user_id: user!.id,
        course_id: id!,
        certificate_number: "",
      }).select().single();
      if (!error && newCert) {
        setCertData({
          learnerName: profile?.full_name || user!.email || "",
          courseName: course?.title || "",
          certificateNumber: newCert.certificate_number,
          issuedAt: newCert.issued_at,
          instructor: course?.instructor,
        });
        setShowCertModal(true);
      }
    } catch {}
  };

  const isLessonCompleted = (lessonId: string) => {
    return (progress || []).some((p: any) => p.lesson_id === lessonId && p.completed);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      next.has(sectionId) ? next.delete(sectionId) : next.add(sectionId);
      return next;
    });
  };

  const goToNextLesson = () => {
    if (!lessons || !currentLessonId) return;
    const idx = lessons.findIndex((l) => l.id === currentLessonId);
    if (idx < lessons.length - 1) {
      setCurrentLessonId(lessons[idx + 1].id);
    } else {
      if (completedCount >= totalLessons && totalLessons > 0) {
        issueCertificate();
      } else {
        toast({ 
          title: "عذراً!", 
          description: "يجب إكمال جميع الدروس أولاً للحصول على الشهادة.",
          variant: "destructive" 
        });
      }
    }
  };
      
  const isLastLesson = lessons && currentLessonId ? lessons.findIndex((l) => l.id === currentLessonId) === lessons.length - 1 : false;

  return (
    <div className="min-h-screen bg-[#050806] font-tajawal text-white flex flex-col" dir="rtl">
      
      {/* الشريط العلوي الثابت */}
      <div className="sticky top-0 z-50 h-16 border-b border-neutral-800/60 bg-[#0a0f0c]/90 backdrop-blur-xl flex items-center justify-between px-4 lg:px-8 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(`/courses/${id}`)} 
            className="w-9 h-9 rounded-full flex items-center justify-center bg-[#121A15] border border-neutral-800 text-neutral-400 hover:text-white hover:border-emerald-500/50 transition-all"
            title="العودة للكورس"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <h1 className="font-bold text-sm text-white truncate max-w-[200px] md:max-w-md">{course?.title}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-emerald-500">{progressPercent}%</span>
          </div>
          <Progress 
            value={progressPercent} 
            className="w-24 sm:w-32 h-2.5 bg-neutral-800 overflow-hidden rounded-full [&>div]:bg-emerald-500" 
          />
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="container mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* العمود الأيمن (الفيديو + التفاصيل + النوتات الذكية) */}
          <div className="w-full lg:w-[65%] xl:w-[70%] flex flex-col gap-6">
            
            {/* مساحة الفيديو */}
            <div className="w-full bg-black aspect-video rounded-2xl overflow-hidden shadow-2xl border border-neutral-800/50">
              {currentLesson?.video_url ? (
                <div id="yt-player" className="w-full h-full" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-3">
                  <PlayCircle className="w-12 h-12 opacity-50" />
                  <p>لا يوجد فيديو متاح لهذا الدرس</p>
                </div>
              )}
            </div>

            {/* عنوان الدرس وأزرار التحكم */}
            <div className="bg-[#0a0f0c] rounded-2xl p-5 sm:p-6 border border-neutral-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
              <h2 className="text-xl sm:text-2xl font-black text-white leading-relaxed flex-1">
                {currentLesson?.title}
              </h2>
              
              <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
                {currentLessonId && !isLessonCompleted(currentLessonId) && (
                  <Button 
                    onClick={() => markComplete.mutate(currentLessonId)} 
                    disabled={markComplete.isPending}
                    className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all flex items-center gap-2"
                  >
                    {markComplete.isPending ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    إكمال الدرس
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={goToNextLesson}
                  className="flex-1 sm:flex-none bg-transparent border-neutral-700 text-neutral-300 hover:bg-[#121A15] hover:text-white h-11 px-5 rounded-xl font-bold transition-all"
                >
                  {isLastLesson ? "إنهاء وعرض الشهادة" : "الدرس التالي"}
                </Button>
              </div>
            </div>

            {/* المرفقات (إن وجدت) */}
            {currentLesson && (currentLesson as any).file_url && (
              <a
                href={(currentLesson as any).file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#0a0f0c] border border-neutral-800/60 hover:border-emerald-500/30 hover:bg-[#121A15] transition-all group w-fit pr-5"
              >
                <div className="w-12 h-12 rounded-xl bg-[#121A15] border border-neutral-800 flex items-center justify-center group-hover:bg-emerald-500/10 transition-colors">
                  <FileText className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">تحميل مرفقات الدرس</span>
                  <span className="text-xs text-neutral-500 font-sans tracking-wider mt-1">PDF / DOC / ZIP</span>
                </div>
              </a>
            )}

            {/* الوصف / المحتوى النصي */}
            {currentLesson && (currentLesson as any).content && (
              <div className="bg-[#0a0f0c] rounded-2xl p-6 sm:p-8 border border-neutral-800/60">
                <h3 className="text-lg font-bold text-white mb-4 border-b border-neutral-800/50 pb-3">تفاصيل الدرس</h3>
                <div className="prose prose-sm sm:prose-base prose-invert max-w-none text-neutral-300 leading-loose whitespace-pre-wrap">
                  {(currentLesson as any).content}
                </div>
              </div>
            )}

            {/* قسم الملاحظات الذكية (Smart Notes System) */}
            <div className="bg-[#0a0f0c] rounded-2xl p-6 sm:p-8 border border-neutral-800/60">
              <div className="flex items-center justify-between mb-6 border-b border-neutral-800/50 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">ملاحظاتك الذكية للدرس</h3>
                    <p className="text-xs text-neutral-400">سجل ملاحظاتك واربطها بتوقيت الفيديو الحالي فوراً</p>
                  </div>
                </div>
                <Button
                  onClick={handleOpenNoteModal}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-4 rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-950/40"
                >
                  <Plus className="w-4 h-4" />
                  إضافة ملاحظة
                </Button>
              </div>

              {/* قائمة النوتات */}
              <div className="space-y-3">
                {lessonNotes && lessonNotes.length > 0 ? (
                  lessonNotes.map((note: any) => (
                    <div 
                      key={note.id}
                      className="group p-4 rounded-xl bg-[#121A15]/60 border border-neutral-800/60 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3.5 flex-1">
                        {/* زر التوقيت للانتقال في الفيديو */}
                        <button
                          onClick={() => seekToTime(note.video_timestamp)}
                          className="mt-0.5 shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all text-xs font-mono font-bold flex items-center gap-1.5"
                          title="الانتقال إلى هذا التوقيت في الفيديو"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          {formatTime(note.video_timestamp)}
                        </button>

                        <div className="flex flex-col">
                          <h4 className="font-bold text-white text-sm sm:text-base">{note.title}</h4>
                          {note.content && (
                            <p className="text-sm text-neutral-300 mt-1 leading-relaxed">{note.content}</p>
                          )}
                          <span className="text-[11px] text-neutral-500 mt-2 font-sans">
                            {new Date(note.created_at).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>

                      {/* زر الحذف */}
                      <button
                        onClick={() => deleteNoteMutation.mutate(note.id)}
                        className="text-neutral-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors self-end sm:self-center"
                        title="حذف الملاحظة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-neutral-500 text-sm border border-dashed border-neutral-800 rounded-xl">
                    لا توجد ملاحظات مسجلة لهذا الدرس حتى الآن. ابدأ بإضافة ملاحظة عند أي دقيقة تهمك في الفيديو!
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* العمود الأيسر (قائمة الدروس الجانبية) */}
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <div className="bg-[#0a0f0c] rounded-2xl border border-neutral-800/60 flex flex-col lg:sticky lg:top-24 max-h-[600px] lg:max-h-[calc(100vh-8rem)] overflow-hidden">
              
              <div className="p-5 border-b border-neutral-800/60 bg-[#121A15]">
                <h3 className="font-bold text-lg text-white">محتوى الكورس</h3>
                <p className="text-sm text-neutral-400 mt-1">
                  التقدم: {completedCount} من {totalLessons} درس
                </p>
              </div>
              
              <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-neutral-800 [&::-webkit-scrollbar-track]:bg-transparent">
                {(sections || []).map((section) => {
                  const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
                  const isExpanded = expandedSections.has(section.id);
                  return (
                    <div key={section.id} className="border-b border-neutral-800/40 last:border-0">
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full px-5 py-4 flex items-center justify-between text-sm font-bold text-neutral-300 hover:text-white bg-transparent hover:bg-[#121A15] transition-colors"
                      >
                        <span className="truncate text-right">{section.title}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0 text-emerald-500" /> : <ChevronDown className="w-4 h-4 shrink-0 text-neutral-500" />}
                      </button>
                      
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }} 
                            animate={{ height: "auto", opacity: 1 }} 
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-[#050806]"
                          >
                            {sectionLessons.map((lesson) => {
                              const completed = isLessonCompleted(lesson.id);
                              const isCurrent = lesson.id === currentLessonId;
                              return (
                                <button
                                  key={lesson.id}
                                  onClick={() => setCurrentLessonId(lesson.id)}
                                  className={`w-full px-5 py-3.5 flex items-start gap-3 text-sm transition-all border-r-2 ${
                                    isCurrent 
                                      ? "bg-emerald-900/10 border-emerald-500 text-emerald-400" 
                                      : "border-transparent text-neutral-400 hover:bg-[#121A15] hover:text-white"
                                  }`}
                                >
                                  <div className="mt-0.5 shrink-0">
                                    {completed ? (
                                      <CheckCircle className={`w-4 h-4 ${isCurrent ? 'text-emerald-500' : 'text-emerald-600'}`} />
                                    ) : isCurrent ? (
                                      <PlayCircle className="w-4 h-4 text-emerald-500" />
                                    ) : (
                                      <Circle className="w-4 h-4 text-neutral-600" />
                                    )}
                                  </div>
                                  <span className="truncate text-right leading-relaxed font-medium">{lesson.title}</span>
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* مودال (نافذة) إضافة ملاحظة ذكية جديدة */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0a0f0c] border border-neutral-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl flex flex-col gap-5"
          >
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Edit3 className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-lg text-white">إضافة ملاحظة ذكية جديدة</h3>
              </div>
              <div className="px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
                توقيت الفيديو: {formatTime(capturedVideoTime)}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">عنوان الملاحظة *</label>
                <input
                  type="text"
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="مثال: نقطة هامة بخصوص التسميد..."
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2">محتوى أو تفاصيل الملاحظة (اختياري)</label>
                <textarea
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="اكتب تفاصيل إضافية تريد تذكرها..."
                  rows={4}
                  className="w-full bg-[#121A15] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowNoteModal(false)}
                className="bg-transparent border-neutral-700 text-neutral-300 hover:bg-[#121A15] hover:text-white rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                onClick={() => addNoteMutation.mutate()}
                disabled={addNoteMutation.isPending}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl px-5"
              >
                {addNoteMutation.isPending ? "جاري الحفظ..." : "حفظ الملاحظة"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* نافذة الشهادة */}
      {certData && (
        <CertificateModal
          open={showCertModal}
          onClose={() => setShowCertModal(false)}
          {...certData}
        />
      )}
    </div>
  );
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default LearnPage;
