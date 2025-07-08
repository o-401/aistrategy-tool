
import React, { useState } from 'react';
import { mbtiQuestions } from '../constants';
import { ProgressBar } from './ProgressBar';

interface MBTIQuestionnaireProps {
  onComplete: (answers: { [key: string]: string }) => void;
}

export const MBTIQuestionnaire: React.FC<MBTIQuestionnaireProps> = ({ onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});

  const handleAnswer = (questionId: number, answerId: string) => {
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);

    if (currentQuestionIndex < mbtiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Last question answered, determine the type
      const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
      
      mbtiQuestions.forEach(q => {
        const answer = newAnswers[q.id];
        if (answer) {
            // @ts-ignore
            counts[answer]++;
        }
      });
      
      // Pass all answers to App.tsx for AI diagnosis
      onComplete(newAnswers);
    }
  };
  
  const question = mbtiQuestions[currentQuestionIndex];

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full animate-slide-in">
      <ProgressBar current={currentQuestionIndex + 1} total={mbtiQuestions.length} />
      <div className="mt-6">
        <p className="text-sm font-semibold text-indigo-600 mb-2">
          MBTI診断 ({currentQuestionIndex + 1}/{mbtiQuestions.length})
        </p>
        <h2 className="text-2xl font-bold text-slate-800">
          {question.text}
        </h2>
      </div>
      <div className="mt-8 space-y-4">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswer(question.id, option.id)}
            className="w-full text-left p-4 bg-slate-50 border-2 border-slate-200 rounded-lg hover:bg-indigo-100 hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
          >
            <span className="font-semibold text-slate-700">{option.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
