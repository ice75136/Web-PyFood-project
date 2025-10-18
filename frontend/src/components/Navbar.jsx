import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from "react-router-dom";
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

  const [visible,setVisible] = useState(false);

  const {setShowSearch, getCartCount, navigate, token, setToken, setCartItems} = useContext(ShopContext);

  const logout = () => {
    navigate('/login')
    localStorage.removeItem('token')
    setToken('')
    setCartItems({})
  }

  return (
    <div className='flex items-center justify-between py-5 font-medium'>
        
      <Link to='/'><img src={assets.logo} className='w-20' alt="" /></Link>

      <ul className='hidden sm:flex gap-5 text-lg text-gray-700'>

        <NavLink to='/' className='flex flex-col items-center gap-1'>
          <p>หน้าหลัก</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/collection' className='flex flex-col items-center gap-1'>
          <p>สินค้า</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/about' className='flex flex-col items-center gap-1'>
          <p>เกี่ยวกับ</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>
        <NavLink to='/contact' className='flex flex-col items-center gap-1'>
          <p>ติดต่อ</p>
          <hr className='w-2/4 border-none h-[1.5px] bg-gray-700 hidden' />
        </NavLink>

      </ul>

      <div className='flex items-center gap-6'>
          <img onClick={()=>setShowSearch(true)} src={assets.search_icon} className='w-5 cursor-pointer' alt="" />
          
          <div className='group relative'>
            <img onClick={()=> token ? null : navigate('/login')} className='w-5 cursor-pointer' src={assets.profile_icon} alt="" />
            {/* Dropdown Menu */}
            {token && 
            <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                <div className='flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded'>
                  <p onClick={()=>navigate('/profile')} className='cursor-pointer hover:text-black'>บัญชีของฉัน</p>
                  <p onClick={()=>navigate('/profile/orders')} className='cursor-pointer hover:text-black'>การซื้อของฉัน</p>
                  <p onClick={logout} className='cursor-pointer hover:text-black'>ออกจากระบบ</p>
                </div>
            </div>}
          </div>
          <Link to='/cart' className='relative'>
              <img src={assets.cart_icon} className='w-5 min-w-5'  alt="" />
              <p className='absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]'>{getCartCount()}</p>
          </Link>
          <img onClick={()=>setVisible(true)} src={assets.menu_icon} className='w-5 cursor-pointer sm:hidden' alt="" />
      </div>

        {/* Sidebar menu for small screens */}
        <div className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${visible ? 'w-full' : 'w-0'}`}>
              <div className='flex flex-col text-gray-600'>
                  <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-3 cursor-pointer'>
                      <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                      <p>กลับ</p>
                  </div>
                  <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/'>หน้าหลัก</NavLink>
                  <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/collection'>สินค้า</NavLink>
                  <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/about'>เกี่ยวกับ</NavLink>
                  <NavLink onClick={()=>setVisible(false)} className='py-2 pl-6 border' to='/contact'>ติดต่อ</NavLink>
              </div>
        </div>
    </div>
  )
}

export default Navbar