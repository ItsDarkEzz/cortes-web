import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import NotFound from "@/pages/not-found";
import LandingPage from "@/pages/LandingPage";
import About from "@/pages/About";
import Documentation from "@/pages/Documentation";
import Support from "@/pages/Support";
// TODO: Включить когда будут готовы
// import Pricing from "@/pages/Pricing";
// import Commands from "@/pages/Commands";

function Router() {
    return (
        <>
            <ScrollToTop />
            <Switch>
            <Route path="/" component={LandingPage} />
            <Route path="/about" component={About} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/support" component={Support} />
            {/* TODO: Включить когда будут готовы */}
            {/* <Route path="/pricing" component={Pricing} /> */}
            {/* <Route path="/commands" component={Commands} /> */}
            <Route component={NotFound} />
        </Switch>
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
