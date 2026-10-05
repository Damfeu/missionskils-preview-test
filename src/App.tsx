import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/hooks/useUser";
import { CompanyAuthProvider } from "@/hooks/useCompanyAuth";
import Index from "./pages/Index.tsx";
import About from "./pages/About.tsx";
import Waitlist from "./pages/Waitlist.tsx";
import Login from "./pages/Login.tsx";
import Contact from "./pages/Contact.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Courses from "./pages/Courses.tsx";
import Missions from "./pages/Missions.tsx";
import PostMission from "./pages/PostMission.tsx";
import CompanyDashboard from "./pages/CompanyDashboard.tsx";
import CompanyLogin from "./pages/CompanyLogin.tsx";
import CompanyRegister from "./pages/CompanyRegister.tsx";
import Admin from "./pages/Admin.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <UserProvider>
          <CompanyAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/waitlist" element={<Waitlist />} />
              <Route path="/connexion" element={<Login />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/poster-une-mission" element={<PostMission />} />
              <Route path="/entreprise/tableau-de-bord" element={<CompanyDashboard />} />
              <Route path="/entreprise/connexion" element={<CompanyLogin />} />
              <Route path="/entreprise/inscription" element={<CompanyRegister />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CompanyAuthProvider>
        </UserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
