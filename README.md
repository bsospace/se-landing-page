# SE Landing Page

เว็บ Landing Page แบบ Static สำหรับสาขา Software Engineering BUU

## แหล่งข้อมูลรูป Hero Carousel (เหมาะกับ Production)

Hero carousel จะอ่านรายการรูปจากไฟล์:

- `data/hero-images.json`

วิธีนี้ช่วยหลีกเลี่ยงการพึ่งพา directory listing ของเซิร์ฟเวอร์ (ซึ่งใน production มักปิดไว้)

## วิธีสร้างรายการรูปจาก `images/` (รวมโฟลเดอร์ย่อย)

รันที่ root ของโปรเจกต์:

```bash
node scripts/generate-hero-images.mjs
```

สิ่งที่สคริปต์ทำ:

- สแกนโฟลเดอร์ `images/` แบบ recursive
- รวมไฟล์นามสกุล: `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.svg`, `.avif`
- เรียงลำดับและเขียนผลลัพธ์ลง `data/hero-images.json`

## วิธีดูแลเมื่อมีการเพิ่ม/ลบรูป Hero

เมื่อเพิ่มหรือลบรูปสำหรับ Hero carousel:

1. วางไฟล์รูปใน `images/` หรือโฟลเดอร์ย่อยภายใน
2. รันคำสั่ง:
   ```bash
   node scripts/generate-hero-images.mjs
   ```
3. ตรวจสอบว่า `data/hero-images.json` อัปเดตถูกต้อง
4. Commit ทั้งไฟล์รูปและไฟล์ JSON ที่อัปเดตแล้ว

## ขั้นตอน Deploy

ก่อน deploy (หรือในขั้นตอน CI/CD) ให้รัน:

```bash
node scripts/generate-hero-images.mjs
```

จากนั้น deploy ไฟล์เว็บตามปกติ

### คำแนะนำสำหรับ CI

เพิ่มขั้นตอนใน pipeline เพื่อให้ manifest อัปเดตเสมอ:

```bash
node scripts/generate-hero-images.mjs
```

ตัวเลือกเสริม: ให้ CI fail ถ้าลืมอัปเดต manifest

```bash
git diff --exit-code data/hero-images.json
```

## หมายเหตุ

- ใน `index.html` จะพยายามโหลดจาก `data/hero-images.json` ก่อน
- หาก `data/hero-images.json` ว่างหรือโหลดไม่ได้ Hero carousel จะไม่สลับรูปอัตโนมัติ

## คำอธิบายไฟล์ในโฟลเดอร์ `data/`

- `data/admission.json`:
   ใช้เก็บข้อมูลการรับสมัคร (รอบ, คำอธิบาย, ช่วงเวลา, สถานะ) และลิงก์ปุ่มดูข้อมูลเพิ่มเติม

- `data/contact.json`:
   ใช้เก็บข้อมูลติดต่อในส่วน Footer เช่น อีเมล เบอร์โทร ที่อยู่ หรือโซเชียลลิงก์

- `data/faq.json`:
   ใช้เก็บคำถามที่พบบ่อย (FAQ) สำหรับ section คำถาม-คำตอบ

- `data/future-work.json`:
   ใช้เก็บรายการงาน/สายงานในอนาคต พร้อม `icon`, `title`, `description`

- `data/hero-images.json`:
   ใช้เก็บรายการ path ของรูป Hero carousel ที่ต้องการแสดงบนหน้าแรก

- `data/portal.json`:
   ใช้เก็บข้อมูลการ์ดระบบสารสนเทศ (ชื่อระบบ, คำอธิบาย, ลิงก์, ไอคอน, ธีมสี)

- `data/quick-links.json`:
   ใช้เก็บลิงก์ด่วนใน Footer

- `data/tech-stack.json`:
   ใช้เก็บข้อมูลส่วน Development Tech Stack เช่น badges และ highlights ของเทคโนโลยี

- `data/timeline.json`:
   ใช้เก็บข้อมูล Study Timeline รายปี รวมถึงรายละเอียดและรูปประกอบของแต่ละช่วง

- `data/usp.json`:
   ใช้เก็บข้อมูลจุดเด่นหลักสูตร (Unique Selling Points) ที่แสดงเป็นการ์ดบนหน้าเว็บ
