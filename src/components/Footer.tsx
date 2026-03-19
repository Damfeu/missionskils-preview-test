import { Link } from "react-router-dom";
import { Linkedin, Mail } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground py-12 px-4">
    <div className="container max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
      <div>
        <h3 className="font-display text-lg font-bold mb-2">MissionSkills</h3>
        <p className="text-sm opacity-70">Empowering youth through practical digital learning.</p>
      </div>
      <div className="flex flex-col gap-2 text-sm opacity-80">
        <Link to="/about" className="hover:opacity-100 transition-opacity">About</Link>
        <Link to="/contact" className="hover:opacity-100 transition-opacity">Contact</Link>
        <Link to="/waitlist" className="hover:opacity-100 transition-opacity">Waitlist</Link>
        <span className="cursor-default">Privacy Policy</span>
      </div>
      <div className="flex flex-col gap-2 text-sm opacity-80">
        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <Linkedin size={16} /> LinkedIn
        </a>
        <a href="mailto:hello@missionskills.io" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
          <Mail size={16} /> hello@missionskills.io
        </a>
      </div>
    </div>
    <div className="container max-w-6xl mx-auto mt-8 pt-6 border-t border-primary-foreground/10 text-center text-xs opacity-50">
      © {new Date().getFullYear()} MissionSkills. All rights reserved.
    </div>
  </footer>
);

export default Footer;
