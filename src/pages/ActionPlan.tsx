import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import AppHeader from '@/components/AppHeader';
import { mockActionPlan } from '@/data/mockData';
import { MessageCircle, Lightbulb, Target, AlertTriangle } from 'lucide-react';

export default function ActionPlan() {
  const navigate = useNavigate();
  const location = useLocation();
  const child = location.state?.child;

  const plan = mockActionPlan;
  const delay = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.12 } });

  return (
    <div className="min-h-screen pb-8">
      <AppHeader
        title="Action Plan"
        subtitle={child?.name ? `For ${child.name}` : 'Your plan'}
        showBack
        onBack={() => navigate('/')}
      />

      <div className="px-5 mt-4 space-y-5">
        {/* Status Banner */}
        <motion.div {...delay(0)} className="glass-card-elevated rounded-2xl p-5 border-l-4 border-warning">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
              <p className="font-bold text-foreground mt-1">{plan.status}</p>
            </div>
          </div>
        </motion.div>

        {/* Conversation Starters */}
        <motion.div {...delay(1)}>
          <SectionHeader icon={MessageCircle} title="Conversation Starters" />
          <div className="space-y-3 mt-3">
            {plan.conversationStarters.map((text, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <p className="text-sm text-foreground leading-relaxed italic">{text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div {...delay(2)}>
          <SectionHeader icon={Lightbulb} title="Expert Advice" />
          <div className="space-y-3 mt-3">
            {plan.proTips.map((tip, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <p className="font-bold text-sm text-foreground">{tip.title}</p>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{tip.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Strategic Actions */}
        <motion.div {...delay(3)}>
          <SectionHeader icon={Target} title="Strategic Actions" />
          <div className="space-y-3 mt-3">
            {plan.strategicActions.map((action, i) => (
              <div key={i} className="glass-card-elevated rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">{action.icon}</span>
                <div>
                  <p className="font-bold text-sm text-foreground">{action.title}</p>
                  <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{action.description}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.button
          {...delay(4)}
          onClick={() => navigate('/')}
          className="w-full gradient-navy text-primary-foreground font-bold py-3.5 rounded-xl"
        >
          Back to Family
        </motion.button>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg gradient-mint flex items-center justify-center">
        <Icon className="w-4 h-4 text-navy-deep" />
      </div>
      <h3 className="font-bold text-foreground">{title}</h3>
    </div>
  );
}
