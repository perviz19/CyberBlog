import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { checkTokenValidity } from '../../utils/checktoken';


function Posts() {
    const [responseData, setResponseData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [token, setToken] = useState('')
    const [totalPosts, setTotalPosts] = useState(0);
    const [expandedPosts, setExpandedPosts] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [showNewPostModal, setShowNewPostModal] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        image: null,
        author: '',
        tags: '',
        content: '',
    });


    const post_per_page = 5;

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

                    if (role !== "root" && role !== 'admin') {
                        window.location.href = "/admin/login";
                    }
                    setToken(token);
                } catch (error) {
                    window.location.href = "/admin/login";
                }
            } else {
                window.location.href = "/admin/login";
            }
        }
        handleToken();
    }, []);


    const fetchPosts = async (page) => {
        try {
            const response = await axios.get(
                `http://localhost:5000/api/posts?page=${page}&limit=${post_per_page}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );
            setResponseData(response.data.posts);
            setTotalPosts(response.data.totalPosts);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchPosts(currentPage);
        }
    }, [currentPage, token]);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            image: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('title', formData.title);
        data.append('image', formData.image);
        data.append('author', formData.author);
        data.append('tags', formData.tags);
        data.append('content', formData.content);


        try {
            const response = await axios.post(
                `http://localhost:5000/api/posts/create`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );

            if (response.status === 201) {
                alert('Post created successfully!');
                closeNewPostModal();
                fetchPosts(currentPage)
            } else {
                alert(`Failed to create post: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while creating the post.');
        }
    };



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


    const handleDeletePost = async (id) => {
        setSelectedPostId(id);
        setConfirmationMessage('Are you sure you want to delete this post?');
        setShowConfirmation(true);
    };

    const handleEditPost = (post) => {
        console.log('Editing Post:', post);
        // Burada modal veya separate sayfa açabilirsin.
    };

    const handleAddNewPost = () => {
        setShowNewPostModal(true);
    };

    const closeNewPostModal = () => {
        setShowNewPostModal(false);
    };



    const confirmDelete = async (confirm) => {
        if (confirm) {
            try {
                await axios.delete(
                    `http://localhost:5000/api/posts?id=${selectedPostId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        withCredentials: true,
                    }
                );
                setConfirmationMessage('Post successfully deleted!');
            } catch (error) {
                console.error('Failed to delete post:', error);
                setConfirmationMessage('Failed to delete the post.');
            }
        } else {
            setConfirmationMessage('');
        }

        setShowConfirmation(false);
        fetchPosts(currentPage);

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
        <div className="bg-gray-100 min-h-auto">

            {/* New Post modal */}
            {showNewPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-10">
                    <div className="bg-white p-6 m-3 rounded-lg shadow-lg w-96 md:w-1/3">
                        <h2 className="text-xl font-bold mb-4">Create New Post</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="w-full border rounded p-2 bg-gray-100"
                                    placeholder="Enter post title"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="imageUpload" className="block text-gray-700 font-bold mb-2">Upload Image</label>
                                <label
                                    htmlFor="imageUpload"
                                    className="inline-block bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600 transition duration-200 ease-in-out"
                                >
                                    Choose File
                                </label>
                                <input
                                    id="imageUpload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="author" className="block text-gray-700 font-bold mb-2">Author</label>
                                <input
                                    id="author"
                                    type="text"
                                    className="w-full border rounded p-2 bg-gray-100"
                                    placeholder="Enter author name"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tags" className="block text-gray-700 font-bold mb-2">Tags</label>
                                <input
                                    id="tags"
                                    type="text"
                                    className="w-full border rounded p-2 bg-gray-100"
                                    placeholder="Enter tags separated by commas"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="content" className="block text-gray-700 font-bold mb-2">Content</label>
                                <textarea
                                    id="content"
                                    className="w-full border rounded p-2 min-h-40 bg-gray-100"
                                    placeholder="Enter post content"
                                    onChange={handleInputChange}
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={closeNewPostModal}
                                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            { /* Cancel and Comfirm Pop Up */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-8 rounded-lg shadow-lg">
                        <p>{confirmationMessage}</p>

                        <div className="flex space-x-4 mt-4 justify-center">
                            <button
                                onClick={() => confirmDelete(false)}
                                className="px-4 py-2 bg-red-500 rounded text-white hover:bg-red-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => confirmDelete(true)}
                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}



            <main className="max-w-4xl mx-auto p-4">

                {/* New Post Button */}
                <div className="mb-4">
                    <button
                        onClick={handleAddNewPost}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        + New Post
                    </button>
                </div>

                {responseData.map((post) => (
                    <div key={post._id} className="bg-white p-4 mb-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">

                        {/* Edit and Delete Icons */}
                        <div className="flex space-x-4  justify-end ">
                            {/* Edit Button */}
                            <div className="relative group ">
                                <button
                                    onClick={() => handleEditPost(post)}
                                    className="text-blue-500 text-xl hover:text-blue-700"
                                >
                                    <FaEdit />
                                </button>

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
                                    Edit
                                </div>
                            </div>


                            <div className="relative group">
                                <button
                                    onClick={() => handleDeletePost(post._id)}
                                    className="text-red-500 text-xl hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>

                                {/* Tooltip */}
                                <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-700 text-white text-xs rounded py-1 px-2">
                                    Delete
                                </div>
                            </div>
                        </div>


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
                                            : `${post.content.substring(0, 500)}${post.content.length > 500 ? '...' : ''}`}
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

export default Posts;
