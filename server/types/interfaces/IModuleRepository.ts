import { Module } from '../../models/Module';
import { IRepository } from './IRepository';

/**
 * Module repository interface
 * Extends base repository with module-specific operations
 */
export interface IModuleRepository extends IRepository<Module, string> {
  findWithSkills(id: string): Promise<Module | null>;
  findAllWithSkills(): Promise<Module[]>;
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
