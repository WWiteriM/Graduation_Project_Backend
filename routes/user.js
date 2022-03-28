const express = require('express');
const { authCheck } = require('../middlewares/auth');
const { userCart, getUserCart } = require('../controllers/user');

const router = express.Router();

router.post('/user/cart', authCheck, userCart);
router.get('/user/cart', authCheck,getUserCart);

module.exports = router;
