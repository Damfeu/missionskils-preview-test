import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Target, LogOut, Menu, X, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";

const AppNavbar = () => {
  const { user, logout, level } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/courses", label: "Cours", icon: BookOpen },
    { to: "/missions", label: "Missions", icon: Target }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container max-w-6xl mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/dashboard" className="font-display text-xl font-bold">
          <span className="gradient-text">Mission</span>Skills
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
          <div className="flex items-center gap-1.5 text-sm bg-primary/10 px-3 py-1.5 rounded-full">
            <Star size={14} className="text-primary" />
            <span className="font-bold gradient-text">{user?.xp} XP</span>
            <span className="text-muted-foreground text-xs">· Niv. {level}</span>
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
            <span className="text-sm font-bold gradient-text">{user?.xp} XP · Niv. {level}</span>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut size={16} className="mr-1" /> Déconnexion
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AppNavbar;
