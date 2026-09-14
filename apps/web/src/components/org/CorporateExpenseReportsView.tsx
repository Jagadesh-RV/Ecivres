'use client';

import React from 'react';
import { FileText, Download, Building, DollarSign, PieChart, TrendingUp } from 'lucide-react';

export interface DepartmentExpense {
  departmentName: string;
  monthlyLimit: number;
  currentSpend: number;
  percentageUsed: number;
}

interface CorporateExpenseReportsViewProps {
  departments?: DepartmentExpense[];
  onDownloadCsv?: () => void;
}

export const CorporateExpenseReportsView: React.FC<CorporateExpenseReportsViewProps> = ({
  departments = [
    { departmentName: 'Facilities & Maintenance', monthlyLimit: 5000, currentSpend: 3200, percentageUsed: 64 },
    { departmentName: 'Human Resources', monthlyLimit: 2000, currentSpend: 1850, percentageUsed: 92.5 },
    { departmentName: 'Executive Offices', monthlyLimit: 3500, currentSpend: 1400, percentageUsed: 40 },
  ],
  onDownloadCsv,
}) => {
  const totalLimit = departments.reduce((sum, d) => sum + d.monthlyLimit, 0);
  const totalSpend = departments.reduce((sum, d) => sum + d.currentSpend, 0);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <PieChart className="w-4 h-4" />
            <span>Corporate Financial Reports</span>
          </div>
          <h2 className="text-2xl font-bold">Department Expenses & Budget Tracking</h2>
        </div>
        <button
          onClick={onDownloadCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Overview Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center text-slate-300 text-xs">
          <span>Consolidated Monthly Budget Spend</span>
          <span className="font-bold text-white">${totalSpend.toLocaleString()} / ${totalLimit.toLocaleString()}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400"
            style={{ width: `${Math.min(100, (totalSpend / totalLimit) * 100)}%` }}
          />
        </div>
      </div>

      {/* Department Breakdown List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {departments.map((d, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white">{d.departmentName}</h3>
            <div className="text-xl font-extrabold text-indigo-400">
              ${d.currentSpend.toLocaleString()}{' '}
              <span className="text-xs text-slate-500 font-normal">/ ${d.monthlyLimit.toLocaleString()}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full ${d.percentageUsed > 85 ? 'bg-amber-400' : 'bg-indigo-500'}`}
                style={{ width: `${d.percentageUsed}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 block">{d.percentageUsed}% of monthly limit utilized</span>
          </div>
        ))}
      </div>
    </div>
  );
};
