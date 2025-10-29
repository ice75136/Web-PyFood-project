import React from 'react'
import SidebarProfile from '../components/SidebarProfile'
import { Outlet } from 'react-router-dom' // <-- Import Outlet

const Profile = () => {
    return (
        <div className='flex flex-col sm:flex-row min-h-[80vh] border-t border-gray-300'>
            {/* 1. แสดง Sidebar ด้านซ้าย */}
            <SidebarProfile />

            {/* 2. พื้นที่สำหรับแสดงหน้าย่อย (ตาม URL) */}
            <div className='flex-1 p-4 sm:p-8'>
                <Outlet />
            </div>
        </div>
    )
}

export default Profile