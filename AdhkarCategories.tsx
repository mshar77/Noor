import { AppLayout } from "@/components/layout/AppLayout";
import { Link } from "wouter";
import { useGetAdhkarCategories } from "@workspace/api-client-react";
import { LoadingSpinner, ErrorState } from "@/components/ui/States";
import { Sunrise, Sunset, MoonStar, Sun, Heart, Shield, Sparkles, BookHeart } from "lucide-react";
import { motion } from "framer-motion";

export default function AdhkarCategories() {
  const { data, isLoading, isError } = useGetAdhkarCategories();

  // Helper to map icon names to Lucide components if API returns generic strings
  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'sunrise': return <Sunrise className="w-8 h-8" />;
      case 'sunset': return <Sunset className="w-8 h-8" />;
      case 'moon': return <MoonStar className="w-8 h-8" />;
      case 'sun': return <Sun className="w-8 h-8" />;
      case 'heart': return <Heart className="w-8 h-8" />;
      case 'shield': return <Shield className="w-8 h-8" />;
      case 'names': return <Sparkles className="w-8 h-8" />;
      default: return <BookHeart className="w-8 h-8" />;
    }
  };

  return (
    <AppLayout title="الأذكار والأدعية">
      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10">
        
        <div className="mb-8 px-2 text-center md:text-right">
          <h1 className="text-3xl font-bold text-foreground mb-3 font-display">حصن المسلم</h1>
          <p className="text-muted-foreground text-sm">ألا بذكر الله تطمئن القلوب. اختر القسم للبدء.</p>
        </div>

        {isLoading ? (
          <LoadingSpinner text="جاري تحميل الأقسام..." />
        ) : isError ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {data?.categories?.map((category, idx) => (
              <Link key={category.id} href={`/adhkar/${category.id}`}>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card p-6 rounded-3xl border border-border/50 shadow-lg shadow-black/5 hover:shadow-xl hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 text-center flex flex-col items-center gap-4 cursor-pointer group h-full"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                    {getIcon(category.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{category.nameAr}</h3>
                    <p className="text-xs text-muted-foreground">{category.count} ذِكر</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
