import { Skill } from '../../models/Skill';

/**
 * Skill service interface
 * Defines business operations for DBT skills
 */
export interface ISkillService {
  getAllSkills(): Promise<Skill[]>;
  getSkillById(id: string): Promise<Skill | null>;
  createSkill(data: Partial<Skill>): Promise<Skill>;
  updateSkill(id: string, data: Partial<Skill>): Promise<Skill>;
  deleteSkill(id: string): Promise<boolean>;
  getSkillsByModuleId(moduleId: string): Promise<Skill[]>;
  calculateUserProgress(userId: string, skillId: string): Promise<{
    skillId: string;
    skillName: string;
    totalChallenges: number;
    completedChallenges: number;
    completedChallengeIds: string[];
    percentage: number;
    isCompleted: boolean;
  }>;
}
