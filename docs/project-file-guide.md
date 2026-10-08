# คู่มือทุกโฟลเดอร์และไฟล์ Restaurant

อ้างอิงไฟล์ในเครื่อง /Users/smo/Restaurant การแก้ Screens ล่าสุดยังอยู่ในเครื่องและไม่ได้ push ตามคำขอให้ยกเว้น Screens

## การทำงานร่วมกัน

package.json → index.js → App.js → Screen ใน src/screens → components แสดงผล และ screenDb อ่าน/เขียน SQLite

CartContext เก็บของที่ยังไม่ส่ง เมื่อส่งแล้ว submitOrder บันทึก order_rounds/order_items ครัวอัปเดตสถานะ ลูกค้าดูรายการ ผู้ดูแล settleBill รับชำระและปิดบิล และรายงานอ่านบิลที่ปิดแล้ว

billId คือรหัสบิล roundId คือรหัสรอบสั่ง ไม่ใช่เลขโต๊ะ ทุกบทบาทใช้ฐานข้อมูลเดียวกันบนอุปกรณ์เดียว ไม่ได้ซิงก์ข้ามเครื่อง

## ความหมายของโฟลเดอร์

| โฟลเดอร์ | หน้าที่ |
|---|---|
| assets | รูปภาพของตัวแอป |
| src | source code ของแอป |
| src/screens | โค้ดหน้าจอจริง; customer/kitchen/admin แยกหน้าที่ตามบทบาท |
| src/components | UI ใช้ซ้ำ; common ใช้ทุกส่วน customer/kitchen/admin ใช้ตามบทบาท |
| src/db | SQL และกติกาฐานข้อมูล |
| src/db/seed | ข้อมูลตั้งต้นโต๊ะ หมวด เมนู ราคา ไม่มีข้อมูลขายตัวอย่าง |
| src/context | state ร่วมของตะกร้า และส่งคำสั่งเปลี่ยนหน้าจาก App.js |
| src/hooks | logic โหลด/ทำรายการที่ใช้ซ้ำ |
| src/styles | รูปแบบและ theme กลาง |
| src/utils | ฟังก์ชันช่วยและค่าคงที่ |
| docs | เอกสารอธิบายงาน |
| .claude | ตั้งค่าเครื่องมือ coding agent |

## ทุกไฟล์ที่ทีมดูแล



### ระดับโปรเจกต์

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [package.json](/Users/smo/Restaurant/package.json) | dependencies และคำสั่ง npm; main เป็น index.js ซึ่งเป็นจุดเริ่มต้นจริง |
| [package-lock.json](/Users/smo/Restaurant/package-lock.json) | ล็อกเวอร์ชัน dependencies ให้สมาชิกติดตั้งชุดเดียวกัน |
| [app.json](/Users/smo/Restaurant/app.json) | ชื่อแอป icon แนวหน้าจอ scheme และ Expo plugins |
| [App.js](/Users/smo/Restaurant/App.js) | ใช้ useState เลือกหน้า เก็บประวัติย้อนกลับ และครอบ SQLiteProvider กับ CartProvider |
| [index.js](/Users/smo/Restaurant/index.js) | ใช้ registerRootComponent เปิด App.js |
| [metro.config.js](/Users/smo/Restaurant/metro.config.js) | ใช้ Metro config ของ Expo เพื่อสร้าง bundle |
| [eslint.config.js](/Users/smo/Restaurant/eslint.config.js) | กฎ lint ของ Expo ตรวจโค้ด |
| [.prettierrc.json](/Users/smo/Restaurant/.prettierrc.json) | รูปแบบโค้ด ย่อหน้า 2 ช่อง แยก JSX props ทีละบรรทัด |
| [.prettierignore](/Users/smo/Restaurant/.prettierignore) | ไฟล์ที่ formatter ไม่ต้องจัดรูปแบบ |
| [.gitignore](/Users/smo/Restaurant/.gitignore) | รายการที่ Git ไม่ติดตาม เช่น node_modules .expo; ไม่ได้ยกเว้น src/screens |
| [schema.sql](/Users/smo/Restaurant/schema.sql) | SQL schema สำหรับอ่านและทดสอบ แอปสร้างตารางจาก initDb ไม่อ่านไฟล์นี้ตอนรัน |
| [README.md](/Users/smo/Restaurant/README.md) | คู่มือติดตั้ง รัน ทดสอบ สมาชิก และสิ่งส่งงาน |
| [LICENSE](/Users/smo/Restaurant/LICENSE) | ข้อความสิทธิ์ MIT ในโปรเจกต์ |
| [AGENTS.md](/Users/smo/Restaurant/AGENTS.md) | แนวทางสำหรับ coding agent ไม่ใช่ส่วน runtime |
| [CLAUDE.md](/Users/smo/Restaurant/CLAUDE.md) | อ้างอิง AGENTS.md สำหรับเครื่องมือ Claude |

