import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin, Clock, Zap, CheckCircle, ChevronRight,
  Wrench, Target, FileText, Send, PlayCircle, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import AppNavbar from "@/components/AppNavbar";
import { useUser } from "@/hooks/useUser";
import { MISSIONS, Mission, getTaskXp } from "@/data/mockData";
import { toast } from "sonner";

/* ── Mission Dialog ──────────────────────────────────────────────── */
const MissionDialog = ({
  mission,
  onClose
}: {
  mission: Mission;
  onClose: () => void;
}) => {
  const { user, acceptMission, completeMissionTask, submitMission } = useUser();
  const [completing, setCompleting] = useState<string | null>(null);
  const [submitText, setSubmitText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isActive = user?.activeMission === mission.id;
  const isCompleted = user?.completedMissions?.includes(mission.id) ?? false;
  const completedTasks = user?.completedMissionTasks?.[mission.id] ?? [];
  const allTasksDone = mission.tasks.every(t => completedTasks.includes(t.id));
  const progressPct = (completedTasks.length / mission.tasks.length) * 100;
  const xpEarned = completedTasks.reduce((sum, tId) => {
    const idx = mission.tasks.findIndex(t => t.id === tId);
    return sum + (idx >= 0 ? getTaskXp(mission, idx) : 0);
  }, 0);

  const hasActiveMissionElsewhere =
    user?.activeMission !== null && user?.activeMission !== mission.id;

  const handleAccept = () => {
    acceptMission(mission.id);
    toast.success("Mission acceptée ! 🎯", {
      description: `Rendez-vous sur l'onglet Tâches pour commencer.`
    });
  };

  const handleCompleteTask = (taskId: string, taskIndex: number, taskTitle: string) => {
    if (completing) return;
    setCompleting(taskId);
    const xp = getTaskXp(mission, taskIndex);
    setTimeout(() => {
      completeMissionTask(mission.id, taskId, xp);
      setCompleting(null);
      toast.success(`+${xp} XP — Tâche complétée ! 💪`, { description: taskTitle });
    }, 700);
  };

  const handleSubmit = () => {
    if (!submitText.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      submitMission(mission.id, submitText);
      setSubmitting(false);
      onClose();
      toast.success("Mission soumise ! 🏆", {
        description: `"${mission.title}" ajouté à votre portfolio.`
      });
    }, 1000);
  };

  return (
    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
            {mission.companyType}
          </span>
          {isCompleted && (
            <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
              ✓ Terminée
            </span>
          )}
          {isActive && !isCompleted && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              ● Active
            </span>
          )}
        </div>
        <DialogTitle className="text-xl font-display leading-tight">
          {mission.title}
        </DialogTitle>
        <DialogDescription className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1"><Building2 size={12} /> {mission.company}</span>
          <span className="flex items-center gap-1"><MapPin size={12} /> {mission.location}</span>
          <span className="flex items-center gap-1"><Clock size={12} /> {mission.deadline}</span>
          <span className="flex items-center gap-1 font-bold text-primary"><Zap size={12} /> {mission.xp} XP</span>
        </DialogDescription>
      </DialogHeader>

      {isActive && !isCompleted ? (
        <Tabs defaultValue="tasks" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="brief" className="flex-1">
              <FileText size={14} className="mr-1.5" /> Brief
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex-1">
              <Target size={14} className="mr-1.5" /> Tâches
            </TabsTrigger>
          </TabsList>

          {/* ── Brief tab ── */}
          <TabsContent value="brief" className="space-y-4 mt-4">
            <BriefContent mission={mission} />
          </TabsContent>

          {/* ── Tasks tab ── */}
          <TabsContent value="tasks" className="mt-4 space-y-4">
            {/* Progress */}
            <div className="rounded-xl bg-muted/40 border border-border p-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  {completedTasks.length}/{mission.tasks.length} tâches complétées
                </span>
                <span className="font-bold text-primary flex items-center gap-1">
                  <Zap size={13} /> {xpEarned}/{mission.xp} XP
                </span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>

            {/* Task list */}
            <div className="space-y-2">
              {mission.tasks.map((task, index) => {
                const isDone = completedTasks.includes(task.id);
                const isBeingDone = completing === task.id;
                const taskXp = getTaskXp(mission, index);
                return (
                  <div
                    key={task.id}
                    className={`rounded-xl border p-4 transition-colors ${
                      isDone
                        ? "bg-green-500/5 border-green-500/20"
                        : "bg-background border-border"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 mt-0.5">
                        {isDone ? (
                          <CheckCircle size={18} className="text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-border flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {index + 1}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold leading-tight ${isDone ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </p>
                        {!isDone && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        <span className="text-xs font-bold text-primary mt-1 inline-block">
                          +{taskXp} XP
                        </span>
                      </div>
                      {!isDone && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="shrink-0 h-8 px-3 text-xs"
                          onClick={() => handleCompleteTask(task.id, index, task.title)}
                          disabled={isBeingDone || !!completing}
                        >
                          {isBeingDone ? (
                            <span className="animate-pulse">...</span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <PlayCircle size={12} /> Fait
                            </span>
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submission zone */}
            {allTasksDone && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3"
              >
                <p className="text-sm font-semibold flex items-center gap-2">
                  <Send size={15} className="text-primary" />
                  Toutes les tâches sont complétées — soumettez votre travail !
                </p>
                <Textarea
                  placeholder="Décrivez ce que vous avez réalisé, partagez un lien (Facebook, Drive, Canva…) ou joignez toute preuve de votre travail."
                  value={submitText}
                  onChange={e => setSubmitText(e.target.value)}
                  className="min-h-[90px] text-sm"
                />
                <Button
                  className="w-full gradient-bg border-0"
                  onClick={handleSubmit}
                  disabled={!submitText.trim() || submitting}
                >
                  {submitting ? "Envoi en cours..." : "Soumettre mon travail 🚀"}
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      ) : isCompleted ? (
        /* ── Completed view ── */
        <div className="mt-4 space-y-4">
          <div className="rounded-xl bg-green-500/10 border border-green-500/20 p-4 flex items-center gap-3">
            <CheckCircle size={24} className="text-green-500 shrink-0" />
            <div>
              <p className="font-semibold text-green-700">Mission terminée avec succès</p>
              <p className="text-sm text-muted-foreground">+{mission.xp} XP ajoutés à votre portfolio</p>
            </div>
          </div>
          {user?.missionSubmissions?.[mission.id] && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Votre livrable soumis</p>
              <p className="text-sm bg-muted/50 rounded-lg p-3 border border-border">
                {user.missionSubmissions[mission.id]}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ── Brief + Accept view ── */
        <div className="mt-4 space-y-4">
          <BriefContent mission={mission} />
          {hasActiveMissionElsewhere ? (
            <div className="rounded-xl bg-muted/50 border border-border p-3 text-sm text-muted-foreground text-center">
              Terminez votre mission en cours avant d'en accepter une nouvelle.
            </div>
          ) : (
            <Button className="w-full gradient-bg border-0" onClick={handleAccept}>
              <Target size={16} className="mr-2" /> Accepter cette mission
            </Button>
          )}
        </div>
      )}
    </DialogContent>
  );
};

/* ── Brief content (shared) ─────────────────────────────────────── */
const BriefContent = ({ mission }: { mission: Mission }) => (
  <div className="space-y-4">
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <Building2 size={12} /> Contexte
      </p>
      <p className="text-sm text-foreground leading-relaxed">{mission.context}</p>
    </div>
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <Target size={12} /> Objectif
      </p>
      <p className="text-sm text-foreground leading-relaxed">{mission.objective}</p>
    </div>
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <Wrench size={12} /> Outils suggérés
      </p>
      <div className="flex flex-wrap gap-2">
        {mission.tools.map(tool => (
          <span key={tool} className="text-xs bg-muted border border-border px-2.5 py-1 rounded-full">
            {tool}
          </span>
        ))}
      </div>
    </div>
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
        <ChevronRight size={12} /> Livrables attendus ({mission.tasks.length} tâches)
      </p>
      <div className="space-y-1">
        {mission.tasks.map((task, i) => (
          <div key={task.id} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="w-4 h-4 rounded-full bg-muted border border-border flex items-center justify-center text-xs font-bold shrink-0">
              {i + 1}
            </span>
            {task.title}
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ── Main page ───────────────────────────────────────────────────── */
const Missions = () => {
  const { user } = useUser();
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  const getStatus = (mission: Mission) => {
    if (user?.completedMissions?.includes(mission.id)) return "completed";
    if (user?.activeMission === mission.id) return "active";
    return "open";
  };

  const completedTasks = (missionId: string) =>
    user?.completedMissionTasks?.[missionId]?.length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Marché de <span className="gradient-text">Missions</span>
            </h1>
            <p className="text-muted-foreground">
              Aidez de vraies entreprises locales et construisez votre portfolio professionnel.
            </p>
          </motion.div>

          <div className="space-y-4">
            {MISSIONS.map((mission, i) => {
              const status = getStatus(mission);
              const doneTasks = completedTasks(mission.id);
              const progressPct = (doneTasks / mission.tasks.length) * 100;

              return (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={`rounded-2xl border p-5 cursor-pointer hover:shadow-md transition-all ${
                    status === "active"
                      ? "border-primary/30 bg-primary/5"
                      : status === "completed"
                      ? "border-green-500/20 bg-green-500/5"
                      : "border-border bg-background"
                  }`}
                  onClick={() => setSelectedMission(mission)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Status badge */}
                      <div className="flex items-center gap-2 mb-2">
                        {status === "active" && (
                          <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                            ● Mission active
                          </span>
                        )}
                        {status === "completed" && (
                          <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full">
                            ✓ Terminée
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">{mission.companyType}</span>
                      </div>

                      <p className="text-xs font-semibold text-primary mb-1">{mission.company}</p>
                      <h3 className="font-display font-bold text-base mb-2 leading-tight">
                        {mission.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {mission.description}
                      </p>

                      {/* Skills */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {mission.skills.map(skill => (
                          <span key={skill} className="text-xs bg-muted px-2 py-0.5 rounded-full border border-border">
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Meta */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={11} /> {mission.location}</span>
                        <span className="flex items-center gap-1"><Clock size={11} /> {mission.deadline}</span>
                        <span className="flex items-center gap-1 font-bold text-primary text-sm">
                          <Zap size={13} /> {mission.xp} XP
                        </span>
                      </div>

                      {/* Progress bar if active */}
                      {status === "active" && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>{doneTasks}/{mission.tasks.length} tâches</span>
                            <span className="text-primary font-semibold">En cours</span>
                          </div>
                          <Progress value={progressPct} className="h-1.5" />
                        </div>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="shrink-0">
                      {status === "completed" ? (
                        <span className="flex items-center gap-1 text-sm text-green-600 font-semibold whitespace-nowrap">
                          <CheckCircle size={15} /> Terminée
                        </span>
                      ) : status === "active" ? (
                        <Button size="sm" className="gradient-bg border-0 whitespace-nowrap">
                          Continuer <ChevronRight size={14} className="ml-1" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          Voir le brief
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      <Dialog open={!!selectedMission} onOpenChange={open => { if (!open) setSelectedMission(null); }}>
        {selectedMission && (
          <MissionDialog mission={selectedMission} onClose={() => setSelectedMission(null)} />
        )}
      </Dialog>
    </div>
  );
};

export default Missions;
