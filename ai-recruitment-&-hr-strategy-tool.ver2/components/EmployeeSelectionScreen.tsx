
import React, { useState, useMemo } from 'react';
import { EmployeeProfile } from '../types';

interface EmployeeSelectionScreenProps {
  employees: EmployeeProfile[];
  onAnalyze: (selectedProfiles: EmployeeProfile[]) => void;
}

export const EmployeeSelectionScreen: React.FC<EmployeeSelectionScreenProps> = ({ employees, onAnalyze }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [yearsFilter, setYearsFilter] = useState<string>('all');

  const departments = useMemo(() => ['all', ...Array.from(new Set(employees.map(e => e.department)))], [employees]);
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(e => {
      const departmentMatch = departmentFilter === 'all' || e.department === departmentFilter;
      const yearsMatch = yearsFilter === 'all' || 
        (yearsFilter === '0-3' && e.yearsOfService <= 3) ||
        (yearsFilter === '4-7' && e.yearsOfService >= 4 && e.yearsOfService <= 7) ||
        (yearsFilter === '8+' && e.yearsOfService >= 8);
      return departmentMatch && yearsMatch;
    });
  }, [employees, departmentFilter, yearsFilter]);

  const handleSelect = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleSubmit = () => {
    const selectedProfiles = employees.filter(e => selectedIds.has(e.id));
    onAnalyze(selectedProfiles);
  };
  
  const handleSelectAll = () => {
      const allFilteredIds = new Set(filteredEmployees.map(e => e.id));
      setSelectedIds(allFilteredIds);
  };

  const handleDeselectAll = () => {
      setSelectedIds(new Set());
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full animate-fade-in">
      <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">チームメンバーの選択</h2>
      <p className="text-center text-slate-500 mb-6">分析したいメンバーを選択してください。</p>

      <div className="flex flex-col sm:flex-row gap-4 mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">部署で絞り込み</label>
          <select value={departmentFilter} onChange={e => setDepartmentFilter(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            {departments.map(d => <option key={d} value={d}>{d === 'all' ? 'すべての部署' : d}</option>)}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-600 mb-1">勤続年数で絞り込み</label>
          <select value={yearsFilter} onChange={e => setYearsFilter(e.target.value)} className="w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
            <option value="all">すべて</option>
            <option value="0-3">3年以下</option>
            <option value="4-7">4〜7年</option>
            <option value="8+">8年以上</option>
          </select>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-semibold text-slate-700">
              {selectedIds.size}名選択中
          </div>
          <div>
              <button onClick={handleSelectAll} className="text-sm text-indigo-600 hover:underline mr-4">全選択</button>
              <button onClick={handleDeselectAll} className="text-sm text-slate-500 hover:underline">全解除</button>
          </div>
      </div>

      <div className="space-y-3 max-h-72 overflow-y-auto border border-slate-200 rounded-lg p-3">
        {filteredEmployees.map(employee => (
          <label key={employee.id} className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedIds.has(employee.id) ? 'bg-indigo-100 border-indigo-300' : 'bg-white hover:bg-slate-50'} border`}>
            <input
              type="checkbox"
              checked={selectedIds.has(employee.id)}
              onChange={() => handleSelect(employee.id)}
              className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <div className="ml-4">
              <p className="font-bold text-slate-800">{employee.name}</p>
              <p className="text-sm text-slate-500">{employee.department} / {employee.diagnosis.title}</p>
            </div>
          </label>
        ))}
      </div>
      
       {filteredEmployees.length === 0 && (
          <p className="text-center text-slate-500 py-8">この条件に一致する従業員はいません。</p>
        )}

      <div className="mt-8">
        <button
          onClick={handleSubmit}
          disabled={selectedIds.size < 2}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold py-3 px-6 rounded-full hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-300 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-slate-300 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {selectedIds.size}名でチームを分析
        </button>
         {selectedIds.size < 2 && <p className="text-center text-red-500 text-sm mt-2">チーム分析には2名以上選択してください。</p>}
      </div>
    </div>
  );
};
