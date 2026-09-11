'use client';

import React, { useState } from 'react';
import { Users, UserPlus, Shield, Heart, Trash2, Edit2, Calendar } from 'lucide-react';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: 'SPOUSE' | 'PARENT' | 'CHILD' | 'OTHER';
  phone?: string;
  emergencyContact: boolean;
  notes?: string;
}

interface FamilyProfileManagerProps {
  members: FamilyMember[];
  onAddMember?: (member: Omit<FamilyMember, 'id'>) => void;
  onRemoveMember?: (id: string) => void;
}

export const FamilyProfileManager: React.FC<FamilyProfileManagerProps> = ({
  members,
  onAddMember,
  onRemoveMember,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<FamilyMember['relationship']>('SPOUSE');
  const [phone, setPhone] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddMember?.({ name, relationship, phone, emergencyContact });
    setName('');
    setPhone('');
    setShowModal(false);
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Family Profiles & Dependents</span>
          </h2>
          <p className="text-xs text-slate-400">Book services directly on behalf of family members or elderly parents.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{m.name}</h3>
                <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] uppercase font-semibold">
                  {m.relationship}
                </span>
              </div>
              <button
                onClick={() => onRemoveMember?.(m.id)}
                className="text-slate-500 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {m.phone && <div className="text-xs text-slate-400">📞 {m.phone}</div>}

            {m.emergencyContact && (
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                <Shield className="w-3.5 h-3.5" />
                <span>Primary Emergency Contact</span>
              </div>
            )}
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
            <h3 className="text-lg font-bold">Add Family Member</h3>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Relationship</label>
              <select
                value={relationship}
                onChange={(e) => setRelationship(e.target.value as any)}
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="SPOUSE">Spouse</option>
                <option value="PARENT">Parent</option>
                <option value="CHILD">Child</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">Phone Number (Optional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 019 2831"
                className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="emergency"
                checked={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-0"
              />
              <label htmlFor="emergency" className="text-xs text-slate-300">
                Designate as Emergency Contact
              </label>
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
                Add Member
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
