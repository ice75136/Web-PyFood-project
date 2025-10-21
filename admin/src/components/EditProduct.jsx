import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import { useAdmin } from '../context/AdminContext'
import { assets } from '../assets/assets' // Import assets

const EditProduct = ({ open, onClose, product, fetchList }) => {
    const { token } = useAdmin(); // ดึง token จาก Context
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [oldImages, setOldImages] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    
    const [formData, setFormData] = useState({
        id: "",
        name: "",
        description: "",
        product_type_id: "",
        price: "",
        sizes: "", 
        stock_quantity: "",
    });

    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id || "",
                name: product.name || "",
                description: product.description || "",
                product_type_id: product.product_type_id || "",
                price: product.price || "",
                // ดึงข้อมูลตัวแรกจาก Array (ถ้ามี)
                sizes: product.sizes && product.sizes.length > 0 ? product.sizes[0] : "", 
                stock_quantity: product.stock_quantity || "",
            });
            if (product.Categories) {
                setSelectedCategories(product.Categories.map(cat => String(cat.id)));
            } else {
                setSelectedCategories([]);
            }
            setOldImages(product.images && product.images.length > 0 ? product.images : [product.image_url]);
            setImage1(null); setImage2(null); setImage3(null); setImage4(null);
        }
    }, [product]);

    if (!open) return null;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    
    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            
            data.append("id", formData.id);
            data.append("name", formData.name);
            data.append("description", formData.description);
            data.append("product_type_id", formData.product_type_id);
            data.append("price", formData.price);
            data.append("stock_quantity", formData.stock_quantity);

            // แปลงน้ำหนักเดียวกลับไปเป็น Array
            const sizesArray = formData.sizes ? [formData.sizes] : [];
            data.append("sizes", JSON.stringify(sizesArray));
            
            data.append("category_ids", JSON.stringify(selectedCategories));

            if (image1) data.append("image1", image1);
            if (image2) data.append("image2", image2);
            if (image3) data.append("image3", image3);
            if (image4) data.append("image4", image4);

            const response = await axios.put(
                backendUrl + "/api/product/update",
                data,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                toast.success("แก้ไขสินค้าเรียบร้อย");
                fetchList();
                onClose();
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
                    
                    <div>
                        <p className='mb-2'>อัพโหลดรูปภาพ (เลือกเพื่อเปลี่ยน)</p>
                        <div className='flex gap-2 flex-wrap'>
                            <label htmlFor="edit_image1"><img className='w-20 h-20 object-cover border' src={image1 ? URL.createObjectURL(image1) : oldImages[0]} alt="image1" /></label>
                            <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="edit_image1" hidden />
                            <label htmlFor="edit_image2"><img className='w-20 h-20 object-cover border' src={image2 ? URL.createObjectURL(image2) : oldImages[1]} alt="image2" /></label>
                            <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="edit_image2" hidden />
                            <label htmlFor="edit_image3"><img className='w-20 h-20 object-cover border' src={image3 ? URL.createObjectURL(image3) : oldImages[2]} alt="image3" /></label>
                            <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="edit_image3" hidden />
                            <label htmlFor="edit_image4"><img className='w-20 h-20 object-cover border' src={image4 ? URL.createObjectURL(image4) : oldImages[3]} alt="image4" /></label>
                            <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="edit_image4" hidden />
                        </div>
                    </div>

                    <div className='w-full'>
                        <p className='mb-2'>ชื่อสินค้า</p>
                        <input className='w-full max-w-[500px] px-3 py-2 border rounded' name="name" value={formData.name} onChange={handleChange} type="text" required />
                    </div>
                    <div className='w-full'>
                        <p className='mb-2'>คำอธิบายสินค้า</p>
                        <textarea className='w-full max-w-[500px] px-3 py-2 border rounded' rows={3} name="description" value={formData.description} onChange={handleChange} required />
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                        <div>
                            <p className='mb-2'>ประเภทสินค้า (เลือกได้หลายอย่าง)</p>
                            <div className='flex flex-col gap-2 p-3 border rounded-md'>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="checkbox" value="1" checked={selectedCategories.includes("1")} onChange={handleCategoryChange} /> หมู
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="checkbox" value="2" checked={selectedCategories.includes("2")} onChange={handleCategoryChange} /> ไก่
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="checkbox" value="3" checked={selectedCategories.includes("3")} onChange={handleCategoryChange} /> หมูผสมไก่
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="checkbox" value="4" checked={selectedCategories.includes("4")} onChange={handleCategoryChange} /> น้ำพริก
                                </label>
                                <label className='flex items-center gap-2 cursor-pointer'>
                                    <input type="checkbox" value="5" checked={selectedCategories.includes("5")} onChange={handleCategoryChange} /> น้ำจิ้ม
                                </label>
                            </div>
                        </div>

                        <div>
                            <p className='mb-2'>ประเภทบรรจุภัณฑ์</p>
                            <select className='w-full px-3 py-2 border rounded' name="product_type_id" value={formData.product_type_id} onChange={handleChange}>
                                <option value="1">แพ็ค</option>
                                <option value="2">แผง</option>
                                <option value="3">กระปุก</option>
                                <option value="4">ขวด</option>
                                <option value="5">ลัง</option>
                                <option value="6">ถุง</option>
                            </select>
                        </div>
                    </div>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 w-full'>
                        <div>
                            <p className='mb-2'>ราคาสินค้า</p>
                            <input className='w-full px-3 py-2 border rounded' name="price" value={formData.price} onChange={handleChange} type="number" placeholder='250' />
                        </div>
                        <div>
                            <p className='mb-2'>จำนวนสต็อก</p>
                            <input className='w-full px-3 py-2 border rounded' name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} type="number" placeholder='50' />
                        </div>
                        <div>
                            <p className='mb-2'>น้ำหนักสินค้า (กรัม)</p>
                            <input placeholder='100' className='w-full px-3 py-2 border rounded' name="sizes" value={formData.sizes} onChange={handleChange} type="number" />
                        </div>
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