### .claude

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [settings.json](/Users/smo/Restaurant/.claude/settings.json) | ตั้งค่า Expo plugin ของ Claude ไม่ควบคุมแอป |

### assets

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [icon.png](/Users/smo/Restaurant/assets/icon.png) | icon หลักอ้างอิงจาก app.json |
| [favicon.png](/Users/smo/Restaurant/assets/favicon.png) | icon เว็บไซต์อ้างอิงจาก app.json |
| [android-icon-foreground.png](/Users/smo/Restaurant/assets/android-icon-foreground.png) | ด้านหน้า Android adaptive icon |
| [android-icon-background.png](/Users/smo/Restaurant/assets/android-icon-background.png) | พื้นหลัง Android adaptive icon |
| [android-icon-monochrome.png](/Users/smo/Restaurant/assets/android-icon-monochrome.png) | Android icon สีเดียวสำหรับ themed icon |
| [splash-icon.png](/Users/smo/Restaurant/assets/splash-icon.png) | ภาพ splash ที่มีอยู่ แต่ app.json ปัจจุบันไม่อ้างอิงโดยตรง |

### src/screens/customer

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [CTableScreen.js](/Users/smo/Restaurant/src/screens/customer/CTableScreen.js) | คนที่ 1: แสดงโต๊ะ เลือกโต๊ะ เปิดบิลใหม่/เข้าบิลเดิม และส่ง billId ไปเมนู |
| [CMenuScreen.js](/Users/smo/Restaurant/src/screens/customer/CMenuScreen.js) | คนที่ 1: เมนูเปิดขาย กรองหมวด เพิ่มตะกร้า และตรวจบิลยังเปิด |
| [CartScreen.js](/Users/smo/Restaurant/src/screens/customer/CartScreen.js) | คนที่ 1: CartContent ปรับจำนวน หมายเหตุรายเมนู/ร่วม ยอดประมาณการ; CartScreen ส่งออเดอร์รอบเดียว เคลียร์เมื่อสำเร็จและไปสถานะ |
| [COrderScreen.js](/Users/smo/Restaurant/src/screens/customer/COrderScreen.js) | คนที่ 2: ออเดอร์ทุกรอบ กรองสถานะ และติดตามการเปลี่ยนสถานะจากครัว |
| [CBillScreen.js](/Users/smo/Restaurant/src/screens/customer/CBillScreen.js) | คนที่ 2: บิลทุกรอบ จำนวน ราคาตอนสั่ง ยอดต่อรายการ ยอดทั้งบิลและยอดชำระ ไม่รับชำระเอง |

### src/screens/kitchen

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [KQueueScreen.js](/Users/smo/Restaurant/src/screens/kitchen/KQueueScreen.js) | คนที่ 2: FIFO คิวเก่าก่อนใหม่ กรองสถานะ เปิดรายละเอียดรอบ เปลี่ยนสถานะอาหาร |
| [KDetailScreen.js](/Users/smo/Restaurant/src/screens/kitchen/KDetailScreen.js) | คนที่ 2: โต๊ะ บิล รอบ รายการ จำนวน หมายเหตุ และปุ่มสถานะ |

