import { Challenge } from '../../models/Challenge';
import { IRepository } from './IRepository';

/**
 * Challenge repository interface
 * Extends base repository with challenge-specific operations
 */
export interface IChallengeRepository extends IRepository<Challenge, string> {
  findBySkillId(skillId: string): Promise<Challenge[]>;
  saveUserResult(userId: string, challengeId: string, result: {
    completed: boolean;
    score?: number;
    answers?: any;
    reflection?: string;
  }): Promise<void>;
  getUserResults(userId: string, challengeId: string): Promise<{
    completed: boolean;
    score: number | null;
    answers: any | null;
    reflection: string | null;
  } | null>;
}
