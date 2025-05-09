import { Request, Response } from 'express';
import { IChallengeService } from '../types/interfaces/IChallengeService';
import { ChallengeType } from '../models/Challenge';

/**
 * Challenge controller
 * Handles HTTP requests related to DBT challenges
 */
export class ChallengeController {
  private challengeService: IChallengeService;

  constructor(challengeService: IChallengeService) {
    this.challengeService = challengeService;
  }

  /**
   * Get all challenges
   */
  getAllChallenges = async (req: Request, res: Response): Promise<void> => {
    try {
      const challenges = await this.challengeService.getAllChallenges();
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ message: 'Failed to fetch challenges' });
    }
  }

  /**
   * Get a single challenge by ID
   */
  getChallengeById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const challenge = await this.challengeService.getChallengeById(id);
      
      if (!challenge) {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }
      
      res.json(challenge);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      res.status(500).json({ message: 'Failed to fetch challenge' });
    }
  }

  /**
   * Create a new challenge (admin only)
   */
  createChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
      const { title, description, type, content, pointsReward, skillId } = req.body;
      
      // Validate challenge type
      if (!Object.values(ChallengeType).includes(type as ChallengeType)) {
        res.status(400).json({ message: 'Invalid challenge type' });
        return;
      }
      
      const newChallenge = await this.challengeService.createChallenge({
        title,
        description,
        type: type as ChallengeType,
        content,
        pointsReward: pointsReward || 20, // Default points reward
        skillId,
      });
      
      res.status(201).json(newChallenge);
    } catch (error) {
      console.error('Error creating challenge:', error);
      
      if (error instanceof Error && error.message === 'Missing required challenge fields') {
        res.status(400).json({ message: error.message });
        return;
      }
      
      res.status(500).json({ message: 'Failed to create challenge' });
    }
  }

  /**
   * Update a challenge (admin only)
   */
  updateChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, type, content, pointsReward, skillId } = req.body;
      
      // Validate challenge type if provided
      if (type && !Object.values(ChallengeType).includes(type as ChallengeType)) {
        res.status(400).json({ message: 'Invalid challenge type' });
        return;
      }
      
      const updatedChallenge = await this.challengeService.updateChallenge(id, {
        title,
        description,
        type: type as ChallengeType,
        content,
        pointsReward,
        skillId,
      });
      
      res.json(updatedChallenge);
    } catch (error) {
      console.error('Error updating challenge:', error);
      
      if (error instanceof Error && error.message === 'Challenge not found') {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to update challenge' });
    }
  }

  /**
   * Delete a challenge (admin only)
   */
  deleteChallenge = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.challengeService.deleteChallenge(id);
      
      res.json({ message: 'Challenge deleted successfully' });
    } catch (error) {
      console.error('Error deleting challenge:', error);
      
      if (error instanceof Error && error.message === 'Challenge not found') {
        res.status(404).json({ message: 'Challenge not found' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to delete challenge' });
    }
  }

  /**
   * Get challenges by skill ID
   */
  getChallengesBySkillId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { skillId } = req.params;
      const challenges = await this.challengeService.getChallengesBySkillId(skillId);
      
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching challenges by skill ID:', error);
      res.status(500).json({ message: 'Failed to fetch challenges' });
    }
  }

  /**
   * Save a user's challenge result
   */
  saveChallengeResult = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const { completed, score, answers, reflection } = req.body;
      
      await this.challengeService.saveUserResult(userId, id, {
        completed,
        score,
        answers,
        reflection,
      });
      
      res.json({ message: 'Challenge result saved successfully' });
    } catch (error) {
      console.error('Error saving challenge result:', error);
      
      if (error instanceof Error) {
        if (error.message === 'Challenge not found') {
          res.status(404).json({ message: 'Challenge not found' });
          return;
        } else if (
          error.message === 'Quiz challenges require a score when completed' ||
          error.message === 'Reflection challenges require reflection text when completed'
        ) {
          res.status(400).json({ message: error.message });
          return;
        }
      }
      
      res.status(500).json({ message: 'Failed to save challenge result' });
    }
  }

  /**
   * Get a user's results for a specific challenge
   */
  getChallengeResults = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const results = await this.challengeService.getUserResults(userId, id);
      
      if (!results) {
        res.json({ 
          completed: false,
          score: null,
          answers: null,
          reflection: null,
        });
        return;
      }
      
      res.json(results);
    } catch (error) {
      console.error('Error fetching challenge results:', error);
      res.status(500).json({ message: 'Failed to fetch challenge results' });
    }
  }
}
