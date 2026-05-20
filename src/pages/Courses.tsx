import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, Zap, Lock, PlayCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import AppNavbar from "@/components/AppNavbar";
import { useUser } from "@/hooks/useUser";
import { COURSES, Course, getModuleXp } from "@/data/mockData";
import { toast } from "sonner";

const CATEGORIES = ["Tous", "Développement", "Marketing", "Design", "Social Media", "Data", "Commerce"];

const Courses = () => {
  const { user, completeModule } = useUser();
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [completing, setCompleting] = useState<string | null>(null);

  const filtered = COURSES.filter(
    c => activeCategory === "Tous" || c.category === activeCategory
  );

  const getCompletedModules = (courseId: string): string[] =>
    user?.completedModules?.[courseId] ?? [];

  const handleCompleteModule = (
    course: Course,
    moduleId: string,
    moduleIndex: number
  ) => {
    const alreadyDone = getCompletedModules(course.id).includes(moduleId);
    if (alreadyDone || completing) return;

    setCompleting(moduleId);
    const xp = getModuleXp(course, moduleIndex);
    const completedSoFar = getCompletedModules(course.id);
    const isLastModule =
      course.moduleList.every(
        m => m.id === moduleId || completedSoFar.includes(m.id)
      );

    setTimeout(() => {
      completeModule(course.id, moduleId, xp, isLastModule);
      setCompleting(null);

      if (isLastModule) {
        toast.success("Cours complété ! 🎓", {
          description: `"${course.title}" ajouté à votre portfolio.`
        });
      } else {
        toast.success(`+${xp} XP gagnés ! 🎉`, {
          description: course.moduleList[moduleIndex].title
        });
      }
    }, 800);
  };

  const CourseDialog = ({ course }: { course: Course }) => {
    const completedModules = getCompletedModules(course.id);
    const completedCount = completedModules.length;
    const totalModules = course.moduleList.length;
    const progressPercent = (completedCount / totalModules) * 100;
    const earnedXp = course.moduleList
      .filter(m => completedModules.includes(m.id))
      .reduce((sum, _, i) => {
        const realIndex = course.moduleList.findIndex(
          m => completedModules.includes(m.id) && m === course.moduleList[i]
        );
        return sum + getModuleXp(course, realIndex);
      }, 0);

    const xpEarned = completedModules.reduce((sum, mId) => {
      const idx = course.moduleList.findIndex(m => m.id === mId);
      return sum + (idx >= 0 ? getModuleXp(course, idx) : 0);
    }, 0);

    const isCourseComplete = user?.completedCourses.includes(course.id);

    return (
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl">{course.emoji}</span>
            <div>
              <DialogTitle className="text-xl font-display leading-tight">
                {course.title}
              </DialogTitle>
              <DialogDescription className="mt-0.5">
                {course.level} · {course.duration} · {totalModules} modules
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* XP Progress */}
        <div className="rounded-xl bg-muted/40 border border-border p-4 mb-2">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {completedCount}/{totalModules} modules complétés
            </span>
            <span className="font-bold text-primary flex items-center gap-1">
              <Zap size={14} />
              {xpEarned}/{course.xp} XP
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Module list */}
        <div className="space-y-2">
          {course.moduleList.map((mod, index) => {
            const isDone = completedModules.includes(mod.id);
            const isBeingCompleted = completing === mod.id;
            const moduleXp = getModuleXp(course, index);

            return (
              <div
                key={mod.id}
                className={`flex items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                  isDone
                    ? "bg-green-500/5 border-green-500/20"
                    : "bg-background border-border"
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center text-xs text-muted-foreground font-bold">
                      {index + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-tight ${isDone ? "text-muted-foreground line-through" : ""}`}>
                    {mod.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={10} /> {mod.duration}
                    </span>
                    <span className="text-xs font-semibold text-primary">
                      +{moduleXp} XP
                    </span>
                  </div>
                </div>

                {isDone ? (
                  <span className="text-xs text-green-600 font-semibold shrink-0">Complété</span>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 text-xs h-8 px-3"
                    onClick={() => handleCompleteModule(course, mod.id, index)}
                    disabled={isBeingCompleted || !!completing}
                  >
                    {isBeingCompleted ? (
                      <span className="flex items-center gap-1">
                        <span className="animate-spin">⏳</span> ...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <PlayCircle size={13} /> Suivre
                      </span>
                    )}
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {isCourseComplete && (
          <div className="mt-3 flex items-center gap-2 justify-center text-green-600 font-semibold bg-green-500/10 rounded-xl py-3">
            <CheckCircle size={18} /> Cours complété — ajouté à votre portfolio !
          </div>
        )}
      </DialogContent>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Catalogue de <span className="gradient-text">Cours</span>
            </h1>
            <p className="text-muted-foreground">
              Développez vos compétences numériques avec nos micro-formations.
            </p>
          </motion.div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                  activeCategory === cat
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, i) => {
              const completedModules = getCompletedModules(course.id);
              const isCourseComplete = user?.completedCourses.includes(course.id);
              const inProgress =
                completedModules.length > 0 && !isCourseComplete;
              const progressPct =
                (completedModules.length / course.moduleList.length) * 100;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`rounded-2xl border bg-gradient-to-br ${course.gradient} p-6 flex flex-col`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-4xl">{course.emoji}</span>
                    {isCourseComplete && (
                      <CheckCircle size={20} className="text-green-500 shrink-0" />
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4 flex-wrap">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} /> {course.moduleList.length} modules
                    </span>
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">
                      {course.level}
                    </span>
                  </div>

                  {/* In-progress bar */}
                  {inProgress && (
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>{completedModules.length}/{course.moduleList.length} modules</span>
                        <span className="text-primary font-semibold">En cours</span>
                      </div>
                      <Progress value={progressPct} className="h-1.5" />
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold text-primary">
                      <Zap size={14} /> {course.xp} XP
                    </span>
                    {isCourseComplete ? (
                      <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
                        <CheckCircle size={14} /> Complété
                      </span>
                    ) : (
                      <Button
                        size="sm"
                        className="gradient-bg border-0"
                        onClick={() => setSelectedCourse(course)}
                      >
                        {inProgress ? "Continuer" : "Commencer"}
                      </Button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Course detail dialog */}
      <Dialog
        open={!!selectedCourse}
        onOpenChange={open => { if (!open) setSelectedCourse(null); }}
      >
        {selectedCourse && <CourseDialog course={selectedCourse} />}
      </Dialog>
    </div>
  );
};

export default Courses;
