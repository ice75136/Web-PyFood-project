import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"
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

        const { name, description, price, stock_quantity, category_id, product_type_id } = req.body;

        if (!name || !price || !category_id) {
            return res.status(400).json({ message: 'Name, price, and category are required'})
        }

        const newProduct = await db.Product.create({
            name: name,
            description: description,
            price: price,
            stock_quantity: stock_quantity,
            category_id: category_id,
            product_type_id: product_type_id,
            image_url: imageUrls.length > 0 ? imageUrls[0] : null,
            images: imageUrls
        });

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({ message: 'Error adding product', error: error.message });
    }

}

// function for list product
const listProducts = async (req, res) => {
    try {

        const products = await productModel.find({});
        res.json({ success: true, products })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// function for removing product
const removeProduct = async (req, res) => {
    try {

        await productModel.findByIdAndDelete(req.body.id)
        res.json({ success: true, message: "Product Removed" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for single product info
const singleProduct = async (req, res) => {
    try {

        const { productId } = req.body
        const product = await productModel.findById(productId)
        res.json({ success: true, product })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// function for update product 
const updateProduct = async (req, res) => {
    try {
        const {
            _id,
            productId,
            name,
            description,
            price,
            category,
            subCategory,
            sizes,
            bestseller,
        } = req.body;

        const id = _id || productId;

        // ดึงข้อมูลสินค้าปัจจุบันมาก่อน
        const product = await productModel.findById(id);
        if (!product) {
            return res.json({ success: false, message: "ไม่พบสินค้า" });
        }

        // ------------------ จัดการรูป ------------------
        const image1 = req.files?.image1?.[0];
        const image2 = req.files?.image2?.[0];
        const image3 = req.files?.image3?.[0];
        const image4 = req.files?.image4?.[0];

        const images = [image1, image2, image3, image4].filter(Boolean);

        let imagesUrl = [];

        if (images.length > 0) {
            // ถ้ามีรูปใหม่ → อัพโหลด Cloudinary
            imagesUrl = await Promise.all(
                images.map(async (item) => {
                    let result = await cloudinary.uploader.upload(item.path, {
                        resource_type: "image",
                    });
                    return result.secure_url;
                })
            );
        }

        // รวมรูปเดิมกับรูปใหม่ (ถ้าอยาก replace ทั้งหมดใช้ imagesUrl แทน product.image)
        const finalImages = [...product.image];

        // ถ้ามีไฟล์ใหม่ → อัพโหลด
        if (image1) {
            const result = await cloudinary.uploader.upload(image1.path, { resource_type: "image" });
            finalImages[0] = result.secure_url; // แทนตำแหน่ง index 0 (รูปแรก)
        }
        if (image2) {
            const result = await cloudinary.uploader.upload(image2.path, { resource_type: "image" });
            finalImages[1] = result.secure_url; // index 1 (รูปสอง)
        }
        if (image3) {
            const result = await cloudinary.uploader.upload(image3.path, { resource_type: "image" });
            finalImages[2] = result.secure_url;
        }
        if (image4) {
            const result = await cloudinary.uploader.upload(image4.path, { resource_type: "image" });
            finalImages[3] = result.secure_url;
        }

        // ------------------ อัพเดทข้อมูล ------------------
        const updated = await productModel.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price: Number(price),
                category,
                subCategory,
                sizes: sizes ? JSON.parse(sizes) : product.sizes,
                bestseller: bestseller === "true" || bestseller === true,
                image: finalImages,
            },
            { new: true }
        );

        res.json({ success: true, message: "Product Updated", product: updated });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};




export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }

