import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Module, Progress, UserAchievement } from '../types';

const Dashboard: React.FC = () => {
  const { state } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<UserAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch modules
        const modulesResponse = await fetch('/api/modules', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        let modulesData = await modulesResponse.json();
        // Ensure modulesData is always an array
        if (!Array.isArray(modulesData)) {
          console.warn('Modules data is not an array, using empty array instead');
          modulesData = [];
        }
        
        // Fetch user progress
        const progressResponse = await fetch('/api/modules/progress', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        let progressData = await progressResponse.json();
        // Ensure progressData is always an array
        if (!Array.isArray(progressData)) {
          console.warn('Progress data is not an array, using empty array instead');
          progressData = [];
        }
        
        // Fetch recent achievements
        const achievementsResponse = await fetch('/api/achievements/user?limit=3', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        let achievementsData = await achievementsResponse.json();
        // Ensure achievementsData is always an array
        if (!Array.isArray(achievementsData)) {
          console.warn('Achievements data is not an array, using empty array instead');
          achievementsData = [];
        }
        
        setModules(modulesData);
        setProgress(progressData);
        setRecentAchievements(achievementsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [state.token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, {state.user?.name || 'Learner'}
        </h1>
        <p className="text-gray-600 mt-2">Continue your DBT journey</p>
      </div>

      {/* User Stats Card */}
      <div className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Current Level</h3>
            <div className="mt-2 text-3xl font-bold text-blue-600">{state.user?.level}</div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Total Points</h3>
            <div className="mt-2 text-3xl font-bold text-blue-600">{state.user?.points}</div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700">Achievements</h3>
            <div className="mt-2 text-3xl font-bold text-blue-600">{recentAchievements.length}</div>
          </div>
        </div>
      </div>

      {/* Modules Progress */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Progress</h2>
          <Link to="/modules" className="text-blue-600 hover:text-blue-800">
            View All Modules
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {modules.slice(0, 4).map((module) => {
            const moduleProgress = progress.find(p => p.moduleId === module.id);
            const progressPercentage = moduleProgress ? moduleProgress.percentage : 0;
            
            return (
              <div key={module.id} className="dbt-card">
                <div className="mb-3">
                  <h3 className="text-lg font-medium text-gray-800">{module.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{module.description.substring(0, 80)}...</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span>{progressPercentage}% complete</span>
                  <Link to={`/modules/${module.id}`} className="text-blue-600 hover:text-blue-800">
                    Continue
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Achievements */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Recent Achievements</h2>
          <Link to="/achievements" className="text-blue-600 hover:text-blue-800">
            View All Achievements
          </Link>
        </div>

        {recentAchievements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentAchievements.map((userAchievement) => (
              <div key={userAchievement.id} className="dbt-card flex items-center space-x-4">
                <div className="achievement-badge">
                  <span role="img" aria-label="achievement icon">
                    {userAchievement.achievement?.icon || '🏆'}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">{userAchievement.achievement?.name}</h3>
                  <p className="text-sm text-gray-600">{userAchievement.achievement?.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Earned on {new Date(userAchievement.awardedAt).toLocaleDateString()}
                  </p>
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
    </div>
  );
};

export default Dashboard;
