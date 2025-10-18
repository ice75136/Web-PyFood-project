import { createContext, useContext, useState, useEffect } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    // Logic การจัดการ Token จะย้ายมาอยู่ที่นี่
    // ใช้ key ที่แตกต่างจากฝั่งลูกค้า เช่น 'admin_token'
    const [token, setToken] = useState(localStorage.getItem('admin_token') || '');

    useEffect(() => {
        if (token) {
            localStorage.setItem('admin_token', token);
        } else {
            localStorage.removeItem('admin_token');
        }
    }, [token]);

    const contextValue = {
        token,
        setToken
    };

    return (
        <AdminContext.Provider value={contextValue}>
            {children}
        </AdminContext.Provider>
    );
};

// สร้าง Custom Hook เพื่อให้เรียกใช้ง่าย
export const useAdmin = () => {
    return useContext(AdminContext);
};