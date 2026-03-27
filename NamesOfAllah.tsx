import { AppLayout } from "@/components/layout/AppLayout";
import { useGetNamesOfAllah } from "@workspace/api-client-react";
import { LoadingSpinner, ErrorState } from "@/components/ui/States";
import { useState } from "react";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import { formatArabicNumber } from "@/lib/utils";

export default function NamesOfAllah() {
  const { data, isLoading, isError } = useGetNamesOfAllah();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNames = data?.names?.filter(name => 
    name.name.includes(searchTerm) || 
    name.meaning.includes(searchTerm) ||
    name.transliteration.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout title="أسماء الله الحسنى">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header & Search */}
        <div className="mb-10 text-center relative z-10">
          <h1 className="text-4xl font-bold text-primary mb-4 font-display">أسماء الله الحسنى</h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed mb-8">
            وَلِلَّهِ الْأَسْمَاءُ الْحُسْنَى فَادْعُوهُ بِهَا (الأعراف: 180)
            <br/>تعرف على معاني أسماء الله الـ 99 وتأمل في عظمته.
          </p>
          
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              placeholder="ابحث بالاسم أو المعنى..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-4 pr-12 py-4 bg-card border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium text-foreground shadow-sm"
            />
          </div>
        </div>

        {/* Content Grid */}
        {isLoading ? (
          <LoadingSpinner text="جاري جلب الأسماء الحسنى..." />
        ) : isError ? (
          <ErrorState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
            {filteredNames?.length === 0 ? (
              <div className="col-span-full text-center py-20 text-muted-foreground font-medium">
                لم يتم العثور على اسم مطابق لبحثك.
              </div>
            ) : (
              filteredNames?.map((nameItem, idx) => (
                <motion.div
                  key={nameItem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(idx * 0.05, 0.5) }}
                  className="bg-card rounded-3xl p-6 shadow-xl shadow-black/5 border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
                >
                  {/* Decorative number watermark */}
                  <div className="absolute -top-4 -left-4 text-8xl font-sans font-black text-primary/5 select-none pointer-events-none group-hover:text-primary/10 transition-colors">
                    {formatArabicNumber(nameItem.id)}
                  </div>
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <span className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary font-bold shadow-inner">
                      {formatArabicNumber(nameItem.id)}
                    </span>
                    <h2 className="text-3xl font-bold text-foreground font-display text-primary drop-shadow-sm">
                      {nameItem.name}
                    </h2>
                  </div>
                  
                  <div className="mt-2 relative z-10 flex-1">
                    <p className="font-bold text-sm text-accent-foreground mb-2">المعنى:</p>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                      {nameItem.meaning}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50 relative z-10 mt-auto">
                    <p className="text-xs text-muted-foreground font-mono bg-muted inline-block px-2 py-1 rounded">
                      {nameItem.transliteration}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
