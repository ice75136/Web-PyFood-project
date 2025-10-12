import multer from 'multer';
import { storage } from '../config/cloudinary.js'; // Import storage ของ Cloudinary เข้ามา

// สร้าง instance ของ Multer โดยใช้ storage engine ของ Cloudinary
const upload = multer({ storage: storage });

export default upload;