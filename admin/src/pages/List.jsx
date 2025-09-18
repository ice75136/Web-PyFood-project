import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
import categoryThai from '../../thai/categoryThai'
import EditProduct from '../components/EditProduct'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [openEdit, setOpenEdit] = useState(false)

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products)
      }
      else {
        toast.error(response.data.message)
      }


    } catch (error) {
      console.log(error);
      toast.error(error.message)

    }
  }

  const removeProduct = async (id) => {
    try {

      const response = await axios.post(backendUrl + '/api/product/remove', { id }, { headers: { token } })

      if (response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  return (
    <>
      <p className='mb-2'>รายการสินค้าทุ้งหมด {list.length} รายการ</p>
      <div className='flex flex-col gap-2'>

        {/* ----- List Table Title ------ */}

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-300 bg-gray-100 text-sm'>
          <b>รูปภาพ</b>
          <b>ชื่อสินค้า</b>
          <b>ประเภทสินค้า</b>
          <b>ราคา (บาท)</b>
          <b className='text-center'>การกระทำ</b>
        </div>

        {/* ------------ Product List ------------------ */}

        {
          list.map((item, index) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 text-sm' key={index}>
              <img className='w-12' src={item.image[0]} alt="" />
              <p>{item.name}</p>
              <p>{categoryThai[item.category]}</p>
              <p>{item.price}.00</p>
              <div className='grid grid-cols-2'>
                <p onClick={()=>setOpenEdit(true)} className='text-right md:text-center cursor-pointer text-lg text-amber-600'>แก้ไข</p>
                <p onClick={()=>removeProduct(item._id)} className=' md:text-center cursor-pointer text-lg text-red-600'>ลบ</p>
              </div>
            </div>
          ))
        }
      </div>
      
      <EditProduct open={openEdit} onClose={() => setOpenEdit(false)} />
      
    </>
  )
}

export default List