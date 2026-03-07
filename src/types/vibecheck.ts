export type VibeZone = 'green' | 'yellow' | 'red';

export interface Child {
  id: string;
  name: string;
  age: number;
  avatar: string;
  vibeScore: number; // 0-100
  vibeZone: VibeZone;
  trendText: string;
  trendDirection: 'up' | 'stable' | 'down';
}

export interface DiagnosticAnswer {
  physical: string[];
  stressors: string[];
}

export interface ActionPlan {
  status: string;
  conversationStarters: string[];
  proTips: { title: string; text: string }[];
  strategicActions: { icon: string; title: string; description: string }[];
}
