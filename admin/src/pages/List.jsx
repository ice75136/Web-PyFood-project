import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'
// import categoryThai from '../../thai/categoryThai'
import EditProduct from '../components/EditProduct'

const List = ({ token }) => {

  const [list, setList] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchList = async () => {
    try {

      const response = await axios.get(backendUrl + '/api/product/list')
      setList(response.data)

    } catch (error) {
        console.log(error);
        toast.error("ไม่สามารถดึงข้อมูลสินค้าได้")

    }
  }

  const removeProduct = async (productId) => {
    try {
      console.log('กำลังจะส่งคำขอลบสินค้า ID:', productId);
      const response = await axios.post(
        backendUrl + '/api/product/remove', 
        { id: productId }, 
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (response.status === 200) {
        toast.success("ลบสินค้าสำเร็จ")
        await fetchList();
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบสินค้า")
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
          <b>หมวดหมู่</b>
          <b>ราคา (บาท)</b>
          <b className='text-center'>การกระทำ</b>
        </div>

        {/* ------------ Product List ------------------ */}

        {
          list.map((item) => (
            <div className='grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 text-sm' key={item.id}>
              <img className='w-12' src={item.image_url} alt="" />
              <p>{item.name}</p>
              <p >{item.Category ? item.Category.name : 'ไม่มีหมวดหมู่'}</p>
              <p>{item.price}</p>
              <div className='grid grid-cols-2'>
                <p onClick={()=> {setSelectedProduct(item); setOpenEdit(true);}} className='text-right md:text-center cursor-pointer text-lg text-amber-600'>แก้ไข</p>
                <p onClick={()=>removeProduct(item.id)} className=' md:text-center cursor-pointer text-lg text-red-600'>ลบ</p>
              </div>
            </div>
          ))
        }
      </div>
      
      <EditProduct open={openEdit} onClose={() => setOpenEdit(false)} product={selectedProduct} fetchList={fetchList} token={token}/>
      
    </>
  )
}

export default List