import { Switch, Route } from "wouter";
import { lazy, Suspense } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Eager load main page for fast initial render
import LandingPage from "@/pages/LandingPage";

// Lazy load other pages
const About = lazy(() => import("@/pages/About"));
const Documentation = lazy(() => import("@/pages/Documentation"));
const Support = lazy(() => import("@/pages/Support"));
const Token = lazy(() => import("@/pages/Token"));
const Banners = lazy(() => import("@/pages/Banners"));
const BannerExport = lazy(() => import("@/pages/Banners").then(m => ({ default: m.BannerExport })));
const Login = lazy(() => import("@/pages/Login"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const DashboardChats = lazy(() => import("@/pages/dashboard/Chats"));
const DashboardSettings = lazy(() => import("@/pages/dashboard/Settings"));
const DashboardChatDetail = lazy(() => import("@/pages/dashboard/ChatDetail"));
const DashboardProfile = lazy(() => import("@/pages/dashboard/Profile"));
// Owner Panel
const OwnerPanel = lazy(() => import("@/pages/dashboard/owner/OwnerPanel"));
const OwnerLogs = lazy(() => import("@/pages/dashboard/owner/OwnerLogs"));
const OwnerBans = lazy(() => import("@/pages/dashboard/owner/OwnerBans"));
const OwnerChats = lazy(() => import("@/pages/dashboard/owner/OwnerChats"));
const OwnerChatDetails = lazy(() => import("@/pages/dashboard/owner/OwnerChatDetails"));
const OwnerSubscriptions = lazy(() => import("@/pages/dashboard/owner/OwnerSubscriptions"));
const OwnerBroadcast = lazy(() => import("@/pages/dashboard/owner/OwnerBroadcast"));
const OwnerLLMSettings = lazy(() => import("@/pages/dashboard/owner/OwnerLLMSettings"));
const OwnerMemory = lazy(() => import("@/pages/dashboard/owner/MemoryPage"));
// const DashboardNotifications = lazy(() => import("@/pages/dashboard/Notifications")); // временно отключено
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
                    <Route path="/banners" component={Banners} />
                    <Route path="/banner-export" component={BannerExport} />
                    <Route path="/login" component={Login} />
                    <Route path="/dashboard">
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/chats">
                        <ProtectedRoute><DashboardChats /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/settings">
                        <ProtectedRoute><DashboardSettings /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/chats/:id">
                        <ProtectedRoute><DashboardChatDetail /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/profile">
                        <ProtectedRoute><DashboardProfile /></ProtectedRoute>
                    </Route>
                    {/* Owner Panel */}
                    <Route path="/dashboard/owner">
                        <ProtectedRoute><OwnerPanel /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/logs">
                        <ProtectedRoute><OwnerLogs /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/bans">
                        <ProtectedRoute><OwnerBans /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/chats">
                        <ProtectedRoute><OwnerChats /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/chats/:chatId">
                        <ProtectedRoute><OwnerChatDetails /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/subscriptions">
                        <ProtectedRoute><OwnerSubscriptions /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/broadcast">
                        <ProtectedRoute><OwnerBroadcast /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/llm">
                        <ProtectedRoute><OwnerLLMSettings /></ProtectedRoute>
                    </Route>
                    <Route path="/dashboard/owner/memory">
                        <ProtectedRoute><OwnerMemory /></ProtectedRoute>
                    </Route>
                    {/* Notifications - временно отключено
                    <Route path="/dashboard/notifications">
                        <ProtectedRoute><DashboardNotifications /></ProtectedRoute>
                    </Route>
                    */}
                    <Route component={NotFound} />
                </Switch>
            </Suspense>
        </>
    );
}

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <LanguageProvider>
                    <AuthProvider>
                        <TooltipProvider>
                            <Toaster />
                            <Router />
                        </TooltipProvider>
                    </AuthProvider>
                </LanguageProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
}

export default App;
