import userModel from "../models/userModel.js"
import db from '../models/index.js';


// add products to user cart
const addToCart = async (req, res) => {
    try {

        const userId = req.user.id; // ดึง id ของ user จาก token ที่ middleware ถอดรหัสให้
        const { itemId } = req.body; // id ของสินค้าที่จะเพิ่ม

        const user = await db.User.findByPk(userId);
        let cartData = user.cartData || {};

        cartData[itemId] = (cartData[itemId] || 0) + 1;

        user.cartData = cartData;
        user.changed('cartData', true); // บอก Sequelize ว่า JSON field นี้มีการเปลี่ยนแปลง
        await user.save();

        res.status(200).json({ message: "Item added to cart", cartData });
        
    } catch (error) {
        console.error("Error adding to cart: ", error);
        res.status(500).json({ message: "Error adding to cart" });
    }
}

// update user cart
const updateCart = async (req, res) => {
    try {

        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.cartData;

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, {cartData})
        res.json({ success: true, message: "Cart Updated" })
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// get user cart data
const getUserCart = async (req, res) => {

    try {

        const userId = req.user.id;
        const user = await db.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const cartData = user.cartData || {};
        const itemIds = Object.keys(cartData); // ดึง id ของสินค้าทั้งหมดในตะกร้า

        if (itemIds.length === 0) {
            return res.status(200).json([]); // ส่งตะกร้าว่างกลับไป
        }

        // ค้นหาสินค้าทั้งหมดที่มี id อยู่ในตะกร้า
        const productsInCart = await db.Product.findAll({
            where: {
                id: itemIds
            }
        });

        const responseData = productsInCart.map(product => ({
            ...product.toJSON(), // ข้อมูลสินค้าทั้งหมด (name, price, image_url, etc.)
            quantity: cartData[product.id] // เพิ่มจำนวนสินค้าในตะกร้าเข้าไป
        }));
        
        res.status(200).json(responseData);
    } catch (error) {
        console.error("Error getting cart: ", error);
        res.status(500).json({ message: "Error getting cart" });
    }
}

const removeCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.body;

        const user = await db.User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        let cartData = user.cartData || {};

        // ตรวจสอบว่ามีสินค้านี้ในตะกร้าหรือไม่
        if (cartData[itemId] > 0) {
            cartData[itemId] -= 1; // ลดจำนวนลง 1
        }
        
        // ถ้าลดแล้วเหลือ 0 ให้ลบ key นั้นออกจาก object ไปเลย
        if(cartData[itemId] === 0){
            delete cartData[itemId];
        }

        user.cartData = cartData;
        user.changed('cartData', true);
        await user.save();

        res.status(200).json({ message: "Item removed from cart", cartData });

    } catch (error) {
        console.error("Error removing from cart: ", error);
        res.status(500).json({ message: "Error removing from cart" });
    }
}

export { addToCart, updateCart, getUserCart, removeCart }