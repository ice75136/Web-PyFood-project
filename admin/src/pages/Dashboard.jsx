import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

import { useAdmin } from '../context/AdminContext'; // ใช้ useAdmin
import { backendUrl, currency } from '../App'; // ใช้ App
import ProductMultiSelectDropdown from '../components/ProductMultiSelectDropdown'; // ใช้ Component Dropdown

// ลงทะเบียน components ที่จำเป็นสำหรับ Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const { token } = useAdmin(); // ดึง token จาก Context
    const [summary, setSummary] = useState({ salesToday: 0, totalCompletedOrders: 0, newUsersTodayCount: 0 });
    const [salesData, setSalesData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [chartRange, setChartRange] = useState('daily');
    const [allProducts, setAllProducts] = useState([]);
    // State สำหรับเก็บ ID สินค้าที่เลือก (เป็น Array ของ String ID)
    const [selectedProductIds, setSelectedProductIds] = useState([]);

    // ฟังก์ชันสำหรับดึงข้อมูลทั้งหมด
    const fetchData = async (cRange = chartRange, pIds = selectedProductIds) => {
        if (!token) return;
        try {
            // ดึง Summary
            const summaryRes = await axios.get(`${backendUrl}/api/admin/dashboard/summary`, { headers: { Authorization: `Bearer ${token}` } });
            setSummary(summaryRes.data);

            // ดึง Sales Chart Data (ส่ง productIds ถ้ามีการเลือก)
            let salesApiUrl = `${backendUrl}/api/admin/dashboard/sales-chart?range=${cRange === 'daily' ? 'daily' : 'monthly'}`;
            if (pIds.length > 0) {
                salesApiUrl += `&productIds=${pIds.join(',')}`; // ส่ง ID ที่คั่นด้วยจุลภาค
            }
            const salesRes = await axios.get(salesApiUrl, { headers: { Authorization: `Bearer ${token}` } });
            setSalesData(salesRes.data);

            // ดึง Top Products
            const topProductsRes = await axios.get(`${backendUrl}/api/admin/dashboard/top-products`, { headers: { Authorization: `Bearer ${token}` } });
            setTopProducts(topProductsRes.data);

        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        }
    };

    // ฟังก์ชันดึงลิสต์สินค้าสำหรับ Dropdown
    const fetchAllProducts = async () => {
        if (token) {
            try {
                const response = await axios.get(backendUrl + '/api/product/list/all', { headers: { Authorization: `Bearer ${token}` } });
                setAllProducts(response.data.filter(p => p.is_active)); // กรองเอาเฉพาะสินค้าที่ active
            } catch (error) {
                 console.error("Failed to fetch products for dropdown:", error);
            }
        }
    };

    // useEffect แรก: ดึงข้อมูลครั้งแรกเมื่อ token พร้อม และตั้ง Interval
    useEffect(() => {
        if (token) {
            fetchAllProducts();
            fetchData();
            // const intervalId = setInterval(fetchData, 3600000); // เรียกซ้ำทุกชั่วโมง
            // return () => clearInterval(intervalId);
        }
    }, [token]);

    // useEffect แยกสำหรับเรียก fetchData ใหม่เมื่อ Range หรือ Product เปลี่ยน
    useEffect(() => {
        if (token) {
           fetchData(chartRange, selectedProductIds);
        }
    }, [chartRange, selectedProductIds]);

    // --- เตรียมข้อมูลสำหรับ Chart.js ---
    // 1. หา Labels (วันที่/เดือน) ทั้งหมดที่มีในข้อมูล
    const chartLabels = salesData.length > 0
        ? Array.from(new Set(salesData.map(item => {
            if (chartRange === 'daily') return item.date; // ใช้ YYYY-MM-DD
            return `${item.year}-${String(item.month).padStart(2, '0')}`; // ใช้ YYYY-MM
          })))
          .sort() // เรียงวันที่/เดือน
          .map(label => { // แปลง format สำหรับแสดงผล
            if (chartRange === 'daily') return new Date(label).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' });
            const [year, month] = label.split('-').map(Number);
            const date = new Date(year, month - 1);
            return date.toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
          })
        : [];

    // 2. สร้าง Datasets สำหรับกราฟ
    const lineChartDatasets = [];
    if (salesData.length > 0) {
        // หา Product ID/Name ที่มีในข้อมูลปัจจุบัน
        const uniqueProducts = Array.from(new Set(salesData.map(item => item.product_id)))
                                    .map(id => {
                                        const sampleItem = salesData.find(item => item.product_id === id);
                                        return { id: id, name: sampleItem.productName };
                                    });

        uniqueProducts.forEach((product, index) => {
            const productDataPoints = chartLabels.map(label => {
                // หาข้อมูลยอดขายของสินค้านี้ ในวัน/เดือนนี้
                const itemForLabel = salesData.find(item => {
                    const itemLabelFormatted = chartRange === 'daily'
                                        ? new Date(item.date).toLocaleDateString('th-TH', { month: 'short', day: 'numeric' })
                                        : new Date(item.year, item.month - 1).toLocaleDateString('th-TH', { year: 'numeric', month: 'short' });
                    return item.product_id === product.id && itemLabelFormatted === label;
                });
                return itemForLabel ? itemForLabel.totalSales : 0; // ถ้าไม่มียอดขาย ให้เป็น 0
            });

            // กำหนดสี (อาจจะใช้ชุดสีที่กำหนดไว้ล่วงหน้าดีกว่าสุ่ม)
            const colors = ['rgb(53, 162, 235)', 'rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)', 'rgb(153, 102, 255)'];
            const colorIndex = index % colors.length;
            const borderColor = colors[colorIndex];
            const backgroundColor = borderColor.replace('rgb', 'rgba').replace(')', ', 0.2)');

            lineChartDatasets.push({
                label: product.name,
                data: productDataPoints,
                borderColor: borderColor,
                backgroundColor: backgroundColor,
                tension: 0.3,
                fill: false
            });
        });
    }

    const lineChartData = {
        labels: chartLabels,
        datasets: lineChartDatasets // ใช้ datasets ที่สร้างขึ้น
    };

     const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'กราฟยอดขาย' },
        },
        scales: { y: { beginAtZero: true } }
    };
    // ------------------------------------

    return (
        <div className='flex flex-col gap-6 p-4 sm:p-6'>
            <h2 className='text-2xl font-semibold'>แดชบอร์ด</h2>

            {/* --- ส่วน Summary Cards --- */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <p className='text-sm text-gray-500'>ยอดขายวันนี้</p>
                    <p className='text-2xl font-bold'>{currency}{summary.salesToday.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className='bg-white p-4 rounded-lg shadow'>
                    <p className='text-sm text-gray-500'>คำสั่งซื้อทั้งหมด (สำเร็จแล้ว)</p>
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
                        {/* Dropdown เลือกสินค้า (Multi-select Checkbox) */}
                        <ProductMultiSelectDropdown
                            options={allProducts} // ส่ง list สินค้าทั้งหมดไปให้
                            selectedProductIds={selectedProductIds} // ส่ง state ปัจจุบันไป
                            onChange={setSelectedProductIds} // ส่ง state setter ไป
                        />
                        {/* ปุ่มเลือกช่วงเวลา */}
                        <div className='flex gap-2'>
                            <button onClick={() => setChartRange('daily')} className={`px-3 py-1 text-xs rounded ${chartRange === 'daily' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>รายวัน</button>
                            <button onClick={() => setChartRange('monthly')} className={`px-3 py-1 text-xs rounded ${chartRange === 'monthly' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>รายเดือน</button>
                        </div>
                    </div>
                    {/* ส่วนแสดงกราฟ */}
                    <div className='relative flex-1 min-h-[400px]'>
                        {/* แสดงกราฟเสมอ */}
                        <Line options={lineChartOptions} data={lineChartData} />
                        {/* แสดงข้อความทับ ถ้าไม่มีข้อมูล */}
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
                                   {item.Product.name} - <span className='font-medium'>{item.totalQuantitySold} ชิ้น</span>
                               </li>
                            ))}
                        </ul>
                     ) : (
                        <p className='text-gray-500'>ยังไม่มีข้อมูล</p>
                     )}
                </div>

            </div>
        </div>
    );
};

export default Dashboard;