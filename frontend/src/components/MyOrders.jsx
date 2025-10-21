import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import UploadSlipModal from './UploadSlipModal'; // Import Component Modal
import { useNavigate, Link, useLocation } from 'react-router-dom';

// --- Component ย่อยสำหรับ Pop-up ยืนยันการยกเลิก ---
const CancelConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4'>
            <div className='bg-white p-6 rounded-lg shadow-lg text-center w-full max-w-sm'>
                <h3 className='text-lg font-semibold mb-2'>ยืนยันการยกเลิก</h3>
                <p className='mb-6 text-gray-600'>คุณแน่ใจหรือไม่ว่าต้องการยกเลิกคำสั่งซื้อนี้?</p>
                <div className='flex justify-center gap-4'>
                    <button onClick={onCancel} className='px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300'>ไม่, เก็บไว้</button>
                    <button onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700'>ใช่, ยกเลิก</button>
                </div>
            </div>
        </div>
    );
};

// --- Component ย่อยสำหรับแสดง Modal รูปภาพสลิป ---
const SlipViewerModal = ({ imageUrl, onClose }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4' onClick={onClose}>
            <div className='relative bg-white p-4 rounded-lg' onClick={(e) => e.stopPropagation()}>
                <img src={imageUrl} alt="Payment Slip" className='max-w-[80vw] max-h-[80vh] object-contain' />
                <button onClick={onClose} className='absolute -top-3 -right-3 bg-white rounded-full p-1 px-3 text-xl leading-none shadow-lg'>
                    &times;
                </button>
            </div>
        </div>
    );
};

// Object สำหรับแปลสถานะเป็นภาษาไทย
const statusThai = {
    pending: "ที่ต้องชำระ",
    awaiting_verification: "รอการตรวจสอบ",
    payment_rejected: "การชำระเงินไม่ถูกต้อง",
    Processing: "กำลังเตรียมจัดส่ง",
    Shipped: "จัดส่งแล้ว",
    Completed: "สำเร็จแล้ว",
    Cancelled: "ยกเลิก"
};

