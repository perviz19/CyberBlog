import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaUser } from 'react-icons/fa';
import { checkTokenValidity } from '../../utils/checktoken';

function Users() {
    const [responseData, setResponseData] = useState([]);


    useEffect(() => {
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

                    if (role !== "root") {
                        window.location.href = "/admin/login";    
                    } 

                } catch (error) {
                    window.location.href = "/admin/login";
                }
            } else {
                window.location.href = "/admin/login";
            }
        }
        handleToken();
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('Access-Token');

        axios
            .get('http://localhost:5000/api/admin/', {
                headers: { Authorization: `Bearer ${token}` },
                withCredentials: true,
            })
            .then((res) => {
                setResponseData(res.data.Users);
            })
            .catch((error) => console.error('Failed to fetch users:', error));
    }, []);

    return (
        <div className="bg-gray-100 min-h-screen p-6">
            <main className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">User List</h2>

                <div className="flex flex-col md:flex-row gap-4">
                    {responseData.map((user) => (
                        <div
                            key={user._id}
                            className="p-4 bg-gray-50 rounded-lg shadow flex items-center space-x-4"
                        >
                            <FaUser className="text-blue-500 text-6xl" />
                            <div>
                                <h3 className="text-lg font-bold text-gray-800">
                                    {user.username}
                                </h3>
                                <p className="text-gray-600">Role: {user.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default Users;
