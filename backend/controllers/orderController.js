import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import db from '../models/index.js';
import Stripe from 'stripe'

// global variables
const currency = 'thb'
const deliveryCharge = 10

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;

        // รับที่อยู่ที่จะให้จัดส่งจาก frontend
        const { user_address_id } = req.body;
        if (!user_address_id) {
            return res.status(400).json({ message: "Shipping address is required" });
        }

        // ค้นหา user และข้อมูลตะกร้า
        const user = await db.User.findByPk(userId);
        const cartData = user.cartData || {};
        const itemIds = Object.keys(cartData);

        if (itemIds.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        // --- คำนวณยอดรวม (สำคัญ: ต้องดึงราคาล่าสุดจากฐานข้อมูลเสมอ) ---
        let totalAmount = 0;
        const productsInCart = await db.Product.findAll({ where: { id: itemIds } });

        for (const product of productsInCart) {
            const quantity = cartData[product.id];
            totalAmount += product.price * quantity;
        }
        // ----------------------------------------------------------------

        // 1. สร้าง Order (หัวบิล)
        const newOrder = await db.Order.create({
            user_id: userId,
            user_address_id: user_address_id,
            total_amount: totalAmount,
            order_status: 'pending' // สถานะเริ่มต้น
        });

        // 2. สร้าง Order Items (รายการสินค้าในบิล)
        const orderItemsData = productsInCart.map(product => ({
            order_id: newOrder.id,
            product_id: product.id,
            quantity: cartData[product.id],
            price_per_unit: product.price
        }));
        await db.OrderItem.bulkCreate(orderItemsData);

        // 3. ล้างตะกร้าสินค้า
        user.cartData = {};
        user.changed('cartData', true);
        await user.save();

        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ message: "Error placing order" });
    }
};

// ฟังก์ชันสำหรับ User: อัปโหลดสลิปการชำระเงิน
const uploadPaymentSlip = async (req, res) => {
    try {
        const userId = req.user.id;
        const { orderId } = req.body;
        const slipUrl = req.file ? req.file.path : null;

        if (!slipUrl) {
            return res.status(400).json({ message: "กรุณาแนบไฟล์สลิป" });
        }

        // ค้นหาออเดอร์ และตรวจสอบว่าเป็นของ user คนนี้จริงหรือไม่
        const order = await db.Order.findOne({ where: { id: orderId, user_id: userId } });

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ หรือคุณไม่มีสิทธิ์เข้าถึง" });
        }
        
        // ไม่อนุญาตให้อัปโหลดซ้ำถ้าสถานะไม่ใช่ pending
        if (order.order_status !== 'pending') {
            return res.status(400).json({ message: "ไม่สามารถแจ้งชำระเงินสำหรับคำสั่งซื้อนี้ได้" });
        }

        // อัปเดต URL ของสลิป และเปลี่ยนสถานะ
        order.payment_slip_url = slipUrl;
        order.order_status = 'awaiting_verification'; // สถานะใหม่: รอการตรวจสอบ
        await order.save();

        res.status(200).json({ message: "อัปโหลดสลิปสำเร็จ! รอการตรวจสอบจากทางร้าน", order });

    } catch (error) {
        console.error("Error uploading payment slip:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปโหลดสลิป" });
    }
};

// ฟังก์ชันสำหรับ User: ยกเลิกคำสั่งซื้อของตัวเอง
const cancelOrder = async (req, res) => {
    try {
        const userId = req.user.id; // ID จาก token
        const { orderId } = req.body;

        // ค้นหาออเดอร์ และตรวจสอบว่าเป็นของ user คนนี้จริงหรือไม่
        const order = await db.Order.findOne({ where: { id: orderId, user_id: userId } });

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
        }

        // อนุญาตให้ยกเลิกได้เฉพาะออเดอร์ที่อยู่ในสถานะ 'pending' เท่านั้น
        if (order.order_status !== 'pending') {
            return res.status(400).json({ message: "ไม่สามารถยกเลิกคำสั่งซื้อที่ชำระเงินแล้วหรือกำลังจัดส่งได้" });
        }

        // อัปเดตสถานะเป็น 'Cancelled'
        order.order_status = 'Cancelled';
        await order.save();

        res.status(200).json({ message: "ยกเลิกคำสั่งซื้อสำเร็จ" });

    } catch (error) {
        console.error("Error cancelling order:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ" });
    }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req,res) => {
    try {
        
        const { userId,items, amount, address} = req.body
        const { origin } = req.headers;

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Stripe",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const line_items =items.map((item) => ({
            price_data: {
                currency:currency,
                product_data: {
                    name:item.name
                },
                unit_amount: item.price * 100
            },
            quantity: item.quantity
        }))

        line_items.push({
            price_data: {
                currency:currency,
                product_data: {
                    name:'Delivery Charges'
                },
                unit_amount: deliveryCharge * 100
            },
            quantity: 1
        })

        const session = await stripe.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
            line_items,
            mode: 'payment',
        })

        res.json({success:true,session_url:session.url})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// Verify Stripe
const verifyStripe = async (req,res) => {
    const { orderId, success, userId } = req.body

    try {
        if (success === "true") {
            await orderModel.findByIdAndUpdate(orderId, {payment:true});
            await userModel.findByIdAndUpdate(userId, {cartData: {}})
            res.json({success: true})
        } else {
            await orderModel.findByIdAndDelete(orderId)
            res.json({success:false})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}


const listAllOrders = async (req, res) => {
    try {
        const orders = await db.Order.findAll({
            include: [
                {
                    model: db.User, // ดึงข้อมูลผู้สั่ง
                    attributes: ['id', 'username', 'email']
                },
                {
                    model: db.OrderItem, // ดึงรายการสินค้าในบิล
                    include: {
                        model: db.Product // และดึงข้อมูลสินค้าของแต่ละรายการ
                    }
                },
                {
                    model: db.UserAddress // <-- เพิ่ม: ดึงข้อมูลที่อยู่จัดส่ง
                }
            ],
            order: [['order_date', 'DESC']]
        });
        res.status(200).json(orders);
    } catch (error) {
        console.error("Error fetching all orders:", error);
        res.status(500).json({ message: "Error fetching all orders" });
    }
};

// ฟังก์ชันสำหรับดึงประวัติการสั่งซื้อของ user ที่ login อยู่
const getMyOrders = async (req, res) => {
    try {
        // 1. ดึง userId จาก token ที่ auth middleware เตรียมไว้ให้
        const userId = req.user.id;

        // 2. ค้นหาทุก Order ที่มี user_id ตรงกัน
        // ใช้ 'include' เพื่อดึงข้อมูลที่เกี่ยวข้องกันมาด้วยในคราวเดียว
        const orders = await db.Order.findAll({
            where: { user_id: userId },
            include: {
                model: db.OrderItem, // ดึงรายการสินค้าในบิล (Order Items)
                include: {
                    model: db.Product // และในแต่ละรายการ ให้ดึงข้อมูลสินค้า (Product) มาด้วย
                }
            },
            order: [['order_date', 'DESC']] // เรียงจากออเดอร์ล่าสุดไปเก่าสุด
        });

        res.status(200).json(orders);

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ message: "Error fetching user orders" });
    }
};

// update order status from AdminPanel
const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body;

        // ค้นหา Order จาก ID
        const order = await db.Order.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // อัปเดตสถานะ
        order.order_status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status" });
    }
};

export {verifyStripe, placeOrder, uploadPaymentSlip, cancelOrder, placeOrderStripe,  listAllOrders, getMyOrders, updateStatus}