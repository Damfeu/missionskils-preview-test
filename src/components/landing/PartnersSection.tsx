import { motion } from "framer-motion";
import { Lightbulb, Heart, GraduationCap, Cpu } from "lucide-react";
import { useTranslation } from "react-i18next";

const partners = [
  { icon: Lightbulb, label: "Innovation Hubs" },
  { icon: Heart, label: "NGOs" },
  { icon: GraduationCap, label: "Training Centers" },
  { icon: Cpu, label: "Tech Ecosystem Partners" },
];

const PartnersSection = () => {
  const { t } = useTranslation();
  
  const partners = [
    { icon: Lightbulb, label: t("partners.items.hubs") },
    { icon: Heart, label: t("partners.items.ngos") },
    { icon: GraduationCap, label: t("partners.items.training") },
    { icon: Cpu, label: t("partners.items.ecosystem") },
  ];

  return (
    <section className="section-padding">
      <div className="container max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("partners.tagline")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("partners.title")}</h2>
        </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {partners.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-muted/50 p-6 flex flex-col items-center gap-3"
          >
            <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center">
              <p.icon size={28} className="text-muted-foreground" />
            </div>
            <span className="text-sm font-medium text-muted-foreground">{p.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
};

export default PartnersSection;