### src/screens/admin

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [ATableScreen.js](/Users/smo/Restaurant/src/screens/admin/ATableScreen.js) | คนที่ 3: เลือกโต๊ะ เปิด/ดูบิล ย้ายบิลไปโต๊ะว่าง |
| [AMenuScreen.js](/Users/smo/Restaurant/src/screens/admin/AMenuScreen.js) | คนที่ 3: กรองเมนู แก้ราคา เปิด/ปิดขาย ตรวจราคาด้วย parsePrice |
| [ABillScreen.js](/Users/smo/Restaurant/src/screens/admin/ABillScreen.js) | คนที่ 3: บิลทุกรอบ ยอดคงเหลือ ตรวจเสิร์ฟครบ รับชำระ cash/qr และปิดบิล; QR เป็นการบันทึกวิธีชำระ ไม่เชื่อมธนาคาร |
| [ADashboardScreen.js](/Users/smo/Restaurant/src/screens/admin/ADashboardScreen.js) | คนที่ 4: ยอดขายวันนี้ บิลเปิด โต๊ะว่าง คิวครัว เมนูปิดขาย โต๊ะ ออเดอร์ล่าสุด และปุ่มจัดการ |
| [BillHistoryScreen.js](/Users/smo/Restaurant/src/screens/admin/BillHistoryScreen.js) | คนที่ 4: บิลปิดตามวันที่ ค้นหาเลขบิล/โต๊ะ และเปิด ABillScreen ดูบิลเก่า |
| [DailyReportScreen.js](/Users/smo/Restaurant/src/screens/admin/DailyReportScreen.js) | คนที่ 4: ช่วงวันที่ ยอดขายแยกหมวด top 10 เงินสด/QR ค้นหาบิล  |
| [ResetTransactionsScreen.js](/Users/smo/Restaurant/src/screens/admin/ResetTransactionsScreen.js) | คนที่ 4: กดปุ่ม Reset และยืนยัน ล้างข้อมูลขาย/ตะกร้า เก็บ master data และราคาปัจจุบัน |

### src/screens

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [README.md](/Users/smo/Restaurant/src/screens/README.md) | คู่มือชื่อ Screen routes และ billId/roundId |

### src/components/common

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [CommonCp.js](/Users/smo/Restaurant/src/components/common/CommonCp.js) | ScreenHeader หัวหน้า SectionCard กล่อง PrimaryButton ปุ่ม StatusBadge ป้าย InfoRow แถวชื่อ/ค่า |
| [ScreenContent.js](/Users/smo/Restaurant/src/components/common/ScreenContent.js) | ScreenContent พื้นที่ปลอดภัย/เลื่อน FilterBar ตัวกรอง EmptyState ไม่มีข้อมูล QueryState โหลด/ผิดพลาด/ลองใหม่ |

### src/components/customer

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [CustomerCp.js](/Users/smo/Restaurant/src/components/customer/CustomerCp.js) | CustomerTableCard โต๊ะ MenuCard เมนู CartItem จำนวน OrderStatusCard สถานะ BillItem รายการบิล |
| [CustomerNavigation.js](/Users/smo/Restaurant/src/components/customer/CustomerNavigation.js) | ปุ่มเมนู ตะกร้า สถานะ บิล ส่ง billId เดิมเมื่อเปลี่ยนหน้า |

### src/components/kitchen

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [KitchenCp.js](/Users/smo/Restaurant/src/components/kitchen/KitchenCp.js) | KitchenOrderCard คิว KitchenOrderItem รายการ KitchenStatusButton ปุ่มสถานะ |

### src/components/admin

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [AdminCp.js](/Users/smo/Restaurant/src/components/admin/AdminCp.js) | SummaryCard TableCard RecentOrderRow QuickActionButton BillRow MenuManageRow WarningCard ใช้ในหน้าผู้ดูแล |

