// src/db/kitchenDb.js


// ดึงคิวครัวแบบ FIFO
export async function getKitchenQueue(db) {
  try {
    const rows =
      await db.getAllAsync(`
        SELECT
          oi.order_item_id,
          oi.round_id,
          oround.round_number,
          oround.bill_id,
          b.table_id,
          t.table_number,
          oi.menu_id,
          m.menu_name,
          oi.quantity,
          oi.note,
          oi.status,
          oi.created_at
        FROM order_items oi
        INNER JOIN order_rounds oround
          ON oround.round_id = oi.round_id
        INNER JOIN bills b
          ON b.bill_id = oround.bill_id
        INNER JOIN tables t
          ON t.table_id = b.table_id
        INNER JOIN menus m
          ON m.menu_id = oi.menu_id
        WHERE oi.status IN (
          'waiting',
          'cooking'
        )
        ORDER BY oi.created_at ASC
      `);

    return {
      ok: true,
      data: rows,
    };

  } catch (error) {
    console.error(
      'getKitchenQueue failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถดึงคิวครัวได้',
    };
  }
}


// เปลี่ยนสถานะอาหาร
export async function updateOrderItemStatus(
  db,
  orderItemId,
  status
) {
  try {

    await db.runAsync(
      `
      UPDATE order_items
      SET status = ?
      WHERE order_item_id = ?
      `,
      [
        status,
        orderItemId,
      ]
    );

    return {
      ok: true,
      message:
        'เปลี่ยนสถานะอาหารสำเร็จ',
    };

  } catch (error) {
    console.error(
      'updateOrderItemStatus failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถเปลี่ยนสถานะอาหารได้',
    };
  }
}


// ดูรายละเอียดออเดอร์ของรอบ
export async function getKitchenRoundDetail(
  db,
  roundId
) {
  try {

    const rows =
      await db.getAllAsync(
        `
        SELECT
          oi.order_item_id,
          oi.menu_id,
          m.menu_name,
          oi.quantity,
          oi.note,
          oi.price_at_order,
          oi.status,
          oi.created_at
        FROM order_items oi
        INNER JOIN menus m
          ON m.menu_id = oi.menu_id
        WHERE oi.round_id = ?
        ORDER BY oi.created_at ASC
        `,
        [roundId]
      );

    return {
      ok: true,
      data: rows,
    };

  } catch (error) {
    console.error(
      'getKitchenRoundDetail failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถดึงรายละเอียดออเดอร์ได้',
    };
  }
}