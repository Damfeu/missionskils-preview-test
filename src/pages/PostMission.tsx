import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, Send, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TaskDraft {
  title: string;
  description: string;
}

const emptyTask = (): TaskDraft => ({ title: "", description: "" });

const PostMission = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
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
    companyName && contactEmail && title && description && context && objective &&
    location && deadline && validTasks.length > 0 && !submitting;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
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
        company_name: companyName,
        company_type: companyType,
        contact_name: contactName,
        contact_email: contactEmail,
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20 px-4">
        <div className="container max-w-2xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              Espace Entreprise
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Proposer une <span className="gradient-text">mission</span>
            </h1>
            <p className="text-muted-foreground">
              Décrivez un besoin réel de votre entreprise. Notre équipe valide chaque mission avant
              qu'elle soit proposée aux apprenants.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-10 rounded-2xl border border-border bg-muted/50">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl mb-2">Mission envoyée !</h2>
              <p className="text-muted-foreground">
                Merci ! Notre équipe va examiner votre mission et vous recontacter avant sa publication
                sur la plateforme.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              onSubmit={handleSubmit}
              className="space-y-6 p-8 rounded-2xl border border-border bg-background shadow-lg"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                  <Input id="companyName" value={companyName} onChange={e => setCompanyName(e.target.value)} required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="companyType">Secteur d'activité</Label>
                  <Input id="companyType" placeholder="Ex: Restauration, Commerce..." value={companyType} onChange={e => setCompanyType(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactName">Votre nom</Label>
                  <Input id="contactName" value={contactName} onChange={e => setContactName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactEmail">Email de contact *</Label>
                  <Input id="contactEmail" type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} required className="mt-1" />
                </div>
              </div>

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
                <Textarea id="context" placeholder="Qui êtes-vous, quelle est votre situation actuelle ?" value={context} onChange={e => setContext(e.target.value)} required className="mt-1 min-h-[90px]" />
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
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default PostMission;
