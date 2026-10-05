import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";

const CompanyRegister = () => {
  const { register } = useCompanyAuth();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [companyType, setCompanyType] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      await register(companyName, companyType, contactName, email, password);
      navigate("/poster-une-mission");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Inscription impossible pour le moment.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20 px-4">
        <div className="container max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">
              Espace Entreprise
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Créer un compte <span className="gradient-text">entreprise</span>
            </h1>
            <p className="text-muted-foreground">
              Créez votre compte pour proposer des missions réelles à nos apprenants.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-5 p-8 rounded-2xl border border-border bg-background shadow-lg"
          >
            <div>
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
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
              <Label htmlFor="email">Email professionnel</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6 caractères minimum" minLength={6} required className="mt-1" />
            </div>
            {errorMsg && <p className="text-sm text-destructive text-center">{errorMsg}</p>}
            <Button type="submit" className="w-full gradient-bg border-0 text-base" size="lg" disabled={!companyName || !email || password.length < 6 || submitting}>
              {submitting ? "Création en cours..." : "Créer mon compte"} <ArrowRight className="ml-2" size={18} />
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Déjà un compte ?{" "}
              <Link to="/entreprise/connexion" className="text-primary hover:underline font-medium">Se connecter</Link>
            </p>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default CompanyRegister;
