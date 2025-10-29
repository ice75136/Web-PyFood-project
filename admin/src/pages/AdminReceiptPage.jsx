import React, { useContext, useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import { useAdmin } from '../context/AdminContext';
import { backendUrl, currency } from '../App';
import axios from 'axios';
import { assets } from '../assets/assets';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './AdminReceiptPage.css'; // <-- 2. Import ไฟล์ CSS ที่จะสร้าง

// Object สำหรับแปลสถานะ (ถ้าต้องการ)
const statusThai = {
    pending: "ที่ต้องชำระ",
    awaiting_verification: "รอการตรวจสอบ",
    payment_rejected: "การชำระเงินไม่ถูกต้อง",
    Processing: "กำลังเตรียมจัดส่ง",
    Shipped: "กำลังจัดส่ง",
    Completed: "จัดส่งสำเร็จ",
    Cancelled: "ยกเลิก"
};

const AdminReceiptPage = () => {
    const { token } = useAdmin();
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const receiptRef = useRef(null);
    const navigate = useNavigate(); // 3. เรียกใช้ useNavigate

    useEffect(() => {
        const fetchOrder = async () => {
            if (token && orderId) {
                try {
                    // เรียก API ของ Admin
                    const response = await axios.get(`${backendUrl}/api/order/admin-receipt/${orderId}`, {
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

    const handleDownloadPDF = () => {
        const input = receiptRef.current;
        if (!input) return;
        setLoading(true);

        html2canvas(input, { 
            scale: 2, // เพิ่มความละเอียด
            useCORS: true // สำหรับรูปภาพจาก Cloudinary (ถ้ามี)
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 Portrait
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`receipt-order-${orderId}.pdf`);
            setLoading(false);
        });
    };

    if (!order) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontFamily: 'sans-serif' }}>กำลังโหลดใบเสร็จ...</div>;
    }

    return (
        <div className="receipt-wrapper">
            {/* --- ส่วนปุ่มควบคุม --- */}
            <div className='receipt-controls'>
                <button 
                    onClick={() => navigate(-1)} // <-- ใช้ navigate(-1) เพื่อย้อนกลับ
                    className='receipt-back-link' 
                >
                    &larr; กลับไปหน้ารายการสั่งซื้อ
                </button>
                <button 
                    onClick={handleDownloadPDF} 
                    disabled={loading}
                    className='receipt-download-button'
                >
                    {loading ? 'กำลังสร้าง PDF...' : 'ดาวน์โหลด PDF'}
                </button>
            </div>

            {/* --- เนื้อหาใบเสร็จ (ส่วนที่จะถูก "ถ่ายรูป") --- */}
            <div ref={receiptRef} className='receipt-container'>
                <div className='receipt-header'>
                    <div>
                        <h1>ใบเสร็จรับเงิน</h1>
                        <p>Order ID: #{order.id}</p>
                        <p>วันที่: {new Date(order.order_date).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}</p>
                    </div>
                    {/* ตรวจสอบว่า assets.ocha_logo มีอยู่จริงหรือไม่ */}
                    {assets.ocha_logo && <img src={assets.ocha_logo} alt="Logo" />}
                </div>

                <div className='receipt-details-grid'>
                    <div>
                        <h3>ที่อยู่จัดส่ง</h3>
                        <p>{order.UserAddress.first_name} {order.UserAddress.last_name}</p>
                        <p>{order.UserAddress.phone}</p>
                        <p>{order.UserAddress.house_number}, {order.UserAddress.sub_district}, {order.UserAddress.district}, {order.UserAddress.province} {order.UserAddress.postal_code}</p>
                    </div>
                     <div>
                        <h3>ข้อมูลลูกค้า</h3>
                        <p>{order.User.username}</p>
                        <p>{order.User.email}</p>
                        
                        <h3 style={{ marginTop: '1rem' }}>วิธีการชำระเงิน</h3>
                        <p>{order.payment_method === 'cod' ? 'เก็บเงินปลายทาง' : 'โอนเงินผ่านธนาคาร'}</p>
                        
                        <h3 style={{ marginTop: '1rem' }}>สถานะ</h3>
                        <p>{statusThai[order.order_status] || order.order_status}</p>

                        {/* --- แสดงข้อมูลการจัดส่ง --- */}
                        {(order.order_status === 'Shipped' || order.order_status === 'Completed') && order.tracking_code && (
                            <div style={{ marginTop: '1rem' }}>
                                <h3 style={{ fontWeight: '600', marginBottom: '8px' }}>ข้อมูลการจัดส่ง</h3>
                                <p>ขนส่ง: <span style={{ fontWeight: '500' }}>{order.shipping_carrier}</span></p>
                                <p>รหัสขนส่ง: <span style={{ fontWeight: '500' }}>{order.tracking_code}</span></p>
                            </div>
                        )}
                    </div>
                </div>

                <table className='receipt-table'>
                     <thead>
                        <tr>
                            <th>สินค้า</th>
                            <th className='text-center'>จำนวน</th>
                            <th className='text-right'>ราคาต่อหน่วย</th>
                            <th className='text-right'>ราคารวม</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.OrderItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.Product.name}</td>
                                <td className='text-center'>{item.quantity}</td>
                                <td className='text-right'>{currency}{Number(item.price_per_unit).toFixed(2)}</td>
                                <td className='text-right'>{currency}{(item.quantity * item.price_per_unit).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className='receipt-summary'>
                    <div className='receipt-summary-box'>
                        <div className='receipt-summary-line'>
                            <span>ยอดรวม (ไม่รวมค่าส่ง)</span>
                            {/* คำนวณยอดรวมสินค้า (สมมติค่าส่ง 50) */}
                            <span>{currency}{(order.total_amount - 50).toFixed(2)}</span> 
                        </div>
                        <div className='receipt-summary-line'>
                            <span>ค่าจัดส่ง</span>
                            <span>{currency}{50.00.toFixed(2)}</span>
                        </div>
                        <div className='receipt-summary-total'>
                            <span>ยอดสุทธิ</span>
                            <span>{currency}{Number(order.total_amount).toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReceiptPage;