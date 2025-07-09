
import React from 'react';
import { HiringRecommendation } from '../types';

interface HiringRecommendationScreenProps {
  result: HiringRecommendation;
  onRestart: () => void;
}

const ResultCard: React.FC<{title: string; children: React.ReactNode; icon: React.ReactNode;}> = ({title, children, icon}) => (
    <div className="bg-slate-50 rounded-xl p-6">
        <div className="flex items-center mb-4">
            <span className="p-2 bg-slate-200 rounded-full">{icon}</span>
            <h3 className="text-xl font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const ChartBarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const CheckBadgeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>;
const ChatBubbleLeftRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193l-3.722.537a5.25 5.25 0 01-3.493 0L6.221 17c-1.133-.093-1.98-1.057-1.98-2.192v-4.286c0-.97.616-1.813 1.5-2.097M16.5 7.5c0-1.036-.84-1.875-1.875-1.875h-3.75C9.84 5.625 9 6.464 9 7.5v4.5m8.452-4.5c.223.497.355 1.054.355 1.648v3.101c0 .64-.148 1.253-.432 1.819" /></svg>;


export const HiringRecommendationScreen: React.FC<HiringRecommendationScreenProps> = ({ result, onRestart }) => {
  const { team_analysis_summary, ideal_candidate_profile } = result;

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full animate-fade-in-up">
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <p className="text-slate-500 text-lg">AIによる採用候補提案</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500">
          理想の候補者: {ideal_candidate_profile.title}
        </h2>
      </div>

      <div className="space-y-6">
        <ResultCard title="現チームの分析サマリー" icon={<ChartBarIcon />}>
          <p className="text-slate-600 leading-relaxed">{team_analysis_summary}</p>
        </ResultCard>

        <ResultCard title="求める強み" icon={<CheckBadgeIcon />}>
          <ul className="space-y-2 text-slate-700">
            {ideal_candidate_profile.key_strengths.map((item, index) => <li key={index} className="flex items-center"><span className="text-emerald-500 mr-3 text-xl font-bold">✓</span><span>{item}</span></li>)}
          </ul>
           <p className="text-sm text-slate-500 mt-4">
            <span className="font-semibold">推奨MBTI傾向:</span> {ideal_candidate_profile.mbti_suggestion}
          </p>
        </ResultCard>

        <ResultCard title="採用すべき理由" icon={<ChatBubbleLeftRightIcon />}>
          <p className="text-slate-600 leading-relaxed">{ideal_candidate_profile.reasoning}</p>
        </ResultCard>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-150 ease-in-out hover:scale-105"
        >
          トップに戻る
        </button>
      </div>
    </div>
  );
};
