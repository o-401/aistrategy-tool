
import React, { useRef } from 'react';
import { EmployeeProfile } from '../types';

interface DataManagementScreenProps {
  onFileUpload: (file: File) => void;
  onFileExport: () => void;
  employeeCount: number;
  onBack: () => void;
  employees: EmployeeProfile[];
  onViewProfile: (profile: EmployeeProfile) => void;
}

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const EyeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;


export const DataManagementScreen: React.FC<DataManagementScreenProps> = ({ onFileUpload, onFileExport, employeeCount, onBack, employees, onViewProfile }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-slate-800 mb-4 text-center">データ管理</h2>
      <p className="text-center text-slate-500 mb-8">従業員データをExcelファイルで管理します。</p>

      <div className="space-y-6">
        <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center">
          <p className="text-slate-600 mb-4">既存の従業員データ（.xlsx）をアップロードして、採用支援やチームビルディング機能を開始します。</p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".xlsx"
          />
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center justify-center bg-indigo-600 text-white font-bold py-3 px-8 rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform duration-150 ease-in-out hover:scale-105"
          >
            <UploadIcon />
            ファイルをアップロード
          </button>
        </div>

        <div className="p-6 bg-slate-50 rounded-lg">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-700">現在の従業員データ</h3>
              <p className="text-slate-500">{employeeCount} 名のデータが読み込まれています。</p>
            </div>
            <button
              onClick={onFileExport}
              disabled={employeeCount === 0}
              className="mt-4 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center bg-emerald-600 text-white font-bold py-3 px-8 rounded-full hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-transform duration-150 ease-in-out hover:scale-105 disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              <DownloadIcon />
              Excel形式で保存
            </button>
          </div>
        </div>

        {employees.length > 0 && (
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-slate-700 text-center">読み込み済み従業員リスト</h3>
                <div className="max-h-60 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-2">
                    {employees.map(employee => (
                        <div key={employee.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                            <div>
                                <p className="font-bold text-slate-800">{employee.name}</p>
                                <p className="text-sm text-slate-500">{employee.department} / {employee.mbti}</p>
                            </div>
                            <button 
                                onClick={() => onViewProfile(employee)}
                                className="flex items-center gap-2 text-sm bg-slate-200 text-slate-700 font-semibold py-1 px-3 rounded-full hover:bg-slate-300 transition-colors"
                                aria-label={`${employee.name}の診断結果を表示`}
                            >
                                <EyeIcon />
                                結果表示
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        )}
      </div>
       <div className="mt-8 text-center">
            <button
                onClick={onBack}
                className="text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
            >
                モード選択に戻る
            </button>
       </div>
    </div>
  );
};
