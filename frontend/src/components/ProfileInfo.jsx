import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';

const ProfileInfo = () => {
    const { backendUrl, token } = useContext(ShopContext);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get(backendUrl + '/api/user/profile', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                }
            }
        };
        fetchProfile();
    }, [token]);

    if (!user) {
        return <div>Loading profile...</div>;
    }

    return (
        <div className='flex flex-col gap-4'>
            <h2 className='text-2xl font-semibold'>ข้อมูลโปรไฟล์</h2>
            <div className='p-4 border rounded-lg bg-gray-50'>
                <div className='mb-3'>
                    <p className='text-sm text-gray-500'>ชื่อผู้ใช้</p>
                    <p className='text-lg'>{user.username}</p>
                </div>
                <div>
                    <p className='text-sm text-gray-500'>อีเมล</p>
                    <p className='text-lg'>{user.email}</p>
                </div>
            </div>
            <button className='mt-4 w-fit px-4 py-2 bg-gray-200 text-sm rounded-md hover:bg-gray-300'>
                เปลี่ยนรหัสผ่าน
            </button>
        </div>
    );
};

export default ProfileInfo;