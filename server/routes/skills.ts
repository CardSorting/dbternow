import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { isAdmin } from '../middleware/auth';

// Define interfaces for skill-related entities
interface Challenge {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  pointsReward: number;
  skillId: string;
}

interface ChallengeResult {
  id: string;
  userId: string;
  challengeId: string;
  completed: boolean;
  answers?: any; // Changed from string to any to accommodate Json type
  reflection: string | null; // Changed from string | undefined to string | null
  score: number | null; // Changed from number | undefined to number | null
  createdAt: Date;
  updatedAt: Date;
}

const router = Router();

// Get all skills
router.get('/', async (req: Request, res: Response) => {
  try {
    const skills = await prisma.skill.findMany({
      include: {
        module: true,
      },
      orderBy: [
        { moduleId: 'asc' },
        { order: 'asc' },
      ],
    });
    
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ message: 'Failed to fetch skills' });
  }
});

// Get a single skill by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        module: true,
        challenges: true,
      },
    });
    
    if (!skill) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }
    
    res.json(skill);
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({ message: 'Failed to fetch skill' });
  }
});

// Create a new skill (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, content, pointsReward, order, moduleId } = req.body;
    
    const newSkill = await prisma.skill.create({
      data: {
        name,
        description,
        content,
        pointsReward,
        order,
        moduleId,
      },
    });
    
    res.status(201).json(newSkill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ message: 'Failed to create skill' });
  }
});

// Update a skill (admin only)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, content, pointsReward, order, moduleId } = req.body;
    
    const updatedSkill = await prisma.skill.update({
      where: { id },
      data: {
        name,
        description,
        content,
        pointsReward,
        order,
        moduleId,
      },
    });
    
    res.json(updatedSkill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ message: 'Failed to update skill' });
  }
});

// Delete a skill (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First check if skill has related challenges
    const challenges = await prisma.challenge.count({
      where: { skillId: id },
    });
    
    if (challenges > 0) {
      res.status(400).json({ 
        message: 'Cannot delete skill with associated challenges. Delete the challenges first.' 
      });
      return;
    }
    
    // Delete the skill
    await prisma.skill.delete({
      where: { id },
    });
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ message: 'Failed to delete skill' });
  }
});

// Get user progress for a skill
router.get('/:id/progress', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Get skill with challenges
    const skill = await prisma.skill.findUnique({
      where: { id },
      include: {
        challenges: true,
      },
    });
    
    if (!skill) {
      res.status(404).json({ message: 'Skill not found' });
      return;
    }
    
    // Get challenge IDs for this skill
    const challengeIds = skill.challenges.map((challenge: Challenge) => challenge.id);
    
    // Get completed challenges for this user
    const completedChallenges = await prisma.challengeResult.findMany({
      where: {
        userId,
        challengeId: { in: challengeIds },
        completed: true,
      },
    });
    
    const completedChallengeIds = completedChallenges.map((result: ChallengeResult) => result.challengeId);
    
    // Calculate if skill is completed
    const isCompleted = skill.challenges.length > 0 && 
      skill.challenges.every((challenge: Challenge) => completedChallengeIds.includes(challenge.id));
    
    // Calculate progress percentage
    const totalChallenges = challengeIds.length;
    const completedCount = completedChallenges.length;
    const percentage = totalChallenges > 0
      ? Math.round((completedCount / totalChallenges) * 100)
      : 0;
    
    // If not yet completed, check if first skill completion
    let firstSkillAchievement = null;
    if (isCompleted) {
      // Get count of previously completed skills
      const previousCompletedSkills = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT s.id) as count
        FROM "Skill" s
        JOIN "Challenge" c ON c."skillId" = s.id
        JOIN "ChallengeResult" cr ON cr."challengeId" = c.id
        WHERE cr."userId" = ${userId}
        AND s.id != ${id}
        GROUP BY s.id
        HAVING COUNT(c.id) = COUNT(CASE WHEN cr.completed = true THEN 1 END)
      `;
      
      // If this is first completed skill, award achievement
      if (Array.isArray(previousCompletedSkills) && previousCompletedSkills.length === 0) {
        // Find first steps achievement
        const achievement = await prisma.achievement.findFirst({
          where: {
            condition: 'Complete any skill',
          },
        });
        
        if (achievement) {
          // Check if already awarded
          const existingAward = await prisma.userAchievement.findFirst({
            where: {
              userId,
              achievementId: achievement.id,
            },
          });
          
          if (!existingAward) {
            // Award achievement
            await prisma.userAchievement.create({
              data: {
                userId,
                achievementId: achievement.id,
              },
            });
            
            // Add achievement points to user
            await prisma.user.update({
              where: { id: userId },
              data: {
                points: {
                  increment: achievement.pointsReward,
                },
              },
            });
            
            firstSkillAchievement = achievement;
          }
        }
      }
      
      // Check if all skills in module are completed (Mindfulness Master achievement)
      const moduleName = await prisma.module.findUnique({
        where: { id: skill.moduleId },
        select: { name: true },
      });
      
      if (moduleName && moduleName.name === 'Mindfulness') {
        // Check if all skills in the Mindfulness module are completed
        const moduleSkills = await prisma.skill.findMany({
          where: { moduleId: skill.moduleId },
          include: { challenges: true },
        });
        
        let allCompleted = true;
        for (const moduleSkill of moduleSkills) {
          const skillChallengeIds = moduleSkill.challenges.map((ch: Challenge) => ch.id);
          
          const completedCount = await prisma.challengeResult.count({
            where: {
              userId,
              challengeId: { in: skillChallengeIds },
              completed: true,
            },
          });
          
          if (completedCount !== skillChallengeIds.length) {
            allCompleted = false;
            break;
          }
        }
        
        if (allCompleted) {
          // Award Mindfulness Master achievement
          const moduleAchievement = await prisma.achievement.findFirst({
            where: {
              condition: 'Complete all skills in the Mindfulness module',
            },
          });
          
          if (moduleAchievement) {
            // Check if already awarded
            const existingAward = await prisma.userAchievement.findFirst({
              where: {
                userId,
                achievementId: moduleAchievement.id,
              },
            });
            
            if (!existingAward) {
              // Award achievement
              await prisma.userAchievement.create({
                data: {
                  userId,
                  achievementId: moduleAchievement.id,
                },
              });
              
              // Add achievement points to user
              await prisma.user.update({
                where: { id: userId },
                data: {
                  points: {
                    increment: moduleAchievement.pointsReward,
                  },
                },
              });
            }
          }
        }
      }
    }
    
    res.json({
      skillId: skill.id,
      skillName: skill.name,
      totalChallenges,
      completedChallenges: completedCount,
      completedChallengeIds,
      percentage,
      isCompleted,
      firstSkillAchievement,
    });
  } catch (error) {
    console.error('Error fetching skill progress:', error);
    res.status(500).json({ message: 'Failed to fetch skill progress' });
  }
});

export default router;
