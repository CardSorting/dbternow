import { ISkillService } from '../types/interfaces/ISkillService';
import { ISkillRepository } from '../types/interfaces/ISkillRepository';
import { Skill } from '../models/Skill';

/**
 * Skill service implementation
 * Handles business logic for DBT skills
 */
export class SkillService implements ISkillService {
  private skillRepository: ISkillRepository;

  constructor(skillRepository: ISkillRepository) {
    this.skillRepository = skillRepository;
  }

  /**
   * Get all skills with their modules
   */
  async getAllSkills(): Promise<Skill[]> {
    return this.skillRepository.findAllWithModule();
  }

  /**
   * Get a single skill by ID with its challenges
   */
  async getSkillById(id: string): Promise<Skill | null> {
    return this.skillRepository.findWithChallenges(id);
  }

  /**
   * Create a new skill
   */
  async createSkill(data: Partial<Skill>): Promise<Skill> {
    // Skill order logic - if no order provided, get the count of skills in this module and add 1
    if (!data.order && data.moduleId) {
      const skills = await this.skillRepository.findAll();
      const moduleSkills = skills.filter(skill => skill.moduleId === data.moduleId);
      data.order = moduleSkills.length + 1;
    }
    
    return this.skillRepository.create(data);
  }

  /**
   * Update an existing skill
   */
  async updateSkill(id: string, data: Partial<Skill>): Promise<Skill> {
    return this.skillRepository.update(id, data);
  }

  /**
   * Delete a skill
   */
  async deleteSkill(id: string): Promise<boolean> {
    // Check if skill exists
    const skill = await this.skillRepository.findById(id);
    if (!skill) {
      throw new Error('Skill not found');
    }
    
    return this.skillRepository.delete(id);
  }

  /**
   * Get skills by module ID
   */
  async getSkillsByModuleId(moduleId: string): Promise<Skill[]> {
    const skills = await this.skillRepository.findAll();
    return skills.filter(skill => skill.moduleId === moduleId);
  }

  /**
   * Calculate user progress for a specific skill
   */
  async calculateUserProgress(userId: string, skillId: string): Promise<{
    skillId: string;
    skillName: string;
    totalChallenges: number;
    completedChallenges: number;
    completedChallengeIds: string[];
    percentage: number;
    isCompleted: boolean;
  }> {
    return this.skillRepository.calculateUserProgress(userId, skillId);
  }
}
