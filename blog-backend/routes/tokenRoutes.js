const express = require('express');
const { checkToken, createGuestToken } = require('../controllers/tokensController');

const router = express.Router();

router.get('/', checkToken);
router.get('/guest', createGuestToken);

module.exports = router;
