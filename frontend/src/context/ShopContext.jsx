import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '฿';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    // --- 1. แก้ไข: ฟังก์ชันดึงข้อมูลสินค้า ---
    const getProductsData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/list');
            // API ใหม่ส่ง Array กลับมาโดยตรง
            setProducts(response.data);
        } catch (error) {
            console.log(error);
            toast.error("ไม่สามารถดึงข้อมูลสินค้าได้");
        }
    }

    // --- 2. แก้ไข: ฟังก์ชันเพิ่มของลงตะกร้า (ทำให้ง่ายขึ้น) ---
    const addToCart = async (itemId) => {
    // อัปเดต State ทันทีเพื่อให้ UI ตอบสนองเร็ว (Optimistic Update)
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));

    if (token) {
        try {
            const response = await axios.post(
                backendUrl + '/api/cart/add',
                { itemId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // --- ส่วนที่แก้ไข: เช็ค response และแสดง toast ที่นี่ ---
            if (response.status === 200) {
                // ไม่ต้องทำอะไรเพิ่ม เพราะ State อัปเดตไปแล้ว
                return true; // ส่งสัญญาณว่าสำเร็จ
            } else {
                toast.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
                return false; // ส่งสัญญาณว่าล้มเหลว
            }
        } catch (error) {
            console.log(error);
            toast.error("เกิดข้อผิดพลาด");
            // **สำคัญ:** ถ้า Error ต้องย้อนกลับ State ที่อัปเดตไปก่อนหน้า
            setCartItems((prev) => {
                const newCart = { ...prev };
                if (newCart[itemId] > 1) {
                    newCart[itemId] -= 1;
                } else {
                    delete newCart[itemId];
                }
                return newCart;
            });
            return false;
        }
    }
    return true; // กรณีที่ไม่มี token (ตะกร้าทำงานแค่ใน browser)
}

    // --- 3. สร้างฟังก์ชันลบของออกจากตะกร้า ---
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId] -= 1;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/remove', 
                    { itemId }, 
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.log(error);
                toast.error("เกิดข้อผิดพลาด");
            }
        }
    }

    // --- ฟังก์ชันใหม่สำหรับลบทั้งหมด ---
    const removeItemCompletely = async (itemId) => {
        // อัปเดต State ทันที
        setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[itemId]; // ลบ key ออกจาก state
            return newCart;
        });

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/remove-item', // เรียก API ใหม่
                    { itemId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                // ไม่ต้องทำอะไรเพิ่ม เพราะ State อัปเดตไปแล้ว
            } catch (error) {
                console.log(error);
                toast.error("เกิดข้อผิดพลาดในการลบสินค้า");
                // (Optional) อาจจะต้องมี Logic กู้คืน State ถ้า API ล้มเหลว
            }
        }
    }

    // --- 4. แก้ไข: ฟังก์ชันคำนวณยอดรวมในตะกร้า ---
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            if (cartItems[itemId] > 0) {
                // เปลี่ยนจาก ._id เป็น .id
                let itemInfo = products.find((product) => product.id === Number(itemId));
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            totalCount += cartItems[itemId];
        }
        return totalCount;
    }

    // --- 5. แก้ไข: ฟังก์ชันดึงข้อมูลตะกร้าของผู้ใช้ ---
    const getUserCart = async (currentToken) => {
        try {
            // เปลี่ยน Method เป็น GET และ URL
            const response = await axios.get(backendUrl + '/api/cart/get', { headers: { Authorization: `Bearer ${currentToken}` } });
            
            // API ใหม่ส่งข้อมูลตะกร้ากลับมาในรูปแบบที่ต่างออกไป เราต้องแปลงกลับ
            const cartData = {};
            response.data.forEach(item => {
                cartData[item.Product.id] = item.quantity;
            });
            setCartItems(cartData);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getProductsData();
        if (localStorage.getItem('token')) {
            const userToken = localStorage.getItem('token');
            setToken(userToken);
            getUserCart(userToken);
        }
    }, []);

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, removeFromCart, removeItemCompletely, setCartItems, 
        getCartCount,
        getCartAmount, navigate, backendUrl,
        setToken, token
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;