import React, { useContext } from 'react' // ลบ useEffect, useState
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';

const BestSeller = () => {

    const { bestSellers } = useContext(ShopContext);

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text2={'สินค้าขายดี'}/>
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis repellat explicabo voluptatum porro consequatur dignissimos!
                </p>
            </div>

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-6'>
               {
                    bestSellers.map((item) => (
                        <ProductItem 
                            key={item.id} 
                            id={item.id} 
                            name={item.name} 
                            image={item.image_url} 
                            price={item.price}
                        />
                    ))
               } 
            </div>
        </div>
    )
}

export default BestSeller;