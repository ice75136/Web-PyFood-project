import express from 'express'
import {placeOrder, placeOrderStripe, listAllOrders, verifyStripe, getMyOrders, uploadPaymentSlip, cancelOrder, getOrderById, getOrderByAdmin, updateOrderStatus} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.get('/orderlist',adminAuth,listAllOrders)
orderRouter.post('/status',adminAuth,updateOrderStatus)
orderRouter.get('/admin-receipt/:orderId', adminAuth, getOrderByAdmin);

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)

// User Feature
orderRouter.get('/myorders', authUser, getMyOrders);
orderRouter.post('/cancel', authUser, cancelOrder);

// verify payment
orderRouter.post('/upload-slip', authUser, upload.single('slip'), uploadPaymentSlip);
orderRouter.post('/verifyStripe',authUser, verifyStripe)

// ดึงข้อมูลใบเสร็จ
orderRouter.get('/:orderId', authUser, getOrderById);

export default orderRouter