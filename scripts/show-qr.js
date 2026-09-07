import os from 'os';
import qrcode from 'qrcode-terminal';

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const port = 5173;
const url = `http://${localIp}:${port}`;

console.log('\n======================================================');
console.log('📱 เปิดแอปบน iPhone 15 Pro Max ของคุณ');
console.log('======================================================');
console.log(`URL: \x1b[36m${url}\x1b[0m`);
console.log('\nสแกน QR Code ด้านล่างนี้ด้วยกล้อง iPhone เพื่อเปิดทันที:\n');

qrcode.generate(url, { small: true });

console.log('======================================================\n');
