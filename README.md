# SE Landing Page

เว็บ Landing Page แบบ Static สำหรับสาขา Software Engineering BUU

หน้าเว็บหลักอยู่ที่ `index.html` และโหลดข้อมูลคอนเทนต์จากไฟล์ JSON/Markdown ในโฟลเดอร์ `data/`

---

## โครงสร้างโปรเจกต์ (ปัจจุบัน)

```text
.
├── index.html                  # หน้าเว็บหลัก
├── input.css                   # Tailwind input (@tailwind base/components/utilities)
├── style.min.css               # CSS ที่ build แล้ว (ไฟล์ที่หน้าเว็บใช้งานจริง)
├── tailwind.config.js          # Tailwind config (scan index.html + data/*.json)
├── scripts/
│   └── generate-hero-images.mjs
├── images/                     # รูปทั่วไป (เช่น hero, timeline photos)
└── data/
    ├── admission.json
    ├── contact.json
    ├── faq.json
    ├── future-work.json
    ├── hero-images.json
    ├── partners.json
    ├── partners/               # โลโก้พาร์ทเนอร์
    ├── portal.json
    ├── quick-links.json
    ├── tech-stack.json
    ├── timeline.json
    ├── timeline/               # เนื้อหา markdown รายปี (year-1.md ... year-4.md)
    └── usp.json
```

---

## วิธีรันโปรเจกต์ (Local)

> ควรเปิดผ่าน HTTP server (ไม่ใช่ `file://`) เพราะมีการ `fetch()` ข้อมูลจาก `data/*.json` และ `data/timeline/*.md`

ตัวอย่าง:

```bash
cd /path/to/se-landing-page
python3 -m http.server 5500
```

แล้วเปิด `http://localhost:5500`

---

## แหล่งข้อมูลที่หน้าเว็บโหลดจริง

ใน `index.html` มีการโหลดข้อมูลผ่าน `fetch` จากไฟล์เหล่านี้:

- `data/usp.json`
- `data/admission.json`
- `data/timeline.json`
- `data/tech-stack.json`
- `data/portal.json`
- `data/quick-links.json`
- `data/contact.json`
- `data/faq.json`
- `data/future-work.json`
- `data/partners.json`
- `data/hero-images.json`

### หมายเหตุ Timeline

- `data/timeline.json` เป็น metadata ของแต่ละปี (`year`, `title`, `contentFile`, `images`, `imageAlt`)
- เนื้อหาหลักของแต่ละปีอยู่ใน `data/timeline/year-*.md`
- รูปใน Timeline ใช้จาก `images` array ของแต่ละ item ใน `timeline.json`

---

## Workflow: Hero Carousel

Hero carousel อ่านรายการรูปจาก `data/hero-images.json` เพื่อรองรับ production ที่มักไม่เปิด directory listing

เมื่อมีการเพิ่ม/ลบรูปใน `images/`:

```bash
node scripts/generate-hero-images.mjs
```

สคริปต์จะ:

- สแกน `images/` แบบ recursive
- รวมไฟล์นามสกุล `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.avif`
- เขียนรายการลง `data/hero-images.json`

แนะนำให้ commit ทั้งไฟล์รูปและ `data/hero-images.json` พร้อมกัน

---

## Workflow: Partners Logos

พาร์ทเนอร์ใช้งานข้อมูลจาก `data/partners.json` และรูปโลโก้ใน `data/partners/`

ตัวอย่าง item:

```json
{ "name": "ชื่อองค์กร", "logo": "./data/partners/your-logo.png" }
```

ขั้นตอนเพิ่มพาร์ทเนอร์:

1. วางไฟล์โลโก้ใน `data/partners/`
2. เพิ่ม/แก้รายการใน `data/partners.json`
3. รีเฟรชหน้าเว็บตรวจสอบการแสดงผล

---

## Workflow: Timeline Markdown

แก้เนื้อหา Timeline รายปีได้ที่ `data/timeline/year-1.md` ถึง `year-4.md`

แนวทาง:

- ใช้ Markdown มาตรฐาน (`##`, รายการ `-`, `**ตัวหนา**`)
- ถ้าจะเพิ่มปีใหม่ ให้เพิ่ม item ใน `data/timeline.json`
- `contentFile` ต้องชี้ไปไฟล์ `.md` ที่ถูกต้อง

---

## Workflow: Tailwind CSS

ไฟล์ที่หน้าเว็บใช้งานคือ `style.min.css` (ลิงก์จาก `index.html`)

ถ้ามีการแก้ class หรือโครงหน้าเว็บ แล้วต้องการ build CSS ใหม่:

```bash
npx tailwindcss@3.4.17 -i ./input.css -o ./style.min.css --minify
```

โหมด watch ระหว่างพัฒนา:

```bash
npx tailwindcss@3.4.17 -i ./input.css -o ./style.min.css --watch
```

> หมายเหตุ: โปรเจกต์นี้ใช้รูปแบบ config/input แบบ Tailwind v3 (`input.css` + `tailwind.config.js`) จึงแนะนำให้ pin เป็น `tailwindcss@3.4.17`

---

## Deploy Checklist

ก่อน deploy แนะนำให้เช็กอย่างน้อย:

1. รัน `node scripts/generate-hero-images.mjs` (อัปเดต hero manifest)
2. ถ้าแก้ UI/Tailwind ให้ build `style.min.css` ใหม่
3. ทดสอบเปิดเว็บผ่าน HTTP server และเช็กว่า section ที่โหลดข้อมูล (`Timeline`, `Partners`, `FAQ`, `Portal` ฯลฯ) แสดงครบ

ตัวเลือกใน CI (กันลืมอัปเดต hero manifest):

```bash
node scripts/generate-hero-images.mjs
git diff --exit-code data/hero-images.json
```
