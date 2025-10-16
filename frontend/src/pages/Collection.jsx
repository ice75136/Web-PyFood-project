import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const Collection = () => {

    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProducts, setFilterProducts] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevent')

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setCategory(prev => [...prev, e.target.value])
        }
    }

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value))
        } else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    // --- ส่วนที่แก้ไข: รวม Logic การกรองและเรียงลำดับไว้ใน useEffect เดียว ---
    useEffect(() => {
        let filtered = products;

        // 1. กรองด้วย Search
        if (showSearch && search) {
            filtered = filtered.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
        }

        // 2. กรองด้วย Category (Many-to-Many)
        if (category.length > 0) {
            filtered = filtered.filter(item =>
                item.Categories && item.Categories.some(cat => category.includes(cat.name))
            );
        }

        // 3. กรองด้วย SubCategory (Product Type)
        if (subCategory.length > 0) {
            filtered = filtered.filter(item =>
                item.ProductType && subCategory.includes(item.ProductType.name)
            );
        }

        // 4. เรียงลำดับ (Sort) หลังจากกรองเสร็จ
        const sorted = [...filtered]; // สร้าง Array ใหม่เพื่อ sort
        if (sortType === 'low-high') {
            sorted.sort((a, b) => a.price - b.price);
        } else if (sortType === 'high-low') {
            sorted.sort((a, b) => b.price - a.price);
        }

        // 5. อัปเดต state ที่จะแสดงผล
        setFilterProducts(sorted);

    }, [products, category, subCategory, search, showSearch, sortType]);


    return (
        <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t border-gray-300'>

            {/* Filter Option */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>ตัวกรองสินค้า
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="toggle filter" />
                </p>
                {/* Category Filter */}
                <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>หมวดหมู่สินค้า</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'หมู'} onChange={toggleCategory} /> หมู</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'ไก่'} onChange={toggleCategory} /> ไก่</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'หมูผสมไก่'} onChange={toggleCategory} /> หมูผสมไก่</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'น้ำจิ้ม'} onChange={toggleCategory} /> น้ำจิ้ม</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'น้ำพริก'} onChange={toggleCategory} /> น้ำพริก</p>
                    </div>
                </div>
                {/* SubCategory Filter (Product Type) */}
                <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>ประเภทบรรจุภัณฑ์</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'แพ็ค'} onChange={toggleSubCategory} /> แพ็ค</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'แผง'} onChange={toggleSubCategory} /> แผง</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'กระปุก'} onChange={toggleSubCategory} /> กระปุก</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'ขวด'} onChange={toggleSubCategory} /> ขวด</p>
                        <p className='flex gap-2'><input className='w-3' type="checkbox" value={'ลัง'} onChange={toggleSubCategory} /> ลัง</p>
                    </div>
                </div>
            </div>

            {/* Right Side */}
            <div className='flex-1'>
                <div className='flex justify-between text-base sm:text-2xl mb-4'>
                    <Title text2={'สินค้าทั้งหมด'} />
                    {/* Product Sort */}
                    <select onChange={(e) => setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
                        <option value="relevent">เรียงตาม: --</option>
                        <option value="low-high">เรียงตาม: ต่ำไปสูง</option>
                        <option value="high-low">เรียงตาม: สูงไปต่ำ</option>
                    </select>
                </div>

                {/* Map Product */}
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
                    {
                        filterProducts.map((item) => (
                            <ProductItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                image={item.image_url}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Collection