import { useState, useCallback } from "react";

export interface UserProfile {
  name: string;
  email: string;
  profile: string;
  xp: number;
  completedCourses: string[];
  completedModules: Record<string, string[]>;
  activeMission: string | null;
  completedMissions: string[];
  completedMissionTasks: Record<string, string[]>;
  missionSubmissions: Record<string, string>;
  badges: string[];
}

const STORAGE_KEY = "missionskills_user";

export function useUser() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const p = JSON.parse(stored);
      if (!p.completedModules) p.completedModules = {};
      if (!p.completedMissions) p.completedMissions = [];
      if (!p.completedMissionTasks) p.completedMissionTasks = {};
      if (!p.missionSubmissions) p.missionSubmissions = {};
      return p;
    } catch {
      return null;
    }
  });

  const persist = (data: UserProfile) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setUser(data);
  };

  const register = useCallback((name: string, email: string, profile: string) => {
    const newUser: UserProfile = {
      name, email, profile,
      xp: 0,
      completedCourses: [],
      completedModules: {},
      activeMission: null,
      completedMissions: [],
      completedMissionTasks: {},
      missionSubmissions: {},
      badges: ["first-step"]
    };
    persist(newUser);
    return newUser;
  }, []);

  const completeModule = useCallback(
    (courseId: string, moduleId: string, xp: number, isLastModule: boolean) => {
      setUser(prev => {
        if (!prev) return null;
        const done = prev.completedModules[courseId] ?? [];
        if (done.includes(moduleId)) return prev;

        const newBadges = [...prev.badges];
        const addBadge = (id: string) => { if (!newBadges.includes(id)) newBadges.push(id); };

        const newXp = prev.xp + xp;
        if (newXp >= 100) addBadge("xp-100");
        if (newXp >= 500) addBadge("xp-500");

        const newCompletedModules = { ...prev.completedModules, [courseId]: [...done, moduleId] };
        let newCompletedCourses = [...prev.completedCourses];

        if (isLastModule && !newCompletedCourses.includes(courseId)) {
          newCompletedCourses.push(courseId);
          addBadge("active-learner");
          if (courseId === "marketing-digital") addBadge("digital-marketer");
          if (courseId === "design-canva") addBadge("creative");
          if (courseId === "analyse-donnees") addBadge("data-analyst");
          if (courseId === "wordpress" || courseId === "html-css") addBadge("web-builder");
          if (courseId === "app-mobile-nocode") addBadge("app-maker");
        }

        const updated = { ...prev, xp: newXp, completedModules: newCompletedModules, completedCourses: newCompletedCourses, badges: newBadges };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }, []
  );

  const acceptMission = useCallback((missionId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const newBadges = [...prev.badges];
      if (!newBadges.includes("missionnaire")) newBadges.push("missionnaire");
      const updated = { ...prev, activeMission: missionId, badges: newBadges };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const completeMissionTask = useCallback(
    (missionId: string, taskId: string, xp: number) => {
      setUser(prev => {
        if (!prev) return null;
        const done = prev.completedMissionTasks[missionId] ?? [];
        if (done.includes(taskId)) return prev;

        const newBadges = [...prev.badges];
        const newXp = prev.xp + xp;
        if (newXp >= 100 && !newBadges.includes("xp-100")) newBadges.push("xp-100");
        if (newXp >= 500 && !newBadges.includes("xp-500")) newBadges.push("xp-500");

        const updated = {
          ...prev,
          xp: newXp,
          badges: newBadges,
          completedMissionTasks: { ...prev.completedMissionTasks, [missionId]: [...done, taskId] }
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    }, []
  );

  const submitMission = useCallback((missionId: string, text: string) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        activeMission: null,
        completedMissions: [...prev.completedMissions, missionId],
        missionSubmissions: { ...prev.missionSubmissions, [missionId]: text }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const level = user ? Math.floor(user.xp / 200) + 1 : 1;
  const xpInLevel = user ? user.xp % 200 : 0;
  const xpProgress = (xpInLevel / 200) * 100;
  const xpToNextLevel = 200 - xpInLevel;

  return { user, register, completeModule, acceptMission, completeMissionTask, submitMission, logout, level, xpProgress, xpToNextLevel };
}
