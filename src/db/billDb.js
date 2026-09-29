// src/db/billDb.js


// เปิด Bill ใหม่ให้โต๊ะ
export async function createBill(
  db,
  tableId
) {
  try {

    // ตรวจว่ามี Bill เปิดอยู่หรือไม่
    const existing =
      await db.getFirstAsync(
        `
        SELECT bill_id
        FROM bills
        WHERE table_id = ?
          AND status = 'open'
        `,
        [tableId]
      );

    if (existing) {
      return {
        ok: true,
        data: {
          billId: existing.bill_id,
        },
        message:
          'โต๊ะนี้มีบิลเปิดอยู่แล้ว',
      };
    }

    const result =
      await db.runAsync(
        `
        INSERT INTO bills (
          table_id,
          status,
          opened_at,
          closed_at
        )
        VALUES (?, 'open', ?, NULL)
        `,
        [
          tableId,
          new Date().toISOString(),
        ]
      );

    return {
      ok: true,
      data: {
        billId:
          result.lastInsertRowId,
      },
      message:
        'เปิดบิลสำเร็จ',
    };

  } catch (error) {
    console.error(
      'createBill failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถเปิดบิลได้',
    };
  }
}


// ดึง Bill เปิดอยู่
export async function getOpenBill(
  db,
  billId
) {
  try {

    const row =
      await db.getFirstAsync(
        `
        SELECT
          b.bill_id,
          b.table_id,
          t.table_number,
          b.status,
          b.opened_at
        FROM bills b
        INNER JOIN tables t
          ON t.table_id = b.table_id
        WHERE b.bill_id = ?
          AND b.status = 'open'
        `,
        [billId]
      );

    return {
      ok: true,
      data: row,
    };

  } catch (error) {
    console.error(
      'getOpenBill failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถดึงข้อมูลบิลได้',
    };
  }
}


// คำนวณยอดรวมอาหาร
export async function getBillTotal(
  db,
  billId
) {
  try {

    const row =
      await db.getFirstAsync(
        `
        SELECT
          COALESCE(
            SUM(
              oi.quantity * oi.price_at_order
            ),
            0
          ) AS total
        FROM order_items oi
        INNER JOIN order_rounds r
          ON r.round_id = oi.round_id
        WHERE r.bill_id = ?
        `,
        [billId]
      );

    return {
      ok: true,
      data: {
        total: row.total,
      },
    };

  } catch (error) {
    console.error(
      'getBillTotal failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถคำนวณยอดบิลได้',
    };
  }
}


// ดึงรายการในบิลพร้อมยอดรวม
export async function getBillDetail(
  db,
  billId
) {
  try {

    const items =
      await db.getAllAsync(
        `
        SELECT
          oi.order_item_id,
          r.round_number,
          m.menu_name,
          oi.quantity,
          oi.note,
          oi.price_at_order,
          (
            oi.quantity *
            oi.price_at_order
          ) AS item_total
        FROM order_items oi
        INNER JOIN order_rounds r
          ON r.round_id = oi.round_id
        INNER JOIN menus m
          ON m.menu_id = oi.menu_id
        WHERE r.bill_id = ?
        ORDER BY
          r.round_number ASC,
          oi.created_at ASC
        `,
        [billId]
      );

    const total =
      await db.getFirstAsync(
        `
        SELECT
          COALESCE(
            SUM(
              oi.quantity *
              oi.price_at_order
            ),
            0
          ) AS total
        FROM order_items oi
        INNER JOIN order_rounds r
          ON r.round_id = oi.round_id
        WHERE r.bill_id = ?
        `,
        [billId]
      );

    return {
      ok: true,
      data: {
        items,
        total: total.total,
      },
    };

  } catch (error) {
    console.error(
      'getBillDetail failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถดึงรายละเอียดบิลได้',
    };
  }
}


// บันทึกการชำระเงิน
export async function createPayment(
  db,
  billId,
  amount,
  paymentMethod
) {
  try {

    await db.runAsync(
      `
      INSERT INTO payments (
        bill_id,
        amount,
        payment_method,
        paid_at
      )
      VALUES (?, ?, ?, ?)
      `,
      [
        billId,
        amount,
        paymentMethod,
        new Date().toISOString(),
      ]
    );

    return {
      ok: true,
      message:
        'บันทึกการชำระเงินสำเร็จ',
    };

  } catch (error) {
    console.error(
      'createPayment failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถบันทึกการชำระเงินได้',
    };
  }
}


// ปิด Bill
export async function closeBill(
  db,
  billId
) {
  try {

    const total =
      await db.getFirstAsync(
        `
        SELECT
          COALESCE(
            SUM(
              oi.quantity *
              oi.price_at_order
            ),
            0
          ) AS total
        FROM order_items oi
        INNER JOIN order_rounds r
          ON r.round_id = oi.round_id
        WHERE r.bill_id = ?
        `,
        [billId]
      );

    const paid =
      await db.getFirstAsync(
        `
        SELECT
          COALESCE(
            SUM(amount),
            0
          ) AS paid_total
        FROM payments
        WHERE bill_id = ?
        `,
        [billId]
      );

    if (
      paid.paid_total <
      total.total
    ) {
      return {
        ok: false,
        message:
          'ยอดชำระยังไม่ครบ',
      };
    }

    await db.runAsync(
      `
      UPDATE bills
      SET
        status = 'closed',
        closed_at = ?
      WHERE bill_id = ?
        AND status = 'open'
      `,
      [
        new Date().toISOString(),
        billId,
      ]
    );

    return {
      ok: true,
      message:
        'ปิดบิลสำเร็จ',
    };

  } catch (error) {
    console.error(
      'closeBill failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถปิดบิลได้',
    };
  }
}