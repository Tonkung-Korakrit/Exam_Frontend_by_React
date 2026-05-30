# E-Commerce Project (Frontend)
ระบบหน้าร้านค้าออนไลน์ที่พัฒนาด้วย React และ TypeScript เชื่อมต่อกับ Django Backend พร้อมระบบจัดการตะกร้าสินค้าและประวัติการสั่งซื้อ

## Tech Stack
- **Framework**: React (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **API**: Backend (Python)

## Getting Started

### 1. Prerequisites
ตรวจสอบให้แน่ใจว่าคุณได้ติดตั้ง Node.js (v18+) และ npm/yarn เรียบร้อยแล้ว

### 2. Installation
ติดตั้ง Dependencies ที่จำเป็น:
```bash
npm install
# หรือ
yarn install
```

### การติดตั้ง Tailwind CSS
รันคำสั่งเพื่อติดตั้ง Tailwind และเครื่องมือที่เกี่ยวข้อง:

```bash
npm install -D tailwindcss@^3 postcss autoprefixer
npx tailwindcss init -p
```

### ตั้งค่า Tailwind Config
เปิดไฟล์ `tailwind.config.js` แล้วแก้ไขค่า `content` ให้ครอบคลุมไฟล์ในโปรเจกต์ของคุณ:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### เพิ่ม Tailwind Directives ใน CSS
เปิดไฟล์ src/index.css (หรือไฟล์ CSS หลักของคุณ) แล้วลบเนื้อหาเก่าทิ้งทั้งหมด จากนั้นเพิ่มบรรทัดเหล่านี้ลงไป:

```bash
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 3. Environment Configuration
สร้างไฟล์ .env ใน Root directory ของโปรเจกต์ และระบุ URL ของ Backend:
```bash
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Running the Development Server
เริ่มการทำงานของเซิร์ฟเวอร์ในโหมดพัฒนา:
```bash
npm run dev
# หรือ
yarn dev
```
(เข้าใช้งานผ่านเบราว์เซอร์ที่: http://localhost:5173)

## Folder Structure
โครงสร้างของโปรเจกต์ถูกจัดระเบียบตามหน้าที่การทำงานดังนี้:

```text
src/
├── components/     # UI Components (Layout, Navbar, etc.)
├── pages/          # Page Definitions (Auth, Buyer, Seller)
├── types/          # TypeScript Interfaces (Product, Cart, User)
├── utils/          # API Instances (Axios Config, Interceptors)
└── App.tsx         # Main Routing Configuration
```

## Key Features
- Authentication: ระบบเข้าสู่ระบบ และสมัครสมาชิก
- Product Shop: ระบบเลือกซื้อสินค้าพร้อมตัวกรอง (Search, Min/Max Price, Sorting)
- Cart System: เพิ่ม-ลดสินค้าในตะกร้าแบบ Real-time (Sync กับ Backend)
- Payment : ระบบจำลองการชำระเงิน
- Order History: ระบบประวัติการสั่งซื้อย้อนหลัง

## Notes
- ตรวจสอบให้แน่ใจว่า Django Backend กำลังรันอยู่ที่พอร์ต 8000
- หากมีการเปลี่ยนแปลงฐานข้อมูลหรือโครงสร้าง API โปรดอัปเดต .env ให้สอดคล้องกัน