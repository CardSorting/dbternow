import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Achievement, UserAchievement } from '../types';

interface EnhancedAchievement extends Achievement {
  isEarned: boolean;
  awardedAt?: string;
}

const AchievementsPage: React.FC = () => {
  const { state } = useAuth();
  const [achievements, setAchievements] = useState<EnhancedAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        // Fetch all achievements
        const achievementsResponse = await fetch('/api/achievements', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!achievementsResponse.ok) {
          throw new Error('Failed to fetch achievements');
        }
        
        const allAchievements = await achievementsResponse.json();
        
        // Fetch user achievements
        const userAchievementsResponse = await fetch('/api/achievements/user', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!userAchievementsResponse.ok) {
          throw new Error('Failed to fetch user achievements');
        }
        
        const userAchievements = await userAchievementsResponse.json();
        
        // Enhance achievements with earned status
        const enhancedAchievements: EnhancedAchievement[] = allAchievements.map(
          (achievement: Achievement) => {
            const userAchievement = userAchievements.find(
              (ua: UserAchievement) => ua.achievementId === achievement.id
            );
            
            return {
              ...achievement,
              isEarned: !!userAchievement,
              awardedAt: userAchievement ? userAchievement.awardedAt : undefined,
            };
          }
        );
        
        setAchievements(enhancedAchievements);
      } catch (error) {
        console.error('Error fetching achievements:', error);
        setError('Failed to load achievements. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [state.token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  // Filter achievements into earned and unearned
  const earnedAchievements = achievements.filter(a => a.isEarned);
  const unearnedAchievements = achievements.filter(a => !a.isEarned);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Achievements</h1>
        <p className="text-gray-600 mt-2">
          Track your milestones and earn badges as you progress through your DBT journey
        </p>
      </div>

      {/* Achievement Stats */}
      <div className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-800">{earnedAchievements.length}</div>
            <div className="text-yellow-600">Achievements Earned</div>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-800">{achievements.length}</div>
            <div className="text-blue-600">Total Achievements</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-3xl font-bold text-green-800">
              {earnedAchievements.reduce((sum, a) => sum + a.pointsReward, 0)}
            </div>
            <div className="text-green-600">Points Earned from Achievements</div>
          </div>
        </div>
      </div>

      {/* Earned Achievements */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Earned Achievements</h2>
        
        {earnedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {earnedAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className="dbt-card border-l-4 border-yellow-400 flex items-start space-x-4"
              >
                <div className="achievement-badge flex-shrink-0 w-14 h-14 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                  <span role="img" aria-label="achievement">{achievement.icon}</span>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <div className="mt-2 flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {achievement.pointsReward} points
                    </span>
                    <span className="text-xs text-gray-500">
                      Earned on {new Date(achievement.awardedAt!).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dbt-card text-center py-8">
            <p className="text-gray-600">You haven't earned any achievements yet.</p>
            <p className="mt-2">
              <Link to="/modules" className="text-blue-600 hover:text-blue-800">
                Start learning to earn achievements!
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Locked Achievements */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Achievements to Unlock</h2>
        
        {unearnedAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unearnedAchievements.map(achievement => (
              <div 
                key={achievement.id} 
                className="dbt-card opacity-75 flex items-start space-x-4"
              >
                <div className="achievement-badge flex-shrink-0 w-14 h-14 bg-gray-200 rounded-full flex items-center justify-center text-2xl grayscale">
                  <span role="img" aria-label="locked achievement">{achievement.icon}</span>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-700">{achievement.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                  <div className="mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{achievement.pointsReward} points
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    <strong>Hint:</strong> {achievement.condition}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="dbt-card text-center py-8 bg-yellow-50">
            <p className="text-yellow-800 font-medium">Congratulations!</p>
            <p className="text-yellow-700 mt-2">
              You've earned all available achievements.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementsPage;
