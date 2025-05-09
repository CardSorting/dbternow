import { Router } from 'express';
import { isAdmin } from '../middleware/auth';
import { DIContainer } from '../config/di-container';
import { prisma } from '../server';

const router = Router();
const diContainer = DIContainer.getInstance(prisma);
const moduleController = diContainer.getModuleController();

// Get all modules
router.get('/', moduleController.getAllModules);

// Get user progress for all modules
router.get('/progress', moduleController.getAllModulesProgress);

// Get a single module by ID
router.get('/:id', moduleController.getModuleById);

// Create a new module (admin only)
router.post('/', isAdmin, moduleController.createModule);

// Update a module (admin only)
router.put('/:id', isAdmin, moduleController.updateModule);

// Delete a module (admin only)
router.delete('/:id', isAdmin, moduleController.deleteModule);

// Get user progress for a specific module
router.get('/:id/progress', moduleController.getModuleProgress);

export default router;
