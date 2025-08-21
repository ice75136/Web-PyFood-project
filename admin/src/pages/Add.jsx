import React from 'react'
import { assets } from '../assets/assets'

const Add = () => {
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

        <div>

          <div>
            <p>Product category</p>
            <select>
              <option value="Pork">Pork</option>
              <option value="Chicken">Chicken</option>
              <option value="PorkAndChicken">PorkAndChicken</option>
              <option value="Sauce">Sauce</option>
              <option value="Chili-sauce">Chili-sauce</option>
            </select>
          </div>

          <div>
            <p>Sub category</p>
            <select>
              <option value="">Pack</option>
              <option value="">Bottle</option>
              <option value="">Jar</option>
              <option value="">Carton</option>
              <option value=""></option>
            </select>
          </div>

        </div>

    </form>
  )
}

export default Add