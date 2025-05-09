import { PrismaClient } from '@prisma/client';
import { BaseRepository } from './BaseRepository';
import { Challenge } from '../models/Challenge';
import { IChallengeRepository } from '../types/interfaces/IChallengeRepository';

/**
 * Challenge repository implementation
 */
export class ChallengeRepository extends BaseRepository<Challenge, string> implements IChallengeRepository {
  constructor(prisma: PrismaClient) {
    super(prisma, 'challenge');
  }

  /**
   * Finds challenges by skill ID
   */
  async findBySkillId(skillId: string): Promise<Challenge[]> {
    const challenges = await this.prisma.challenge.findMany({
      where: { skillId },
      orderBy: {
        id: 'asc', // Order by ID as a fallback
      },
    });

    return challenges as Challenge[];
  }

  /**
   * Saves a user's challenge result
   */
  async saveUserResult(userId: string, challengeId: string, result: {
    completed: boolean;
    score?: number;
    answers?: any;
    reflection?: string;
  }): Promise<void> {
    // Check if a result already exists
    const existingResult = await this.prisma.challengeResult.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    // Create or update the result
    if (existingResult) {
      await this.prisma.challengeResult.update({
        where: {
          userId_challengeId: {
            userId,
            challengeId,
          },
        },
        data: {
          completed: result.completed,
          score: result.score !== undefined ? result.score : existingResult.score,
          answers: result.answers !== undefined ? result.answers : existingResult.answers,
          reflection: result.reflection !== undefined ? result.reflection : existingResult.reflection,
        },
      });
    } else {
      await this.prisma.challengeResult.create({
        data: {
          userId,
          challengeId,
          completed: result.completed,
          score: result.score || null,
          answers: result.answers || null,
          reflection: result.reflection || null,
        },
      });
    }

    // If challenge was completed, check if any achievements should be awarded
    if (result.completed) {
      await this.checkForAchievements(userId, challengeId);
    }
  }

  /**
   * Gets a user's results for a specific challenge
   */
  async getUserResults(userId: string, challengeId: string): Promise<{
    completed: boolean;
    score: number | null;
    answers: any | null;
    reflection: string | null;
  } | null> {
    const result = await this.prisma.challengeResult.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId,
        },
      },
    });

    if (!result) {
      return null;
    }

    return {
      completed: result.completed,
      score: result.score,
      answers: result.answers,
      reflection: result.reflection,
    };
  }

  /**
   * Helper method to check for achievement awards after completing a challenge
   */
  private async checkForAchievements(userId: string, challengeId: string): Promise<void> {
    // Get the challenge to find its skill and module
    const challenge = await this.prisma.challenge.findUnique({
      where: { id: challengeId },
      include: {
        skill: {
          include: {
            module: true,
          },
        },
      },
    });

    if (!challenge) return;

    // Count total completed challenges for user
    const completedChallengesCount = await this.prisma.challengeResult.count({
      where: {
        userId,
        completed: true,
      },
    });

    // Check for "First Challenge" achievement
    if (completedChallengesCount === 1) {
      const firstChallengeAchievement = await this.prisma.achievement.findFirst({
        where: {
          condition: 'Complete your first challenge',
        },
      });

      if (firstChallengeAchievement) {
        await this.awardAchievement(userId, firstChallengeAchievement.id, firstChallengeAchievement.pointsReward);
      }
    }

    // Check if all challenges in the skill are completed
    const allChallengesInSkill = await this.prisma.challenge.findMany({
      where: { skillId: challenge.skillId },
      select: { id: true },
    });

    const completedChallengesInSkill = await this.prisma.challengeResult.findMany({
      where: {
        userId,
        challengeId: { in: allChallengesInSkill.map((c: { id: string }) => c.id) },
        completed: true,
      },
    });

    // If all challenges in skill are completed
    if (completedChallengesInSkill.length === allChallengesInSkill.length) {
      // Award skill mastery achievement (if it exists)
      const skillMasteryAchievement = await this.prisma.achievement.findFirst({
        where: {
          condition: `Complete all challenges in a skill`,
        },
      });

      if (skillMasteryAchievement) {
        await this.awardAchievement(userId, skillMasteryAchievement.id, skillMasteryAchievement.pointsReward);
      }
    }
  }

  /**
   * Helper method to award an achievement to a user
   */
  private async awardAchievement(userId: string, achievementId: string, pointsReward: number): Promise<void> {
    // Check if already awarded
    const existingAward = await this.prisma.userAchievement.findFirst({
      where: {
        userId,
        achievementId,
      },
    });

    if (!existingAward) {
      // Award achievement
      await this.prisma.userAchievement.create({
        data: {
          userId,
          achievementId,
        },
      });

      // Add achievement points to user
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          points: {
            increment: pointsReward,
          },
        },
      });
    }
  }
}
