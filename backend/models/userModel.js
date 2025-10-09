import { DataTypes } from "sequelize";
import sequelise from "../config/sequelize.js";
import bcrypt from 'bcryptjs';


const User = sequelise.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  // สำหรับ cartData ที่เป็น Object เราใช้ DataTypes.JSON ซึ่งยืดหยุ่นมาก
  cartData: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  // Model options
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false, // เราไม่มีคอลัมน์ updatedAt
  hooks: {
    // เข้ารหัสรหัสผ่านก่อนบันทึกลง DB เสมอ
    beforeCreate: async (user) => {
      if (user.password_hash) {
        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(user.password_hash, salt);
      }
    }
  }
});

// เราจะกำหนดความสัมพันธ์ (Associations) กับ Address ในไฟล์อื่น
export default User;