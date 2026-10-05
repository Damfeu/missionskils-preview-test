import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, Clock, CheckCircle, XCircle, ArrowRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import CompanyNavbar from "@/components/CompanyNavbar";
import { supabase } from "@/lib/supabase";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";

interface MyMissionRow {
  id: string;
  title: string;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  created_at: string;
}

const statusBadge = (status: MyMissionRow["status"]) => {
  if (status === "approved") {
    return <span className="text-xs font-semibold text-green-600 bg-green-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><CheckCircle size={11} /> Publiée</span>;
  }
  if (status === "rejected") {
    return <span className="text-xs font-semibold text-red-600 bg-red-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><XCircle size={11} /> Rejetée</span>;
  }
  return <span className="text-xs font-semibold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><Clock size={11} /> En attente</span>;
};

const CompanyDashboard = () => {
  const { company, loading } = useCompanyAuth();
  const navigate = useNavigate();
  const [missions, setMissions] = useState<MyMissionRow[]>([]);
  const [loadingMissions, setLoadingMissions] = useState(true);

  useEffect(() => {
    if (!loading && !company) {
      navigate("/entreprise/connexion");
    }
  }, [loading, company, navigate]);

  useEffect(() => {
    if (!company) return;
    supabase
      .from("company_missions")
      .select("id, title, status, admin_notes, created_at")
      .eq("company_id", company.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setMissions((data as MyMissionRow[]) ?? []);
        setLoadingMissions(false);
      });
  }, [company]);

  if (loading || !company) return null;

  const pendingCount = missions.filter(m => m.status === "pending").length;
  const approvedCount = missions.filter(m => m.status === "approved").length;
  const rejectedCount = missions.filter(m => m.status === "rejected").length;

  const stats = [
    { label: "En attente", value: pendingCount, color: "text-amber-600", bg: "bg-amber-500/10" },
    { label: "Publiées", value: approvedCount, color: "text-green-600", bg: "bg-green-500/10" },
    { label: "Rejetées", value: rejectedCount, color: "text-red-600", bg: "bg-red-500/10" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <CompanyNavbar />
      <main className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-bold">
                Bonjour, <span className="text-primary">{company.companyName}</span> 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Suivez le statut de vos missions et proposez-en de nouvelles aux apprenants.
              </p>
            </div>
            <Link to="/poster-une-mission">
              <Button className="gradient-bg border-0">
                <Send size={16} className="mr-2" /> Proposer une mission
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            {stats.map(s => (
              <div key={s.label} className="rounded-2xl border border-border bg-background p-5 text-center">
                <div className={`${s.bg} ${s.color} w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 font-bold`}>
                  {s.value}
                </div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <h2 className="font-display font-bold text-lg mb-4">Mes missions</h2>

            {loadingMissions ? (
              <p className="text-sm text-muted-foreground">Chargement...</p>
            ) : missions.length === 0 ? (
              <div className="rounded-2xl border border-border bg-muted/30 p-10 text-center">
                <Briefcase size={36} className="text-muted-foreground/40 mx-auto mb-3" />
                <p className="font-semibold mb-1">Aucune mission proposée pour le moment</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Décrivez un besoin réel de votre entreprise pour qu'un apprenant puisse vous aider.
                </p>
                <Link to="/poster-une-mission">
                  <Button className="gradient-bg border-0">
                    Proposer ma première mission <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {missions.map(m => (
                  <div key={m.id} className="rounded-xl border border-border p-4 flex items-start justify-between gap-3 bg-background">
                    <div>
                      <p className="text-sm font-semibold">{m.title}</p>
                      {m.status === "rejected" && m.admin_notes && (
                        <p className="text-xs text-muted-foreground mt-1">Motif : {m.admin_notes}</p>
                      )}
                    </div>
                    {statusBadge(m.status)}
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CompanyDashboard;
