import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Form from "./pages/Form";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./layouts/AdminLayout";
import { FlowLayout } from "./layouts/FlowLayout";
import Dashboard from "./pages/admin/Dashboard";
import Flow from "./pages/admin/Flow";
import Theme from "./pages/admin/Theme";
import Share from "./pages/admin/Share";
import Results from "./pages/admin/Results";
import { useAuthStore } from "./stores/authStore";
import { useFlowStore } from "./stores/flowStore";
import { MigrationDialog } from "./components/MigrationDialog";

const queryClient = new QueryClient();

const App = () => {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadFlows = useFlowStore((state) => state.loadFlows);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (isAuthenticated) {
      loadFlows();
    }
  }, [isAuthenticated, loadFlows]);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MigrationDialog />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forms/:formId" element={<Form />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
          <Route path="/admin/flow/:flowId" element={<FlowLayout />}>
            <Route index element={<Flow />} />
            <Route path="theme" element={<Theme />} />
            <Route path="share" element={<Share />} />
            <Route path="results" element={<Results />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
