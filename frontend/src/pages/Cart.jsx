import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {

  const { products, currency, cartItems, addToCart, removeFromCart, removeItemCompletely, getCartAmount, navigate } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    if (products.length > 0 && Object.keys(cartItems).length > 0) {

      // แปลง cartItems object ให้เป็น Array ที่มีข้อมูลสินค้าครบถ้วน
      const data = Object.keys(cartItems).map((itemId) => {
        // ค้นหาสินค้าจาก products array โดยใช้ itemId
        const itemInfo = products.find((product) => product.id == itemId);
        if (itemInfo) {
          return {
            ...itemInfo, // ข้อมูลสินค้าทั้งหมด (id, name, price, image_url, etc.)
            quantity: cartItems[itemId] // เพิ่มจำนวนสินค้าในตะกร้าเข้าไป
          };
        }
        return null;
      }).filter(item => item !== null); // กรองสินค้าที่อาจหาไม่เจอทิ้งไป

      setCartData(data);
    } else {
      setCartData([]); // ถ้าตะกร้าว่าง ให้เคลียร์ข้อมูล
    }
  }, [cartItems, products]); // ให้ useEffect ทำงานเมื่อ cartItems หรือ products เปลี่ยนแปลง

  return (
    <div className='border-t pt-14 min-h-[80vh]'>
      <div className='text-2xl mb-3'>
        <Title text2={'ตะกร้าสินค้า'} />
      </div>

      {/* 3. ส่วนแสดงผลสินค้าในตะกร้า */}
      <div className='my-8'>
        {cartData.length > 0 ? (
          <>
            {/* Header ของตาราง */}
            <div className='hidden sm:grid grid-cols-[3fr_1fr_1fr_1fr_0.5fr] text-center gap-4 py-3 border-b text-gray-600'>
              <p className='text-left'>สินค้า</p>
              <p>ราคา</p>
              <p>จำนวน</p>
              <p>รวม</p>
              <p>ลบ</p>
            </div>

            {cartData.map((item) => (
              <div key={item.id} className='py-4 border-b border-gray-300 text-gray-700 grid grid-cols-[3fr_1fr_1fr] sm:grid-cols-[3fr_1fr_1fr_1fr_0.5fr] items-center text-center gap-4'>
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
                  <p className='w-8'>{item.quantity}</p>
                  <button onClick={() => addToCart(item.id)} className='w-6 h-6 bg-gray-200 rounded-full'>+</button>
                </div>

                {/* ราคารวม */}
                <p>{currency}{item.price * item.quantity}</p>

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

      {/* ส่วนสรุปยอด */}
      {cartData.length > 0 && (
        <div className='flex justify-end my-20'>
          <div className='w-full sm:w-[450px]'>
            <CartTotal />
            <div className='w-full text-end'>
              <button onClick={() => navigate('/place-order')} className='bg-black text-white text-sm my-8 px-3 py-3'>ดำเนินการชำระเงิน</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default Cart