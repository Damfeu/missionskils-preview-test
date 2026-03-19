import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Target, Eye, BookOpen } from "lucide-react";

const pillars = [
  { icon: Target, title: "Our Mission", text: "To bridge the gap between education and employment by giving young people hands-on digital experience through real-world missions in their local communities." },
  { icon: Eye, title: "Our Vision", text: "A world where every young person has access to practical, relevant skills that unlock meaningful career opportunities — regardless of where they live." },
  { icon: BookOpen, title: "Learning Philosophy", text: "We believe learning happens best when it's applied. Our approach combines micro-learning modules with field missions, creating a loop of theory, practice, and validation that builds real competence." },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <section className="pt-28 pb-20 px-4">
      <div className="container max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">About Us</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Building the Future of <span className="gradient-text">Practical Learning</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            MissionSkills was born from a simple observation: traditional education alone isn't enough to prepare young people for the digital economy.
          </p>
        </motion.div>

        <div className="space-y-8">
          {pillars.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.15 }}
              className="flex gap-6 p-6 rounded-2xl border border-border bg-background"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl gradient-bg flex items-center justify-center">
                <p.icon size={22} className="text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl mb-2">{p.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    <Footer />
  </div>
);

export default About;