### src/context

NavigationContext.js ส่ง open, replace, back, goHome และ params จาก App.js ไปให้หน้าจอ

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [CartContext.js](/Users/smo/Restaurant/src/context/CartContext.js) | CartProvider เก็บตะกร้าแยก billId ในหน่วยความจำ; useCart มี add decrease clear clearAll setNote setItemNote; ของยังไม่ส่งหายเมื่อปิดแอปจนสุด |

### src/hooks

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [useRestaurantQuery.js](/Users/smo/Restaurant/src/hooks/useRestaurantQuery.js) | useRestaurantQuery โหลดเมื่อเปิดหน้าใหม่หรือ key เปลี่ยน polling 5 วินาทีเมื่อเปิดใช้ ป้องกันผลเก่าทับใหม่; useRestaurantAction ป้องกันกดซ้ำ busy และ Alert ข้อผิดพลาด |

### src/styles

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [theme.js](/Users/smo/Restaurant/src/styles/theme.js) | สี spacing radius ขนาด/น้ำหนักตัวอักษร dimensions shadow และคำเรียกสถานะ |
| [appStyles.js](/Users/smo/Restaurant/src/styles/appStyles.js) | styles พื้นฐาน หน้า input หัวข้อ ระยะห่าง พื้นที่ไม่มีข้อมูล |
| [screenStyles.js](/Users/smo/Restaurant/src/styles/screenStyles.js) | styles จัดวางหลายหน้า แถวหลายคอลัมน์ โต๊ะ เมนู สรุป ตัวกรอง ข้อความประกอบ |

### src/utils

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [format.js](/Users/smo/Restaurant/src/utils/format.js) | baht จัดรูปแบบบาท parsePrice ตรวจราคา tableNumber เลขโต๊ะ today วันที่เครื่อง dateRange/reportRange ตรวจช่วงวัน displayTime แสดงเวลา |
| [status.js](/Users/smo/Restaurant/src/utils/status.js) | ORDER_FILTERS: all waiting cooking served |

### src/db

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [restaurantDb.js](/Users/smo/Restaurant/src/db/restaurantDb.js) | DATABASE_NAME และ initDb เปิด foreign_keys/WAL สร้าง 9 ตารางธุรกิจและ indexes |
| [screenDb.js](/Users/smo/Restaurant/src/db/screenDb.js) | service หลัก: initializeRestaurant tablesForScreen menusForScreen billForScreen kitchenForScreen openTable submitOrder moveTable setMenuAvailable setMenuPrice advanceKitchenItem settleBill clearTransactions reportForScreen dashboardForScreen kitchenDetailForScreen |
| [transaction.js](/Users/smo/Restaurant/src/db/transaction.js) | จัดคิวเขียน connection เดียว transaction และ rollback; resultData ตรวจ ok; positiveId ตรวจ ID |
| [tableDb.js](/Users/smo/Restaurant/src/db/tableDb.js) | getTables อ่านโต๊ะและบิลที่เปิดอยู่ให้ screenDb |
| [menuDb.js](/Users/smo/Restaurant/src/db/menuDb.js) | getCategories/getMenus/getAvailableMenus อ่านหมวด เมนู และราคาปัจจุบันให้ screenDb |
| [kitchenDb.js](/Users/smo/Restaurant/src/db/kitchenDb.js) | getKitchenQueue อ่านคิว FIFO ให้ screenDb |
| [billDb.js](/Users/smo/Restaurant/src/db/billDb.js) | getBillDetail อ่านบิล รอบ และรายการให้ billForScreen |

