'use client';

import React, { useState } from 'react';
import { Zap, Play, Plus, Trash2, ArrowDown, CheckCircle2, Clock } from 'lucide-react';

export interface WorkflowRule {
  id: string;
  title: string;
  trigger: string;
  action: string;
  delayMinutes: number;
  active: boolean;
}

interface WorkflowBuilderViewProps {
  rules?: WorkflowRule[];
  onCreateRule?: (rule: Omit<WorkflowRule, 'id'>) => void;
}

export const WorkflowBuilderView: React.FC<WorkflowBuilderViewProps> = ({
  rules = [
    {
      id: 'r1',
      title: 'Auto-accept small instant bookings',
      trigger: 'BOOKING_CREATED',
      action: 'AUTO_ACCEPT',
      delayMinutes: 0,
      active: true,
    },
    {
      id: 'r2',
      title: '24-hour SMS Booking Reminder',
      trigger: '24H_BEFORE_SCHEDULED',
      action: 'SEND_SMS_REMINDER',
      delayMinutes: 1440,
      active: true,
    },
  ],
  onCreateRule,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [trigger, setTrigger] = useState('BOOKING_CREATED');
  const [action, setAction] = useState('AUTO_ACCEPT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreateRule?.({ title, trigger, action, delayMinutes: 0, active: true });
    setTitle('');
    setShowModal(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
            <Zap className="w-4 h-4" />
            <span>Automations & Workflow Canvas</span>
          </div>
          <h2 className="text-2xl font-bold">Automated Rule Engine</h2>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>New Workflow Rule</span>
        </button>
      </div>

      {/* Rules Canvas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((r) => (
          <div key={r.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">{r.title}</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold">
                <span>WHEN:</span>
                <span className="text-slate-200">{r.trigger}</span>
              </div>
              <ArrowDown className="w-4 h-4 text-slate-600 mx-auto" />
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <span>THEN:</span>
                <span className="text-slate-200">{r.action}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold">Create Automation Rule</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Rule Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Auto-refund on cancellation"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Trigger Event</label>
              <select
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="BOOKING_CREATED">When Booking Created</option>
                <option value="SERVICE_COMPLETED">When Service Completed</option>
                <option value="PAYMENT_FAILED">When Payment Fails</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Action to Take</label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="AUTO_ACCEPT">Auto Accept Booking</option>
                <option value="ISSUE_REFUND">Issue Full Refund</option>
                <option value="SCHEDULE_FOLLOWUP">Schedule Customer Survey</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold"
              >
                Save Rule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
