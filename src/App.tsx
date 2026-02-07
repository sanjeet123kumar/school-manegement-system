import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Layout } from "@/components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Teachers from "./pages/Teachers";
import Classes from "./pages/Classes";
import Attendance from "./pages/Attendance";
import Fees from "./pages/Fees";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

/**
 * TanStack Query client for managing server state, caching, and synchronization.
 * This enables efficient data fetching across the entire app.
 */
const queryClient = new QueryClient();

/**
 * App component - Root of the application
 * 
 * Structure:
 * 1. QueryClientProvider - Enables TanStack Query throughout app
 * 2. AuthProvider - Manages authentication state globally
 * 3. TooltipProvider - Enables tooltips everywhere
 * 4. Toaster components - Show notifications
 * 5. BrowserRouter - Enables routing
 * 6. Routes:
 *    - /auth: Public page (login/signup)
 *    - All other routes: Protected with ProtectedRoute wrapper
 *    - *: Catch-all for 404 page
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public route - accessible without authentication */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected routes - wrapped with ProtectedRoute to check authentication */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/fees" element={<Fees />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Catch-all: 404 page for unmached routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
