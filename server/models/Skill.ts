import { Challenge } from './Challenge';

/**
 * Skill domain model
 * Represents a DBT skill entity within a module
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  pointsReward: number;
  order: number;
  moduleId: string;
  createdAt: Date;
  updatedAt: Date;
  challenges?: Challenge[];
}
