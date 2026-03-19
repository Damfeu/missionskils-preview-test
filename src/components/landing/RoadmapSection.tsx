import { motion } from "framer-motion";
import { Rocket, Globe, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const milestones = [
  { year: "2026", title: "Prototype & Pilot", icon: Zap, desc: "Launch MVP, onboard first learners and SME partners." },
  { year: "2027", title: "National Deployment", icon: Rocket, desc: "Scale across the country with full platform features." },
  { year: "2028", title: "Regional Expansion", icon: Globe, desc: "Expand to neighboring countries and markets." },
];

const RoadmapSection = () => {
  const { t } = useTranslation();
  
  const milestonesData = t("roadmap.items", { returnObjects: true }) as { year: string; title: string; desc: string }[];
  const icons = [Zap, Rocket, Globe];
  const milestones = milestonesData.map((m, i) => ({
    ...m,
    icon: icons[i % icons.length]
  }));

  return (
    <section className="section-padding bg-muted/50">
      <div className="container max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("roadmap.tagline")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("roadmap.title")}</h2>
        </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {milestones.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative rounded-2xl p-6 border border-border bg-background text-left"
          >
            <div className="w-10 h-10 rounded-lg gradient-bg flex items-center justify-center mb-4">
              <m.icon size={18} className="text-primary-foreground" />
            </div>
            <div className="font-display text-2xl font-bold gradient-text mb-1">{m.year}</div>
            <h3 className="font-display font-bold mb-2">{m.title}</h3>
            <p className="text-muted-foreground text-sm">{m.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
};

export default RoadmapSection;
