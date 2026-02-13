import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useCourse, useCourseSections, useSectionLessons } from "@/hooks/useCourses";
import { motion } from "framer-motion";
import { CheckCircle, Circle, ChevronDown, ChevronUp, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const LearnPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const playerRef = useRef<HTMLDivElement>(null);
  const ytPlayerRef = useRef<any>(null);
  const saveIntervalRef = useRef<NodeJS.Timeout>();

  const { data: course } = useCourse(id!);
  const { data: sections } = useCourseSections(id!);
  const sectionIds = (sections || []).map((s) => s.id);
  const { data: lessons } = useSectionLessons(sectionIds);

  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

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

  // Get enrollment for last_lesson_id
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

  // Set initial lesson
  useEffect(() => {
    if (lessons && lessons.length > 0 && !currentLessonId) {
      const lastLesson = enrollment?.last_lesson_id;
      setCurrentLessonId(lastLesson || lessons[0].id);
      // Expand all sections initially
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
      if (ytPlayerRef.current) {
        ytPlayerRef.current.destroy();
      }
      ytPlayerRef.current = new (window as any).YT.Player("yt-player", {
        videoId,
        playerVars: { rel: 0, modestbranding: 1, hl: "ar" },
        events: {
          onReady: (e: any) => {
            // Restore position
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

  // Auto-save position every 10s
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

  // Update last_lesson_id in enrollment
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
      // Check if all complete
      const newCompleted = completedCount + 1;
      if (newCompleted >= totalLessons && totalLessons > 0) {
        issueCertificate();
      }
    },
  });

  const issueCertificate = async () => {
    try {
      const { data: existing } = await supabase
        .from("certificates")
        .select("id")
        .eq("user_id", user!.id)
        .eq("course_id", id!)
        .maybeSingle();
      if (existing) return;
      const { error } = await supabase.from("certificates").insert({
        user_id: user!.id,
        course_id: id!,
        certificate_number: "", // trigger will fill this
      });
      if (!error) {
        toast({ title: "🎉 مبارك! حصلت على شهادة إتمام الكورس" });
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
    }
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Video area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-14 border-b border-border flex items-center justify-between px-4 bg-card shrink-0">
            <div className="flex items-center gap-3">
              <button onClick={() => navigate(`/courses/${id}`)} className="text-muted-foreground hover:text-foreground">
                <ArrowRight className="w-5 h-5" />
              </button>
              <h1 className="font-bold text-sm text-foreground truncate">{course?.title}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{progressPercent}%</span>
              <Progress value={progressPercent} className="w-24 h-2" />
            </div>
          </div>

          {/* Player */}
          <div className="flex-1 bg-black flex items-center justify-center">
            {currentLesson?.video_url ? (
              <div className="w-full aspect-video max-h-full">
                <div id="yt-player" className="w-full h-full" />
              </div>
            ) : (
              <p className="text-muted-foreground">لا يوجد فيديو لهذا الدرس</p>
            )}
          </div>

          {/* Lesson info */}
          <div className="p-4 bg-card border-t border-border shrink-0">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">{currentLesson?.title}</h2>
              <div className="flex gap-2">
                {currentLessonId && !isLessonCompleted(currentLessonId) && (
                  <Button size="sm" onClick={() => markComplete.mutate(currentLessonId)} className="bg-primary text-primary-foreground gap-1">
                    <CheckCircle className="w-4 h-4" />
                    إكمال الدرس
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={goToNextLesson}>الدرس التالي</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - lessons list */}
        <div className="w-full lg:w-80 border-r border-border bg-card overflow-y-auto shrink-0 max-h-[40vh] lg:max-h-full">
          <div className="p-3 border-b border-border">
            <p className="text-xs text-muted-foreground">التقدم: {completedCount}/{totalLessons} درس</p>
          </div>
          {(sections || []).map((section) => {
            const sectionLessons = (lessons || []).filter((l) => l.section_id === section.id);
            const isExpanded = expandedSections.has(section.id);
            return (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-foreground bg-secondary/50 hover:bg-secondary border-b border-border"
                >
                  <span className="truncate">{section.title}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                {isExpanded && (
                  <div>
                    {sectionLessons.map((lesson) => {
                      const completed = isLessonCompleted(lesson.id);
                      const isCurrent = lesson.id === currentLessonId;
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLessonId(lesson.id)}
                          className={`w-full px-4 py-2.5 flex items-center gap-2 text-sm border-b border-border transition-colors ${
                            isCurrent ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary"
                          }`}
                        >
                          {completed ? (
                            <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                          ) : (
                            <Circle className="w-4 h-4 shrink-0" />
                          )}
                          <span className="truncate text-right">{lesson.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/))([^&?\s]+)/);
  return match ? match[1] : null;
}

export default LearnPage;
