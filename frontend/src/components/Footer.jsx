import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>

            <div>
                <img src={assets.logo} className='mb-5 w-20' alt="" />
                <p className='w-full md:w-2/3 text-gray-600'>
                    408 ม.7 ซ.เทศบาลบางปู59 ถใสุขุมวิท <br />
                    ต.ท้ายบ้านใหม่ อ.เมืองสมุทรปราการ จ.สมุทรปราการ 10280
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>HOME</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    {/* <li>Privacy policy</li> */}
                </ul>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>ติดต่อ</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>เบอร์โทร 027-091-1901, 0-2323-1798, 0-2707-8338</li>
                    <li>แฟกซ์ 0-2709-0792, 0-707-8338</li>
                    <li>pyfood@hotmail.com</li>
                    <li>phayong2542@hotmail.com</li>
                </ul>
            </div>

        </div>

        {/* <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024@ forever.com All Right Reserved.</p>
        </div> */}

    </div>
  )
}

export default Footer