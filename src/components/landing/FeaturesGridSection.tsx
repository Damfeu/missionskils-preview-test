import { motion } from "framer-motion";
import { LayoutDashboard, MapPinned, Gamepad2, FolderOpen, Store, BarChart3 } from "lucide-react";

const features = [
  { icon: LayoutDashboard, title: "Smart LMS Dashboard" },
  { icon: MapPinned, title: "Geo-localized Missions" },
  { icon: Gamepad2, title: "Gamification & XP System" },
  { icon: FolderOpen, title: "Digital Skill Portfolio" },
  { icon: Store, title: "Business Mission Marketplace" },
  { icon: BarChart3, title: "Learning Analytics" },
];

const FeaturesGridSection = () => (
  <section className="section-padding bg-muted/50">
    <div className="container max-w-6xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12"
      >
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">Platform Features</span>
        <h2 className="font-display text-3xl md:text-4xl font-bold">Everything You Need to Grow</h2>
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

export default FeaturesGridSection;
