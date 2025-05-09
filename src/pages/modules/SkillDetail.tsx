import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Skill, Challenge, CompletedSkill } from '../../types';

const SkillDetail: React.FC = () => {
  const { skillId } = useParams<{ skillId: string }>();
  const { state } = useAuth();
  const navigate = useNavigate();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSkillDetails = async () => {
      try {
        // Fetch skill details
        const skillResponse = await fetch(`/api/skills/${skillId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!skillResponse.ok) {
          throw new Error('Failed to fetch skill details');
        }
        
        const skillData = await skillResponse.json();
        setSkill(skillData);
        
        // Check if the skill is already completed
        // This API endpoint is a bit hypothetical; you might need to adjust based on your actual API
        const completedResponse = await fetch(`/api/skills/${skillId}/completed`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (completedResponse.ok) {
          const completedData = await completedResponse.json();
          setIsCompleted(completedData.completed);
        }
      } catch (error) {
        console.error('Error fetching skill details:', error);
        setError('Failed to load skill. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSkillDetails();
  }, [skillId, state.token]);

  const handleCompleteSkill = async () => {
    if (isCompleted) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/skills/${skillId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark skill as completed');
      }
      
      const data = await response.json();
      setIsCompleted(true);
      
      // Show some kind of success message or animation here
      // For now, we'll just alert the user
      alert(`Skill completed! You earned ${data.pointsEarned} points.`);
    } catch (error) {
      console.error('Error marking skill as completed:', error);
      alert('Failed to complete skill. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  if (error || !skill) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Skill not found'}</span>
        </div>
        <div className="mt-6">
          <Link to="/modules" className="btn-primary">
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link 
          to={`/modules/${skill.moduleId}`} 
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Module
        </Link>
      </div>

      <div className="dbt-card mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{skill.name}</h1>
        <p className="text-gray-600 mt-2">{skill.description}</p>
        
        {isCompleted && (
          <div className="mt-4 flex items-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Completed
            </div>
            <span className="ml-2 text-sm text-gray-500">You've already mastered this skill</span>
          </div>
        )}
      </div>

      {/* Skill Content */}
      <div className="dbt-card mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Learning Content</h2>
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: skill.content }} />
        </div>
      </div>

      {/* Challenges */}
      {skill.challenges && skill.challenges.length > 0 && (
        <div className="dbt-card mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Practice Challenges</h2>
          <div className="space-y-4">
            {skill.challenges.map((challenge) => (
              <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">{challenge.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                    <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {challenge.type.charAt(0) + challenge.type.slice(1).toLowerCase()}
                    </div>
                  </div>
                  <Link
                    to={`/challenges/${challenge.id}`}
                    className="btn-secondary"
                  >
                    Start Challenge
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Skill Button */}
      <div className="flex justify-center">
        <button
          onClick={handleCompleteSkill}
          disabled={isCompleted || isSubmitting}
          className={`px-6 py-3 rounded-md text-white font-medium text-lg ${
            isCompleted
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting
            ? 'Marking as Completed...'
            : isCompleted
            ? 'Skill Completed'
            : 'Mark as Completed'}
        </button>
      </div>
    </div>
  );
};

export default SkillDetail;
