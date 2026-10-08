const prices = [
  { id: 1, menuId: 1, price: 150 },
  { id: 2, menuId: 2, price: 120 },
  { id: 3, menuId: 3, price: 120 },
  { id: 4, menuId: 4, price: 100 },
  { id: 5, menuId: 5, price: 150 },
  { id: 6, menuId: 6, price: 100 },
  { id: 7, menuId: 7, price: 100 },
  { id: 8, menuId: 8, price: 90 },
  { id: 9, menuId: 9, price: 120 },
  { id: 10, menuId: 10, price: 100 },
  { id: 11, menuId: 11, price: 120 },
  { id: 12, menuId: 12, price: 80 },
  { id: 13, menuId: 13, price: 180 },
  { id: 14, menuId: 14, price: 100 },
  { id: 15, menuId: 15, price: 120 },
  { id: 16, menuId: 16, price: 80 },
  { id: 17, menuId: 17, price: 100 },
  { id: 18, menuId: 18, price: 150 },
  { id: 19, menuId: 19, price: 100 },
  { id: 20, menuId: 20, price: 15 },
  { id: 21, menuId: 21, price: 45 },
  { id: 22, menuId: 22, price: 50 },
  { id: 23, menuId: 23, price: 25 },
  { id: 24, menuId: 24, price: 40 },
  { id: 25, menuId: 25, price: 60 },
];

export async function SMenuPrices(db) {
  try {
    const startAt = "2026-09-01 10:00";

    for (const item of prices) {
      await db.runAsync(
        `
        INSERT OR IGNORE INTO menu_prices (
          price_id,
          menu_id,
          price,
          start_at,
          end_at
        )
        VALUES (?, ?, ?, ?, NULL)
        `,
        [item.id, item.menuId, item.price, startAt],
      );
    }

    await db.runAsync(
      `
      INSERT OR IGNORE INTO menu_prices (
        price_id,
        menu_id,
        price,
        start_at,
        end_at
      )
      VALUES (?, ?, ?, ?, ?)
      `,
      [26, 1, 140, "2026-08-01 10:00", "2026-09-01 10:00"],
    );

    return {
      ok: true,
      message: "Seed D4 Menu Prices สำเร็จ",
    };
  } catch (error) {
    console.error("seedMenuPrices failed:", error);

    return {
      ok: false,
      message: "Seed D4 Menu Prices ไม่สำเร็จ",
    };
  }
}
