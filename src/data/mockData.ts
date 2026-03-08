import { Child, ActionPlan } from '@/types/vibecheck';

export const mockChildren: Child[] = [
  {
    id: '1',
    name: 'Emma',
    age: 14,
    avatar: '👧',
    vibeScore: 82,
    vibeZone: 'green',
    trendText: 'Stable for 5 days',
    trendDirection: 'stable',
  },
  {
    id: '2',
    name: 'Lucas',
    age: 11,
    avatar: '👦',
    vibeScore: 45,
    vibeZone: 'yellow',
    trendText: '3-day downward trend',
    trendDirection: 'down',
  },
  {
    id: '3',
    name: 'Mia',
    age: 8,
    avatar: '👧🏽',
    vibeScore: 25,
    vibeZone: 'red',
    trendText: 'Significant drop since Monday',
    trendDirection: 'down',
  },
  {
    id: '4',
    name: 'Noah',
    age: 16,
    avatar: '🧑',
    vibeScore: 91,
    vibeZone: 'green',
    trendText: 'Improving for 2 weeks',
    trendDirection: 'up',
  },
];

export const physicalOptions = [
  'Poor sleep',
  'Appetite change',
  'Academic drop',
  'Social withdrawal',
  'Physical complaints',
];

export const stressorOptions = [
  'Upcoming Exams',
  'Peer conflict',
  'Sports pressure',
  'No known reason',
];

export const mockActionPlan: ActionPlan = {
  status: 'Sustained Shift Detected (likely related to social dynamics)',
  conversationStarters: [
    '"Hey, I noticed you\'ve been a bit quieter lately. No pressure, but I\'m here whenever you want to talk about anything."',
    '"I read something interesting today about friendships. Want to hear it over ice cream?"',
    '"You know what I loved about today? [specific moment]. What was your favorite part?"',
  ],
  proTips: [
    {
      title: 'Physical Signs Matter',
      text: 'Did you know? Stomach aches are often the first physical sign of school anxiety. Watch for recurring complaints before school.',
    },
    {
      title: 'The 3-Day Rule',
      text: 'If a mood shift lasts more than 3 days, it\'s worth a gentle check-in. Shorter shifts are often normal emotional processing.',
    },
    {
      title: 'Screen Time Connection',
      text: 'Research shows that social media use after 9pm increases anxiety symptoms by 37% in teens.',
    },
  ],
  strategicActions: [
    {
      icon: '📱',
      title: 'Digital Detox Window',
      description: 'Set devices to Do Not Disturb from 7pm to 8am for the next week.',
    },
    {
      icon: '🍽️',
      title: 'Scheduled 1:1 Dinner',
      description: 'Plan a "Vibe-Check" dinner — just the two of you, no phones, this Thursday.',
    },
    {
      icon: '📝',
      title: 'Teacher Check-in',
      description: 'Send a brief, non-alarming email to their homeroom teacher asking about social dynamics.',
    },
    {
      icon: '🧑‍⚕️',
      title: 'Counselor Check-in',
      description: 'Schedule a session with your child\'s school counselor to discuss recent behavioral patterns and get professional guidance.',
    },
    {
      icon: '🧠',
      title: 'Talk to a Psychologist',
      description: 'Connect with a licensed child psychologist for expert strategies on supporting your child\'s emotional wellbeing.',
    },
  ],
};
