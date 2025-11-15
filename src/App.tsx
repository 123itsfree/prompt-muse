import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SelectGrade from "./pages/SelectGrade";
import SelectSection from "./pages/SelectSection";
import Prompts from "./pages/Prompts";
import Wheel from "./pages/Wheel";
import Manual from "./pages/Manual";
import PromptDisplay from "./pages/PromptDisplay";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route 
            path="/select-grade" 
            element={
              <ProtectedRoute>
                <SelectGrade />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/select-section/:grade" 
            element={
              <ProtectedRoute>
                <SelectSection />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prompts/:grade/:section" 
            element={
              <ProtectedRoute>
                <Prompts />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/wheel/:grade/:section" 
            element={
              <ProtectedRoute>
                <Wheel />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/manual/:grade/:section" 
            element={
              <ProtectedRoute>
                <Manual />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/prompt/:id" 
            element={
              <ProtectedRoute>
                <PromptDisplay />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
