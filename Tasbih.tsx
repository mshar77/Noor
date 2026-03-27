import { useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Settings2, Target, Share2, Plus, Minus, Check } from "lucide-react";
import confetti from "canvas-confetti";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { useSaveTasbihProgress } from "@workspace/api-client-react";
import { cn, formatArabicNumber } from "@/lib/utils";

const DHIKR_OPTIONS = [
  "سُبْحَانَ اللَّهِ",
  "الْحَمْدُ لِلَّهِ",
  "اللَّهُ أَكْبَرُ",
  "لَا إِلَهَ إِلَّا اللَّهُ",
  "أَسْتَغْفِرُ اللَّهَ",
  "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ"
];

export default function Tasbih() {
  // Use local storage for immediate state preservation
  const [count, setCount] = useLocalStorage("tasbih_count", 0);
  const [target, setTarget] = useLocalStorage("tasbih_target", 33);
  const [activeDhikr, setActiveDhikr] = useLocalStorage("tasbih_dhikr", DHIKR_OPTIONS[0]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // MOCK device ID - in real app would be a persistent UUID
  const deviceId = "guest_device_" + (typeof window !== 'undefined' ? window.screen.width : "0");

  const saveMutation = useSaveTasbihProgress();

  const progress = Math.min(100, (count / target) * 100);
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const triggerHaptic = (isTargetReached: boolean = false) => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      if (isTargetReached) {
        navigator.vibrate([100, 50, 100, 50, 100]); // Celebration vibe
      } else {
        navigator.vibrate(50); // Light tap
      }
    }
  };

  const handleTap = () => {
    const newCount = count + 1;
    setCount(newCount);
    
    if (newCount === target) {
      triggerHaptic(true);
      fireConfetti();
      // Sync to API
      saveMutation.mutate({
        data: {
          deviceId,
          dhikrText: activeDhikr,
          count: newCount,
          targetCount: target,
          date: new Date().toISOString().split('T')[0]
        }
      });
    } else {
      triggerHaptic(false);
    }
  };

  const resetCount = () => {
    if (count > 0) {
      if (window.confirm("هل أنت متأكد من تصفير العداد؟")) {
        setCount(0);
      }
    }
  };

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#f59e0b', '#3b82f6', '#ffffff']
    });
  };

  const handleShare = () => {
    const textToShare = `تحدي سبّح معي! 📿\nأدعوكم لذكر الله: ${activeDhikr}\nالهدف: ${target} مرة.\n- من تطبيق نور`;
    if (navigator.share) {
      navigator.share({ title: 'سبّح معي', text: textToShare }).catch(console.error);
    } else {
      navigator.clipboard.writeText(textToShare);
      alert("تم نسخ التحدي للمشاركة!");
    }
  };

  return (
    <AppLayout title="المسبحة الإلكترونية">
      <div className="max-w-md mx-auto px-4 py-8 h-full flex flex-col relative">
        
        {/* Top Controls */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className="p-3 rounded-full bg-card shadow-md text-muted-foreground hover:text-primary transition-colors border border-border/50"
          >
            <Settings2 className="w-6 h-6" />
          </button>
          
          <div className="bg-card px-6 py-2 rounded-full shadow-md border border-border/50 text-sm font-bold flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-foreground">الهدف: {formatArabicNumber(target)}</span>
          </div>

          <button 
            onClick={resetCount}
            className="p-3 rounded-full bg-card shadow-md text-muted-foreground hover:text-destructive transition-colors border border-border/50"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Settings Panel Overlay */}
        <AnimatePresence>
          {isSettingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-4 right-4 bg-card rounded-3xl p-6 shadow-2xl border border-border z-20"
            >
              <h3 className="font-bold text-lg mb-4 text-foreground">إعدادات المسبحة</h3>
              
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">اختر الذكر</label>
                <div className="flex flex-wrap gap-2">
                  {DHIKR_OPTIONS.map(opt => (
                    <button
                      key={opt}
                      onClick={() => { setActiveDhikr(opt); setCount(0); setIsSettingsOpen(false); }}
                      className={cn(
                        "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                        activeDhikr === opt 
                          ? "bg-primary text-primary-foreground shadow-md" 
                          : "bg-muted text-muted-foreground hover:bg-secondary"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">الهدف</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setTarget(Math.max(1, target - 10))} className="p-3 bg-muted rounded-xl hover:bg-secondary"><Minus className="w-5 h-5" /></button>
                  <div className="flex-1 text-center font-bold text-2xl font-sans">{formatArabicNumber(target)}</div>
                  <button onClick={() => setTarget(target + 10)} className="p-3 bg-muted rounded-xl hover:bg-secondary"><Plus className="w-5 h-5" /></button>
                </div>
                <div className="flex gap-2 mt-4">
                  {[33, 100, 1000].map(preset => (
                    <button
                      key={preset}
                      onClick={() => setTarget(preset)}
                      className={cn("flex-1 py-2 rounded-xl text-sm font-bold border", target === preset ? "border-primary text-primary bg-primary/5" : "border-border text-muted-foreground")}
                    >
                      {formatArabicNumber(preset)}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Dhikr Display */}
        <div className="text-center mb-10 mt-4 relative z-0">
          <motion.h2 
            key={activeDhikr}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl md:text-4xl font-bold text-primary font-display leading-loose"
          >
            {activeDhikr}
          </motion.h2>
        </div>

        {/* Main Counter Ring */}
        <div className="flex-1 flex flex-col items-center justify-center mb-16 relative z-0">
          <div className="relative w-[300px] h-[300px] flex items-center justify-center cursor-pointer select-none" onClick={handleTap}>
            {/* SVG Ring Background */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none drop-shadow-xl" viewBox="0 0 280 280">
              <circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-muted"
                strokeWidth="16"
                fill="none"
              />
              <motion.circle
                cx="140"
                cy="140"
                r={radius}
                className="stroke-primary drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                style={{ strokeDasharray: circumference }}
              />
            </svg>

            {/* Huge Button */}
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className={cn(
                "w-56 h-56 rounded-full flex flex-col items-center justify-center shadow-2xl transition-colors duration-300",
                count >= target 
                  ? "bg-gradient-to-br from-emerald-400 to-primary text-white" 
                  : "bg-gradient-to-br from-card to-secondary/30 text-foreground border-4 border-card"
              )}
            >
              {count >= target && count !== 0 ? (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <Check className="w-16 h-16 mb-2" />
                  <span className="text-xl font-bold">اكتمل الهدف!</span>
                </motion.div>
              ) : (
                <>
                  <span className="text-7xl font-bold tracking-tighter font-sans">
                    {formatArabicNumber(count)}
                  </span>
                  <span className="text-sm font-medium mt-2 text-muted-foreground">
                    اضغط للعد
                  </span>
                </>
              )}
            </motion.div>
          </div>
        </div>

        {/* Share Challenge Button */}
        <div className="mt-auto flex justify-center pb-6 z-10">
          <button 
            onClick={handleShare}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-emerald-500 text-white font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-1 transition-all active:translate-y-0"
          >
            <Share2 className="w-5 h-5" />
            <span>دعوة "سبّح معي"</span>
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
