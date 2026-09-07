import * as pdfjsLib from 'pdfjs-dist';

// Use local worker for reliable offline reading, compatible with GitHub Pages subpaths and custom domains
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  `${import.meta.env.BASE_URL || './'}pdf.worker.min.js`,
  window.location.href
).href;

export interface RenderProgress {
  current: number;
  total: number;
  message: string;
}

export const pdfService = {
  // Load PDF Document from ArrayBuffer
  async loadDocument(data: ArrayBuffer): Promise<pdfjsLib.PDFDocumentProxy> {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(data),
      cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });
    return await loadingTask.promise;
  },

  // Get cover image and aspect ratio from page 1
  async getCoverAndMeta(doc: pdfjsLib.PDFDocumentProxy): Promise<{ coverImage: string; aspectRatio: number; pageCount: number }> {
    const pageCount = doc.numPages;
    const page1 = await doc.getPage(1);
    const viewport = page1.getViewport({ scale: 0.8 });
    const aspectRatio = viewport.width / viewport.height;

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) throw new Error('Cannot get canvas 2d context');

    await page1.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    const coverImage = canvas.toDataURL('image/jpeg', 0.85);
    return { coverImage, aspectRatio, pageCount };
  },

  // Render a specific page to an image Data URL
  async renderPageToDataUrl(
    doc: pdfjsLib.PDFDocumentProxy,
    pageNumber: number,
    scale: number = 1.6
  ): Promise<string> {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) throw new Error('Cannot get canvas 2d context');

    // Fill white background before rendering
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    return canvas.toDataURL('image/jpeg', 0.88);
  },

  // Render all pages progressively with callback
  async renderAllPages(
    doc: pdfjsLib.PDFDocumentProxy,
    scale: number = 1.6,
    onProgress?: (progress: RenderProgress) => void
  ): Promise<string[]> {
    const total = doc.numPages;
    const pages: string[] = [];

    for (let i = 1; i <= total; i++) {
      if (onProgress) {
        onProgress({
          current: i,
          total,
          message: `กำลังแปลงหน้าหนังสือ ${i} จาก ${total} หน้า...`,
        });
      }
      const dataUrl = await this.renderPageToDataUrl(doc, i, scale);
      pages.push(dataUrl);
    }

    return pages;
  }
};
