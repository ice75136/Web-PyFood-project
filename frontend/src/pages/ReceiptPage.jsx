import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { assets } from '../assets/assets'; 

const ReceiptPage = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const { orderId } = useParams(); L
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            if (token && orderId) {
                try {
                    const response = await axios.get(`${backendUrl}/api/order/${orderId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setOrder(response.data);
                } catch (error) {
                    console.error("Failed to fetch order:", error);
                }
            }
        };
        fetchOrder();
    }, [token, orderId]);

    if (!order) {
        return <div className='flex justify-center items-center min-h-[80vh]'>กำลังโหลดใบเสร็จ...</div>;
    }

    // ฟังก์ชันสำหรับพิมพ์
    const handlePrint = () => {
        window.print(); 
    };

    return (
        <div className='max-w-4xl mx-auto p-8 my-10 border rounded-lg bg-white shadow-lg print:shadow-none print:border-none'>
            {/* --- ส่วนปุ่ม (จะถูกซ่อนตอนพิมพ์) --- */}
            <div className='flex justify-between items-center mb-8 print:hidden'>
                <Link to="/profile/orders" className='text-blue-600 hover:underline'>&larr; กลับไปหน้ารายการสั่งซื้อ</Link>
                <button onClick={handlePrint} className='px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'>
                    พิมพ์ / บันทึกเป็น PDF
                </button>
            </div>

            {/* --- ส่วนหัวใบเสร็จ --- */}
            <div className='flex justify-between items-start border-b pb-6 mb-6'>
                <div>
                    <h1 className='text-3xl font-bold'>ใบเสร็จรับเงิน</h1>
                    <p className='text-gray-500'>Order ID: #{order.id}</p>
                    <p className='text-gray-500'>วันที่: {new Date(order.order_date).toLocaleDateString('th-TH')}</p>
                </div>
                <img src={assets.ocha_logo} alt="PY Food Logo" className='w-32' />
            </div>

            {/* --- ส่วนข้อมูลลูกค้าและที่อยู่ --- */}
            <div className='grid grid-cols-2 gap-8 mb-8'>
                <div>
                    <h3 className='font-semibold mb-2'>ที่อยู่จัดส่ง</h3>
                    <p>{order.UserAddress.first_name} {order.UserAddress.last_name}</p>
                    <p>{order.UserAddress.phone}</p>
                    <p>{order.UserAddress.house_number}, {order.UserAddress.sub_district}, {order.UserAddress.district}, {order.UserAddress.province} {order.UserAddress.postal_code}</p>
                </div>
                <div>
                    <h3 className='font-semibold mb-2'>วิธีการชำระเงิน</h3>
                    <p>{order.payment_method === 'cod' ? 'เก็บเงินปลายทาง' : 'โอนเงินผ่านธนาคาร'}</p>
                    <h3 className='font-semibold mt-4 mb-2'>สถานะ</h3>
                    <p>{order.order_status}</p>
                </div>
            </div>

            {/* --- ส่วนตารางรายการสินค้า --- */}
            <table className='w-full text-left mb-8'>
                <thead className='bg-gray-100'>
                    <tr>
                        <th className='p-3'>สินค้า</th>
                        <th className='p-3 text-center'>จำนวน</th>
                        <th className='p-3 text-right'>ราคาต่อหน่วย</th>
                        <th className='p-3 text-right'>ราคารวม</th>
                    </tr>
                </thead>
                <tbody>
                    {order.OrderItems.map(item => (
                        <tr key={item.id} className='border-b'>
                            <td className='p-3'>{item.Product.name}</td>
                            <td className='p-3 text-center'>{item.quantity}</td>
                            <td className='p-3 text-right'>{currency}{item.price_per_unit}</td>
                            <td className='p-3 text-right'>{currency}{(item.quantity * item.price_per_unit).toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* --- ส่วนสรุปยอด --- */}
            <div className='flex justify-end'>
                <div className='w-full max-w-xs'>
                    <div className='flex justify-between mb-2'>
                        <span className='text-gray-600'>ยอดรวม</span>
                        <span>{currency}{order.total_amount}</span>
                    </div>
                    {/* (ถ้ามีค่าจัดส่ง สามารถเพิ่มได้) */}
                    <div className='flex justify-between text-xl font-bold border-t pt-2'>
                        <span>ยอดสุทธิ</span>
                        <span>{currency}{order.total_amount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiptPage;