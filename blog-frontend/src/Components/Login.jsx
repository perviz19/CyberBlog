import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from "axios";
import { checkTokenValidity, createGuestToken } from '../utils/checktoken';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);



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

                    if (role === "admin" || role === "root") {
                        window.location.href = "/admin";
                    }
                } catch (error) {
                    localStorage.setItem('Access-Token', await createGuestToken()); 
                }
            } else {
                localStorage.setItem('Access-Token', await createGuestToken()); 
            }
        }
        handleToken();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const userData = {
            username: username,
            password: password,
        };

        axios
            .post("http://localhost:5000/api/admin/login", userData)
            .then(
                res => {
                    console.log(res)
                    if (res.status === 200) {
                        const token = res.data['token'];
                        console.log(token);
                        localStorage.setItem('Access-Token', token);
                        window.location.href = '/admin';
                    }
                }

            )
            .catch(error => {
                console.log(error);
                setError('Username or Password is wrong!');
            });
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-10 rounded-lg shadow-xl w-full max-w-md">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
                    Admin Login
                </h1>

                <form onSubmit={handleSubmit}>

                    {/* Username Input */}
                    <div className="mb-5">
                        <input
                            placeholder="Enter Username"
                            type="text"
                            required = 'true'
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-5 relative">
                        <input
                            placeholder="Enter Password"
                            type={showPassword ? "text" : "password"}
                            required = 'true'
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Show Password Checkbox */}
                        <label className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="form-checkbox h-4 w-6 text-blue-500"
                            />
                            <span className="ml-1 text-gray-600 text-sm">Show Password</span>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>

                    {/* Forgot Password Link */}
                    <div className="mt-4 text-center">
                        <a href="#" className="text-blue-500 hover:text-blue-600 text-sm">
                            Forgot Password?
                        </a>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-center text-red-600 mt-4 text-lg font-semibold">
                            {error}
                        </p>
                    )}
                </form>

            </div>
        </div>


    );
}

export default Login