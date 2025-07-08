export interface Question {
  id: number;
  text: string;
  options: {
    id: string; // e.g., 'E' for Extroversion, 'I' for Introversion
    text: string;
  }[];
  category: 'EI' | 'SN' | 'TF' | 'JP';
}

export interface DepartmentRecommendation {
  department: string;
  reason: string;
}

export interface ComprehensiveDiagnosis {
  id:string;
  name: string;
  title: string;
  overall: string;
  strengths: string[];
  weaknesses: string[];
  praise_tips: string[];
  feedback_tips: string[];
  department_recommendations: DepartmentRecommendation[];
}

export interface UserInputData {
    name: string;
    birthDate: string;
    gender: string;
    bloodType: string;
    zodiac: string;
    eto: string;
    mbti: string;
    companyContext?: string;
}

export interface RecommendedPair {
  pair: [string, string];
  reason: string;
  synergy: string;
}

export interface TeamBuildingResult {
  team_title: string;
  overall_summary: string;
  recommended_pairs: RecommendedPair[];
  team_strengths: string[];
  team_weaknesses: string[];
}


export type AppMode = 'individual' | 'recruitment' | 'team_building';
export type GameState = 'mode_selection' | 'input' | 'mbti_quiz' | 'loading' | 'results' | 'team_building_results' | 'error';