const MyOrders = () => {
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    // อ่านค่า activeTab เริ่มต้น
    const [activeTab, setActiveTab] = useState(() => {
        if (location.state?.fromPlaceOrder) {
            return 'to_pay'; // ถ้ามาจากหน้าสั่งซื้อ ให้เปิดแท็บ "ที่ต้องชำระ"
        }
        const savedTab = localStorage.getItem('lastOrderTab'); // มิฉะนั้น ให้โหลดแท็บที่เคยเปิดไว้
        return savedTab || 'all';
    });
    
    // State สำหรับ Modal แจ้งชำระเงิน
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [orderForUpload, setOrderForUpload] = useState(null);

    // State สำหรับ Pop-up ยืนยันยกเลิก
    const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    // State สำหรับ Modal ดูสลิป
    const [isSlipViewerOpen, setIsSlipViewerOpen] = useState(false);
    const [slipImageUrl, setSlipImageUrl] = useState('');

    // ดึงข้อมูลออเดอร์ทั้งหมด
    const fetchOrders = async () => {
        if (token) {
            try {
                const response = await axios.get(backendUrl + '/api/order/myorders', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        }
    };

    // useEffect แรก: ดึงข้อมูลครั้งแรกเมื่อ token พร้อม
    useEffect(() => {
        fetchOrders();
    }, [token]);

    // เคลียร์ location state หลังจากโหลด (ถ้ามี)
    useEffect(() => {
        if (location.state?.fromPlaceOrder) {
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    // useEffect ที่สอง: กรองข้อมูล และ บันทึกแท็บลง localStorage
    useEffect(() => {
        switch (activeTab) {
            case 'to_pay':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'pending' || order.order_status === 'payment_rejected'));
                break;
            case 'awaiting_verification':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'awaiting_verification'));
                break;
            case 'to_ship':
                setFilteredOrders(allOrders.filter(order => order.order_status === 'Processing'));
                break;
            case 'to_receive':
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
        localStorage.setItem('lastOrderTab', activeTab);
    }, [activeTab, allOrders]);
    
    // ฟังก์ชันสำหรับเปิด Modal แจ้งชำระเงิน
    const handleNotifyPayment = (order) => {
        setOrderForUpload(order);
        setIsUploadModalOpen(true);
    };

    // ฟังก์ชันสำหรับเปิด Pop-up ยืนยันยกเลิก
    const handleCancelClick = (orderId) => {
        setOrderToCancel(orderId);
        setIsConfirmCancelOpen(true);
    };

    // ฟังก์ชันสำหรับยิง API เมื่อกดยืนยันยกเลิก
    const confirmCancelOrder = async () => {
        if (!orderToCancel) return;
        try {
            const response = await axios.post(
                `${backendUrl}/api/order/cancel`,
                { orderId: orderToCancel },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            if (response.status === 200) {
                toast.success("ยกเลิกคำสั่งซื้อสำเร็จ");
                fetchOrders(); // โหลดข้อมูลใหม่
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
        } finally {
            setIsConfirmCancelOpen(false);
            setOrderToCancel(null);
        }
    };

    // ฟังก์ชันสำหรับเปิด Modal ดูสลิป
    const openSlipViewer = (url) => {
        setSlipImageUrl(url);
        setIsSlipViewerOpen(true);
    };

    // ข้อมูลสำหรับสร้าง Navbar
    const tabs = [
        { key: 'all', label: 'ทั้งหมด' },
        { key: 'to_pay', label: 'ที่ต้องชำระ' },
        { key: 'awaiting_verification', label: 'รอตรวจสอบ' },
        { key: 'to_ship', label: 'ที่ต้องจัดส่ง' },
        { key: 'to_receive', label: 'ที่ต้องได้รับ' },
        { key: 'completed', label: 'สำเร็จแล้ว' },
        { key: 'cancelled', label: 'ยกเลิก' },
    ];

    return (
        <div className='flex flex-col gap-5'>
            {/* แสดง Modal อัปโหลดสลิป ตามเงื่อนไข */}
            {isUploadModalOpen && (
                <UploadSlipModal 
                    order={orderForUpload}
                    onClose={() => setIsUploadModalOpen(false)}
                    onSuccess={fetchOrders} // สั่งให้โหลดข้อมูลใหม่หลังอัปโหลดสำเร็จ
                />
            )}
            {/* แสดง Pop-up ยืนยันยกเลิก ตามเงื่อนไข */}
            {isConfirmCancelOpen && (
                <CancelConfirmationModal
                    onConfirm={confirmCancelOrder}
                    onCancel={() => setIsConfirmCancelOpen(false)}
                />
            )}
            {/* แสดง Modal ดูสลิป ตามเงื่อนไข */}
            {isSlipViewerOpen && (
                <SlipViewerModal imageUrl={slipImageUrl} onClose={() => setIsSlipViewerOpen(false)} />
            )}

            <h2 className='text-2xl font-semibold'>การซื้อของฉัน</h2>

            <nav className='flex border-b overflow-x-auto'>
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => {
                            setActiveTab(tab.key);
                            fetchOrders(); // เรียก fetchOrders ทันที
                        }}
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
                            <div className='flex justify-between items-center text-sm border-b pb-3'>
                                <p className='font-semibold'>Order #{order.id}</p>
                                <div className={`flex items-center gap-2 font-semibold ${order.order_status === 'payment_rejected' ? 'text-red-600' : 'text-blue-600'}`}>
                                    <p>{statusThai[order.order_status] || order.order_status}</p>
                                </div>
                            </div>

                            {order.OrderItems.map(item => (
                                <div key={item.id} className='flex items-center gap-4'>
                                    <img src={item.Product.image_url} alt={item.Product.name} className='w-16 h-16 object-cover rounded'/>
                                    <div className='flex-1'>
                                        <p className='font-semibold text-sm'>{item.Product.name}</p>
                                        <p className='text-xs text-gray-500'>จำนวน: {item.quantity}</p>
                                    </div>
                                    <p className='text-sm'>{currency}{item.price_per_unit}</p>
                                </div>
                            ))}
                            
                            <div className='flex justify-between items-center border-t pt-3'>
                                <p className='text-sm'>ยอดรวม: <span className='font-semibold text-base'>{currency}{order.total_amount}</span></p>
                                
                                {/* ปุ่มจะแสดงตามสถานะของออเดอร์ */}
                                <div className='flex items-center gap-3'>
                                    {(order.order_status === 'pending' || order.order_status === 'payment_rejected') && (
                                        <>
                                            <button 
                                                onClick={() => handleCancelClick(order.id)}
                                                className='px-4 py-2 bg-red-100 text-red-700 text-xs rounded-full hover:bg-red-200'
                                            >
                                                ยกเลิกคำสั่งซื้อ
                                            </button>
                                            <button 
                                                onClick={() => handleNotifyPayment(order)}
                                                className='px-4 py-2 bg-green-500 text-white text-xs rounded-full hover:bg-green-600'
                                            >
                                                {order.order_status === 'payment_rejected' ? 'แจ้งชำระเงินอีกครั้ง' : 'แจ้งชำระเงิน'}
                                            </button>
                                        </>
                                    )}
                                    
                                    {/* ปุ่มดูสลิป (จะแสดงเมื่อรอตรวจสอบ) */}
                                    {order.order_status === 'awaiting_verification' && order.payment_slip_url && (
                                        <button 
                                            type="button"
                                            onClick={() => openSlipViewer(order.payment_slip_url)}
                                            className='px-4 py-2 bg-yellow-500 text-white text-xs rounded-full hover:bg-yellow-600'
                                        >
                                            ดูสลิปที่แจ้งไป
                                        </button>
                                    )}

                                    {/* ปุ่ม "ดูใบเสร็จ" (เมื่อสำเร็จ) */}
                                    {order.order_status === 'Completed' && (
                                        <button 
                                            onClick={() => navigate(`/order/receipt/${order.id}`)}
                                            className='px-4 py-2 bg-blue-500 text-white text-xs rounded-full hover:bg-blue-600'
                                        >
                                            ดูใบเสร็จ
                                        </button>
                                    )}
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

export default MyOrders;