import React from 'react';

interface DocumentPreviewViewerProps {
  documentType: string;
  extractedText: string;
  confidence: number;
}

export const DocumentPreviewViewer: React.FC<DocumentPreviewViewerProps> = ({
  documentType,
  extractedText,
  confidence,
}) => {
  return (
    <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>OCR Intelligence Extractor ({documentType})</span>
        <span className="text-emerald-400">Confidence: {(confidence * 100).toFixed(0)}%</span>
      </div>
      <div className="p-3 bg-slate-800 rounded-lg text-xs overflow-x-auto text-slate-200">
        {extractedText || 'No extracted metadata parsed yet...'}
      </div>
    </div>
  );
};
