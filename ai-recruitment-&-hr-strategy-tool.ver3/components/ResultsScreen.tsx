
import React, { useState } from 'react';
import { type ComprehensiveDiagnosis, AppMode } from '../types';

interface ResultsScreenProps {
  result: ComprehensiveDiagnosis;
  onAddToList: () => void;
  onRestart: () => void;
  appMode: AppMode | null;
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

const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;
const HeartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const MegaphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.518" /></svg>;
const BuildingOfficeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m5-11v12m-4-12v12" /></svg>;
const UserCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ChatBubbleOvalLeftEllipsisIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.536A11.954 11.954 0 0112 15c-3.183 0-6.22-.62-9-1.745M15 6.75l-3 3m0 0l-3-3m3 3v6m-1.5-1.5l-3-3m0 0l-3 3" /></svg>;


const ManagerView: React.FC<{result: ComprehensiveDiagnosis}> = ({result}) => (
    <div className="space-y-6 animate-fade-in">
        <ResultCard title="マネジメントのヒント" icon={<LightbulbIcon />}>
              <ul className="space-y-2 text-slate-700">
                {result.manager_view?.management_tips.map((item, index) => <li key={index} className="flex items-start"><span className="text-amber-500 mr-3 mt-1">●</span><span>{item}</span></li>)}
              </ul>
        </ResultCard>
        <ResultCard title="チームにおける潜在的なリスク" icon={<MegaphoneIcon />}>
              <ul className="space-y-2 text-slate-700">
                {result.manager_view?.potential_risks.map((item, index) => <li key={index} className="flex items-start"><span className="text-sky-500 mr-3 mt-1">▸</span><span>{item}</span></li>)}
              </ul>
        </ResultCard>
        <div className="grid md:grid-cols-2 gap-6">
            <ResultCard title="効果的な動機付け" icon={<HeartIcon />}>
            <ul className="space-y-2 text-slate-700">
                {result.manager_view?.praise_tips.map((item, index) => <li key={index} className="flex items-start"><span className="text-rose-500 mr-3 mt-1">▸</span><span>{item}</span></li>)}
            </ul>
            </ResultCard>
            <ResultCard title="フィードバックのヒント" icon={<MegaphoneIcon />}>
            <ul className="space-y-2 text-slate-700">
                {result.manager_view?.feedback_tips.map((item, index) => <li key={index} className="flex items-start"><span className="text-sky-500 mr-3 mt-1">▸</span><span>{item}</span></li>)}
            </ul>
            </ResultCard>
        </div>
        <ResultCard title="理想的な環境" icon={<BuildingOfficeIcon />}>
              <p className="text-slate-700">{result.manager_view?.ideal_environment}</p>
        </ResultCard>
    </div>
);

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, onAddToList, onRestart, appMode }) => {
  const [view, setView] = useState<'self' | 'manager'>('self');

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full animate-fade-in-up">
      <div className="text-center border-b border-slate-200 pb-6 mb-6">
        <p className="text-slate-500 text-lg">{result.name}さんの診断結果</p>
        <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500">
          {result.title}
        </h2>
        <p className="mt-4 text-slate-600 max-w-xl mx-auto text-left leading-relaxed">{result.overall}</p>
      </div>

      {view === 'self' ? (
        <div className="space-y-6 animate-fade-in">
            <ResultCard title={appMode === 'recruitment' ? "候補者の強み" : "あなたの強み"} icon={<CheckIcon />}>
            <ul className="space-y-2 text-slate-700">
                {result.strengths.map((item, index) => <li key={index} className="flex items-center"><span className="text-emerald-500 mr-3 text-xl font-bold">✓</span><span>{item}</span></li>)}
            </ul>
            </ResultCard>

            <ResultCard title="さらなる成長のためのヒント" icon={<LightbulbIcon />}>
            <ul className="space-y-2 text-slate-700">
                {result.weaknesses.map((item, index) => <li key={index} className="flex items-start"><span className="text-amber-500 mr-3 mt-1">●</span><span>{item}</span></li>)}
            </ul>
            </ResultCard>

            <div className="grid md:grid-cols-2 gap-6">
                <ResultCard title="理想のワークスタイル" icon={<UserCircleIcon />}>
                    <p className="text-slate-700">{result.ideal_work_style}</p>
                </ResultCard>
                <ResultCard title="コミュニケーション" icon={<ChatBubbleOvalLeftEllipsisIcon />}>
                    <p className="text-slate-700">{result.communication_style}</p>
                </ResultCard>
            </div>
            
            <ResultCard title="部署推薦と理由" icon={<BuildingOfficeIcon />}>
            <div className="space-y-4">
                {result.department_recommendations.map((item, index) => (
                <div key={index} className="p-4 bg-indigo-50 rounded-lg">
                    <h4 className="font-bold text-indigo-800 text-md">{item.department}</h4>
                    <p className="text-sm text-indigo-700 mt-1">{item.reason}</p>
                </div>
                ))}
            </div>
            </ResultCard>
        </div>
      ) : (
          result.manager_view && <ManagerView result={result} />
      )}
      
      <div className="mt-8 pt-6 border-t border-slate-200">
        <div className="text-center space-y-4 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
            <button
            onClick={onAddToList}
            className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-150 ease-in-out hover:scale-105"
            >
            {appMode === 'individual' ? 'この結果を保存' : 'この候補者をリストに追加'}
            </button>
            <button
            onClick={onRestart}
            className="w-full sm:w-auto bg-slate-200 text-slate-700 font-bold py-3 px-8 rounded-full hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400 transition-transform duration-150 ease-in-out hover:scale-105"
            >
            {appMode === 'recruitment' ? '他の候補者を診断する' : '別の個人を診断する'}
            </button>
        </div>

        {(appMode === 'individual' || appMode === 'recruitment') && result.manager_view && (
            <div className="mt-8 flex justify-center">
                <div className="inline-flex rounded-lg shadow-sm">
                    <button
                        onClick={() => setView('self')}
                        className={`px-4 py-2 text-sm font-medium ${view === 'self' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'} rounded-l-lg border border-slate-200 focus:z-10 focus:ring-2 focus:ring-indigo-500`}
                    >
                        {appMode === 'recruitment' ? '候補者向け表示' : '本人用表示'}
                    </button>
                    <button
                        onClick={() => setView('manager')}
                        className={`px-4 py-2 text-sm font-medium ${view === 'manager' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'} rounded-r-lg border-t border-b border-r border-slate-200 focus:z-10 focus:ring-2 focus:ring-indigo-500`}
                    >
                        マネージャー用表示
                    </button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
