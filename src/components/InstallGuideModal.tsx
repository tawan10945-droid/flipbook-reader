import React from 'react';
import { X, Share, PlusSquare, Smartphone, Wifi, CheckCircle2 } from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-zinc-100">วิธีติดตั้งบน iPhone 15 Pro Max</h2>
              <p className="text-xs text-zinc-400">เปลี่ยนเป็นแอปเต็มหน้าจอ ไม่ต้องผ่าน App Store</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Step 1 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              1
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200">เปิดด้วย Safari บน iPhone</p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                เปิดลิงก์แอปพลิเคชันนี้ในเบราว์เซอร์ <b>Safari</b> บน iPhone 15 Pro Max ของคุณ (เชื่อมต่อ Wi-Fi เดียวกันกับเครื่องคอมพิวเตอร์ หรือเปิดผ่านลิงก์ที่ Deploy แล้ว)
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              2
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                แตะปุ่มแชร์ <Share className="w-3.5 h-3.5 text-indigo-400 inline" />
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                แตะไอคอนสี่เหลี่ยมที่มีลูกศรชี้ขึ้น (Share) ที่แถบเมนูด้านล่างของ Safari
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-zinc-950/60 border border-zinc-800/80">
            <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              3
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                เลือก "เพิ่มไปยังหน้าจอโฮม" <PlusSquare className="w-3.5 h-3.5 text-indigo-400 inline" />
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">
                เลื่อนรายการเมนูลงมาแล้วกด <b>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</b> แล้วแตะ <b>"เพิ่ม" (Add)</b> ที่มุมขวาบน
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-3.5 p-3 rounded-xl bg-emerald-950/30 border border-emerald-800/40">
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-emerald-300">เสร็จสมบูรณ์! พร้อมใช้งานออฟไลน์</p>
              <p className="text-xs text-emerald-400/80 leading-relaxed">
                ไอคอน <b>FlipBook</b> จะไปอยู่บนหน้าจอ iPhone ของคุณ สามารถเปิดอ่านเต็มหน้าจอ ไร้แถบ URL กวนใจ และบันทึกไฟล์ PDF ไว้อ่านตอนไม่มีเน็ตได้ทันที!
              </p>
            </div>
          </div>

          {/* Offline benefit card */}
          <div className="p-3 bg-zinc-800/40 rounded-xl flex items-center gap-3 text-xs text-zinc-400">
            <Wifi className="w-5 h-5 text-indigo-400 shrink-0" />
            <span>
              หนังสือทุกเล่มที่โยนเข้าแอปจะถูกเก็บไว้ในเครื่องของคุณ ปลอดภัย เป็นส่วนตัว และไม่ต้องต่อเน็ตตลอดเวลา
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition shadow-lg shadow-indigo-600/20"
          >
            เข้าใจแล้ว
          </button>
        </div>
      </div>
    </div>
  );
};
