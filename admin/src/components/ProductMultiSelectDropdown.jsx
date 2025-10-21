import React, { useState, useEffect, useRef } from 'react';
import { assets } from '../assets/assets'; // ปรับ Path ตามต้องการ

const ProductMultiSelectDropdown = ({ options, selectedProductIds, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null); // Ref สำหรับตรวจจับการคลิกนอก Dropdown

    // ฟังก์ชันจัดการการเปลี่ยนแปลง Checkbox
    const handleCheckboxChange = (productId) => {
        const currentId = String(productId); // แปลงเป็น string เพื่อเทียบ
        onChange(prevSelectedIds =>
            prevSelectedIds.includes(currentId)
                ? prevSelectedIds.filter(id => id !== currentId)
                : [...prevSelectedIds, currentId]
        );
    };

    // ปิด Dropdown เมื่อคลิกนอกพื้นที่
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // ข้อความที่จะแสดงบนปุ่ม Dropdown
    const getButtonLabel = () => {
        if (selectedProductIds.length === 0) {
            return "เลือกสินค้า (ว่าง = ทั้งหมด)";
        }
        if (selectedProductIds.length === 1) {
            const selectedOption = options.find(opt => String(opt.id) === selectedProductIds[0]);
            return selectedOption ? selectedOption.name : "1 รายการ";
        }
        return `${selectedProductIds.length} รายการที่เลือก`;
    };

    return (
        <div className="relative w-full sm:w-1/2 lg:w-1/3" ref={dropdownRef}>
            {/* ปุ่มเปิด/ปิด Dropdown */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full border rounded px-3 py-1.5 text-sm bg-gray-50 flex justify-between items-center"
            >
                <span className='truncate'>{getButtonLabel()}</span>
                <img src={assets.dropdown_icon} alt="toggle dropdown" className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* ส่วนรายการ Checkbox (แสดงเมื่อ isOpen) */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded shadow-lg z-20 max-h-60 overflow-y-auto">
                    {options.map(option => (
                        <label
                            key={option.id}
                            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                            <input
                                type="checkbox"
                                value={option.id}
                                checked={selectedProductIds.includes(String(option.id))}
                                onChange={() => handleCheckboxChange(option.id)}
                                className="form-checkbox h-4 w-4 text-blue-600"
                            />
                            <img src={option.image_url || assets.placeholder_image} alt={option.name} className="w-8 h-8 object-cover rounded-sm flex-shrink-0" />
                            <span className="flex-1 truncate">{option.name}</span>
                        </label>
                    ))}
                    {options.length === 0 && (
                        <p className="px-3 py-2 text-sm text-gray-500">ไม่มีสินค้าให้เลือก</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductMultiSelectDropdown;