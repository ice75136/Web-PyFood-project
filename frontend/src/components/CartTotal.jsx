import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'

const CartTotal = () => {
    // 1. เปลี่ยน getCartAmount เป็น getSelectedCartAmount
    const { getSelectedCartAmount, currency, delivery_fee } = useContext(ShopContext);
    
    // 2. เรียกใช้ฟังก์ชันใหม่
    const totalAmount = getSelectedCartAmount(); 

    return (
        <div className='flex flex-col gap-4 text-gray-700'>
            <h2 className='text-xl font-semibold'>สรุปยอดตะกร้าสินค้า</h2>
            <div className='flex justify-between'>
                <p>ยอดรวม (ที่เลือก)</p>
                <p>{currency}{totalAmount.toFixed(2)}</p>
            </div>
            <hr />
            <div className='flex justify-between'>
                <p>ค่าจัดส่ง</p>
                <p>{currency}{totalAmount > 0 ? delivery_fee : 0}</p>
            </div>
            <hr />
            <div className='flex justify-between font-semibold text-lg'>
                <p>ยอดรวมสุทธิ</p>
                <p>{currency}{totalAmount > 0 ? (totalAmount + delivery_fee).toFixed(2) : 0}</p>
            </div>
        </div>
    )
}

export default CartTotal