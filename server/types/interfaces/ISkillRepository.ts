import { Skill } from '../../models/Skill';
import { IRepository } from './IRepository';

/**
 * Skill repository interface
 * Extends base repository with skill-specific operations
 */
export interface ISkillRepository extends IRepository<Skill, string> {
  findWithChallenges(id: string): Promise<Skill | null>;
  findAllWithModule(): Promise<Skill[]>;
  calculateUserProgress(userId: string, skillId: string): Promise<{
    skillId: string;
    skillName: string;
    totalChallenges: number;
    completedChallenges: number;
    completedChallengeIds: string[];
    percentage: number;
    isCompleted: boolean;
  }>;
}
