// Built-in Demo Book for instantaneous testing & onboarding guide

export function generateSampleBookPages(): string[] {
  const width = 800;
  const height = 1130;
  const pages: string[] = [];

  const createPage = (drawFn: (ctx: CanvasRenderingContext2D) => void): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    // Base background (Warm paper texture tone)
    ctx.fillStyle = '#faf8f5';
    ctx.fillRect(0, 0, width, height);

    // Subtle paper edge border
    ctx.strokeStyle = '#e2ded5';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, width - 40, height - 40);

    drawFn(ctx);

    return canvas.toDataURL('image/jpeg', 0.9);
  };

  // --- Page 1: Elegant Book Cover ---
  pages.push(
    createPage((ctx) => {
      // Deep elegant cover gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#312e81');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, width - 80, height - 80);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.strokeRect(48, 48, width - 96, height - 96);

      // Decorative corner accents
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      };
      drawCorner(48, 48);
      drawCorner(width - 48, 48);
      drawCorner(48, height - 48);
      drawCorner(width - 48, height - 48);

      // Badge
      ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 140, 180, 280, 44, 22);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ สัมผัสประสบการณ์ใหม่', width / 2, 209);

      // Main Title
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 62px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('FlipBook 3D', width / 2, 330);

      // Subtitle
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('คู่มือการใช้งานบน iPhone 15 Pro Max', width / 2, 385);

      // Center Graphic: Book Icon
      ctx.fillStyle = '#6366f1';
      ctx.beginPath();
      ctx.arc(width / 2, 570, 90, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '80px sans-serif';
      ctx.fillText('📖', width / 2, 600);

      // Description text
      ctx.fillStyle = '#94a3b8';
      ctx.font = '22px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('แปลงไฟล์ PDF ทุกชนิดให้เป็นเล่มหนังสือเสมือนจริง', width / 2, 730);
      ctx.fillText('เปิดอ่านได้ทุกที่อย่างลื่นไหล 3D Flip & Sound', width / 2, 770);

      // Footer
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('👉 ปัดนิ้วไปทางซ้ายเพื่อเริ่มอ่าน 👈', width / 2, 980);
    })
  );

  // --- Page 2: Welcome & Concept ---
  pages.push(
    createPage((ctx) => {
      // Header
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('บทนำ : อ่านหนังสืออย่างมีชีวิตชีวา', 80, 120);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('PAGE 01', width - 160, 120);

      // Divider
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 145);
      ctx.lineTo(width - 80, 145);
      ctx.stroke();

      // Body text
      ctx.fillStyle = '#1e293b';
      ctx.font = '24px/1.8 -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      const lines = [
        'ยินดีต้อนรับสู่ FlipBook 3D Reader แอปพลิเคชันที่สร้างขึ้นมาเพื่อ',
        'ยกระดับการอ่านไฟล์ PDF ให้เหมือนกับการเปิดอ่านหนังสือกระดาษจริง',
        'อย่างแท้จริง ไม่ว่าจะเป็นนิยาย การ์ตูน เอกสารการเรียน หรือคู่มือการทำงาน',
        '',
        '✨ จุดเด่นที่ถูกออกแบบมาเป็นพิเศษ :',
        '• Realistic 3D Page Turn : สัมผัสการงอและพลิกหน้ากระดาษสมจริง',
        '• Binaural Paper Sound : เสียงพลิกกระดาษแบบอะคูสติกทุกครั้งที่เปิดหน้า',
        '• Responsive Layout : รองรับหน้าเดี่ยว (Portrait) บน iPhone 15 Pro Max',
        '  และหน้าคู่ (Double Spread) ในแนวนอนหรือบนแท็บเล็ต/เดสก์ท็อป',
        '• Offline First : บันทึกเอกสารไว้ในเครื่อง อ่านได้แม้ไม่มีสัญญาณเน็ต',
        '• Zero Upload Delay : ประมวลผลโดยตรงในเครื่อง ไม่ส่งข้อมูลออกนอกเครื่อง',
      ];

      let y = 220;
      for (const line of lines) {
        if (line.startsWith('✨')) {
          ctx.fillStyle = '#4f46e5';
          ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        } else if (line.startsWith('•')) {
          ctx.fillStyle = '#0f172a';
          ctx.font = '600 23px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        } else {
          ctx.fillStyle = '#334155';
          ctx.font = '23px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        }
        ctx.fillText(line, 80, y);
        y += 42;
      }

      // Feature box
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(80, 780, width - 160, 180, 16);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('💡 เคล็ดลับการควบคุม', 110, 830);
      ctx.fillStyle = '#475569';
      ctx.font = '21px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('คุณสามารถลากที่ "มุมกระดาษ" เพื่อม้วนดูหน้าถัดไปทีละนิด หรือ', 110, 875);
      ctx.fillText('แตะที่บริเวณขอบซ้าย/ขวา เพื่อเปิดหน้าอย่างรวดเร็วได้ทันที', 110, 915);
    })
  );

  // --- Page 3: iPhone 15 Pro Max Optimization ---
  pages.push(
    createPage((ctx) => {
      // Header
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('การติดตั้งบน iPhone 15 Pro Max', 80, 120);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('PAGE 02', width - 160, 120);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 145);
      ctx.lineTo(width - 80, 145);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = '23px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('เปลี่ยนเว็บนี้ให้เป็นแอปพลิเคชันเต็มรูปแบบบนหน้าจอโฮมของคุณ :', 80, 200);

      const steps = [
        {
          num: '1',
          title: 'เปิดลิงก์ใน Safari บน iPhone 15 Pro Max',
          desc: 'เปิดเว็บแอปพลิเคชันนี้ผ่านเบราว์เซอร์ Safari บนมือถือของคุณ',
        },
        {
          num: '2',
          title: 'แตะปุ่ม "แชร์" (Share Sheet Icon)',
          desc: 'ไอคอนรูปสี่เหลี่ยมที่มีลูกศรชี้ขึ้น บริเวณแถบเมนูด้านล่างของ Safari',
        },
        {
          num: '3',
          title: 'เลือก "เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)',
          desc: 'เลื่อนลงมาและกดเลือกเมนู Add to Home Screen แล้วกดยืนยัน',
        },
        {
          num: '4',
          title: 'เปิดใช้งานเหมือนแอปจริงแบบ Native!',
          desc: 'ไอคอน FlipBook จะปรากฏบนหน้าจอโฮม แสดงผลเต็มหน้าจอไร้แถบ URL',
        },
      ];

      let stepY = 260;
      for (const step of steps) {
        // Step number circle
        ctx.fillStyle = '#4f46e5';
        ctx.beginPath();
        ctx.arc(110, stepY + 30, 26, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(step.num, 110, stepY + 38);

        // Step text
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        ctx.fillText(step.title, 160, stepY + 22);

        ctx.fillStyle = '#64748b';
        ctx.font = '21px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        ctx.fillText(step.desc, 160, stepY + 58);

        stepY += 120;
      }

      // Safe area banner
      ctx.fillStyle = '#eff6ff';
      ctx.beginPath();
      ctx.roundRect(80, 780, width - 160, 180, 16);
      ctx.fill();
      ctx.strokeStyle = '#bfdbfe';
      ctx.stroke();

      ctx.fillStyle = '#1e40af';
      ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('📱 ออกแบบเฉพาะสำหรับ Dynamic Island', 110, 830);
      ctx.fillStyle = '#3b82f6';
      ctx.font = '21px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('แอปได้รับการปรับแต่งรองรับ Safe Area ของ iPhone 15 Pro Max', 110, 875);
      ctx.fillText('ทั้งหน้าจอ 6.7 นิ้ว และเว้นขอบกล้องอย่างพอดีตา', 110, 915);
    })
  );

  // --- Page 4: Gestures & Feature Tour ---
  pages.push(
    createPage((ctx) => {
      // Header
      ctx.fillStyle = '#4338ca';
      ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('ฟังก์ชันและความสามารถครบครัน', 80, 120);

      ctx.fillStyle = '#64748b';
      ctx.font = '20px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('PAGE 03', width - 160, 120);

      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(80, 145);
      ctx.lineTo(width - 80, 145);
      ctx.stroke();

      const features = [
        {
          icon: '📑',
          title: 'แถบเลื่อนหน้ารวดเร็ว (Page Scrubber)',
          desc: 'เลื่อนแถบด้านล่างเพื่อกระโดดข้ามไปยังหน้าใดก็ได้ในทันที พร้อมตัวเลขบอกหน้าชัดเจน',
        },
        {
          icon: '🔍',
          title: 'โหมดซูมรายละเอียด (High-Res Zoom)',
          desc: 'หากตัวหนังสือมีขนาดเล็ก สามารถกดขยายดูรายละเอียดได้อย่างคมชัดระดับ Retina',
        },
        {
          icon: '🔊',
          title: 'ปุ่มเปิด/ปิดเสียงกระดาษ (Sound Toggle)',
          desc: 'เปิดเสียงกระดาษเพื่ออรรถรส หรือปิดเสียงเพื่ออ่านหนังสือในที่เงียบสงบได้ง่ายๆ',
        },
        {
          icon: '💾',
          title: 'จดจำหน้าล่าสุดอัตโนมัติ (Auto Resume)',
          desc: 'แอปจะจำหน้าที่คุณอ่านค้างไว้ เมื่อเปิดกลับมาจะเปิดที่หน้านั้นให้ทันที ไม่ต้องค้นหาใหม่',
        },
      ];

      let featY = 200;
      for (const feat of features) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(80, featY, width - 160, 140, 16);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.stroke();

        ctx.font = '48px sans-serif';
        ctx.fillText(feat.icon, 110, featY + 85);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        ctx.fillText(feat.title, 190, featY + 50);

        ctx.fillStyle = '#64748b';
        ctx.font = '20px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
        ctx.fillText(feat.desc.substring(0, 48), 190, featY + 85);
        if (feat.desc.length > 48) {
          ctx.fillText(feat.desc.substring(48), 190, featY + 115);
        }

        featY += 165;
      }

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✨ พร้อมใช้งานทั้งไฟล์ภาษาไทยและภาษาอังกฤษ ✨', width / 2, 950);
    })
  );

  // --- Page 5: Back Cover ---
  pages.push(
    createPage((ctx) => {
      // Cover gradient back
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Gold border
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.strokeRect(40, 40, width - 80, height - 80);

      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('เริ่มต้นเพิ่มหนังสือของคุณ', width / 2, 360);

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 48px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('ลากไฟล์ PDF มาวางที่นี่', width / 2, 440);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '24px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('หรือกดปุ่มเลือกไฟล์จากแอป Files บน iPhone ได้ทันที', width / 2, 510);

      // Barcode / Edition decorative graphic
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 160, 680, 320, 80, 8);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('FLIPBOOK-PRO-MAX-2026', width / 2, 725);

      ctx.fillStyle = '#64748b';
      ctx.font = '18px -apple-system, BlinkMacSystemFont, "Sarabun", sans-serif';
      ctx.fillText('พัฒนาเพื่อการอ่านที่สมบูรณ์แบบบน iPhone 15 Pro Max', width / 2, 880);
    })
  );

  return pages;
}
