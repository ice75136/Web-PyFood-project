import db from '../models/index.js';
import validator from 'validator';
import bcrypt from "bcryptjs"; 
import jwt from 'jsonwebtoken'


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Routes for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ success: false, message: "User doesn't exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (isMatch) {

            const token = createToken(user.id);
            res.json({ success: true, token });

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Route for user register
const registerUser = async (req, res) => {
    try {

        const { name, email, password, phone } = req.body;

        //  checking user already exists or not
        const exists = await db.User.findOne({ where: { email } });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validating email format & strong password
         if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }


        const newUser = await db.User.create({
            username: name, 
            email: email,
            password_hash: password,
            phone_number: phone
        });

        const token = createToken(newUser.id);
        res.json({ success: true, token });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id; // ID ที่ได้จาก token ใน auth middleware

        // ค้นหา user โดยไม่เอา password_hash มาด้วย
        const user = await db.User.findByPk(userId, {
            attributes: { exclude: ['password_hash'] }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Error fetching profile" });
    }
};

const changePassword = async (req, res) => {
    try {
        const userId = req.user.id; // ดึง ID จาก token ของ auth middleware
        const { currentPassword, newPassword } = req.body;

        // ค้นหาผู้ใช้
        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "ไม่พบผู้ใช้" });
        }

        // ตรวจสอบว่ารหัสผ่านปัจจุบันถูกต้องหรือไม่
        const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "รหัสผ่านปัจจุบันไม่ถูกต้อง" });
        }

        // ตรวจสอบความถูกต้องของรหัสผ่านใหม่ (เช่น ความยาว)
        if (!newPassword || newPassword.length < 8) {
            return res.status(400).json({ message: "รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร" });
        }

        // Hash รหัสผ่านใหม่
        // หมายเหตุ: Sequelize hook อาจจะไม่ทำงานตอน 'update' เราจึง hash เอง
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPassword, salt);

        // อัปเดต password_hash ในฐานข้อมูล
        await db.User.update(
            { password_hash: hashedNewPassword },
            { where: { id: userId } }
        );

        // หรืออีกวิธีคือ อัปเดต instance แล้ว save:
        // user.password_hash = newPassword; // ถ้ามี hook beforeUpdate ที่ hash ให้
        // await user.save(); // ต้องแน่ใจว่า hook ทำงานก่อนบันทึก

        res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จ" });

    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" });
    }
};

export { loginUser, registerUser, adminLogin, getProfile, changePassword } 