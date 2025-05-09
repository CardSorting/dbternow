import { IModuleService } from '../types/interfaces/IModuleService';
import { IModuleRepository } from '../types/interfaces/IModuleRepository';
import { Module } from '../models/Module';

/**
 * Module service implementation
 * Handles business logic for DBT modules
 */
export class ModuleService implements IModuleService {
  private moduleRepository: IModuleRepository;

  constructor(moduleRepository: IModuleRepository) {
    this.moduleRepository = moduleRepository;
  }

  /**
   * Get all modules with their skills
   */
  async getAllModules(): Promise<Module[]> {
    return this.moduleRepository.findAllWithSkills();
  }

  /**
   * Get a single module by ID with its skills
   */
  async getModuleById(id: string): Promise<Module | null> {
    return this.moduleRepository.findWithSkills(id);
  }

  /**
   * Create a new module
   */
  async createModule(data: Partial<Module>): Promise<Module> {
    // Module order logic - if no order provided, put at the end
    if (!data.order) {
      const modules = await this.moduleRepository.findAll();
      data.order = modules.length + 1;
    }
    
    return this.moduleRepository.create(data);
  }

  /**
   * Update an existing module
   */
  async updateModule(id: string, data: Partial<Module>): Promise<Module> {
    return this.moduleRepository.update(id, data);
  }

  /**
   * Delete a module
   */
  async deleteModule(id: string): Promise<boolean> {
    // Check if module exists
    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new Error('Module not found');
    }
    
    return this.moduleRepository.delete(id);
  }

  /**
   * Calculate user progress for a specific module
   */
  async calculateUserProgress(userId: string, moduleId: string): Promise<{
    moduleId: string;
    moduleName: string;
    totalChallenges: number;
    completedChallenges: number;
    percentage: number;
    completedSkills?: any[];
  }> {
    return this.moduleRepository.calculateUserProgress(userId, moduleId);
  }

  /**
   * Get user progress for all modules
   */
  async getUserProgressForAllModules(userId: string): Promise<Array<{
    moduleId: string;
    moduleName: string;
    totalChallenges: number;
    completedChallenges: number;
    percentage: number;
  }>> {
    return this.moduleRepository.getUserProgressForAllModules(userId);
  }
}
