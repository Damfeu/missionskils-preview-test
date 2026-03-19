import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, MessageCircle, CheckCircle } from "lucide-react";

const Contact = () => {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20 px-4">
        <div className="container max-w-lg mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-4">{t("contact.tagline")}</span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">{t("contact.title")}</h1>
            <p className="text-muted-foreground">{t("contact.subtitle")}</p>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-10 rounded-2xl border border-border bg-muted/50">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h2 className="font-display font-bold text-xl mb-2">{t("contact.success_title")}</h2>
              <p className="text-muted-foreground">{t("contact.success_message")}</p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-5 p-8 rounded-2xl border border-border bg-background shadow-lg"
            >
              <div>
                <Label htmlFor="contact-name">{t("contact.name_label")}</Label>
                <Input id="contact-name" placeholder={t("contact.name_placeholder")} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-email">{t("contact.email_label")}</Label>
                <Input id="contact-email" type="email" placeholder={t("contact.email_placeholder")} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="contact-message">{t("contact.message_label")}</Label>
                <Textarea id="contact-message" placeholder={t("contact.message_placeholder")} required className="mt-1 min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full gradient-bg border-0 text-base" size="lg">
                {t("contact.send_button")} <Send className="ml-2" size={18} />
              </Button>
            </motion.form>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <MessageCircle size={16} /> {t("contact.whatsapp")}
            </a>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
