import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarProfile = () => {
    // ฟังก์ชันสำหรับกำหนด className ของ NavLink
    const getNavLinkClass = ({ isActive }) => {
        const baseClasses = 'flex items-center gap-3 border-l-4 px-4 py-3 transition-colors';
        // ถ้าลิงก์นี้ active (ตรงกับ URL ปัจจุบัน) ให้เพิ่ม class สีพื้นหลังและเปลี่ยนสีขอบ
        return isActive
            ? `${baseClasses} border-blue-600 bg-blue-50 font-semibold`
            : `${baseClasses} border-transparent hover:bg-gray-100`;
    };

    return (
        <div className='w-full sm:w-64 flex-shrink-0 border-r-2 border-gray-200 py-8'>
            <div className='flex flex-col gap-2 text-sm'>
                {/* ใช้ end เพื่อให้ /profile ไม่ active ตอนอยู่ที่ /profile/orders */}
                <NavLink className={getNavLinkClass} to="/profile" end>
                    <p>โปรไฟล์ของฉัน</p>
                </NavLink>
                <NavLink className={getNavLinkClass} to="/profile/orders">
                    <p>การซื้อของฉัน</p>
                </NavLink>
                <NavLink className={getNavLinkClass} to="/profile/addresses">
                    <p>ที่อยู่ของฉัน</p>
                </NavLink>
            </div>
        </div>
    )
}

export default SidebarProfile