import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {

    const currency = '฿';
    const delivery_fee = 50;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();
    const [bestSellers, setBestSellers] = useState([]);
    
    // State ใหม่สำหรับเก็บสินค้าที่ถูกติ๊กเลือก
    const [selectedItems, setSelectedItems] = useState([]);

    // 1. ฟังก์ชันดึงข้อมูลสินค้า
    const getProductsData = async () => {
        try {
            console.log("Context: 1. กำลังดึงข้อมูลสินค้า (getProductsData)...");
            const response = await axios.get(backendUrl + '/api/product/list');
            setProducts(response.data);
            console.log("Context: 2. ดึงข้อมูลสินค้าสำเร็จ");
        } catch (error) {
            console.error("Context: ❌ เกิด Error ตอนดึงสินค้า:", error);
            toast.error("ไม่สามารถดึงข้อมูลสินค้าได้");
        }
    }
    
    // 2. ฟังก์ชันดึงข้อมูลสินค้าขายดี
    const getBestSellersData = async () => {
        try {
            const response = await axios.get(backendUrl + '/api/product/bestsellers');
            setBestSellers(response.data);
        } catch (error) {
            console.error("Context: ❌ Error fetching best sellers:", error);
        }
    }

    // 3. ฟังก์ชันดึงข้อมูลตะกร้าของผู้ใช้
    const getUserCart = async (currentToken) => {
        console.log("Context: 4. กำลังดึงข้อมูลตะกร้า (getUserCart)...");
        if (!currentToken) {
            console.log("Context: 4.1 ไม่มี Token, หยุดทำงาน");
            return;
        }
        try {
            const response = await axios.get(backendUrl + '/api/cart/get', {
                headers: { Authorization: `Bearer ${currentToken}` }
            });
            
            console.log("Context: 5. ได้รับข้อมูลตะกร้าจาก API:", response.data);

            const cartData = {};
            response.data.forEach(item => {
                // แก้ไขจาก item.Product.id เป็น item.id
                cartData[item.id] = item.quantity; 
            });
            
            console.log("Context: 6. แปลงข้อมูลตะกร้าเป็น Object:", cartData);
            setCartItems(cartData);
            console.log("Context: 7. อัปเดต cartItems state สำเร็จ");

        } catch (error) {
            console.error("Context: ❌ เกิด Error ตอนดึงตะกร้า:", error);
        }
    }

    // 4. ฟังก์ชันเพิ่มของลงตะกร้า (ลดทีละ 1)
    const addToCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
        if (token) {
            try {
                const response = await axios.post(
                    backendUrl + '/api/cart/add',
                    { itemId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.status === 200) {
                    return true;
                } else {
                    toast.error("เกิดข้อผิดพลาดในการเพิ่มสินค้า");
                    return false;
                }
            } catch (error) {
                console.log(error);
                toast.error("เกิดข้อผิดพลาด");
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
        return true;
    }

    // 5. ฟังก์ชันลดจำนวน (ลดทีละ 1)
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

    // 6. ฟังก์ชันลบสินค้าทั้งรายการ
    const removeItemCompletely = async (itemId) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            delete newCart[itemId];
            return newCart;
        });
        // ลบออกจากรายการที่เลือกด้วย
        setSelectedItems(prev => prev.filter(id => id !== String(itemId)));

        if (token) {
            try {
                await axios.post(
                    backendUrl + '/api/cart/remove-item',
                    { itemId },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (error) {
                console.log(error);
                toast.error("เกิดข้อผิดพลาดในการลบสินค้า");
            }
        }
    }

    // 7. ฟังก์ชันสำหรับจัดการ Checkbox
    const toggleCartItemSelection = (itemId) => {
        const idString = String(itemId);
        setSelectedItems((prev) =>
            prev.includes(idString)
                ? prev.filter(id => id !== idString) 
                : [...prev, idString]
        );
    };

    const toggleSelectAll = (itemIdsOnPage) => {
        const allSelected = itemIdsOnPage.every(id => selectedItems.includes(id));
        if (allSelected) {
            setSelectedItems(prev => prev.filter(id => !itemIdsOnPage.includes(id)));
        } else {
            setSelectedItems(prev => [...new Set([...prev, ...itemIdsOnPage])]);
        }
    };

    // 8. ฟังก์ชันคำนวณยอดรวม (เฉพาะที่เลือก)
    const getSelectedCartAmount = () => {
        let totalAmount = 0;
        for (const itemId of selectedItems) {
            if (cartItems[itemId] > 0) {
                let itemInfo = products.find((product) => product.id == itemId);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[itemId];
                }
            }
        }
        return totalAmount;
    };
    
    // 9. ฟังก์ชันนับจำนวนสินค้าในตะกร้า (สำหรับไอคอนบน Navbar)
    const getCartCount = () => {
        let totalCount = 0;
        for (const itemId in cartItems) {
            totalCount += cartItems[itemId];
        }
        return totalCount;
    }

    // useEffect หลักสำหรับโหลดข้อมูล
    useEffect(() => {
        async function loadData() {
            await getProductsData();
            await getBestSellersData();
            if (localStorage.getItem('token')) {
                const userToken = localStorage.getItem('token');
                setToken(userToken);
                await getUserCart(userToken);
            }
        }
        loadData();
    }, []);

    
    // 10. อัปเดต Context value ให้ครบถ้วน
    const value = {
        products, 
        bestSellers, 
        currency, 
        delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, removeFromCart, removeItemCompletely, setCartItems, 
        getCartCount,
        getSelectedCartAmount, // ใช้ฟังก์ชันใหม่
        navigate, 
        backendUrl,
        setToken, 
        token,
        getUserCart,
        selectedItems, // ส่ง State ที่เลือก
        setSelectedItems, // ส่งตัวตั้งค่า (สำหรับ PlaceOrder)
        toggleCartItemSelection, // ส่งฟังก์ชัน Toggle
        toggleSelectAll // ส่งฟังก์ชันเลือกทั้งหมด
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;