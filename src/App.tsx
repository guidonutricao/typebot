import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Form from "./pages/Form";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./layouts/AdminLayout";
import { FlowLayout } from "./layouts/FlowLayout";
import Dashboard from "./pages/admin/Dashboard";
import Flow from "./pages/admin/Flow";
import Theme from "./pages/admin/Theme";
import Share from "./pages/admin/Share";
import Results from "./pages/admin/Results";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
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

export default App;
