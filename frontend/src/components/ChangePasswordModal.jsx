import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext'; // <-- ปรับ Path ถ้าจำเป็น

const ChangePasswordModal = ({ onClose }) => {
    const { backendUrl, token } = useContext(ShopContext);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("รหัสผ่านใหม่ไม่ตรงกัน");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
            return;
        }
        setLoading(true);
        try {
            await axios.post(backendUrl + '/api/user/change-password',
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("เปลี่ยนรหัสผ่านสำเร็จ!");
            onClose(); // ปิด Modal เมื่อสำเร็จ
        } catch (error) {
            toast.error(error.response?.data?.message || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4'>
            <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
                <h3 className='text-xl font-semibold mb-4'>เปลี่ยนรหัสผ่าน</h3>
                <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                    <input
                        type="password"
                        placeholder="รหัสผ่านปัจจุบัน"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="password"
                        placeholder="รหัสผ่านใหม่ (อย่างน้อย 8 ตัวอักษร)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <input
                        type="password"
                        placeholder="ยืนยันรหัสผ่านใหม่"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border p-2 rounded w-full"
                    />
                    <div className='flex justify-end gap-4 mt-4 w-full'>
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                            ยกเลิก
                        </button>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300">
                            {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;