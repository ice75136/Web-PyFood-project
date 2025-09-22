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


  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    packageType: "",
    price: "",
    size: "",
    bestseller: false,
    _id: ""
  });

  // เมื่อ product เปลี่ยน → อัพเดทค่าใน form
  useEffect(() => {
    if (product) {
      setFormData({
        _id: product._id,
        name: product.name || "",
        description: product.description || "",
        category: product.category || "",
        packageType: product.packageType || "",
        price: product.price || "",
        size: product.size || "",
        bestseller: product.bestseller || false,
      });

      // เก็บ url รูปเก่า
      setOldImages(product.images || []);
    }
  }, [product]);

  if (!open) return null;

  // ฟังก์ชัน handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ฟังก์ชัน submit (ไว้แก้ไขสินค้า)
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    data.append("productId", formData._id);
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("packageType", formData.packageType);
    data.append("price", formData.price);
    data.append("size", formData.size);
    data.append("bestseller", formData.bestseller);

    if (image1) data.append("image1", image1);
    if (image2) data.append("image2", image2);
    if (image3) data.append("image3", image3);
    if (image4) data.append("image4", image4);

    const response = await axios.put(
      backendUrl + "/api/product/update",
      data,
      {
        headers: {
          token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success("แก้ไขสินค้าเรียบร้อย");
      fetchList();
      onClose();
    } else {
      toast.error(response.data.message);
    }
  } catch (err) {
    console.error(err);
    toast.error("เกิดข้อผิดพลาดในการแก้ไขสินค้า");
  }
};






  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <div className='w-auto bg-white'>
        <form onSubmit={handleSubmit} className='flex flex-col w-full items-start p-3 gap-3'>

          <div>
            <p className='mb-2'>อัพโหลดรูปภาพ</p>
            <div className='flex gap-2'>
              <label htmlFor="image1">
                <img className='w-20 h-20 object-cover border'
                  src={image1 ? URL.createObjectURL(image1) : oldImages[0]}
                  alt="image1" />
                <input onChange={(e) => setImage1(e.target.files[0])} type="file" id="image1" hidden />
              </label>

              <label htmlFor="image2">
                <img className='w-20 h-20 object-cover border'
                  src={image2 ? URL.createObjectURL(image2) : oldImages[1]}
                  alt="image2" />
                <input onChange={(e) => setImage2(e.target.files[0])} type="file" id="image2" hidden />
              </label>

              <label htmlFor="image3">
                <img className='w-20 h-20 object-cover border'
                  src={image3 ? URL.createObjectURL(image3) : oldImages[2]}
                  alt="image3" />
                <input onChange={(e) => setImage3(e.target.files[0])} type="file" id="image3" hidden />
              </label>

              <label htmlFor="image4">
                <img className='w-20 h-20 object-cover border'
                  src={image4 ? URL.createObjectURL(image4) : oldImages[3]}
                  alt="image4" />
                <input onChange={(e) => setImage4(e.target.files[0])} type="file" id="image4" hidden />
              </label>
            </div>

          </div>

          <div className='w-full'>
            <p className='mb-2'>ชื่อสินค้า</p>
            <input className='w-full max-w-[500px] px-3 py-2' name="name" value={formData.name} onChange={handleChange} type="text" placeholder='Type here' required />
          </div>
          <div className='w-full'>
            <p className='mb-2'>คำอธิบายสินค้า</p>
            <textarea className='w-full max-w-[500px] px-3 py-2' name="description" value={formData.description} onChange={handleChange} placeholder='Write content here' required />
          </div>
          <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
            <div>
              <p className='mb-2'>ประเภทสินค้า</p>
              <select className='w-full px-3 py-2' name="category" value={formData.category} onChange={handleChange} >
                <option value="Pork">หมู</option>
                <option value="Chicken">ไก่</option>
                <option value="PorkAndChicken">หมูผสมไก่</option>
                <option value="Sauce">น้ำจิ้ม</option>
                <option value="Chili_sauce">น้ำพริก</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>ประเภทบรรจุภัณฑ์</p>
              <select className='w-full px-3 py-2' name="packageType" value={formData.packageType} onChange={handleChange} >
                <option value="Pack">แพ็ค</option>
                <option value="snack_hanger">แผง</option>
                <option value="Bottle">ขวด</option>
                <option value="Sauce">ถุง</option>
                <option value="Jar">กระปุก</option>
                <option value="Carton">ลัง</option>
              </select>
            </div>

            <div>
              <p className='mb-2'>ราคาสินค้า</p>
              <input className='w-full px-3 py-2 sm:w-[120px]' name="price" value={formData.price} onChange={handleChange} type="number" placeholder='25' />
            </div>

            <div>
              <p className='mb-2'>ขนาดสินค้า</p>
              <input placeholder='100 กรัม' className='w-full px-3 py-2 sm:w-[120px]' name="size" value={formData.size} onChange={handleChange} type="text" />
            </div>
          </div>

          <div className='flex gap-2 mt-2'>
            <input name="bestseller" type="checkbox" checked={formData.bestseller} onChange={handleChange} id="bestseller" />
            <label className='cursor-pointer' htmlFor="bestseller">เพิ่มเป็นสินค้าขายดี</label>
          </div>

          <div className='flex items-center justify-between w-full'>
            <button className='w-28 py-3 mt-4 bg-black text-white cursor-pointer' onClick={onClose} type="button" > ยกเลิก </button>
            <button className='w-28 py-3 mt-4 bg-black text-white cursor-pointer' type="submit" > บันทึกการแก้ไข </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
