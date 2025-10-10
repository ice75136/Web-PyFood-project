import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UserAddress = sequelize.define('UserAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    address_line1: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    address_line2: {
        type: DataTypes.TEXT
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'user_addresses',
    timestamps: false 
});

export default UserAddress;