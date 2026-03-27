import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <AppLayout title="الصفحة غير موجودة">
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-6">
          <FileQuestion className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4 font-display">الصفحة غير موجودة</h1>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التأكد من الرابط أو العودة للرئيسية.
        </p>
        <Link href="/">
          <button className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30 transition-all cursor-pointer">
            العودة للرئيسية
          </button>
        </Link>
      </div>
    </AppLayout>
  );
}
