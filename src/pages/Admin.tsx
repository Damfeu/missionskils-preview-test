import { useEffect, useState } from "react";
import { Lock, CheckCircle, XCircle, Circle, Paperclip, RefreshCw, Building2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase, ADMIN_PASSCODE } from "@/lib/supabase";
import { COURSES, MISSIONS, CompanyMissionRow, companyMissionToMission } from "@/data/mockData";

interface ProfileRow {
  id: string;
  name: string;
  email: string;
  profile: string;
  xp: number;
  created_at: string;
}

interface CourseProgressRow {
  profile_id: string;
  course_id: string;
  completed_modules: string[];
  course_completed: boolean;
  quiz_passed: boolean;
  quiz_score: number | null;
  quiz_attempts: number;
}

interface MissionProgressRow {
  profile_id: string;
  mission_id: string;
  status: string;
  completed_tasks: string[];
  submission_text: string | null;
  submission_file_url: string | null;
  submission_file_name: string | null;
  submitted_at: string | null;
}

interface CompanyMissionFull extends CompanyMissionRow {
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
}

const StepIcon = ({ state }: { state: "done" | "partial" | "none" }) => {
  if (state === "done") return <CheckCircle size={15} className="text-green-500 shrink-0" />;
  if (state === "partial") return <Circle size={15} className="text-amber-500 shrink-0" />;
  return <XCircle size={15} className="text-muted-foreground/40 shrink-0" />;
};

