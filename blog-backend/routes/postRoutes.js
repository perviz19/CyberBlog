const express = require('express');
const { getPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const { authorizeAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  

const upload = multer({ storage });

const router = express.Router();

router.get('', getPosts);
router.post('/create', authorizeAdmin, upload.single('image'), createPost);
router.put('/', authorizeAdmin, updatePost);
router.delete('', authorizeAdmin, deletePost);

module.exports = router;
