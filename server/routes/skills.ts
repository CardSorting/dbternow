import { Router } from 'express';
import { isAdmin } from '../middleware/auth';
import { DIContainer } from '../config/di-container';
import { prisma } from '../server';

const router = Router();
const diContainer = DIContainer.getInstance(prisma);
const skillController = diContainer.getSkillController();

// Get all skills
router.get('/', skillController.getAllSkills);

// Get skills by module ID
router.get('/by-module/:moduleId', skillController.getSkillsByModuleId);

// Get a single skill by ID
router.get('/:id', skillController.getSkillById);

// Create a new skill (admin only)
router.post('/', isAdmin, skillController.createSkill);

// Update a skill (admin only)
router.put('/:id', isAdmin, skillController.updateSkill);

// Delete a skill (admin only)
router.delete('/:id', isAdmin, skillController.deleteSkill);

// Get user progress for a skill
router.get('/:id/progress', skillController.getSkillProgress);

export default router;
