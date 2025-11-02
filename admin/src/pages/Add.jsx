import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useAdmin } from '../context/AdminContext' // 1. Import useAdmin

const Add = () => {
    const { token } = useAdmin(); // 2. ดึง token จาก Context
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [productTypeId, setProductTypeId] = useState("1");
    const [sizes, setSizes] = useState(""); // State นี้จะเก็บน้ำหนัก (เช่น "100")
    const [stockQuantity, setStockQuantity] = useState("");
    const [categoryId, setCategoryId] = useState("1"); // State สำหรับ Category (เลือกอันเดียว)

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("price", Number(price));
            formData.append("product_type_id", productTypeId);
            formData.append("stock_quantity", Number(stockQuantity));
            formData.append("category_id", categoryId); // ส่ง category_id (ตัวเดียว)

            // แปลงน้ำหนักเดียวให้เป็น Array
            const sizesArray = sizes ? [sizes] : [];
            formData.append("sizes", JSON.stringify(sizesArray));

            image1 && formData.append("image1", image1);
            image2 && formData.append("image2", image2);
            image3 && formData.append("image3", image3);
            image4 && formData.append("image4", image4);

            const response = await axios.post(backendUrl + "/api/product/add", formData, { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 201) {
                toast.success("เพิ่มสินค้าสำเร็จ");
                // Reset form
                setName('');
                setDescription('');
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setPrice('');
                setSizes('');
                setStockQuantity('');
                setCategoryId("1");
            } else {
                toast.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "เกิดข้อผิดพลาด");
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-4 p-4'>
            <div>
                <p className='mb-2'>อัพโหลดรูปภาพ</p>
                <div className='flex gap-2 flex-wrap'>
                    <label htmlFor="image1"><img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="upload" /></label>
                    <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    <label htmlFor="image2"><img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="upload" /></label>
                    <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    <label htmlFor="image3"><img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="upload" /></label>
                    <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    <label htmlFor="image4"><img className='w-20 h-20 object-cover border rounded cursor-pointer' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="upload" /></label>
                    <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                </div>
            </div>

            <div className='w-full'>
                <p className='mb-2'>ชื่อสินค้า</p>
                <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2 border rounded' type="text" placeholder='ชื่อสินค้า' required />
            </div>

            <div className='w-full'>
                <p className='mb-2'>คำอธิบายสินค้า</p>
                <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2 border rounded' rows={4} placeholder='คำอธิบาย' required />
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-[500px]'>
                {/* --- 3. เปลี่ยนเป็น <select> --- */}
                <div>
                    <p className='mb-2'>ประเภทสินค้า</p>
                    <select 
                        onChange={(e) => setCategoryId(e.target.value)} 
                        value={categoryId} 
                        className='w-full px-3 py-2 border rounded'
                    >
                        <option value="1">หมู</option>
                        <option value="2">ไก่</option>
                        <option value="3">หมูผสมไก่</option>
                        <option value="4">น้ำพริก</option>
                        <option value="5">น้ำจิ้ม</option>
                    </select>
                </div>

                <div>
                    <p className='mb-2'>ประเภทบรรจุภัณฑ์</p>
                    <select onChange={(e) => setProductTypeId(e.target.value)} value={productTypeId} className='w-full px-3 py-2 border rounded'>
                        <option value="1">แพ็ค</option>
                        <option value="2">แผง</option>
                        <option value="3">กระปุก</option>
                        <option value="4">ขวด</option>
                        <option value="5">ลัง</option>
                        <option value="6">ถุง</option>
                    </select>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-[500px]'>
                <div>
                    <p className='mb-2'>ราคาสินค้า</p>
                    <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 border rounded' type="number" placeholder='250' required/>
                </div>
                <div>
                    <p className='mb-2'>จำนวนสต็อก</p>
                    <input onChange={(e) => setStockQuantity(e.target.value)} value={stockQuantity} className='w-full px-3 py-2 border rounded' type="number" placeholder='50' required/>
                </div>
                
                {/* --- 4. เปลี่ยน Label และ Input Type --- */}
                <div>
                    <p className='mb-2'>น้ำหนักสินค้า (กรัม)</p>
                    <input 
                        onChange={(e) => setSizes(e.target.value)} 
                        value={sizes} 
                        className='w-full px-3 py-2 border rounded' 
                        type="number" 
                        placeholder='100' 
                    />
                </div>
            </div>

            {/* --- ลบ Bestseller Checkbox --- */}

            <button type="submit" className='w-28 py-3 mt-4 bg-black text-white cursor-pointer rounded'>เพิ่มสินค้า</button>
        </form>
    )
}

export default Add