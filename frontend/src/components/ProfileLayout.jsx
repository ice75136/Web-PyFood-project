import React from "react";
import SidebarProfile from "../components/SidebarProfile";
import { Outlet } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="flex border-t border-gray-300">
      {/* Sidebar */}
      <SidebarProfile />

      {/* เนื้อหาหน้าย่อย */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
