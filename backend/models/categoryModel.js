import { DataTypes } from "sequelize"
import sequelize from "../config/sequelize"

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type:DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    tableName: 'categories',
    timestamps: false
});

export default Category;