import { Request, Response } from 'express';
import { ISkillService } from '../types/interfaces/ISkillService';

/**
 * Skill controller
 * Handles HTTP requests related to DBT skills
 */
export class SkillController {
  private skillService: ISkillService;

  constructor(skillService: ISkillService) {
    this.skillService = skillService;
  }

  /**
   * Get all skills
   */
  getAllSkills = async (req: Request, res: Response): Promise<void> => {
    try {
      const skills = await this.skillService.getAllSkills();
      res.json(skills);
    } catch (error) {
      console.error('Error fetching skills:', error);
      res.status(500).json({ message: 'Failed to fetch skills' });
    }
  }

  /**
   * Get a single skill by ID
   */
  getSkillById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const skill = await this.skillService.getSkillById(id);
      
      if (!skill) {
        res.status(404).json({ message: 'Skill not found' });
        return;
      }
      
      res.json(skill);
    } catch (error) {
      console.error('Error fetching skill:', error);
      res.status(500).json({ message: 'Failed to fetch skill' });
    }
  }

  /**
   * Create a new skill (admin only)
   */
  createSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, content, pointsReward, order, moduleId } = req.body;
      
      const newSkill = await this.skillService.createSkill({
        name,
        description,
        content,
        pointsReward,
        order,
        moduleId,
      });
      
      res.status(201).json(newSkill);
    } catch (error) {
      console.error('Error creating skill:', error);
      res.status(500).json({ message: 'Failed to create skill' });
    }
  }

  /**
   * Update a skill (admin only)
   */
  updateSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, description, content, pointsReward, order, moduleId } = req.body;
      
      const updatedSkill = await this.skillService.updateSkill(id, {
        name,
        description,
        content,
        pointsReward,
        order,
        moduleId,
      });
      
      res.json(updatedSkill);
    } catch (error) {
      console.error('Error updating skill:', error);
      res.status(500).json({ message: 'Failed to update skill' });
    }
  }

  /**
   * Delete a skill (admin only)
   */
  deleteSkill = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      await this.skillService.deleteSkill(id);
      
      res.json({ message: 'Skill deleted successfully' });
    } catch (error) {
      console.error('Error deleting skill:', error);
      
      if (error instanceof Error && error.message === 'Skill not found') {
        res.status(404).json({ message: 'Skill not found' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to delete skill' });
    }
  }

  /**
   * Get skills by module ID
   */
  getSkillsByModuleId = async (req: Request, res: Response): Promise<void> => {
    try {
      const { moduleId } = req.params;
      const skills = await this.skillService.getSkillsByModuleId(moduleId);
      
      res.json(skills);
    } catch (error) {
      console.error('Error fetching skills by module ID:', error);
      res.status(500).json({ message: 'Failed to fetch skills' });
    }
  }

  /**
   * Get user progress for a specific skill
   */
  getSkillProgress = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      
      const progress = await this.skillService.calculateUserProgress(userId, id);
      
      res.json(progress);
    } catch (error) {
      console.error('Error fetching skill progress:', error);
      
      if (error instanceof Error && error.message === 'Skill not found') {
        res.status(404).json({ message: 'Skill not found' });
        return;
      }
      
      res.status(500).json({ message: 'Failed to fetch skill progress' });
    }
  }
}
