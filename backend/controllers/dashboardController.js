import db from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

// ฟังก์ชันสำหรับดึงข้อมูลสรุป (ยอดขายวันนี้, ออเดอร์วันนี้, ผู้ใช้ใหม่วันนี้)
const getSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // ตั้งเวลาเป็นเที่ยงคืน
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const salesToday = await db.Order.sum('total_amount', {
            where: {
                order_date: { [Op.gte]: today, [Op.lt]: tomorrow },
                order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
            }
        });

        const totalCompletedOrders = await db.Order.count({
            where: { order_status: 'Completed' }
        });

        const newUsersTodayCount = await db.User.count({
            where: { created_at: { [Op.gte]: today, [Op.lt]: tomorrow } }
        });

        res.status(200).json({
            salesToday: salesToday || 0,
            totalCompletedOrders: totalCompletedOrders || 0, // <-- เปลี่ยนชื่อตัวแปร
            newUsersTodayCount: newUsersTodayCount || 0
        });
    } catch (error) {
        console.error("Error fetching summary:", error);
        res.status(500).json({ message: "Error fetching summary data" });
    }
};

// --- ส่วนที่แก้ไข: ฟังก์ชันดึงข้อมูลยอดขายสำหรับกราฟ ---
const getSalesChartData = async (req, res) => {
    try {
        const range = req.query.range || 'daily';
        const productIdsParam = req.query.productIds; // รับค่า productIds (string)

        let orderWhereClause = {
            order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
        };
        let orderItemWhereClause = {};

        const endDate = new Date();
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        if (range === 'daily') {
            startDate.setDate(endDate.getDate() - 6);
        } else if (range === 'monthly') {
            startDate.setMonth(endDate.getMonth() - 11);
            startDate.setDate(1); // เริ่มต้นที่วันที่ 1 ของเดือนแรก
        } else {
             startDate.setDate(endDate.getDate() - 6);
        }
        orderWhereClause.order_date = { [Op.gte]: startDate };

        if (productIdsParam) {
            const productIds = productIdsParam.split(',').map(id => parseInt(id.trim()));
            if (productIds.length > 0) {
                orderItemWhereClause.product_id = { [Op.in]: productIds }; // กรองตาม product_id ที่เลือก
            }
        }

        let attributes;
        let group;
        let order;

        if (range === 'daily') {
             attributes = [
                 [fn('DATE', col('Order.order_date')), 'date'],
                 'product_id', // <-- 1. เพิ่ม product_id เข้าไปใน attributes
                 [fn('SUM', literal('`OrderItem`.`quantity` * `OrderItem`.`price_per_unit`')), 'totalSales']
             ];
             group = [fn('DATE', col('Order.order_date')), 'product_id']; // <-- 2. Group ด้วย product_id ด้วย
             order = [[fn('DATE', col('Order.order_date')), 'ASC']];
         } else { // monthly
             attributes = [
                 [fn('YEAR', col('Order.order_date')), 'year'],
                 [fn('MONTH', col('Order.order_date')), 'month'],
                 'product_id', // <-- 1. เพิ่ม product_id เข้าไปใน attributes
                 [fn('SUM', literal('`OrderItem`.`quantity` * `OrderItem`.`price_per_unit`')), 'totalSales']
             ];
             group = [fn('YEAR', col('Order.order_date')), fn('MONTH', col('Order.order_date')), 'product_id']; // <-- 2. Group ด้วย product_id ด้วย
             order = [[fn('YEAR', col('Order.order_date')), 'ASC'], [fn('MONTH', col('Order.order_date')), 'ASC']];
         }

        let data = await db.OrderItem.findAll({
            attributes: attributes,
            where: orderItemWhereClause,
            include: [{
                model: db.Order,
                attributes: [],
                where: orderWhereClause,
                required: true
            }, { // <-- 3. เพิ่ม include Product เพื่อเอาชื่อสินค้า
                model: db.Product,
                attributes: ['name']
            }],
            group: group,
            order: order,
            raw: true
        });

        data = data.map(item => ({
            ...item,
            totalSales: parseFloat(item.totalSales) || 0,
            productName: item['Product.name'] // <-- ดึงชื่อสินค้าจาก JOIN
        }));

        console.log('--- Processed Sales Chart data (multiple lines):', JSON.stringify(data, null, 2));

        res.status(200).json(data);

    } catch (error) {
        console.error("Error fetching sales chart data:", error);
        res.status(500).json({ message: "Error fetching sales chart data" });
    }
};


// ฟังก์ชันสำหรับดึงข้อมูลสินค้าขายดี (โค้ดเดิมถูกต้องแล้ว)
const getTopProducts = async (req, res) => {
     try {
        const limit = parseInt(req.query.limit) || 5;
        const topProducts = await db.OrderItem.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalQuantitySold']
            ],
            include: [{ model: db.Product, attributes: ['name'] }],
            group: ['product_id', 'Product.id'],
            order: [[literal('totalQuantitySold'), 'DESC']],
            limit: limit
        });
        res.status(200).json(topProducts);
    } catch (error) {
        console.error("Error fetching top products:", error);
        res.status(500).json({ message: "Error fetching top products" });
    }
};

// --- ส่วนที่แก้ไข: ฟังก์ชันดึงยอดขายสินค้าตามช่วงเวลา (แก้ไข include ซ้ำซ้อน) ---
const getProductSales = async (req, res) => {
    try {
        const range = req.query.range || '7days';
        let startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        switch (range) { /* ... โค้ดกำหนด startDate ... */ }

        const productSales = await db.OrderItem.findAll({
            attributes: [
                'product_id',
                [fn('SUM', col('quantity')), 'totalQuantitySold']
            ],
            include: [ // include แค่ 2 model นี้พอ
                {
                    model: db.Product,
                    attributes: ['name']
                },
                {
                    model: db.Order,
                    attributes: [],
                    where: {
                        order_date: { [Op.gte]: startDate },
                         order_status: { [Op.notIn]: ['pending', 'Cancelled', 'awaiting_verification', 'payment_rejected'] }
                    },
                    required: true // ใช้ INNER JOIN เพื่อกรอง
                }
            ],
            group: ['product_id', 'Product.id'],
            order: [[literal('totalQuantitySold'), 'DESC']]
        });
        res.status(200).json(productSales);
    } catch (error) {
        console.error("Error fetching product sales:", error);
        res.status(500).json({ message: "Error fetching product sales" });
    }
};


export { getSummary, getSalesChartData, getTopProducts, getProductSales };