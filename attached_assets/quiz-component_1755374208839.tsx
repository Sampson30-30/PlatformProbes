import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CheckCircle, X, RotateCcw, AlertCircle, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface QuizQuestion {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correctAnswerId: string;
}

interface QuizComponentProps {
  questions: QuizQuestion[];
  lessonId: number;
  onQuizComplete: (score: number, passed: boolean) => void;
  passingScore?: number; // Score needed to pass (out of 100)
}

export default function QuizComponent({ 
  questions, 
  lessonId, 
  onQuizComplete,
  passingScore = 70 // Default passing score is 70%
}: QuizComponentProps) {
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const { toast } = useToast();

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    if (isSubmitted) return; // Prevent changing answers after submission

    setUserAnswers({
      ...userAnswers,
      [questionId]: optionId
    });
  };

  const handleSubmit = () => {
    // Count correct answers
    let correctCount = 0;

    questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswerId) {
        correctCount++;
      }
    });

    // Calculate score as percentage
    const calculatedScore = Math.round((correctCount / questions.length) * 100);
    setScore(calculatedScore);

    // Determine if passed based on passing score
    const passed = calculatedScore >= passingScore;

    // Call onQuizComplete with score and pass status
    onQuizComplete(calculatedScore, passed);

    // Show appropriate toast based on result
    if (passed) {
      toast({
        title: "Quiz Completed Successfully!",
        description: `You scored ${calculatedScore}%. Great job!`,
        variant: "default",
      });
    } else {
      toast({
        title: "Quiz Needs Improvement",
        description: `You scored ${calculatedScore}%. Review the material and try again.`,
        variant: "destructive",
      });
    }

    setIsSubmitted(true);
  };

  const resetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(0);
  };

  // Check if all questions are answered
  const allQuestionsAnswered = questions.every(q => userAnswers[q.id]);

  // Determine if quiz was passed
  const isPassed = score >= passingScore;

  return (
    <div className="border rounded-md p-4 mb-6">
      <h3 className="font-bold text-lg mb-4">Knowledge Check</h3>

      {/* Show results summary if submitted */}
      {isSubmitted && (
        <div className={`mb-6 p-4 rounded-md ${isPassed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className="flex items-center mb-2">
            {isPassed ? (
              <>
                <Award className="h-6 w-6 text-green-600 mr-2" />
                <h4 className="font-bold text-green-800">Quiz Completed!</h4>
              </>
            ) : (
              <>
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                <h4 className="font-bold text-red-800">Review Needed</h4>
              </>
            )}
          </div>
          <p className="text-gray-700">
            You scored <span className="font-bold">{score}%</span> 
            {isPassed 
              ? ' and have passed this quiz.' 
              : ` (${passingScore}% required to pass).`}
          </p>
          {!isPassed && (
            <p className="text-sm text-gray-600 mt-1">
              Review your answers below and try again.
            </p>
          )}
        </div>
      )}

      <div className="space-y-6">
        {questions.map((q, qIndex) => (
          <div key={q.id} className={isSubmitted ? 'opacity-80' : ''}>
            <p className="font-medium mb-2">
              {qIndex + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map(option => {
                const isSelected = userAnswers[q.id] === option.id;
                const isCorrect = option.id === q.correctAnswerId;

                // Style for selected answers after submission
                let optionClass = "flex items-center p-2 rounded";
                if (isSubmitted) {
                  if (isSelected && isCorrect) {
                    optionClass += " bg-green-100 border border-green-300";
                  } else if (isSelected && !isCorrect) {
                    optionClass += " bg-red-100 border border-red-300";
                  } else if (isCorrect) {
                    optionClass += " bg-green-50 border border-green-200";
                  }
                } else if (isSelected) {
                  optionClass += " bg-blue-50 border border-blue-200";
                } else {
                  optionClass += " hover:bg-gray-50";
                }

                return (
                  <div
                    key={option.id}
                    className={optionClass}
                    onClick={() => handleAnswerSelect(q.id, option.id)}
                  >
                    <div className="mr-2">
                      {isSubmitted ? (
                        isSelected && isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : isSelected && !isCorrect ? (
                          <X className="h-5 w-5 text-red-600" />
                        ) : isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 opacity-50" />
                        ) : (
                          <div className="h-5 w-5 border rounded-full border-gray-300 flex items-center justify-center">
                            {isSelected && <div className="h-3 w-3 bg-blue-600 rounded-full"></div>}
                          </div>
                        )
                      ) : (
                        <div className="h-5 w-5 border rounded-full border-gray-300 flex items-center justify-center">
                          {isSelected && <div className="h-3 w-3 bg-blue-600 rounded-full"></div>}
                        </div>
                      )}
                    </div>
                    <label 
                      htmlFor={`${q.id}-${option.id}`}
                      className={`flex-grow cursor-pointer ${isSubmitted && isCorrect ? 'font-medium' : ''}`}
                    >
                      {option.text}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end space-x-2">
        {isSubmitted ? (
          <Button 
            variant="outline" 
            className="flex items-center text-gray-700"
            onClick={resetQuiz}
          >
            <RotateCcw size={16} className="mr-2" />
            Try Again
          </Button>
        ) : (
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white flex items-center" 
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered}
          >
            <CheckCircle size={16} className="mr-2" />
            Submit Answers
          </Button>
        )}
      </div>
    </div>
  );
}