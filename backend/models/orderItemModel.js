import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price_per_unit: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // Foreign Keys
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'order_items',
    timestamps: false // ตารางนี้เราไม่ต้องการ created_at, updated_at
});

export default OrderItem;