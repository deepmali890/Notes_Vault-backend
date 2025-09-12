const express = require('express');
const userController = require('../controller/auth.controller');
const protect = require('../middleware/auth.middleware');


const router = express.Router();

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/user',protect, userController.getUser);
router.post('/logout', userController.logout);


module.exports = router;
