export async function getTables(db) {
  try {
    const rows = await db.getAllAsync(`
      SELECT
        t.table_id,
        t.table_number,
        b.bill_id,
        b.status AS bill_status
      FROM tables t
      LEFT JOIN bills b
        ON b.table_id = t.table_id
        AND b.status = 'open'
      ORDER BY t.table_number ASC
    `);

    return {
      ok: true,
      data: rows,
    };
  } catch (error) {
    console.error("getTables failed:", error);

    return {
      ok: false,
      message: "ไม่สามารถดึงข้อมูลโต๊ะได้",
    };
  }
}
