import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
            <FaExclamationTriangle className="text-red-500 text-8xl mb-4" />
            <h1 className="text-9xl font-extrabold text-red-500">404</h1>
            <h2 className="text-2xl md:text-4xl font-semibold mt-4 text-red-400">This Page Does Not Exist</h2>
            <p className="text-center mt-2 text-lg md:text-xl text-gray-600">
                Sorry, the page you are looking for might have been removed, renamed, or does not exist.
            </p>
            <a
                href="/"
                className="mt-6 px-6 py-3 bg-red-500 text-white text-lg rounded-lg shadow-lg hover:bg-red-600 transition-all"
            >
                Go Back to Homepage
            </a>
        </div>
    );
};

export default NotFound;