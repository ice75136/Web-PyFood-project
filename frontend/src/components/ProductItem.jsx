import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets'; // Import assets เพื่อใช้รูปสำรอง

const ProductItem = ({ id, image, name, price }) => {

    const { currency } = useContext(ShopContext);

    return (
        <Link className='text-gray-700 cursor-pointer' to={`/product/${id}`}>
            <div className='overflow-hidden'>
                {/* --- ส่วนที่แก้ไข --- */}
                <img
                    className='hover:scale-110 transition ease-in-out'
                    src={image ? image : assets.placeholder_image} // <-- ตรวจสอบก่อนว่ามี image หรือไม่
                    alt={name}
                />
            </div>
            <p className='pt-3 pb-1 text-sm'>{name}</p>
            <p className=' text-sm font-medium'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem