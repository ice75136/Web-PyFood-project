import { v2 as cloudinary } from "cloudinary"
import db from '../models/index.js';


// function for add product
const addProduct = async (req, res) => {
    try {
        const files = req.files;
        const imageUrls = [];

        if (files) {
            if (files.image1) imageUrls.push(files.image1[0].path);
            if (files.image2) imageUrls.push(files.image2[0].path);
            if (files.image3) imageUrls.push(files.image3[0].path);
            if (files.image4) imageUrls.push(files.image4[0].path);
        }

        // <-- 1. แก้ไข: รับ category_ids เป็น Array
        const { name, description, price, stock_quantity, category_ids, product_type_id, sizes, bestseller } = req.body;

        if (!name || !price) {
            return res.status(400).json({ message: 'Name and price are required' });
        }

        // <-- 2. แก้ไข: สร้าง Product ก่อน แล้วค่อยกำหนด Categories
        const newProduct = await db.Product.create({
            name: name,
            description: description,
            price: price,
            stock_quantity: stock_quantity,
            // ** ไม่ต้องมี category_id ที่นี่แล้ว **
            product_type_id: product_type_id,
            image_url: imageUrls.length > 0 ? imageUrls[0] : null,
            images: imageUrls,
            sizes: sizes ? JSON.parse(sizes) : [],
            bestseller: bestseller === 'true' || bestseller === true
        });

        // <-- 3. แก้ไข: กำหนด Categories หลังจากสร้าง Product เสร็จ
        // Frontend ต้องส่ง category_ids เป็น JSON Array String เช่น '["1","3"]'
        if (category_ids) {
            const parsedCategoryIds = JSON.parse(category_ids);
            if (parsedCategoryIds && parsedCategoryIds.length > 0) {
                await newProduct.setCategories(parsedCategoryIds);
            }
        }

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
        const { id, name, description, price, stock_quantity, category_ids, product_type_id, sizes, bestseller } = req.body;

        const product = await db.Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // --- จัดการ Categories ---
        if (category_ids) {
            const parsedCategoryIds = JSON.parse(category_ids);
            await product.setCategories(parsedCategoryIds);
        }

        // --- จัดการรูปภาพ ---
        const files = req.files;
        let mainImageUrl = product.image_url;
        let imageUrls = product.images || [];
        if (files) {
            if (files.image1) { imageUrls[0] = files.image1[0].path; mainImageUrl = files.image1[0].path; }
            if (files.image2) imageUrls[1] = files.image2[0].path;
            if (files.image3) imageUrls[2] = files.image3[0].path;
            if (files.image4) imageUrls[3] = files.image4[0].path;
        }

        // --- ส่วนที่แก้ไข: อัปเดต field อื่นๆ ด้วยวิธีที่ถูกต้อง ---
        // เราจะเช็คว่ามีการส่งค่ามาหรือไม่ (แม้จะเป็น 0 หรือ false)
        if (name !== undefined) product.name = name;
        if (description !== undefined) product.description = description;
        if (price !== undefined) product.price = price;
        if (stock_quantity !== undefined) product.stock_quantity = stock_quantity;
        if (product_type_id !== undefined) product.product_type_id = product_type_id;
        
        // สำหรับ bestseller ต้องเช็คเป็นพิเศษเพราะข้อมูลจาก form-data มาเป็น string
        if (bestseller !== undefined) {
            product.bestseller = (bestseller === 'true' || bestseller === true);
        }
        
        // สำหรับ sizes และ images
        if (sizes) {
            product.sizes = JSON.parse(sizes);
        }
        product.image_url = mainImageUrl;
        product.images = imageUrls;
        
        // สั่งบันทึกการเปลี่ยนแปลงทั้งหมด
        await product.save();

        res.status(200).json({ message: "Product updated successfully", product: product });

    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product' });
    }
};




export { listProducts, listAllProductsForAdmin, addProduct, removeProduct, restoreProduct, hardDeleteProduct, singleProduct, updateProduct }

