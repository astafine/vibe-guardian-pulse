import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { MentalStateEntry } from '@/hooks/useMentalState';
import { Brain, AlertTriangle, Smile, Zap, MessageCircle } from 'lucide-react';

interface MentalStateCardProps {
  entry: MentalStateEntry | null;
  history: MentalStateEntry[];
  loading: boolean;
}

function getMoodEmoji(mood: string) {
  const map: Record<string, string> = {
    positive: '😊', happy: '😄', neutral: '😐', negative: '😟',
    anxious: '😰', stressed: '😣', calm: '😌', excited: '🤩',
  };
  return map[mood?.toLowerCase()] || '🧠';
}

function getStressColor(level: number) {
  if (level <= 3) return 'text-mint-dark';
  if (level <= 6) return 'text-warning';
  return 'text-destructive';
}

export default function MentalStateCard({ entry, history, loading }: MentalStateCardProps) {
  if (loading) {
    return (
      <div className="glass-card-elevated rounded-2xl p-5 animate-pulse">
        <div className="h-5 bg-muted rounded w-40 mb-3" />
        <div className="h-32 bg-muted rounded" />
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="glass-card-elevated rounded-2xl p-5 text-center">
        <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No emotional data yet. Data will appear once the child's device starts sending messages.</p>
      </div>
    );
  }

  // Chart data from history
  const chartData = history.map((h) => ({
    time: new Date(h.analyzed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sentiment: Math.round(h.sentiment_score * 100),
    stress: h.stress_level * 10,
    energy: h.energy_level * 10,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Summary card */}
      <div className="glass-card-elevated rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{getMoodEmoji(entry.overall_mood)}</span>
          <div>
            <h4 className="font-bold text-foreground capitalize">{entry.overall_mood} mood</h4>
            <p className="text-xs text-muted-foreground">{entry.messages_analyzed} messages analyzed</p>
          </div>
        </div>

        <p className="text-sm text-foreground/80 mb-4">{entry.summary}</p>

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Zap className={`w-4 h-4 mx-auto mb-1 ${getStressColor(entry.stress_level)}`} />
            <p className="text-lg font-bold text-foreground">{entry.stress_level}/10</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Stress</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <Smile className="w-4 h-4 mx-auto mb-1 text-mint-dark" />
            <p className="text-lg font-bold text-foreground">{Math.round(entry.sentiment_score * 100)}%</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Sentiment</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <MessageCircle className="w-4 h-4 mx-auto mb-1 text-navy-light" />
            <p className="text-lg font-bold text-foreground">{entry.energy_level}/10</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Energy</p>
          </div>
        </div>

        {/* Red flags */}
        {entry.red_flags.length > 0 && (
          <div className="mt-4 bg-destructive/10 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-semibold text-destructive">Flags Detected</span>
            </div>
            <ul className="text-xs text-destructive/80 space-y-1">
              {entry.red_flags.map((f, i) => <li key={i}>• {f}</li>)}
            </ul>
          </div>
        )}

        {/* Positive signals */}
        {entry.positive_signals.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.positive_signals.map((s, i) => (
              <span key={i} className="text-[10px] bg-mint-light/60 text-navy-deep px-2 py-1 rounded-full">
                ✓ {s}
              </span>
            ))}
          </div>
        )}

        {/* Emotions */}
        {entry.emotions_detected.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.emotions_detected.map((e, i) => (
              <span key={i} className="text-[10px] bg-sand-warm text-muted-foreground px-2 py-1 rounded-full capitalize">
                {e}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="glass-card-elevated rounded-2xl p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Emotional Wellbeing Over Time</p>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(123, 38%, 74%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(123, 38%, 74%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="hsl(232, 20%, 46%)" />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(232, 20%, 46%)" />
              <Tooltip
                contentStyle={{
                  background: 'hsl(0, 0%, 100%)',
                  border: '1px solid hsl(232, 20%, 88%)',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="sentiment" stroke="hsl(123, 38%, 55%)" fill="url(#sentimentGrad)" strokeWidth={2} name="Sentiment %" />
              <Line type="monotone" dataKey="stress" stroke="hsl(0, 72%, 51%)" strokeWidth={1.5} dot={false} name="Stress %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
