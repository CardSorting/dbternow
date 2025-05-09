import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Module, CompletedSkill } from '../../types';

const ModuleDetail: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { state } = useAuth();
  const [module, setModule] = useState<Module | null>(null);
  const [completedSkills, setCompletedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        // Fetch module details
        const moduleResponse = await fetch(`/api/modules/${moduleId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!moduleResponse.ok) {
          throw new Error('Failed to fetch module details');
        }
        
        const moduleData = await moduleResponse.json();
        setModule(moduleData);
        
        // Fetch completed skills
        const progressResponse = await fetch(`/api/modules/${moduleId}/progress`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          
          // Extract the IDs of completed skills
          if (progressData.completedSkills) {
            const skillIds = progressData.completedSkills.map((skill: CompletedSkill | string) => 
              typeof skill === 'string' ? skill : skill.skillId
            );
            setCompletedSkills(skillIds);
          }
        }
      } catch (error) {
        console.error('Error fetching module details:', error);
        setError('Failed to load module. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchModuleDetails();
  }, [moduleId, state.token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Module not found'}</span>
        </div>
        <div className="mt-6">
          <Link to="/modules" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const totalSkills = module.skills.length;
  const completedCount = completedSkills.length;
  const progressPercentage = totalSkills > 0 
    ? Math.round((completedCount / totalSkills) * 100) 
    : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link to="/modules" className="text-blue-600 hover:text-blue-800 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to All Modules
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{module.name}</h1>
        <p className="text-gray-600 mt-2">{module.description}</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Your Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {completedCount} of {totalSkills} skills completed
        </div>
      </div>

      {/* Skills List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {module.skills.sort((a, b) => a.order - b.order).map((skill) => {
            const isCompleted = completedSkills.includes(skill.id);
            
            return (
              <div 
                key={skill.id} 
                className={`dbt-card transition-all ${isCompleted ? 'border-green-500 border-l-4' : ''}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">{skill.name}</h3>
                    <p className="text-gray-600 mt-1">{skill.description}</p>
                    
                    {isCompleted && (
                      <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Completed
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to={`/skills/${skill.id}`}
                    className={isCompleted ? "btn-secondary" : "btn-primary"}
                  >
                    {isCompleted ? 'Review' : 'Start Learning'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ModuleDetail;
