import { Router } from 'express';
import { isAdmin } from '../middleware/auth';
import { DIContainer } from '../config/di-container';
import { prisma } from '../server';

const router = Router();
const diContainer = DIContainer.getInstance(prisma);
const challengeController = diContainer.getChallengeController();

// Get all challenges
router.get('/', challengeController.getAllChallenges);

// Get challenges by skill ID
router.get('/by-skill/:skillId', challengeController.getChallengesBySkillId);

// Get a single challenge by ID
router.get('/:id', challengeController.getChallengeById);

// Create a new challenge (admin only)
router.post('/', isAdmin, challengeController.createChallenge);

// Update a challenge (admin only)
router.put('/:id', isAdmin, challengeController.updateChallenge);

// Delete a challenge (admin only)
router.delete('/:id', isAdmin, challengeController.deleteChallenge);

// Submit challenge result
router.post('/:id/submit', challengeController.saveChallengeResult);

// Get user result for a challenge
router.get('/:id/result', challengeController.getChallengeResults);

export default router;
