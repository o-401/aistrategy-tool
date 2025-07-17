
import React, { useState, useEffect } from 'react';
import { type UserInputData, AppMode } from '../types';
import { genders, bloodTypes, mbtiTypes, industries } from '../constants';
import { getZodiacSign, getEtoSign } from '../utils/dateHelpers';

interface InputFormProps {
  initialData: UserInputData;
  onSubmit: (data: UserInputData) => void;
  onStartMbtiQuiz: (data: UserInputData) => void;
  appMode: AppMode;
}

const SelectInput: React.FC<{label: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]}> = ({label, value, onChange, options}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <select value={value} onChange={onChange} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white">
            <option value="" disabled>選択してください</option>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const TextInput: React.FC<{label: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; placeholder: string; type?: string;}> = ({label, value, onChange, placeholder, type='text'}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
);

const TextAreaInput: React.FC<{label: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; placeholder: string;}> = ({label, value, onChange, placeholder}) => (
    <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">{label}</label>
        <textarea value={value} onChange={onChange} placeholder={placeholder} rows={3} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
    </div>
);


export const InputForm: React.FC<InputFormProps> = ({ initialData, onSubmit, onStartMbtiQuiz, appMode }) => {
  const [formData, setFormData] = useState<UserInputData>(initialData);
  const [customIndustry, setCustomIndustry] = useState('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setFormData(initialData);
    if (initialData.industry && !industries.includes(initialData.industry)) {
      setCustomIndustry(initialData.industry);
      setFormData(prev => ({...prev, industry: 'その他' }));
    } else {
      setCustomIndustry('');
    }
  }, [initialData]);
  
  const handleCustomIndustryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCustomIndustry(e.target.value);
  };


  const handleChange = (field: keyof UserInputData) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    let newFormData = { ...formData, [field]: value };

    if (field === 'birthDate' && value) {
      const birthDate = new Date(value);
      if (!isNaN(birthDate.getTime())) {
          newFormData.zodiac = getZodiacSign(birthDate);
          newFormData.eto = getEtoSign(birthDate);
      }
    }
    setFormData(newFormData);
  };

  const handleMbtiQuizClick = () => {
    onStartMbtiQuiz(formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate || !formData.bloodType || !formData.mbti || formData.mbti === '不明') {
        setError('名前、生年月日、血液型、MBTIは必須項目です。MBTIが不明な場合は診断を行ってください。');
        return;
    }
    setError('');
    
    const dataToSubmit = { ...formData };
    if (dataToSubmit.industry === 'その他') {
        dataToSubmit.industry = customIndustry;
    }
    onSubmit(dataToSubmit);
  };

  const formContent = {
    title: {
      individual: 'あなたの情報を入力してください',
      recruitment: '診断する候補者を入力してください',
      team_building: 'チームメンバーの情報を入力してください',
      data_management: '',
    },
    description: {
      individual: 'AIがあなたの特性を多角的に分析します。',
      recruitment: 'AIが候補者のポテンシャルを分析し、最適な配属先を提案します。',
      team_building: '診断結果を元に、最適なチーム編成を分析します。',
      data_management: '',
    },
    buttonText: {
      individual: 'AIに分析してもらう',
      recruitment: 'AIに候補者を分析してもらう',
      team_building: 'AIにメンバーを分析してもらう',
      data_management: '',
    },
    nameLabel: {
      individual: '名前',
      recruitment: '候補者名',
      team_building: 'メンバー名',
      data_management: '',
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full animate-fade-in">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">{formContent.title[appMode]}</h2>
        <p className="text-center text-slate-500 mb-6">{formContent.description[appMode]}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label={formContent.nameLabel[appMode]} value={formData.name} onChange={handleChange('name')} placeholder="山田 太郎" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="生年月日" value={formData.birthDate} onChange={handleChange('birthDate')} placeholder="" type="date" />
            <SelectInput label="性別" value={formData.gender} onChange={handleChange('gender')} options={genders} />
        </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput label="血液型" value={formData.bloodType} onChange={handleChange('bloodType')} options={bloodTypes} />
            <div>
                <SelectInput label="MBTI" value={formData.mbti} onChange={handleChange('mbti')} options={mbtiTypes} />
                 <button type="button" onClick={handleMbtiQuizClick} className="text-sm text-indigo-600 hover:underline mt-1">
                    MBTIがわからない/診断したい方はこちら
                </button>
            </div>
        </div>
        
        {(appMode === 'individual' || appMode === 'recruitment') && (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextInput label="部署名（任意）" value={formData.department || ''} onChange={handleChange('department')} placeholder="例：営業部" />
                    <TextInput
                        label="勤続年数（任意）"
                        type="number"
                        value={formData.yearsOfService === undefined ? '' : String(formData.yearsOfService)}
                        onChange={(e) => {
                            const val = e.target.value;
                            const num = val === '' ? undefined : parseFloat(val);
                            if (num !== undefined && num < 0) return;
                            setFormData(prev => ({...prev, yearsOfService: num}));
                        }}
                        placeholder="例: 3.5 (1年未満は0.5)"
                    />
                </div>
                
                <div className="pt-2">
                    <SelectInput label="業種（任意）" value={formData.industry || '指定なし'} onChange={handleChange('industry')} options={industries} />
                    {formData.industry === 'その他' && (
                        <div className="mt-2">
                           <TextInput label="業種を記入" value={customIndustry} onChange={handleCustomIndustryChange} placeholder="例：エンターテイメント" />
                        </div>
                    )}
                </div>
            </>
        )}

        {appMode === 'individual' && (
          <div className="space-y-4 pt-2">
            <TextAreaInput
              label="あなたの強みについて教えてください（任意）"
              value={formData.strengthsContext || ''}
              onChange={handleChange('strengthsContext')}
              placeholder="あなたが仕事で『時間を忘れるほど夢中になれる』のは、どんな時ですか？"
            />
            <TextAreaInput
              label="あなたの課題について教えてください（任意）"
              value={formData.challengesContext || ''}
              onChange={handleChange('challengesContext')}
              placeholder="あなたが仕事で『どうしても、やる気が出ない』と感じるのは、どんな作業ですか？"
            />
          </div>
        )}

        {appMode === 'recruitment' && (
          <div className="space-y-4 pt-2">
            <TextAreaInput 
              label="企業情報（任意）"
              value={formData.companyContext || ''}
              onChange={handleChange('companyContext')}
              placeholder="例：急成長中のIT企業で、主体性とチームワークを重視します。販売・マーケティング部門の人材を探しています。"
            />
            <TextAreaInput 
              label="配属予定チームの情報（任意）"
              value={formData.teamContext || ''}
              onChange={handleChange('teamContext')}
              placeholder="例：リーダーのMBTIはENFJ。慎重で実直なメンバーが多いチームです。"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-indigo-500 to-sky-500 text-white font-bold py-3 px-12 rounded-full hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            {formContent.buttonText[appMode]}
          </button>
        </div>
      </form>
    </div>
  );
};