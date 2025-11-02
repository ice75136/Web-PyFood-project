import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    stock_quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    image_url: {
        type: DataTypes.STRING
    },
    images:  {
        type: DataTypes.JSON,
        defaultValue: []
    },
    sizes: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    bestseller: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    product_type_id: {
        type: DataTypes.INTEGER
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

export default Product;