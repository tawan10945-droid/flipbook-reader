import { get, set, del, keys } from 'idb-keyval';
import type { BookMeta } from '../types/book';

const BOOKS_META_KEY = 'flipbook_all_books_meta';

export const storageService = {
  // Get all book metadata
  async getAllBooks(): Promise<BookMeta[]> {
    try {
      const list = await get<BookMeta[]>(BOOKS_META_KEY);
      return list || [];
    } catch (err) {
      console.error('Failed to get books list:', err);
      return [];
    }
  },

  // Save or update book metadata
  async saveBookMeta(meta: BookMeta): Promise<void> {
    const list = await this.getAllBooks();
    const existingIndex = list.findIndex(b => b.id === meta.id);
    if (existingIndex >= 0) {
      list[existingIndex] = meta;
    } else {
      list.unshift(meta);
    }
    await set(BOOKS_META_KEY, list);
  },

  // Save full book with PDF data
  async saveBook(meta: BookMeta, pdfData: ArrayBuffer): Promise<void> {
    await this.saveBookMeta(meta);
    await set(`pdf_data_${meta.id}`, pdfData);
  },

  // Get PDF data for a book
  async getBookPdfData(id: string): Promise<ArrayBuffer | null> {
    try {
      const data = await get<ArrayBuffer>(`pdf_data_${id}`);
      return data || null;
    } catch (err) {
      console.error(`Failed to get PDF data for ${id}:`, err);
      return null;
    }
  },

  // Update last read page
  async updateReadingProgress(id: string, page: number): Promise<void> {
    const list = await this.getAllBooks();
    const target = list.find(b => b.id === id);
    if (target) {
      target.lastReadPage = page;
      target.lastReadAt = Date.now();
      await set(BOOKS_META_KEY, list);
    }
  },

  // Delete a book
  async deleteBook(id: string): Promise<void> {
    const list = await this.getAllBooks();
    const filtered = list.filter(b => b.id !== id);
    await set(BOOKS_META_KEY, filtered);
    await del(`pdf_data_${id}`);
  },

  // Clear all books
  async clearAll(): Promise<void> {
    const allKeys = await keys();
    for (const key of allKeys) {
      if (typeof key === 'string' && (key.startsWith('pdf_data_') || key === BOOKS_META_KEY)) {
        await del(key);
      }
    }
  }
};
