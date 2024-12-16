import React, { useState, useLayoutEffect, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import Posts from "./Admin_components/Posts";
import Users from "./Admin_components/Users";
import { FiUser, FiMenu, FiX } from "react-icons/fi";
import Sidebar from "./Admin_components/SideBar";
import Dashboard from "./Admin_components/Dashboard";
import { checkTokenValidity } from '../utils/checktoken';

const AdminPanel = () => {
    const [currentPage, setCurrentPage] = useState("dashboard");
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useLayoutEffect(() => {
        const handleToken = async () => {
            const token = localStorage.getItem('Access-Token');
            let isValid = false;
            if (token) {
                isValid = await checkTokenValidity(token);
            }
            if (isValid) {
                try {
                    const decodedToken = jwtDecode(token);
                    const role = decodedToken.role;

                    setToken(decodedToken);

                    if (role === "admin" || role === "root") {
                        setIsLoading(false);
                    } else {
                        window.location.href = "/admin/login";
                    }
                } catch (error) {
                    console.error("Invalid token");
                    window.location.href = "/admin/login";
                }
            } else {
                console.log("Token is invalid");
                window.location.href = "/admin/login";
            }
        }
        handleToken();
    }, [currentPage]);

    useEffect(() => {
        setIsSidebarOpen(!isSidebarOpen)
    },[currentPage]);


    if (isLoading) {
        return <div className="text-center text-xl mt-20">Loading...</div>;
    }
    const renderContent = () => {
        switch (currentPage) {
            case "dashboard":
                return (
                    <Dashboard />
                );
            case "posts":
                return <Posts />;
            case "users":
                return <Users />;
            case "settings":
                return <div>Settings Content</div>;
            default:
                return <div>Welcome to the Admin Panel</div>;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}

            <Sidebar
                isSidebarOpen={isSidebarOpen}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                token={token}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col ml-0 md:ml-64 transition-all duration-300">
                {/* Header */}
                <header className="bg-gradient-to-r from-blue-400 to-purple-400 shadow-lg text-white flex items-center justify-between px-6 py-4 z-10">
                    {/* Hamburger Button */}
                    <button
                        className="md:hidden text-white text-2xl mr-4"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>


                    {/* Page Title */}
                    <h1 className="text-xl font-bold capitalize flex-1">{currentPage}</h1>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                        <span className="bg-gray-300 p-3 rounded-full flex items-center justify-center">
                            <FiUser />
                        </span>
                        <span className="text-white text-lg">{token.username}</span>
                    </div>
                </header>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </div>
            </div>
        </div>
    );


};

export default AdminPanel;
