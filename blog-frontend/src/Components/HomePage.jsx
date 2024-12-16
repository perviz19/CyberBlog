import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Catagory from './Category'
function HomePage() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [expandedPosts, setExpandedPosts] = useState({});

    const post_per_page = 3;

    const fetchPosts = async (page) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/posts?page=${page}&limit=${post_per_page}`
            );
            setPosts(response.data.posts);
            setTotalPosts(response.data.totalPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts(currentPage);
    }, [currentPage]);

    const toggleReadMore = (index) => {
        setExpandedPosts((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        fetchPosts(page);
    };

    const renderPaginationButtons = () => {
        const totalPages = Math.ceil(totalPosts / post_per_page);
        const maxButtons = 4;

        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (currentPage > totalPages - Math.floor(maxButtons / 2)) {
            startPage = Math.max(1, totalPages - maxButtons + 1);
        }


        const buttons = [];
        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-4 py-2 rounded ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                >
                    {i}
                </button>
            );
        }

        return buttons;
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="py-4 bg-gradient-to-r from-blue-400 to-purple-600 text-white">
                <h1 className=" ml-10 text-2xl font-bold">CyberBlog</h1>
            </header>
            <div >
            <Catagory/>
            </div>

            <main className="max-w-4xl mx-auto p-4">
                <h2 className="text-xl font-semibold mb-6 text-blue-700">
                    Latest Posts
                </h2>

                {/* Blog Posts */}
                {posts.map((post, index) => (
                    <div
                        key={post._id || index}
                        className="bg-white p-4 mb-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                        <div className="flex flex-col md:flex-row">

                            {/* Post Görüntüsü */}
                            <div className="w-full h-48 md:h-64 rounded-md mb-4  overflow-hidden md:w-1/3 md:m-0 flex justify-center">
                                <img
                                    src={"http://localhost:5000" + post.imageUrl || 'https://via.placeholder.com/400x300'}
                                    alt="Post"
                                    className=" h-full w-full object-cover"
                                />
                            </div>


                            {/* Post İçeriği */}
                            <div className="w-full md:w-2/3 ml-4 flex flex-col justify-between 	">
                                <div>
                                    <h3 className="text-lg font-bold mb-2 text-gray-800">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        {expandedPosts[post._id]
                                            ? post.content
                                            : `${post.content.substring(0, 350)}${post.content.length > 350 ? '...' : ''}`}
                                    </p>
                                </div>

                                <div>

                                    <button
                                        onClick={() => toggleReadMore(post._id)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        {expandedPosts[post._id] ? 'Show Less' : 'Read More'}
                                    </button>
                                    <p className="font-bold mb-3 mt-3 text-gray-700 ">
                                        Author: {post.author}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>
            <div className="bottom-0 pb-8 pt-3 w-full bg-gray-100">
                <div className="flex justify-center mt-4 space-x-2">
                    {renderPaginationButtons()}
                </div>
            </div>
        </div>
    );
}

export default HomePage;
