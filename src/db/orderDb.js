// src/db/orderDb.js


// สร้างรอบการสั่งใหม่
export async function createOrderRound(
  db,
  billId
) {
  try {

    const lastRound =
      await db.getFirstAsync(
        `
        SELECT
          MAX(round_number) AS max_round
        FROM order_rounds
        WHERE bill_id = ?
        `,
        [billId]
      );

    const nextRound =
      (lastRound?.max_round || 0) + 1;

    const createdAt =
      new Date().toISOString();

    const result =
      await db.runAsync(
        `
        INSERT INTO order_rounds (
          bill_id,
          round_number,
          created_at
        )
        VALUES (?, ?, ?)
        `,
        [
          billId,
          nextRound,
          createdAt,
        ]
      );

    return {
      ok: true,
      data: {
        roundId:
          result.lastInsertRowId,
        roundNumber:
          nextRound,
      },
    };

  } catch (error) {
    console.error(
      'createOrderRound failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถสร้างรอบการสั่งได้',
    };
  }
}


// เพิ่มรายการอาหาร
export async function addOrderItem(
  db,
  roundId,
  menuId,
  quantity,
  note
) {
  try {

    // ดึงราคาปัจจุบัน
    const menu =
      await db.getFirstAsync(
        `
        SELECT
          mp.price
        FROM menu_prices mp
        WHERE mp.menu_id = ?
          AND mp.end_at IS NULL
        `,
        [menuId]
      );

    if (!menu) {
      return {
        ok: false,
        message:
          'ไม่พบราคาปัจจุบันของเมนู',
      };
    }

    const createdAt =
      new Date().toISOString();

    const result =
      await db.runAsync(
        `
        INSERT INTO order_items (
          round_id,
          menu_id,
          quantity,
          note,
          price_at_order,
          status,
          created_at
        )
        VALUES (?, ?, ?, ?, ?, 'waiting', ?)
        `,
        [
          roundId,
          menuId,
          quantity,
          note,
          menu.price,
          createdAt,
        ]
      );

    return {
      ok: true,
      data: {
        orderItemId:
          result.lastInsertRowId,
      },
    };

  } catch (error) {
    console.error(
      'addOrderItem failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถเพิ่มรายการอาหารได้',
    };
  }
}


// เพิ่มอาหารหลายรายการในรอบเดียว
export async function addOrderItems(
  db,
  roundId,
  items
) {
  try {

    await db.withTransactionAsync(
      async () => {

        for (const item of items) {

          const menu =
            await db.getFirstAsync(
              `
              SELECT
                price
              FROM menu_prices
              WHERE menu_id = ?
                AND end_at IS NULL
              `,
              [item.menuId]
            );

          if (!menu) {
            throw new Error(
              `ไม่พบราคาของเมนู ${item.menuId}`
            );
          }

          await db.runAsync(
            `
            INSERT INTO order_items (
              round_id,
              menu_id,
              quantity,
              note,
              price_at_order,
              status,
              created_at
            )
            VALUES (?, ?, ?, ?, ?, 'waiting', ?)
            `,
            [
              roundId,
              item.menuId,
              item.quantity,
              item.note ?? null,
              menu.price,
              new Date().toISOString(),
            ]
          );
        }
      }
    );

    return {
      ok: true,
      message:
        'เพิ่มรายการอาหารสำเร็จ',
    };

  } catch (error) {
    console.error(
      'addOrderItems failed:',
      error
    );

    return {
      ok: false,
      message:
        error.message ||
        'ไม่สามารถเพิ่มรายการอาหารได้',
    };
  }
}


// ดูรายการอาหารของ Bill
export async function getOrderItemsByBill(
  db,
  billId
) {
  try {
    const rows =
      await db.getAllAsync(
        `
        SELECT
          oi.order_item_id,
          oi.round_id,
          oround.round_number,
          oi.menu_id,
          m.menu_name,
          oi.quantity,
          oi.note,
          oi.price_at_order,
          oi.status,
          oi.created_at
        FROM order_items oi
        INNER JOIN order_rounds oround
          ON oround.round_id = oi.round_id
        INNER JOIN menus m
          ON m.menu_id = oi.menu_id
        WHERE oround.bill_id = ?
        ORDER BY
          oround.round_number ASC,
          oi.created_at ASC
        `,
        [billId]
      );

    return {
      ok: true,
      data: rows,
    };

  } catch (error) {
    console.error(
      'getOrderItemsByBill failed:',
      error
    );

    return {
      ok: false,
      message:
        'ไม่สามารถดึงรายการอาหารได้',
    };
  }
}