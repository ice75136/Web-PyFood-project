import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useAdmin } from '../context/AdminContext';
import { backendUrl, currency } from '../App';
import ProductMultiSelectDropdown from '../components/ProductMultiSelectDropdown';

// Import DatePicker และ date-fns
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import CSS ของ DatePicker
import { subDays } from 'date-fns'; // ใช้สำหรับตั้งค่า default

// ลงทะเบียน components ที่จำเป็นสำหรับ Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { token } = useAdmin();
    const [summary, setSummary] = useState({ totalSales: 0, totalCompletedOrders: 0, newUsersTodayCount: 0 });
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    
    // State สำหรับ Filters
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [chartStartDate, setChartStartDate] = useState(subDays(new Date(), 6));
    const [chartEndDate, setChartEndDate] = useState(new Date());

    // State สำหรับตารางยอดขายสินค้า
    const [productSalesData, setProductSalesData] = useState([]);
    const [productSalesStartDate, setProductSalesStartDate] = useState(subDays(new Date(), 6));
    const [productSalesEndDate, setProductSalesEndDate] = useState(new Date());

    // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมด
    const fetchData = async (
        pIds = selectedProductIds,
        cStart = chartStartDate,
        cEnd = chartEndDate,
        psStart = productSalesStartDate,
        psEnd = productSalesEndDate
    ) => {
        if (!token) return;
        try {
            const startDateISO = cStart.toISOString();
            const endDateISO = cEnd.toISOString();
            const productIdsParam = pIds.join(',');

            // 1. ดึง Summary
            const summaryRes = await axios.get(
                `${backendUrl}/api/admin/dashboard/summary?startDate=${startDateISO}&endDate=${endDateISO}`, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSummary(summaryRes.data);

            // 2. ดึง Sales Chart Data
            let salesApiUrl = `${backendUrl}/api/admin/dashboard/sales-chart?startDate=${startDateISO}&endDate=${endDateISO}`;
            if (pIds.length > 0) {
                salesApiUrl += `&productIds=${productIdsParam}`;
            }
            const salesRes = await axios.get(salesApiUrl, { headers: { Authorization: `Bearer ${token}` } });
            setSalesData(salesRes.data);

            // 3. ดึง Top Products
            const topProductsRes = await axios.get(`${backendUrl}/api/admin/dashboard/top-products`, { headers: { Authorization: `Bearer ${token}` } });
            setTopProducts(topProductsRes.data);
            
            // 4. ดึง Product Sales Data
            const psStartDateISO = psStart.toISOString();
            const psEndDateISO = psEnd.toISOString();
            const productSalesRes = await axios.get(
                `${backendUrl}/api/admin/dashboard/product-sales?startDate=${psStartDateISO}&endDate=${psEndDateISO}&productIds=${productIdsParam}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setProductSalesData(productSalesRes.data);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    // ฟังก์ชันดึงลิสต์สินค้าสำหรับ Dropdown
    const fetchAllProducts = async () => {
        if (token) {
            try {
                const response = await axios.get(backendUrl + '/api/product/list/all', { headers: { Authorization: `Bearer ${token}` } });
                setAllProducts(response.data.filter(p => p.is_active));
            } catch (error) {
                 console.error("Failed to fetch products for dropdown:", error);
            }
        }
    };

    // useEffect แรก: ดึงข้อมูลครั้งแรกเมื่อ token พร้อม
    useEffect(() => {
        if (token) {
            fetchAllProducts();
            fetchData();
        }
    }, [token]);

    // useEffect แยกสำหรับเรียก fetchData ใหม่เมื่อ Filters เปลี่ยน
    useEffect(() => {
        if (token) {
           fetchData(selectedProductIds, chartStartDate, chartEndDate, productSalesStartDate, productSalesEndDate);
        }
    }, [selectedProductIds, chartStartDate, chartEndDate, productSalesStartDate, productSalesEndDate]);

    // --- (โค้ดเตรียมข้อมูล Bar Chart เหมือนเดิม) ... ---
    const chartLabels = salesData.length > 0 ? Array.from(new Set(salesData.map(item => item.isDaily ? item.date : `${item.year}-${String(item.month).padStart(2, '0')}`))).sort().map(label => {
        const isDaily = salesData[0]?.isDaily;
        if (isDaily) return new Date(label).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
        const [year, month] = label.split('-').map(Number);
        const date = new Date(year, month - 1);
        return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
    }) : [];

    const barChartDatasets = [];
    if (salesData.length > 0) {
        const uniqueProducts = Array.from(new Set(salesData.map(item => item.product_id))).map(id => {
            const sampleItem = salesData.find(item => item.product_id === id);
            return { id: id, name: sampleItem.productName };
        });

        uniqueProducts.forEach((product, index) => {
            const productDataPoints = chartLabels.map(label => {
                const itemForLabel = salesData.find(item => {
                    const isDaily = item.isDaily;
                    const itemLabelFormatted = isDaily ? new Date(item.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' }) : new Date(item.year, item.month - 1).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
                    return item.product_id === product.id && itemLabelFormatted === label;
                });
                return itemForLabel ? itemForLabel.totalSales : 0;
            });

            const colors = ['rgb(53, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)', 'rgb(153, 102, 255)'];
            const colorIndex = index % colors.length;
            const borderColor = colors[colorIndex];
            const backgroundColor = borderColor.replace('rgb', 'rgba').replace(')', ', 0.5)');

            barChartDatasets.push({
                label: product.name,
                data: productDataPoints,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
            });
        });
    }

    const barChartData = { labels: chartLabels, datasets: barChartDatasets };
    const barChartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'top' }, title: { display: true, text: 'กราฟยอดขาย' } }, scales: { y: { beginAtZero: true } } };
    // ------------------------------------

    return (
        <div className='flex flex-col gap-6 p-4 sm:p-6'>
            <h2 className='text-2xl font-semibold'>แดชบอร์ด</h2>

            {/* --- ส่วน Summary Cards --- */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <p className='text-sm text-gray-500'>ยอดขาย (ตามช่วงวันที่)</p>
                    <p className='text-2xl font-bold'>{currency}{summary.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <p className='text-sm text-gray-500'>คำสั่งซื้อ (สำเร็จแล้ว)</p>
                    <p className='text-2xl font-bold'>{summary.totalCompletedOrders.toLocaleString()}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <p className='text-sm text-gray-500'>ผู้ใช้ใหม่วันนี้</p>
                    <p className='text-2xl font-bold'>{summary.newUsersTodayCount.toLocaleString()}</p>
                </div>
            </div>

            {/* --- Container กราฟ และ Top Products --- */}
            <div className='flex flex-col md:flex-row gap-6'>
                {/* --- ส่วน Sales Chart (ด้านซ้าย) --- */}
                <div className='flex-1 md:w-3/4 bg-white p-4 rounded-lg shadow flex flex-col'>
                    <div className='flex flex-wrap justify-between items-center gap-4 mb-4'>
                        <ProductMultiSelectDropdown
                            options={allProducts}
                            selectedProductIds={selectedProductIds}
                            onChange={setSelectedProductIds}
                        />
                        <div className='flex items-center gap-2 text-sm'>
                            <DatePicker
                                selected={chartStartDate}
                                onChange={(date) => setChartStartDate(date)}
                                selectsStart
                                startDate={chartStartDate}
                                endDate={chartEndDate}
                                dateFormat="dd/MM/yyyy"
                                className="border rounded px-2 py-1 w-28"
                            />
                            <span className='text-gray-500'>ถึง</span>
                            <DatePicker
                                selected={chartEndDate}
                                onChange={(date) => setChartEndDate(date)}
                                selectsEnd
                                startDate={chartStartDate}
                                endDate={chartEndDate}
                                minDate={chartStartDate}
                                dateFormat="dd/MM/yyyy"
                                className="border rounded px-2 py-1 w-28"
                            />
                        </div>
                    </div>
                    <div className='relative flex-1 min-h-[400px]'>
                        <Bar options={barChartOptions} data={barChartData} />
                        {salesData.length === 0 && (
                             <p className='absolute inset-0 flex items-center justify-center text-gray-500 bg-white bg-opacity-75'>ไม่มีข้อมูลยอดขายในช่วงเวลานี้</p>
                        )}
                    </div>
                </div>

                {/* --- ส่วน Top Products (ด้านขวา) --- */}
                <div className='md:w-1/4 bg-white p-4 rounded-lg shadow'>
                     <h3 className='text-lg font-semibold mb-3'>สินค้าขายดี 5 อันดับ</h3>
                     {topProducts.length > 0 ? (
                        <ul className='list-decimal list-inside space-y-2 text-sm'>
                            {topProducts.map((item) => (
                               <li key={item.product_id}>
                                   {item.Product ? item.Product.name : `Product ID: ${item.product_id}`} - <span className='font-medium'>{item.totalQuantitySold} ชิ้น</span>
                               </li>
                            ))}
                        </ul>
                     ) : (
                        <p className='text-gray-500'>ยังไม่มีข้อมูล</p>
                     )}
                </div>
            </div>

            {/* --- ส่วนยอดขายรายสินค้า --- */}
            <div className='bg-white p-4 rounded-lg shadow'>
                <div className='flex flex-wrap justify-between items-center mb-3 gap-4'>
                    <h3 className='text-lg font-semibold'>ยอดขายรายสินค้า</h3>
                    <div className='flex items-center gap-2 text-sm'>
                        <DatePicker
                            selected={productSalesStartDate}
                            onChange={(date) => setProductSalesStartDate(date)}
                            selectsStart
                            startDate={productSalesStartDate}
                            endDate={productSalesEndDate}
                            dateFormat="dd/MM/yyyy"
                            className="border rounded px-2 py-1 w-28"
                        />
                        <span className='text-gray-500'>ถึง</span>
                        <DatePicker
                            selected={productSalesEndDate}
                            onChange={(date) => setProductSalesEndDate(date)}
                            selectsEnd
                            startDate={productSalesStartDate}
                            endDate={productSalesEndDate}
                            minDate={productSalesStartDate}
                            dateFormat="dd/MM/yyyy"
                            className="border rounded px-2 py-1 w-28"
                        />
                    </div>
                </div>
                {productSalesData.length > 0 ? (
                    // --- ส่วนที่แก้ไข: ลบ max-h-60 และ overflow-y-auto ออก ---
                    <div>
                        <table className='w-full text-sm text-left'>
                            <thead className='text-xs text-gray-700 uppercase bg-gray-50 sticky top-0'>
                                <tr>
                                    <th scope="col" className="px-6 py-3">สินค้า</th>
                                    <th scope="col" className="px-6 py-3 text-right">ราคาปัจจุบัน</th>
                                    <th scope="col" className="px-6 py-3 text-right">จำนวนที่ขายได้</th>
                                    <th scope="col" className="px-6 py-3 text-right">ยอดขายรวม</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productSalesData.map((item) => (
                                    <tr key={item.productId} className="bg-white border-b">
                                        <td className="px-6 py-2 font-medium">{item.name || `Product ID: ${item.productId}`}</td>
                                        <td className="px-6 py-2 text-right">{currency}{Number(item.currentPrice).toFixed(2)}</td>
                                        <td className="px-6 py-2 text-right font-medium">{item.totalQuantitySold} ชิ้น</td>
                                        <td className="px-6 py-2 text-right font-medium text-blue-600">{currency}{Number(item.totalRevenue).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className='text-gray-500 text-center py-4'>ไม่มีข้อมูลยอดขายในช่วงเวลานี้</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;