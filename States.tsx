import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export function LoadingSpinner({ text = "جاري التحميل..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full text-muted-foreground">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-8 h-8 text-primary mb-4" />
      </motion.div>
      <p className="text-sm font-medium animate-pulse">{text}</p>
    </div>
  );
}

export function ErrorState({ title = "حدث خطأ", message = "لم نتمكن من تحميل البيانات. يرجى المحاولة لاحقاً." }: { title?: string, message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] w-full text-center px-4">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-destructive" />
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}

export function EmptyState({ title = "لا يوجد محتوى", message = "لم يتم العثور على أية بيانات مطابقة.", icon: Icon }: { title?: string, message?: string, icon?: React.ElementType }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] w-full text-center px-4">
      <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4 border border-border">
        {Icon ? <Icon className="w-8 h-8 text-muted-foreground" /> : <div className="w-8 h-8 opacity-50">📿</div>}
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{message}</p>
    </div>
  );
}
