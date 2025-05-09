import { Router, Request, Response } from 'express';
import { prisma } from '../server';
import { isAdmin } from '../middleware/auth';

// Define interfaces for module-related entities
interface Skill {
  id: string;
  name: string;
  description: string;
  content: string;
  pointsReward: number;
  order: number;
  moduleId: string;
  challenges: Challenge[];
}

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

interface Module {
  id: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  skills: Skill[];
}

const router = Router();

// Get all modules
router.get('/', async (req: Request, res: Response) => {
  try {
    const modules = await prisma.module.findMany({
      include: {
        skills: true,
      },
      orderBy: {
        order: 'asc',
      },
    });
    
    res.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    res.status(500).json({ message: 'Failed to fetch modules' });
  }
});

// Get a single module by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        skills: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });
    
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }
    
    res.json(module);
  } catch (error) {
    console.error('Error fetching module:', error);
    res.status(500).json({ message: 'Failed to fetch module' });
  }
});

// Create a new module (admin only)
router.post('/', isAdmin, async (req: Request, res: Response) => {
  try {
    const { name, description, icon, order } = req.body;
    
    const newModule = await prisma.module.create({
      data: {
        name,
        description,
        icon,
        order,
      },
    });
    
    res.status(201).json(newModule);
  } catch (error) {
    console.error('Error creating module:', error);
    res.status(500).json({ message: 'Failed to create module' });
  }
});

// Update a module (admin only)
router.put('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, icon, order } = req.body;
    
    const updatedModule = await prisma.module.update({
      where: { id },
      data: {
        name,
        description,
        icon,
        order,
      },
    });
    
    res.json(updatedModule);
  } catch (error) {
    console.error('Error updating module:', error);
    res.status(500).json({ message: 'Failed to update module' });
  }
});

// Delete a module (admin only)
router.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // First check if module has related skills
    const skills = await prisma.skill.count({
      where: { moduleId: id },
    });
    
    if (skills > 0) {
      res.status(400).json({ 
        message: 'Cannot delete module with associated skills. Delete the skills first.' 
      });
      return;
    }
    
    // Delete the module
    await prisma.module.delete({
      where: { id },
    });
    
    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error('Error deleting module:', error);
    res.status(500).json({ message: 'Failed to delete module' });
  }
});

// Get user progress for all modules
router.get('/progress', async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get all modules
    const modules = await prisma.module.findMany({
      include: {
        skills: {
          include: {
            challenges: true,
          },
        },
      },
    });
    
    // Calculate progress for each module
    const progress = [];
    
    for (const module of modules) {
      let totalChallenges = 0;
      let completedChallenges = 0;
      
      // Count total challenges in this module
      for (const skill of module.skills as Skill[]) {
        totalChallenges += skill.challenges.length;
      }
      
      // Count completed challenges in this module
      if (totalChallenges > 0) {
        const challengeIds = (module.skills as Skill[]).flatMap(skill => 
          skill.challenges.map(challenge => challenge.id)
        );
        
        const completedResults = await prisma.challengeResult.count({
          where: {
            userId,
            challengeId: { in: challengeIds },
            completed: true,
          },
        });
        
        completedChallenges = completedResults;
      }
      
      // Calculate percentage
      const percentage = totalChallenges > 0
        ? Math.round((completedChallenges / totalChallenges) * 100)
        : 0;
      
      progress.push({
        moduleId: module.id,
        moduleName: module.name,
        totalChallenges,
        completedChallenges,
        percentage,
      });
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Error fetching module progress:', error);
    res.status(500).json({ message: 'Failed to fetch module progress' });
  }
});

// Get user progress for a specific module
router.get('/:id/progress', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Get module with skills and challenges
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        skills: {
          include: {
            challenges: true,
          },
        },
      },
    });
    
    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }
    
    // Get all challenge IDs in this module
    const challengeIds = (module.skills as Skill[]).flatMap(skill => 
      skill.challenges.map(challenge => challenge.id)
    );
    
    // Get completed challenges for this user
    const completedChallenges = await prisma.challengeResult.findMany({
      where: {
        userId,
        challengeId: { in: challengeIds },
        completed: true,
      },
    });
    
    const completedChallengeIds = completedChallenges.map((result: ChallengeResult) => result.challengeId);
    
    // Get completed skills (where all challenges are completed)
    const completedSkills = (module.skills as Skill[]).filter(skill => {
      if (skill.challenges.length === 0) return false;
      return skill.challenges.every(challenge => 
        completedChallengeIds.includes(challenge.id)
      );
    });
    
    // Calculate progress percentage
    const totalChallenges = challengeIds.length;
    const completedCount = completedChallenges.length;
    const percentage = totalChallenges > 0
      ? Math.round((completedCount / totalChallenges) * 100)
      : 0;
    
    res.json({
      moduleId: module.id,
      moduleName: module.name,
      totalChallenges,
      completedChallenges: completedCount,
      percentage,
      completedSkills,
    });
  } catch (error) {
    console.error('Error fetching module progress:', error);
    res.status(500).json({ message: 'Failed to fetch module progress' });
  }
});

export default router;
