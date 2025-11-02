import { v2 as cloudinary } from "cloudinary"
import db from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';


// function for add product
const addProduct = async (req, res) => {
    try {
        const { name, description, price, stock_quantity, category_id, product_type_id, sizes } = req.body;
        const files = req.files;

        if (!name || !price || !category_id || !stock_quantity) {
            return res.status(400).json({ message: "Name, price, category, and stock are required" });
        }

        // จัดการรูปภาพ (เหมือนเดิม)
        let mainImageUrl = null;
        let imageUrls = [];
        if (files) {
            if (files.image1) { mainImageUrl = files.image1[0].path; imageUrls.push(files.image1[0].path); }
            if (files.image2) imageUrls.push(files.image2[0].path);
            if (files.image3) imageUrls.push(files.image3[0].path);
            if (files.image4) imageUrls.push(files.image4[0].path);
        }
        
        // แปลง sizes
        const sizesArray = sizes ? [sizes] : [];

        // --- ส่วนที่แก้ไข: สร้าง Product โดยใช้ category_id ---
        const newProduct = await db.Product.create({
            name,
            description,
            price: Number(price),
            stock_quantity: Number(stock_quantity),
            image_url: mainImageUrl,
            images: imageUrls,
            sizes: sizesArray,
            category_id: category_id, // <-- ใช้ category_id (ตัวเดียว)
            product_type_id: product_type_id,
            is_active: true
        });

        res.status(201).json(newProduct);

    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }
};

// function for list product
const listProducts = async (req, res) => {
    try {
        const products = await db.Product.findAll({
            where: { is_active: true },
            include: [
                { model: db.Category },
                { model: db.ProductType }
            ]
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

// ฟังก์ชันสำหรับ Admin: ดึงสินค้าทั้งหมด (ทั้ง active และ inactive)
const listAllProductsForAdmin = async (req, res) => {
    try {
        const products = await db.Product.findAll({
            include: [
                { model: db.Category },
                { model: db.ProductType }
            ],
            order: [['id', 'DESC']] // เรียงตาม ID ล่าสุด
        });
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching all admin products:", error);
        res.status(500).json({ message: "Error fetching products" });
    }
};

// ฟังชั่นสำหรับซ่อนสินค้าให้ไม่แสดง
const removeProduct = async (req, res) => {
    try {
        const { id } = req.body;
        const product = await db.Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        product.is_active = false;
        await product.save();

        res.status(200).json({ message: "Product has been archived" });

    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ message: 'Error removing product' });
    }
};

// ฟังก์ชันสำหรับ Admin: กู้คืนสินค้าที่ถูกซ่อน
const restoreProduct = async (req, res) => {
    try {
        const { id } = req.body;

        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // ตั้งค่าให้สินค้ากลับมาแอคทีฟ
        product.is_active = true;
        await product.save();

        res.status(200).json({ message: "Product has been restored" });

    } catch (error) {
        console.error('Error restoring product:', error);
        res.status(500).json({ message: 'Error restoring product' });
    }
};

// ฟังก์ชันสำหรับ Admin: ลบสินค้าแบบถาวร (Hard Delete)
const hardDeleteProduct = async (req, res) => {
    try {
        const { id } = req.body;

        // 1. ค้นหาสินค้าที่จะลบ
        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // 2. (สำคัญมาก) ลบข้อมูลที่เกี่ยวข้องใน order_items ก่อน
        await db.OrderItem.destroy({
            where: { product_id: id }
        });

        // 3. สั่งลบสินค้าออกจากฐานข้อมูลอย่างถาวร
        await product.destroy();

        res.status(200).json({ message: "Product has been permanently deleted" });

    } catch (error) {
        console.error('Error hard deleting product:', error);
        res.status(500).json({ message: 'Error hard deleting product' });
    }
};

// function for single product info
const singleProduct = async (req, res) => {
    try {
        const { productId } = req.body;
        const product = await db.Product.findByPk(productId, {
            include: [
                { model: db.Category },
                { model: db.ProductType }
            ]
        });

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        res.json({ success: true, product });

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}

const updateProduct = async (req, res) => {
    try {
        // --- ส่วนที่แก้ไข: รับ category_id (ตัวเดียว) ---
        const { id, name, description, price, stock_quantity, category_id, product_type_id, sizes } = req.body;

        const product = await db.Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // --- ลบ setCategories() ออก ---

        // จัดการรูปภาพ (เหมือนเดิม)
        const files = req.files;
        let mainImageUrl = product.image_url;
        let imageUrls = product.images || [];
        if (files) {
            if (files.image1) { imageUrls[0] = files.image1[0].path; mainImageUrl = files.image1[0].path; }
            if (files.image2) imageUrls[1] = files.image2[0].path;
            if (files.image3) imageUrls[2] = files.image3[0].path;
            if (files.image4) imageUrls[3] = files.image4[0].path;
        }

        // --- ส่วนที่แก้ไข: อัปเดต field ---
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (stock_quantity !== undefined) product.stock_quantity = stock_quantity;
        if (product_type_id !== undefined) product.product_type_id = product_type_id;
        if (category_id !== undefined) product.category_id = category_id; // <-- ใช้วิธีนี้
        
        if (sizes) {
            product.sizes = sizes ? [sizes] : []; // แปลงเป็น Array (ตัวเดียว)
        }
        product.image_url = mainImageUrl;
        product.images = imageUrls;
        
        await product.save();
        res.status(200).json({ message: "Product updated successfully", product: product });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

const getBestSellers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5; // เอา 5 อันดับแรก

        // 1. ค้นหา ID ของสินค้าที่ขายดีที่สุด
        const topProductIds = await db.OrderItem.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalQuantitySold']
            ],
            include: [
                {
                    model: db.Order, // Join Order เพื่อกรองสถานะ
                    attributes: [],
                    where: { 
                        order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
                    },
                    required: true 
                },
                 {
                    model: db.Product, // Join Product เพื่อกรอง is_active
                    attributes: [],
                    where: { is_active: true }, // เอาเฉพาะสินค้าที่ยังขายอยู่
                    required: true
                }
            ],
            group: ['product_id'],
            order: [[literal('totalQuantitySold'), 'DESC']],
            limit: limit,
            raw: true
        });

        // 2. ดึงข้อมูลสินค้าฉบับเต็มของ ID ที่ได้มา
        const productIds = topProductIds.map(item => item.product_id);

        const bestSellers = await db.Product.findAll({
            where: {
                id: { [Op.in]: productIds },
                is_active: true
            },
            include: [
                { model: db.Category },
                { model: db.ProductType }
            ]
        });
        
        // 3. เรียงลำดับข้อมูลที่ได้มาใหม่ ตามยอดขาย (เพราะ findAll ไม่การันตีลำดับ)
        const sortedBestSellers = productIds.map(id => bestSellers.find(p => p.id === id)).filter(Boolean);

        res.status(200).json(sortedBestSellers);

    } catch (error) {
        console.error("Error fetching best sellers:", error);
        res.status(500).json({ message: "Error fetching best sellers" });
    }
};


export { listProducts, listAllProductsForAdmin, addProduct, removeProduct, restoreProduct, hardDeleteProduct, singleProduct, updateProduct, getBestSellers }

