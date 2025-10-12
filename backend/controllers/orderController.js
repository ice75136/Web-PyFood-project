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

// Placing orders using Razorpay Methid
const placeOrderRazorpay = async (req,res) => {
    
}

// All Orders data for admin panel
const allOrders = async (req,res) => {
    try {

        const orders = await orderModel.find({})
        res.json({success:true,orders})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// User Order Data For Frontend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

// update order status from AdminPanel
const updateStatus = async (req,res) => {
    try {
        const { orderId, status } = req.body
        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

export {verifyStripe, placeOrder, placeOrderStripe, placeOrderRazorpay, allOrders, userOrders, updateStatus}