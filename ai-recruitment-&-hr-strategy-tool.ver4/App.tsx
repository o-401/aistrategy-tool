
import React, { useState, useCallback, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { MBTIQuestionnaire } from './components/MBTIQuestionnaire';
import { ResultsScreen } from './components/ResultsScreen';
import { Spinner } from './components/Spinner';
import { getComprehensiveDiagnosis, diagnoseMBTI, getTeamBuildingSuggestions, getHiringRecommendation } from './services/geminiService';
import { type ComprehensiveDiagnosis, type GameState, type UserInputData, type TeamBuildingResult, type AppMode, type EmployeeProfile, type HiringRecommendation } from './types';
import { mbtiQuestions } from './constants';
import { DiagnosedProfilesList } from './components/DiagnosedProfilesList';
import { TeamBuildingResultsScreen } from './components/TeamBuildingResultsScreen';
import { ModeSelectionScreen } from './components/ModeSelectionScreen';
import { EmployeeSelectionScreen } from './components/EmployeeSelectionScreen';
import { RecruitmentSubSelectionScreen } from './components/RecruitmentSubSelectionScreen';
import { HiringRecommendationScreen } from './components/HiringRecommendationScreen';
import { DataManagementScreen } from './components/DataManagementScreen';
import { parseExcel, exportToExcel, parseJsonResponse } from './utils/excelHelpers';
import { HiringRecommendationSetupScreen } from './components/HiringRecommendationSetupScreen';


const initialUserData: UserInputData = {
    name: '',
    birthDate: '',
    gender: '回答しない',
    bloodType: '',
    zodiac: '',
    eto: '',
    mbti: '',
    department: '',
    yearsOfService: undefined,
    companyContext: '',
    teamContext: '',
    strengthsContext: '',
    challengesContext: '',
};

function App() {
  const [gameState, setGameState] = useState<GameState>('mode_selection');
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [userData, setUserData] = useState<UserInputData>(initialUserData);
  const [latestResult, setLatestResult] = useState<ComprehensiveDiagnosis | null>(null);
  const [profilesForAnalysis, setProfilesForAnalysis] = useState<ComprehensiveDiagnosis[]>([]);
  const [teamBuildingResult, setTeamBuildingResult] = useState<TeamBuildingResult | null>(null);
  const [hiringRecommendation, setHiringRecommendation] = useState<HiringRecommendation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [allEmployees, setAllEmployees] = useState<EmployeeProfile[]>([]);
  const [streamingResponse, setStreamingResponse] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [resultViewSource, setResultViewSource] = useState<'new' | 'db'>('new');


  const handleModeSelect = (mode: AppMode) => {
    if (mode === 'data_management') {
      setGameState('data_management');
      return;
    }
    setAppMode(mode);
    if (mode === 'recruitment') {
      setGameState('recruitment_sub_selection');
    } else if (mode === 'team_building') {
      if (allEmployees.length === 0) {
        setError("チームビルディング機能を利用するには、まず「データ管理」から従業員データをアップロードしてください。");
        setGameState('error');
        return;
      }
      setGameState('team_building_selection');
    } else {
      setGameState('input');
    }
  };
  
  const handleRecruitmentSubSelect = (selection: 'diagnose' | 'recommend') => {
      if (selection === 'diagnose') {
          setGameState('input');
      } else {
          if (allEmployees.length === 0) {
            setError("採用候補の提案機能を利用するには、まず「データ管理」から従業員データをアップロードしてください。");
            setGameState('error');
            return;
          }
          setGameState('hiring_recommendation_setup');
      }
  };

  const handleDiagnose = useCallback(async (data: UserInputData) => {
    if (!appMode) return;
    setUserData(data);
    setGameState('loading');
    setLoadingMessage(appMode === 'recruitment' ? 'AIが候補者を分析中...' : 'AIが分析中...');
    setError(null);
    setStreamingResponse('');
    setIsStreaming(true);
    setResultViewSource('new');
    
    try {
      const fullText = await getComprehensiveDiagnosis(
        { data, mode: appMode },
        (chunk) => setStreamingResponse(prev => prev + chunk)
      );
      
      const diagnosis = parseJsonResponse<Omit<ComprehensiveDiagnosis, 'id' | 'name'>>(fullText);
      const resultWithId: ComprehensiveDiagnosis = {
        ...diagnosis,
        id: crypto.randomUUID(),
        name: data.name
      };
      setLatestResult(resultWithId);
      setGameState('results');
    } catch (e) {
      if (e instanceof Error) {
        setError(`分析中にエラーが発生しました: ${e.message}`);
      } else {
        setError("分析中に不明なエラーが発生しました。");
      }
      setGameState('error');
    } finally {
        setIsStreaming(false);
    }
  }, [appMode]);

  const handleStartMbtiQuiz = (currentData: UserInputData) => {
    setUserData(currentData);
    setGameState('mbti_quiz');
  };

  const handleMbtiComplete = useCallback((answers: { [key: string]: number }) => {
    setError(null);
    try {
        const mbtiType = diagnoseMBTI(mbtiQuestions, answers);
        setUserData(prevData => ({ ...prevData, mbti: mbtiType }));
        setGameState('input');
    } catch (e) {
        if (e instanceof Error) {
            setError(`MBTI診断中にエラーが発生しました: ${e.message}`);
        } else {
            setError("MBTI診断中に不明なエラーが発生しました。");
        }
        setGameState('error');
    }
  }, []);

  const handleAddToList = () => {
    if (latestResult) {
       // Add the newly diagnosed person to the main list of employees
        const newEmployeeProfile: EmployeeProfile = {
            id: latestResult.id,
            name: latestResult.name,
            birthDate: userData.birthDate,
            gender: userData.gender,
            bloodType: userData.bloodType,
            zodiac: userData.zodiac,
            eto: userData.eto,
            mbti: userData.mbti,
            department: userData.department || latestResult.department_recommendations[0]?.department || '未所属', 
            yearsOfService: userData.yearsOfService || 0,
            diagnosis: { ...latestResult }
        };
        
        setAllEmployees(prev => [...prev, newEmployeeProfile]);
        
        if(appMode === 'individual') {
            setAppMode('team_building');
            setProfilesForAnalysis([latestResult]);
            setGameState('team_building_analysis');
        } else { // recruitment
            setLatestResult(null);
            setUserData(initialUserData);
            setGameState('input');
        }
    }
  };
  
  const handleRemoveFromList = (id: string) => {
    setProfilesForAnalysis(prev => prev.filter(p => p.id !== id));
  };
  
  const handleStartTeamAnalysisSetup = (selectedProfiles: EmployeeProfile[]) => {
      const profiles = selectedProfiles.map(p => ({
          ...p.diagnosis,
          id: p.id,
          name: p.name,
      }));
      setProfilesForAnalysis(profiles);
      setGameState('team_building_analysis');
  };

  const handleTeamAnalysis = async (purpose: string, industry: string, teamSize: number, department: string) => {
      if (!purpose || !industry || !teamSize) {
        setError("チーム分析を実行する前に、目的、業種、チーム人数をすべて指定してください。");
        return;
      }
      setGameState('loading');
      setLoadingMessage('最強のチームを編成中...');
      setError(null);
      setStreamingResponse('');
      setIsStreaming(true);

      try {
          const fullText = await getTeamBuildingSuggestions(
            { profiles: profilesForAnalysis, purpose, industry, teamSize, department },
            (chunk) => setStreamingResponse(prev => prev + chunk)
          );
          const result = parseJsonResponse<TeamBuildingResult>(fullText);
          setTeamBuildingResult(result);
          setGameState('team_building_results');
      } catch (e) {
          if (e instanceof Error) {
              setError(`チーム分析中にエラーが発生しました: ${e.message}`);
          } else {
              setError("チーム分析中に不明なエラーが発生しました。");
          }
          setGameState('error');
      } finally {
        setIsStreaming(false);
      }
  };

  const handleGetHiringRecommendation = async (department: string, teamContext: string) => {
    setGameState('loading');
    setLoadingMessage('AIが既存チームを分析中...');
    setError(null);
    setStreamingResponse('');
    setIsStreaming(true);
    try {
        const membersForAnalysis = allEmployees.map(e => ({
            name: e.name,
            department: e.department,
            diagnosis: e.diagnosis
        }));
        const fullText = await getHiringRecommendation(
            { members: membersForAnalysis, department, teamContext },
            (chunk) => setStreamingResponse(prev => prev + chunk)
        );
        const result = parseJsonResponse<HiringRecommendation>(fullText);
        setHiringRecommendation(result);
        setGameState('hiring_recommendation_results');
    } catch (e) {
        if (e instanceof Error) {
            setError(`採用提案の生成中にエラーが発生しました: ${e.message}`);
        } else {
            setError("採用提案の生成中に不明なエラーが発生しました。");
        }
        setGameState('error');
    } finally {
        setIsStreaming(false);
    }
  };

  const handleRestart = () => {
    setGameState('input');
    setLatestResult(null);
    setError(null);
    setUserData(initialUserData);
  };
  
  const handleResetAll = () => {
    setGameState('mode_selection');
    setAppMode(null);
    setLatestResult(null);
    setError(null);
    setUserData(initialUserData);
    setProfilesForAnalysis([]);
    setTeamBuildingResult(null);
    setHiringRecommendation(null);
  };
  
  const handleFileUpload = async (file: File) => {
      setLoadingMessage("Excelファイルを解析中...");
      setGameState('loading');
      try {
          const data = await parseExcel(file);
          setAllEmployees(data);
          setGameState('data_management');
      } catch(e) {
          if (e instanceof Error) {
            setError(`ファイル解析エラー: ${e.message}`);
          } else {
            setError("不明なファイル解析エラーが発生しました。");
          }
          setGameState('error');
      }
  };
  
  const handleFileExport = () => {
      try {
          exportToExcel(allEmployees, 'employee_data_export.xlsx');
      } catch(e) {
          if (e instanceof Error) {
            setError(`ファイル出力エラー: ${e.message}`);
          } else {
            setError("不明なファイル出力エラーが発生しました。");
          }
          setGameState('error');
      }
  };

  const handleViewProfile = (profile: EmployeeProfile) => {
    const result: ComprehensiveDiagnosis = {
        ...profile.diagnosis,
        id: profile.id,
        name: profile.name,
    };
    setLatestResult(result);
    setResultViewSource('db');
    setGameState('results');
  };

  const renderContent = () => {
    switch (gameState) {
      case 'mode_selection':
        return <ModeSelectionScreen onSelectMode={handleModeSelect} />;
      case 'data_management':
          return <DataManagementScreen 
                    employees={allEmployees}
                    onFileUpload={handleFileUpload} 
                    onFileExport={handleFileExport} 
                    employeeCount={allEmployees.length}
                    onViewProfile={handleViewProfile}
                    onBack={handleResetAll}
                 />;
      case 'recruitment_sub_selection':
        return <RecruitmentSubSelectionScreen onSelect={handleRecruitmentSubSelect} />;
      case 'hiring_recommendation_setup':
          return <HiringRecommendationSetupScreen employees={allEmployees} onRecommend={handleGetHiringRecommendation} />;
      case 'input':
        return appMode && <InputForm appMode={appMode} initialData={userData} onSubmit={handleDiagnose} onStartMbtiQuiz={handleStartMbtiQuiz} />;
      case 'mbti_quiz':
        return <MBTIQuestionnaire onComplete={handleMbtiComplete} />;
      case 'loading':
        return (
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-indigo-600">{loadingMessage}</h2>
            <p className="text-slate-600 mb-8">AIが最適な分析を実行中です。しばらくお待ちください。</p>
            <Spinner />
            {isStreaming && (
                <div className="mt-6 w-full text-left bg-slate-100 p-4 rounded-lg max-h-60 overflow-y-auto" aria-live="polite">
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">AIレスポンス (リアルタイム)</h4>
                    <pre className="text-xs text-slate-700 whitespace-pre-wrap break-words">
                        {streamingResponse}
                    </pre>
                </div>
            )}
          </div>
        );
      case 'results':
        return latestResult && (
          <ResultsScreen 
            result={latestResult} 
            onAddToList={handleAddToList} 
            onRestart={handleRestart} 
            appMode={appMode}
            onBack={resultViewSource === 'db' ? () => setGameState('data_management') : undefined}
          />
        );
      case 'team_building_selection':
        return <EmployeeSelectionScreen employees={allEmployees} onAnalyze={handleStartTeamAnalysisSetup} />;
      case 'team_building_analysis':
        return (
            <DiagnosedProfilesList 
                profiles={profilesForAnalysis} 
                onRemove={handleRemoveFromList}
                onAnalyze={handleTeamAnalysis}
            />
        );
      case 'team_building_results':
        return teamBuildingResult && <TeamBuildingResultsScreen result={teamBuildingResult} onRestart={handleResetAll} />;
      case 'hiring_recommendation_results':
        return hiringRecommendation && <HiringRecommendationScreen result={hiringRecommendation} onRestart={handleResetAll} />;
      case 'error':
        return (
             <div className="text-center p-8 bg-white rounded-lg shadow-xl max-w-lg mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-red-600">エラーが発生しました</h2>
                <p className="text-slate-600 mb-6">{error}</p>
                <button
                    onClick={handleResetAll}
                    className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-150 ease-in-out hover:scale-105"
                >
                    トップに戻る
                </button>
            </div>
        );
      default:
        return <ModeSelectionScreen onSelectMode={handleModeSelect} />;
    }
  };
  
  const mainTitle = appMode === 'recruitment' ? "AI採用支援ツール" :
                    appMode === 'team_building' ? "AIチームビルディングツール" :
                    appMode === 'individual' ? "AIパーソナル診断ツール" :
                     "AI人材戦略ツール";

  const subTitle = appMode === 'recruitment' ? "候補者のポテンシャルを見抜き、最適な配属先まで提案します" :
                    appMode === 'team_building' ? "メンバーの特性を分析し、最高のシナジーを生むチームを編成します" :
                    appMode === 'individual' ? "あなたの強みや特性を多角的に分析し、自己理解を深めます" :
                    "AIで、人と組織の可能性を最大化する";


  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <header className="w-full max-w-5xl mx-auto text-center mb-8">
         <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-sky-500 pb-2">
          {mainTitle}
        </h1>
        <p className="text-slate-500 mt-2 text-lg">{subTitle}</p>
      </header>
      <main className="w-full max-w-2xl">
        <div className="transition-all duration-500 ease-in-out">
          {renderContent()}
        </div>
      </main>

      <footer className="w-full max-w-4xl mx-auto text-center mt-12 text-slate-400 text-sm">
        <p>Powered by Google Gemini API</p>
         {gameState !== 'mode_selection' && (
          <button onClick={handleResetAll} className="mt-2 text-indigo-500 hover:underline">
            トップに戻る
          </button>
         )}
      </footer>
    </div>
  );
}

export default App;
