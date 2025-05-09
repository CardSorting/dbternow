/**
 * Challenge domain model
 * Represents a DBT practice challenge entity
 */
export enum ChallengeType {
  QUIZ = 'QUIZ',
  REFLECTION = 'REFLECTION',
  PRACTICE = 'PRACTICE',
  SCENARIO = 'SCENARIO',
  MEDITATION = 'MEDITATION'
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  content: string;
  pointsReward: number;
  skillId: string;
  createdAt: Date;
  updatedAt: Date;
}
