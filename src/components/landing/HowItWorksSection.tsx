import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const steps = [
  { num: "01", title: "Sign up", desc: "Create your free learner profile." },
  { num: "02", title: "Choose a skill", desc: "Pick from digital marketing, design, data & more." },
  { num: "03", title: "Follow the training", desc: "Complete bite-sized learning modules." },
  { num: "04", title: "Complete a real mission", desc: "Apply your skills with a local business." },
  { num: "05", title: "Earn certification", desc: "Get certified and build your portfolio." },
];

const HowItWorksSection = () => {
  const { t } = useTranslation();
  const stepsData = t("howItWorks.steps", { returnObjects: true }) as { title: string; desc: string }[];
  
  const steps = stepsData.map((step, i) => ({
    num: `0${i + 1}`,
    title: step.title,
    desc: step.desc
  }));

  return (
    <section className="section-padding bg-muted/50">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("howItWorks.tagline")}</span>
          <h2 className="font-display text-3xl md:text-4xl font-bold">{t("howItWorks.title")}</h2>
        </motion.div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-px" />

        {steps.map((s, i) => {
          const badgeColors = ["bg-primary", "bg-secondary", "bg-amber-600"];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative flex items-start gap-6 mb-10 md:w-1/2 ${
                i % 2 === 0 ? "md:pr-12 md:ml-0" : "md:pl-12 md:ml-auto"
              }`}
            >
              <div
                className={`relative z-10 w-12 h-12 shrink-0 rounded-full ${badgeColors[i % badgeColors.length]} flex items-center justify-center text-white font-display font-bold text-sm shadow-lg md:absolute md:left-auto md:right-auto`}
                style={i % 2 === 0 ? { right: "-24px" } : { left: "-24px" }}
              >
                {s.num}
              </div>
              <div className="bg-background rounded-xl border border-border p-5 shadow-sm flex-1">
                <h3 className="font-display font-bold mb-1">{s.title}</h3>
                <p className="text-muted-foreground text-sm">{s.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);
};

export default HowItWorksSection;
