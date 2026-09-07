import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X } from 'lucide-react';

export const IosInstallBanner: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed as an app)
    const standaloneMode =
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches;

    setIsStandalone(standaloneMode);

    // Check if running on iOS (iPhone/iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    const dismissed = sessionStorage.getItem('ios_install_banner_dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Don't show if already installed as standalone app, dismissed, or not an iOS device
  if (isStandalone || isDismissed || !isIos) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('ios_install_banner_dismissed', 'true');
  };

  return (
    <div className="fixed bottom-4 inset-x-3 sm:max-w-md sm:mx-auto z-40 animate-in slide-in-from-bottom duration-300">
      <div className="bg-zinc-900/95 border border-indigo-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex flex-col gap-2.5 text-zinc-100">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <span className="text-xl">📖</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                ติดตั้งเป็นแอปบน iPhone
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                  Full App
                </span>
              </h4>
              <p className="text-[11px] text-zinc-400">
                เปิดแบบแอปพลิเคชันเต็มจอ ไร้แถบ Safari
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="w-6 h-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Step instruction */}
        <div className="bg-zinc-950/70 rounded-xl p-2.5 flex items-center justify-between text-xs border border-zinc-800/80">
          <span className="flex items-center gap-1.5 text-zinc-300">
            แตะ <Share className="w-3.5 h-3.5 text-indigo-400 inline" /> ด้านล่าง แล้วเลือก <PlusSquare className="w-3.5 h-3.5 text-indigo-400 inline" /> <b>"เพิ่มไปยังหน้าจอโฮม"</b>
          </span>
        </div>
      </div>
    </div>
  );
};
