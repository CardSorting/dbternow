import React, { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { Challenge, ChallengeResult } from '../../types';

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizData {
  questions: QuizQuestion[];
}

interface ReflectionData {
  prompts: string[];
}

interface PracticeData {
  steps: string[];
  tips: string[];
}

interface ScenarioData {
  scenario: string;
  questions: {
    question: string;
    options?: string[];
  }[];
}

interface MeditationData {
  duration: number;
  instructions: string;
  audioUrl?: string;
}

type ChallengeData = QuizData | ReflectionData | PracticeData | ScenarioData | MeditationData;

const ChallengeDetail: React.FC = () => {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { state } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [challengeData, setChallengeData] = useState<ChallengeData | null>(null);
  const [userAnswers, setUserAnswers] = useState<any>({});
  const [reflection, setReflection] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const fetchChallengeDetails = async () => {
      try {
        // Fetch challenge details
        const response = await fetch(`/api/challenges/${challengeId}`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch challenge details');
        }
        
        const data = await response.json();
        setChallenge(data);
        
        // Parse challenge content based on type
        if (data.content) {
          try {
            const parsedContent = JSON.parse(data.content);
            setChallengeData(parsedContent);
            
            // If it's a meditation challenge, set up the timer
            if (data.type === 'MEDITATION' && parsedContent.duration) {
              setTimer(parsedContent.duration * 60); // Convert minutes to seconds
            }
          } catch (e) {
            console.error('Error parsing challenge content:', e);
            setError('Invalid challenge content format');
          }
        }
        
        // Check if the challenge is already completed
        const resultResponse = await fetch(`/api/challenges/${challengeId}/result`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        
        if (resultResponse.ok) {
          const resultData = await resultResponse.json();
          if (resultData.result) {
            setIsCompleted(resultData.result.completed);
            setScore(resultData.result.score);
            setUserAnswers(resultData.result.answers || {});
            setReflection(resultData.result.reflection || '');
          }
        }
      } catch (error) {
        console.error('Error fetching challenge details:', error);
        setError('Failed to load challenge. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChallengeDetails();
  }, [challengeId, state.token]);

  // Timer effect for meditation challenges
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timerActive && timer !== null && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => (prevTimer !== null ? prevTimer - 1 : null));
      }, 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, timer]);

  const handleQuizAnswerChange = (questionIndex: number, optionIndex: number) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleReflectionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReflection(e.target.value);
  };

  const handleScenarioAnswerChange = (questionIndex: number, answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: answer,
    });
  };

  const startMeditation = () => {
    setTimerActive(true);
  };

  const stopMeditation = () => {
    setTimerActive(false);
  };

  const resetMeditation = () => {
    if (challengeData && 'duration' in challengeData) {
      setTimer(challengeData.duration * 60);
    }
    setTimerActive(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateQuizScore = (): number => {
    if (!challengeData || !('questions' in challengeData)) return 0;
    
    const quizData = challengeData as QuizData;
    let correct = 0;
    
    quizData.questions.forEach((question, index) => {
      if (userAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    
    return Math.round((correct / quizData.questions.length) * 100);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!challenge) return;
    
    setIsSubmitting(true);
    
    try {
      // Prepare submission data based on challenge type
      let submissionData: {
        completed: boolean;
        answers?: any;
        reflection?: string;
        score?: number;
      } = {
        completed: true,
      };
      
      switch (challenge.type) {
        case 'QUIZ':
          const quizScore = calculateQuizScore();
          submissionData = {
            ...submissionData,
            answers: userAnswers,
            score: quizScore,
          };
          setScore(quizScore);
          break;
          
        case 'REFLECTION':
          submissionData = {
            ...submissionData,
            reflection,
          };
          break;
          
        case 'PRACTICE':
        case 'MEDITATION':
          // For these, we just mark as completed
          break;
          
        case 'SCENARIO':
          submissionData = {
            ...submissionData,
            answers: userAnswers,
          };
          break;
      }
      
      // Submit challenge result
      const response = await fetch(`/api/challenges/${challengeId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${state.token}`,
        },
        body: JSON.stringify(submissionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit challenge');
      }
      
      const data = await response.json();
      setIsCompleted(true);
      
      // Show success message
      alert('Challenge completed successfully!');
      
      // Navigate back to skill page if needed
      if (challenge.skill) {
        navigate(`/skills/${challenge.skillId}`);
      }
    } catch (error) {
      console.error('Error submitting challenge:', error);
      alert('Failed to submit challenge. Please try again.');
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

  if (error || !challenge || !challengeData) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Challenge not found'}</span>
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
      {challenge.skillId && (
        <div className="mb-6">
          <Link 
            to={`/skills/${challenge.skillId}`} 
            className="text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Skill
          </Link>
        </div>
      )}

      <div className="dbt-card mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{challenge.title}</h1>
            <p className="text-gray-600 mt-2">{challenge.description}</p>
            <div className="mt-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {challenge.type.charAt(0) + challenge.type.slice(1).toLowerCase()} Challenge
            </div>
          </div>
          
          {isCompleted && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Completed {score !== null && `• Score: ${score}%`}
            </div>
          )}
        </div>
      </div>

      {/* Challenge Content Based on Type */}
      <div className="dbt-card mb-8">
        <form onSubmit={handleSubmit}>
          {challenge.type === 'QUIZ' && 'questions' in challengeData && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Quiz Questions</h2>
              <div className="space-y-8">
                {(challengeData as QuizData).questions.map((question, qIndex) => (
                  <div key={qIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <div key={oIndex} className="flex items-center">
                          <input
                            type="radio"
                            id={`q${qIndex}_option${oIndex}`}
                            name={`question_${qIndex}`}
                            value={oIndex}
                            checked={userAnswers[qIndex] === oIndex}
                            onChange={() => handleQuizAnswerChange(qIndex, oIndex)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                            disabled={isCompleted}
                          />
                          <label
                            htmlFor={`q${qIndex}_option${oIndex}`}
                            className="ml-3 block text-gray-700"
                          >
                            {option}
                          </label>
                          
                          {isCompleted && userAnswers[qIndex] === oIndex && 
                           oIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-600">✓ Correct</span>
                          )}
                          
                          {isCompleted && userAnswers[qIndex] === oIndex && 
                           oIndex !== question.correctAnswer && (
                            <span className="ml-2 text-red-600">✗ Incorrect</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {challenge.type === 'REFLECTION' && 'prompts' in challengeData && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Reflection Prompts</h2>
              <div className="space-y-6">
                {(challengeData as ReflectionData).prompts.map((prompt, index) => (
                  <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <p className="text-gray-800 mb-2">{prompt}</p>
                  </div>
                ))}
                
                <div>
                  <label htmlFor="reflection" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Reflection
                  </label>
                  <textarea
                    id="reflection"
                    rows={6}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Write your reflection here..."
                    value={reflection}
                    onChange={handleReflectionChange}
                    disabled={isCompleted}
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {challenge.type === 'PRACTICE' && 'steps' in challengeData && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Practice Exercise</h2>
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <h3 className="text-lg font-medium text-blue-800 mb-2">Instructions</h3>
                  <ol className="list-decimal pl-5 space-y-2">
                    {(challengeData as PracticeData).steps.map((step, index) => (
                      <li key={index} className="text-blue-700">{step}</li>
                    ))}
                  </ol>
                </div>
                
                {(challengeData as PracticeData).tips && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h3 className="text-lg font-medium text-yellow-800 mb-2">Helpful Tips</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {(challengeData as PracticeData).tips.map((tip, index) => (
                        <li key={index} className="text-yellow-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                  <p className="text-gray-700">
                    Complete this practice exercise in your own time, then mark it as completed.
                  </p>
                </div>
              </div>
            </div>
          )}

          {challenge.type === 'SCENARIO' && 'scenario' in challengeData && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Scenario Exercise</h2>
              <div className="space-y-6">
                <div className="bg-indigo-50 border border-indigo-200 rounded-md p-4 mb-6">
                  <h3 className="text-lg font-medium text-indigo-800 mb-2">Scenario</h3>
                  <p className="text-indigo-700">{(challengeData as ScenarioData).scenario}</p>
                </div>
                
                <div className="space-y-6">
                  {(challengeData as ScenarioData).questions.map((question, qIndex) => (
                    <div key={qIndex} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <h3 className="text-lg font-medium text-gray-800 mb-3">
                        {qIndex + 1}. {question.question}
                      </h3>
                      
                      {question.options ? (
                        // Multiple choice question
                        <div className="space-y-2">
                          {question.options.map((option, oIndex) => (
                            <div key={oIndex} className="flex items-center">
                              <input
                                type="radio"
                                id={`scenario_q${qIndex}_option${oIndex}`}
                                name={`scenario_question_${qIndex}`}
                                value={option}
                                checked={userAnswers[qIndex] === option}
                                onChange={() => handleScenarioAnswerChange(qIndex, option)}
                                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
                                disabled={isCompleted}
                              />
                              <label
                                htmlFor={`scenario_q${qIndex}_option${oIndex}`}
                                className="ml-3 block text-gray-700"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Free text answer
                        <div>
                          <textarea
                            rows={3}
                            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                            placeholder="Your answer..."
                            value={userAnswers[qIndex] || ''}
                            onChange={(e) => handleScenarioAnswerChange(qIndex, e.target.value)}
                            disabled={isCompleted}
                            required
                          ></textarea>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {challenge.type === 'MEDITATION' && 'instructions' in challengeData && (
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">Meditation Exercise</h2>
              <div className="space-y-6">
                <div className="bg-purple-50 border border-purple-200 rounded-md p-4 mb-6">
                  <h3 className="text-lg font-medium text-purple-800 mb-2">Instructions</h3>
                  <p className="text-purple-700">{(challengeData as MeditationData).instructions}</p>
                </div>
                
                {(challengeData as MeditationData).audioUrl && (
                  <div className="mb-6">
                    <audio
                      controls
                      className="w-full"
                      src={(challengeData as MeditationData).audioUrl}
                    />
                  </div>
                )}
                
                <div className="bg-gray-50 border border-gray-200 rounded-md p-6 text-center">
                  <div className="text-4xl font-mono mb-6">
                    {timer !== null ? formatTime(timer) : '00:00'}
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    {!timerActive ? (
                      <button
                        type="button"
                        onClick={startMeditation}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                        disabled={isCompleted || timer === 0}
                      >
                        Start
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={stopMeditation}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                      >
                        Pause
                      </button>
                    )}
                    
                    <button
                      type="button"
                      onClick={resetMeditation}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none"
                      disabled={isCompleted}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={isCompleted || isSubmitting}
              className={`px-6 py-3 rounded-md text-white font-medium text-lg ${
                isCompleted || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isSubmitting
                ? 'Submitting...'
                : isCompleted
                ? 'Challenge Completed'
                : 'Submit Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeDetail;
