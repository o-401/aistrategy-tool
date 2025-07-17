
import { type ComprehensiveDiagnosis, type Question, type UserInputData, type TeamBuildingResult, type AppMode, type HiringRecommendation, EmployeeProfile } from '../types';


/**
 * A generic function to call our streaming API endpoint.
 * @param action The API action to perform.
 * @param payload The data to send to the API.
 * @param onChunk A callback function to handle each chunk of text as it arrives.
 * @returns A promise that resolves with the full, concatenated text when the stream is complete.
 */
const streamApi = async (
    action: string,
    payload: unknown,
    onChunk: (text: string) => void
): Promise<string> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, payload }),
    });

    if (!response.ok || !response.body) {
        const errorData = await response.json().catch(() => ({ message: '不明なサーバーエラーが発生しました。' }));
        throw new Error(errorData.message || 'APIリクエストに失敗しました。');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
            break;
        }
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        onChunk(chunk);
    }
    
    return fullText;
};


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

export const getComprehensiveDiagnosis = async (
    payload: { data: UserInputData, mode: AppMode },
    onChunk: (text: string) => void
): Promise<string> => {
     try {
        return await streamApi('getComprehensiveDiagnosis', payload, onChunk);
    } catch (error) {
        console.error("Error getting comprehensive diagnosis:", error);
        throw new Error("AIによる総合診断に失敗しました。しばらくしてからもう一度お試しください。");
    }
};

export const getTeamBuildingSuggestions = async (
    payload: { profiles: ComprehensiveDiagnosis[], purpose: string, industry: string, teamSize: number, department: string },
    onChunk: (text: string) => void
): Promise<string> => {
    const { profiles, teamSize } = payload;
    if (profiles.length < teamSize) {
        throw new Error(`チーム分析には最低${teamSize}人のメンバーが必要ですが、現在${profiles.length}人しか選択されていません。`);
    }
    try {
        return await streamApi('getTeamBuildingSuggestions', payload, onChunk);
    } catch (error) {
        console.error("Error getting team building suggestions:", error);
        throw new Error("AIによるチーム分析に失敗しました。");
    }
};

export const getHiringRecommendation = async (
    payload: { 
        members: { name: string, department: string, diagnosis: Omit<ComprehensiveDiagnosis, 'id' | 'name'> }[], 
        department: string, 
        teamContext: string 
    },
    onChunk: (text: string) => void
): Promise<string> => {
    const { members } = payload;
    if (members.length < 1) {
        throw new Error("チーム分析には最低1人のメンバーが必要です。");
    }
    try {
        return await streamApi('getHiringRecommendation', payload, onChunk);
    } catch (error) {
        console.error("Error getting hiring recommendation:", error);
        throw new Error("AIによる採用提案の生成に失敗しました。");
    }
};
