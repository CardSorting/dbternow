import { IChallengeService } from '../types/interfaces/IChallengeService';
import { IChallengeRepository } from '../types/interfaces/IChallengeRepository';
import { Challenge, ChallengeType } from '../models/Challenge';

/**
 * Challenge service implementation
 * Handles business logic for DBT challenges
 */
export class ChallengeService implements IChallengeService {
  private challengeRepository: IChallengeRepository;

  constructor(challengeRepository: IChallengeRepository) {
    this.challengeRepository = challengeRepository;
  }

  /**
   * Get all challenges
   */
  async getAllChallenges(): Promise<Challenge[]> {
    return this.challengeRepository.findAll();
  }

  /**
   * Get a single challenge by ID
   */
  async getChallengeById(id: string): Promise<Challenge | null> {
    return this.challengeRepository.findById(id);
  }

  /**
   * Create a new challenge
   */
  async createChallenge(data: Partial<Challenge>): Promise<Challenge> {
    // Validate challenge data
    if (!data.title || !data.description || !data.type || !data.content || !data.skillId) {
      throw new Error('Missing required challenge fields');
    }
    
    return this.challengeRepository.create(data);
  }

  /**
   * Update an existing challenge
   */
  async updateChallenge(id: string, data: Partial<Challenge>): Promise<Challenge> {
    // Check if challenge exists
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    return this.challengeRepository.update(id, data);
  }

  /**
   * Delete a challenge
   */
  async deleteChallenge(id: string): Promise<boolean> {
    // Check if challenge exists
    const challenge = await this.challengeRepository.findById(id);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    return this.challengeRepository.delete(id);
  }

  /**
   * Get challenges by skill ID
   */
  async getChallengesBySkillId(skillId: string): Promise<Challenge[]> {
    return this.challengeRepository.findBySkillId(skillId);
  }

  /**
   * Get challenges by type
   */
  async getChallengesByType(type: ChallengeType): Promise<Challenge[]> {
    const allChallenges = await this.challengeRepository.findAll();
    return allChallenges.filter(challenge => challenge.type === type);
  }

  /**
   * Save a user's challenge result
   */
  async saveUserResult(userId: string, challengeId: string, result: {
    completed: boolean;
    score?: number;
    answers?: any;
    reflection?: string;
  }): Promise<void> {
    // Validate that the challenge exists
    const challenge = await this.challengeRepository.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    
    // Validate result data based on challenge type
    if (challenge.type === ChallengeType.QUIZ && result.completed && result.score === undefined) {
      throw new Error('Quiz challenges require a score when completed');
    }
    
    if (challenge.type === ChallengeType.REFLECTION && result.completed && !result.reflection) {
      throw new Error('Reflection challenges require reflection text when completed');
    }
    
    await this.challengeRepository.saveUserResult(userId, challengeId, result);
  }

  /**
   * Get a user's results for a specific challenge
   */
  async getUserResults(userId: string, challengeId: string): Promise<{
    completed: boolean;
    score: number | null;
    answers: any | null;
    reflection: string | null;
  } | null> {
    return this.challengeRepository.getUserResults(userId, challengeId);
  }
}
