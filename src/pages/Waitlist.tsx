import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";

const Waitlist = () => {
  const { t } = useTranslation();
  const { register } = useUser();
  const navigate = useNavigate();
  const profilesMap = t("waitlist.profiles", { returnObjects: true }) as Record<string, string>;
  const profiles = Object.values(profilesMap);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profile, setProfile] = useState("");

  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setSubmitting(true);
    setErrorMsg("");
    try {
      await register(name, email, profile, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Inscription impossible pour le moment. Vérifiez votre connexion et réessayez.");
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
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("waitlist.tagline")}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {t("waitlist.title_part1")}<span className="gradient-text">{t("waitlist.title_part2")}</span>
            </h1>
            <p className="text-muted-foreground">{t("waitlist.subtitle")}</p>
          </motion.div>

          <div className="mb-6 rounded-xl border border-secondary/30 bg-secondary/5 p-4 text-sm text-center">
            Vous représentez une entreprise et voulez proposer une mission ?{" "}
            <Link to="/entreprise/inscription" className="text-secondary font-semibold hover:underline">
              Créez un compte entreprise
            </Link>
          </div>

          <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5 p-8 rounded-2xl border border-border bg-background shadow-lg"
            >
              <div>
                <Label htmlFor="name">{t("waitlist.name_label")}</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t("contact.name_placeholder")} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">{t("contact.email_label")}</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("contact.email_placeholder")} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6 caractères minimum" minLength={6} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Retapez le mot de passe"
                  minLength={6}
                  required
                  className="mt-1"
                />
                {passwordsMismatch && (
                  <p className="text-xs text-destructive mt-1">Les mots de passe ne correspondent pas.</p>
                )}
              </div>
              <div>
                <Label>{t("waitlist.profile_label")}</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profiles.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setProfile(p)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        profile === p
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              {errorMsg && (
                <p className="text-sm text-destructive text-center">{errorMsg}</p>
              )}
              <Button type="submit" className="w-full gradient-bg border-0 text-base" size="lg" disabled={!name || !email || !profile || password.length < 6 || passwordsMismatch || !confirmPassword || submitting}>
                {submitting ? "Inscription en cours..." : t("hero.join_waitlist")} <ArrowRight className="ml-2" size={18} />
              </Button>
              <p className="text-sm text-center text-muted-foreground">
                Déjà un compte ?{" "}
                <Link to="/connexion" className="text-primary hover:underline font-medium">Se connecter</Link>
              </p>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Waitlist;
