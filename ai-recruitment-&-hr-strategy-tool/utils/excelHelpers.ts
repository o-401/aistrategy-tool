
import * as XLSX from 'xlsx';
import { EmployeeProfile, ComprehensiveDiagnosis } from '../types';

// Define the expected structure of a row in Excel
type ExcelRow = {
  ID: string;
  名前: string;
  部署: string;
  勤続年数: number;
  生年月日: string | Date;
  性別: string;
  血液型: string;
  星座: string;
  干支: string;
  MBTI: string;
  診断結果_JSON: string; // Store the complex diagnosis object as a JSON string
};

export const parseExcel = (file: File): Promise<EmployeeProfile[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
            return reject(new Error("File could not be read."));
        }
        const data = new Uint8Array(event.target.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);

        const profiles: EmployeeProfile[] = jsonData.map(row => {
          let diagnosis: Omit<ComprehensiveDiagnosis, 'id' | 'name'>;
          try {
            // Ensure row.診断結果_JSON is a string before parsing
            if (typeof row.診断結果_JSON !== 'string') {
                throw new Error('Diagnosis data is not a string.');
            }
            diagnosis = JSON.parse(row.診断結果_JSON);
          } catch {
            // Provide a default/empty diagnosis if parsing fails
            diagnosis = {
              title: "診断データなし",
              overall: "Excelファイルに有効な診断結果JSONが含まれていません。",
              strengths: [],
              weaknesses: [],
              ideal_work_style: "",
              communication_style: "",
              department_recommendations: [],
              manager_view: {
                  management_tips: [],
                  potential_risks: [],
                  ideal_environment: "",
                  praise_tips: [],
                  feedback_tips: [],
              },
            };
          }
          
          let birthDateStr: string;
          if (row.生年月日 instanceof Date) {
              // Format date to YYYY-MM-DD
              birthDateStr = row.生年月日.toISOString().split('T')[0];
          } else if (typeof row.生年月日 === 'string'){
              birthDateStr = row.生年月日;
          } else {
              birthDateStr = '日付不明';
          }

          return {
            id: String(row.ID || crypto.randomUUID()),
            name: String(row.名前),
            department: String(row.部署),
            yearsOfService: Number(row.勤続年数),
            birthDate: birthDateStr,
            gender: String(row.性別),
            bloodType: String(row.血液型),
            zodiac: String(row.星座),
            eto: String(row.干支),
            mbti: String(row.MBTI),
            diagnosis,
          };
        });
        resolve(profiles);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        reject(new Error("Excelファイルの解析に失敗しました。ヘッダー（ID, 名前, 診断結果_JSONなど）が正しいか、データ形式を確認してください。"));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const exportToExcel = (profiles: EmployeeProfile[], fileName: string): void => {
  try {
    const dataToExport: ExcelRow[] = profiles.map(p => ({
      ID: p.id,
      名前: p.name,
      部署: p.department,
      勤続年数: p.yearsOfService,
      生年月日: p.birthDate,
      性別: p.gender,
      血液型: p.bloodType,
      星座: p.zodiac,
      干支: p.eto,
      MBTI: p.mbti,
      診断結果_JSON: JSON.stringify(p.diagnosis, null, 2), // Pretty print JSON for readability
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    
    // Set column widths for better readability
    worksheet['!cols'] = [
        { wch: 36 }, // ID
        { wch: 15 }, // 名前
        { wch: 15 }, // 部署
        { wch: 10 }, // 勤続年数
        { wch: 12 }, // 生年月日
        { wch: 8 },  // 性別
        { wch: 8 },  // 血液型
        { wch: 8 },  // 星座
        { wch: 8 },  // 干支
        { wch: 8 },  // MBTI
        { wch: 100 },// 診断結果_JSON
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '従業員データ');

    XLSX.writeFile(workbook, fileName);
  } catch (error) {
      console.error("Error exporting to Excel:", error);
      throw new Error("Excelファイルのエクスポートに失敗しました。");
  }
};