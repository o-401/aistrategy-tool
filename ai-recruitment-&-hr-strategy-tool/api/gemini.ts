import { GoogleGenAI } from "@google/genai";
import { type ComprehensiveDiagnosis, type Question, type UserInputData, type TeamBuildingResult, type DepartmentRecommendation, type AppMode, type HiringRecommendation } from '../types';

// This is a Vercel serverless function. It will not be run in the browser.
// The API_KEY is accessed from environment variables on the server.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Prompts and helper functions moved from the original geminiService
const mbtiDiagnosisPrompt = `
あなたは、経験豊富なMBTIのエキスパートです。ユーザーが回答した8つの質問と回答を分析し、
ユーザーのMBTIタイプ（例: ISTJ, ENFP）を4文字で特定してください。
回答は、4文字のアルファベットのみを返してください。その他のテキストは一切含めないでください。
`;

function formatMbtiAnswers(questions: Question[], answers: { [key: string]: string }): string {
    let formatted = "ユーザーの回答:\n\n";
    questions.forEach((q) => {
        const answerId = answers[q.id];
        const chosenOption = q.options.find(opt => opt.id === answerId);
        formatted += `質問${q.id} (${q.category}): ${q.text}\n`;
        formatted += `回答 (${answerId}): ${chosenOption ? chosenOption.text : 'N/A'}\n\n`;
    });
    return formatted;
}


const getComprehensiveDiagnosisPrompt = (mode: AppMode): string => {
    const isRecruitment = mode === 'recruitment';
    const targetPerson = isRecruitment ? '候補者' : '人物';

    return `
あなたは、世界トップクラスのパーソナリティアナリスト兼組織コンサルタントです。
MBTI、星座、血液型、性別、干支といった多様な指標を統合し、${targetPerson}のポテンシャルを多角的に分析します。
これから提供される${targetPerson}の個人情報、そして任意で提供される企業コンテキスト（業種情報を含む）や配属予定チーム情報に基づき、${targetPerson}の人物像と、その企業で活躍できる可能性を診断してください。
複数の診断方法を組み合わせていることには言及せず、あたかも一つの洗練された診断体系であるかのように、自然な文章で記述してください。
弱みは「さらなる成長のためのヒント（ポテンシャル）」として、本人の可能性を広げるような、柔らかく前向きな表現を心がけてください。

もし「業種」が指定されていれば、それを最優先で考慮し、「department_recommendations」をその業種特有の部署名（例：飲食業なら「ホール」「キッチン」）で推薦してください。
情報がない場合は、一般的な職務適性として推薦してください。

回答は、必ず以下の日本語のJSON形式で出力してください。
{
  "title": "${targetPerson}の性格タイプを表す、キャッチーで魅力的な日本語の肩書（例：「情熱を秘めた理想主義者」）",
  "overall": "総合的な性格の概要を、250字程度で詳細かつ肯定的に記述してください。",
  "strengths": [
    "最も際立った強みを3つ、短い箇条書きで記述",
    "強み2",
    "強み3"
  ],
  "weaknesses": [
    "「さらなる成長のためのヒント」として、成長の可能性を3つ、柔らかく前向きな表現で記述。例：「他者への深い配慮から、ご自身の意見を抑えてしまうことがあるかもしれません。あなたの意見は、チームにとって新しい視点をもたらす貴重なものです。」",
    "ヒント2",
    "ヒント3"
  ],
  "ideal_work_style": "この人物が最も気持ちよく、生産的に働ける理想の仕事の進め方やスタイルについて80字程度で記述してください。",
  "communication_style": "この人物のコミュニケーションにおける特徴や、好ましいやり取りの方法について80字程度で記述してください。",
  "department_recommendations": [
    {
      "department": "${targetPerson}の特性が最も活かせる部署名",
      "reason": "なぜその部署で活躍できるのか、具体的な強みと結びつけて80字程度で説得力のある理由を記述してください。"
    },
    { "department": "次に適性が高い部署名", "reason": "具体的な理由を記述してください。" },
    { "department": "その他の可能性として考えられる部署名", "reason": "具体的な理由を記述してください。" }
  ],
  "manager_view": {
    "management_tips": [
      "この人物をマネジメントする上での具体的なヒントを2つ記述。",
      "ヒント2"
    ],
    "potential_risks": [
      "チームに加わった際に考えられる潜在的なリスクや課題を2つ、建設的な視点で記述。",
      "課題2"
    ],
    "ideal_environment": "この人物が最もパフォーマンスを発揮できる理想的な職場環境やチームカルチャーについて、80字程度で記述。",
    "praise_tips": [
      "モチベーションを高める効果的な褒め方のコツを2つ記述。",
      "褒め方のコツ2"
    ],
    "feedback_tips": [
      "フィードバックや注意をする際に心掛けるべきことを2つ記述。",
      "伝え方のコツ2"
    ]
  }
}
`;
}


