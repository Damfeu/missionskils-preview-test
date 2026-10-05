import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import logo from "@/assets/logo-horizontal.png";

const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-foreground text-primary-foreground py-12 px-4">
      <div className="container max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        <div>
          <img src={logo} alt="MissionSkills" className="h-7 w-auto mb-3 brightness-0 invert" />
          <p className="text-sm opacity-70">{t("footer.description")}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm opacity-80">
          <Link to="/about" className="hover:opacity-100 transition-opacity">{t("nav.about")}</Link>
          <Link to="/contact" className="hover:opacity-100 transition-opacity">{t("nav.contact")}</Link>
          <Link to="/waitlist" className="hover:opacity-100 transition-opacity">{t("nav.waitlist")}</Link>
          <span className="cursor-default">{t("footer.privacy")}</span>
        </div>
        <div className="flex flex-col gap-2 text-sm opacity-80">
          <a href="https://www.linkedin.com/in/kokouvi-damaz-adododji-8b5424285" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
            <Linkedin size={16} /> {t("footer.linkedin")}
          </a>
          <a href="mailto:adododji7@gmail.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
            <Mail size={16} /> adododji7@gmail.com
          </a>
        </div>
      </div>
      <div className="container max-w-6xl mx-auto mt-8 pt-6 border-t border-primary-foreground/10 text-center text-xs opacity-50">
        © {new Date().getFullYear()} MissionSkills. {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
