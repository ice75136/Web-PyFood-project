import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { toast } from "react-toastify";
import axios from "axios";

const Address = () => {
  const { token, backendUrl } = useContext(ShopContext);
  const [addresses, setAddresses] = useState([]);

  const fetchAddresses = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${backendUrl}/api/user/address`, {
        headers: { token },
      });
      if (res.data.success) setAddresses(res.data.address);
      else toast.error(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [token]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">ที่อยู่ของฉัน</h2>
      <div className="grid gap-4">
        {addresses.length === 0 ? (
          <p>ยังไม่มีที่อยู่</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr._id} className="border p-4 rounded shadow">
              <p>
                {addr.firstName} {addr.lastName}
              </p>
              <p>
                {addr.houseNumber} {addr.road} {addr.alley} {addr.moo}
              </p>
              <p>
                {addr.subDistrict}, {addr.district}, {addr.province} {addr.postCode}
              </p>
              <p>อีเมล: {addr.email}</p>
              <p>โทร: {addr.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Address;
