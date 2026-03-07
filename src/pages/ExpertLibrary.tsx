import AppHeader from '@/components/AppHeader';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ArrowRight } from 'lucide-react';

const articles = [
  { title: 'Understanding Teen Anxiety', category: 'Mental Health', readTime: '5 min', color: 'bg-mint/20' },
  { title: 'Digital Wellness Strategies', category: 'Screen Time', readTime: '4 min', color: 'bg-warning/15' },
  { title: 'Building Emotional Resilience', category: 'Parenting', readTime: '6 min', color: 'bg-primary/10' },
  { title: 'Recognizing Bullying Signs', category: 'School', readTime: '3 min', color: 'bg-destructive/10' },
  { title: 'Sleep Hygiene for Kids', category: 'Health', readTime: '4 min', color: 'bg-mint/20' },
];

export default function ExpertLibrary() {
  return (
    <div className="min-h-screen pb-24">
      <AppHeader title="Expert Library" subtitle="Evidence-based guidance" />
      <div className="px-5 mt-4 space-y-3">
        {articles.map((article, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card-elevated rounded-2xl p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-xl ${article.color} flex items-center justify-center flex-shrink-0`}>
              <BookOpen className="w-5 h-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground leading-tight">{article.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{article.category}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />{article.readTime}
                </span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
