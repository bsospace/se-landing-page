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

## วิธีรันโปรเจกต์ (Production)

ใช้ HTTP server ที่รองรับ static files เช่น Nginx, Apache, หรือบริการ hosting ต่างๆ (Netlify, Vercel, GitHub Pages ฯลฯ)

ชี้ไปที่โฟลเดอร์โปรเจกต์นี้เป็น root directory ของเว็บ
ขั้นตอนการ setup ของ nginx ตัวอย่าง:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/se-landing-page;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

## Deploy Checklist

ก่อน deploy แนะนำให้เช็กอย่างน้อย:

1. รัน `node scripts/generate-hero-images.mjs` (อัปเดต hero manifest)
2. รัน `node scripts/sync-seo-geo.mjs` เพื่ออัปเดตวันที่ SEO/GEO ทุกไฟล์ที่เกี่ยวข้อง
3. ถ้าแก้ UI/Tailwind ให้ build `style.min.css` ใหม่
4. ทดสอบเปิดเว็บผ่าน HTTP server และเช็กว่า section ที่โหลดข้อมูล (`Timeline`, `Partners`, `FAQ`, `Portal` ฯลฯ) แสดงครบ

ตัวเลือกใน CI (กันลืมอัปเดต hero manifest):

```bash
node scripts/generate-hero-images.mjs
node scripts/sync-seo-geo.mjs
git diff --exit-code data/hero-images.json
```

---

## SEO / GEO Maintenance

โปรเจกต์นี้เพิ่ม Technical SEO + GEO (AI discoverability) ไว้แล้ว โดยไม่เปลี่ยนพฤติกรรมโหลดข้อมูลเดิม

ไฟล์ที่เกี่ยวข้องโดยตรง:

- `index.html` (meta tags, canonical/hreflang, Open Graph, Twitter card, JSON-LD)
- `robots.txt` (crawl policy + sitemap discovery)
- `_headers` (security headers ที่ไม่ขัด crawl/index/render)
- `sitemap.xml` (single-page sitemap)
- `llms.txt`, `llms-full.txt` (เอกสารสำหรับ AI ingestion)

### Structured Data ที่ใช้งานอยู่

หน้า `index.html` มี JSON-LD graph ที่ประกอบด้วย:

- `WebSite`
- `CollegeOrUniversity`
- `Course`
- `FAQPage`

ข้อมูล FAQ และช่องทางติดต่อใน JSON-LD ถูกสร้างจากไฟล์:

- `data/faq.json`
- `data/contact.json`

ข้อมูลคำอธิบายหลักสูตรใน JSON-LD ถูกใช้จาก:

- `data/program-overview.json`

### เมื่อข้อมูลเปลี่ยน ต้องแก้ตรงไหน

1. เปลี่ยนข้อมูลรับสมัคร: แก้ `data/admission.json` และ `data/admission-timeline.json`
2. เปลี่ยนรายละเอียดหลักสูตร: แก้ `data/program-overview.json`
3. เปลี่ยน FAQ: แก้ `data/faq.json` (จะสะท้อนใน FAQPage schema อัตโนมัติ)
4. เปลี่ยนช่องทางติดต่อ/โซเชียล: แก้ `data/contact.json` (จะสะท้อนใน `sameAs`/`contactPoint`)
5. รันสคริปต์ sync freshness:

```bash
node scripts/sync-seo-geo.mjs
```

ถ้าต้องการระบุวันที่เอง:

```bash
node scripts/sync-seo-geo.mjs 2026-04-02
```

### วิธี Validate ซ้ำ (แนะนำทุกครั้งก่อน deploy)

1. เปิดหน้าเว็บจริง (production URL) ใน Rich Results Test
    - https://search.google.com/test/rich-results
    - ต้องเห็น entity หลัก (อย่างน้อย FAQPage และ schema อื่นที่รองรับ)
2. ตรวจ Schema ทั้งหมดด้วย Schema Markup Validator
    - https://validator.schema.org/
    - ต้องไม่มี error ระดับโครงสร้าง
3. รัน Lighthouse SEO
    - Chrome DevTools > Lighthouse > SEO
    - ตรวจ canonical, meta description, crawlability, status code
4. ตรวจ robots + sitemap
    - `https://se.informatics.buu.ac.th/robots.txt`
    - `https://se.informatics.buu.ac.th/sitemap.xml`

### ข้อควรระวังเรื่องความสอดคล้องของข้อมูล

- ห้ามให้ข้อความบนหน้าเว็บขัดกับข้อมูลใน `data/*.json`
- ห้ามให้ JSON-LD ขัดกับข้อมูลที่แสดงจริงบนหน้า (เช่น จำนวนหน่วยกิต, ชื่อหลักสูตร, รอบรับสมัคร)
- หลีกเลี่ยงการใส่ property schema ที่ไม่มีข้อมูลจริง
- ถ้าข้อมูลไม่พอ ให้ระบุ TODO ชัดเจนแทนการเดา

### TODO ข้อมูลที่ควรเพิ่มในอนาคต (เพื่อยกระดับ schema)

1. เพิ่ม URL เอกสารหลักสูตรจริงใน `data/program-overview.json` > `curriculumDocuments[].url`
2. เพิ่มช่องทางอีเมล/โทรศัพท์ทางการใน `data/contact.json` เพื่อทำ `ContactPoint` ที่สมบูรณ์ขึ้น
3. หากมีโลโก้ทางการหลายขนาด ให้เพิ่มไฟล์ภาพสำหรับ social sharing โดยเฉพาะ (เช่น 1200x630)

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

## ถ้าจะเอาไปใช้ต่อ?

สามารถ fork โปรเจกต์นี้แล้วแก้ไขตามความต้องการ

---
made with ❤️ by BSO Space | SE#12
