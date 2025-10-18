import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    order_status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // สถานะเริ่มต้นคือ 'รอการชำระเงิน'
    },
    payment_method: { // <-- เพิ่มส่วนนี้
        type: DataTypes.STRING,
        allowNull: true
    },
    payment_slip_url: { 
        type: DataTypes.STRING,
        allowNull: true
    },
    // Foreign Keys ที่จะเชื่อมกับตารางอื่น
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    user_address_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'order_date', // Map createdAt ของ Sequelize ให้ตรงกับคอลัมน์ order_date ของเรา
    updatedAt: false // เราไม่มีคอลัมน์ updatedAt
});

export default Order;