import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const problems = [
  "Many graduates lack practical experience",
  "Youth unemployment remains high",
  "Small businesses struggle with digital transformation",
  "Traditional training is too theoretical",
];

const ProblemSection = () => (
  <section className="section-padding bg-muted/50">
    <div className="container max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
          The Challenge
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-10">
          Education does not always prepare young people for real work.
        </h2>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        {problems.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-background rounded-xl p-6 text-left border border-border shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-destructive mb-3" />
            <p className="text-foreground font-medium">{p}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default ProblemSection;
