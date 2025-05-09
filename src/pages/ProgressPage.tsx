import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { Module, Progress, CompletedSkill } from '../types';

interface ModuleProgress extends Progress {
  module: Module;
  completedSkillsCount: number;
  totalSkillsCount: number;
}

const ProgressPage: React.FC = () => {
  const { state } = useAuth();
  const [progressData, setProgressData] = useState<ModuleProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalProgress, setTotalProgress] = useState(0);

  useEffect(() => {
    const fetchProgressData = async () => {
      try {
        // Fetch all user progress
        const progressResponse = await fetch('/api/modules/progress', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!progressResponse.ok) {
          throw new Error('Failed to fetch progress data');
        }
        
        const progressItems = await progressResponse.json();
        
        // Fetch all modules to get their details
        const modulesResponse = await fetch('/api/modules', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!modulesResponse.ok) {
          throw new Error('Failed to fetch modules data');
        }
        
        const modules = await modulesResponse.json();
        
        // Create an enhanced progress data array with module details
        const enhancedProgressData: ModuleProgress[] = [];
        
        for (const module of modules) {
          const moduleProgress = progressItems.find((p: Progress) => p.moduleId === module.id) || {
            moduleId: module.id,
            percentage: 0,
          };
          
          // Count completed skills for this module
          const completedSkillsResponse = await fetch(`/api/modules/${module.id}/progress`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          
          let completedSkillsCount = 0;
          let totalSkillsCount = module.skills?.length || 0;
          
          if (completedSkillsResponse.ok) {
            const skillsProgressData = await completedSkillsResponse.json();
            completedSkillsCount = skillsProgressData.completedSkills?.length || 0;
          }
          
          enhancedProgressData.push({
            ...moduleProgress,
            module,
            completedSkillsCount,
            totalSkillsCount,
          });
        }
        
        // Sort by module order
        enhancedProgressData.sort((a, b) => a.module.order - b.module.order);
        
        setProgressData(enhancedProgressData);
        
        // Calculate overall progress percentage
        if (enhancedProgressData.length > 0) {
          const totalPercentage = enhancedProgressData.reduce((sum, item) => sum + item.percentage, 0);
          setTotalProgress(Math.round(totalPercentage / enhancedProgressData.length));
        }
      } catch (error) {
        console.error('Error fetching progress data:', error);
        setError('Failed to load progress. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgressData();
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

  return (
    <div className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-800">Your Learning Progress</h1>
        <p className="text-gray-600 mt-2">
          Track your journey through DBT skills and modules
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="mb-12 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Overall Progress</h2>
        
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div 
            className="bg-blue-600 h-4 rounded-full" 
            style={{ width: `${totalProgress}%` }}
          ></div>
        </div>
        
        <div className="mt-2 text-center">
          <span className="text-2xl font-bold text-blue-600">{totalProgress}%</span>
          <p className="text-gray-600">completed across all modules</p>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-xl font-bold text-blue-800">
              {progressData.length}
            </div>
            <div className="text-blue-600">Modules</div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-xl font-bold text-green-800">
              {progressData.reduce((sum, item) => sum + item.completedSkillsCount, 0)}
            </div>
            <div className="text-green-600">Skills Completed</div>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-xl font-bold text-purple-800">
              {progressData.reduce((sum, item) => sum + item.totalSkillsCount, 0)}
            </div>
            <div className="text-purple-600">Total Skills</div>
          </div>
        </div>
      </div>

      {/* Module Progress Cards */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6">Modules Progress</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {progressData.map((item) => (
            <div key={item.module.id} className="dbt-card">
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800">{item.module.name}</h3>
                  <p className="text-gray-600 text-sm mt-1 mb-3">
                    {item.module.description}
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{item.percentage}% complete</span>
                    <span>{item.completedSkillsCount} of {item.totalSkillsCount} skills</span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 md:ml-6">
                  <Link 
                    to={`/modules/${item.module.id}`} 
                    className="btn-primary block text-center"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
