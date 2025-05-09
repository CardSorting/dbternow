import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { isAdmin } from '../middleware/auth';

// Define interface for Challenge
interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  pointsReward: number;
  skillId: string;
}

const router = Router();

// Get all challenges
router.get('/', async (req: Request, res: Response) => {
  try {
    const challenges = await prisma.challenge.findMany();
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
});

// Get challenges by type
router.get('/type/:type', async (req: Request, res: Response) => {
  try {
    const { type } = req.params;
    
    const challenges = await prisma.challenge.findMany({
      where: { type: type as any },
    });
    
    res.json(challenges);
  } catch (error) {
    console.error('Error fetching challenges by type:', error);
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
});

// Get a single challenge by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });
    
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }
    
    res.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Failed to fetch challenge' });
  }
});

// Create a new challenge (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const { title, description, type, content, pointsReward, skillId } = req.body;
    
    const newChallenge = await prisma.challenge.create({
      data: {
        title,
        description,
        type,
        content,
        pointsReward,
        skillId,
      },
    });
    
    res.status(201).json(newChallenge);
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Failed to create challenge' });
  }
});

// Update a challenge (admin only)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, type, content, pointsReward, skillId } = req.body;
    
    const updatedChallenge = await prisma.challenge.update({
      where: { id },
      data: {
        title,
        description,
        type,
        content,
        pointsReward,
        skillId,
      },
    });
    
    res.json(updatedChallenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    res.status(500).json({ message: 'Failed to update challenge' });
  }
});

// Delete a challenge (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First delete any related records
    await prisma.challengeResult.deleteMany({ where: { challengeId: id } });
    
    // Then delete the challenge
    await prisma.challenge.delete({
      where: { id },
    });
    
    res.json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error);
    res.status(500).json({ message: 'Failed to delete challenge' });
  }
});

// Submit a challenge result
router.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { completed, answers, reflection, score } = req.body;
    
    // Check if challenge exists
    const challenge = await prisma.challenge.findUnique({
      where: { id },
    });
    
    if (!challenge) {
      res.status(404).json({ message: 'Challenge not found' });
      return;
    }
    
    // Check if already completed
    const existingResult = await prisma.challengeResult.findFirst({
      where: {
        userId,
        challengeId: id,
        completed: true,
      },
    });
    
    let result;
    
    if (existingResult) {
      // Update existing result
      result = await prisma.challengeResult.update({
        where: { id: existingResult.id },
        data: {
          completed,
          answers: answers ? JSON.stringify(answers) : undefined,
          reflection,
          score,
        },
      });
    } else {
      // Create new result
      result = await prisma.challengeResult.create({
        data: {
          userId,
          challengeId: id,
          completed,
          answers: answers ? JSON.stringify(answers) : undefined,
          reflection,
          score,
        },
      });
      
      // If completed, award points to user
      if (completed) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            points: {
              increment: challenge.pointsReward,
            },
          },
        });
        
        // Check for challenge-related achievements
        const completedChallenges = await prisma.challengeResult.count({
          where: {
            userId,
            completed: true,
          },
        });
        
        // Example: Award achievement for completing 5 challenges
        if (completedChallenges === 5) {
          const challengeAchievement = await prisma.achievement.findFirst({
            where: {
              condition: 'Complete any 5 challenges across all skills',
            },
          });
          
          if (challengeAchievement) {
            // Check if user already has this achievement
            const hasAchievement = await prisma.userAchievement.findFirst({
              where: {
                userId,
                achievementId: challengeAchievement.id,
              },
            });
            
            if (!hasAchievement) {
              // Award achievement
              await prisma.userAchievement.create({
                data: {
                  userId,
                  achievementId: challengeAchievement.id,
                },
              });
              
              // Add achievement points
              await prisma.user.update({
                where: { id: userId },
                data: {
                  points: {
                    increment: challengeAchievement.pointsReward,
                  },
                },
              });
            }
          }
        }
        
        // Example: Award achievement for perfect quiz score
        if (challenge.type === 'QUIZ' && score === 100) {
          const perfectScoreAchievement = await prisma.achievement.findFirst({
            where: {
              condition: 'Score 100% on any quiz challenge',
            },
          });
          
          if (perfectScoreAchievement) {
            const hasAchievement = await prisma.userAchievement.findFirst({
              where: {
                userId,
                achievementId: perfectScoreAchievement.id,
              },
            });
            
            if (!hasAchievement) {
              await prisma.userAchievement.create({
                data: {
                  userId,
                  achievementId: perfectScoreAchievement.id,
                },
              });
              
              await prisma.user.update({
                where: { id: userId },
                data: {
                  points: {
                    increment: perfectScoreAchievement.pointsReward,
                  },
                },
              });
            }
          }
        }
      }
    }
    
    res.status(201).json({
      message: 'Challenge result submitted successfully',
      result,
      pointsAwarded: completed ? challenge.pointsReward : 0,
    });
  } catch (error) {
    console.error('Error submitting challenge result:', error);
    res.status(500).json({ message: 'Failed to submit challenge result' });
  }
});

// Get challenge result for current user
router.get('/:id/result', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const result = await prisma.challengeResult.findFirst({
      where: {
        userId,
        challengeId: id,
      },
    });
    
    if (!result) {
      res.status(404).json({ message: 'No result found for this challenge' });
      return;
    }
    
    // Parse answers JSON if it exists
    if (result.answers) {
      try {
        const parsedAnswers = JSON.parse(result.answers as string);
        result.answers = parsedAnswers;
      } catch (error) {
        console.warn('Could not parse challenge result answers:', error);
      }
    }
    
    res.json({ result });
  } catch (error) {
    console.error('Error fetching challenge result:', error);
    res.status(500).json({ message: 'Failed to fetch challenge result' });
  }
});

// Get all challenge results for a skill (admin only)
router.get('/skill/:skillId/results', isAdmin, async (req: Request, res: Response) => {
  try {
    const { skillId } = req.params;
    
    // Get all challenges for this skill
    const challenges = await prisma.challenge.findMany({
      where: { skillId },
    });
    
    const challengeIds = challenges.map((c: Challenge) => c.id);
    
    // Get all results for these challenges
    const results = await prisma.challengeResult.findMany({
      where: {
        challengeId: { in: challengeIds },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching challenge results for skill:', error);
    res.status(500).json({ message: 'Failed to fetch challenge results' });
  }
});

export default router;
