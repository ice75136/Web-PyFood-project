import { DataTypes } from "sequelize";
import sequelize from "../config/sequelize.js";

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.INTEGER,
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
        type: DataTypes.INTEGER
    },
    Product_type_id: {
        type: DataTypes.INTEGER
    }
}, {
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updateAt: false
});

export default Product;