function formatUserData(data: UserInputData): string {
    let prompt = `
対象者の情報:
- 性別: ${data.gender}
- 血液型: ${data.bloodType}
- 星座: ${data.zodiac}
- 干支: ${data.eto}
- MBTI: ${data.mbti}
`;
    if (data.industry && data.industry !== '指定なし') {
        prompt += `- 業種: ${data.industry}\n`;
    }
    if (data.strengthsContext) {
        prompt += `
本人が語る「夢中になれること」:
${data.strengthsContext}
`;
    }
    if (data.challengesContext) {
        prompt += `
本人が語る「やる気が出ないこと」:
${data.challengesContext}
`;
    }
    if (data.companyContext) {
        prompt += `
企業・業界情報（この情報を考慮してください）:
${data.companyContext}
`;
    }
     if (data.teamContext) {
        prompt += `
配属予定チームの情報（この情報を考慮してください）:
${data.teamContext}
`;
    }
    return prompt;
}

const parseJsonResponse = <T>(jsonString: string): T => {
    let cleanJsonString = jsonString.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = cleanJsonString.match(fenceRegex);
    if (match && match[2]) {
        cleanJsonString = match[2].trim();
    }
    try {
        return JSON.parse(cleanJsonString) as T;
    } catch (e) {
        console.error("Failed to parse JSON response:", e, "Original string:", jsonString);
        throw new Error("AIからの応答を解析できませんでした。");
    }
};

const teamBuildingPrompt = `
あなたは、世界トップクラスの組織コンサルタントです。
これから提示される「チームの目的」「業種」「編成人数」という3つの要件を最優先の指針としてください。
複数のメンバープロファイルに基づき、要件に合致する最適なチーム編成案を複数提案してください。

# 指示
1.  **メンバーの分析**: 提供された全メンバーのプロファイルを深く分析し、それぞれの強み、弱み、性格を把握します。
2.  **チーム編成**: 全メンバーの中から「編成人数」で指定された人数のメンバーを選び出し、最高のシナジーを生むチームを構成します。この際、「チームの目的」と「業種」を強く意識してください。
3.  **複数提案**: 可能性のあるチームの組み合わせを、最大3つまで提案してください。
4.  **業種への配慮**: 提案するチームの役割名や部署名は、指定された「業種」に沿ったものにしてください。（例：飲食業なら「ホール」「キッチン」、IT企業なら「フロントエンド」「バックエンド」など）

# 出力形式
回答は、必ず以下の日本語JSON形式で出力してください。

{
  "overall_summary": "今回のチーム編成における総括を400字程度で記述してください。目的、業種、メンバーの特性を踏まえた上で、どのような観点からチームを編成したかを専門的に解説してください。",
  "suggested_teams": [
    {
      "team_title": "チーム1を表す、キャッチーで力強い日本語のキャッチフレーズ",
      "members": ["メンバー名1", "メンバー名2", "メンバー名3"],
      "reason": "なぜこのメンバー構成が最適なのか、目的と照らし合わせ、性格の補完関係や相乗効果を具体的に説明してください。",
      "synergy": "このチームが生み出す具体的な相乗効果や期待される成果を記述してください。",
      "team_strengths": ["チームの強み1", "チームの強み2", "チームの強み3"],
      "team_weaknesses": ["チームの注意点1", "チームの注意点2", "チームの注意点3"]
    },
    {
      "team_title": "チーム2を表す、キャッチーで力強い日本語のキャッチフレーズ",
      "members": ["メンバー名A", "メンバー名B", "メンバー名C"],
      "reason": "なぜこのメンバー構成が最適なのか、目的と照らし合わせ、性格の補完関係や相乗効果を具体的に説明してください。",
      "synergy": "このチームが生み出す具体的な相乗効果や期待される成果を記述してください。",
      "team_strengths": ["チームの強み1", "チームの強み2", "チームの強み3"],
      "team_weaknesses": ["チームの注意点1", "チームの注意点2", "チームの注意点3"]
    }
  ]
}
`;

function formatTeamProfiles(profiles: ComprehensiveDiagnosis[], purpose: string, industry: string, teamSize: number): string {
    let formatted = `## チーム編成の要件
- チームの目的: ${purpose}
- 業種: ${industry}
- 編成人数: ${teamSize}人

## 分析対象のメンバープロファイル (総勢${profiles.length}名)\n\n`;
    profiles.forEach(p => {
        formatted += `---
- メンバー名: ${p.name}
- 性格タイプ: ${p.title}
- 総合所見: ${p.overall}
- 強み: ${p.strengths.join(', ')}
- 成長のヒント: ${p.weaknesses.join(', ')}
---\n`;
    });
    return formatted;
}

