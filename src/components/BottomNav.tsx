import { useLocation, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, BookOpen, Settings } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Family', icon: Users },
  { path: '/trends', label: 'Trends', icon: TrendingUp },
  { path: '/library', label: 'Expert Library', icon: BookOpen },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide on diagnostic/action-plan routes
  if (location.pathname.startsWith('/diagnostic') || location.pathname.startsWith('/action-plan') || location.pathname.startsWith('/setup')) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/40">
      <div className="max-w-[430px] mx-auto flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors ${
                active
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
