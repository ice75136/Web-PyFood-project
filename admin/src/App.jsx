import React from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Routes, Route } from 'react-router-dom';
import Add from './pages/Add';
import List from './pages/List';
import Orders from './pages/Orders';
import Login from './components/Login';
import { ToastContainer } from 'react-toastify';
import { AdminProvider, useAdmin } from './context/AdminContext'; // 1. Import Provider และ Hook

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '฿';

// สร้าง Component ใหม่เพื่อให้อยู่ภายใต้ Provider และเข้าถึง Context ได้
const AppContent = () => {
    const { token, setToken } = useAdmin(); // 2. ดึง token และ setToken มาจาก Context

    return (
        <div className='bg-gray-50 min-h-screen'>
            <ToastContainer
                position="top-right"
                autoClose={800}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                
            />
            {token === ""
                ? <Login setToken={setToken} />
                : <>
                    <Navbar setToken={setToken} />
                    <hr className='border-gray-200' />
                    <div className='flex w-full'>
                        <Sidebar />
                        <div className='flex-1 p-4 sm:p-6 text-gray-600'>
                            <Routes>
                                {/* 3. ไม่ต้องส่ง token เป็น prop แล้ว */}
                                <Route path='/add' element={<Add />} />
                                <Route path='/list' element={<List />} />
                                <Route path='/orders' element={<Orders />} />
                            </Routes>
                        </div>
                    </div>
                </>
            }
        </div>
    );
}

const App = () => {
    return (
        // 4. ครอบ AppContent ด้วย AdminProvider
        <AdminProvider>
            <AppContent />
        </AdminProvider>
    );
}

export default App;