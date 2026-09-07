import { useState, useEffect } from 'react';
import type { BookMeta } from './types/book';
import { storageService } from './services/storageService';
import { pdfService } from './services/pdfService';
import type { RenderProgress } from './services/pdfService';
import { generateSampleBookPages } from './services/sampleBook';
import { Bookshelf } from './components/Bookshelf';
import { FlipBookViewer } from './components/FlipBookViewer';
import { IosInstallBanner } from './components/IosInstallBanner';

export function App() {
  const [books, setBooks] = useState<BookMeta[]>([]);
  const [activeBook, setActiveBook] = useState<BookMeta | null>(null);
  const [activePages, setActivePages] = useState<string[]>([]);
  const [isLoadingBook, setIsLoadingBook] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState<RenderProgress | null>(null);

  // Load existing books from storage on mount
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    const list = await storageService.getAllBooks();
    setBooks(list);
  };

  // Open the built-in Interactive Sample Book
  const handleOpenSampleBook = () => {
    setIsLoadingBook(true);
    setLoadingProgress({
      current: 1,
      total: 5,
      message: 'กำลังเตรียมหน้าคู่มือตัวอย่าง...',
    });

    setTimeout(() => {
      const pages = generateSampleBookPages();
      setActivePages(pages);
      setActiveBook({
        id: 'sample_book',
        title: 'FlipBook 3D : คู่มือการใช้งานบน iPhone 15 Pro Max',
        pageCount: pages.length,
        coverImage: pages[0],
        lastReadPage: 0,
        lastReadAt: Date.now(),
        fileSize: 1024 * 512,
        createdAt: Date.now(),
        pageAspectRatio: 800 / 1130,
      });
      setIsLoadingBook(false);
      setLoadingProgress(null);
    }, 200);
  };

  // Open a stored PDF book
  const handleOpenBook = async (book: BookMeta) => {
    if (book.id === 'sample_book') {
      handleOpenSampleBook();
      return;
    }

    try {
      setIsLoadingBook(true);
      setLoadingProgress({
        current: 0,
        total: book.pageCount,
        message: 'กำลังโหลดไฟล์หนังสือจากหน่วยความจำ...',
      });

      const pdfData = await storageService.getBookPdfData(book.id);
      if (!pdfData) {
        alert('ไม่พบข้อมูลไฟล์ PDF กรุณาลองอัปโหลดใหม่อีกครั้ง');
        setIsLoadingBook(false);
        return;
      }

      const doc = await pdfService.loadDocument(pdfData);

      // Render all pages with progress callback
      const pages = await pdfService.renderAllPages(doc, 1.6, (prog) => {
        setLoadingProgress(prog);
      });

      setActivePages(pages);
      setActiveBook(book);
      setIsLoadingBook(false);
      setLoadingProgress(null);
    } catch (err) {
      console.error('Failed to open book:', err);
      alert('เกิดข้อผิดพลาดในการโหลดหน้าหนังสือ');
      setIsLoadingBook(false);
      setLoadingProgress(null);
    }
  };

  const handlePageChange = async (page: number) => {
    if (activeBook && activeBook.id !== 'sample_book') {
      await storageService.updateReadingProgress(activeBook.id, page);
    }
  };

  const handleBackToBookshelf = async () => {
    setActiveBook(null);
    setActivePages([]);
    await loadBooks();
  };

  return (
    <div className="w-full h-full min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      {/* Loading Overlay */}
      {isLoadingBook && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none animate-in fade-in duration-200">
          <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mb-6 shadow-2xl shadow-indigo-500/20">
            <div className="w-10 h-10 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-zinc-100 mb-2">
            กำลังเปิดเล่มหนังสือ...
          </h3>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6 min-h-[20px]">
            {loadingProgress?.message || 'กรุณารอสักครู่...'}
          </p>

          {/* Progress Bar */}
          {loadingProgress && loadingProgress.total > 0 && (
            <div className="w-full max-w-xs space-y-2">
              <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-200"
                  style={{
                    width: `${Math.round((loadingProgress.current / loadingProgress.total) * 100)}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                <span>หน้า {loadingProgress.current}</span>
                <span>{loadingProgress.total} หน้า</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main View Router */}
      {activeBook && activePages.length > 0 ? (
        <FlipBookViewer
          title={activeBook.title}
          pages={activePages}
          initialPage={activeBook.lastReadPage}
          pageAspectRatio={activeBook.pageAspectRatio}
          onBack={handleBackToBookshelf}
          onPageChange={handlePageChange}
        />
      ) : (
        <Bookshelf
          books={books}
          onOpenBook={handleOpenBook}
          onOpenSampleBook={handleOpenSampleBook}
          onRefreshBooks={loadBooks}
        />
      )}

      {/* iOS App Install Reminder */}
      <IosInstallBanner />
    </div>
  );
}

export default App;
