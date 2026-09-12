'use client';

import React, { useState } from 'react';
import { Building2, Users, FileText, CheckCircle2, DollarSign, Plus, ArrowUpRight, ShieldCheck } from 'lucide-react';

export interface OrgDashboardProps {
  orgName?: string;
  monthlyBudgetCap?: number;
  monthlySpend?: number;
  branchesCount?: number;
  employeesCount?: number;
  pendingApprovalsCount?: number;
  onInviteEmployee?: (email: string, departmentId: string) => void;
}

export const OrganizationAdminDashboardView: React.FC<OrgDashboardProps> = ({
  orgName = 'Acme Global Enterprises',
  monthlyBudgetCap = 15000,
  monthlySpend = 6450,
  branchesCount = 3,
  employeesCount = 42,
  pendingApprovalsCount = 2,
  onInviteEmployee,
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    onInviteEmployee?.(inviteEmail, 'dept_fac');
    setInviteEmail('');
    setShowInviteModal(false);
  };

  const spendPercentage = Math.round((monthlySpend / monthlyBudgetCap) * 100);

  return (
    <div className="w-full space-y-6">
      {/* Header Banner */}
      <div className="flex justify-between items-center p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Building2 className="w-4 h-4" />
            <span>Corporate Account Portal</span>
          </div>
          <h2 className="text-2xl font-bold">{orgName}</h2>
          <p className="text-xs text-slate-400">
            {branchesCount} Active Branches • {employeesCount} Employees • Centralized Billing
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Employees</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Monthly Budget Cap</div>
          <div className="text-3xl font-extrabold text-white">${monthlySpend.toLocaleString()} / ${monthlyBudgetCap.toLocaleString()}</div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full ${spendPercentage > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`}
              style={{ width: `${spendPercentage}%` }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Pending Corporate Approvals</div>
          <div className="text-3xl font-extrabold text-amber-400">{pendingApprovalsCount}</div>
          <div className="text-[11px] text-slate-400">Bookings exceeding $250 require manager sign-off</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs text-slate-400 font-semibold">Billing Status</div>
          <div className="text-3xl font-extrabold text-emerald-400">Good Standing</div>
          <div className="text-[11px] text-slate-400">Consolidated monthly invoice due in 18 days</div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleInvite}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold">Invite Corporate Employee</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Employee Work Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
              >
                Send Invite
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
