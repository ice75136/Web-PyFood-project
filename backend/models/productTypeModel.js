import { DataTypes } from 'sequelize';
import sequelize from '../config/sequelize.js';

const ProductType = sequelize.define('ProductType', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'product_types',
    timestamps: false
});

export default ProductType;