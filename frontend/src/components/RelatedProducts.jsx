import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ categories, productType, currentProductId }) => {

    const { products } = useContext(ShopContext);
    const [related,setRelated] = useState([]);

    useEffect(()=>{

        if(products.length > 0 && categories && categories.length > 0) {

            const currentCategoryIds = categories.map(cat => cat.id);

            const filteredProducts = products.filter((item) => {
                // เงื่อนไข 1: ต้องไม่ใช่สินค้าชิ้นปัจจุบัน
                const isNotCurrentProduct = item.id !== currentProductId;
                
                // เงื่อนไข 2: ต้องมีหมวดหมู่อย่างน้อยหนึ่งอันตรงกัน
                const hasMatchingCategory = item.Categories && item.Categories.some(cat => currentCategoryIds.includes(cat.id));
                
                return isNotCurrentProduct && hasMatchingCategory;
            });
            
            setRelated(filteredProducts.slice(0, 5));
        }
    }, [products, categories, currentProductId]);

    if (related.length === 0) {
        return null;
    }

  return (
    <div className='my-24'>
        <div className='text-center text-3xl py-2'>
            <Title text2={'สินค้าที่เกี่ยวข้อง'} />
        </div>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
            {related.map((item)=>(
                <ProductItem 
                    key={item.id} 
                    id={item.id} 
                    name={item.name} 
                    price={item.price} 
                    image={item.image_url}
            />
            ))}
        </div>
    </div>
  )
}

export default RelatedProducts