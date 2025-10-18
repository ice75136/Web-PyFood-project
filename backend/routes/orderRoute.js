import express from 'express'
import {placeOrder, placeOrderStripe, listAllOrders, updateStatus, verifyStripe, getMyOrders, uploadPaymentSlip, cancelOrder} from '../controllers/orderController.js'
import adminAuth from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'
import upload from '../middleware/multer.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.get('/orderlist',adminAuth,listAllOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/stripe',authUser,placeOrderStripe)

// User Feature
orderRouter.get('/myorders', authUser, getMyOrders);
orderRouter.post('/cancel', authUser, cancelOrder);

// verify payment
orderRouter.post('/upload-slip', authUser, upload.single('slip'), uploadPaymentSlip);
orderRouter.post('/verifyStripe',authUser, verifyStripe)

export default orderRouter