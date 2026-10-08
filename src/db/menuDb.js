export async function getCategories(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        category_id,
        category_name
      FROM categories
      ORDER BY category_id ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getCategories failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงหมวดหมู่ได้",
    };
  }
}

export async function getMenus(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        m.menu_id,
        m.category_id,
        c.category_name,
        m.menu_name,
        m.is_available,
        mp.price
      FROM menus m
      INNER JOIN categories c
        ON c.category_id = m.category_id
      LEFT JOIN menu_prices mp
        ON mp.menu_id = m.menu_id
        AND mp.end_at IS NULL
      ORDER BY
        c.category_id ASC,
        m.menu_id ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getMenus failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงข้อมูลเมนูได้",
    };
  }
}

export async function getAvailableMenus(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        m.menu_id,
        m.category_id,
        c.category_name,
        m.menu_name,
        mp.price
      FROM menus m
      INNER JOIN categories c
        ON c.category_id = m.category_id
      INNER JOIN menu_prices mp
        ON mp.menu_id = m.menu_id
        AND mp.end_at IS NULL
      WHERE m.is_available = 1
      ORDER BY
        c.category_id ASC,
        m.menu_id ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getAvailableMenus failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงเมนูที่เปิดขายได้",
    };
  }
}
