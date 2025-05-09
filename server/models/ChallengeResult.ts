/**
 * ChallengeResult domain model
 * Represents a user's completion record for a challenge
 */
export interface ChallengeResult {
  id: string;
  userId: string;
  challengeId: string;
  completed: boolean;
  score: number | null;
  answers: any | null;
  reflection: string | null;
  createdAt: Date;
  updatedAt: Date;
}
