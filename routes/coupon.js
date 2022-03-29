const express = require('express');
const { authCheck, adminCheck } = require('../middlewares/auth');
const { create, remove, list } = require('../controllers/coupon');

const router = express.Router();

router.post('/coupon', authCheck, adminCheck, create);
router.get('/coupons', list);
router.delete('/coupon/:couponId', authCheck, adminCheck, remove);

module.exports = router;
