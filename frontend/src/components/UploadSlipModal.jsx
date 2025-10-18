import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

const UploadSlipModal = ({ order, onClose, onSuccess }) => {
    const { backendUrl, token } = useContext(ShopContext);
    const [slip, setSlip] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSlip(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!slip) {
            toast.error("กรุณาเลือกไฟล์สลิป");
            return;
        }
        setLoading(true);

        const formData = new FormData();
        formData.append('orderId', order.id);
        formData.append('slip', slip);

        try {
            const response = await axios.post(backendUrl + '/api/order/upload-slip', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success(response.data.message);
            onSuccess(); // บอกให้หน้า MyOrders โหลดข้อมูลใหม่
            onClose();   // ปิด Modal
        } catch (error) {
            toast.error(error.response?.data?.message || "อัปโหลดสลิปไม่สำเร็จ");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h3 className="text-xl font-semibold mb-4">แจ้งชำระเงินสำหรับ Order #{order.id}</h3>
                <div className='bg-gray-100 p-3 rounded-md mb-4 text-center'>
                    <p className='text-sm text-gray-600'>กรุณาโอนเงินมาที่:</p>
                    <p className='font-semibold'>ธนาคารไทยพาณิชย์</p>
                    <p className='font-semibold'>123-4-56789-0</p>
                    <p className='font-semibold'>ชื่อบัญชี: บริษัท พีวายฟู้ด จำกัด</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="slip-upload" className="cursor-pointer block">
                        <p className='text-sm mb-2'>อัปโหลดสลิปของคุณที่นี่:</p>
                        <img 
                            src={preview || assets.upload_area} 
                            alt="upload preview" 
                            className="w-full h-48 object-contain border-2 border-dashed rounded-md mb-4 p-2"
                        />
                    </label>
                    <input id="slip-upload" type="file" onChange={handleFileChange} accept="image/*" hidden />
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">ยกเลิก</button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300">
                            {loading ? 'กำลังอัปโหลด...' : 'ยืนยันการชำระเงิน'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadSlipModal;