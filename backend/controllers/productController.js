import { v2 as cloudinary } from "cloudinary"
import productModel from "../models/productModel.js"


// function for add product
const addProduct = async (req, res) => {
    try {

        const { name, description, price, category, subCategory, sizes, bestseller } = req.body

        const image1 = req.files.image1 && req.files.image1[0]
        const image2 = req.files.image2 && req.files.image2[0]
        const image3 = req.files.image3 && req.files.image3[0]
        const image4 = req.files.image4 && req.files.image4[0]

        const images = [image1, image2, image3, image4].filter((item) => item !== undefined)

        let imagesUrl = await Promise.all(
            images.map(async (item) => {
                let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                return result.secure_url
            })
        )

        const productData = {
            name,
            description,
            category,
            price: Number(price),
            subCategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
            image: imagesUrl,
            date: Date.now()
        }

        console.log(productData);

        const product = new productModel(productData);
        await product.save()

        res.json({ success: true, message: "Product Added" })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
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

