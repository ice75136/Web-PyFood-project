import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'

const EditProduct = ({ open, onClose, product, token, fetchList }) => {
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);

    const [oldImages, setOldImages] = useState([]);

    // 1. โครงสร้าง state ถูกต้องตรงกับ Backend ใหม่
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        category_id: "",
        product_type_id: "",
        price: "",
        sizes: "",
        bestseller: false,
    });

    // 2. เมื่อ product prop เปลี่ยน → อัปเดตค่าใน form ให้ถูกต้อง
    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id || "",
                name: product.name || "",
                description: product.description || "",
                category_id: product.category_id || "",
                product_type_id: product.product_type_id || "",
                price: product.price || "",
                sizes: product.sizes ? product.sizes.join(', ') : "", // แปลง Array เป็น String
                bestseller: product.bestseller || false,
            });
            // ตั้งค่ารูปภาพเก่า (ใช้ images ถ้ามี, หรือใช้ image_url เป็น fallback)
            setOldImages(product.images && product.images.length > 0 ? product.images : [product.image_url]);
            // รีเซ็ตไฟล์รูปภาพใหม่ทุกครั้งที่เปิด modal
            setImage1(null);
            setImage2(null);
            setImage3(null);
            setImage4(null);
        }
    }, [product]);

    if (!open) return null;

    // ฟังก์ชัน handle input change (ทำงานถูกต้องแล้ว)
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // 3. ฟังก์ชัน submit แก้ไขสินค้า
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            
            // ใช้ Key ที่ถูกต้องตาม Backend ใหม่
            data.append("id", formData.id);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("category_id", formData.category_id);
            data.append("product_type_id", formData.product_type_id);
            data.append("price", formData.price);
            data.append("bestseller", formData.bestseller);

            // แปลง String sizes กลับเป็น JSON Array String ก่อนส่ง
            const sizesArray = formData.sizes.split(',').map(s => s.trim()).filter(s => s);
            data.append("sizes", JSON.stringify(sizesArray));

            // เพิ่มไฟล์รูปภาพใหม่ (ถ้ามี)
            if (image1) data.append("image1", image1);
            if (image2) data.append("image2", image2);
            if (image3) data.append("image3", image3);
            if (image4) data.append("image4", image4);

            const response = await axios.put(
                backendUrl + "/api/product/update",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // เช็คจาก Status Code
            if (response.status === 200) {
                toast.success("แก้ไขสินค้าเรียบร้อย");
                fetchList(); // โหลดข้อมูลใหม่
                onClose();   // ปิด Modal
            } else {
                toast.error("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
            }
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "เกิดข้อผิดพลาดในการแก้ไขสินค้า");
        }
    };

    return (
        <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4'>
            <div className='w-full max-w-2xl bg-white p-4 rounded-md max-h-[90vh] overflow-y-auto'>
                <h2 className='text-xl font-semibold mb-4'>แก้ไขสินค้า</h2>
                <form onSubmit={handleSubmit} className='flex flex-col w-full items-start gap-4'>

                    {/* --- ส่วนแสดงผล/อัปโหลดรูปภาพ --- */}
                    <div>
                        <p className='mb-2'>อัพโหลดรูปภาพ (เลือกเพื่อเปลี่ยน)</p>
                        <div className='flex gap-2 flex-wrap'>
                            <label htmlFor="image1"><img className='w-20 h-20 object-cover border' src={image1 ? URL.createObjectURL(image1) : oldImages[0]} alt="image1" /></label>
                            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />

                            <label htmlFor="image2"><img className='w-20 h-20 object-cover border' src={image2 ? URL.createObjectURL(image2) : oldImages[1]} alt="image2" /></label>
                            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />

                            <label htmlFor="image3"><img className='w-20 h-20 object-cover border' src={image3 ? URL.createObjectURL(image3) : oldImages[2]} alt="image3" /></label>
                            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />

                            <label htmlFor="image4"><img className='w-20 h-20 object-cover border' src={image4 ? URL.createObjectURL(image4) : oldImages[3]} alt="image4" /></label>
                            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
                        </div>
                    </div>

                    {/* --- ฟอร์มกรอกข้อมูล --- */}
                    <div className='w-full'>
                        <p className='mb-2'>ชื่อสินค้า</p>
                        <input className='w-full max-w-[500px] px-3 py-2 border rounded' name="name" value={formData.name} onChange={handleChange} type="text" required />
                    </div>
                    <div className='w-full'>
                        <p className='mb-2'>คำอธิบายสินค้า</p>
                        <textarea className='w-full max-w-[500px] px-3 py-2 border rounded' rows={3} name="description" value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
                        <div>
                            <p className='mb-2'>ประเภทสินค้า</p>
                            <select className='w-full px-3 py-2 border rounded' name="category_id" value={formData.category_id} onChange={handleChange}>
                                <option value="1">หมู</option>
                                <option value="2">ไก่</option>
                                <option value="3">หมูผสมไก่</option>
                                <option value="4">น้ำพริก</option>
                                <option value="5">น้ำจิ้ม</option>
                            </select>
                        </div>
                        <div>
                            <p className='mb-2'>ประเภทบรรจุภัณฑ์</p>
                            <select className='w-full px-3 py-2 border rounded' name="product_type_id" value={formData.product_type_id} onChange={handleChange}>
                                <option value="1">แพ็ค</option>
                                <option value="2">แผง</option>
                                <option value="3">กระปุก</option>
                                <option value="4">ขวด</option>
                            </select>
                        </div>
                        <div>
                            <p className='mb-2'>ราคาสินค้า</p>
                            <input className='w-full px-3 py-2 border rounded' name="price" value={formData.price} onChange={handleChange} type="number" placeholder='25' />
                        </div>
                        <div>
                            <p className='mb-2'>ขนาด (กรัม) <span className='text-gray-500 text-xs'>(คั่นด้วยลูกน้ำ)</span></p>
                            <input placeholder='100, 170' className='w-full px-3 py-2 border rounded' name="sizes" value={formData.sizes} onChange={handleChange} type="text" />
                        </div>
                    </div>

                    <div className='flex gap-2 mt-2'>
                        <input name="bestseller" type="checkbox" checked={formData.bestseller} onChange={handleChange} id="edit-bestseller" />
                        <label className='cursor-pointer' htmlFor="edit-bestseller">เพิ่มเป็นสินค้าขายดี</label>
                    </div>

                    <div className='flex items-center justify-end w-full gap-4 mt-4'>
                        <button className='w-28 py-2 bg-gray-300 text-black cursor-pointer rounded' onClick={onClose} type="button">ยกเลิก</button>
                        <button className='w-28 py-2 bg-blue-600 text-white cursor-pointer rounded' type="submit">บันทึก</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditProduct
