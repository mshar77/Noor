import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages imports
import Feed from "@/pages/Feed";
import AdhkarCategories from "@/pages/AdhkarCategories";
import AdhkarList from "@/pages/AdhkarList";
import Tasbih from "@/pages/Tasbih";
import NamesOfAllah from "@/pages/NamesOfAllah";
import NotFound from "@/pages/not-found";

// Initialize Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Feed} />
      <Route path="/adhkar" component={AdhkarCategories} />
      <Route path="/adhkar/:id" component={AdhkarList} />
      <Route path="/tasbih" component={Tasbih} />
      <Route path="/names" component={NamesOfAllah} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Ensure the app defaults to RTL text direction for Arabic
  if (typeof document !== 'undefined') {
    document.documentElement.dir = 'rtl';
    document.documentElement.lang = 'ar';
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
