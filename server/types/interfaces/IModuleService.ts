import { Module } from '../../models/Module';

/**
 * Module service interface
 * Defines business operations for DBT modules
 */
export interface IModuleService {
  getAllModules(): Promise<Module[]>;
  getModuleById(id: string): Promise<Module | null>;
  createModule(data: Partial<Module>): Promise<Module>;
  updateModule(id: string, data: Partial<Module>): Promise<Module>;
  deleteModule(id: string): Promise<boolean>;
  calculateUserProgress(userId: string, moduleId: string): Promise<{
    moduleId: string;
    moduleName: string;
    totalChallenges: number;
    completedChallenges: number;
    percentage: number;
    completedSkills?: any[];
  }>;
  getUserProgressForAllModules(userId: string): Promise<Array<{
    moduleId: string;
    moduleName: string;
    totalChallenges: number;
    completedChallenges: number;
    percentage: number;
  }>>;
}
