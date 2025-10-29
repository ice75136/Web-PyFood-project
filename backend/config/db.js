import mysql from 'mysql2/promise';

let pool;

if (process.env.DATABASE_URL) {
    // --- 2. ถ้ามี (รันบน Render/Production) ---
    pool = mysql.createPool({
        uri: process.env.DATABASE_URL, // ใช้ Service URI
        
        // --- [!!! จุดที่แก้ไข !!!] ---
        ssl: {
            // สั่งให้ Node.js/mysql2 "ไม่ต้อง" ตรวจสอบใบรับรอง
            // (ยอมรับใบรับรองที่ "เซ็นเอง" ได้)
            rejectUnauthorized: false 
        },
        // -------------------------

        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('กำลังเชื่อมต่อกับฐานข้อมูล Aiven (Production)...');

} else {
    // --- 3. ถ้าไม่มี (รันบนเครื่อง Localhost/Development) ---
    pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '1234',
        database: 'pyfood',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('กำลังเชื่อมต่อกับฐานข้อมูล Localhost (Development)...');
}

// 4. ทดสอบการเชื่อมต่อ
pool.getConnection()
    .then(connection => {
        console.log('เชื่อมฐานข้อมูล MySQL สำเร็จแล้ว!!');
        connection.release();
    })
    .catch(error => {
        console.log('ไม่สามารถเชื่อต่อฐานข้อมูลได้:', error);
        process.exit(1); 
    });

export default pool;