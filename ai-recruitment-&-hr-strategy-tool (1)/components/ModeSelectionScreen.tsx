import React from 'react';
import { AppMode } from '../types';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: AppMode) => void;
}

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const UsersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm6-11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

const ModeCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    borderColor: string;
}> = ({ icon, title, description, onClick, borderColor }) => (
    <button
        onClick={onClick}
        className={`w-full text-left p-6 bg-white rounded-2xl shadow-lg border-t-4 ${borderColor} hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-opacity-50 ${borderColor.replace('border-t', 'ring')}`}
    >
        {icon}
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500">{description}</p>
    </button>
);


export const ModeSelectionScreen: React.FC<ModeSelectionScreenProps> = ({ onSelectMode }) => {
    return (
        <div className="bg-transparent p-4 sm:p-0 rounded-2xl w-full max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">何をしますか？</h2>
            <p className="text-center text-slate-500 mb-8">目的に合わせて最適なモードを選択してください。</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ModeCard
                    icon={<UserIcon />}
                    title="個人診断"
                    description="あなたの特性や強みを深く理解するためのパーソナル分析"
                    onClick={() => onSelectMode('individual')}
                    borderColor="border-t-indigo-500"
                />
                <ModeCard
                    icon={<BriefcaseIcon />}
                    title="採用支援"
                    description="候補者のポテンシャルを見抜き、組織との適合性を診断"
                    onClick={() => onSelectMode('recruitment')}
                     borderColor="border-t-sky-500"
                />
                <ModeCard
                    icon={<UsersIcon />}
                    title="チームビルディング"
                    description="メンバーの組み合わせを分析し、最強のチームを編成"
                    onClick={() => onSelectMode('team_building')}
                     borderColor="border-t-emerald-500"
                />
            </div>
        </div>
    );
};
