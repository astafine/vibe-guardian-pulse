import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendBadgeProps {
  text: string;
  direction: 'up' | 'stable' | 'down';
}

export default function TrendBadge({ text, direction }: TrendBadgeProps) {
  const Icon = direction === 'up' ? TrendingUp : direction === 'down' ? TrendingDown : Minus;
  
  return (
    <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
      direction === 'up' ? 'bg-mint-light/60 text-navy-deep' :
      direction === 'down' ? 'bg-destructive/10 text-destructive' :
      'bg-sand-warm text-muted-foreground'
    }`}>
      <Icon className="w-3 h-3" />
      <span>{text}</span>
    </div>
  );
}
