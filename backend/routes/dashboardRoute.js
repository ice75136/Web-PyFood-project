import express from 'express';
// --- 1. อัปเดต Import ---
import { getSummary, getSalesChartData, getTopProducts, getProductSales } from '../controllers/dashboardController.js';
import adminAuth from '../middleware/adminAuth.js';

const dashboardRouter = express.Router();

dashboardRouter.get('/summary', adminAuth, getSummary);
dashboardRouter.get('/sales-chart', adminAuth, getSalesChartData);
dashboardRouter.get('/top-products', adminAuth, getTopProducts);
dashboardRouter.get('/product-sales', adminAuth, getProductSales); 

export default dashboardRouter;