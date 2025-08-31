import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const [method, setMethod] = useState('cod');
  const { navigate, backendUrl, token, cartItems, setCartItems, getCartAmount, delivery_fee, products } = useContext(ShopContext);
  const [formData, setFormData] = useState({
    firstName: '',        // ชื่อจริง
    lastName: '',         // นามสกุล
    province: '',         // จังหวัด
    district: '',         // เขต/อำเภอ
    subDistrict: '',      // แขวง/ตำบล
    road: '',             // ถนน
    alley: '',            // ซอย
    moo: '',              // หมู่
    houseNumber: '',      // บ้านเลขที่
    postCode: '',         // รหัสไปรษณีย์
    addressDetails: '',   // รายระเอียดที่อยู่
    email: '',            // อีเมล
    phone: ''             // เบอร์โทร
  })

  const onChangeHandler = (event) => {
    const name = event.target.name
    const value = event.target.value

    setFormData(data => ({ ...data, [name]: value }))

  }

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    try {

      let orderItems = []

      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(products => products._id === items))
            if (itemInfo) {
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee
      }

      switch (method) {

        // API Calls for COD
        case 'cod': 
          const response = await axios.post(backendUrl + '/api/order/place',orderData,{headers:{token}})
          
          if (response.data.success) {
            setCartItems({})
            navigate('/orders')
          } else {
            toast.error(response.data.message)
          }
          break;
        case 'stripe':
          const responseStripe = await axios.post(backendUrl + '/api/order/stripe',orderData,{headers:{token}})
          if (responseStripe.data.success) {
            const {session_url} = responseStripe.data
            window.location.replace(session_url)
          } else {
            toast.error(responseStripe.data.message)
          }
        break;

        default:
          break;
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t'>
      {/* --------- Left Side ------------- */}
      <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={'INFORMATION'} />
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col">
            <label htmlFor="">ชื่อจริง</label>
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='ชื่อจริง' />
          </div>
          <div className="flex flex-col">
            <label htmlFor=""> นามสกุล</label>
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='นามสกุล' />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col">
            <label htmlFor="">จังหวัด</label>
            <input required onChange={onChangeHandler} name='province' value={formData.province} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='จังหวัด' />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">เขต/อำเภอ</label>
            <input required onChange={onChangeHandler} name='district' value={formData.district} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='เขต/อำเภอ' />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col">
            <label htmlFor="">แขวง/ตำบล</label>
            <input required onChange={onChangeHandler} name='subDistrict' value={formData.subDistrict} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='แขวง/ตำบล' />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">ถนน</label>
            <input required onChange={onChangeHandler} name='road' value={formData.road} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='ถนน' />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col">
            <label htmlFor="">ซอย</label>
            <input required onChange={onChangeHandler} name='alley' value={formData.alley} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='ซอย' />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">หมู่</label>
            <input required onChange={onChangeHandler} name='moo' value={formData.moo} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='หมู่' />
          </div>
        </div>

        <div className='grid grid-cols-2 gap-3'>
          <div className="flex flex-col">
            <label htmlFor="">บ้านเลขที่</label>
            <input required onChange={onChangeHandler} name='houseNumber' value={formData.houseNumber} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='บ้านเลขที่' />
          </div>
          <div className="flex flex-col">
            <label htmlFor="">รหัสไปรษณีย์</label>
            <input required onChange={onChangeHandler} name='postCode' value={formData.postCode} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="text" placeholder='รหัสไปรษณีย์' />
          </div>
        </div>

        <label htmlFor="">รายละเอียดที่อยู่ (ไม่บังคับ)<textarea onChange={onChangeHandler} name='addressDetails' value={formData.addressDetails} className='border border-gray-300 rounded py-1.5 px-3.5 w-full ' placeholder='รายละเอียดที่อยู่ (ไม่บังคับ)'></textarea></label>
        <label htmlFor="">อีเมล<input required onChange={onChangeHandler} name='email' value={formData.email} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="email" placeholder='อีเมล' /></label>
        <label htmlFor="">เบอร์โทร<input required onChange={onChangeHandler} name='phone' value={formData.phone} className='border border-gray-300 rounded py-1.5 px-3.5 w-full' type="tel" placeholder='เบอร์โทร' /></label>
      </div>

      {/* ---------- Right Side --------------- */}
      <div className='mt-8'>

        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>

        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={'METHOD'} />
          {/* ----------- Payment Method Selection --------------------- */}
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            {/* <div onClick={() => setMethod('razorpay')} className='flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div> */}
            <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border border-gray-300 p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border border-gray-300 rounded-full ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className='text-gray-500 text-sm font-medium mx-4'>เก็บเงินปลายทาง</p>
            </div>
          </div>

          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>สั่งซื้อ</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder