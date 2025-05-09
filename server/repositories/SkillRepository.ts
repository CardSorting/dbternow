import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { Skill } from '../models/Skill';
import { ISkillRepository } from '../types/interfaces/ISkillRepository';

/**
 * Skill repository implementation
 */
export class SkillRepository extends BaseRepository<Skill, string> implements ISkillRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'skill');
  }

  /**
   * Finds a skill by ID with its challenges
   */
  async findWithChallenges(id: string): Promise<Skill | null> {
    const skill = await this.prisma.skill.findUnique({
      where: { id },
      include: {
        module: true,
        challenges: true,
      },
    });

    return skill as Skill | null;
  }

  /**
   * Finds all skills with their modules
   */
  async findAllWithModule(): Promise<Skill[]> {
    const skills = await this.prisma.skill.findMany({
      include: {
        module: true,
      },
      orderBy: [
        { moduleId: 'asc' },
        { order: 'asc' },
      ],
    });

    return skills as Skill[];
  }

  /**
   * Calculates user progress for a specific skill
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
    // Get skill with challenges
    const skill = await this.prisma.skill.findUnique({
      where: { id: skillId },
      include: {
        challenges: true,
      },
    });

    if (!skill) {
      throw new Error('Skill not found');
    }

    // Get challenge IDs for this skill
    const challengeIds = skill.challenges.map((challenge: { id: string }) => challenge.id);
    
    // Get completed challenges for this user
    const completedChallenges = await this.prisma.challengeResult.findMany({
      where: {
        userId,
        challengeId: { in: challengeIds },
        completed: true,
      },
    });
    
    const completedChallengeIds = completedChallenges.map((result: { challengeId: string }) => result.challengeId);
    
    // Calculate if skill is completed
    const isCompleted = skill.challenges.length > 0 && 
      skill.challenges.every((challenge: { id: string }) => completedChallengeIds.includes(challenge.id));
    
    // Calculate progress percentage
    const totalChallenges = challengeIds.length;
    const completedCount = completedChallenges.length;
    const percentage = totalChallenges > 0
      ? Math.round((completedCount / totalChallenges) * 100)
      : 0;
    
    return {
      skillId: skill.id,
      skillName: skill.name,
      totalChallenges,
      completedChallenges: completedCount,
      completedChallengeIds,
      percentage,
      isCompleted,
    };
  }
}
