import express from 'express';
import { addAddress, getMyAddresses, removeAddress, updateAddress } from '../controllers/addressController.js';
import authUser from '../middleware/auth.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getMyAddresses); 
addressRouter.put('/update', authUser, updateAddress); 
addressRouter.post('/remove', authUser, removeAddress);

export default addressRouter;