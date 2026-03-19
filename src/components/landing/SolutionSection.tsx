import { motion } from "framer-motion";
import { BookOpen, MapPin, Award, Bot } from "lucide-react";
import { useTranslation } from "react-i18next";

const features = [
  { icon: BookOpen, title: "Micro Digital Courses", desc: "Short skill-based learning modules." },
  { icon: MapPin, title: "Real-World Missions", desc: "Learners complete tasks for real local businesses." },
  { icon: Award, title: "Skill Validation", desc: "Earn badges and build a verified portfolio." },
  { icon: Bot, title: "AI Learning Coach", desc: "Personalized guidance and mission recommendations." },
];

const SolutionSection = () => {
  const { t } = useTranslation();
  
  const features = [
    { icon: BookOpen, title: t("solution.features.courses.title"), desc: t("solution.features.courses.desc") },
    { icon: MapPin, title: t("solution.features.missions.title"), desc: t("solution.features.missions.desc") },
    { icon: Award, title: t("solution.features.validation.title"), desc: t("solution.features.validation.desc") },
    { icon: Bot, title: t("solution.features.ai.title"), desc: t("solution.features.ai.desc") },
  ];

  return (
    <section className="section-padding">
      <div className="container max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("solution.tagline")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-12">
            {t("solution.title_part1", { defaultValue: "Learn by " })}
            <span className="gradient-text">{t("solution.title_part2", { defaultValue: "Doing." })}</span>
          </h2>
        </motion.div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="group bg-background rounded-2xl p-6 border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 text-left"
          >
            <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <f.icon size={22} className="text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);
};

export default SolutionSection;