const hiringRecommendationPrompt = `
あなたは、戦略的な採用コンサルタントです。
提供された既存のチームメンバーのプロファイルリストを分析し、チームのバランス、多様性、および生産性を向上させるために、どのような人材を採用すべきかを提案してください。

分析のポイント:
- チーム全体のMBTIタイプの分布、強みと弱みの傾向を特定する。
- 現在のチームに不足しているスキルや視点を洗い出す。
- チームのダイナミクスを活性化させる、または安定させるための人物像を考える。

回答は、必ず以下の日本語のJSON形式で出力してください。
{
  "team_analysis_summary": "現在のチーム構成の強みと課題を300字程度で要約してください。",
  "ideal_candidate_profile": {
    "title": "採用すべき理想の候補者像を一言で表すキャッチーな肩書（例：「秩序をもたらす戦略的実行者」）",
    "mbti_suggestion": "推奨されるMBTIタイプ、またはその傾向（例：「内向的(I)で感覚的(S)なタイプが望ましい」）",
    "key_strengths": [
      "候補者に求めるべき最も重要な強みを3つ、箇条書きで記述",
      "強み2",
      "強み3"
    ],
    "reasoning": "なぜこの人物像が現在のチームにとって必要不可欠なのか、具体的な理由を200字程度で説明してください。"
  }
}
`;

function formatExistingTeam(profiles: ComprehensiveDiagnosis[]): string {
    let formatted = `分析対象の既存メンバープロファイル:\n\n`;
    profiles.forEach(p => {
        formatted += `---
メンバー名: ${p.name}
性格タイプ: ${p.title}
総合所見: ${p.overall}
強み: ${p.strengths.join(', ')}
---
`;
    });
    return formatted;
}


// Internal implementation functions
const diagnoseMBTI_internal = async (payload: { questions: Question[], answers: { [key: string]: string } }): Promise<string> => {
    const { questions, answers } = payload;
    const userAnswersPrompt = formatMbtiAnswers(questions, answers);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userAnswersPrompt,
        config: {
            systemInstruction: mbtiDiagnosisPrompt,
            temperature: 0.1,
        },
    });
    
    const mbtiType = response.text.trim().toUpperCase();
    if (/^[IE][NS][TF][JP]$/.test(mbtiType)) {
         return mbtiType;
    } else {
        console.error("Invalid MBTI type received from AI:", mbtiType);
        throw new Error("有効なMBTIタイプを特定できませんでした。");
    }
};

const getComprehensiveDiagnosis_internal = async (payload: { data: UserInputData, mode: AppMode }): Promise<Omit<ComprehensiveDiagnosis, 'id' | 'name'>> => {
    const { data, mode } = payload;
    const userPrompt = formatUserData(data);
    const systemInstruction = getComprehensiveDiagnosisPrompt(mode);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            temperature: 0.8,
        },
    });
    
    return parseJsonResponse<Omit<ComprehensiveDiagnosis, 'id' | 'name'>>(response.text);
};

const getTeamBuildingSuggestions_internal = async (payload: { profiles: ComprehensiveDiagnosis[], purpose: string, industry: string, teamSize: number }): Promise<TeamBuildingResult> => {
    const { profiles, purpose, industry, teamSize } = payload;
    const userPrompt = formatTeamProfiles(profiles, purpose, industry, teamSize);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: teamBuildingPrompt,
            responseMimeType: "application/json",
            temperature: 0.8,
        },
    });

    return parseJsonResponse<TeamBuildingResult>(response.text);
};

const getHiringRecommendation_internal = async (payload: { profiles: ComprehensiveDiagnosis[] }): Promise<HiringRecommendation> => {
    const { profiles } = payload;
    const userPrompt = formatExistingTeam(profiles);

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt,
        config: {
            systemInstruction: hiringRecommendationPrompt,
            responseMimeType: "application/json",
            temperature: 0.8,
        },
    });

    return parseJsonResponse<HiringRecommendation>(response.text);
};


// Vercel Edge Function handler
export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request): Promise<Response> {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    if (!process.env.API_KEY) {
        return new Response(JSON.stringify({ message: 'API key is not configured on the server.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const { action, payload } = await request.json();
        let result;

        switch (action) {
            case 'diagnoseMBTI':
                result = await diagnoseMBTI_internal(payload);
                break;
            case 'getComprehensiveDiagnosis':
                result = await getComprehensiveDiagnosis_internal(payload);
                break;
            case 'getTeamBuildingSuggestions':
                result = await getTeamBuildingSuggestions_internal(payload);
                break;
            case 'getHiringRecommendation':
                result = await getHiringRecommendation_internal(payload);
                break;
            default:
                return new Response(JSON.stringify({ message: `Action not found: ${action}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        return new Response(JSON.stringify(result), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error(`Error processing action:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return new Response(JSON.stringify({ message: `AIの処理中にサーバーでエラーが発生しました。`, error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
