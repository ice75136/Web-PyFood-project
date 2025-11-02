import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const LatestCollection = () => {

    const { products } = useContext(ShopContext);
    const [LatestProducts,setLatestProducts] = useState([]);

    useEffect(()=>{
        const sortedProducts = [...products].sort((a, b) => b.id - a.id);
        setLatestProducts(sortedProducts.slice(0, 10));
    },[products])

  return (
    <div className='my-10'>
        <div className='text-center py-8 text-3xl'>
            <Title text2={'สินค้าล่าสุด'}/>
            <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, voluptates! Eaque fugiat expedita maiores quos.
            </p>
        </div>

      {/* Rendering Products */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {
                LatestProducts.map((item)=>(
                    <ProductItem 
                        key={item.id} 
                        id={item.id} 
                        image={item.image_url} 
                        name={item.name} 
                        price={item.price}
                    />
                ))
            }
        </div>
    </div>
  )
}

export default LatestCollection