### src/db/seed

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [STables.js](/Users/smo/Restaurant/src/db/seed/STables.js) | ข้อมูลโต๊ะเริ่มต้น 15 โต๊ะ |
| [SCategories.js](/Users/smo/Restaurant/src/db/seed/SCategories.js) | หมวดอาหารเริ่มต้น 4 หมวด |
| [SMenus.js](/Users/smo/Restaurant/src/db/seed/SMenus.js) | เมนูเริ่มต้น 25 เมนูพร้อมหมวดและเปิดขาย |
| [SMenuPrices.js](/Users/smo/Restaurant/src/db/seed/SMenuPrices.js) | ราคาตั้งต้นหน่วยบาทจำนวนเต็ม |


| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|

### docs

| ไฟล์ | หน้าที่และความเกี่ยวข้อง |
|---|---|
| [assignment-checklist.md](/Users/smo/Restaurant/docs/assignment-checklist.md) | เทียบเงื่อนไขโจทย์ สิ่งที่ทำ/ยังไม่ทำ และสิ่งส่งงานที่ต้องเติม |
| [database-notes.md](/Users/smo/Restaurant/docs/database-notes.md) | ตาราง ความสัมพันธ์ ราคา transaction SQL SUM และ EXPLAIN QUERY PLAN |
| [project-file-guide.md](/Users/smo/Restaurant/docs/project-file-guide.md) | คู่มือทุกไฟล์ที่กำลังอ่าน |

## ตารางฐานข้อมูล

| ตาราง | เก็บอะไร |
|---|---|
| tables | โต๊ะร้าน |
| categories | หมวดอาหาร |
| menus | เมนูและสถานะเปิดขาย |
| menu_prices | ราคาและช่วงเวลาที่ราคาใช้ |
| bills | บิลของโต๊ะ เปิด/ปิด และเวลา |
| order_rounds | รอบสั่งของแต่ละบิล |
| order_items | อาหาร จำนวน หมายเหตุ ราคาตอนสั่ง สถานะ |
| payments | ยอด วิธี เวลา และบิลที่ชำระ |
| table_transfers | ประวัติย้ายบิลระหว่างโต๊ะ |

ราคาใน DB เป็นบาทจำนวนเต็ม และ order_items เก็บ price_at_order เพื่อไม่ให้การแก้ราคาปัจจุบันเปลี่ยนยอดบิลเก่า ยอดบิล/รายงานใช้ SQL ส่วนตะกร้าเป็นยอดประมาณการก่อนส่ง

## โฟลเดอร์และไฟล์ที่เครื่องมือสร้าง

| โฟลเดอร์/ไฟล์ | หน้าที่ |
|---|---|
| node_modules/ | dependencies ของ npm จำนวนมาก ไม่ใช่โค้ดที่ทีมต้องแบ่งทำ ไม่ควรแก้หรืออัป Git |
| .git/ | ประวัติ commits branches remotes และข้อมูล Git ให้ Git จัดการ |
| .expo/README.md | คำอธิบายโฟลเดอร์ Expo |
| .expo/devices.json | ข้อมูลอุปกรณ์ที่ใช้พัฒนา |
| .expo/dev/logs/start.log | log การเปิด Expo CLI |
| .expo/dev/logs/export.log | log การ export bundle |
| .expo/ ส่วน cache | ไฟล์ชั่วคราว เปลี่ยนตามการรัน ไม่ใช่ source |

ฐานข้อมูลจริง restaurant-order-01418342.db อยู่ในพื้นที่ข้อมูลแอปบนอุปกรณ์/Simulator ไม่ใช่ schema.sql และไม่ควรส่งขึ้น Git

## การแบ่งงาน

คนที่ 1: เลือกโต๊ะ เมนู ตะกร้า และ CartContext

คนที่ 2: ครัว สถานะออเดอร์ บิลลูกค้า

คนที่ 3: จัดการโต๊ะ เมนู ราคา รับชำระ/ปิดบิล

คนที่ 4: แดชบอร์ด ประวัติ รายงาน reset

screenDb/components/styles/_layout เป็นไฟล์ร่วม ต้องตกลงชื่อฟังก์ชัน รูปแบบข้อมูล และเจ้าของส่วนที่จะปรับก่อนแก้
