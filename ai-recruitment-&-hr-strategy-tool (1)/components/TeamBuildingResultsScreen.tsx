import React from 'react';
import { TeamBuildingResult } from '../types';

interface TeamBuildingResultsScreenProps {
  result: TeamBuildingResult;
  onRestart: () => void;
}

const TeamResultCard: React.FC<{title: string; children: React.ReactNode; icon: React.ReactNode;}> = ({title, children, icon}) => (
    <div className="bg-slate-50 rounded-xl p-6">
        <div className="flex items-center mb-4">
            <span className="p-2 bg-slate-200 rounded-full">{icon}</span>
            <h3 className="text-xl font-bold text-slate-800 ml-3">{title}</h3>
        </div>
        {children}
    </div>
);

const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6.343 17.657l-2.828-2.828m11.314 0l-2.828 2.828M9 21v-4M21 15h-4M15 21v-4M9 3V1m6 2V1" /></svg>;
const ShieldExclamationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

export const TeamBuildingResultsScreen: React.FC<TeamBuildingResultsScreenProps> = ({ result, onRestart }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full animate-fade-in-up">
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <p className="text-slate-500 text-lg">AIによるチーム分析結果</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
          {result.team_title}
        </h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-left leading-relaxed">{result.overall_summary}</p>
      </div>

      <div className="space-y-6">
        <TeamResultCard title="推奨ペアリング" icon={<UsersIcon />}>
          <div className="space-y-5">
            {result.recommended_pairs.map((p, index) => (
              <div key={index}>
                <h4 className="font-bold text-lg text-cyan-700">{p.pair.join(' & ')}</h4>
                <p className="text-slate-600 mt-1"><strong className="text-slate-700">理由:</strong> {p.reason}</p>
                <p className="text-slate-600 mt-1"><strong className="text-slate-700">シナジー:</strong> {p.synergy}</p>
              </div>
            ))}
          </div>
        </TeamResultCard>

        <div className="grid md:grid-cols-2 gap-6">
          <TeamResultCard title="チームの強み" icon={<SparklesIcon />}>
            <ul className="space-y-2 text-slate-700">
              {result.team_strengths.map((item, index) => <li key={index} className="flex items-start"><span className="text-yellow-500 mr-3 mt-1">✦</span><span>{item}</span></li>)}
            </ul>
          </TeamResultCard>
          <TeamResultCard title="チームの注意点" icon={<ShieldExclamationIcon />}>
            <ul className="space-y-2 text-slate-700">
              {result.team_weaknesses.map((item, index) => <li key={index} className="flex items-start"><span className="text-orange-500 mr-3 mt-1">⚠</span><span>{item}</span></li>)}
            </ul>
          </TeamResultCard>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-150 ease-in-out hover:scale-105"
        >
          最初からやり直す
        </button>
      </div>
    </div>
  );
};
