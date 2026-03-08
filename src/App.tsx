import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import FamilyDashboard from "./pages/FamilyDashboard";
import DiagnosticFlow from "./pages/DiagnosticFlow";
import ActionPlan from "./pages/ActionPlan";
import ChildSetup from "./pages/ChildSetup";
import Trends from "./pages/Trends";
import ExpertLibrary from "./pages/ExpertLibrary";
import AppSettings from "./pages/AppSettings";
import ChildProfile from "./pages/ChildProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="max-w-[430px] mx-auto min-h-screen relative bg-background">
          <Routes>
            <Route path="/" element={<FamilyDashboard />} />
            <Route path="/diagnostic/:childId" element={<DiagnosticFlow />} />
            <Route path="/action-plan/:childId" element={<ActionPlan />} />
            <Route path="/setup" element={<ChildSetup />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/library" element={<ExpertLibrary />} />
            <Route path="/settings" element={<AppSettings />} />
            <Route path="/child-profile" element={<ChildProfile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <BottomNav />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
