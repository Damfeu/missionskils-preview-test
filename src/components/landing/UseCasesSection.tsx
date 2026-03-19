import { motion } from "framer-motion";
import { GraduationCap, Briefcase, Building2 } from "lucide-react";

const cases = [
  { icon: GraduationCap, title: "Students", desc: "Gain practical experience before graduation." },
  { icon: Briefcase, title: "Job Seekers", desc: "Build employable digital skills." },
  { icon: Building2, title: "SMEs", desc: "Accelerate their digital presence with trained youth." },
];

const UseCasesSection = () => (
  <section className="section-padding">
    <div className="container max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">Who It's For</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Built for Every Learner</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {cases.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-2xl p-8 border border-border bg-background hover:shadow-xl transition-shadow duration-300 text-center"
          >
            <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
              <c.icon size={26} className="text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl mb-2">{c.title}</h3>
            <p className="text-muted-foreground">{c.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default UseCasesSection;
