import db from '../models/index.js';

// ฟังก์ชันสำหรับเพิ่มที่อยู่ใหม่
const addAddress = async (req, res) => {
    try {
        const userId = req.user.id; // ดึง id จาก token

        // รับข้อมูลที่อยู่ทั้งหมดจาก request body
        const { first_name, last_name, phone, province, district, sub_district, postal_code, house_number, road, alley, villageNumber, address_details } = req.body;

        const newAddress = await db.UserAddress.create({
            user_id: userId, // ระบุว่าที่อยู่นี้เป็นของ user คนไหน
            first_name,
            last_name,
            phone,
            province,
            district,
            sub_district,
            postal_code,
            house_number,
            road,
            alley,
            village_number: villageNumber,
            address_details
        });

        res.status(201).json({ message: "Address added successfully", address: newAddress });

    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: "Error adding address" });
    }
};

const getMyAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await db.UserAddress.findAll({ where: { user_id: userId } });
        res.status(200).json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Error fetching addresses" });
    }
};

const setDefaultAddress = async (req, res) => {
    const userId = req.user.id;
    const { addressId } = req.body;
    
    // ใช้ Transaction เพื่อความปลอดภัย
    const t = await db.sequelize.transaction(); 

    try {
        // 1. ตั้งค่า is_default = false ให้กับที่อยู่อื่นๆ ทั้งหมดของ user คนนี้ก่อน
        await db.UserAddress.update(
            { is_default: false },
            { 
                where: { user_id: userId },
                transaction: t 
            }
        );

        // 2. ตั้งค่า is_default = true ให้กับที่อยู่ที่เลือก
        const [updatedRows] = await db.UserAddress.update(
            { is_default: true },
            { 
                where: { id: addressId, user_id: userId }, // ตรวจสอบว่าเป็นของ user คนนี้จริง
                transaction: t 
            }
        );

        // ตรวจสอบว่ามีการอัปเดตเกิดขึ้นจริงหรือไม่
        if (updatedRows === 0) {
            await t.rollback(); // ถ้าไม่มี ให้ยกเลิก
            return res.status(404).json({ message: "Address not found or does not belong to user" });
        }

        // 3. ถ้าสำเร็จ ให้ Commit
        await t.commit();
        res.status(200).json({ message: "Default address set successfully" });

    } catch (error) {
        // 4. ถ้ามี Error ให้ Rollback
        await t.rollback();
        console.error("Error setting default address:", error);
        res.status(500).json({ message: "Error setting default address" });
    }
};

const updateAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id, ...addressData } = req.body; // ดึง id และข้อมูลที่เหลือ

        const address = await db.UserAddress.findOne({ where: { id: id, user_id: userId } });

        if (!address) {
            return res.status(404).json({ message: "Address not found or you don't have permission to edit it" });
        }

        // อัปเดตข้อมูลที่อยู่
        await address.update(addressData);

        res.status(200).json({ message: "Address updated successfully", address });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Error updating address" });
    }
};

const removeAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.body;

        const address = await db.UserAddress.findOne({ where: { id: id, user_id: userId } });

        if (!address) {
            return res.status(404).json({ message: "Address not found or you don't have permission to delete it" });
        }

        await address.destroy();

        res.status(200).json({ message: "Address removed successfully" });
    } catch (error) {
        console.error("Error removing address:", error);
        res.status(500).json({ message: "Error removing address" });
    }
};

export { addAddress, getMyAddresses, setDefaultAddress, updateAddress, removeAddress };