import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { isAdmin } from '../middleware/auth';

const router = Router();

// Get all achievements
router.get('/', async (req: Request, res: Response) => {
  try {
    const achievements = await prisma.achievement.findMany();
    res.json(achievements);
  } catch (error) {
    console.error('Error fetching achievements:', error);
    res.status(500).json({ message: 'Failed to fetch achievements' });
  }
});

// Get user achievements
router.get('/user', async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: {
        achievement: true,
      },
      orderBy: {
        awardedAt: 'desc',
      },
    });
    
    res.json(userAchievements);
  } catch (error) {
    console.error('Error fetching user achievements:', error);
    res.status(500).json({ message: 'Failed to fetch user achievements' });
  }
});

// Get a single achievement by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const achievement = await prisma.achievement.findUnique({
      where: { id },
    });
    
    if (!achievement) {
      res.status(404).json({ message: 'Achievement not found' });
      return;
    }
    
    res.json(achievement);
  } catch (error) {
    console.error('Error fetching achievement:', error);
    res.status(500).json({ message: 'Failed to fetch achievement' });
  }
});

// Create a new achievement (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, icon, condition, pointsReward } = req.body;
    
    const newAchievement = await prisma.achievement.create({
      data: {
        name,
        description,
        icon,
        condition,
        pointsReward,
      },
    });
    
    res.status(201).json(newAchievement);
  } catch (error) {
    console.error('Error creating achievement:', error);
    res.status(500).json({ message: 'Failed to create achievement' });
  }
});

// Update an achievement (admin only)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon, condition, pointsReward } = req.body;
    
    const updatedAchievement = await prisma.achievement.update({
      where: { id },
      data: {
        name,
        description,
        icon,
        condition,
        pointsReward,
      },
    });
    
    res.json(updatedAchievement);
  } catch (error) {
    console.error('Error updating achievement:', error);
    res.status(500).json({ message: 'Failed to update achievement' });
  }
});

// Delete an achievement (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First delete any related records
    await prisma.userAchievement.deleteMany({ where: { achievementId: id } });
    
    // Then delete the achievement
    await prisma.achievement.delete({
      where: { id },
    });
    
    res.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting achievement:', error);
    res.status(500).json({ message: 'Failed to delete achievement' });
  }
});

// Award an achievement to a user (admin only or triggered by system)
router.post('/:id/award/:userId', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.params;
    
    // Check if achievement exists
    const achievement = await prisma.achievement.findUnique({
      where: { id },
    });
    
    if (!achievement) {
      res.status(404).json({ message: 'Achievement not found' });
      return;
    }
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    // Check if already awarded
    const existingAward = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId,
          achievementId: id,
        },
      },
    });
    
    if (existingAward) {
      res.status(400).json({ message: 'Achievement already awarded to this user' });
      return;
    }
    
    // Award achievement
    const userAchievement = await prisma.userAchievement.create({
      data: {
        userId,
        achievementId: id,
      },
    });
    
    // Update user points
    await prisma.user.update({
      where: { id: userId },
      data: {
        points: {
          increment: achievement.pointsReward,
        },
      },
    });
    
    res.status(201).json({
      message: 'Achievement awarded successfully',
      userAchievement,
      pointsAwarded: achievement.pointsReward,
    });
  } catch (error) {
    console.error('Error awarding achievement:', error);
    res.status(500).json({ message: 'Failed to award achievement' });
  }
});

export default router;
