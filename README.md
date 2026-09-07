# 📖 FlipBook 3D Reader - สำหรับ iPhone 15 Pro Max และทุกอุปกรณ์

> **เว็บแอปพลิเคชันแปลงไฟล์ PDF เป็นเล่มหนังสือ 3 มิติเสมือนจริง พร้อมเสียงพลิกกระดาษ อ่านได้ทุกที่ทุกเวลาบน iPhone 15 Pro Max**

---

## ✨ จุดเด่นและฟังก์ชันหลัก (Key Features)

- 🪄 **โยนไฟล์แล้วอ่านได้ทันที (Drag & Drop PDF):** ลากและวางไฟล์ PDF ใดๆ ก็ได้ (หรือกดเลือกไฟล์จากแอป Files บน iPhone) ระบบจะแปลงเป็นหนังสือ 3D ทันที
- 📖 **แอนิเมชันพลิกหน้า 3D เสมือนจริง (Realistic Page Turn Physics):** จำลองการม้วนและเปิดหน้ากระดาษแบบ 3D สมจริงตามแรงปัดนิ้วหรือการลากมุมกระดาษ
- 🔊 **เสียงพลิกกระดาษ Acoustic (Web Audio API):** สังเคราะห์เสียงกระดาษเสียดสีตามธรรมชาติแบบสมจริง ไม่ต้องดาวน์โหลดไฟล์เสียงภายนอก ทำงานได้แบบออฟไลน์ 100%
- 📱 **ออกแบบพิเศษสำหรับ iPhone 15 Pro Max (PWA Ready):**
  - รองรับ Safe Area ของหน้าจอ 6.7 นิ้ว และ Dynamic Island
  - ติดตั้งเป็น Web App บนหน้าจอโฮม (Add to Home Screen) เปิดใช้งานเต็มหน้าจอ ไร้แถบ Safari เหมือนแอปแท้
- ⚡ **Offline-First Storage (IndexedDB):** จัดเก็บไฟล์หนังสือและหน้าอ่านค้างไว้ในเครื่องของคุณ ปลอดภัย ไม่ส่งไฟล์ออกสู่อินเทอร์เน็ต เปิดอ่านได้แม้อยู่บนเครื่องบินหรือไม่มีสัญญาณเน็ต
- 🔍 **โหมดซูมความละเอียดสูง (High-Resolution Zoom):** แตะเพื่อขยายดูตัวหนังสือขนาดเล็กได้อย่างคมชัดระดับ Retina
- 📑 **สารบัญภาพ Thumbnails & Scrubber:** เลื่อนดูตัวอย่างทุกหน้าและกระโดดข้ามหน้าได้อย่างรวดเร็ว
- 🎨 **ธีมสีสำหรับการอ่าน:** สลับได้ 4 ธีม (Dark Obsidian, Warm Paper, Vintage Sepia, Deep Night)
- 🔄 **สลับโหมดการอ่าน:** สลับระหว่างโหมดพลิกสมุด 3D (Flipbook) และโหมดเลื่อนอ่านแนวตั้ง (Continuous Scroll)

---

## 🚀 วิธีเปิดใช้งานบนเครื่อง Mac และอ่านบน iPhone 15 Pro Max

### 1. รันเซิร์ฟเวอร์บนเครื่อง Mac

เปิด Terminal ในโฟลเดอร์โปรเจกต์แล้วพิมพ์:

```bash
npm run dev
```

หรือหากต้องการดู QR Code สแกนเข้ามือถือทันที:

```bash
npm run qr
```

---

### 2. วิธีเชื่อมต่อบน iPhone 15 Pro Max

1. ตรวจสอบว่า **iPhone 15 Pro Max และ Mac เชื่อมต่อ Wi-Fi เครือข่ายเดียวกัน**
2. เปิด **Safari** บน iPhone แล้วพิมพ์ URL ที่แสดงใน Terminal (เช่น `http://192.168.1.2:5173`) หรือสแกน QR Code ด้วยกล้อง iPhone
3. หน้าแอปพลิเคชันจะเปิดขึ้นมาทันที!

---

