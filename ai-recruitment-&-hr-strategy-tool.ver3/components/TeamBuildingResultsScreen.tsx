
import React from 'react';
import { TeamBuildingResult, SuggestedTeam } from '../types';

interface TeamBuildingResultsScreenProps {
  result: TeamBuildingResult;
  onRestart: () => void;
}

const TeamCard: React.FC<{ team: SuggestedTeam }> = ({ team }) => (
    <div className="bg-slate-50 rounded-xl p-6 border-l-4 border-cyan-500">
        <h3 className="text-2xl font-bold text-cyan-800">{team.team_title}</h3>
        <p className="font-semibold text-slate-600 mt-1 mb-3">メンバー: {team.members.join(', ')}</p>

        <div className="space-y-4">
            <div>
                <h4 className="font-bold text-slate-700">編成理由</h4>
                <p className="text-slate-600 text-sm">{team.reason}</p>
            </div>
            <div>
                <h4 className="font-bold text-slate-700">期待されるシナジー</h4>
                <p className="text-slate-600 text-sm">{team.synergy}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                    <h5 className="font-semibold text-emerald-700 mb-1">強み</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {team.team_strengths.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                </div>
                <div>
                    <h5 className="font-semibold text-amber-700 mb-1">注意点</h5>
                    <ul className="list-disc list-inside space-y-1 text-slate-600">
                        {team.team_weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);


export const TeamBuildingResultsScreen: React.FC<TeamBuildingResultsScreenProps> = ({ result, onRestart }) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full animate-fade-in-up">
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <p className="text-slate-500 text-lg">AIによるチーム分析結果</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
          チーム編成 提案
        </h2>
        <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-left leading-relaxed">{result.overall_summary}</p>
      </div>

      <div className="space-y-6">
        {result.suggested_teams.map((team, index) => (
            <TeamCard key={index} team={team} />
        ))}
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