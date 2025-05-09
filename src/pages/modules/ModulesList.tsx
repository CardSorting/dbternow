import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Module, Progress } from '../../types';

const ModulesList: React.FC = () => {
  const { state } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesResponse = await fetch('/api/modules', {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!modulesResponse.ok) {
          throw new Error('Failed to fetch modules');
        }
        
        const modulesData = await modulesResponse.json();
        setModules(modulesData);
        
        // Fetch progress for each module
        const progressMap: Record<string, number> = {};
        for (const module of modulesData) {
          const progressResponse = await fetch(`/api/modules/${module.id}/progress`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            progressMap[module.id] = progressData.progress.percentage;
          }
        }
        
        setProgress(progressMap);
      } catch (error) {
        console.error('Error fetching modules:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchModules();
  }, [state.token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  // Function to determine if a module is unlocked based on previous modules' progress
  const isModuleUnlocked = (index: number): boolean => {
    if (index === 0) return true; // First module is always unlocked
    
    const previousModule = modules[index - 1];
    if (!previousModule) return false;
    
    const previousModuleProgress = progress[previousModule.id] || 0;
    return previousModuleProgress >= 50; // Unlock next module when previous is at least 50% complete
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">DBT Modules</h1>
        <p className="text-gray-600 mt-2">
          Learn and practice Dialectical Behavior Therapy skills through interactive modules
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {modules.map((module, index) => {
          const progressPercentage = progress[module.id] || 0;
          const unlocked = isModuleUnlocked(index);
          
          return (
            <div 
              key={module.id} 
              className={`dbt-card ${!unlocked ? 'opacity-70' : ''}`}
            >
              <div className="flex flex-col md:flex-row md:items-center">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-800">{module.name}</h2>
                  <p className="text-gray-600 mt-2">{module.description}</p>
                  
                  <div className="mt-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">{progressPercentage}% complete</div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-600">
                    <span className="font-medium">{module.skills?.length || 0} skills</span> to learn
                  </div>
                </div>
                
                <div className="mt-6 md:mt-0 md:ml-6 flex justify-center">
                  {unlocked ? (
                    <Link 
                      to={`/modules/${module.id}`}
                      className="btn-primary"
                    >
                      {progressPercentage > 0 ? 'Continue' : 'Start Learning'}
                    </Link>
                  ) : (
                    <button 
                      disabled
                      className="px-4 py-2 bg-gray-400 text-white rounded-md cursor-not-allowed"
                    >
                      Locked
                    </button>
                  )}
                </div>
              </div>
              
              {!unlocked && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm text-yellow-800">
                  Complete at least 50% of the previous module to unlock this module.
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModulesList;