### 3. วิธีติดตั้งเป็นแอปบนหน้าจอ iPhone (Add to Home Screen)

เพื่อให้ได้ประสบการณ์อ่านหนังสือที่ดีที่สุดแบบเต็มจอ:

1. ในหน้าเว็บ Safari บน iPhone 15 Pro Max ให้แตะที่ปุ่ม **แชร์ (Share)** (ไอคอนสี่เหลี่ยมลูกศรชี้ขึ้นที่แถบล่าง)
2. เลื่อนลงมาแล้วเลือก **"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)**
3. แตะ **"เพิ่ม" (Add)** ที่มุมขวาบน
4. จะมีไอคอน **FlipBook** ปรากฏบนหน้าจอ iPhone ของคุณ
5. เมื่อแตะเปิด จะทำงานแบบ **แอปพลิเคชันเต็มหน้าจอ (Standalone Fullscreen)** ไร้แถบ URL กวนใจ!

---

## 🌐 วิธีนำขึ้นเว็บ (Deploy) เพื่อให้อ่านได้จากทุกที่ทั่วโลก (ไม่ต้องเปิด Mac ทิ้งไว้)

คุณสามารถนำเว็บแอปนี้ขึ้นโฮสติ้งฟรีระดับโลกได้ภายใน 1-2 นาที:

### ตัวเลือกที่ 1: Deploy บน Vercel (แนะนำ - ง่ายและฟรี)
1. ติดตั้ง Vercel CLI หรือผูกผ่าน GitHub:
   ```bash
   npx vercel
   ```
2. ทำตามขั้นตอนบนหน้าจอ จะได้ URL เช่น `https://flipbook-reader.vercel.app`
3. เปิด URL นี้บน iPhone 15 Pro Max ของคุณได้จากทุกที่ในโลก!

### ตัวเลือกที่ 2: Deploy บน Cloudflare Pages หรือ Netlify
1. สั่ง Build โค้ด:
   ```bash
   npm run build
   ```
2. ลากโฟลเดอร์ `dist/` ไปวางบนแดชบอร์ดของ [Netlify Drop](https://app.netlify.com/drop) หรือ Cloudflare Pages

---

## 🛠️ โครงสร้างโปรเจกต์ (Project Architecture)

```
├── public/
│   ├── manifest.webmanifest   # การตั้งค่า PWA สำหรับ iPhone
│   ├── icon.svg               # ไอคอนแอปความละเอียดสูง
│   └── pdf.worker.min.js      # PDF.js Worker สำหรับประมวลผลออฟไลน์
├── src/
│   ├── components/
│   │   ├── Bookshelf.tsx          # ชั้นหนังสือ ลากวางไฟล์ PDF และแสดงรายการเล่ม
│   │   ├── FlipBookViewer.tsx     # ตัวอ่านหนังสือ 3 มิติ สมจริง พร้อมเสียงและการควบคุม
│   │   ├── ZoomModal.tsx          # โหมดขยายภาพความละเอียดสูง
│   │   ├── PageThumbnailsModal.tsx# สารบัญภาพทุกหน้า
│   │   └── InstallGuideModal.tsx  # ป๊อปอัปแนะนำการติดตั้งบน iPhone 15 Pro Max
│   ├── services/
│   │   ├── pdfService.ts          # ตัวเรนเดอร์หน้า PDF ด้วย PDF.js
│   │   ├── soundService.ts        # สังเคราะห์เสียงกระดาษพลิกด้วย Web Audio API
│   │   ├── storageService.ts      # ระบบจัดเก็บหนังสือออฟไลน์ด้วย IndexedDB
│   │   └── sampleBook.ts          # เล่มตัวอย่างและคู่มือเริ่มต้นใช้งาน
│   ├── types/
│   │   ├── book.ts                # TypeScript Interfaces
│   │   └── page-flip.d.ts         # Type Definitions สำหรับ 3D PageFlip
│   ├── App.tsx                    # Main App Router
│   ├── index.css                  # สไตล์ Tailwind CSS v4 & Safe Area iOS
│   └── main.tsx                   # จุดเริ่มต้นแอปพลิเคชัน
└── package.json
```
