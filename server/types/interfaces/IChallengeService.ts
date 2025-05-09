import { Challenge, ChallengeType } from '../../models/Challenge';

/**
 * Challenge service interface
 * Defines business operations for DBT challenges
 */
export interface IChallengeService {
  getAllChallenges(): Promise<Challenge[]>;
  getChallengeById(id: string): Promise<Challenge | null>;
  createChallenge(data: Partial<Challenge>): Promise<Challenge>;
  updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge>;
  deleteChallenge(id: string): Promise<boolean>;
  getChallengesBySkillId(skillId: string): Promise<Challenge[]>;
  getChallengesByType(type: ChallengeType): Promise<Challenge[]>;
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
