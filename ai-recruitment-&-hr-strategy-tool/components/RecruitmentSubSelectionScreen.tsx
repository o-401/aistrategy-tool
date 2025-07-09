
import React from 'react';

interface RecruitmentSubSelectionScreenProps {
  onSelect: (selection: 'diagnose' | 'recommend') => void;
}

const SearchIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>;
const LightbulbIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;


const OptionCard: React.FC<{
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


export const RecruitmentSubSelectionScreen: React.FC<RecruitmentSubSelectionScreenProps> = ({ onSelect }) => {
    return (
        <div className="bg-transparent p-4 sm:p-0 rounded-2xl w-full max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">採用支援メニュー</h2>
            <p className="text-center text-slate-500 mb-8">実行したい分析を選択してください。</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OptionCard
                    icon={<SearchIcon />}
                    title="新規候補者の診断"
                    description="特定の候補者の情報を入力し、ポテンシャルや組織との適合性を診断します。"
                    onClick={() => onSelect('diagnose')}
                    borderColor="border-t-indigo-500"
                />
                <OptionCard
                    icon={<LightbulbIcon />}
                    title="採用候補の提案"
                    description="既存チームを分析し、チームを強化する理想的な人材プロファイルをAIが提案します。"
                    onClick={() => onSelect('recommend')}
                     borderColor="border-t-sky-500"
                />
            </div>
        </div>
    );
};
