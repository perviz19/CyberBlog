const Post = require('../models/Post');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

const getPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const totalPosts = await Post.countDocuments({});
        const posts = await Post.find({})
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.status(200).json({
            posts,
            totalPosts
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const createPost = async (req, res) => {
    try {
      const { title, content, author, tags } = req.body;
      const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
      const newPost = await Post.create({
        title,
        content,
        imageUrl: imagePath,
        author,
        tags: tags ? tags.split(',') : [], 
      });
  
      res.status(201).json({
        message: 'Post created successfully!',
        post: newPost,
      });
    } catch (error) {
      console.error('Error while creating post:', error);
      res.status(500).json({ message: 'Failed to create post', error });
    }
  };


const updatePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid ID!' });
        }

        const updatedPost = await Post.findByIdAndUpdate(id, req.body, {
            new: true
        });

        if (updatedPost) return res.status(200).json(updatedPost);
        return res.status(404).json({ message: 'Blog not found!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const id  = req.query.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid id' });
        }

        const post = await Post.findByIdAndDelete(id);

        if (post) return res.status(200).send();
        return res.status(404).json({ message: 'Blog not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getPosts, createPost, updatePost, deletePost };
