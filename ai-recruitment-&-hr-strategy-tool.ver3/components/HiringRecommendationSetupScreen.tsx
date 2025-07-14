
import React, { useState, useMemo } from 'react';
import { EmployeeProfile } from '../types';

interface HiringRecommendationSetupScreenProps {
  employees: EmployeeProfile[];
  onRecommend: (department: string, teamContext: string) => void;
}

export const HiringRecommendationSetupScreen: React.FC<HiringRecommendationSetupScreenProps> = ({ employees, onRecommend }) => {
    const [department, setDepartment] = useState('');
    const [teamContext, setTeamContext] = useState('');

    const existingDepartments = useMemo(() => {
        return ['all', ...Array.from(new Set(employees.map(e => e.department).filter(d => d && d !== '未所属')))];
    }, [employees]);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRecommend(department, teamContext);
    }

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg mx-auto animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">採用候補の提案設定</h2>
            <p className="text-center text-slate-500 mb-6">AIが分析するチームの情報を入力してください。</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-600 mb-1">
                        どの部署に人材を補充しますか？
                    </label>
                    <select 
                        id="department" 
                        value={department} 
                        onChange={e => setDepartment(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        required
                    >
                        <option value="" disabled>部署を選択してください</option>
                        {existingDepartments.map(d => (
                            <option key={d} value={d}>{d === 'all' ? '全部署（会社全体）' : d}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="teamContext" className="block text-sm font-medium text-slate-600 mb-1">
                        チームに関する補足情報（任意）
                    </label>
                    <textarea 
                        id="teamContext"
                        value={teamContext}
                        onChange={e => setTeamContext(e.target.value)}
                        placeholder="例：現在のチームはベテランが多く、慎重な雰囲気。新しい風を吹き込む若手を探している。"
                        rows={4}
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white font-bold py-3 px-12 rounded-full hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50"
                        disabled={!department}
                    >
                        理想の候補者をAIに提案してもらう
                    </button>
                </div>
            </form>
        </div>
    );
}
