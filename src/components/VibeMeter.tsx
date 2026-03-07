import { motion } from 'framer-motion';
import { VibeZone } from '@/types/vibecheck';

interface VibeMeterProps {
  score: number;
  zone: VibeZone;
  size?: number;
}

const zoneColors: Record<VibeZone, { start: string; end: string }> = {
  green: { start: '#66BB6A', end: '#A5D6A7' },
  yellow: { start: '#FFA726', end: '#FFD54F' },
  red: { start: '#EF5350', end: '#FF8A80' },
};

const zoneLabels: Record<VibeZone, string> = {
  green: 'Healthy',
  yellow: 'Observation',
  red: 'Support Needed',
};

export default function VibeMeter({ score, zone, size = 120 }: VibeMeterProps) {
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = Math.PI * radius;
  const progress = (score / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;
  const colors = zoneColors[zone];

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`}>
        <defs>
          <linearGradient id={`grad-${zone}-${score}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.start} />
            <stop offset="100%" stopColor={colors.end} />
          </linearGradient>
        </defs>
        {/* Background arc */}
        <path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke="hsl(var(--sand-warm))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Progress arc */}
        <motion.path
          d={`M ${strokeWidth / 2} ${cy} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${cy}`}
          fill="none"
          stroke={`url(#grad-${zone}-${score})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        {/* Score text */}
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          className="fill-foreground font-bold"
          fontSize={size * 0.2}
        >
          {score}
        </text>
      </svg>
      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        zone === 'green' ? 'bg-mint-light text-navy-deep' :
        zone === 'yellow' ? 'bg-warning/20 text-warning-foreground' :
        'bg-destructive/15 text-destructive'
      }`}>
        {zoneLabels[zone]}
      </span>
    </div>
  );
}
