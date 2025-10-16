import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl } from '../App'
import { toast } from 'react-toastify'
import EditProduct from '../components/EditProduct'

// --- 1. สร้าง Component สำหรับ Pop-up ยืนยัน (วางไว้ข้างบนสุด) ---
const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black/50 z-50'>
      <div className='bg-white p-6 rounded-md shadow-lg text-center'>
        <p className='mb-4 text-lg'>{message}</p>
        <div className='flex justify-center gap-4'>
          <button onClick={onCancel} className='px-4 py-2 bg-gray-300 rounded hover:bg-gray-400'>ยกเลิก</button>
          <button onClick={onConfirm} className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'>ยืนยันการลบ</button>
        </div>
      </div>
    </div>
  );
};


const List = ({ token }) => {

  const [list, setList] = useState([])
  const [openEdit, setOpenEdit] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- 2. เพิ่ม State สำหรับจัดการ Pop-up ---
  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list/all', { headers: { Authorization: `Bearer ${token}` } });
      setList(response.data);
    } catch (error) {
      console.log(error);
      toast.error("ไม่สามารถดึงข้อมูลสินค้าได้");
    }
  }

  const removeProduct = async (productId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("ซ่อนสินค้าสำเร็จ");
        await fetchList();
      } else {
        toast.error("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  const restoreProduct = async (productId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/product/restore',
        { id: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("กู้คืนสินค้าสำเร็จ");
        await fetchList();
      } else {
        toast.error("เกิดข้อผิดพลาดในการกู้คืน");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // --- 3. สร้างฟังก์ชันสำหรับ Hard Delete ---
  const handleHardDelete = async () => {
    if (!productToDelete) return;
    try {
      const response = await axios.post(
        backendUrl + '/api/product/hard-delete',
        { id: productToDelete },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.status === 200) {
        toast.success("ลบสินค้าถาวรสำเร็จ");
        await fetchList();
      } else {
        toast.error("เกิดข้อผิดพลาด");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      // ปิด Pop-up ทุกครั้ง
      setShowConfirm(false);
      setProductToDelete(null);
    }
  };

  // ฟังก์ชันสำหรับเปิด Pop-up
  const confirmHardDelete = (productId) => {
    setProductToDelete(productId);
    setShowConfirm(true);
  };

  useEffect(() => {
    if (token) {
      fetchList();
    }
  }, [token])

  return (
    <>
      {/* --- 4. แสดง Pop-up เมื่อ showConfirm เป็น true --- */}
      {showConfirm && (
        <ConfirmationDialog
          message={`คุณแน่ใจหรือไม่ว่าจะลบสินค้านี้อย่างถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้`}
          onConfirm={handleHardDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      <p className='mb-2'>รายการสินค้าทั้งหมด {list.length} รายการ</p>
      <div className='flex flex-col gap-2'>

        <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border border-gray-300 bg-gray-100 text-sm'>
          <b>รูปภาพ</b>
          <b>ชื่อสินค้า</b>
          <b className='text-center'>หมวดหมู่</b>
          <b className='text-center'>ประเภทบรรจุภัณฑ์</b>
          <b className='text-center'>ราคา (บาท)</b>
          <b className='text-center'>สต็อก (ชิ้น)</b> {/* <-- เพิ่มหัวตาราง "สต็อก" */}
          <b className='text-center'>การกระทำ</b>
        </div>
        {
          list.map((item) => (
            <div
              className={`grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border border-gray-300 text-sm ${!item.is_active ? 'bg-gray-200 text-gray-500' : ''}`}
              key={item.id}
            >
              <img className={`w-12 h-12 object-cover ${!item.is_active ? 'opacity-50' : ''}`} src={item.image_url} alt={item.name} />
              <p>{item.name}</p>
              <p className='text-center'> {item.Categories && item.Categories.length > 0 ? item.Categories.map(cat => cat.name).join(', ') : 'ไม่มีหมวดหมู่'}</p>
              <p className='text-center'>{item.ProductType.name}</p>
              <p className='text-center'>{item.price}</p>
              <p className='text-center'>{item.stock_quantity}</p>

              <div className='flex justify-center items-center gap-4'>
                <p onClick={() => { setSelectedProduct(item); setOpenEdit(true); }} className='cursor-pointer text-lg text-amber-600'>แก้ไข</p>

                {/* --- 5. แก้ไขส่วนแสดงผลปุ่ม --- */}
                {item.is_active ? (
                  <p onClick={() => removeProduct(item.id)} className='cursor-pointer text-lg text-red-600'>ปิด</p>
                ) : (
                  <>
                    <p onClick={() => restoreProduct(item.id)} className='cursor-pointer text-lg text-green-600'>เปิด</p>
                    <p onClick={() => confirmHardDelete(item.id)} className='cursor-pointer text-xl text-gray-400 hover:text-red-700' title='ลบถาวร'>🗑️</p>
                  </>
                )}
              </div>
            </div>
          ))
        }
      </div>

      <EditProduct open={openEdit} onClose={() => setOpenEdit(false)} product={selectedProduct} fetchList={fetchList} token={token} />
    </>
  )
}

export default List