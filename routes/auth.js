const express = require('express');
const { authCheck } = require('../middlewares/auth');
const { createOrUpdateUser, currentUser } = require('../controllers/auth');

const router = express.Router();

router.post('/create-or-update-user', authCheck, createOrUpdateUser);
router.post('/current-user', authCheck, currentUser);

module.exports = router;
