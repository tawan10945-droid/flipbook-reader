import React from 'react';
import { X } from 'lucide-react';

interface PageThumbnailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: string[];
  currentPage: number;
  onSelectPage: (index: number) => void;
}

export const PageThumbnailsModal: React.FC<PageThumbnailsModalProps> = ({
  isOpen,
  onClose,
  pages,
  currentPage,
  onSelectPage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end sm:justify-center p-0 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 w-full max-w-4xl max-h-[85vh] rounded-t-3xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-zinc-100">สารบัญหน้าทั้งหมด</span>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
              {pages.length} หน้า
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Thumbnail Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 sm:gap-4 no-scrollbar">
          {pages.map((pageImg, idx) => {
            const isCurrent = idx === currentPage || idx === currentPage + 1;
            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectPage(idx);
                  onClose();
                }}
                className={`group flex flex-col items-center p-2 rounded-xl border transition-all text-left ${
                  isCurrent
                    ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/40 shadow-lg'
                    : 'border-zinc-800 bg-zinc-950/60 hover:border-zinc-700 hover:bg-zinc-800/40'
                }`}
              >
                <div className="w-full aspect-[1/1.414] bg-zinc-900 rounded-lg overflow-hidden shadow-md flex items-center justify-center mb-2">
                  <img
                    src={pageImg}
                    alt={`หน้า ${idx + 1}`}
                    className="w-full h-full object-contain pointer-events-none group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>
                <span className={`text-xs font-mono font-medium ${isCurrent ? 'text-indigo-400 font-bold' : 'text-zinc-400'}`}>
                  หน้า {idx + 1}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
