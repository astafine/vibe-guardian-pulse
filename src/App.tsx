import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "./components/BottomNav";
import FamilyDashboard from "./pages/FamilyDashboard";
import DiagnosticFlow from "./pages/DiagnosticFlow";
import ActionPlan from "./pages/ActionPlan";
import ChildSetup from "./pages/ChildSetup";
import Trends from "./pages/Trends";
import ExpertLibrary from "./pages/ExpertLibrary";
import AppSettings from "./pages/AppSettings";
import ChildProfile from "./pages/ChildProfile";
import Auth from "./pages/Auth";
import ProfileSetup from "./pages/ProfileSetup";
import LinkChild from "./pages/LinkChild";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 rounded-xl gradient-navy animate-pulse" />
      </div>
    );
  }

  // Not logged in → auth page
  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  // Logged in but no profile → profile setup
  if (!profile) {
    return (
      <Routes>
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="*" element={<Navigate to="/profile-setup" replace />} />
      </Routes>
    );
  }

  // Child user → child profile only
  if (profile.role === 'child') {
    return (
      <>
        <Routes>
          <Route path="/" element={<ChildProfile />} />
          <Route path="/child-profile" element={<ChildProfile />} />
          <Route path="/settings" element={<AppSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </>
    );
  }

  // Parent user → full dashboard
  return (
    <>
      <Routes>
        <Route path="/" element={<FamilyDashboard />} />
        <Route path="/diagnostic/:childId" element={<DiagnosticFlow />} />
        <Route path="/action-plan/:childId" element={<ActionPlan />} />
        <Route path="/setup" element={<ChildSetup />} />
        <Route path="/link-child" element={<LinkChild />} />
        <Route path="/trends" element={<Trends />} />
        <Route path="/library" element={<ExpertLibrary />} />
        <Route path="/settings" element={<AppSettings />} />
        <Route path="/child-profile" element={<ChildProfile />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNav />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-[430px] mx-auto min-h-screen relative bg-background">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
