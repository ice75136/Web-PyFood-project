import mysql from 'mysql2/promise';

// --- เชื่อมต่อกับ Localhost (Development) ---
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pyfood',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('กำลังเชื่อมต่อกับฐานข้อมูล Localhost (Development)...');

// --- ทดสอบการเชื่อมต่อ ---
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