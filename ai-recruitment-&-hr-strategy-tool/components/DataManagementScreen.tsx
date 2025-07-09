
import React, { useRef } from 'react';

interface DataManagementScreenProps {
  onFileUpload: (file: File) => void;
  onFileExport: () => void;
  employeeCount: number;
  onBack: () => void;
}

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export const DataManagementScreen: React.FC<DataManagementScreenProps> = ({ onFileUpload, onFileExport, employeeCount, onBack }) => {
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
