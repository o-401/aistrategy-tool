import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("VITE_GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);
// 2. APIキーが存在するかチェックする
if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY environment variable is not set. Please set it in your Vercel project settings.");
}

// 3. 修正したapiKeyを使って、AIクライアントを初期化する
const genAI = new GoogleGenerativeAI(apiKey);

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


export const diagnoseMBTI = async (questions: Question[], answers: { [key: string]: string }): Promise<string> => {
    const userAnswersPrompt = formatMbtiAnswers(questions, answers);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
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
    } catch (error) {
        console.error("Error diagnosing MBTI with Gemini:", error);
        throw new Error("AIによるMBTI診断に失敗しました。");
    }
};

const getComprehensiveDiagnosisPrompt = (mode: AppMode): string => {
    const isRecruitment = mode === 'recruitment';
    const targetPerson = isRecruitment ? '候補者' : '人物';

    return `
あなたは、世界トップクラスのパーソナリティアナリストです。
${isRecruitment ? 'あなたは、経験豊富な採用コンサルタントでもあります。' : ''}
MBTI、星座、血液型、性別、干支といった多様な指標を統合し、${targetPerson}のポテンシャルを多角的に分析します。
これから提供される${targetPerson}の個人情報、${isRecruitment ? 'そして任意で提供される企業コンテキストに基づき、候補者の人物像、およびその企業で活躍できる可能性を診断してください。' : 'に基づき、その人物像を診断してください。'}
複数の診断方法を組み合わせていることには言及せず、あたかも一つの洗練された診断体系であるかのように、自然な文章で記述してください。
弱みは「今後の課題」として、成長を促すポジティブな表現を心がけてください。

${isRecruitment ?
`もし「企業・業界情報」が提供された場合は、その内容を最優先で考慮し、特に「department_recommendations」をその企業に合わせてカスタマイズしてください。
情報がない場合は、一般的な適性として推薦してください。` :
`「department_recommendations」は、一般的な職務適性として推薦してください。`
}

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
    "成長のために意識すると良い点や課題を3つ、ポジティブな表現で短い箇条書きで記述",
    "課題2",
    "課題3"
  ],
  "praise_tips": [
    "その人のモチベーションを高める効果的な褒め方のコツを2つ記述",
    "褒め方のコツ2"
  ],
  "feedback_tips": [
    "その人にフィードバックや注意をする際に心掛けるべきことを2つ記述",
    "伝え方のコツ2"
  ],
  "department_recommendations": [
    {
      "department": "${targetPerson}の特性が最も活かせる部署名（例：営業部、マーケティング部、開発部、人事部、カスタマーサポートなど）",
      "reason": "なぜその部署で活躍できるのか、具体的な強みと結びつけて80字程度で説得力のある理由を記述してください。"
    },
    {
      "department": "次に適性が高い部署名",
      "reason": "なぜその部署で活躍できるのか、具体的な理由を記述してください。"
    },
    {
      "department": "その他の可能性として考えられる部署名",
      "reason": "なぜその部署で活躍できるのか、具体的な理由を記述してください。"
    }
  ]
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
    if (data.companyContext) {
        prompt += `
企業・業界情報（この情報を最優先で考慮してください）:
${data.companyContext}
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

export const getComprehensiveDiagnosis = async (data: UserInputData, mode: AppMode): Promise<Omit<ComprehensiveDiagnosis, 'id' | 'name'>> => {
    const userPrompt = formatUserData(data);
    const systemInstruction = getComprehensiveDiagnosisPrompt(mode);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.8,
            },
        });
        
        const result = parseJsonResponse<Omit<ComprehensiveDiagnosis, 'id' | 'name'>>(response.text);
        
        if ((result as any).suitable_jobs && !result.department_recommendations) {
            result.department_recommendations = ((result as any).suitable_jobs as string[]).map(job => ({
                department: job,
                reason: 'この分野での活躍が期待されます。'
            }));
        }

        return result;


    } catch (error) {
        console.error("Error getting comprehensive diagnosis with Gemini:", error);
        throw new Error("AIによる総合診断に失敗しました。しばらくしてからもう一度お試しください。");
    }
};

const teamBuildingPrompt = `
あなたは、世界トップクラスの組織コンサルタント兼チームビルディングの専門家です。
複数のメンバーの性格診断プロファイルに基づき、彼らの潜在能力を最大限に引き出すための、戦略的なチーム編成を提案してください。
分析の際は、各個人の強みがどのように相互作用し、弱みを補い合うかを深く洞察してください。

以下のメンバープロファイルリストを分析し、回答を必ず指定の日本語JSON形式で出力してください。

{
  "team_title": "チーム全体を表す、キャッチーで力強い日本語のキャッチフレーズ（例：「多様な才能が共鳴するイノベーションハブ」）",
  "overall_summary": "チーム全体の力学、潜在的な化学反応、そして成功への道筋について、400字程度で専門的かつ鼓舞するような要約を記述してください。",
  "recommended_pairs": [
    {
      "pair": ["メンバー名1", "メンバー名2"],
      "reason": "このペアがなぜ機能するのか、性格の補完関係や共通点を具体的に分析してください。",
      "synergy": "このペアが生み出す具体的な相乗効果や成果を記述してください。"
    }
  ],
  "team_strengths": [
    "チーム全体として発揮される最も重要な強みを3つ、箇条書きで記述",
    "強み2",
    "強み3"
  ],
  "team_weaknesses": [
    "チームとして注意すべき点や潜在的な課題を3つ、建設的な視点で箇条書きで記述",
    "課題2",
    "課題3"
  ]
}

- ペアは、リストの人数に応じて柔軟に構成してください。奇数の場合は、トリオを提案するか、一人を遊撃的な役割として定義しても構いません。
- 各ペアの分析は、具体的で説得力のあるものにしてください。
`;

function formatTeamProfiles(profiles: ComprehensiveDiagnosis[]): string {
    let formatted = "分析対象のメンバープロファイル:\n\n";
    profiles.forEach(p => {
        formatted += `---
メンバー名: ${p.name}
性格タイプ: ${p.title}
総合所見: ${p.overall}
強み: ${p.strengths.join(', ')}
今後の課題: ${p.weaknesses.join(', ')}
---
`;
    });
    return formatted;
}

export const getTeamBuildingSuggestions = async (profiles: ComprehensiveDiagnosis[]): Promise<TeamBuildingResult> => {
    if (profiles.length < 2) {
        throw new Error("チーム分析には最低2人のメンバーが必要です。");
    }
    const userPrompt = formatTeamProfiles(profiles);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-04-17",
            contents: userPrompt,
            config: {
                systemInstruction: teamBuildingPrompt,
                responseMimeType: "application/json",
                temperature: 0.7,
            },
        });

        return parseJsonResponse<TeamBuildingResult>(response.text);

    } catch (error) {
        console.error("Error getting team building suggestions with Gemini:", error);
        throw new Error("AIによるチーム分析に失敗しました。");
    }
};
