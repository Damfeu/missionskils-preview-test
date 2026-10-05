import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanyNavbar from "@/components/CompanyNavbar";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Send, Plus, Trash2, ArrowLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";

interface TaskDraft {
  title: string;
  description: string;
}

const emptyTask = (): TaskDraft => ({ title: "", description: "" });

const PostMission = () => {
  const { company, loading } = useCompanyAuth();
  const navigate = useNavigate();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [context, setContext] = useState("");
  const [objective, setObjective] = useState("");
  const [tools, setTools] = useState("");
  const [skills, setSkills] = useState("");
  const [location, setLocation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");
  const [tasks, setTasks] = useState<TaskDraft[]>([emptyTask()]);
  const [file, setFile] = useState<File | null>(null);

  const updateTask = (index: number, field: keyof TaskDraft, value: string) => {
    setTasks(prev => prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)));
  };

  const addTask = () => setTasks(prev => [...prev, emptyTask()]);
  const removeTask = (index: number) => setTasks(prev => prev.filter((_, i) => i !== index));

  const validTasks = tasks.filter(t => t.title.trim());
  const canSubmit =
    !!company && title && description && context && objective &&
    location && deadline && validTasks.length > 0 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || !company) return;
    setSubmitting(true);
    setErrorMsg("");

    try {
      let resourceFileUrl: string | null = null;
      let resourceFileName: string | null = null;

      if (file) {
        const path = `company-submissions/${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage.from("mission-files").upload(path, file);
        if (!uploadError) {
          const { data } = supabase.storage.from("mission-files").getPublicUrl(path);
          resourceFileUrl = data.publicUrl;
          resourceFileName = file.name;
        }
      }

      const { error } = await supabase.from("company_missions").insert({
        company_id: company.id,
        company_name: company.companyName,
        company_type: company.companyType,
        contact_name: company.contactName,
        contact_email: company.contactEmail,
        title,
        description,
        context,
        objective,
        tools: tools.split(",").map(s => s.trim()).filter(Boolean),
        skills: skills.split(",").map(s => s.trim()).filter(Boolean),
        location,
        deadline,
        category,
        tasks: validTasks,
        status: "pending",
        resource_file_url: resourceFileUrl,
        resource_file_name: resourceFileName
      });

      if (error) throw error;
      setSubmitted(true);
    } catch {
      setErrorMsg("Impossible d'envoyer votre mission pour le moment. Vérifiez votre connexion et réessayez.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-28 pb-16 px-4 text-center text-muted-foreground">Chargement...</main>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-28 pb-20 px-4">
          <div className="container max-w-md mx-auto text-center p-10 rounded-2xl border border-border bg-muted/30">
            <h1 className="font-display text-2xl font-bold mb-3">Espace entreprise</h1>
            <p className="text-muted-foreground mb-6">
              Connectez-vous avec votre compte entreprise pour proposer une mission et suivre son statut.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/entreprise/connexion">
                <Button className="w-full gradient-bg border-0">Se connecter</Button>
              </Link>
              <Link to="/entreprise/inscription">
                <Button variant="outline" className="w-full">Créer un compte entreprise</Button>
              </Link>
            </div>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <CompanyNavbar />
        <main className="pt-28 pb-16 px-4">
          <div className="container max-w-md mx-auto text-center p-10 rounded-2xl border border-green-500/20 bg-green-500/5">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
            <h1 className="font-display text-xl font-bold mb-2">Mission envoyée pour validation</h1>
            <p className="text-muted-foreground mb-6">
              Notre équipe va l'examiner et vous recontacter avant sa publication sur la plateforme.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/entreprise/tableau-de-bord">
                <Button className="w-full gradient-bg border-0">Retour au tableau de bord</Button>
              </Link>
              <Button variant="outline" className="w-full" onClick={() => { setSubmitted(false); navigate(0); }}>
                Proposer une autre mission
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <CompanyNavbar />
      <section className="pt-24 pb-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <Link to="/entreprise/tableau-de-bord" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft size={14} /> Retour au tableau de bord
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold mb-2">
              Proposer une <span className="text-primary">mission</span>
            </h1>
            <p className="text-muted-foreground">
              Décrivez un besoin réel de votre entreprise. Notre équipe valide chaque mission avant
              qu'elle soit proposée aux apprenants.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6 p-8 rounded-2xl border border-border bg-background shadow-lg"
          >
            <div>
              <Label htmlFor="title">Titre de la mission *</Label>
              <Input id="title" placeholder="Ex: Créer une page Facebook professionnelle" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1" />
            </div>

            <div>
              <Label htmlFor="description">Résumé en une phrase *</Label>
              <Textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 min-h-[70px]" />
            </div>

            <div>
              <Label htmlFor="context">Contexte de l'entreprise *</Label>
              <Textarea id="context" placeholder="Quelle est votre situation actuelle ?" value={context} onChange={e => setContext(e.target.value)} required className="mt-1 min-h-[90px]" />
            </div>

            <div>
              <Label htmlFor="objective">Objectif de la mission *</Label>
              <Textarea id="objective" placeholder="Qu'attendez-vous concrètement à la fin de la mission ?" value={objective} onChange={e => setObjective(e.target.value)} required className="mt-1 min-h-[90px]" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location">Ville / Lieu *</Label>
                <Input id="location" placeholder="Ex: Lomé, Togo" value={location} onChange={e => setLocation(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="deadline">Délai souhaité *</Label>
                <Input id="deadline" placeholder="Ex: 7 jours" value={deadline} onChange={e => setDeadline(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Input id="category" placeholder="Ex: Marketing, Design..." value={category} onChange={e => setCategory(e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="skills">Compétences recherchées</Label>
                <Input id="skills" placeholder="Séparées par des virgules" value={skills} onChange={e => setSkills(e.target.value)} className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="tools">Outils suggérés</Label>
              <Input id="tools" placeholder="Séparés par des virgules (ex: Canva, Facebook Business)" value={tools} onChange={e => setTools(e.target.value)} className="mt-1" />
            </div>

            <div>
              <Label className="mb-2 block">Tâches / livrables attendus *</Label>
              <div className="space-y-3">
                {tasks.map((task, i) => (
                  <div key={i} className="rounded-xl border border-border p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted-foreground w-5 shrink-0">{i + 1}.</span>
                      <Input
                        placeholder="Titre de la tâche"
                        value={task.title}
                        onChange={e => updateTask(i, "title", e.target.value)}
                        className="text-sm"
                      />
                      {tasks.length > 1 && (
                        <button type="button" onClick={() => removeTask(i)} className="shrink-0 text-muted-foreground hover:text-destructive">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <Textarea
                      placeholder="Détail de ce qui est attendu (optionnel)"
                      value={task.description}
                      onChange={e => updateTask(i, "description", e.target.value)}
                      className="text-sm min-h-[60px] ml-7"
                    />
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTask} className="mt-2 text-xs">
                <Plus size={13} className="mr-1" /> Ajouter une tâche
              </Button>
            </div>

            <div>
              <Label htmlFor="resource-file">Fichier à joindre (optionnel)</Label>
              <Input id="resource-file" type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} className="mt-1 text-xs" />
            </div>

            {errorMsg && <p className="text-sm text-destructive text-center">{errorMsg}</p>}

            <Button type="submit" className="w-full gradient-bg border-0 text-base" size="lg" disabled={!canSubmit}>
              {submitting ? "Envoi en cours..." : "Envoyer pour validation"} <Send className="ml-2" size={18} />
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              * Champs obligatoires. Votre mission sera examinée par notre équipe avant publication.
            </p>
          </motion.form>
        </div>
      </section>
    </div>
  );
};

export default PostMission;
