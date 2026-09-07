import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  BookOpen,
  Trash2,
  Clock,
  FileText,
  Smartphone,
  Sparkles,
  FolderOpen,
} from 'lucide-react';
import type { BookMeta } from '../types/book';
import { storageService } from '../services/storageService';
import { pdfService } from '../services/pdfService';
import { InstallGuideModal } from './InstallGuideModal';

interface BookshelfProps {
  books: BookMeta[];
  onOpenBook: (book: BookMeta) => void;
  onOpenSampleBook: () => void;
  onRefreshBooks: () => Promise<void>;
}

export const Bookshelf: React.FC<BookshelfProps> = ({
  books,
  onOpenBook,
  onOpenSampleBook,
  onRefreshBooks,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      alert('กรุณาเลือกไฟล์เอกสารนามสกุล .pdf');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStatus('กำลังอ่านไฟล์เอกสาร PDF...');

      const arrayBuffer = await file.arrayBuffer();

      setProcessingStatus('กำลังประมวลผลและดึงข้อมูลหน้าหนังสือ...');
      const doc = await pdfService.loadDocument(arrayBuffer);

      setProcessingStatus('กำลังสร้างภาพหน้าปก (Cover Image)...');
      const { coverImage, aspectRatio, pageCount } = await pdfService.getCoverAndMeta(doc);

      const title = file.name.replace(/\.pdf$/i, '');
      const newBook: BookMeta = {
        id: 'book_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        title: title || 'หนังสือไม่มีชื่อ',
        pageCount,
        coverImage,
        lastReadPage: 0,
        lastReadAt: Date.now(),
        fileSize: file.size,
        createdAt: Date.now(),
        pageAspectRatio: aspectRatio,
      };

      setProcessingStatus('กำลังบันทึกลงหน่วยความจำเครื่อง...');
      await storageService.saveBook(newBook, arrayBuffer);
      await onRefreshBooks();

      setIsProcessing(false);
      setProcessingStatus('');

      // Open book immediately
      onOpenBook(newBook);
    } catch (err) {
      console.error('Failed to process PDF:', err);
      alert('เกิดข้อผิดพลาดในการเปิดไฟล์ PDF: กรุณาตรวจสอบว่าไฟล์ไม่เสียหาย');
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileProcess(e.target.files[0]);
      e.target.value = '';
    }
  };

  const handleDeleteBook = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await storageService.deleteBook(id);
    setDeleteConfirmId(null);
    await onRefreshBooks();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatLastRead = (timestamp: number): string => {
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'เมื่อสักครู่';
    if (mins < 60) return `${mins} นาทีที่แล้ว`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`;
    const days = Math.floor(hours / 24);
    return `${days} วันที่แล้ว`;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pt-safe pb-safe select-none">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="application/pdf,.pdf"
        className="hidden"
      />

      {/* Top Navbar */}
      <nav className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent block">
              FlipBook 3D
            </span>
            <span className="text-[11px] text-zinc-400 font-medium block">
              iPhone 15 Pro Max Reader
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Install Guide Button */}
          <button
            onClick={() => setShowInstallGuide(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs text-zinc-300 font-medium transition border border-zinc-700/50"
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">วิธีลงบน</span> iPhone
          </button>

          {/* Quick Sample Book Button */}
          <button
            onClick={onOpenSampleBook}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-xs text-indigo-300 font-medium transition border border-indigo-500/30"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>เล่มตัวอย่าง</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col gap-8">
        {/* Upload / Drop Area */}
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative overflow-hidden group cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 p-6 sm:p-10 flex flex-col items-center text-center justify-center gap-3 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
              : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60'
          }`}
        >
          {/* Subtle glow background */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-transparent pointer-events-none" />

          <div className="w-16 h-16 rounded-2xl bg-zinc-800/90 group-hover:bg-indigo-600/20 text-zinc-400 group-hover:text-indigo-400 flex items-center justify-center transition-all duration-200 shadow-inner">
            <UploadCloud className="w-8 h-8 group-hover:scale-110 transition-transform duration-200" />
          </div>

          <div className="space-y-1">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100">
              โยนไฟล์ PDF เข้ามาที่นี่ หรือคลิกเพื่อเลือกไฟล์
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
              รองรับทั้งไฟล์ PDF หนังสือ นิยาย ชีทเรียน และการ์ตูน แปลงเป็นเล่ม 3 มิติให้อ่านทันที
            </p>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] bg-zinc-800 text-zinc-400 px-3 py-1 rounded-full font-mono">
              ไฟล์ .PDF ทุกขนาด
            </span>
            <span className="text-[11px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-3 py-1 rounded-full">
              เก็บบนเครื่อง 100% ปลอดภัย
            </span>
          </div>
        </section>

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full border-3 border-indigo-500 border-t-transparent animate-spin shrink-0" />
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-indigo-200">กำลังเตรียมเปิดเล่มหนังสือ...</p>
              <p className="text-xs text-indigo-400/80">{processingStatus}</p>
            </div>
          </div>
        )}

        {/* Bookshelf Grid */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-100">ชั้นหนังสือของคุณ</h3>
              <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full font-mono">
                {books.length} เล่ม
              </span>
            </div>

            {books.length > 0 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition flex items-center gap-1"
              >
                + เพิ่มเล่มใหม่
              </button>
            )}
          </div>

          {books.length === 0 ? (
            /* Empty Bookshelf View */
            <div className="py-12 px-4 rounded-3xl bg-zinc-900/20 border border-zinc-800/60 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-600">
                <FolderOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-zinc-300">ยังไม่มีหนังสือในชั้น</p>
                <p className="text-xs text-zinc-500 max-w-sm">
                  โยนไฟล์ PDF ใดๆ เข้ามาเพื่อสร้างหนังสือ หรือกดปุ่มด้านล่างเพื่อทดลองอ่านเล่มตัวอย่าง
                </p>
              </div>
              <button
                onClick={onOpenSampleBook}
                className="mt-1 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-lg shadow-indigo-600/25 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                เปิดอ่านคู่มือและเล่มตัวอย่าง
              </button>
            </div>
          ) : (
            /* Book Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {books.map((book) => {
                const progressPct = Math.round(
                  book.pageCount > 0 ? ((book.lastReadPage + 1) / book.pageCount) * 100 : 0
                );

                return (
                  <div
                    key={book.id}
                    onClick={() => onOpenBook(book)}
                    className="group relative flex flex-col rounded-2xl bg-zinc-900/50 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all duration-200 cursor-pointer overflow-hidden p-3 shadow-md hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                  >
                    {/* Realistic 3D Book Cover Presentation */}
                    <div className="relative w-full aspect-[1/1.42] bg-zinc-950 rounded-xl overflow-hidden shadow-inner flex items-center justify-center mb-3">
                      {book.coverImage ? (
                        <img
                          src={book.coverImage}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <FileText className="w-12 h-12 text-zinc-700" />
                      )}

                      {/* Realistic book spine shadow on left edge */}
                      <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/60 to-transparent pointer-events-none" />

                      {/* Page Count Badge */}
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-mono font-medium text-zinc-200">
                        {book.pageCount} หน้า
                      </div>

                      {/* Delete Button */}
                      {deleteConfirmId === book.id ? (
                        <div
                          className="absolute inset-0 bg-black/85 backdrop-blur-sm p-3 flex flex-col items-center justify-center gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-xs text-red-400 font-semibold text-center">
                            ลบเล่มนี้หรือไม่?
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => handleDeleteBook(book.id, e)}
                              className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-xs font-bold"
                            >
                              ลบ
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(null);
                              }}
                              className="px-2.5 py-1 bg-zinc-700 text-zinc-200 rounded-lg text-xs"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(book.id);
                          }}
                          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-600/90 text-zinc-400 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-150 backdrop-blur-sm"
                          title="ลบหนังสือ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Book Details */}
                    <div className="flex-1 flex flex-col justify-between space-y-2">
                      <h4
                        className="text-xs sm:text-sm font-bold text-zinc-100 line-clamp-2 group-hover:text-indigo-400 transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </h4>

                      <div className="space-y-1.5 pt-1">
                        {/* Reading progress bar */}
                        <div className="w-full h-1 bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                          <span>หน้า {book.lastReadPage + 1} / {book.pageCount}</span>
                          <span>{progressPct}%</span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>{formatLastRead(book.lastReadAt)}</span>
                          </div>
                          <span className="font-mono text-zinc-500">{formatFileSize(book.fileSize)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Guide Modal */}
      <InstallGuideModal
        isOpen={showInstallGuide}
        onClose={() => setShowInstallGuide(false)}
      />
    </div>
  );
};
