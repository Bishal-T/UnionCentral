const userController = require('../controllers/usersControllers');
const express = require('express');
const {isGuest, isLoggedIn} = require('../middleware/auth');
const profileImage = require('../middleware/profileIMGUpload');
const {validateResult, validateLogin, validateSignUp} = require('../middleware/validator');
const {loginLimiter} = require('../middleware/rateLimiter');

const router = express.Router();

router.get('/new', isGuest, userController.getNew);

router.post('/', isGuest,  profileImage.fileUpload, validateSignUp, validateResult, userController.postNew);

router.get('/login', isGuest, userController.getLogin);

router.post('/login', loginLimiter, isGuest, validateLogin,validateResult,  userController.postLogin);

router.get('/profile', isLoggedIn, userController.getProfile);

router.get('/logout', isLoggedIn, userController.getLogout);




module.exports = router;

