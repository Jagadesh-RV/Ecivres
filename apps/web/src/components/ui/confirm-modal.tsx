import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">{description}</p>
        <div className="flex justify-end space-x-3 pt-2">
          <button onClick={onCancel} className="px-4 py-2 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
            {cancelText}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-medium">
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
