import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {

    const { 
        products, currency, cartItems, addToCart, removeFromCart, removeItemCompletely, 
        navigate, selectedItems, toggleCartItemSelection, toggleSelectAll 
    } = useContext(ShopContext);
    
    const [cartData, setCartData] = useState([]);
    const [hasCrateError, setHasCrateError] = useState(false);
    const CRATE_PRODUCT_TYPE_ID = 5;

    useEffect(() => {
        let hasError = false;
        if (products.length > 0 && Object.keys(cartItems).length > 0) {
            const data = Object.keys(cartItems).map((itemId) => {
                const itemInfo = products.find((product) => product.id == itemId);
                if (itemInfo) {
                    const quantity = cartItems[itemId];
                    if (itemInfo.product_type_id === CRATE_PRODUCT_TYPE_ID && quantity > 1) {
                        hasError = true;
                    }
                    return {
                        ...itemInfo,
                        quantity: quantity
                    };
                }
                return null;
            }).filter(item => item !== null);
            setCartData(data);
            setHasCrateError(hasError);
        } else {
            setCartData([]);
            setHasCrateError(false);
        }
    }, [cartItems, products]);

    // สร้าง Logic สำหรับ "เลือกทั้งหมด"
    const cartDataIds = cartData.map(item => String(item.id));
    const isAllSelected = cartData.length > 0 && cartDataIds.every(id => selectedItems.includes(id));

    return (
        <div className='border-t pt-14 min-h-[80vh]'>
            <div className='text-2xl mb-3'>
                <Title text2={'ตะกร้าสินค้า'} />
            </div>

            {hasCrateError && (
                <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md my-4' role="alert">
                    <strong className='font-bold'>ข้อผิดพลาด:</strong>
                    <span className='block sm:inline'> สินค้าประเภท "ลัง" สามารถสั่งซื้อได้ครั้งละ 1 ชิ้นเท่านั้น กรุณาลดจำนวนสินค้าในตะกร้า</span>
                </div>
            )}

            <div className='my-8'>
                {cartData.length > 0 ? (
                    <>
                        {/* Header ของตาราง (เพิ่ม Checkbox และปรับ grid-cols) */}
                        <div className='hidden sm:grid grid-cols-[auto_3fr_1fr_1fr_1fr_0.5fr] text-center gap-4 py-3 border-b text-gray-600 items-center'>
                            <input 
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={() => toggleSelectAll(cartDataIds)}
                                className='form-checkbox h-5 w-5 mx-auto'
                            />
                            <p className='text-left'>สินค้า</p>
                            <p>ราคา</p>
                            <p>จำนวน</p>
                            <p>รวม</p>
                            <p>ลบ</p>
                        </div>

                        {cartData.map((item) => (
                            // แถวสินค้า (เพิ่ม Checkbox และปรับ grid-cols)
                            <div 
                                key={item.id}
                                className={`py-4 border-b border-gray-300 grid grid-cols-[auto_2fr_1fr_1fr] sm:grid-cols-[auto_3fr_1fr_1fr_1fr_0.5fr] items-center text-center gap-4 ${
                                    (item.product_type_id === CRATE_PRODUCT_TYPE_ID && item.quantity > 1) ? 'bg-red-50 border-red-300' : ''
                                }`}
                            >
                                {/* Checkbox ของแถว */}
                                <input 
                                    type="checkbox"
                                    checked={selectedItems.includes(String(item.id))}
                                    onChange={() => toggleCartItemSelection(String(item.id))}
                                    className='form-checkbox h-5 w-5 mx-auto'
                                />

                                {/* ข้อมูลสินค้า */}
                                <Link to={`/product/${item.id}`} className='flex items-center gap-4 text-left'>
                                    <img className='w-16 sm:w-20' src={item.image_url} alt={item.name} />
                                    <div>
                                        <p className='text-xs sm:text-base font-medium'>{item.name}</p>
                                    </div>
                                </Link>

                                {/* ราคาต่อชิ้น */}
                                <p>{currency}{item.price}</p>

                                {/* จำนวน */}
                                <div className='flex justify-center items-center gap-2'>
                                    <button onClick={() => removeFromCart(item.id)} className='w-6 h-6 bg-gray-200 rounded-full'>-</button>
                                    <p className={`w-8 ${(item.product_type_id === CRATE_PRODUCT_TYPE_ID && item.quantity > 1) ? 'font-bold text-red-600' : ''}`}>
                                        {item.quantity}
                                    </p>
                                    <button onClick={() => addToCart(item.id)} className='w-6 h-6 bg-gray-200 rounded-full'>+</button>
                                </div>

                                {/* ราคารวม (ซ่อนในจอมือถือ) */}
                                <p className='hidden sm:block'>{currency}{item.price * item.quantity}</p>

                                {/* ปุ่มลบ */}
                                <img onClick={() => removeItemCompletely(item.id)} className='w-4 mx-auto cursor-pointer' src={assets.bin_icon} alt="remove" />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className='text-center py-20'>
                        <p>ตะกร้าสินค้าของคุณว่างเปล่า</p>
                        <Link to='/' className='text-blue-600 hover:underline mt-2 inline-block'>กลับไปเลือกซื้อสินค้า</Link>
                    </div>
                )}
            </div>
            
            {/* ส่วนสรุปยอด (ปุ่มจะอัปเดตตาม) */}
            {cartData.length > 0 && (
                <div className='flex justify-end my-20'>
                    <div className='w-full sm:w-[450px]'>
                        <CartTotal />
                        <div className='w-full text-end'>
                            <button
                                onClick={() => navigate('/place-order')}
                                disabled={hasCrateError || selectedItems.length === 0} // ปิดปุ่มถ้ามี Error หรือยังไม่เลือก
                                className='bg-black text-white text-sm my-8 px-3 py-3 disabled:bg-gray-400 disabled:cursor-not-allowed'
                            >
                                ดำเนินการชำระเงิน ({selectedItems.length} รายการ)
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Cart