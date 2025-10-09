import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarProfile = () => {
    return (
        <div className='w-[15%] min-h-screen border-gray-200 border-r-2'>
            <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

                <NavLink 
                  className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' 
                  to="/profile"
                >
                    <p className='hidden md:block'>บัญชีของฉัน</p>
                </NavLink>

                <NavLink 
                  className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' 
                  to="/profile/address"
                >
                    <p className='hidden md:block'>ที่อยู่ของฉัน</p>
                </NavLink>

                <NavLink 
                  className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' 
                  to="/profile/purchase-history"
                >
                    <p className='hidden md:block'>ประวัติการสั่งซื้อ</p>
                </NavLink>
            </div>
        </div>
    )
}

export default SidebarProfile
