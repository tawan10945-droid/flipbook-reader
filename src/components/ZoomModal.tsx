import React, { useState, useRef } from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface ZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageImage: string;
  pageNumber: number;
}

export const ZoomModal: React.FC<ZoomModalProps> = ({
  isOpen,
  onClose,
  pageImage,
  pageNumber,
}) => {
  const [scale, setScale] = useState(1.5);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  if (!isOpen) return null;

  const handleZoomIn = () => setScale(s => Math.min(s + 0.35, 3.5));
  const handleZoomOut = () => setScale(s => Math.max(s - 0.35, 0.8));
  const handleReset = () => {
    setScale(1.5);
    setPosition({ x: 0, y: 0 });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const onPointerUp = () => setIsDragging(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-between select-none touch-none">
      {/* Top Floating Control */}
      <div className="w-full px-4 pt-safe py-3 flex items-center justify-between bg-zinc-900/60 backdrop-blur-md border-b border-zinc-800/60 z-10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-zinc-100">โหมดซูมรายละเอียด</span>
          <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded font-mono">
            หน้า {pageNumber}
          </span>
        </div>

        {/* Zoom Action Controls */}
        <div className="flex items-center gap-1.5 bg-zinc-800/80 rounded-full p-1 border border-zinc-700/60">
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            title="ซูมออก"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-zinc-300 px-1 min-w-[40px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            title="ซูมเข้า"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            title="รีเซ็ต"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-zinc-800/90 text-zinc-300 hover:text-white flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Pan/Zoom Image Area */}
      <div
        className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <div
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
          className="max-w-[90vw] max-h-[80vh] flex items-center justify-center shadow-2xl rounded-sm overflow-hidden"
        >
          <img
            src={pageImage}
            alt={`หน้า ${pageNumber}`}
            className="w-auto h-auto max-w-full max-h-[80vh] object-contain pointer-events-none rounded shadow-2xl"
          />
        </div>
      </div>

      <div className="pb-safe py-2 text-center text-xs text-zinc-500">
        ลากเพื่อเลื่อนดูข้อความ • กดปุ่ม + / - เพื่อปรับขนาด
      </div>
    </div>
  );
};
