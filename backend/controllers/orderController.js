import orderModel from "../models/orderModel.js"
import userModel from "../models/userModel.js"
import db from '../models/index.js';
import Stripe from 'stripe'

// global variables
const currency = 'thb'
const deliveryCharge = 10

const DELIVERY_FEE = 50;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Placing orders using COD Method
const placeOrder = async (req, res) => {
    // 1. เริ่ม Transaction
    const t = await db.sequelize.transaction(); 

    try {
        const userId = req.user.id;
        // 2. รับ itemsToPurchase (Array of item IDs) จาก req.body
        const { user_address_id, payment_method, itemsToPurchase } = req.body; 

        if (!user_address_id) {
            await t.rollback(); 
            return res.status(400).json({ message: "Shipping address is required" });
        }
        if (!payment_method) {
            await t.rollback(); 
            return res.status(400).json({ message: "Payment method is required" });
        }
        // 3. ตรวจสอบว่ามีสินค้าที่เลือกส่งมาหรือไม่
        if (!itemsToPurchase || itemsToPurchase.length === 0) {
            await t.rollback();
            return res.status(400).json({ message: "กรุณาเลือกสินค้าที่จะซื้อ" });
        }

        const user = await db.User.findByPk(userId);
        const cartData = user.cartData || {}; // <-- นี่คือตะกร้า "ทั้งหมด"
        
        // --- 4. [!!! จุดที่ถูกต้อง !!!] ---
        // ใช้ ID จาก "itemsToPurchase" ที่ส่งมาจาก Frontend
        // ไม่ใช่จาก "cartData" ทั้งหมด
        const itemIds = itemsToPurchase; 
        // ---------------------------------

        const productsInCart = await db.Product.findAll({ 
            where: { id: itemIds }, // <-- ใช้ "itemIds" ที่ถูกต้อง (จากข้อ 4)
            lock: t.LOCK.UPDATE,
            transaction: t
        });

        // ... (การตรวจสอบ productsInCart.length, stock, Crate ID) ...
        if (productsInCart.length !== itemIds.length) {
             await t.rollback();
             return res.status(400).json({ message: "สินค้าบางรายการในตะกร้าของคุณไม่มีจำหน่ายแล้ว" });
        }

        let subTotal = 0;
        let orderItemsData = [];
        const CRATE_PRODUCT_TYPE_ID = 5;

        for (const product of productsInCart) {
            // 5. ดึงจำนวน (quantity) จากตะกร้าทั้งหมด
            const quantity = cartData[product.id]; 

            if (!quantity || quantity <= 0) {
                 await t.rollback();
                 return res.status(400).json({ message: `สินค้า ${product.name} ไม่มีอยู่ในตะกร้า` });
            }
            if (product.stock_quantity < quantity) { /* ... (rollback) ... */ }
            if (product.product_type_id === CRATE_PRODUCT_TYPE_ID && quantity > 1) { /* ... (rollback) ... */ }

            subTotal += product.price * quantity; 
            orderItemsData.push({
                product_id: product.id,
                quantity: quantity,
                price_per_unit: product.price
            });
        }

        const finalTotalAmount = subTotal + DELIVERY_FEE;
        
        const initialOrderStatus = (payment_method === 'cod') ? 'Processing' : 'pending';
        const newOrder = await db.Order.create({
            user_id: userId,
            user_address_id: user_address_id,
            total_amount: finalTotalAmount,
            order_status: initialOrderStatus,
            payment_method: payment_method
        }, { transaction: t });

        const itemsWithOrderId = orderItemsData.map(item => ({ ...item, order_id: newOrder.id }));
        await db.OrderItem.bulkCreate(itemsWithOrderId, { transaction: t });

        for (const product of productsInCart) {
            const quantity = cartData[product.id];
            await product.decrement('stock_quantity', { by: quantity, transaction: t });
        }

        // --- 6. [!!! จุดที่ถูกต้อง !!!] ---
        // ลบ "เฉพาะ" สินค้าที่ซื้อไปแล้ว (itemIds) ออกจาก cartData
        const newCartData = { ...cartData };
        for (const itemId of itemIds) { // <-- ใช้ "itemIds" ที่ถูกต้อง
            delete newCartData[itemId];
        }
        user.cartData = newCartData;
        user.changed('cartData', true);
        await user.save({ transaction: t });
        // ---------------------------------

        await t.commit(); 
        res.status(201).json({ message: "Order placed successfully", orderId: newOrder.id });

    } catch (error) {
        await t.rollback(); 
        console.error("Error placing order, transaction rolled back:", error);
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

        const order = await db.Order.findOne({ where: { id: orderId, user_id: userId } });

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
        }
        
        // --- ส่วนที่แก้ไข ---
        // อนุญาตถ้าสถานะเป็น 'pending' หรือ 'payment_rejected'
        if (order.order_status !== 'pending' && order.order_status !== 'payment_rejected') {
            return res.status(400).json({ message: "ไม่สามารถแจ้งชำระเงินสำหรับคำสั่งซื้อสถานะนี้ได้" });
        }

        order.payment_slip_url = slipUrl;
        order.order_status = 'awaiting_verification'; // เปลี่ยนเป็นรอตรวจสอบเสมอ
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
const updateOrderStatus = async (req, res) => {
    try {
        // 1. รับข้อมูลใหม่ (รวม tracking)
        const { orderId, status, shipping_carrier, tracking_code } = req.body;

        // 2. [Logic ใหม่] ตรวจสอบเงื่อนไขถ้าจะเปลี่ยนเป็น "จัดส่งแล้ว"
        if (status === 'Shipped') {
            if (!shipping_carrier || !tracking_code) {
                return res.status(400).json({ message: "กรุณาระบุบริการขนส่งและรหัสขนส่ง ก่อนเปลี่ยนสถานะ" });
            }
        }

        const order = await db.Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // 3. บันทึกข้อมูล
        order.order_status = status;
        // ถ้าสถานะคือ Shipped ให้บันทึกข้อมูลขนส่งไปด้วย
        if (status === 'Shipped') {
            order.shipping_carrier = shipping_carrier;
            order.tracking_code = tracking_code;
        }
        
        await order.save();
        res.status(200).json({ message: "Order status updated successfully", order });

    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({ message: "Error updating order status" });
    }
};

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id; // ID จาก token
        const { orderId } = req.params; // ID จาก URL

        const order = await db.Order.findOne({
            where: { 
                id: orderId, 
                user_id: userId // ตรวจสอบว่าเป็นเจ้าของออเดอร์จริง
            },
            include: [
                { model: db.UserAddress }, // ดึงข้อมูลที่อยู่
                { model: db.OrderItem, include: { model: db.Product } } // ดึงรายการสินค้าและข้อมูลสินค้า
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
        }

        res.status(200).json(order);

    } catch (error) {
        console.error("Error fetching order by ID:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
};

const getOrderByAdmin = async (req, res) => {
    try {
        const { orderId } = req.params; // ID จาก URL

        const order = await db.Order.findOne({
            where: { id: orderId }, // <-- ไม่ต้องเช็ค user_id
            include: [
                { model: db.UserAddress },
                { model: db.User, attributes: ['username', 'email'] },
                { model: db.OrderItem, include: { model: db.Product } }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "ไม่พบคำสั่งซื้อ" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error("Error fetching order by ID for admin:", error);
        res.status(500).json({ message: "เกิดข้อผิดพลาด" });
    }
};

export {verifyStripe, placeOrder, uploadPaymentSlip, cancelOrder, placeOrderStripe,  listAllOrders, getMyOrders, updateOrderStatus, getOrderById, getOrderByAdmin}