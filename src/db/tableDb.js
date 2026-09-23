// src/db/tableDb.js

/**
 * ดึงรายการโต๊ะทั้ง 15 โต๊ะ พร้อมสถานะบิลที่เปิดค้างอยู่ (ถ้ามี)
 */
export async function getTablesWithStatus(db) {
  const query = `
    SELECT 
      t.id, 
      t.seat_count,
      b.id AS current_bill_id,
      b.opened_at,
      b.status AS bill_status,
      (SELECT COUNT(*) FROM rounds r WHERE r.bill_id = b.id) AS round_count
    FROM tables t
    LEFT JOIN bills b ON t.id = b.table_id AND b.status = 'open'
    ORDER BY t.id ASC;
  `;
  return await db.getAllAsync(query);
}

/**
 * เปิดบิลใหม่สำหรับโต๊ะที่ว่าง
 */
export async function createNewBill(db, tableId) {
  const now = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO bills (table_id, opened_at, status) VALUES (?, ?, ?);',
    [tableId, now, 'open']
  );
  return result.lastInsertRowId;
}