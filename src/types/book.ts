export interface BookMeta {
  id: string;
  title: string;
  pageCount: number;
  coverImage: string; // Data URL of page 1
  lastReadPage: number;
  lastReadAt: number;
  fileSize: number;
  createdAt: number;
  pageAspectRatio: number; // width / height of first page
}

export interface BookData {
  meta: BookMeta;
  pdfData: ArrayBuffer;
}

export type ReadingMode = 'flipbook' | 'scroll';

export type BookTheme = 'dark' | 'paper' | 'sepia' | 'night';
