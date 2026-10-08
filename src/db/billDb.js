export async function getBillDetail(db, billId) {
  try {
    const bill = await db.getFirstAsync(
      `
      SELECT
        bill_id,
        table_id,
        status,
        opened_at,
        closed_at
      FROM bills
      WHERE bill_id = ?
      `,
      [billId],
    );

    if (!bill) {
      return {
        ok: false,
        message: "ไม่พบ Bill",
      };
    }

    const rounds = await db.getAllAsync(
      `
      SELECT
        round_id,
        bill_id,
        round_number,
        created_at
      FROM order_rounds
      WHERE bill_id = ?
      ORDER BY round_number ASC
      `,
      [billId],
    );

    const items = await db.getAllAsync(
      `
      SELECT
        oi.order_item_id,
        oi.round_id,
        oi.menu_id,
        m.menu_name,
        oi.quantity,
        oi.note,
        oi.price_at_order,
        oi.status,
        oi.created_at,

        (
          oi.quantity * oi.price_at_order
        ) AS item_total

      FROM order_items oi

      INNER JOIN order_rounds r
        ON r.round_id = oi.round_id

      INNER JOIN menus m
        ON m.menu_id = oi.menu_id

      WHERE r.bill_id = ?

      ORDER BY
        oi.created_at ASC,
        oi.order_item_id ASC
      `,
      [billId],
    );

    return {
      ok: true,

      data: {
        ...bill,
        rounds,
        items,
      },
    };
  } catch (error) {
    console.error("getBillDetail failed:", error);

    return {
      ok: false,
      message: error?.message || "ไม่สามารถโหลดรายละเอียด Bill ได้",
    };
  }
}
