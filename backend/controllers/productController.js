import { v2 as cloudinary } from "cloudinary"
import db from '../models/index.js';


// function for add product
const addProduct = async (req, res) => {
    console.log("Data received in req.body:", req.body);
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
        const products = await db.Product.findAll({
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

// function for removing product
const removeProduct = async (req, res) => {
    try {
        console.log('Backend ได้รับคำขอลบ:', req.body);
        const { id } = req.body;

        const product = await db.Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        await product.destroy();

        res.status(200).json({ message: "Product removed successfully" });

    } catch (error) {
        console.error('Error removing product:', error);
        res.status(500).json({ message: 'Error removing product' });
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

        const { id, name, description, price, stock_quantity, category_id, product_type_id, sizes, bestseller } = req.body;

        const product = await db.Product.findByPk(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const files = req.files;
        const imageUrls = product.images || [];
        let mainImageUrl = product.image_url;

        if (files) {
            if (files.image1) {
                imageUrls[0] = files.image1[0].path;
                mainImageUrl = files.image1[0].path;
            }
            if (files.image2) imageUrls[1] = files.image2[0].path;
            if (files.image3) imageUrls[2] = files.image3[0].path;
            if (files.image4) imageUrls[3] = files.image4[0].path;
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock_quantity = stock_quantity || product.stock_quantity;
        product.category_id = category_id || product.category_id;
        product.product_type_id = product_type_id || product.product_type_id;
        product.bestseller = bestseller || product.bestseller;

        if (sizes) {
            product.sizes = JSON.parse(sizes);
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




export { listProducts, addProduct, removeProduct, singleProduct, updateProduct }

