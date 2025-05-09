import { Request, Response } from 'express';
import { IModuleService } from '../types/interfaces/IModuleService';

/**
 * Module controller
 * Handles HTTP requests related to DBT modules
 */
export class ModuleController {
  private moduleService: IModuleService;

  constructor(moduleService: IModuleService) {
    this.moduleService = moduleService;
  }

  /**
   * Get all modules
   */
  getAllModules = async (req: Request, res: Response): Promise<void> => {
    try {
      const modules = await this.moduleService.getAllModules();
      // Ensure we always return an array even if the service returns something else
      res.json(Array.isArray(modules) ? modules : []);
    } catch (error) {
      console.error('Error fetching modules:', error);
      // Return an empty array instead of an error to avoid frontend crashes
      res.json([]);
    }
  }

  /**
   * Get a single module by ID
   */
  getModuleById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const module = await this.moduleService.getModuleById(id);
      
      if (!module) {
        res.status(404).json({ message: 'Module not found' });
        return;
      }
      
      res.json(module);
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ message: 'Failed to fetch module' });
    }
  }

  /**
   * Create a new module (admin only)
   */
  createModule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, icon, order } = req.body;
      
      const newModule = await this.moduleService.createModule({
        name,
        description,
        icon,
        order,
      });
      
      res.status(201).json(newModule);
    } catch (error) {
      console.error('Error creating module:', error);
      res.status(500).json({ message: 'Failed to create module' });
    }
  }

  /**
   * Update a module (admin only)
   */
  updateModule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, icon, order } = req.body;
      
      const updatedModule = await this.moduleService.updateModule(id, {
        name,
        description,
        icon,
        order,
      });
      
      res.json(updatedModule);
    } catch (error) {
      console.error('Error updating module:', error);
      res.status(500).json({ message: 'Failed to update module' });
    }
  }

  /**
   * Delete a module (admin only)
   */
  deleteModule = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.moduleService.deleteModule(id);
      
      res.json({ message: 'Module deleted successfully' });
    } catch (error) {
      console.error('Error deleting module:', error);
      
      if (error instanceof Error && error.message === 'Module not found') {
        res.status(404).json({ message: 'Module not found' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to delete module' });
    }
  }

  /**
   * Get user progress for a specific module
   */
  getModuleProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const progress = await this.moduleService.calculateUserProgress(userId, id);
      
      res.json(progress);
    } catch (error) {
      console.error('Error fetching module progress:', error);
      
      if (error instanceof Error && error.message === 'Module not found') {
        res.status(404).json({ message: 'Module not found' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to fetch module progress' });
    }
  }

  /**
   * Get user progress for all modules
   */
  getAllModulesProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      
      const progress = await this.moduleService.getUserProgressForAllModules(userId);
      
      // Ensure we always return an array for progress
      res.json(Array.isArray(progress) ? progress : []);
    } catch (error) {
      console.error('Error fetching module progress:', error);
      // Return an empty array instead of an error to avoid frontend crashes
      res.json([]);
    }
  }
}
