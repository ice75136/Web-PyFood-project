import express from 'express';
import { addAddress, getMyAddresses, removeAddress, setDefaultAddress, updateAddress } from '../controllers/addressController.js';
import authUser from '../middleware/auth.js';

const addressRouter = express.Router();

addressRouter.post('/add', authUser, addAddress);
addressRouter.get('/get', authUser, getMyAddresses); 
addressRouter.post('/set-default', authUser, setDefaultAddress);
addressRouter.put('/update', authUser, updateAddress); 
addressRouter.post('/remove', authUser, removeAddress);

export default addressRouter;