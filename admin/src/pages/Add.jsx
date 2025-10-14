import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'

const Add = ({token}) => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [productTypeId, setProductTypeId] = useState("1");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {

      const formData = new FormData()

      formData.append("name",name)
      formData.append("description",description)
      formData.append("price",Number(price))
      formData.append("category_id",categoryId)
      formData.append("product_type_id",productTypeId)
      formData.append("bestseller",bestseller)
      
      const sizesArray = sizes.split(',').map(s => s.trim()).filter(s => s);
      formData.append("sizes", JSON.stringify(sizesArray))

      image1 && formData.append("image1",image1)
      image2 && formData.append("image2",image2)
      image3 && formData.append("image3",image3)
      image4 && formData.append("image4",image4)

      const response = await axios.post(backendUrl + "/api/product/add",formData, { headers: { Authorization: `Bearer ${token}` } })

      if (response.status === 201) {
        toast.success("เพิ่มสินค้าสำเร็จ")
        setName('')
        setDescription('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setSizes('')
      } else {
        toast.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า")
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>อัพโหลดรูปภาพ</p>
          
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
              <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
              <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
              <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
              <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>ชื่อสินค้า</p>
          <input onChange={(e) => setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>คำอธิบายสินค้า</p>
          <textarea onChange={(e) => setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

          <div>
            <p className='mb-2'>ประเภทสินค้า</p>
            <select onChange={(e) => setCategoryId(e.target.value)} value={categoryId} className='w-full px-3 py-2'>
              <option value="1">หมู</option>
              <option value="2">ไก่</option>
              <option value="3">หมูผสมไก่</option>
              <option value="4">น้ำจิ้ม</option>
              <option value="5">น้ำพริก</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>ประเภทบรรจุภัณฑ์</p>
            <select onChange={(e) => setProductTypeId(e.target.value)} value={productTypeId} className='w-full px-3 py-2'>
              <option value="1">แพ็ค</option>
              <option value="2">แผง</option>
              <option value="3">กระปุก</option>
              <option value="4">ขวด</option>
              <option value="5">ลัง</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>ราคาสินค้า</p>
            <input onChange={(e) => setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25'/>
          </div>

          <div>
            <p className='mb-2'>ขนาด (กรัม)</p>
            <div>
              <div>
                <input onChange={(e)=> setSizes(e.target.value)} value={sizes} className='w-full px-3 py-2 sm:w-[120px]' type="text" placeholder='100, 170' />
              </div>
            </div>
          </div>

        </div>

        <div className='flex gap-2 mt-2'>
          <input onChange={() => setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id="bestseller" />
          <label className='cursor-pointer' htmlFor="bestseller">เพิ่มเป็นสินค้าขายดี</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>เพิ่มสินค้า</button>


    </form>
  )
}

export default Add