import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'pyfood',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection()
    .then(connection => {
        console.log('เชื่อมฐานข้อมูล MySQL สำเร็จแล้ว!!');
        connection.release();
    })
    .catch(error => {
        console.log('ไม่สามารถเชื่อต่อฐานข้อมูลได้:', error);
    });

export default pool;