const Admin = () => {
  const [authed, setAuthed] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [courseProgress, setCourseProgress] = useState<CourseProgressRow[]>([]);
  const [missionProgress, setMissionProgress] = useState<MissionProgressRow[]>([]);
  const [companyMissions, setCompanyMissions] = useState<CompanyMissionFull[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [{ data: p }, { data: cp }, { data: mp }, { data: cm }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: true }),
      supabase.from("course_progress").select("*"),
      supabase.from("mission_progress").select("*"),
      supabase.from("company_missions").select("*").order("created_at", { ascending: false })
    ]);
    setProfiles((p as ProfileRow[]) ?? []);
    setCourseProgress((cp as CourseProgressRow[]) ?? []);
    setMissionProgress((mp as MissionProgressRow[]) ?? []);
    setCompanyMissions((cm as CompanyMissionFull[]) ?? []);
    setLoading(false);
  };

  const allMissionsForLookup = [
    ...MISSIONS,
    ...companyMissions.filter(m => m.status === "approved").map(companyMissionToMission)
  ];

  const approveCompanyMission = async (row: CompanyMissionFull, requiredCourseId: string, xp: number) => {
    await supabase.from("company_missions").update({
      status: "approved",
      required_course_id: requiredCourseId,
      xp,
      reviewed_at: new Date().toISOString()
    }).eq("id", row.id);
    await loadData();
  };

  const rejectCompanyMission = async (row: CompanyMissionFull, notes: string) => {
    await supabase.from("company_missions").update({
      status: "rejected",
      admin_notes: notes || null,
      reviewed_at: new Date().toISOString()
    }).eq("id", row.id);
    await loadData();
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (ADMIN_PASSCODE && passInput === ADMIN_PASSCODE) {
      setAuthed(true);
      setAuthError("");
    } else {
      setAuthError("Code incorrect.");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <form onSubmit={handleAuth} className="w-full max-w-sm p-8 rounded-2xl border border-border bg-background shadow-lg space-y-4">
          <div className="flex items-center gap-2 justify-center text-primary">
            <Lock size={20} />
            <h1 className="font-display font-bold text-lg">Accès équipe</h1>
          </div>
          <Input
            type="password"
            placeholder="Code d'accès"
            value={passInput}
            onChange={e => setPassInput(e.target.value)}
            autoFocus
          />
          {authError && <p className="text-sm text-destructive text-center">{authError}</p>}
          <Button type="submit" className="w-full gradient-bg border-0">Entrer</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="pt-10 pb-16 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-2xl font-bold">Suivi des testeurs</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {profiles.length} testeur{profiles.length !== 1 ? "s" : ""} inscrit{profiles.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading}>
              <RefreshCw size={14} className={`mr-1.5 ${loading ? "animate-spin" : ""}`} /> Actualiser
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="p-3">Testeur</th>
                  <th className="p-3">Profil</th>
                  <th className="p-3">Cours (quiz)</th>
                  <th className="p-3">Mission</th>
                  <th className="p-3">Livrable</th>
                  <th className="p-3">XP</th>
                </tr>
              </thead>
              <tbody>
                {profiles.map(profile => {
                  const myCourses = courseProgress.filter(c => c.profile_id === profile.id);
                  const myMissions = missionProgress.filter(m => m.profile_id === profile.id);

                  return (
                    <tr key={profile.id} className="border-t border-border align-top">
                      <td className="p-3">
                        <p className="font-semibold">{profile.name}</p>
                        <p className="text-xs text-muted-foreground">{profile.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                        </p>
                      </td>
                      <td className="p-3">{profile.profile}</td>
                      <td className="p-3 space-y-1.5">
                        {myCourses.length === 0 && (
                          <span className="text-xs text-muted-foreground">Aucun cours démarré</span>
                        )}
                        {myCourses.map(cp => {
                          const course = COURSES.find(c => c.id === cp.course_id);
                          const totalModules = course?.moduleList.length ?? 0;
                          const state: "done" | "partial" | "none" = cp.quiz_passed
                            ? "done"
                            : cp.completed_modules.length > 0
                            ? "partial"
                            : "none";
                          return (
                            <div key={cp.course_id} className="flex items-center gap-1.5">
                              <StepIcon state={state} />
                              <span className="text-xs">
                                {course?.title ?? cp.course_id} — {cp.completed_modules.length}/{totalModules} modules
                                {cp.quiz_score !== null && (
                                  <> · quiz {cp.quiz_score}% {cp.quiz_passed ? "✅" : "❌"}</>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </td>
                      <td className="p-3 space-y-2">
                        {myMissions.length === 0 && (
                          <span className="text-xs text-muted-foreground">Aucune mission</span>
                        )}
                        {myMissions.map(mp => {
                          const mission = allMissionsForLookup.find(m => m.id === mp.mission_id);
                          if (!mission) return null;
                          return (
                            <div key={mp.mission_id}>
                              <p className="text-xs font-semibold">{mission.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {mp.status === "submitted" ? "✅ Déposée" : "🎯 Acceptée"} ·{" "}
                                {mp.completed_tasks.length}/{mission.tasks.length} tâches
                              </p>
                            </div>
                          );
                        })}
                      </td>
                      <td className="p-3 space-y-2">
                        {myMissions.filter(mp => mp.status === "submitted").length === 0 && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                        {myMissions.filter(mp => mp.status === "submitted").map(mp => (
                          <div key={mp.mission_id} className="space-y-1">
                            {mp.submission_text && (
                              <p className="text-xs max-w-[220px] line-clamp-3">{mp.submission_text}</p>
                            )}
                            {mp.submission_file_url && (
                              <a
                                href={mp.submission_file_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary hover:underline flex items-center gap-1"
                              >
                                <Paperclip size={11} /> {mp.submission_file_name ?? "fichier"}
                              </a>
                            )}
                          </div>
                        ))}
                      </td>
                      <td className="p-3 font-semibold text-primary">{profile.xp}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* ── Missions entreprises à valider ── */}
          <div className="mt-12">
            <h2 className="font-display text-xl font-bold mb-1 flex items-center gap-2">
              <Building2 size={20} className="text-primary" /> Missions proposées par des entreprises
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Validez une mission pour qu'elle apparaisse dans le marché de missions des apprenants.
            </p>

            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">
                  En attente ({companyMissions.filter(m => m.status === "pending").length})
                </TabsTrigger>
                <TabsTrigger value="approved">
                  Approuvées ({companyMissions.filter(m => m.status === "approved").length})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejetées ({companyMissions.filter(m => m.status === "rejected").length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4 mt-4">
                {companyMissions.filter(m => m.status === "pending").length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune mission en attente.</p>
                )}
                {companyMissions.filter(m => m.status === "pending").map(row => (
                  <PendingMissionCard
                    key={row.id}
                    row={row}
                    onApprove={approveCompanyMission}
                    onReject={rejectCompanyMission}
                  />
                ))}
              </TabsContent>

              <TabsContent value="approved" className="space-y-3 mt-4">
                {companyMissions.filter(m => m.status === "approved").length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune mission approuvée.</p>
                )}
                {companyMissions.filter(m => m.status === "approved").map(row => {
                  const course = COURSES.find(c => c.id === row.required_course_id);
                  return (
                    <div key={row.id} className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-sm">{row.title}</p>
                        <p className="text-xs text-muted-foreground">{row.company_name} · {row.contact_email}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Cours requis : {course?.title ?? row.required_course_id} · {row.xp} XP
                        </p>
                      </div>
                      <span className="text-xs font-semibold text-green-600 shrink-0">✓ Publiée</span>
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="rejected" className="space-y-3 mt-4">
                {companyMissions.filter(m => m.status === "rejected").length === 0 && (
                  <p className="text-sm text-muted-foreground">Aucune mission rejetée.</p>
                )}
                {companyMissions.filter(m => m.status === "rejected").map(row => (
                  <div key={row.id} className="rounded-xl border border-border bg-muted/20 p-4">
                    <p className="font-semibold text-sm">{row.title}</p>
                    <p className="text-xs text-muted-foreground">{row.company_name} · {row.contact_email}</p>
                    {row.admin_notes && (
                      <p className="text-xs text-muted-foreground mt-1">Motif : {row.admin_notes}</p>
                    )}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

const PendingMissionCard = ({
  row,
  onApprove,
  onReject
}: {
  row: CompanyMissionFull;
  onApprove: (row: CompanyMissionFull, requiredCourseId: string, xp: number) => Promise<void>;
  onReject: (row: CompanyMissionFull, notes: string) => Promise<void>;
}) => {
  const suggestedXp = Math.max(100, row.tasks.length * 50);
  const [courseId, setCourseId] = useState("");
  const [xp, setXp] = useState(suggestedXp);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const handleApprove = async () => {
    if (!courseId) return;
    setBusy(true);
    await onApprove(row, courseId, xp);
    setBusy(false);
  };

  const handleReject = async () => {
    setBusy(true);
    await onReject(row, notes);
    setBusy(false);
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-sm">{row.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.company_name} {row.company_type && `· ${row.company_type}`} · {row.contact_email}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{row.location} · {row.deadline}</p>
        </div>
        <span className="text-xs font-semibold text-amber-600 shrink-0">En attente</span>
      </div>

      <p className="text-sm">{row.description}</p>

      <details className="text-xs text-muted-foreground">
        <summary className="cursor-pointer font-semibold text-foreground">Voir le détail complet</summary>
        <div className="mt-2 space-y-2">
          <p><span className="font-semibold text-foreground">Contexte :</span> {row.context}</p>
          <p><span className="font-semibold text-foreground">Objectif :</span> {row.objective}</p>
          {row.tools.length > 0 && <p><span className="font-semibold text-foreground">Outils :</span> {row.tools.join(", ")}</p>}
          {row.skills.length > 0 && <p><span className="font-semibold text-foreground">Compétences :</span> {row.skills.join(", ")}</p>}
          <div>
            <span className="font-semibold text-foreground">Tâches :</span>
            <ul className="list-disc list-inside mt-1">
              {row.tasks.map((t, i) => (
                <li key={i}>{t.title}{t.description ? ` — ${t.description}` : ""}</li>
              ))}
            </ul>
          </div>
          {row.resource_file_url && (
            <a href={row.resource_file_url} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-1">
              <Paperclip size={11} /> {row.resource_file_name ?? "fichier joint"}
            </a>
          )}
        </div>
      </details>

      <div className="grid sm:grid-cols-2 gap-3 pt-2 border-t border-border/60">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Cours requis pour débloquer *</label>
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="mt-1 w-full h-9 rounded-md border border-input bg-background px-2 text-sm"
          >
            <option value="">— Choisir —</option>
            {COURSES.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">XP attribués</label>
          <Input type="number" min={0} value={xp} onChange={e => setXp(Number(e.target.value))} className="mt-1 h-9" />
        </div>
      </div>

      <Textarea
        placeholder="Motif de rejet (optionnel, visible en interne uniquement)"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        className="text-xs min-h-[50px]"
      />

      <div className="flex gap-2">
        <Button size="sm" className="flex-1 gradient-bg border-0" onClick={handleApprove} disabled={!courseId || busy}>
          <Check size={14} className="mr-1.5" /> Approuver et publier
        </Button>
        <Button size="sm" variant="outline" className="flex-1" onClick={handleReject} disabled={busy}>
          <X size={14} className="mr-1.5" /> Rejeter
        </Button>
      </div>
    </div>
  );
};

export default Admin;
