import express from 'express'
import { addToCart, getUserCart, removeCart, removeCartItem, updateCart } from '../controllers/cartController.js'
import authUser from '../middleware/auth.js'

const cartRouter = express.Router();

cartRouter.get('/get',authUser, getUserCart);
cartRouter.post('/add',authUser, addToCart);
cartRouter.post('/update',authUser, updateCart);
cartRouter.post('/remove',authUser, removeCart);
cartRouter.post('/remove-item',authUser, removeCartItem);

export default cartRouter;