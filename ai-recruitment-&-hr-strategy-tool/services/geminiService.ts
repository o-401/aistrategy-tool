import { type ComprehensiveDiagnosis, type Question, type UserInputData, type TeamBuildingResult, type AppMode, type HiringRecommendation } from '../types';

async function callApi<T>(action: string, payload: unknown): Promise<T> {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok) {
        // Attempt to parse error message from the server, otherwise use a generic one
        const errorData = await response.json().catch(() => ({ message: '不明なサーバーエラーが発生しました。' }));
        throw new Error(errorData.message || 'APIリクエストに失敗しました。');
    }

    return response.json();
}

export const diagnoseMBTI = async (questions: Question[], answers: { [key: string]: string }): Promise<string> => {
    try {
        return await callApi<string>('diagnoseMBTI', { questions, answers });
    } catch (error) {
        console.error("Error diagnosing MBTI:", error);
        throw new Error("AIによるMBTI診断に失敗しました。");
    }
};

export const getComprehensiveDiagnosis = async (data: UserInputData, mode: AppMode): Promise<Omit<ComprehensiveDiagnosis, 'id' | 'name'>> => {
     try {
        return await callApi<Omit<ComprehensiveDiagnosis, 'id' | 'name'>>('getComprehensiveDiagnosis', { data, mode });
    } catch (error) {
        console.error("Error getting comprehensive diagnosis:", error);
        throw new Error("AIによる総合診断に失敗しました。しばらくしてからもう一度お試しください。");
    }
};

export const getTeamBuildingSuggestions = async (profiles: ComprehensiveDiagnosis[], purpose: string, industry: string, teamSize: number): Promise<TeamBuildingResult> => {
    if (profiles.length < teamSize) {
        throw new Error(`チーム分析には最低${teamSize}人のメンバーが必要ですが、現在${profiles.length}人しか選択されていません。`);
    }
    try {
        return await callApi<TeamBuildingResult>('getTeamBuildingSuggestions', { profiles, purpose, industry, teamSize });
    } catch (error) {
        console.error("Error getting team building suggestions:", error);
        throw new Error("AIによるチーム分析に失敗しました。");
    }
};

export const getHiringRecommendation = async (profiles: ComprehensiveDiagnosis[]): Promise<HiringRecommendation> => {
    if (profiles.length < 1) {
        throw new Error("チーム分析には最低1人のメンバーが必要です。");
    }
    try {
        return await callApi<HiringRecommendation>('getHiringRecommendation', { profiles });
    } catch (error) {
        console.error("Error getting hiring recommendation:", error);
        throw new Error("AIによる採用提案の生成に失敗しました。");
    }
};
