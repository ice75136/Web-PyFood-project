import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const UserAddress = sequelize.define('UserAddress', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    province: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    sub_district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    postal_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    house_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    road: {
        type: DataTypes.STRING
    },
    alley: {
        type: DataTypes.STRING
    },
    villageNumber: {
        type: DataTypes.STRING,
        field: 'village_number'
    },
    address_details: {
        type: DataTypes.TEXT
    },
    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
    }
}, {
    tableName: 'user_addresses',
    timestamps: false
});

export default UserAddress;