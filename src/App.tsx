import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import About from "./pages/About";
import HowToPlay from "./pages/HowToPlay";
import Strategy from "./pages/Strategy";
import FAQ from "./pages/FAQ";
import LeaderboardPage from "./pages/LeaderboardPage";
import NotFound from "./pages/NotFound";
import { PrivacyPolicy } from "./components/PrivacyPolicy";
import { TermsOfService } from "./components/TermsOfService";
import { CookiePolicy } from "./components/CookiePolicy";
import { Contact } from "./components/Contact";
import { TestRoute } from "./components/TestRoute";

import { ThemeColorProvider } from "@/contexts/ThemeColorContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeColorProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem={true}>
        <TooltipProvider>
          <Toaster />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              {/* Content pages */}
              <Route path="/about" element={<About />} />
              <Route path="/how-to-play" element={<HowToPlay />} />
              <Route path="/strategy" element={<Strategy />} />
              <Route path="/faq" element={<FAQ />} />
              {/* Test Route */}
              <Route path="/test" element={<TestRoute />} />
              {/* Legal Documents */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/contact" element={<Contact />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </ThemeColorProvider>
  </QueryClientProvider>
);

export default App;
