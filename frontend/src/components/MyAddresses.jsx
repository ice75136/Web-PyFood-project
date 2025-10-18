import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

// --- Component ย่อยสำหรับฟอร์มเพิ่ม/แก้ไขที่อยู่ (Modal) ---
const AddressModal = ({ address, onClose, onSave, token, backendUrl }) => {
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', phone: '', province: '', district: '',
        sub_district: '', postal_code: '', house_number: '', road: '',
        alley: '', village_number: '', address_details: ''
    });

    // เมื่อ 'address' prop เปลี่ยน (ตอนกด "แก้ไข") ให้เติมข้อมูลลงในฟอร์ม
    useEffect(() => {
        if (address) {
            // เติมข้อมูลจาก address ที่มีอยู่
            setFormData({
                id: address.id,
                first_name: address.first_name || '',
                last_name: address.last_name || '',
                phone: address.phone || '',
                province: address.province || '',
                district: address.district || '',
                sub_district: address.sub_district || '',
                postal_code: address.postal_code || '',
                house_number: address.house_number || '',
                road: address.road || '',
                alley: address.alley || '',
                village_number: address.village_number || '',
                address_details: address.address_details || ''
            });
        } else {
            // ถ้าเป็นการ "เพิ่มใหม่" ให้เคลียร์ฟอร์ม
            setFormData({
                first_name: '', last_name: '', phone: '', province: '', district: '',
                sub_district: '', postal_code: '', house_number: '', road: '',
                alley: '', village_number: '', address_details: ''
            });
        }
    }, [address]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            if (address) { // ถ้ามี address แสดงว่าเป็นการ "แก้ไข"
                response = await axios.put(`${backendUrl}/api/address/update`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else { // ถ้าไม่มี แสดงว่าเป็นการ "เพิ่มใหม่"
                response = await axios.post(`${backendUrl}/api/address/add`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }

            if (response.status === 200 || response.status === 201) {
                toast.success(address ? "แก้ไขที่อยู่สำเร็จ" : "เพิ่มที่อยู่ใหม่สำเร็จ");
                onSave(); // สั่งให้ list โหลดใหม่
                onClose(); // ปิด Modal
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาด");
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4'>
            <div className='bg-white p-6 rounded-md shadow-lg w-full max-w-lg'>
                <h3 className='text-xl font-semibold mb-4'>{address ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}</h3>
                <form onSubmit={handleSubmit} className='flex flex-col gap-3 max-h-[70vh] overflow-y-auto pr-2'>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input name="first_name" value={formData.first_name} onChange={handleChange} placeholder="ชื่อจริง" required className="border p-2 rounded" />
                        <input name="last_name" value={formData.last_name} onChange={handleChange} placeholder="นามสกุล" required className="border p-2 rounded" />
                    </div>
                    <input name="phone" value={formData.phone} onChange={handleChange} placeholder="เบอร์โทร" required className="border p-2 rounded w-full" />
                    <input name="house_number" value={formData.house_number} onChange={handleChange} placeholder="บ้านเลขที่" required className="border p-2 rounded w-full" />
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input name="province" value={formData.province} onChange={handleChange} placeholder="จังหวัด" required className="border p-2 rounded" />
                        <input name="district" value={formData.district} onChange={handleChange} placeholder="เขต/อำเภอ" required className="border p-2 rounded" />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input name="sub_district" value={formData.sub_district} onChange={handleChange} placeholder="แขวง/ตำบล" required className="border p-2 rounded" />
                        <input name="postal_code" value={formData.postal_code} onChange={handleChange} placeholder="รหัสไปรษณีย์" required className="border p-2 rounded" />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                        <input name="road" value={formData.road} onChange={handleChange} placeholder="ถนน (ถ้ามี)" className="border p-2 rounded" />
                        <input name="alley" value={formData.alley} onChange={handleChange} placeholder="ซอย (ถ้ามี)" className="border p-2 rounded" />
                    </div>
                    <input name="village_number" value={formData.village_number} onChange={handleChange} placeholder="หมู่ (ถ้ามี)" className="border p-2 rounded w-full" />
                    <textarea name="address_details" value={formData.address_details} onChange={handleChange} placeholder="รายละเอียดเพิ่มเติม (ถ้ามี)" rows="3" className="border p-2 rounded w-full"></textarea>
                    <div className='flex justify-end gap-4 mt-4 w-full'>
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">ยกเลิก</button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- Component ย่อยสำหรับ Pop-up ยืนยันการลบ ---
const ConfirmationDialog = ({ onConfirm, onCancel }) => {
    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
            <div className='bg-white p-6 rounded-md shadow-lg text-center'>
                <p className='mb-4 text-lg'>คุณแน่ใจหรือไม่ว่าจะลบที่อยู่นี้?</p>
                <div className='flex justify-center gap-4'>
                    <button onClick={onCancel} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>ยกเลิก</button>
                    <button onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>ยืนยัน</button>
                </div>
            </div>
        </div>
    );
};

// --- Component หลัก ---
const MyAddresses = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [addresses, setAddresses] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [addressToDelete, setAddressToDelete] = useState(null);

    const fetchAddresses = async () => {
        if (token) {
            try {
                const response = await axios.get(backendUrl + '/api/address/get', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAddresses(response.data);
            } catch (error) {
                toast.error("ไม่สามารถดึงข้อมูลที่อยู่ได้");
            }
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [token]);
    
    // ฟังก์ชันสำหรับเปิด Modal "เพิ่มที่อยู่"
    const handleAddAddress = () => {
        setEditingAddress(null); // เคลียร์ข้อมูลเก่า
        setIsModalOpen(true);
    };

    // ฟังก์ชันสำหรับเปิด Modal "แก้ไขที่อยู่"
    const handleEditAddress = (address) => {
        setEditingAddress(address); // ส่งข้อมูลที่อยู่ที่จะแก้ไขไป
        setIsModalOpen(true);
    };

    // ฟังก์ชันสำหรับเปิด Pop-up "ยืนยันการลบ"
    const handleDeleteAddress = (addressId) => {
        setAddressToDelete(addressId);
        setShowConfirm(true);
    };

    // ฟังก์ชันสำหรับยิง API ลบ
    const confirmDelete = async () => {
        if (!addressToDelete) return;
        try {
            const response = await axios.post(`${backendUrl}/api/address/remove`, { id: addressToDelete }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if(response.status === 200){
                toast.success("ลบที่อยู่สำเร็จ");
                fetchAddresses(); // โหลดข้อมูลที่อยู่ใหม่
            }
        } catch (error) {
            toast.error("เกิดข้อผิดพลาดในการลบ");
        } finally {
            setShowConfirm(false);
            setAddressToDelete(null);
        }
    };

    return (
        <div className='flex flex-col gap-5'>
            {/* แสดง Modal เพิ่ม/แก้ไข ตามเงื่อนไข */}
            {isModalOpen && (
                <AddressModal
                    address={editingAddress}
                    onClose={() => setIsModalOpen(false)}
                    onSave={fetchAddresses}
                    token={token}
                    backendUrl={backendUrl}
                />
            )}
            {/* แสดง Pop-up ยืนยันการลบ ตามเงื่อนไข */}
            {showConfirm && (
                <ConfirmationDialog onConfirm={confirmDelete} onCancel={() => setShowConfirm(false)} />
            )}

            <div className='flex justify-between items-center'>
                <h2 className='text-2xl font-semibold'>ที่อยู่ของฉัน</h2>
                <button onClick={handleAddAddress} className='px-4 py-2 bg-black text-white text-sm rounded'>เพิ่มที่อยู่ใหม่</button>
            </div>
            <div className='flex flex-col gap-4'>
                {addresses.length > 0 ? (
                    addresses.map((address) => (
                        <div key={address.id} className='border rounded-lg p-4'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <p className='font-semibold'>{address.first_name} {address.last_name}</p>
                                    <p className='text-sm text-gray-600 mt-1'>{address.phone}</p>
                                    <p className='text-sm text-gray-600 mt-2'>
                                        {address.house_number}, {address.road ? `ถ.${address.road},` : ''} {address.alley ? `ซ.${address.alley},` : ''} แขวง/ตำบล {address.sub_district}, เขต/อำเภอ {address.district}, {address.province} {address.postal_code}
                                    </p>
                                </div>
                                <div className='flex gap-4 text-sm flex-shrink-0 ml-4'>
                                    <p onClick={() => handleEditAddress(address)} className='cursor-pointer text-blue-600 hover:underline'>แก้ไข</p>
                                    <p onClick={() => handleDeleteAddress(address.id)} className='cursor-pointer text-red-600 hover:underline'>ลบ</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>คุณยังไม่มีที่อยู่ที่บันทึกไว้</p>
                )}
            </div>
        </div>
    );
};

export default MyAddresses;