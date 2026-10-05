import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Handshake } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-learner.png";

const HeroSection = () => {
  const { t } = useTranslation();
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28 px-4">
      {/* Tache de fond, couleur pleine */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full opacity-10 blur-3xl bg-primary" />

      <div className="container max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4 px-3 py-1 rounded-full bg-primary/10">
          {t("hero.tagline")}
        </span>
        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
          {t("hero.title_part1")}
          <span className="gradient-text">{t("hero.title_part2")}</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
          {t("hero.description")}
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/waitlist">
            <Button size="lg" className="gradient-bg border-0 text-base px-8 shadow-lg hover:shadow-xl transition-shadow">
              {t("hero.join_waitlist")} <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
          <Link to="/contact">
            <Button size="lg" variant="outline" className="text-base px-8 border-secondary/40 text-secondary hover:bg-secondary/10 hover:text-secondary">
              <Handshake className="mr-2" size={18} /> {t("hero.become_partner")}
            </Button>
          </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex justify-center"
      >
        <div className="relative">
          <div className="absolute inset-0 rounded-3xl blur-2xl opacity-15 bg-primary" />
          <img
            src={heroImage}
            alt={t("hero.image_alt")}
            className="relative rounded-3xl shadow-2xl max-w-full w-[480px]"
          />
        </div>
      </motion.div>
    </div>
  </section>
);
};

export default HeroSection;
