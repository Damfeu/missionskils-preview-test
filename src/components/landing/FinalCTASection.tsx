import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const FinalCTASection = () => {
  const { t } = useTranslation();
  return (
    <section className="section-padding">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden"
          style={{ background: "var(--gradient-primary)" }}
        >
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 relative z-10">
            {t("finalCTA.title")}
          </h2>
          <p className="opacity-80 mb-8 relative z-10 max-w-lg mx-auto">
            {t("finalCTA.subtitle")}
          </p>
          <Link to="/waitlist">
            <Button size="lg" variant="secondary" className="bg-background text-foreground hover:bg-background/90 text-base px-8 shadow-lg relative z-10">
              {t("finalCTA.cta")} <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
          <p className="text-xs opacity-60 mt-4 relative z-10">
            {t("finalCTA.disclaimer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
