import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { useUser } from "@/hooks/useUser";

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Connexion impossible. Vérifiez vos identifiants.");
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
              Espace Apprenant
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Se <span className="gradient-text">connecter</span>
            </h1>
            <p className="text-muted-foreground">Retrouvez votre parcours, vos cours et vos missions.</p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onSubmit={handleSubmit}
            className="space-y-5 p-8 rounded-2xl border border-border bg-background shadow-lg"
          >
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="mt-1" />
            </div>
            {errorMsg && <p className="text-sm text-destructive text-center">{errorMsg}</p>}
            <Button type="submit" className="w-full gradient-bg border-0 text-base" size="lg" disabled={!email || !password || submitting}>
              {submitting ? "Connexion en cours..." : "Se connecter"} <ArrowRight className="ml-2" size={18} />
            </Button>
            <p className="text-sm text-center text-muted-foreground">
              Pas encore de compte ?{" "}
              <Link to="/waitlist" className="text-primary hover:underline font-medium">S'inscrire</Link>
            </p>
          </motion.form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Login;
