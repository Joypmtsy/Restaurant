PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

CREATE TABLE IF NOT EXISTS tables (
    table_id INTEGER PRIMARY KEY,
    table_number INTEGER NOT NULL UNIQUE
        CHECK (table_number BETWEEN 1 AND 15)
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY,
    category_name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS menus (
    menu_id INTEGER PRIMARY KEY,
    category_id INTEGER NOT NULL,
    menu_name TEXT NOT NULL,
    is_available INTEGER NOT NULL DEFAULT 1
        CHECK (is_available IN (0, 1)),

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS menu_prices (
    price_id INTEGER PRIMARY KEY,
    menu_id INTEGER NOT NULL,
    price INTEGER NOT NULL
        CHECK (price > 0),

    start_at TEXT NOT NULL,
    end_at TEXT,

    CHECK (
        end_at IS NULL
        OR end_at > start_at
    ),

    FOREIGN KEY (menu_id)
        REFERENCES menus(menu_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS
    ux_menu_prices_current
ON menu_prices(menu_id)
WHERE end_at IS NULL;

CREATE TABLE IF NOT EXISTS bills (
    bill_id INTEGER PRIMARY KEY,

    table_id INTEGER NOT NULL,

    status TEXT NOT NULL
        CHECK (status IN ('open', 'closed')),

    opened_at TEXT NOT NULL,
    closed_at TEXT,

    CHECK (
        (status = 'open' AND closed_at IS NULL)
        OR
        (status = 'closed' AND closed_at IS NOT NULL)
    ),

    FOREIGN KEY (table_id)
        REFERENCES tables(table_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE UNIQUE INDEX IF NOT EXISTS
    ux_bills_one_open_per_table
ON bills(table_id)
WHERE status = 'open';

CREATE TABLE IF NOT EXISTS order_rounds (
    round_id INTEGER PRIMARY KEY,

    bill_id INTEGER NOT NULL,

    round_number INTEGER NOT NULL
        CHECK (round_number > 0),

    created_at TEXT NOT NULL,

    UNIQUE (
        bill_id,
        round_number
    ),

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INTEGER PRIMARY KEY,

    round_id INTEGER NOT NULL,

    menu_id INTEGER NOT NULL,

    quantity INTEGER NOT NULL
        CHECK (quantity > 0),

    note TEXT,

    price_at_order INTEGER NOT NULL
        CHECK (price_at_order > 0),

    status TEXT NOT NULL DEFAULT 'waiting'
        CHECK (
            status IN (
                'waiting',
                'cooking',
                'served'
            )
        ),

    created_at TEXT NOT NULL,

    FOREIGN KEY (round_id)
        REFERENCES order_rounds(round_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    FOREIGN KEY (menu_id)
        REFERENCES menus(menu_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id INTEGER PRIMARY KEY,

    bill_id INTEGER NOT NULL,

    amount INTEGER NOT NULL
        CHECK (amount > 0),

    payment_method TEXT NOT NULL,

    paid_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE TABLE IF NOT EXISTS table_transfers (
    transfer_id INTEGER PRIMARY KEY,

    bill_id INTEGER NOT NULL,

    from_table_id INTEGER NOT NULL,

    to_table_id INTEGER NOT NULL,

    transferred_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

    CHECK (
        from_table_id <> to_table_id
    ),

    FOREIGN KEY (bill_id)
        REFERENCES bills(bill_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    FOREIGN KEY (from_table_id)
        REFERENCES tables(table_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT,

    FOREIGN KEY (to_table_id)
        REFERENCES tables(table_id)
        ON DELETE RESTRICT
        ON UPDATE RESTRICT
);

CREATE INDEX IF NOT EXISTS
    idx_order_items_status
ON order_items(status);

CREATE INDEX IF NOT EXISTS
    idx_order_items_created
ON order_items(created_at);

CREATE INDEX IF NOT EXISTS
    idx_order_rounds_created
ON order_rounds(created_at);

CREATE INDEX IF NOT EXISTS
    idx_bills_closed_at
ON bills(closed_at);

INSERT OR IGNORE INTO tables (table_id, table_number)
VALUES
    (1, 1),
    (2, 2),
    (3, 3),
    (4, 4),
    (5, 5),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 9),
    (10, 10),
    (11, 11),
    (12, 12),
    (13, 13),
    (14, 14),
    (15, 15);

INSERT OR IGNORE INTO categories (category_id, category_name)
VALUES
    (1, 'ต้ม / แกง'),
    (2, 'ผัด / จานหลัก'),
    (3, 'ทอด / ยำ'),
    (4, 'เครื่องดื่ม / ของหวาน');

INSERT OR IGNORE INTO menus (menu_id, category_id, menu_name, is_available)
VALUES
    (1, 1, 'ต้มยำกุ้ง', 1),
    (2, 1, 'ต้มข่าไก่', 1),
    (3, 1, 'แกงเขียวหวานไก่', 1),
    (4, 1, 'แกงจืดเต้าหู้หมูสับ', 1),
    (5, 1, 'แกงเผ็ดเป็ดย่าง', 1),
    (6, 2, 'ผัดกะเพราหมูสับ', 1),
    (7, 2, 'ผัดกะเพราไก่', 1),
    (8, 2, 'ผัดผักรวม', 1),
    (9, 2, 'ข้าวผัดกุ้ง', 1),
    (10, 2, 'ผัดซีอิ๊วหมู', 1),
    (11, 2, 'ผัดไทยกุ้ง', 1),
    (12, 2, 'ข้าวไข่เจียวหมูสับ', 1),
    (13, 3, 'ปลาทอดสมุนไพร', 1),
    (14, 3, 'ไก่ทอด', 1),
    (15, 3, 'ปีกไก่ทอด', 1),
    (16, 3, 'ส้มตำไทย', 1),
    (17, 3, 'ยำวุ้นเส้น', 1),
    (18, 3, 'ยำทะเล', 1),
    (19, 3, 'ทอดมันปลา', 1),
    (20, 4, 'น้ำเปล่า', 1),
    (21, 4, 'ชาเย็น', 1),
    (22, 4, 'กาแฟเย็น', 1),
    (23, 4, 'น้ำอัดลม', 1),
    (24, 4, 'ไอศกรีม', 1),
    (25, 4, 'ขนมหวานรวม', 1);

INSERT OR IGNORE INTO menu_prices (price_id, menu_id, price, start_at, end_at)
VALUES
    (1, 1, 150, '2026-09-01 10:00', NULL),
    (2, 2, 120, '2026-09-01 10:00', NULL),
    (3, 3, 120, '2026-09-01 10:00', NULL),
    (4, 4, 100, '2026-09-01 10:00', NULL),
    (5, 5, 150, '2026-09-01 10:00', NULL),
    (6, 6, 100, '2026-09-01 10:00', NULL),
    (7, 7, 100, '2026-09-01 10:00', NULL),
    (8, 8, 90, '2026-09-01 10:00', NULL),
    (9, 9, 120, '2026-09-01 10:00', NULL),
    (10, 10, 100, '2026-09-01 10:00', NULL),
    (11, 11, 120, '2026-09-01 10:00', NULL),
    (12, 12, 80, '2026-09-01 10:00', NULL),
    (13, 13, 180, '2026-09-01 10:00', NULL),
    (14, 14, 100, '2026-09-01 10:00', NULL),
    (15, 15, 120, '2026-09-01 10:00', NULL),
    (16, 16, 80, '2026-09-01 10:00', NULL),
    (17, 17, 100, '2026-09-01 10:00', NULL),
    (18, 18, 150, '2026-09-01 10:00', NULL),
    (19, 19, 100, '2026-09-01 10:00', NULL),
    (20, 20, 15, '2026-09-01 10:00', NULL),
    (21, 21, 45, '2026-09-01 10:00', NULL),
    (22, 22, 50, '2026-09-01 10:00', NULL),
    (23, 23, 25, '2026-09-01 10:00', NULL),
    (24, 24, 40, '2026-09-01 10:00', NULL),
    (25, 25, 60, '2026-09-01 10:00', NULL),
    (26, 1, 140, '2026-08-01 10:00', '2026-09-01 10:00');

PRAGMA user_version = 1;

COMMIT;
