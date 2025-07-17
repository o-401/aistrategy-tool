
import React, { useState } from 'react';
import { mbtiQuestions } from '../constants';
import { ProgressBar } from './ProgressBar';

interface MBTIQuestionnaireProps {
  onComplete: (answers: { [key: string]: number }) => void;
}

const scaleValues = [-3, -2, -1, 0, 1, 2, 3];

export const MBTIQuestionnaire: React.FC<MBTIQuestionnaireProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnswer = (questionId: number, value: number) => {
    if (isAnimating) return;

    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    setIsAnimating(true);

    setTimeout(() => {
      if (currentQuestionIndex < mbtiQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        onComplete(newAnswers);
      }
      setIsAnimating(false);
    }, 300); // Animation duration
  };
  
  const question = mbtiQuestions[currentQuestionIndex];
  const animationClass = isAnimating ? 'animate-fade-out' : 'animate-fade-in';

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full">
      <ProgressBar current={currentQuestionIndex + 1} total={mbtiQuestions.length} />
      <div className={`mt-6 transition-opacity duration-300 ${animationClass}`}>
        <p className="text-sm font-semibold text-indigo-600 mb-2 text-center">
          MBTI診断 ({currentQuestionIndex + 1}/{mbtiQuestions.length})
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 text-center mb-4">
            あなたはどちらの傾向がより強いですか？
        </h2>
        <div className="my-6 p-4 bg-slate-50 rounded-lg">
            <div className="flex justify-between items-center text-center font-bold">
                <span className="w-2/5 text-indigo-700">{question.poleA.text}</span>
                <span className="w-1/5 text-sm text-slate-400">vs</span>
                <span className="w-2/5 text-cyan-700">{question.poleB.text}</span>
            </div>
        </div>
      </div>
      <div className={`mt-8 flex justify-center items-center space-x-1 sm:space-x-2 transition-opacity duration-300 ${animationClass}`}>
        {scaleValues.map((value) => (
          <button
            key={value}
            onClick={() => handleAnswer(question.id, value)}
            aria-label={`Scale ${value}`}
            className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ease-in-out transform
              ${value < 0 ? 'border-indigo-300 hover:border-indigo-500' : ''}
              ${value > 0 ? 'border-cyan-300 hover:border-cyan-500' : ''}
              ${value === 0 ? 'border-slate-300 hover:border-slate-500' : ''}
              ${answers[question.id] === value 
                ? (value < 0 ? 'bg-indigo-600 text-white scale-110 shadow-lg' : '') +
                  (value > 0 ? 'bg-cyan-600 text-white scale-110 shadow-lg' : '') +
                  (value === 0 ? 'bg-slate-600 text-white scale-110 shadow-lg' : '')
                : 'bg-white'
              }
            `}
          >
          </button>
        ))}
      </div>
       <div className="flex justify-between items-center text-xs text-slate-500 mt-2 px-1">
            <span>強くそう思う</span>
            <span>どちらでもない</span>
            <span>強くそう思う</span>
        </div>
    </div>
  );
};
