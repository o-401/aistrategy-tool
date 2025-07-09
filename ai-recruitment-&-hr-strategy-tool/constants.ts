
import { type Question } from './types';

export const genders = ['回答しない', '男性', '女性', 'その他'];
export const bloodTypes = ['A型', 'B型', 'O型', 'AB型'];
export const zodiacs = ['牡羊座', '牡牛座', '双子座', '蟹座', '獅子座', '乙女座', '天秤座', '蠍座', '射手座', '山羊座', '水瓶座', '魚座'];
export const etoSigns = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
export const mbtiTypes = [
  '不明', 'ISTJ', 'ISFJ', 'INFJ', 'INTJ', 'ISTP', 'ISFP', 'INFP', 'INTP',
  'ESTP', 'ESFP', 'ENFP', 'ENTP', 'ESTJ', 'ESFJ', 'ENFJ', 'ENTJ'
];

export const industries = ['指定なし', 'IT・通信', 'メーカー', '商社', '小売', '飲食業', '金融', '不動産', '建設', 'コンサルティング', '広告・メディア', '医療・福祉', '教育', '人材サービス'];

export const mbtiQuestions: Question[] = [
  {
    id: 1,
    text: '週末の過ごし方として、どちらを好みますか？',
    category: 'EI',
    options: [
      { id: 'E', text: '友人たちと集まってアクティブに過ごす' },
      { id: 'I', text: '家でリラックスしたり、一人の時間を楽しむ' },
    ],
  },
  {
    id: 2,
    text: '新しい情報を学ぶとき、どちらを重視しますか？',
    category: 'SN',
    options: [
      { id: 'S', text: '具体的で実践的な事実やデータ' },
      { id: 'N', text: '全体的なコンセプトや可能性、隠れた意味' },
    ],
  },
  {
    id: 3,
    text: '友人が悩みを相談してきたら、どう対応しますか？',
    category: 'TF',
    options: [
      { id: 'T', text: '問題点を分析し、論理的な解決策を提案する' },
      { id: 'F', text: '相手の気持ちに寄り添い、共感と励ましを伝える' },
    ],
  },
  {
    id: 4,
    text: '旅行の計画を立てる際、どう進めますか？',
    category: 'JP',
    options: [
      { id: 'J', text: '事前に行き先やスケジュールをしっかり決めておく' },
      { id: 'P', text: '大まかな目的地だけ決め、その場の気分で柔軟に行動する' },
    ],
  },
   {
    id: 5,
    text: 'エネルギーの源はどこから得ることが多いですか？',
    category: 'EI',
    options: [
      { id: 'E', text: '他人との交流や外の世界での活動' },
      { id: 'I', text: '内省や静かな環境での思索' },
    ],
  },
  {
    id: 6,
    text: '物事を説明するとき、どのような表現を好みますか？',
    category: 'SN',
    options: [
      { id: 'S', text: '五感で感じたまま、文字通りに描写する' },
      { id: 'N', text: '比喩や類推を用いて、本質的なパターンを伝える' },
    ],
  },
  {
    id: 7,
    text: '重要な決断を下すとき、最終的な決め手は？',
    category: 'TF',
    options: [
      { id: 'T', text: '客観的な基準と公平性' },
      { id: 'F', text: '関係者の調和と個人的な価値観' },
    ],
  },
  {
    id: 8,
    text: 'あなたの仕事のスタイルは？',
    category: 'JP',
    options: [
      { id: 'J', text: '締め切りを守り、タスクを順序立てて完了させる' },
      { id: 'P', text: '新しい選択肢に心を開き、プロセス自体を楽しむ' },
    ],
  },
];