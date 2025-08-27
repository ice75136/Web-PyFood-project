import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text2={'ติดต่อ'}/>
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-6'>
          <p className='font-semibold text-xl text-gray-600'>ที่ตั้งโรงงาน</p>
          <p className='text-gray-500'>บริษัท P.Y.FOOD จำกัด <br /> 408 หมู่ 7 ซอย เทศบาลบางปู 59 <br /> ตำบล ท้ายบ้านใหม่ อำเภอเมือง <br />สมุทรปราการ สมุทรปราการ 10280</p>
          <p className='font-semibold text-xl text-gray-600'>เบอร์โทรศัพท์ บริษัท พี.วาย.ฟู้ด จำกัด </p>
          <p className='text-gray-500'>
            ฝ่าย - บุคคล (คุณอุ๋ย) โทร. 02-707-8338 
            <br /> ฝ่าย - การเงิน (คุณดา) โทร. 02-707-8338 
            <br /> ฝ่าย - จัดซื้อ (คุณนุ) โทร. 094-329-2249
            <br /> ฝ่ายขาย - ไส้กรอก (คุณวี) โทร. 094-896-7808
            <br /> ฝ่ายขาย - หมูหยอง ไก่หยอง (คุณหนึ่ง) โทร. 088-879-8685 , 094-893-7804
            <br /> ฝ่ายขาย - หมูหยอง ไก่หยอง (คุณคิน) โทร. 02-709-1191
          </p>
          {/* <p className='font-semibold text-xl text-gray-600'>Carrers at forever</p>
          <p className='text-gray-500'>Learn more about our teams and job openings.</p> */}
          {/* <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500'>Explore Jobs</button> */}
        </div>
      </div>

      {/* <NewsletterBox/> */}
    </div>
  )
}

export default Contact