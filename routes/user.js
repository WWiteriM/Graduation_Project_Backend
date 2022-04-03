const express = require('express');
const { authCheck } = require('../middlewares/auth');
const {
    userCart,
    getUserCart,
    emptyCart,
    saveAddress,
    applyCouponToUserCart,
    createOrder,
    orders,
    addToWishList,
    wishlist,
    removeFromWishlist
} = require('../controllers/user');

const router = express.Router();

router.post('/user/cart', authCheck, userCart);
router.get('/user/cart', authCheck,getUserCart);
router.delete('/user/cart', authCheck, emptyCart);
router.post('/user/address', authCheck, saveAddress);
router.post('/user/cart/coupon', authCheck, applyCouponToUserCart);
router.post('/user/order', authCheck, createOrder);
router.get('/user/orders', authCheck, orders);
router.post('/user/wishlist', authCheck, addToWishList);
router.get('/user/wishlist', authCheck, wishlist);
router.put('/user/wishlist/:productId', authCheck, removeFromWishlist);

module.exports = router;
