import { AppLayout } from "@/components/layout/AppLayout";
import { useRoute, Link } from "wouter";
import { useGetAdhkarByCategory } from "@workspace/api-client-react";
import { LoadingSpinner, ErrorState } from "@/components/ui/States";
import { ChevronRight, CheckCircle2, RotateCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { cn, formatArabicNumber } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function DhikrItem({ dhikr, index }: { dhikr: any, index: number }) {
  const [count, setCount] = useState(dhikr.repetitions);
  const isCompleted = count === 0;

  // Haptic feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleTap = () => {
    if (count > 0) {
      setCount(prev => prev - 1);
      triggerHaptic();
    }
  };

  const resetCount = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCount(dhikr.repetitions);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.1, 0.5) }}
      onClick={handleTap}
      className={cn(
        "relative rounded-3xl p-6 md:p-8 border transition-all duration-500 cursor-pointer overflow-hidden group",
        isCompleted 
          ? "bg-emerald-500/5 border-emerald-500/20 shadow-none" 
          : "bg-card border-border/60 shadow-xl shadow-black/5 hover:border-primary/40 hover:shadow-2xl"
      )}
    >
      <div className="flex justify-between items-start mb-6">
        <span className={cn(
          "flex items-center justify-center w-10 h-10 rounded-full font-bold font-sans text-sm",
          isCompleted ? "bg-emerald-500/20 text-emerald-600" : "bg-primary/10 text-primary"
        )}>
          {formatArabicNumber(index + 1)}
        </span>
        
        {/* Counter UI */}
        <div className="flex items-center gap-3 z-10">
          <AnimatePresence>
            {count < dhikr.repetitions && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                onClick={resetCount}
                className="p-2 rounded-full bg-muted hover:bg-secondary text-muted-foreground"
              >
                <RotateCcw className="w-4 h-4" />
              </motion.button>
            )}
          </AnimatePresence>
          <div className={cn(
            "flex flex-col items-center justify-center min-w-[64px] px-4 py-2 rounded-xl transition-all duration-300",
            isCompleted 
              ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30" 
              : "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
          )}>
            {isCompleted ? (
              <CheckCircle2 className="w-5 h-5 animate-in zoom-in" />
            ) : (
              <span className="text-xl font-bold leading-none">{formatArabicNumber(count)}</span>
            )}
            {!isCompleted && <span className="text-[10px] opacity-80 mt-1 leading-none">مرة</span>}
          </div>
        </div>
      </div>

      <div className={cn("transition-opacity duration-500", isCompleted && "opacity-60")}>
        <p className="quran-text text-2xl md:text-3xl font-bold leading-loose text-justify mb-6 text-foreground">
          {dhikr.arabicText}
        </p>
        
        {dhikr.virtue && (
          <div className="bg-secondary/50 rounded-xl p-4 mb-4 border border-secondary">
            <span className="text-xs font-bold text-accent-foreground block mb-1">فضله:</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{dhikr.virtue}</p>
          </div>
        )}
        
        <p className="text-xs text-muted-foreground text-left w-full mt-4">
          المصدر: {dhikr.source}
        </p>
      </div>

      {/* Ripple/Tap effect layer */}
      {!isCompleted && (
        <div className="absolute inset-0 bg-primary/0 group-active:bg-primary/5 transition-colors duration-100" />
      )}
    </motion.div>
  );
}

export default function AdhkarList() {
  const [, params] = useRoute("/adhkar/:id");
  const categoryId = params?.id || "";
  
  const { data, isLoading, isError } = useGetAdhkarByCategory(categoryId);

  return (
    <AppLayout title="الأذكار" hideHeader>
      {/* Custom sticky header with back button */}
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 py-4 flex items-center gap-3">
        <Link href="/adhkar">
          <button className="p-2 -ml-2 rounded-full hover:bg-muted text-foreground transition-colors cursor-pointer">
            <ChevronRight className="w-6 h-6" />
          </button>
        </Link>
        <h1 className="text-xl font-bold text-foreground font-display flex-1">
          {data?.category?.nameAr || "قراءة الأذكار"}
        </h1>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {isLoading ? (
          <LoadingSpinner text="جاري تحميل الأذكار..." />
        ) : isError ? (
          <ErrorState />
        ) : (
          <div className="space-y-6 pb-10">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/20 flex gap-4 items-center">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                 <span className="text-primary font-bold text-lg">{formatArabicNumber(data?.adhkar?.length || 0)}</span>
               </div>
               <div>
                 <h3 className="font-bold text-foreground">تعليمات</h3>
                 <p className="text-xs text-muted-foreground">انقر على البطاقة أو المربع لحساب التكرار.</p>
               </div>
            </div>

            {data?.adhkar?.sort((a, b) => a.order - b.order).map((dhikr, idx) => (
              <DhikrItem key={dhikr.id} dhikr={dhikr} index={idx} />
            ))}
            
            <div className="text-center pt-8 pb-4">
              <p className="text-sm font-bold text-primary">تقبل الله طاعتكم</p>
              <Link href="/adhkar">
                <button className="mt-4 px-6 py-2.5 rounded-full bg-secondary text-secondary-foreground font-medium text-sm hover:bg-secondary/80 transition-colors">
                  العودة للأقسام
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
