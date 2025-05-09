import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { Module } from '../models/Module';
import { IModuleRepository } from '../types/interfaces/IModuleRepository';
import { Skill } from '../models/Skill';

/**
 * Module repository implementation
 */
export class ModuleRepository extends BaseRepository<Module, string> implements IModuleRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'module');
  }

  /**
   * Finds all modules with skills
   */
  async findAllWithSkills(): Promise<Module[]> {
    const modules = await this.prisma.module.findMany({
      include: {
        skills: true,
      },
      orderBy: {
        order: 'asc',
      },
    });

    return modules;
  }

  /**
   * Finds a module by ID with its skills
   */
  async findWithSkills(id: string): Promise<Module | null> {
    const module = await this.prisma.module.findUnique({
      where: { id },
      include: {
        skills: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return module;
  }

  /**
   * Calculates user progress for a specific module
   */
  async calculateUserProgress(userId: string, moduleId: string): Promise<{
    moduleId: string;
    moduleName: string;
    totalChallenges: number;
    completedChallenges: number;
    percentage: number;
    completedSkills?: any[];
  }> {
    // Get module with skills and challenges
    const module = await this.prisma.module.findUnique({
      where: { id: moduleId },
      include: {
        skills: {
          include: {
            challenges: true,
          },
        },
      },
    });

    if (!module) {
      throw new Error('Module not found');
    }

    // Get all challenge IDs in this module
    const challengeIds = (module.skills as unknown as Skill[]).flatMap(skill => 
      skill.challenges?.map((challenge: { id: string }) => challenge.id) || []
    );
    
    // Get completed challenges for this user
    const completedChallenges = await this.prisma.challengeResult.findMany({
      where: {
        userId,
        challengeId: { in: challengeIds },
        completed: true,
      },
    });
    
    const completedChallengeIds = completedChallenges.map((result: { challengeId: string }) => result.challengeId);
    
    // Get completed skills (where all challenges are completed)
    const completedSkills = (module.skills as unknown as Skill[]).filter(skill => {
      if (!skill.challenges || skill.challenges.length === 0) return false;
      return skill.challenges.every((challenge: { id: string }) => 
        completedChallengeIds.includes(challenge.id)
      );
    });
    
    // Calculate progress percentage
    const totalChallenges = challengeIds.length;
    const completedCount = completedChallenges.length;
    const percentage = totalChallenges > 0
      ? Math.round((completedCount / totalChallenges) * 100)
      : 0;
    
    return {
      moduleId: module.id,
      moduleName: module.name,
      totalChallenges,
      completedChallenges: completedCount,
      percentage,
      completedSkills,
    };
  }

  /**
   * Gets progress for all modules for a user
   */
  async getUserProgressForAllModules(userId: string): Promise<Array<{
    moduleId: string;
    moduleName: string;
    totalChallenges: number;
    completedChallenges: number;
    percentage: number;
  }>> {
    // Get all modules
    const modules = await this.prisma.module.findMany({
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
      for (const skill of module.skills as unknown as Skill[]) {
        totalChallenges += skill.challenges?.length || 0;
      }
      
      // Count completed challenges in this module
      if (totalChallenges > 0) {
        const challengeIds = (module.skills as unknown as Skill[]).flatMap(skill => 
          skill.challenges?.map((challenge: { id: string }) => challenge.id) || []
        );
        
        const completedResults = await this.prisma.challengeResult.count({
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
    
    return progress;
  }
}
