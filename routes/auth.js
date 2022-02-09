const express = require('express');
const { authCheck } = require('../middlewares/auth');
const { createOrUpdateUser } = require('../controllers/auth');

const router = express.Router();

router.post('/create-or-update-user', authCheck, createOrUpdateUser);

module.exports = router;
