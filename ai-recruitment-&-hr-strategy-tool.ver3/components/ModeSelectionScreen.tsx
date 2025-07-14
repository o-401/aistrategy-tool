
import React from 'react';
import { AppMode } from '../types';

interface ModeSelectionScreenProps {
  onSelectMode: (mode: AppMode) => void;
}

const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const UserGroupIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.142 2.72a3 3 0 01-4.682-2.72M12 18.72M12 9.75M14.25 12a2.25 2.25 0 01-4.5 0m4.5 0a2.25 2.25 0 00-4.5 0M12 9.75C10.895 9.75 10 8.855 10 7.75s.895-2 2-2 2 .895 2 2-.895 2-2 2zm0 0c1.105 0 2 .895 2 2s-.895 2-2 2-2-.895-2-2 2-2 2-2z" /></svg>;
const MagnifyingGlassIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" /></svg>;
const DocumentDatabaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.75h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;


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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ModeCard
                    icon={<UserIcon />}
                    title="個人診断"
                    description="個人の強みや特性を多角的に分析し、自己理解を深めたり、キャリア開発に役立てます。"
                    onClick={() => onSelectMode('individual')}
                    borderColor="border-t-sky-500"
                />
                 <ModeCard
                    icon={<MagnifyingGlassIcon />}
                    title="採用支援"
                    description="候補者のポテンシャルを診断したり、既存チームに最適な人材像をAIが提案します。"
                    onClick={() => onSelectMode('recruitment')}
                    borderColor="border-t-indigo-500"
                />
                <ModeCard
                    icon={<UserGroupIcon />}
                    title="チームビルディング"
                    description="既存メンバーから最高のシナジーを生むチームを編成。新規事業やプロジェクトに最適です。"
                    onClick={() => onSelectMode('team_building')}
                    borderColor="border-t-emerald-500"
                />
                 <ModeCard
                    icon={<DocumentDatabaseIcon />}
                    title="データ管理"
                    description="従業員データをExcelで一括アップロード・ダウンロード。データを手元で安全に管理します。"
                    onClick={() => onSelectMode('data_management')}
                    borderColor="border-t-slate-500"
                />
            </div>
        </div>
    );
};
