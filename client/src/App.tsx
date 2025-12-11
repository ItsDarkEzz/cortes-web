import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";

// Eager load main page for fast initial render
import LandingPage from "@/pages/LandingPage";

// Lazy load other pages
const About = lazy(() => import("@/pages/About"));
const Documentation = lazy(() => import("@/pages/Documentation"));
const Support = lazy(() => import("@/pages/Support"));
const Token = lazy(() => import("@/pages/Token"));
const NotFound = lazy(() => import("@/pages/not-found"));

// Loading fallback
function PageLoader() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );
}

function Router() {
    return (
        <>
            <ScrollToTop />
            <Suspense fallback={<PageLoader />}>
                <Switch>
                    <Route path="/" component={LandingPage} />
                    <Route path="/about" component={About} />
                    <Route path="/documentation" component={Documentation} />
                    <Route path="/support" component={Support} />
                    <Route path="/token" component={Token} />
                    <Route component={NotFound} />
                </Switch>
            </Suspense>
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <TooltipProvider>
                <Toaster />
                <Router />
            </TooltipProvider>
        </QueryClientProvider>
    );
}

export default App;
