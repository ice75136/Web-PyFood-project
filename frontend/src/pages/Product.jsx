import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';

const Product = () => {

  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState('');

  useEffect(() => {
    if (products.length > 0) {
      const foundProduct = products.find((item) => item.id == productId);
      if (foundProduct) {
        setProductData(foundProduct);
        setImage(foundProduct.image_url);
      }
    }
  }, [productId, products]); // ให้ useEffect ทำงานเมื่อ products โหลดเสร็จด้วย

  // แสดงหน้า loading หรือข้อความถ้ายังหาสินค้าไม่เจอ
  if (!productData) {
    return <div className='h-screen flex items-center justify-center'>Loading...</div>;
  }

  // ฟังก์ชันสำหรับเพิ่มของลงตะกร้า
  const handleAddToCart = async () => {
    const success = await addToCart(productData.id);
    if (success) {
      toast.success(`เพิ่ม ${productData.name} ลงในตะกร้า`);
    }
  }


  return (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/*------------ Product Data ----------*/}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>

        {/*------------- Product Images *-------------*/}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
            {
              productData.images && productData.images.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer border' alt={`thumbnail ${index + 1}`} />
              ))
            }
          </div>
          <div className='w-full sm:w-[80%]'>
            <img className='w-full h-auto' src={image} alt={productData.name} />
          </div>
        </div>

        {/* ---------Product Info ---------- */}
        <div className='flex-1'>
          <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
          <div className=' flex items-center gap-1 mt-2'>
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_dull_icon} alt="" className="w-3" />
            <p className='pl-2'>(122)</p>
          </div>
          <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
          <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>


          <button onClick={handleAddToCart} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700 mt-8'>เพิ่มลงตะกร้า</button>

          <hr className='mt-8 sm:w-4/5' />
          <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
            <p>ส่งตั้งแต่จันทร์ - ศุกร์</p>
            <p>ตัดรอบ 11 โมงของทุกวัน</p>
            <p>รับประกันความอร่อย</p>
          </div>
        </div>
      </div>

      {/* Description & Review Section */}
      {/* <div className='mt-20'>
        <div className='flex'>
          <b className='border border-gray-300 px-5 py-3 text-sm'>Description</b>
          <p className='border border-gray-300 px-5 py-3 text-sm'>Reviews (122)</p>
        </div>
        <div className='flex flex-col gap-4 border border-gray-300 px-6 py-6 text-sm text-gray-500'>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Blanditiis corrupti temporibus iure deleniti commodi ad distinctio, vero explicabo, reprehenderit quasi perspiciatis atque velit sunt laborum facere officiis consequatur quidem dicta!</p>
          <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sunt, delectus consequatur vero ab, quisquam consectetur nemo distinctio enim veritatis, quibusdam iste. Odit fugiat fugit voluptate laboriosam consectetur excepturi voluptatum molestiae.</p>
        </div>
      </div> */}

      {/* -------- display related product ---------- */}
      <RelatedProducts categories={productData.Categories} productType={productData.ProductType} />

    </div>
  );
}

export default Product