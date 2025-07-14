
export interface Question {
  id: number;
  category: 'EI' | 'SN' | 'TF' | 'JP';
  poleA: { id: 'E' | 'S' | 'T' | 'J'; text: string };
  poleB: { id: 'I' | 'N' | 'F' | 'P'; text: string };
}

export interface DepartmentRecommendation {
  department: string;
  reason: string;
}

export interface ManagerView {
  management_tips: string[];
  potential_risks: string[];
  ideal_environment: string;
  praise_tips: string[];
  feedback_tips: string[];
}

export interface ComprehensiveDiagnosis {
  id:string;
  name: string;
  title: string;
  overall: string;
  strengths: string[];
  weaknesses: string[];
  ideal_work_style: string;
  communication_style: string;
  department_recommendations: DepartmentRecommendation[];
  manager_view?: ManagerView;
}

export interface UserInputData {
    name: string;
    birthDate: string;
    gender: string;
    bloodType: string;
    zodiac: string;
    eto: string;
    mbti: string;
    industry?: string;
    department?: string;
    yearsOfService?: number;
    companyContext?: string;
    teamContext?: string;
    strengthsContext?: string;
    challengesContext?: string;
}

export interface SuggestedTeam {
  team_title: string;
  members: string[];
  reason: string;
  synergy: string;
  team_strengths: string[];
  team_weaknesses: string[];
}

export interface TeamBuildingResult {
  overall_summary: string;
  suggested_teams: SuggestedTeam[];
}

export interface EmployeeProfile {
  id: string;
  name: string;
  department: string;
  yearsOfService: number;
  birthDate: string;
  gender: string;
  bloodType: string;
  zodiac: string;
  eto: string;
  mbti: string;
  diagnosis: Omit<ComprehensiveDiagnosis, 'id' | 'name'>;
}

export interface HiringRecommendation {
  team_analysis_summary: string;
  ideal_candidate_profile: {
    title: string;
    mbti_suggestion: string;
    key_strengths: string[];
    reasoning: string;
  };
}


export type AppMode = 'individual' | 'recruitment' | 'team_building' | 'data_management';
export type GameState = 'mode_selection' | 'data_management' | 'recruitment_sub_selection' | 'hiring_recommendation_setup' | 'hiring_recommendation_results' | 'input' | 'mbti_quiz' | 'loading' | 'results' | 'team_building_selection' | 'team_building_analysis' | 'team_building_results' | 'error';
export type TeamPurpose = '新規事業の立ち上げ（創造性重視）' | '既存業務の効率化（堅実性・実行力重視）' | '困難なプロジェクトの突破（多様性・推進力重視）';
