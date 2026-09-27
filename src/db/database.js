export async function initDb(db) {
  try { //สร้างไว้เผื่อ error ใช้คู่กับ catch
    await db.execAsync(`                      
        PRAGMA foreign_keys = ON;             
        PRAGMA journal_mode = WAL;           
        CREATE TABLE IF NOT EXISTS tables ( 
         table_id INTEGER PRIMARY KEY,        
         table_number INTEGER NOT NULL UNIQUE
           CHECK (table_number BETWEEN 1 AND 15)
        );
    `);
    return { ///ให้ฟังก์ชันส่งผลกลับ ถ้าสร้าง Database สำเร็จ เราอยากให้ฟังก์ชันบอกว่า "สำเร็จ"
        ok : true,
        message : 'Database initialized successfully'
    };

  } catch (error) {
    console.error('initDb failed:',error); ///แสดง Error ถ้า Database มีปัญหา เราจะเห็น Error ใน Console

    return { ///Error ก็ให้ส่งผลกลับ
        ok: false,
        message: 'ไม่สามารถสร้าง Database'
    }
  }
}