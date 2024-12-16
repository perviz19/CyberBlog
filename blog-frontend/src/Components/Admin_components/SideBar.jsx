import React from "react";
import { FiHome, FiFileText, FiUsers, FiSettings, FiLogOut } from "react-icons/fi";

const Sidebar = ({ isSidebarOpen, setCurrentPage, currentPage, token }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-r from-blue-500 to-purple-500 text-white flex justify-between flex-col ${isSidebarOpen ? "flex z-10"  : "hidden"} md:flex`}
    >

      <div className="flex flex-col flex-grow">
        <div className="flex items-center justify-center p-5">
          <h1 className="text-xl font-bold">ADMIN</h1>
        </div>

        {/* Navigasyon Linkleri */}
        <nav className="p-4 space-y-2 flex-grow mt-1">
          <button
            className={`flex items-center text-xl gap-3 px-4 py-2 w-full text-left rounded hover:bg-blue-700 ${currentPage === "dashboard" ? "bg-blue-700" : ""
              }`}
            onClick={() => setCurrentPage("dashboard")}
          >
            <FiHome /> Dashboard
          </button>

          <button
            className={`flex items-center text-lg gap-3 px-4 py-2 w-full text-left rounded hover:bg-blue-700 ${currentPage === "posts" ? "bg-blue-700" : ""
              }`}
            onClick={() => setCurrentPage("posts")}
          >
            <FiFileText /> Posts
          </button>

          {token.role === "root" && (
            <button
              className={`flex items-center text-lg gap-3 px-4 py-2 w-full text-left rounded hover:bg-blue-700 ${currentPage === "users" ? "bg-blue-700" : ""
                }`}
              onClick={() => setCurrentPage("users")}
            >
              <FiUsers /> Users
            </button>
          )}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 ">
        <button
          className={`flex items-center text-lg gap-3 px-4 py-2 w-full text-left rounded hover:bg-blue-700 ${currentPage === "settings" ? "bg-blue-700" : ""
            }`}
          onClick={() => setCurrentPage("settings")}
        >
          <FiSettings /> Settings
        </button>

        <button
          className="flex items-center text-lg gap-3 px-4 py-2 w-full text-left rounded hover:bg-blue-700"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
