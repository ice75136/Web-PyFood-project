import React, { useState } from 'react'
import { assets } from '../assets/assets'

const Add = () => {

  const [image1,setImage1] = useState(false)
  const [image2,setImage2] = useState(false)
  const [image3,setImage3] = useState(false)
  const [image4,setImage4] = useState(false)

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Pork");
  const [subCategory, setSubCategory] = useState("pack  ");
  const [bestseller, setBestseller] = useState(false);
  const [sizes, setSizes] = useState("");

  return (
    <form className='flex flex-col w-full items-start gap-3'>
        <div>
          <p className='mb-2'>Upload Image</p>
          
          <div className='flex gap-2'>
            <label htmlFor="image1">
              <img className='w-20' src={assets.upload_area} alt="" />
              <input type="file" id="image1" hidden/>
            </label>
            <label htmlFor="image2">
              <img className='w-20' src={assets.upload_area} alt="" />
              <input type="file" id="image2" hidden/>
            </label>
            <label htmlFor="image3">
              <img className='w-20' src={assets.upload_area} alt="" />
              <input type="file" id="image3" hidden/>
            </label>
            <label htmlFor="image4">
              <img className='w-20' src={assets.upload_area} alt="" />
              <input type="file" id="image4" hidden/>
            </label>
          </div>
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product name</p>
          <input className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
        </div>

        <div className='w-full'>
          <p className='mb-2'>Product description</p>
          <textarea className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
        </div>

        <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>

          <div>
            <p className='mb-2'>Product category</p>
            <select className='w-full px-3 py-2'>
              <option value="Pork">หมู</option>
              <option value="Chicken">ไก่</option>
              <option value="PorkAndChicken">หมูและไก่</option>
              <option value="Sauce">น้ำจิ้ม</option>
              <option value="Chili-sauce">น้ำพริก</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Sub category</p>
            <select className='w-full px-3 py-2'>
              <option value="Pack">แพ็ค</option>
              <option value="snack_hanger">แผง</option>
              <option value="Bottle">ขวด</option>
              <option value="Jar">กระปุก</option>
              <option value="Carton">ลัง</option>
            </select>
          </div>

          <div>
            <p className='mb-2'>Product Price</p>
            <input className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25'/>
          </div>

          <div>
            <p className='mb-2'>Product Sizes</p>
            <div>
              <div>
                <input className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='1000g' />
              </div>
            </div>
          </div>

        </div>

        <div className='flex gap-2 mt-2'>
          <input type="checkbox" id="bestseller" />
          <label className='cursor-pointer' htmlFor="bestseller">Add to bestseller</label>
        </div>

        <button type="submit" className='w-28 py-3 mt-4 bg-black text-white'>ADD</button>


    </form>
  )
}

export default Add