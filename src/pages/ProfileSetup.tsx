import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { User, GraduationCap, Calendar, Users } from 'lucide-react';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [sex, setSex] = useState('');
  const [role, setRole] = useState<'parent' | 'child' | ''>('');
  const [schoolName, setSchoolName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !sex) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase.from('profiles').insert({
        user_id: user.id,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        date_of_birth: dob,
        sex,
        role,
        school_name: role === 'child' ? schoolName.trim() || null : null,
      });

      if (error) throw error;
      toast.success('Profile created!');
      // Force page reload to pick up new profile in auth hook
      window.location.href = '/';
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[380px] space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl gradient-navy flex items-center justify-center mx-auto">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-extrabold text-foreground">Create Your Profile</h1>
          <p className="text-sm text-muted-foreground">Tell us a bit about yourself</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="firstName" className="text-xs font-semibold">First Name</Label>
              <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="First name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lastName" className="text-xs font-semibold">Last Name</Label>
              <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Last name" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="dob" className="text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Date of Birth
            </Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold">Sex</Label>
            <RadioGroup value={sex} onValueChange={setSex} className="flex gap-3">
              {['male', 'female', 'other'].map((s) => (
                <label key={s} className={`flex-1 glass-card rounded-xl p-3 text-center cursor-pointer transition-all ${sex === s ? 'ring-2 ring-primary' : ''}`}>
                  <RadioGroupItem value={s} className="sr-only" />
                  <span className="text-sm font-medium capitalize text-foreground">{s}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> I am a...
            </Label>
            <RadioGroup value={role} onValueChange={(v) => setRole(v as 'parent' | 'child')} className="flex gap-3">
              {[
                { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧' },
                { value: 'child', label: 'Child', icon: '🧒' },
              ].map((r) => (
                <label key={r.value} className={`flex-1 glass-card rounded-xl p-4 text-center cursor-pointer transition-all ${role === r.value ? 'ring-2 ring-primary' : ''}`}>
                  <RadioGroupItem value={r.value} className="sr-only" />
                  <div className="text-2xl mb-1">{r.icon}</div>
                  <span className="text-sm font-semibold text-foreground">{r.label}</span>
                </label>
              ))}
            </RadioGroup>
          </div>

          {role === 'child' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
              <Label htmlFor="school" className="text-xs font-semibold flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> School Name
              </Label>
              <Input id="school" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Your school name" />
            </motion.div>
          )}

          <Button type="submit" className="w-full gradient-navy text-primary-foreground font-bold py-3 rounded-xl mt-2" disabled={loading}>
            {loading ? 'Creating...' : 'Complete Setup'}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
