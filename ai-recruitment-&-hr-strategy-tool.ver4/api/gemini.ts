
import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";
import { type UserInputData, type ComprehensiveDiagnosis, type TeamBuildingResult, type HiringRecommendation, type AppMode, type EmployeeProfile } from '../types';

// This is a Vercel serverless function. It will not be run in the browser.
// The API_KEY is accessed from environment variables on the server.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

// Prompts and helper functions
const getComprehensiveDiagnosisPrompt = (mode: AppMode): string => {
    const targetPerson = mode === 'recruitment' ? '候補者' : '人物';
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
    if (data.department) {
        prompt += `- 部署: ${data.department}\n`;
    }
    if (data.yearsOfService !== undefined) {
        const years = data.yearsOfService;
        let yearsText = '';
        if (years < 1) {
            yearsText = '1年未満';
        } else {
            yearsText = `${Math.floor(years)}年`;
        }
        prompt += `- 勤続年数: ${yearsText}\n`;
    }
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

const teamBuildingPrompt = `
あなたは、世界トップクラスの組織コンサルタントです。
これから提示される「チームの目的」「業種」「対象部署」「編成人数」という4つの要件を最優先の指針としてください。
複数のメンバープロファイルに基づき、要件に合致する最適なチーム編成案を複数提案してください。

# 指示
1.  **メンバーの分析**: 提供された全メンバーのプロファイルを深く分析し、それぞれの強み、弱み、性格を把握します。
2.  **チーム編成**: 全メンバーの中から「編成人数」で指定された人数のメンバーを選び出し、最高のシナジーを生むチームを構成します。この際、「チームの目的」「業種」「対象部署」を強く意識してください。
3.  **複数提案**: 可能性のあるチームの組み合わせを、最大3つまで提案してください。
4.  **業種・部署への配慮**: 提案するチームの役割名や部署名は、指定された「業種」「対象部署」に沿ったものにしてください。（例：飲食業なら「ホール」「キッチン」、IT企業なら「フロントエンド」「バックエンド」など）

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

function formatTeamProfiles(profiles: ComprehensiveDiagnosis[], purpose: string, industry: string, teamSize: number, department: string): string {
    let formatted = `## チーム編成の要件
- チームの目的: ${purpose}
- 業種: ${industry}
- 対象部署: ${department || '指定なし'}
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
これから提示する「採用対象のスコープ（部署または会社全体）」と「チームの補足情報」を最優先で考慮してください。
提供された既存のチームメンバーのプロファイルリストを分析し、指定されたスコープのバランス、多様性、および生産性を向上させるために、どのような人材を採用すべきかを提案してください。

分析のポイント:
- **スコープに応じた分析**:
  - スコープが「会社全体」の場合: 企業文化全体への適合性、多様な部署で活躍できる汎用的なスキル、全社的な人材ポートフォリオのバランスを重視して、組織全体を強化する人物像を提案してください。
  - スコープが特定の「部署」の場合: その部署の既存メンバーとのスキル的・性格的な補完関係、チームの特定の課題解決に直結する能力、部署の文化へのフィットを最優先で分析し、即戦力となる具体的な人物像を提案してください。
- 既存メンバーのプロファイルから、チーム全体のMBTIタイプの分布、強みと弱みの傾向を特定する。
- 現在のチームに不足しているスキルや視点を洗い出す。

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

type MemberForAnalysis = {
    name: string;
    department: string;
    diagnosis: Omit<ComprehensiveDiagnosis, 'id' | 'name'>;
};

function formatExistingTeam(members: MemberForAnalysis[], department: string, teamContext: string): string {
    const relevantMembers = department === 'all'
        ? members
        : members.filter(m => m.department === department);

    let formatted = `## 採用の背景
- 採用対象のスコープ: ${department === 'all' ? '会社全体' : `部署「${department}」`}
- チームに関する補足情報: ${teamContext || '特になし'}

## 分析対象の既存メンバープロファイル:\n\n`;
    relevantMembers.forEach(p => {
        formatted += `---
メンバー名: ${p.name}
部署: ${p.department}
性格タイプ: ${p.diagnosis.title}
総合所見: ${p.diagnosis.overall}
強み: ${p.diagnosis.strengths.join(', ')}
---
`;
    });
    return formatted;
}

/**
 * Calls the Gemini API with streaming and pipes the response.
 * @param model The AI model to use.
 * @param contents The user prompt.
 * @param config The model configuration, including systemInstruction.
 * @returns A streaming Response object.
 */
async function streamGeminiResponse(
    model: string,
    contents: string,
    config: Record<string, any>
): Promise<Response> {
    const stream = await ai.models.generateContentStream({ model, contents, config });
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
        async start(controller) {
            for await (const chunk of stream) {
                const text = chunk.text;
                if (text) {
                    controller.enqueue(encoder.encode(text));
                }
            }
            controller.close();
        },
    });
    return new Response(readableStream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
    });
}

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

        switch (action) {
            case 'getComprehensiveDiagnosis': {
                const { data, mode } = payload as { data: UserInputData, mode: AppMode };
                const userPrompt = formatUserData(data);
                const systemInstruction = getComprehensiveDiagnosisPrompt(mode);
                return await streamGeminiResponse("gemini-2.5-flash", userPrompt, {
                    systemInstruction,
                    responseMimeType: "application/json",
                    temperature: 0.8,
                });
            }
            case 'getTeamBuildingSuggestions': {
                const { profiles, purpose, industry, teamSize, department } = payload as { profiles: ComprehensiveDiagnosis[], purpose: string, industry: string, teamSize: number, department: string };
                const userPrompt = formatTeamProfiles(profiles, purpose, industry, teamSize, department);
                return await streamGeminiResponse("gemini-2.5-flash", userPrompt, {
                    systemInstruction: teamBuildingPrompt,
                    responseMimeType: "application/json",
                    temperature: 0.8,
                });
            }
            case 'getHiringRecommendation': {
                 const { members, department, teamContext } = payload as { members: MemberForAnalysis[], department: string, teamContext: string };
                 const userPrompt = formatExistingTeam(members, department, teamContext);
                 return await streamGeminiResponse("gemini-2.5-flash", userPrompt, {
                     systemInstruction: hiringRecommendationPrompt,
                     responseMimeType: "application/json",
                     temperature: 0.8,
                 });
            }
            default:
                return new Response(JSON.stringify({ message: `Action not found: ${action}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (error) {
        console.error(`Error processing action:`, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return new Response(JSON.stringify({ message: `AIの処理中にサーバーでエラーが発生しました。`, error: errorMessage }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}