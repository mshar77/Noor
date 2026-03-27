import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PostCard } from "@/components/PostCard";
import { useGetDailyPosts } from "@workspace/api-client-react";
import { LoadingSpinner, ErrorState } from "@/components/ui/States";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

const CATEGORIES = [
  { id: 'all', label: 'الكل' },
  { id: 'ayah', label: 'آيات' },
  { id: 'hadith', label: 'أحاديث' },
  { id: 'dua', label: 'أدعية' },
  { id: 'tip', label: 'نصائح' }
];

export default function Feed() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Convert 'all' to undefined for the API if needed based on API behavior, 
  // but schema allows 'all' as an enum value.
  const { data, isLoading, isError } = useGetDailyPosts({
    category: activeCategory as any
  });

  const todayStr = format(new Date(), "EEEE، d MMMM yyyy", { locale: ar });

  return (
    <AppLayout title="بطاقات النور">
      <div className="max-w-3xl mx-auto px-4 py-6 md:py-10">
        
        {/* Welcome Section */}
        <div className="mb-8 px-2">
          <h2 className="text-sm font-semibold text-primary mb-1">{todayStr}</h2>
          <h1 className="text-3xl font-bold text-foreground mb-3 font-display">إشراقات اليوم</h1>
          <p className="text-muted-foreground text-sm">مقتطفات إيمانية تجدد بها روحك وتضيء يومك.</p>
        </div>

        {/* Categories Filter */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-8 pb-2 px-2 -mx-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer shadow-sm",
                activeCategory === cat.id 
                  ? "bg-primary text-primary-foreground shadow-primary/30" 
                  : "bg-card text-muted-foreground border border-border hover:bg-muted hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Feed Content */}
        {isLoading ? (
          <LoadingSpinner text="جاري جلب بطاقات النور..." />
        ) : isError ? (
          <ErrorState />
        ) : data?.posts?.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">لا توجد بطاقات متاح اليوم لهذا القسم.</div>
        ) : (
          <div className="space-y-8">
            {data?.posts?.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
