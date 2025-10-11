import sequelize from '../config/sequelize.js';
import Category from './categoryModel.js';
import OrderItem from './orderItemModel.js';
import Order from './orderModel.js';
import Product from './productModel.js';
import ProductType from './productTypeModel.js';
import UserAddress from './userAddressModel.js';
import User from './userModel.js';


// สร้าง object db เพื่อรวบรวมทุกอย่าง
const db = {};

db.sequelize = sequelize;
db.User = User;
db.UserAddress = UserAddress;
db.Category = Category;
db.ProductType = ProductType;
db.Product = Product;
db.Order = Order;
db.OrderItem = OrderItem;

// --- กำหนดความสัมพันธ์ทั้งหมดที่นี่ ---

// 1. User <-> UserAddress (One-to-Many)
db.User.hasMany(db.UserAddress, { foreignKey: 'user_id' });
db.UserAddress.belongsTo(db.User, { foreignKey: 'user_id' });

// 2. Category <-> Product (One-to-Many)
db.Category.hasMany(db.Product, { foreignKey: 'category_id' });
db.Product.belongsTo(db.Category, { foreignKey: 'category_id' });

// 3. ProductType <-> Product (One-to-Many)
db.ProductType.hasMany(db.Product, { foreignKey: 'product_type_id' });
db.Product.belongsTo(db.ProductType, { foreignKey: 'product_type_id' });

// 4. ความสัมพันธ์ของระบบ Order
db.User.hasMany(db.Order, { foreignKey: 'user_id' });
db.Order.belongsTo(db.User, { foreignKey: 'user_id' });

db.UserAddress.hasMany(db.Order, { foreignKey: 'user_address_id' });
db.Order.belongsTo(db.UserAddress, { foreignKey: 'user_address_id' });

db.Order.hasMany(db.OrderItem, { foreignKey: 'order_id' });
db.OrderItem.belongsTo(db.Order, { foreignKey: 'order_id' });

db.Product.hasMany(db.OrderItem, { foreignKey: 'product_id' });
db.OrderItem.belongsTo(db.Product, { foreignKey: 'product_id' });


// Export object db ที่มีทุกอย่างพร้อมใช้งาน
export default db;