import React, { useContext, useEffect, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
    const { navigate, backendUrl, token, setCartItems, cartItems, selectedItems, setSelectedItems } = useContext(ShopContext);

    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');

    // --- 1. เพิ่ม State สำหรับเก็บวิธีการชำระเงินที่เลือก ---
    const [paymentMethod, setPaymentMethod] = useState('bank_transfer'); 

    const fetchAddresses = async () => {
        if (token) {
            try {
                const response = await axios.get(backendUrl + '/api/address/get', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.data) {
                    setUserAddresses(response.data);
                    const defaultAddress = response.data.find(addr => addr.is_default);
                    if (defaultAddress) {
                        setSelectedAddressId(defaultAddress.id);
                    } else if (response.data.length > 0) {
                        setSelectedAddressId(response.data[0].id);
                    }
                }
            } catch (error) {
                toast.error("ไม่สามารถดึงข้อมูลที่อยู่ได้");
            }
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [token]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            // 2. ตรวจสอบว่ามีสินค้าที่เลือกหรือไม่
            if (selectedItems.length === 0) {
                 toast.error("คุณยังไม่ได้เลือกสินค้าที่จะสั่งซื้อ", { autoClose: 2000 });
                 navigate('/cart'); // กลับไปหน้าตะกร้า
                 return;
            }
            if (!selectedAddressId) {
                toast.error("กรุณาเลือกที่อยู่สำหรับจัดส่ง");
                return;
            }

            // 3. ส่ง itemsToPurchase (Array สินค้าที่เลือก) ไปด้วย
            const orderData = { 
                user_address_id: selectedAddressId,
                payment_method: paymentMethod,
                itemsToPurchase: selectedItems 
            };
            
            const response = await axios.post(
                backendUrl + '/api/order/place',
                orderData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 201) {
                // 4. ล้างตะกร้าใน Frontend (เฉพาะส่วนที่เลือก)
                const newCartItems = { ...cartItems };
                selectedItems.forEach(id => delete newCartItems[id]);
                setCartItems(newCartItems);
                setSelectedItems([]); // เคลียร์ State ที่เลือก

                if (paymentMethod === 'cod') {
                    localStorage.removeItem('lastOrderTab'); 
                    navigate('/profile/orders');
                    toast.success("สั่งซื้อสำเร็จ!");
                } else {
                    navigate('/profile/orders', { state: { fromPlaceOrder: true } });
                    toast.success("สั่งซื้อสำเร็จ! กรุณาแจ้งชำระเงิน");
                }
            } else {
                toast.error("เกิดข้อผิดพลาดในการสั่งซื้อ");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14 min-h-[80vh] border-t'>
            {/* --------- Left Side (ส่วนที่อยู่) ------------- */}
            <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
                <div className='text-xl sm:text-2xl my-3'>
                    <Title text1={'SHIPPING'} text2={'ADDRESS'} />
                </div>
                <div className='flex flex-col gap-3'>
                    {userAddresses.length > 0 ? (
                        userAddresses.map((address) => (
                            <div
                                key={address.id}
                                onClick={() => setSelectedAddressId(address.id)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                            >
                                <p className='font-semibold'>{address.first_name} {address.last_name}</p>
                                <p className='text-gray-600'>{address.phone}</p>
                                <p className='text-gray-600 mt-2'>
                                    {address.house_number}, {address.road ? `ถ.${address.road},` : ''} {address.alley ? `ซ.${address.alley},` : ''} แขวง/ตำบล {address.sub_district}, เขต/อำเภอ {address.district}, {address.province} {address.postal_code}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p>คุณยังไม่มีที่อยู่ที่บันทึกไว้</p>
                    )}
                </div>
                <button
                    type="button"
                    onClick={() => navigate('/profile/addresses')}
                    className='mt-4 px-4 py-2 bg-gray-200 rounded-md text-sm hover:bg-gray-300'
                >
                    จัดการที่อยู่ / เพิ่มที่อยู่ใหม่
                </button>
            </div>

            {/* ---------- Right Side (สรุปยอดและชำระเงิน) --------------- */}
            <div className='mt-8 sm:mt-0 w-full sm:max-w-[450px]'>
                <div className='mt-8'>
                    <Title text2={'สรุปยอดคำสั่งซื้อ'} />
                    <CartTotal />
                </div>

                {/* --- 2. เพิ่มส่วนเลือกวิธีการชำระเงิน --- */}
                <div className='mt-12'>
                    <Title text2={'วิธีการชำระเงิน'} />
                    <div className='flex flex-col gap-3 mt-4'>

                        {/* ปุ่มชำระผ่านบัตร */}
                        <div
                            onClick={() => setPaymentMethod('bank_transfer')}
                            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${paymentMethod === 'bank_transfer' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                        >
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'bank_transfer' ? 'border-blue-500' : 'border-gray-400'}`}>
                                {paymentMethod === 'bank_transfer' && <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>}
                            </div>
                            <p className='text-gray-700 font-medium'>โอนเงินเข้าธนาคาร</p>
                        </div>

                        {/* ปุ่มเก็บเงินปลายทาง */}
                        <div
                            onClick={() => setPaymentMethod('cod')}
                            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-300'}`}
                        >
                            <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center ${paymentMethod === 'cod' ? 'border-blue-500' : 'border-gray-400'}`}>
                                {paymentMethod === 'cod' && <div className='w-2.5 h-2.5 bg-blue-500 rounded-full'></div>}
                            </div>
                            <p className='text-gray-700 font-medium'>เก็บเงินปลายทาง</p>
                        </div>

                        
                    </div>
                </div>

                <div className='w-full text-end mt-8'>
                    {/* 5. อัปเดตข้อความในปุ่ม */}
                    <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>
                        ยืนยันคำสั่งซื้อ ({selectedItems.length} รายการ)
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder