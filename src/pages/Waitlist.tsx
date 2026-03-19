import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const Waitlist = () => {
  const { t } = useTranslation();
  const profilesMap = t("waitlist.profiles", { returnObjects: true }) as Record<string, string>;
  const profiles = Object.values(profilesMap);
  
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-10 rounded-2xl border border-border bg-muted/50">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl mb-2">{t("waitlist.success_title")}</h2>
              <p className="text-muted-foreground">{t("waitlist.success_message")}</p>
            </motion.div>
          ) : (
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
              <Button type="submit" className="w-full gradient-bg border-0 text-base" size="lg" disabled={!name || !email || !profile}>
                {t("hero.join_waitlist")} <ArrowRight className="ml-2" size={18} />
              </Button>
            </motion.form>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Waitlist;
