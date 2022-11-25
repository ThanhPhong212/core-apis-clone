const { Router } = require('express');
const router = Router();

const validation = require('../middlewares/validationMiddleware')
const userSchemaValidate = require('../validates/user.validate')
const {
    getUsers,
    createUser,
    loginUser,
    checkPhone,
    resendOtp,
    checkOtp,
    updateProfile,
    getProfile,
    refreshToken
} = require('../controllers/user.controller');
const authorize = require('../middlewares/authorize')

router.get('/users', getUsers);

router.post('/user/register', validation(userSchemaValidate.create), createUser);

router.post('/login', loginUser);

router.post('/refresh-token', refreshToken);

router.get('/profile', authorize([]), getProfile);

router.post('/user/check-phone', checkPhone);

router.post('/user/resend-otp', resendOtp);

router.post('/user/check-otp', checkOtp);

router.put('/user/update-profile/:id', updateProfile);

// export router
module.exports = router;