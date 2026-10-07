export async function closeBill(db, billId) {
  try {
    // 1. ตรวจสอบว่า Bill มีอยู่และยังเปิดอยู่
    const bill = await db.getFirstAsync(
      `
      SELECT
        bill_id,
        status
      FROM bills
      WHERE bill_id = ?
      `,
      [billId]
    );

    if (!bill) {
      return {
        ok: false,
        message: "ไม่พบ Bill",
      };
    }

    if (bill.status !== "open") {
      return {
        ok: false,
        message: "Bill นี้ปิดไปแล้ว",
      };
    }

    // 2. ตรวจสอบว่ายังมีอาหารที่ไม่ใช่ served หรือไม่
    const unfinished = await db.getFirstAsync(
      `
      SELECT COUNT(*) AS count
      FROM order_items oi
      INNER JOIN order_rounds r
        ON r.round_id = oi.round_id
      WHERE r.bill_id = ?
        AND oi.status != 'served'
      `,
      [billId]
    );

    if (unfinished.count > 0) {
      return {
        ok: false,
        message: "ยังมีรายการอาหารที่ยังไม่เสิร์ฟ",
      };
    }

    // 3. คำนวณยอด Bill
    const totalResult = await db.getFirstAsync(
      `
      SELECT
        COALESCE(
          SUM(
            oi.quantity * oi.price_at_order
          ),
          0
        ) AS total
      FROM order_rounds r
      INNER JOIN order_items oi
        ON oi.round_id = r.round_id
      WHERE r.bill_id = ?
      `,
      [billId]
    );

    const total = totalResult.total;

    // 4. ตรวจสอบยอดเงินที่จ่ายแล้ว
    const paidResult = await db.getFirstAsync(
      `
      SELECT
        COALESCE(SUM(amount), 0) AS paid
      FROM payments
      WHERE bill_id = ?
      `,
      [billId]
    );

    const paid = paidResult.paid;

    if (paid < total) {
      return {
        ok: false,
        message: "ยอดชำระเงินยังไม่ครบ",
      };
    }

    // 5. ปิด Bill
    await db.runAsync(
      `
      UPDATE bills
      SET
        status = 'closed',
        closed_at = ?
      WHERE bill_id = ?
      `,
      [new Date().toISOString(), billId]
    );

    return {
      ok: true,
      message: "ปิด Bill สำเร็จ",
    };

  } catch (error) {
    console.error("closeBill failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถปิด Bill ได้",
    };
  }
}