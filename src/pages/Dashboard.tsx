import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight, Briefcase, GraduationCap, Medal, Flame, BarChart3, MapPin, Clock, Lightbulb, Trophy, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import AppNavbar from "@/components/AppNavbar";
import { useUser } from "@/hooks/useUser";
import { COURSES, MISSIONS, BADGES } from "@/data/mockData";

const Dashboard = () => {
  const { user, level, xpProgress, xpToNextLevel } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/waitlist");
  }, [user, navigate]);

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const activeMission = MISSIONS.find(m => m.id === user.activeMission);
  const earnedBadges = BADGES.filter(b => user.badges.includes(b.id));
  const recommendedCourses = COURSES.filter(c => !user.completedCourses.includes(c.id)).slice(0, 3);

  const stats = [
    { label: "XP Total", value: user.xp, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Niveau", value: level, icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
    { label: "Cours complétés", value: user.completedCourses.length, icon: GraduationCap, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Missions faites", value: user.completedMissions?.length ?? 0, icon: Medal, color: "text-amber-500", bg: "bg-amber-500/10" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppNavbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-6xl mx-auto space-y-8">

          {/* Welcome */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Bonjour, <span className="gradient-text">{firstName}</span> 👋
            </h1>
            <p className="text-muted-foreground mt-1">
              {user.completedCourses.length === 0
                ? "Bienvenue ! Commencez votre premier cours pour gagner des XP."
                : `Vous avez complété ${user.completedCourses.length} cours et gagné ${user.xp} XP. Continuez !`}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="rounded-2xl border border-border bg-background p-5 flex items-center gap-4">
                <div className={`${bg} p-3 rounded-xl shrink-0`}>
                  <Icon size={20} className={color} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground leading-tight mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* XP Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-border bg-background p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">Progression vers le Niveau {level + 1}</p>
                <p className="text-sm text-muted-foreground">
                  Plus que <span className="text-primary font-bold">{xpToNextLevel} XP</span> pour passer au niveau suivant
                </p>
              </div>
              <span className="text-2xl font-bold gradient-text">Niv. {level}</span>
            </div>
            <Progress value={xpProgress} className="h-3" />
          </motion.div>

          {/* Active Mission */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
              <Briefcase size={20} className="text-primary" /> Mission Active
            </h2>
            {activeMission ? (
              <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{activeMission.company}</p>
                    <h3 className="font-display font-bold text-lg mb-2">{activeMission.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{activeMission.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {activeMission.skills.map(s => (
                        <span key={s} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-bold gradient-text">+{activeMission.xp} XP</div>
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-1">
                      <Clock size={12} /> {activeMission.deadline}
                    </div>
                    <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground mt-1">
                      <MapPin size={12} /> {activeMission.location}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
                <Target size={40} className="text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-semibold mb-1">Aucune mission active</p>
                <p className="text-sm text-muted-foreground mb-4">Explorez le marché et aidez une entreprise locale.</p>
                <Link to="/missions">
                  <Button className="gradient-bg border-0">
                    Explorer les missions <ArrowRight className="ml-2" size={16} />
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Recommended Courses */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg flex items-center gap-2">
                <Lightbulb size={20} className="text-primary" /> Cours Recommandés
              </h2>
              <Link to="/courses" className="text-sm text-primary hover:underline flex items-center gap-1">
                Voir tous <ArrowRight size={14} />
              </Link>
            </div>
            {recommendedCourses.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {recommendedCourses.map(course => (
                  <Link key={course.id} to="/courses">
                    <div className={`rounded-2xl border bg-gradient-to-br ${course.gradient} p-5 hover:shadow-md transition-shadow h-full flex flex-col`}>
                      <div className="text-3xl mb-3">{course.emoji}</div>
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3 flex-1 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{course.duration} · {course.moduleList.length} modules</span>
                        <span className="font-bold text-primary">+{course.xp} XP</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-muted/30 p-6 text-center">
                <p className="font-semibold">Tous les cours sont complétés !</p>
                <p className="text-sm text-muted-foreground mt-1">Félicitations, vous avez terminé le catalogue disponible.</p>
              </div>
            )}
          </motion.div>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h2 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                <Trophy size={20} className="text-primary" /> Badges Gagnés
              </h2>
              <div className="flex flex-wrap gap-3">
                {earnedBadges.map(badge => (
                  <div key={badge.id} className="flex items-center gap-2 bg-muted/50 border border-border rounded-xl px-4 py-2.5">
                    <span className="text-xl">{badge.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold leading-none">{badge.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
