const test = require("node:test");
const assert = require("node:assert/strict");
const { DatabaseSync } = require("node:sqlite");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const babel = require("@babel/core");
const originalLoader = Module._extensions[".js"];
Module._extensions[".js"] = function (module, filename) {
  if (!filename.startsWith(path.resolve(__dirname, "../src") + path.sep))
    return originalLoader(module, filename);
  const result = babel.transformSync(fs.readFileSync(filename, "utf8"), {
    filename,
    babelrc: false,
    configFile: false,
    plugins: ["@babel/plugin-transform-modules-commonjs"],
  });
  module._compile(result.code, filename);
};
const service = require("../src/db/screenDb");
const { dateRange, parsePrice } = require("../src/utils/format");

function database(filename = ":memory:") {
  const sqlite = new DatabaseSync(filename);
  const args = (values) =>
    values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
  const db = {
    execAsync: async (sql) => sqlite.exec(sql),
    runAsync: async (sql, ...values) => {
      const result = sqlite.prepare(sql).run(...args(values));
      return {
        changes: result.changes,
        lastInsertRowId: result.lastInsertRowid,
      };
    },
    getFirstAsync: async (sql, ...values) =>
      sqlite.prepare(sql).get(...args(values)) || null,
    getAllAsync: async (sql, ...values) =>
      sqlite.prepare(sql).all(...args(values)),
    withTransactionAsync: async (task) => {
      sqlite.exec("BEGIN");
      try {
        await task();
        sqlite.exec("COMMIT");
      } catch (error) {
        sqlite.exec("ROLLBACK");
        throw error;
      }
    },
    close: () => sqlite.close(),
  };
  return db;
}

test("restaurant flow: seed, order, kitchen, transfer, payment, report and reset", async () => {
  const db = database();
  try {
    await service.initializeRestaurant(db);
    assert.equal((await service.tablesForScreen(db)).length, 15);
    const { menus } = await service.menusForScreen(db, true);
    assert.ok(menus.length > 0);
    const menu = menus[0];
    const billId = await service.openTable(db, 1);
    assert.equal(await service.openTable(db, 1), billId);
    const otherBill = await service.openTable(db, 2);
    await assert.rejects(service.moveTable(db, billId, 1, 2), /ไม่ว่าง/);
    await service.submitOrder(db, billId, [
      { menuId: menu.id, quantity: 2, note: "เผ็ดน้อย" },
    ]);
    const before = await service.billForScreen(db, billId);
    assert.equal(before.total, Math.round(menu.price * 100) * 2);
    await service.setMenuPrice(db, menu.id, 19900);
    await service.initializeRestaurant(db);
    assert.equal(
      (await service.menusForScreen(db)).menus.find(
        (item) => item.id === menu.id,
      ).price,
      199,
    );
    assert.equal((await service.billForScreen(db, billId)).total, before.total);
    await service.submitOrder(db, billId, [{ menuId: menu.id, quantity: 1 }]);
    assert.equal(
      (await service.billForScreen(db, billId)).total,
      before.total + 19900,
    );
    const roundCount = (await service.billForScreen(db, billId)).rounds.length;
    await assert.rejects(
      service.submitOrder(db, billId, [
        { menuId: menu.id, quantity: 1 },
        { menuId: 9999, quantity: 1 },
      ]),
    );
    assert.equal(
      (await service.billForScreen(db, billId)).rounds.length,
      roundCount,
    );
    await assert.rejects(service.settleBill(db, billId, "cash"), /ไม่เสิร์ฟ/);
    for (const item of await service.kitchenForScreen(db)) {
      await service.advanceKitchenItem(db, item.orderId, "waiting");
      await assert.rejects(
        service.advanceKitchenItem(db, item.orderId, "waiting"),
        /สถานะเปลี่ยน/,
      );
      await service.advanceKitchenItem(db, item.orderId, "cooking");
    }
    assert.equal((await service.kitchenForScreen(db)).length, 0);
    await service.moveTable(db, billId, 1, 3);
    assert.equal((await service.billForScreen(db, billId)).tableNumber, 3);
    await service.settleBill(db, billId, "cash");
    const closed = await service.billForScreen(db, billId);
    assert.equal(closed.status, "closed");
    assert.equal(closed.paid, closed.total);
    await assert.rejects(service.settleBill(db, billId, "cash"), /ปิดแล้ว/);
    await assert.rejects(
      service.submitOrder(db, billId, [{ menuId: menu.id, quantity: 1 }]),
      /ปิดแล้ว/,
    );
    const report = await service.reportForScreen(
      db,
      "2000-01-01T00:00:00Z",
      "2100-01-01T00:00:00Z",
    );
    assert.equal(report.total, closed.total);
    assert.equal(report.cash, closed.total);
    assert.equal(report.bills.length, 1);
    assert.equal(
      report.categories.reduce((sum, row) => sum + row.total, 0),
      closed.total,
    );
    await service.settleBill(db, otherBill, "qr");
    await service.clearTransactions(db);
    assert.equal(
      (await service.tablesForScreen(db)).filter((table) => table.billId)
        .length,
      0,
    );
    assert.equal(
      (await db.getFirstAsync("SELECT COUNT(*) AS count FROM menus")).count,
      25,
    );
    await service.initializeRestaurant(db);
    assert.equal(
      (await db.getFirstAsync("SELECT COUNT(*) AS count FROM bills")).count,
      0,
    );
  } finally {
    db.close();
  }
});

