import { Link, useRoute } from "wouter";
import { Home, BookOpen, Fingerprint, LayoutGrid, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  hideHeader?: boolean;
}

export function AppLayout({ children, title = "نور", hideHeader = false }: AppLayoutProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial system/saved preference
    const isDarkMode = document.documentElement.classList.contains('dark') || 
                       localStorage.getItem('theme') === 'dark';
    setIsDark(isDarkMode);
    if (isDarkMode) document.documentElement.classList.add('dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navItems = [
    { href: "/", icon: Home, label: "الرئيسية" },
    { href: "/adhkar", icon: BookOpen, label: "الأذكار" },
    { href: "/tasbih", icon: Fingerprint, label: "المسبحة" },
    { href: "/names", icon: LayoutGrid, label: "أسماء الله" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden w-full max-w-7xl mx-auto shadow-2xl relative">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-pattern pointer-events-none" />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-card/80 backdrop-blur-xl border-l border-border/50 z-10">
        <div className="p-6 flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-10 h-10 rounded-xl shadow-md" />
          <h1 className="text-2xl font-bold text-primary font-display">نور</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => {
            const [isActive] = useRoute(item.href === "/" ? "/" : `${item.href}/*?`);
            return (
              <Link key={item.href} href={item.href} className="block">
                <div className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-medium cursor-pointer",
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "animate-pulse")} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-border/50">
          <button 
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-primary" />}
            <span className="font-medium">{isDark ? "الوضع الفاتح" : "الوضع الداكن"}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative z-10 w-full">
        {/* Mobile Header */}
        {!hideHeader && (
          <header className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-b border-border/50 sticky top-0 z-20">
            <div className="flex items-center gap-2">
              <img src={`${import.meta.env.BASE_URL}images/logo.png`} alt="Logo" className="w-8 h-8 rounded-lg shadow-sm" />
              <h1 className="text-xl font-bold font-display text-primary">{title}</h1>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full bg-muted/50 text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-accent" /> : <Moon className="w-5 h-5 text-primary" />}
            </button>
          </header>
        )}

        <div className="flex-1 overflow-y-auto pb-24 md:pb-0 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Bottom Nav */}
        <nav className="md:hidden fixed bottom-0 w-full bg-card/90 backdrop-blur-xl border-t border-border/50 pb-safe z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
          <div className="flex justify-around items-center p-2">
            {navItems.map((item) => {
              const [isActive] = useRoute(item.href === "/" ? "/" : `${item.href}/*?`);
              return (
                <Link key={item.href} href={item.href} className="flex-1">
                  <div className="flex flex-col items-center justify-center w-full py-2 cursor-pointer group">
                    <div className={cn(
                      "p-1.5 rounded-full mb-1 transition-all duration-300",
                      isActive ? "bg-primary/10 text-primary scale-110" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      <item.icon className={cn("w-6 h-6", isActive && "stroke-2")} />
                    </div>
                    <span className={cn(
                      "text-[10px] font-medium transition-all",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </main>
    </div>
  );
}
