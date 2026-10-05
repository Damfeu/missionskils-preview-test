import { useState, useCallback, useEffect, createContext, useContext, ReactNode, createElement } from "react";
import { supabase } from "@/lib/supabase";

export interface QuizResult {
  passed: boolean;
  score: number;
  attempts: number;
}

export interface MissionSubmission {
  text?: string;
  fileUrl?: string;
  fileName?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  profile: string;
  xp: number;
  completedCourses: string[]; // cours dont le quiz est réussi
  completedModules: Record<string, string[]>;
  quizResults: Record<string, QuizResult>;
  activeMission: string | null;
  completedMissions: string[];
  completedMissionTasks: Record<string, string[]>;
  missionSubmissions: Record<string, MissionSubmission>;
  badges: string[];
}

async function loadUser(profileId: string): Promise<UserProfile | null> {
  const { data: profileRow, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .maybeSingle();

  if (profileError || !profileRow) return null;

  const { data: courseRows } = await supabase
    .from("course_progress")
    .select("*")
    .eq("profile_id", profileId);

  const { data: missionRows } = await supabase
    .from("mission_progress")
    .select("*")
    .eq("profile_id", profileId);

  const completedModules: Record<string, string[]> = {};
  const quizResults: Record<string, QuizResult> = {};
  const completedCourses: string[] = [];

  (courseRows ?? []).forEach(row => {
    completedModules[row.course_id] = row.completed_modules ?? [];
    quizResults[row.course_id] = {
      passed: row.quiz_passed,
      score: row.quiz_score ?? 0,
      attempts: row.quiz_attempts ?? 0
    };
    if (row.course_completed) completedCourses.push(row.course_id);
  });

  const completedMissionTasks: Record<string, string[]> = {};
  const missionSubmissions: Record<string, MissionSubmission> = {};
  const completedMissions: string[] = [];
  let activeMission: string | null = null;

  (missionRows ?? []).forEach(row => {
    completedMissionTasks[row.mission_id] = row.completed_tasks ?? [];
    if (row.status === "submitted") {
      completedMissions.push(row.mission_id);
      missionSubmissions[row.mission_id] = {
        text: row.submission_text ?? undefined,
        fileUrl: row.submission_file_url ?? undefined,
        fileName: row.submission_file_name ?? undefined
      };
    } else if (row.status === "active") {
      activeMission = row.mission_id;
    }
  });

  return {
    id: profileRow.id,
    name: profileRow.name,
    email: profileRow.email,
    profile: profileRow.profile,
    xp: profileRow.xp,
    badges: profileRow.badges ?? [],
    completedModules,
    quizResults,
    completedCourses,
    activeMission,
    completedMissions,
    completedMissionTasks,
    missionSubmissions
  };
}

function useUserState() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(async ({ data }) => {
      const uid = data.session?.user.id;
      const u = uid ? await loadUser(uid) : null;
      if (active) {
        setUser(u);
        setLoading(false);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const uid = session?.user.id;
      const u = uid ? await loadUser(uid) : null;
      if (active) setUser(u);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const refresh = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    const uid = data.session?.user.id;
    if (!uid) return;
    const u = await loadUser(uid);
    setUser(u);
  }, []);

  const register = useCallback(async (name: string, email: string, profile: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    const uid = data.user?.id;
    if (!uid) throw new Error("Inscription impossible : aucune session créée.");

    const { error: insertError } = await supabase.from("profiles").insert({
      id: uid, name, email, profile, xp: 0, badges: ["first-step"]
    });
    if (insertError) throw insertError;

    const newUser: UserProfile = {
      id: uid, name, email, profile, xp: 0,
      completedCourses: [], completedModules: {}, quizResults: {},
      activeMission: null, completedMissions: [], completedMissionTasks: {},
      missionSubmissions: {}, badges: ["first-step"]
    };
    setUser(newUser);
    return newUser;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    const uid = data.user.id;
    const u = await loadUser(uid);
    if (!u) {
      await supabase.auth.signOut();
      throw new Error("Ce compte n'est pas un compte apprenant. Utilisez la connexion entreprise.");
    }
    setUser(u);
    return u;
  }, []);

  const addBadgeAndXp = useCallback(async (profileId: string, xpDelta: number, badgesToAdd: string[]) => {
    setUser(prev => {
      if (!prev) return prev;
      const newXp = prev.xp + xpDelta;
      const newBadges = [...prev.badges];
      badgesToAdd.forEach(b => { if (!newBadges.includes(b)) newBadges.push(b); });
      if (newXp >= 100 && !newBadges.includes("xp-100")) newBadges.push("xp-100");
      if (newXp >= 500 && !newBadges.includes("xp-500")) newBadges.push("xp-500");
      supabase.from("profiles").update({ xp: newXp, badges: newBadges }).eq("id", profileId);
      return { ...prev, xp: newXp, badges: newBadges };
    });
  }, []);

  const completeModule = useCallback(
    async (courseId: string, moduleId: string, xp: number) => {
      if (!user) return;
      const done = user.completedModules[courseId] ?? [];
      if (done.includes(moduleId)) return;
      const newDone = [...done, moduleId];

      setUser(prev => prev ? {
        ...prev,
        completedModules: { ...prev.completedModules, [courseId]: newDone }
      } : prev);

      await supabase.from("course_progress").upsert({
        profile_id: user.id,
        course_id: courseId,
        completed_modules: newDone
      }, { onConflict: "profile_id,course_id" });

      await addBadgeAndXp(user.id, xp, []);
    },
    [user, addBadgeAndXp]
  );

  const submitQuiz = useCallback(
    async (courseId: string, score: number, passingScore: number): Promise<boolean> => {
      if (!user) return false;
      const passed = score >= passingScore;
      const prevAttempts = user.quizResults[courseId]?.attempts ?? 0;
      const wasAlreadyPassed = user.quizResults[courseId]?.passed ?? false;

      setUser(prev => prev ? {
        ...prev,
        quizResults: { ...prev.quizResults, [courseId]: { passed, score, attempts: prevAttempts + 1 } },
        completedCourses: passed && !prev.completedCourses.includes(courseId)
          ? [...prev.completedCourses, courseId]
          : prev.completedCourses
      } : prev);

      await supabase.from("course_progress").upsert({
        profile_id: user.id,
        course_id: courseId,
        quiz_score: score,
        quiz_passed: passed,
        quiz_attempts: prevAttempts + 1,
        course_completed: passed
      }, { onConflict: "profile_id,course_id" });

      if (passed && !wasAlreadyPassed) {
        const badges: string[] = ["active-learner"];
        if (!user.badges.includes("quiz-master")) badges.push("quiz-master");
        if (courseId === "marketing-digital") badges.push("digital-marketer");
        if (courseId === "design-canva") badges.push("creative");
        if (courseId === "analyse-donnees") badges.push("data-analyst");
        if (courseId === "wordpress" || courseId === "html-css") badges.push("web-builder");
        if (courseId === "app-mobile-nocode") badges.push("app-maker");
        await addBadgeAndXp(user.id, 0, badges);
      }

      return passed;
    },
    [user, addBadgeAndXp]
  );

  const acceptMission = useCallback(async (missionId: string) => {
    if (!user) return;
    setUser(prev => prev ? { ...prev, activeMission: missionId } : prev);
    await supabase.from("mission_progress").upsert({
      profile_id: user.id,
      mission_id: missionId,
      status: "active"
    }, { onConflict: "profile_id,mission_id" });
    await addBadgeAndXp(user.id, 0, ["missionnaire"]);
  }, [user, addBadgeAndXp]);

  const completeMissionTask = useCallback(
    async (missionId: string, taskId: string, xp: number) => {
      if (!user) return;
      const done = user.completedMissionTasks[missionId] ?? [];
      if (done.includes(taskId)) return;
      const newDone = [...done, taskId];

      setUser(prev => prev ? {
        ...prev,
        completedMissionTasks: { ...prev.completedMissionTasks, [missionId]: newDone }
      } : prev);

      await supabase.from("mission_progress").upsert({
        profile_id: user.id,
        mission_id: missionId,
        status: "active",
        completed_tasks: newDone
      }, { onConflict: "profile_id,mission_id" });

      await addBadgeAndXp(user.id, xp, []);
    },
    [user, addBadgeAndXp]
  );

  const submitMission = useCallback(async (missionId: string, text: string, file?: File) => {
    if (!user) return;
    let fileUrl: string | undefined;
    let fileName: string | undefined;

    if (file) {
      const path = `${missionId}/${user.id}-${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from("mission-files").upload(path, file);
      if (!uploadError) {
        const { data } = supabase.storage.from("mission-files").getPublicUrl(path);
        fileUrl = data.publicUrl;
        fileName = file.name;
      }
    }

    setUser(prev => prev ? {
      ...prev,
      activeMission: null,
      completedMissions: [...prev.completedMissions, missionId],
      missionSubmissions: { ...prev.missionSubmissions, [missionId]: { text, fileUrl, fileName } }
    } : prev);

    await supabase.from("mission_progress").upsert({
      profile_id: user.id,
      mission_id: missionId,
      status: "submitted",
      submission_text: text,
      submission_file_url: fileUrl ?? null,
      submission_file_name: fileName ?? null,
      submitted_at: new Date().toISOString()
    }, { onConflict: "profile_id,mission_id" });
  }, [user]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const level = user ? Math.floor(user.xp / 200) + 1 : 1;
  const xpInLevel = user ? user.xp % 200 : 0;
  const xpProgress = (xpInLevel / 200) * 100;
  const xpToNextLevel = 200 - xpInLevel;

  return {
    user, loading, register, login, completeModule, submitQuiz, acceptMission,
    completeMissionTask, submitMission, logout, refresh, level, xpProgress, xpToNextLevel
  };
}

type UserContextValue = ReturnType<typeof useUserState>;

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const value = useUserState();
  return createElement(UserContext.Provider, { value }, children);
}

// Une seule instance de useUserState() est créée par <UserProvider> (dans App.tsx) et
// partagée par toutes les pages/dialogues via ce hook, pour éviter que chaque composant
// refasse son propre appel réseau à Supabase (et évite les faux "verrouillé" temporaires
// pendant qu'un composant recharge ses données indépendamment d'un autre).
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser doit être utilisé à l'intérieur d'un <UserProvider>");
  }
  return ctx;
}