test("unavailable menu and invalid quantity roll back the entire round", async () => {
  const db = database();
  try {
    await service.initializeRestaurant(db);
    const id = await service.openTable(db, 1);
    await service.setMenuAvailable(db, 1, false);
    await assert.rejects(
      service.submitOrder(db, id, [{ menuId: 1, quantity: 1 }]),
      /ปิดขาย/,
    );
    await assert.rejects(
      service.submitOrder(db, id, [{ menuId: 2, quantity: 0 }]),
      /จำนวน/,
    );
    assert.equal((await service.billForScreen(db, id)).rounds.length, 0);
  } finally {
    db.close();
  }
});

test("concurrent opens share one bill and concurrent submissions allocate distinct rounds", async () => {
  const db = database();
  try {
    await service.initializeRestaurant(db);
    const ids = await Promise.all([
      service.openTable(db, 1),
      service.openTable(db, 1),
    ]);
    assert.equal(ids[0], ids[1]);
    await Promise.all([
      service.submitOrder(db, ids[0], [{ menuId: 1, quantity: 1 }]),
      service.submitOrder(db, ids[0], [{ menuId: 1, quantity: 1 }]),
    ]);
    assert.deepEqual(
      (await service.billForScreen(db, ids[0])).rounds.map(
        (round) => round.round_number,
      ),
      [1, 2],
    );
  } finally {
    db.close();
  }
});

test("money and dates reject malformed input", () => {
  assert.equal(parsePrice("120.50"), 12050);
  for (const input of ["0", "-1", "abc", "1.234", "Infinity"])
    assert.throws(() => parsePrice(input));
  assert.throws(() => dateRange("2026-02-30"));
  assert.throws(() => dateRange("2026-13-01"));
  const [start, end] = dateRange("2026-10-08");
  assert.equal(new Date(end) - new Date(start), 24 * 60 * 60 * 1000);
});

