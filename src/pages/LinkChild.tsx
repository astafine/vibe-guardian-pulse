import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import AppHeader from '@/components/AppHeader';
import { QrCode, CheckCircle2, Link2 } from 'lucide-react';
import { toast } from 'sonner';

export default function LinkChild() {
  const navigate = useNavigate();
  const [linkCode, setLinkCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [linked, setLinked] = useState(false);

  const handleLink = async () => {
    if (!linkCode.trim()) {
      toast.error('Please enter a link code');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.rpc('link_parent_to_child', {
        p_link_code: linkCode.trim(),
      });
      if (error) throw error;
      setLinked(true);
      toast.success('Child linked successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Invalid link code');
    } finally {
      setLoading(false);
    }
  };

  if (linked) {
    return (
      <div className="min-h-screen pb-8">
        <AppHeader title="Link Child" showBack onBack={() => navigate('/')} />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center px-5 py-16"
        >
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
            <CheckCircle2 className="w-10 h-10 text-secondary-foreground" />
          </div>
          <h2 className="text-2xl font-extrabold text-foreground">Linked!</h2>
          <p className="text-sm text-muted-foreground mt-2">Your child's profile is now connected.</p>
          <Button onClick={() => navigate('/')} className="mt-8 gradient-navy text-primary-foreground font-bold rounded-xl">
            Go to Dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-8">
      <AppHeader title="Link Child" subtitle="Connect to your child's profile" showBack onBack={() => navigate('/')} />
      <div className="px-5 mt-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center"
        >
          <div className="w-20 h-20 rounded-2xl gradient-navy flex items-center justify-center mb-4">
            <QrCode className="w-9 h-9 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Enter Link Code</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-[300px]">
            Ask your child to open their Vibecheck profile and share the link code displayed there.
          </p>
        </motion.div>

        <div className="space-y-4">
          <div className="relative">
            <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={linkCode}
              onChange={(e) => setLinkCode(e.target.value)}
              placeholder="Enter 12-character code"
              className="pl-10 text-center tracking-widest font-mono text-lg"
              maxLength={12}
            />
          </div>
          <Button onClick={handleLink} disabled={loading} className="w-full gradient-navy text-primary-foreground font-bold py-3 rounded-xl">
            {loading ? 'Linking...' : 'Link Child'}
          </Button>
        </div>
      </div>
    </div>
  );
}
