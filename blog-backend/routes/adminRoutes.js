// backend/routes/adminRoutes.js
const express = require('express');
const { Login, ListUsers, AddUser, DeleteUser, UpdatePass } = require('../controllers/adminController');
const { authorizeAdmin, authorizeRoot } = require('../middleware/auth');
const router = express.Router();

router.get('/', authorizeRoot, ListUsers);
router.post('/login', Login);
router.post('/add', AddUser );
router.post('/update', authorizeAdmin, UpdatePass);
router.post('/delete', authorizeRoot, DeleteUser );

module.exports = router;
