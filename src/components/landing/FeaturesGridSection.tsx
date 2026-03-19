import { motion } from "framer-motion";
import { LayoutDashboard, MapPinned, Gamepad2, FolderOpen, Store, BarChart3 } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  { icon: LayoutDashboard, title: "Smart LMS Dashboard" },
  { icon: MapPinned, title: "Geo-localized Missions" },
  { icon: Gamepad2, title: "Gamification & XP System" },
  { icon: FolderOpen, title: "Digital Skill Portfolio" },
  { icon: Store, title: "Business Mission Marketplace" },
  { icon: BarChart3, title: "Learning Analytics" },
];

const FeaturesGridSection = () => {
  const { t } = useTranslation();
  
  const features = [
    { icon: LayoutDashboard, title: t("featuresGrid.items.dashboard") },
    { icon: MapPinned, title: t("featuresGrid.items.missions") },
    { icon: Gamepad2, title: t("featuresGrid.items.xp") },
    { icon: FolderOpen, title: t("featuresGrid.items.portfolio") },
    { icon: Store, title: t("featuresGrid.items.marketplace") },
    { icon: BarChart3, title: t("featuresGrid.items.analytics") },
  ];

  return (
    <section className="section-padding bg-muted/50">
      <div className="container max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("featuresGrid.tagline")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("featuresGrid.title")}</h2>
        </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-background rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-md transition-all duration-300 flex flex-col items-center gap-3"
          >
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <f.icon size={20} className="text-primary" />
            </div>
            <h3 className="font-display font-semibold text-sm md:text-base">{f.title}</h3>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
};

export default FeaturesGridSection;
