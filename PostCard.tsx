import { Share2, BookmarkPlus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { IslamicPost } from "@workspace/api-client-react/src/generated/api.schemas";
import { useState } from "react";

interface PostCardProps {
  post: IslamicPost;
}

export function PostCard({ post }: PostCardProps) {
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = async () => {
    const textToShare = `${post.arabicText}\n\n${post.translation}\n\n[المصدر: ${post.source}]\n\n- تطبيق نور`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'بطاقة نور',
          text: textToShare,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(textToShare);
      // Fallback could be a toast notification here
      alert("تم نسخ النص!");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ayah': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200/30';
      case 'hadith': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200/30';
      case 'dua': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200/30';
      case 'tip': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200/30';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'ayah': return 'قرآن كريم';
      case 'hadith': return 'حديث شريف';
      case 'dua': return 'دعاء';
      case 'tip': return 'نصيحة';
      case 'reminder': return 'تذكير';
      default: return 'فائدة';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 border border-border/60 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
    >
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full -z-0 opacity-50" />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold border", getCategoryColor(post.category))}>
            {getCategoryLabel(post.category)}
          </span>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsSaved(!isSaved)}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <BookmarkPlus className={cn("w-5 h-5", isSaved && "fill-primary text-primary")} />
            </button>
            <button 
              onClick={handleShare}
              className="p-2 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-8">
          <p className="quran-text text-2xl md:text-3xl lg:text-4xl text-foreground font-bold leading-loose text-justify mb-6 mt-4">
            {post.arabicText}
            {post.ayahNumber && <span className="text-primary text-xl mx-2 font-sans opacity-80">﴿{post.ayahNumber}﴾</span>}
          </p>
          <p className="text-muted-foreground/90 text-sm md:text-base leading-relaxed border-r-2 border-primary/30 pr-4">
            {post.translation}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <span className="text-xs font-semibold text-muted-foreground">
              {post.source}
              {post.surah && ` - سورة ${post.surah}`}
            </span>
          </div>
          
          <div className="flex gap-2">
            {post.tags.map(tag => (
              <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
