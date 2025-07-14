
import React, {useState, useEffect} from 'react';
import { ComprehensiveDiagnosis } from '../types';
import { industries } from '../constants';

interface DiagnosedProfilesListProps {
  profiles: ComprehensiveDiagnosis[];
  onRemove: (id: string) => void;
  onAnalyze: (purpose: string, industry: string, teamSize: number, department: string) => void;
}

const teamPurposes: { id: string; label: string; description: string }[] = [
  { id: '新規事業の立ち上げ（創造性重視）', label: '新規事業', description: '創造性重視' },
  { id: '既存業務の効率化（堅実性・実行力重視）', label: '業務効率化', description: '堅実性・実行力重視' },
  { id: '困難なプロジェクトの突破（多様性・推進力重視）', label: 'プロジェクト突破', description: '多様性・推進力重視' },
];

export const DiagnosedProfilesList: React.FC<DiagnosedProfilesListProps> = ({ profiles, onRemove, onAnalyze }) => {
  const [customPurpose, setCustomPurpose] = useState('');
  const [selectedPurpose, setSelectedPurpose] = useState('');
  const [industry, setIndustry] = useState(industries[0]);
  const [teamSize, setTeamSize] = useState<number>(3);
  const [department, setDepartment] = useState('');


  useEffect(() => {
    if (teamPurposes.some(p => p.id === selectedPurpose)) {
        setCustomPurpose('');
    }
  }, [selectedPurpose]);
  
  const handleCustomPurposeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setCustomPurpose(value);
      setSelectedPurpose(value);
  }

  const handleAnalyzeClick = () => {
    onAnalyze(selectedPurpose, industry, teamSize, department);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl animate-fade-in w-full">
      <h3 className="text-xl font-bold text-slate-800 mb-4">チーム分析リスト ({profiles.length}名)</h3>
      <div className="space-y-3 max-h-48 overflow-y-auto pr-2 border-y border-slate-200 py-2">
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
        <div className="mt-4">
            <h4 className="text-lg font-semibold text-slate-700 mb-3 text-center">チーム編成の条件を設定</h4>
            
            <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-1">1. このチームの目的は？</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {teamPurposes.map((p) => (
                      <button
                          key={p.id}
                          onClick={() => setSelectedPurpose(p.id)}
                          className={`p-2 rounded-lg text-center transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                              selectedPurpose === p.id 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                      >
                          <span className="block font-bold text-sm">{p.label}</span>
                          <span className="block text-xs opacity-80">{p.description}</span>
                      </button>
                      ))}
                  </div>
                  <input
                      type="text"
                      placeholder="または、カスタム目的を入力..."
                      className="mt-2 w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={customPurpose}
                      onChange={handleCustomPurposeChange}
                    />
                </div>
                
                <div>
                    <label htmlFor="department" className="block text-sm font-medium text-slate-600 mb-1">2. どの部署のチームですか？（任意）</label>
                    <input
                        id="department"
                        type="text"
                        placeholder="例：新規事業開発部"
                        className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-slate-600 mb-1">3. 業種は？</label>
                    <select id="industry" value={industry} onChange={e => setIndustry(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                        {industries.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="team-size" className="block text-sm font-medium text-slate-600 mb-1">4. チーム人数は？</label>
                    <input
                      type="number"
                      id="team-size"
                      value={teamSize}
                      onChange={e => setTeamSize(Math.max(2, Math.min(profiles.length, parseInt(e.target.value, 10) || 2)))}
                      min="2"
                      max={profiles.length}
                      className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>
            </div>

            <div className="mt-6">
            <button
                onClick={handleAnalyzeClick}
                disabled={!selectedPurpose || !industry || teamSize < 2 || profiles.length < teamSize}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
                {profiles.length}名から{teamSize}名のチーム編成を提案
            </button>
            {profiles.length < teamSize && <p className="text-red-500 text-sm text-center mt-2">選択されたメンバーがチーム人数より少ないです。</p>}
            </div>
        </div>
      )}
    </div>
  );
};
