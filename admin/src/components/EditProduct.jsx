import React from 'react'

const EditProduct = ({open, onClose}) => {

  if (!open) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
        <div className='w-auto bg-white'>
           <form className='flex flex-col w-full items-start p-3 gap-3'>
                   <div className='w-full'>
                     <p className='mb-2'>ชื่อสินค้า</p>
                     <input className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Type here' required />
                   </div>
           
                   <div className='w-full'>
                     <p className='mb-2'>คำอธิบายสินค้า</p>
                     <textarea className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Write content here' required />
                   </div>
           
                   <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
           
                     <div>
                       <p className='mb-2'>ประเภทสินค้า</p>
                       <select className='w-full px-3 py-2'>
                         <option value="Pork">หมู</option>
                         <option value="Chicken">ไก่</option>
                         <option value="PorkAndChicken">หมูผสมไก่</option>
                         <option value="Sauce">น้ำจิ้ม</option>
                         <option value="Chili_sauce">น้ำพริก</option>
                       </select>
                     </div>
           
                     <div>
                       <p className='mb-2'>ประเภทบรรจุภัณฑ์</p>
                       <select className='w-full px-3 py-2'>
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
                       <input className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='25'/>
                     </div>
           
                     <div>
                       <p className='mb-2'>ขนาดสินค้า</p>
                       <div>
                         <div>
                           <input className='w-full px-3 py-2 sm:w-[120px]' type="number" placeholder='100 กรัม' />
                         </div>
                       </div>
                     </div>
           
                   </div>
           
                   <div className='flex gap-2 mt-2'>
                     <input type="checkbox" id="bestseller" />
                     <label className='cursor-pointer' htmlFor="bestseller">เพิ่มเป็นสินค้าขายดี</label>
                   </div>
                  
                  <div className='flex items-center justify-between w-full'>
                    <button onClick={onClose} type="button" className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>ยกเลิก</button>
                    <button type="submit" className='w-28 py-3 mt-4 bg-black text-white cursor-pointer'>เพิ่มสินค้า</button>
                  </div>
           
           
               </form>
        </div>
    </div>
  )
}

export default EditProduct