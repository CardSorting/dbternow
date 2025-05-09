// Auth Types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  points: number;
  level: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// DBT Module Types
export interface Module {
  id: string;
  name: string;
  description: string;
  icon?: string;
  order: number;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  pointsReward: number;
  order: number;
  moduleId: string;
  module?: Module;
  challenges?: Challenge[];
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'QUIZ' | 'REFLECTION' | 'PRACTICE' | 'SCENARIO' | 'MEDITATION';
  content: string;
  pointsReward: number;
  skillId: string;
  skill?: Skill;
  createdAt: string;
  updatedAt: string;
}

// Progress Types
export interface Progress {
  id: string;
  userId: string;
  moduleId: string;
  percentage: number;
  module?: Module;
  createdAt: string;
  updatedAt: string;
}

export interface CompletedSkill {
  id: string;
  userId: string;
  skillId: string;
  skill?: Skill;
  createdAt: string;
}

export interface ChallengeResult {
  id: string;
  userId: string;
  challengeId: string;
  completed: boolean;
  score?: number;
  answers?: any;
  reflection?: string;
  challenge?: Challenge;
  createdAt: string;
  updatedAt: string;
}

// Achievement Types
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  pointsReward: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  achievement?: Achievement;
  awardedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
  status: number;
}
