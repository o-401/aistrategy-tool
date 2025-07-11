
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

/**
 * Calculates the MBTI type based on user answers directly on the client-side.
 * This provides an instantaneous result without calling the API.
 */
export const diagnoseMBTI = (questions: Question[], answers: { [key: string]: number }): string => {
    try {
        const totals: { [key: string]: number } = { EI: 0, SN: 0, TF: 0, JP: 0 };

        questions.forEach((q) => {
            const answerValue = answers[q.id];
            if (answerValue !== undefined) {
                // The value is from -3 (pole A: E,S,T,J) to +3 (pole B: I,N,F,P).
                // We sum up the scores for each category.
                totals[q.category] += answerValue;
            }
        });

        // Determine the type for each dimension based on the total score.
        // Negative sum means preference for pole A (E, S, T, J).
        // Positive or zero sum means preference for pole B (I, N, F, P).
        const type1 = totals.EI < 0 ? 'E' : 'I';
        const type2 = totals.SN < 0 ? 'S' : 'N';
        const type3 = totals.TF < 0 ? 'T' : 'F';
        const type4 = totals.JP < 0 ? 'J' : 'P';

        const mbtiType = `${type1}${type2}${type3}${type4}`;
        
        // Basic validation for the generated type
        if (!/^[IE][NS][TF][JP]$/.test(mbtiType)) {
             console.error("Invalid MBTI type generated:", mbtiType, "Scores:", totals);
             throw new Error("有効なMBTIタイプを特定できませんでした。");
        }
        
        return mbtiType;

    } catch (error) {
        console.error("Error diagnosing MBTI on client-side:", error);
        throw new Error("MBTI診断中にエラーが発生しました。");
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
