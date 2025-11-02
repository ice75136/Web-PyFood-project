import React, { useContext, useEffect, useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { backendUrl, currency } from '../App';

// --- 1. สร้าง Component ย่อยสำหรับแสดง Modal รูปภาพสลิป ---
const SlipViewerModal = ({ imageUrl, onClose }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4' onClick={onClose}>
            <div className='relative bg-white p-4 rounded-lg' onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Payment Slip" className='max-w-[80vw] max-h-[80vh] object-contain' />
                <button onClick={onClose} className='absolute top-2 right-2 bg-white rounded-full p-1 text-xl leading-none'>
                    &times;
                </button>
            </div>
        </div>
    );
};

const Orders = () => {
    const { token } = useAdmin();
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [activeTab, setActiveTab] = useState(() => {
        const savedTab = localStorage.getItem('adminLastOrderTab'); // ใช้ key เฉพาะสำหรับ admin
        return savedTab || 'all';
    });
    const [statusUpdates, setStatusUpdates] = useState({});

    const [slipImageUrl, setSlipImageUrl] = useState('');
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);

    const openSlipViewer = (url) => {
        setSlipImageUrl(url);
        setIsSlipModalOpen(true);
    };

    const fetchAllOrders = async () => {
        if (token) {
            try {
                console.log('Fetching orders...');
                const response = await axios.get(backendUrl + '/api/order/orderlist', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllOrders(response.data);
            } catch (error) {
                toast.error("ไม่สามารถดึงข้อมูลคำสั่งซื้อได้");
            }
        }
    };

    useEffect(() => {
        fetchAllOrders();
    }, [token]);

    useEffect(() => {
        switch (activeTab) {
            case 'pending':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'pending'));
                break;
            case 'awaiting_verification':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'awaiting_verification'));
                break;
            case 'payment_rejected': 
                setFilteredOrders(allOrders.filter(order => order.order_status === 'payment_rejected'));
                break;
            case 'to_ship':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'Processing'));
                break;
            case 'shipped':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'Shipped'));
                break;
            case 'completed':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'Completed'));
                break;
            case 'cancelled':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'Cancelled'));
                break;
            default: // 'all'
                setFilteredOrders(allOrders);
                break;
        }
        localStorage.setItem('adminLastOrderTab', activeTab);
    }, [activeTab, allOrders]);

    // --- 2. สร้างฟังก์ชันใหม่สำหรับจัดการ Dropdown และปุ่ม ---
    // ฟังก์ชันสำหรับ "พัก" ค่าที่เลือกไว้ใน State
    const handleSelectChange = (orderId, newStatus) => {
        setStatusUpdates(prev => ({
            ...prev,
            [orderId]: newStatus
        }));
    };

    // ฟังก์ชันสำหรับ "ยืนยัน" การเปลี่ยนแปลงเมื่อกดปุ่ม
    const handleStatusUpdate = async (orderId) => {
        const newStatus = statusUpdates[orderId];
        if (!newStatus) return; // ไม่มีการเปลี่ยนแปลง

        try {
            await axios.post(backendUrl + '/api/order/status',
                { orderId, status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("อัปเดตสถานะสำเร็จ");
            // ล้างค่าที่พักไว้ออก เพื่อซ่อนปุ่ม "บันทึก"
            setStatusUpdates(prev => {
                const newState = { ...prev };
                delete newState[orderId];
                return newState;
            });
            fetchAllOrders(); // โหลดข้อมูลใหม่
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการอัปเดต");
        }
    };

    const tabs = [
        { key: 'all', label: 'คำสั่งซื้อทั้งหมด' },
        { key: 'pending', label: 'รอชำระเงิน' },
        { key: 'awaiting_verification', label: 'รอตรวจสอบ' },
        { key: 'to_ship', label: 'ที่ต้องจัดส่ง' },
        { key: 'shipped', label: 'กำลังจัดส่ง' },
        { key: 'completed', label: 'จัดส่งสำเร็จ' },
        { key: 'cancelled', label: 'ยกเลิก' },
        { key: 'payment_rejected', label: 'ชำระเงินไม่ผ่าน' },
    ];

    return (
        <div className='flex flex-col gap-5 p-4 sm:p-6'>

            {isSlipModalOpen && (
                <SlipViewerModal imageUrl={slipImageUrl} onClose={() => setIsSlipModalOpen(false)} />
            )}

            <h2 className='text-2xl font-semibold'>จัดการคำสั่งซื้อ</h2>

            <nav className='flex border-b overflow-x-auto'>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => {setActiveTab(tab.key); fetchAllOrders();}}
                        className={`py-3 px-4 text-sm flex-shrink-0 transition-colors ${activeTab === tab.key ? 'border-b-2 border-blue-600 text-blue-600 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            <div className='flex flex-col gap-4 mt-4'>
                {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                        <div key={order.id} className='border rounded-lg p-4 flex flex-col gap-4'>
                            <div className='flex flex-wrap justify-between items-center text-sm border-b pb-3 gap-2'>
                                <div>
                                    <p className='font-semibold'>Order #{order.id}</p>
                                    <p className='text-xs text-gray-500'>โดย: {order.User.username} ({order.User.email})</p>
                                </div>
                                {order.payment_slip_url && (
                                    <button
                                        type="button"
                                        onClick={() => openSlipViewer(order.payment_slip_url)}
                                        className='px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200'
                                    >
                                        ดูสลิป
                                    </button>
                                )}
                            </div>
                            {order.OrderItems.map(item => (
                                <div key={item.id} className='flex items-center gap-4 text-sm'>
                                    <img src={item.Product.image_url} alt={item.Product.name} className='w-12 h-12 object-cover rounded' />
                                    <p className='flex-1 font-semibold'>{item.Product.name} <span className='text-gray-500 font-normal'>x {item.quantity}</span></p>
                                    <p>{currency}{item.price_per_unit}</p>
                                </div>
                            ))}
                            <div className='border-t pt-3 flex flex-col gap-3'>
                                {order.UserAddress && (
                                    <div className='text-xs text-gray-600'>
                                        <p className='font-semibold'>ที่อยู่จัดส่ง:</p>
                                        <p>{order.UserAddress.first_name} {order.UserAddress.last_name}, {order.UserAddress.phone}</p>
                                        <p>{order.UserAddress.house_number}, {order.UserAddress.sub_district}, {order.UserAddress.district}, {order.UserAddress.province} {order.UserAddress.postal_code}</p>
                                    </div>
                                )}
                                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                                    <p className='text-sm font-semibold'>ยอดรวม: <span className='text-lg'>{currency}{order.total_amount}</span></p>

                                    {/* --- 3. แก้ไขส่วนอัปเดตสถานะ --- */}
                                    <div className='flex items-center gap-2'>
                                        <p className='text-sm'>สถานะ:</p>
                                        <select
                                            value={statusUpdates[order.id] || order.order_status}
                                            onChange={(e) => handleSelectChange(order.id, e.target.value)}
                                            className='border rounded px-2 py-1 text-sm bg-gray-50'
                                        >
                                            <option value="pending">รอชำระเงิน</option>
                                            <option value="awaiting_verification">รอตรวจสอบ</option>
                                            <option value="Processing">กำลังเตรียมจัดส่ง</option>
                                            <option value="Shipped">กำลังจัดส่ง</option>
                                            <option value="Completed">จัดส่งสำเร็จ</option>
                                            <option value="Cancelled">ยกเลิก</option>
                                            <option value="payment_rejected">การชำระเงินไม่ถูกต้อง</option>
                                        </select>

                                        {/* ปุ่มยืนยันจะแสดงก็ต่อเมื่อมีการเลือกสถานะใหม่ */}
                                        {statusUpdates[order.id] && statusUpdates[order.id] !== order.order_status && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id)}
                                                className='px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600'
                                            >
                                                บันทึก
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className='text-center text-gray-500 py-10'>ไม่มีคำสั่งซื้อในสถานะนี้</p>
                )}
            </div>
        </div>
    );
};

export default Orders;