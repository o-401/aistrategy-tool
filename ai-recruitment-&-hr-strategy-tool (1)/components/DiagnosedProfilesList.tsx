import React from 'react';
import { ComprehensiveDiagnosis } from '../types';

interface DiagnosedProfilesListProps {
  profiles: ComprehensiveDiagnosis[];
  onRemove: (id: string) => void;
  onAnalyze: () => void;
}

export const DiagnosedProfilesList: React.FC<DiagnosedProfilesListProps> = ({ profiles, onRemove, onAnalyze }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl animate-fade-in w-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">チーム分析リスト</h3>
      <div className="space-y-3">
        {profiles.map(profile => (
          <div key={profile.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-lg">
            <div>
                <p className="font-bold text-slate-800">{profile.name}</p>
                <p className="text-sm text-slate-500">{profile.title}</p>
            </div>
            <button
              onClick={() => onRemove(profile.id)}
              className="text-slate-400 hover:text-red-500 transition-colors"
              aria-label={`${profile.name}をリストから削除`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      {profiles.length >= 2 && (
        <div className="mt-6">
          <button
            onClick={onAnalyze}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {profiles.length}名でチーム分析を実行
          </button>
        </div>
      )}
    </div>
  );
};
