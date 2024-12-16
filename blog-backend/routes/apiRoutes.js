const express = require('express');
const adminRoutes = require('./adminRoutes');
const postRoutes = require('./postRoutes');
const tokenRoutes = require('./tokenRoutes');
const router = express.Router();

router.use('/auth', tokenRoutes);
router.use('/admin', adminRoutes);
router.use('/posts', postRoutes);

module.exports = router;
