import { motion } from "framer-motion";

const stats = [
  { value: "5,000+", label: "Youth Targeted" },
  { value: "1,000+", label: "SMEs Impacted" },
  { value: "50+", label: "Skills Planned" },
];

const ImpactSection = () => (
  <section className="section-padding">
    <div className="container max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-14"
      >
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">Impact</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Empowering Local Economies</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">By bridging the gap between education and employment, MissionSkills creates lasting impact in communities.</p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-2xl p-8 border border-border bg-background"
          >
            <div className="font-display text-5xl md:text-6xl font-bold gradient-text mb-2">{s.value}</div>
            <p className="text-muted-foreground font-medium">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ImpactSection;
