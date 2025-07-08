import React, { useState, useCallback } from 'react';
import { InputForm } from './components/InputForm';
import { MBTIQuestionnaire } from './components/MBTIQuestionnaire';
import { ResultsScreen } from './components/ResultsScreen';
import { Spinner } from './components/Spinner';
import { getComprehensiveDiagnosis, diagnoseMBTI, getTeamBuildingSuggestions } from './services/geminiService';
import { type ComprehensiveDiagnosis, type GameState, type UserInputData, type TeamBuildingResult, type AppMode } from './types';
import { mbtiQuestions } from './constants';
import { DiagnosedProfilesList } from './components/DiagnosedProfilesList';
import { TeamBuildingResultsScreen } from './components/TeamBuildingResultsScreen';
import { ModeSelectionScreen } from './components/ModeSelectionScreen';

const initialUserData: UserInputData = {
    name: '',
    birthDate: '',
    gender: '回答しない',
    bloodType: '',
    zodiac: '',
    eto: '',
    mbti: '',
    companyContext: '',
};

function App() {
  const [gameState, setGameState] = useState<GameState>('mode_selection');
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [userData, setUserData] = useState<UserInputData>(initialUserData);
  const [latestResult, setLatestResult] = useState<ComprehensiveDiagnosis | null>(null);
  const [diagnosedProfiles, setDiagnosedProfiles] = useState<ComprehensiveDiagnosis[]>([]);
  const [teamBuildingResult, setTeamBuildingResult] = useState<TeamBuildingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode);
    setGameState('input');
  };

  const handleDiagnose = useCallback(async (data: UserInputData) => {
    if (!appMode) return;
    setUserData(data);
    setGameState('loading');
    setLoadingMessage(appMode === 'recruitment' ? 'AIが候補者を分析中...' : 'AIが分析中...');
    setError(null);
    try {
      const diagnosis = await getComprehensiveDiagnosis(data, appMode);
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
    }
  }, [appMode]);

  const handleStartMbtiQuiz = (currentData: UserInputData) => {
    setUserData(currentData);
    setGameState('mbti_quiz');
  };

  const handleMbtiComplete = useCallback(async (answers: { [key: string]: string }) => {
    setGameState('loading');
    setLoadingMessage('MBTIタイプを診断中...');
    setError(null);
    try {
        const mbtiType = await diagnoseMBTI(mbtiQuestions, answers);
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
      if(appMode === 'individual') setAppMode('team_building');
      setDiagnosedProfiles(prev => [...prev, latestResult]);
      setLatestResult(null);
      setUserData(initialUserData);
      setGameState('input');
    }
  };
  
  const handleRemoveFromList = (id: string) => {
    setDiagnosedProfiles(prev => prev.filter(p => p.id !== id));
  };

  const handleTeamAnalysis = async () => {
      setGameState('loading');
      setLoadingMessage('最強のチームを編成中...');
      setError(null);
      try {
          const result = await getTeamBuildingSuggestions(diagnosedProfiles);
          setTeamBuildingResult(result);
          setGameState('team_building_results');
      } catch (e) {
          if (e instanceof Error) {
              setError(`チーム分析中にエラーが発生しました: ${e.message}`);
          } else {
              setError("チーム分析中に不明なエラーが発生しました。");
          }
          setGameState('error');
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
    setDiagnosedProfiles([]);
    setTeamBuildingResult(null);
  };

  const renderContent = () => {
    switch (gameState) {
      case 'mode_selection':
        return <ModeSelectionScreen onSelectMode={handleModeSelect} />;
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
          </div>
        );
      case 'results':
        return latestResult && <ResultsScreen result={latestResult} onAddToList={handleAddToList} onRestart={handleRestart} />;
      case 'team_building_results':
        return teamBuildingResult && <TeamBuildingResultsScreen result={teamBuildingResult} onRestart={handleResetAll} />;
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
      
      {diagnosedProfiles.length > 0 && gameState === 'input' && (
        <aside className="w-full max-w-2xl mt-8">
            <DiagnosedProfilesList 
                profiles={diagnosedProfiles} 
                onRemove={handleRemoveFromList}
                onAnalyze={handleTeamAnalysis}
            />
        </aside>
      )}

      <footer className="w-full max-w-4xl mx-auto text-center mt-12 text-slate-400 text-sm">
        <p>Powered by Google Gemini API</p>
         {appMode && gameState !== 'mode_selection' && (
          <button onClick={handleResetAll} className="mt-2 text-indigo-500 hover:underline">
            トップに戻る
          </button>
         )}
      </footer>
    </div>
  );
}

export default App;