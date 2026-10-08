# ลดส่วนเกินเทียบ RegisterBasic

ใช้ /Users/smo/Downloads/MoblieApp-main-2/RegisterBasic เป็นตัวอย่างโครงสร้างและรูปแบบ ไม่ถือว่าไฟล์ตัวอย่างครอบคลุมทุกหัวข้อที่อาจารย์เคยสอน

## รูปแบบที่มีในตัวอย่างและใช้ต่อ

- แยก screens components styles db utils
- useState และฟังก์ชัน async/await
- SQLiteProvider/useSQLiteContext
- SQL ตรงผ่าน execAsync/runAsync/getAllAsync/getFirstAsync และ parameter ?
- ปุ่ม input รายการ และ Alert ยืนยัน/แจ้งข้อผิดพลาด

## สิ่งที่นำออก

- tests/ และ npm test ในชุดงาน
- orderDb/reportDb เดิมที่ไม่มีหน้าจอเรียกใช้
- ฟังก์ชันอ่าน/เขียนแบบเก่าที่ซ้ำกับ screenDb ใน tableDb/menuDb/kitchenDb/billDb/restaurantDb
- seed บิล รอบ รายการ ชำระเงิน ย้ายโต๊ะตัวอย่าง และ seedData ตัวรวมที่ไม่ถูกเรียก
- BillDetailModal/ReportCard และ styles ที่ไม่ถูกใช้
- ช่องนับเงินสดและคำนวณส่วนต่างที่เพิ่มนอกโจทย์
- Suspense/useSuspense ที่โครงสร้างเริ่มต้น เปลี่ยนเป็น SQLiteProvider แบบตัวอย่าง
- WeakMap ใน transaction เปลี่ยนเป็นคิว Promise ร่วม เนื่องจากแอปมี SQLiteProvider connection เดียว

## สิ่งที่ยังต้องมี

โจทย์ร้านอาหารซับซ้อนกว่าฟอร์มลงทะเบียน จึงเก็บตารางสัมพันธ์ indexes SQL SUM snapshot ราคา transaction FIFO หลายรอบ และการปิดบิลไว้

เปลี่ยนมาใช้ useState เลือกหน้าใน App.js ตามคำขอของผู้ใช้ คล้ายตัวอย่างเรียน ใช้ NavigationContext ส่งคำสั่งเปิดหน้าและรหัสบิลหรือรอบ ปุ่มย้อนกลับใช้ประวัติหน้าที่เปิด

CartContext และ hooks ยังใช้เพื่อให้ตะกร้า/สถานะทำงานข้ามหน้าจอ และป้องกันกดส่งหรือรับชำระซ้ำ ไม่เพิ่มระบบบัญชี crypto หรือ SecureStore จากตัวอย่าง เพราะโจทย์นี้ไม่ต้องใช้

## ตรวจสอบ

หลังแก้ lint/typecheck ผ่าน และตรวจฐานข้อมูลจากสำเนาชุดทดสอบสำรองนอกโฟลเดอร์งานครบ 7 ชุด การตรวจนี้ไม่ใช่คำสั่ง npm test ของโปรเจกต์ปัจจุบัน

สำรองโค้ดก่อนตัดที่ /tmp/restaurant-before-simplify/source-backup.tar.gz เป็นสำรองชั่วคราวของเครื่อง ไม่ใช่ไฟล์ส่งงานหรือข้อมูล SQLite ของผู้ใช้

ยังต้องทดสอบ flow ลูกค้า → สั่ง 3 รอบ → ครัวทำ/เสิร์ฟ → ย้ายโต๊ะ → ชำระ/ปิดบิล → รายงาน → reset บนอุปกรณ์จริง
