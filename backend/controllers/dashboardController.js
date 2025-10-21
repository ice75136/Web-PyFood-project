import db from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

// 1. ฟังก์ชันดึงข้อมูลสรุป
const getSummary = async (req, res) => {
    try {
        const { startDate: startDateQuery, endDate: endDateQuery } = req.query;

        let startDate = startDateQuery ? new Date(startDateQuery) : new Date(new Date().setDate(new Date().getDate() - 6));
        let endDate = endDateQuery ? new Date(endDateQuery) : new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const totalSales = await db.Order.sum('total_amount', {
            where: {
                order_date: { [Op.gte]: startDate, [Op.lte]: endDate },
                order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
            }
        });

        const totalCompletedOrders = await db.Order.count({
            where: {
                order_date: { [Op.gte]: startDate, [Op.lte]: endDate },
                order_status: 'Completed'
            }
        });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const newUsersTodayCount = await db.User.count({
            where: { created_at: { [Op.gte]: today, [Op.lt]: tomorrow } }
        });

        res.status(200).json({
            totalSales: totalSales || 0,
            totalCompletedOrders: totalCompletedOrders || 0,
            newUsersTodayCount: newUsersTodayCount || 0
        });
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: "Error fetching summary data" });
    }
};

// 2. ฟังก์ชันดึงข้อมูลกราฟ
const getSalesChartData = async (req, res) => {
    try {
        const { startDate: startDateQuery, endDate: endDateQuery, productIds: productIdsParam } = req.query;

        let orderWhereClause = {
            order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
        };
        let orderItemWhereClause = {};

        let startDate = startDateQuery ? new Date(startDateQuery) : new Date(new Date().setDate(new Date().getDate() - 6));
        let endDate = endDateQuery ? new Date(endDateQuery) : new Date();
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        orderWhereClause.order_date = { [Op.gte]: startDate, [Op.lte]: endDate };

        if (productIdsParam) {
            const productIds = productIdsParam.split(',').map(id => parseInt(id.trim()));
            if (productIds.length > 0) {
                orderItemWhereClause.product_id = { [Op.in]: productIds };
            }
        }

        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        let attributes, group, order, isDaily;
        
        if (diffDays <= 90) { 
            isDaily = true;
            attributes = [
                [fn('DATE', col('Order.order_date')), 'date'],
                'product_id',
                [fn('SUM', literal('`OrderItem`.`quantity` * `OrderItem`.`price_per_unit`')), 'totalSales']
            ];
            group = [fn('DATE', col('Order.order_date')), 'product_id', 'Product.id'];
            order = [[fn('DATE', col('Order.order_date')), 'ASC']];
        } else {
            isDaily = false;
            attributes = [
                [fn('YEAR', col('Order.order_date')), 'year'],
                [fn('MONTH', col('Order.order_date')), 'month'],
                'product_id',
                [fn('SUM', literal('`OrderItem`.`quantity` * `OrderItem`.`price_per_unit`')), 'totalSales']
            ];
            group = [fn('YEAR', col('Order.order_date')), fn('MONTH', col('Order.order_date')), 'product_id', 'Product.id'];
            order = [[fn('YEAR', col('Order.order_date')), 'ASC'], [fn('MONTH', col('Order.order_date')), 'ASC']];
        }

        let data = await db.OrderItem.findAll({
            attributes: attributes,
            where: orderItemWhereClause,
            include: [
                { model: db.Order, attributes: [], where: orderWhereClause, required: true },
                { model: db.Product, attributes: ['name'] } // <-- ต้อง Include Product
            ],
            group: group,
            order: order,
            raw: true
        });

        data = data.map(item => ({
            ...item,
            totalSales: parseFloat(item.totalSales) || 0,
            productName: item['Product.name'],
            isDaily: isDaily
        }));

        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching sales chart data:", error);
        res.status(500).json({ message: "Error fetching sales chart data" });
    }
};

// 3. ฟังก์ชันดึงสินค้าขายดี (โค้ดที่แก้ไขแล้ว)
const getTopProducts = async (req, res) => {
     try {
        const limit = parseInt(req.query.limit) || 5;
        const productIdsParam = req.query.productIds;
        let orderItemWhereClause = {};

        if (productIdsParam) {
            const productIds = productIdsParam.split(',').map(id => parseInt(id.trim()));
            if (productIds.length > 0) {
                orderItemWhereClause.product_id = { [Op.in]: productIds };
            }
        }

        const topProducts = await db.OrderItem.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalQuantitySold']
            ],
            where: orderItemWhereClause,
            include: [
                { 
                    model: db.Product, 
                    attributes: ['name'] // <-- ต้อง Include Product ที่นี่
                },
                {
                    model: db.Order,
                    attributes: [],
                    where: {
                        order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
                    },
                    required: true
                }
            ],
            group: ['product_id', 'Product.id'], // <-- ต้อง Group by Product.id ด้วย
            order: [[literal('totalQuantitySold'), 'DESC']],
            limit: limit,
            raw: true // <-- เพิ่ม raw: true
        });

        // แปลงข้อมูลที่ได้จาก raw:true
        const result = topProducts.map(item => ({
            product_id: item.product_id,
            totalQuantitySold: parseInt(item.totalQuantitySold) || 0,
            Product: {
                name: item['Product.name'] // <-- ดึงข้อมูล Product.name
            }
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching top products:", error);
        res.status(500).json({ message: "Error fetching top products" });
    }
};


// 4. (ไม่จำเป็นต้องใช้แล้ว แต่ใส่ไว้เผื่อ)
const getProductSales = async (req, res) => {
    try {
        const { startDate, endDate, productIds: productIdsParam } = req.query;
        let orderWhereClause = {
            order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
        };
        let orderItemWhereClause = {};
        let start = startDate ? new Date(startDate) : new Date(new Date().setDate(new Date().getDate() - 6));
        let end = endDate ? new Date(endDate) : new Date();
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        orderWhereClause.order_date = { [Op.gte]: start, [Op.lte]: end };

        if (productIdsParam) {
            const productIds = productIdsParam.split(',').map(id => parseInt(id.trim()));
            if (productIds.length > 0) {
                orderItemWhereClause.product_id = { [Op.in]: productIds };
            }
        }

        const productSales = await db.OrderItem.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalQuantitySold'],
                [fn('SUM', literal('quantity * price_per_unit')), 'totalRevenue']
            ],
            where: orderItemWhereClause,
            include: [
                { model: db.Product, attributes: ['name', 'price'] },
                { model: db.Order, attributes: [], where: orderWhereClause, required: true }
            ],
            group: ['product_id', 'Product.id', 'Product.name', 'Product.price'],
            order: [[literal('totalRevenue'), 'DESC']],
            raw: true
        });

        const result = productSales.map(item => ({
            productId: item.product_id,
            name: item['Product.name'],
            currentPrice: item['Product.price'],
            totalQuantitySold: parseInt(item.totalQuantitySold) || 0,
            totalRevenue: parseFloat(item.totalRevenue) || 0
        }));

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching product sales:", error);
        res.status(500).json({ message: "Error fetching product sales" });
    }
};

// 5. อัปเดต export
export { getSummary, getSalesChartData, getTopProducts, getProductSales };