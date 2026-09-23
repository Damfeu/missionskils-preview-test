import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const links = [
    { label: t("nav.about"), to: "/about" },
    { label: "Entreprises", to: "/poster-une-mission" },
    { label: t("nav.contact"), to: "/contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="font-display text-xl font-bold">
          <span className="gradient-text">Mission</span>Skills
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              {l.label}
            </Link>
          ))}
          <LanguageSwitcher />
          <Link to="/waitlist">
            <Button size="sm" className="gradient-bg border-0">{t("nav.waitlist")}</Button>
          </Link>
        </div>

        {/* Mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 animate-fade-up">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block py-2 text-sm font-medium text-muted-foreground">
              {l.label}
            </Link>
          ))}
          <div className="py-2">
            <LanguageSwitcher />
          </div>
          <Link to="/waitlist" onClick={() => setOpen(false)}>
            <Button size="sm" className="gradient-bg border-0 w-full mt-2">{t("nav.waitlist")}</Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
