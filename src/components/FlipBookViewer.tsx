import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PageFlip } from 'page-flip';
import {
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Grid,
  ZoomIn,
  Sun,
  Moon,
  Columns,
  BookOpen,
} from 'lucide-react';
import { soundService } from '../services/soundService';
import { PageThumbnailsModal } from './PageThumbnailsModal';
import { ZoomModal } from './ZoomModal';
import type { BookTheme } from '../types/book';

interface FlipBookViewerProps {
  title: string;
  pages: string[];
  initialPage?: number;
  pageAspectRatio?: number;
  onBack: () => void;
  onPageChange?: (page: number) => void;
}

export const FlipBookViewer: React.FC<FlipBookViewerProps> = ({
  title,
  pages,
  initialPage = 0,
  pageAspectRatio = 0.707,
  onBack,
  onPageChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageFlipInstance = useRef<PageFlip | null>(null);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isMuted, setIsMuted] = useState(soundService.getIsMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showZoom, setShowZoom] = useState(false);
  const [isUiVisible, setIsUiVisible] = useState(true);
  const [theme, setTheme] = useState<BookTheme>('dark');
  const [isSpreadMode, setIsSpreadMode] = useState(false);
  const [viewMode, setViewMode] = useState<'flip' | 'scroll'>('flip');

  const hideUiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-hide UI controls after 4 seconds of inactivity
  const resetHideTimer = useCallback(() => {
    setIsUiVisible(true);
    if (hideUiTimer.current) clearTimeout(hideUiTimer.current);
    hideUiTimer.current = setTimeout(() => {
      setIsUiVisible(false);
    }, 4000);
  }, []);

  // Compute dimensions
  const getDimensions = useCallback(() => {
    const isPortrait = window.innerHeight > window.innerWidth;
    const paddingX = isPortrait ? 20 : 60;
    const paddingY = isPortrait ? 130 : 90;

    const availW = window.innerWidth - paddingX;
    const availH = window.innerHeight - paddingY;

    const ratio = pageAspectRatio || 0.707;
    let w = 0;
    let h = 0;

    if (isPortrait) {
      w = Math.min(availW, 460);
      h = Math.round(w / ratio);
      if (h > availH) {
        h = availH;
        w = Math.round(h * ratio);
      }
    } else {
      let singleW = Math.min(availW / 2, 540);
      let calcH = Math.round(singleW / ratio);
      if (calcH > availH) {
        calcH = availH;
        singleW = Math.round(calcH * ratio);
      }
      w = singleW;
      h = calcH;
    }

    return {
      width: Math.max(w, 240),
      height: Math.max(h, 340),
      isPortrait,
    };
  }, [pageAspectRatio]);

  // Initialize PageFlip
  useEffect(() => {
    if (viewMode !== 'flip' || !containerRef.current || pages.length === 0) return;

    // Reset container DOM
    const container = containerRef.current;
    container.innerHTML = '<div class="flip-book-inner"></div>';
    const bookEl = container.querySelector('.flip-book-inner') as HTMLElement;

    const { width, height } = getDimensions();
    const isPortrait = window.innerHeight > window.innerWidth;
    setIsSpreadMode(!isPortrait);

    try {
      const flip = new PageFlip(bookEl, {
        width,
        height,
        size: 'fixed',
        minWidth: 200,
        maxWidth: 900,
        minHeight: 300,
        maxHeight: 1200,
        drawShadow: true,
        flippingTime: 650,
        usePortrait: true,
        startPage: Math.min(currentPage, pages.length - 1),
        showCover: true,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.75,
        showPageCorners: true,
        disableFlipByClick: false,
      });

      flip.loadFromImages(pages);

      flip.on('flip', (e: { data: any }) => {
        const pageIdx = typeof e.data === 'number' ? e.data : 0;
        setCurrentPage(pageIdx);
        soundService.playPageTurn();
        if (onPageChange) onPageChange(pageIdx);
        resetHideTimer();
      });

      flip.on('changeOrientation', (e: { data: any }) => {
        setIsSpreadMode(e.data === 'landscape');
      });

      pageFlipInstance.current = flip;
    } catch (err) {
      console.error('Failed to init PageFlip:', err);
    }

    resetHideTimer();

    return () => {
      if (pageFlipInstance.current) {
        try {
          pageFlipInstance.current.destroy();
        } catch {
          // ignore
        }
        pageFlipInstance.current = null;
      }
    };
  }, [pages, viewMode]);

  // Handle window resize / orientation change
  useEffect(() => {
    const handleResize = () => {
      if (!pageFlipInstance.current) return;
      const { isPortrait } = getDimensions();
      setIsSpreadMode(!isPortrait);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [getDimensions]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      resetHideTimer();
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        pageFlipInstance.current?.flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        pageFlipInstance.current?.flipPrev();
      } else if (e.key === 'Escape') {
        if (showZoom) setShowZoom(false);
        else if (showThumbnails) setShowThumbnails(false);
        else onBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetHideTimer, showZoom, showThumbnails, onBack]);

  const handleToggleSound = () => {
    const muted = soundService.toggleMute();
    setIsMuted(muted);
    if (!muted) soundService.playPageTurn();
    resetHideTimer();
  };

  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen not supported or allowed on this device
    }
    resetHideTimer();
  };

  const jumpToPage = (idx: number) => {
    const validIdx = Math.max(0, Math.min(idx, pages.length - 1));
    setCurrentPage(validIdx);
    if (pageFlipInstance.current) {
      try {
        pageFlipInstance.current.flip(validIdx);
      } catch {
        pageFlipInstance.current.turnToPage(validIdx);
      }
    }
    if (onPageChange) onPageChange(validIdx);
    resetHideTimer();
  };

  // Theme styles
  const getThemeBackground = () => {
    switch (theme) {
      case 'paper':
        return 'bg-[#f4efe6] text-[#2c2825]';
      case 'sepia':
        return 'bg-[#2b2621] text-[#f1e6d2]';
      case 'night':
        return 'bg-[#08090d] text-[#e2e8f0]';
      case 'dark':
      default:
        return 'bg-[#0f1117] text-[#e2e8f0]';
    }
  };

  const isDark = theme === 'dark' || theme === 'night' || theme === 'sepia';

  return (
    <div
      className={`relative w-full h-full min-h-screen overflow-hidden select-none transition-colors duration-300 flex flex-col justify-between ${getThemeBackground()}`}
      onClick={resetHideTimer}
    >
      {/* Top Navigation Bar */}
      <header
        className={`fixed top-0 inset-x-0 z-30 transition-all duration-300 pt-safe px-3 sm:px-6 py-2.5 flex items-center justify-between backdrop-blur-xl ${
          isDark
            ? 'bg-zinc-950/75 border-b border-zinc-800/60 text-zinc-100'
            : 'bg-white/80 border-b border-amber-900/10 text-zinc-800 shadow-sm'
        } ${isUiVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center gap-2 max-w-[50%] sm:max-w-[40%]">
          <button
            onClick={onBack}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-medium text-xs sm:text-sm transition-all ${
              isDark
                ? 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200'
                : 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">ชั้นหนังสือ</span>
          </button>

          <h1 className="text-xs sm:text-sm font-semibold truncate ml-1 opacity-90" title={title}>
            {title}
          </h1>
        </div>

        {/* Center Page indicator */}
        <div className="text-xs font-mono font-medium px-2 py-1 rounded-md bg-black/20 backdrop-blur-sm">
          {isSpreadMode && currentPage > 0 && currentPage < pages.length - 1
            ? `หน้า ${currentPage}-${currentPage + 1} / ${pages.length}`
            : `หน้า ${currentPage + 1} / ${pages.length}`}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Zoom Modal Button */}
          <button
            onClick={() => {
              setShowZoom(true);
              resetHideTimer();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
            title="ซูมอ่านตัวหนังสือชัดๆ"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition ${
              isMuted ? 'opacity-40' : 'text-indigo-400'
            } hover:bg-white/10`}
            title={isMuted ? 'เปิดเสียงพลิกกระดาษ' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Thumbnails Drawer */}
          <button
            onClick={() => {
              setShowThumbnails(true);
              resetHideTimer();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
            title="ดูสารบัญภาพทุกหน้า"
          >
            <Grid className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => {
              setTheme((prev) => {
                if (prev === 'dark') return 'paper';
                if (prev === 'paper') return 'sepia';
                if (prev === 'sepia') return 'night';
                return 'dark';
              });
              resetHideTimer();
            }}
            className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 transition"
            title="เปลี่ยนธีมสีพื้นหลัง"
          >
            {theme === 'paper' ? <Sun className="w-4 h-4 text-amber-600" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Mode Switch (Flip vs Scroll) */}
          <button
            onClick={() => {
              setViewMode((m) => (m === 'flip' ? 'scroll' : 'flip'));
              resetHideTimer();
            }}
            className={`w-8 h-8 rounded-lg flex items-center justify-center transition hover:bg-white/10 ${
              viewMode === 'scroll' ? 'text-indigo-400 bg-indigo-500/20' : ''
            }`}
            title="สลับโหมดเลื่อน / โหมดพลิกสมุด 3D"
          >
            {viewMode === 'flip' ? <BookOpen className="w-4 h-4" /> : <Columns className="w-4 h-4" />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={handleToggleFullscreen}
            className="w-8 h-8 rounded-lg hidden sm:flex items-center justify-center hover:bg-white/10 transition"
            title="เต็มหน้าจอ"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Reader View */}
      <main className="flex-1 w-full h-full flex items-center justify-center relative overflow-hidden pt-12 pb-20">
        {viewMode === 'flip' ? (
          <div className="relative w-full h-full flex items-center justify-center flipbook-container">
            {/* PageFlip Mounting Container */}
            <div ref={containerRef} className="relative z-10 flex items-center justify-center" />

            {/* Left Page Turn Click Area for Desktop/Tablet */}
            <button
              onClick={() => {
                pageFlipInstance.current?.flipPrev();
                resetHideTimer();
              }}
              disabled={currentPage <= 0}
              className={`absolute left-2 sm:left-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl ${
                currentPage <= 0
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 text-white border border-zinc-700/50'
              } ${isUiVisible ? 'opacity-90' : 'opacity-0 hover:opacity-100'}`}
              title="หน้าก่อนหน้า"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Page Turn Click Area */}
            <button
              onClick={() => {
                pageFlipInstance.current?.flipNext();
                resetHideTimer();
              }}
              disabled={currentPage >= pages.length - 1}
              className={`absolute right-2 sm:right-4 z-20 w-10 sm:w-12 h-10 sm:h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xl ${
                currentPage >= pages.length - 1
                  ? 'opacity-0 pointer-events-none'
                  : 'bg-zinc-900/60 hover:bg-zinc-800 text-white border border-zinc-700/50'
              } ${isUiVisible ? 'opacity-90' : 'opacity-0 hover:opacity-100'}`}
              title="หน้าถัดไป"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        ) : (
          /* Continuous Scroll Mode */
          <div className="w-full h-full overflow-y-auto px-3 py-6 flex flex-col items-center gap-4 no-scrollbar">
            {pages.map((img, index) => (
              <div
                key={index}
                id={`scroll-page-${index}`}
                className="max-w-2xl w-full bg-white rounded-lg shadow-2xl overflow-hidden border border-zinc-800/40 relative"
              >
                <img src={img} alt={`หน้า ${index + 1}`} className="w-full h-auto block" loading="lazy" />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-sm">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Floating Navigation & Scrubber Bar */}
      <footer
        className={`fixed bottom-0 inset-x-0 z-30 transition-all duration-300 pb-safe px-4 sm:px-8 py-3 flex flex-col items-center gap-1.5 backdrop-blur-xl ${
          isDark
            ? 'bg-zinc-950/80 border-t border-zinc-800/60 text-zinc-100'
            : 'bg-white/85 border-t border-amber-900/10 text-zinc-800 shadow-lg'
        } ${isUiVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}
      >
        <div className="w-full max-w-xl flex items-center gap-3">
          <span className="text-[11px] font-mono font-medium opacity-60 min-w-[32px] text-right">
            {currentPage + 1}
          </span>

          {/* Page Scrubber Slider */}
          <input
            type="range"
            min={0}
            max={Math.max(0, pages.length - 1)}
            value={currentPage}
            onChange={(e) => {
              const val = Number(e.target.value);
              jumpToPage(val);
            }}
            className="flex-1 h-1.5 bg-zinc-700/60 accent-indigo-500 rounded-lg cursor-pointer appearance-none outline-none"
          />

          <span className="text-[11px] font-mono font-medium opacity-60 min-w-[32px]">
            {pages.length}
          </span>
        </div>

        <div className="text-[10px] opacity-40 font-mono hidden sm:block">
          ใช้ปุ่มลูกศร ← → หรือแตะ/ลากขอบหนังสือเพื่อพลิกหน้า • แตะหน้าจอเพื่อซ่อน/แสดงเมนู
        </div>
      </footer>

      {/* Thumbnails Modal */}
      <PageThumbnailsModal
        isOpen={showThumbnails}
        onClose={() => setShowThumbnails(false)}
        pages={pages}
        currentPage={currentPage}
        onSelectPage={jumpToPage}
      />

      {/* High-Resolution Zoom Modal */}
      <ZoomModal
        isOpen={showZoom}
        onClose={() => setShowZoom(false)}
        pageImage={pages[currentPage] || pages[0]}
        pageNumber={currentPage + 1}
      />
    </div>
  );
};
