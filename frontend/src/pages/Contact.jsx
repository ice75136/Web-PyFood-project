import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'


const Contact = () => {
  return (
    <div>
      
      <div className='text-center text-2xl pt-10 border-t'>
          <Title text2={'ติดต่อ'}/>
      </div>

            <div className='my-10 mb-28 max-w-5xl mx-auto'> 
                
                <div className='flex flex-col md:flex-row gap-10'>
                    
                    {/* --- 2. คอลัมน์ซ้าย: แผนที่ (ปรับ w-full) --- */}
                    <div className='w-full md:w-1/2'>
                        <h3 className='text-2xl font-semibold mb-4'>ที่ตั้งของเรา</h3>
                        <div className='w-full overflow-hidden rounded-lg shadow-md'>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3878.645637827136!2d100.62528960977636!3d13.55731663877972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x311d5883d5707d27%3A0xf7fd5100d846726c!2sP.Y.FOOD%20Company%20Limited!5e0!3m2!1sen!2sth!4v1761763702375!5m2!1sen!2sth"
                                width="100%"
                                height="450"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* --- 3. คอลัมน์ขวา: ข้อมูลติดต่อ (ปรับ w-full) --- */}
                    <div className='w-full md:w-1/2 flex flex-col justify-center items-start gap-6'>
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
                    </div>
                </div>
            </div>
        </div>
     

  )
}

export default Contact