import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Send, LogOut, Menu, X, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanyAuth } from "@/hooks/useCompanyAuth";
import logo from "@/assets/logo-horizontal.png";

const CompanyNavbar = () => {
  const { company, logout } = useCompanyAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/entreprise/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/poster-une-mission", label: "Proposer une mission", icon: Send }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/entreprise/tableau-de-bord" className="flex items-center">
          <img src={logo} alt="MissionSkills" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm bg-secondary/10 px-3 py-1.5 rounded-full">
            <Building2 size={14} className="text-secondary" />
            <span className="font-semibold">{company?.companyName}</span>
          </div>
          <Button size="sm" variant="ghost" onClick={handleLogout} className="text-muted-foreground">
            <LogOut size={16} />
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
          <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
            <span className="text-sm font-semibold">{company?.companyName}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CompanyNavbar;