test("assignment schema, seed counts, constraints and indexes", async () => {
  const db = database();
  try {
    await db.execAsync(
      fs.readFileSync(path.resolve(__dirname, "../schema.sql"), "utf8"),
    );
    await service.initializeRestaurant(db);
    assert.equal(
      (await db.getFirstAsync("PRAGMA foreign_keys")).foreign_keys,
      1,
    );
    const counts = await db.getAllAsync(
      "SELECT category_id, COUNT(*) AS count FROM menus GROUP BY category_id",
    );
    assert.ok(counts.length >= 4 && counts.every((row) => row.count >= 5));
    assert.ok(counts.reduce((sum, row) => sum + row.count, 0) >= 25);
    await assert.rejects(
      db.runAsync(
        "INSERT INTO bills (table_id,status,opened_at) VALUES (?, 'open', ?)",
        999,
        "2026-10-08T00:00:00Z",
      ),
      /FOREIGN KEY/,
    );
    const plans = await db.getAllAsync(
      "EXPLAIN QUERY PLAN SELECT * FROM order_items WHERE status = ?",
      "waiting",
    );
    assert.ok(
      plans.some((row) => row.detail.includes("idx_order_items_status")),
    );
    const roundPlan = await db.getAllAsync(
      "EXPLAIN QUERY PLAN SELECT * FROM order_rounds WHERE created_at >= ?",
      "2026-10-08T00:00:00Z",
    );
    assert.ok(
      roundPlan.some((row) => row.detail.includes("idx_order_rounds_created")),
    );
    console.log(
      "QUERY PLAN:",
      plans.map((row) => row.detail).join("; "),
      roundPlan.map((row) => row.detail).join("; "),
    );
  } finally {
    db.close();
  }
});

test("three order rounds persist across closing and reopening the SQLite database", async () => {
  const os = require("node:os");
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "restaurant-flow-"));
  const filename = path.join(temp, "restaurant.db");
  let db = database(filename);
  try {
    await service.initializeRestaurant(db);
    const id = await service.openTable(db, 1);
    for (let count = 0; count < 3; count++)
      await service.submitOrder(db, id, [
        { menuId: 1, quantity: 1, note: "รอบ " + (count + 1) },
        { menuId: 2, quantity: 2, note: "ไม่ใส่ผักชี" },
      ]);
    const before = await service.billForScreen(db, id);
    assert.equal(before.rounds.length, 3);
    assert.equal(before.total, 3 * (15000 + 2 * 12000));
    db.close();
    db = database(filename);
    await service.initializeRestaurant(db);
    assert.equal((await service.billForScreen(db, id)).total, before.total);
    assert.equal((await service.billForScreen(db, id)).rounds.length, 3);
    for (const item of await service.kitchenForScreen(db)) {
      await service.advanceKitchenItem(db, item.orderId, "waiting");
      await service.advanceKitchenItem(db, item.orderId, "cooking");
    }
    await service.settleBill(db, id, "qr");
    await service.setMenuPrice(db, 1, 18000);
    assert.equal((await service.billForScreen(db, id)).total, before.total);
    const newId = await service.openTable(db, 1);
    assert.notEqual(newId, id);
    assert.equal((await service.billForScreen(db, id)).status, "closed");
  } finally {
    db.close();
    fs.rmSync(temp, { recursive: true, force: true });
  }
});

test("SQL stays in db, has no interpolation, and the provider is unique", () => {
  const root = path.resolve(__dirname, "../src");
  const all = [];
  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (file.endsWith(".js")) all.push(file);
    }
  };
  visit(root);
  for (const file of all.filter((file) => file.includes("/db/")))
    assert.ok(!fs.readFileSync(file, "utf8").includes("${"), file);
  for (const file of all.filter((file) => file.includes("/screens/")))
    assert.ok(
      !/\b(SELECT|INSERT INTO|UPDATE\s+\w+\s+SET|DELETE FROM)\b/.test(
        fs.readFileSync(file, "utf8"),
      ),
      file,
    );
  assert.equal(
    all.filter((file) =>
      fs.readFileSync(file, "utf8").includes("<SQLiteProvider"),
    ).length,
    1,
  );
  assert.equal(
    all.filter((file) =>
      fs.readFileSync(file, "utf8").includes("openDatabaseAsync("),
    ).length,
    0,
  );
});
