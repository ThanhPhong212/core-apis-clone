const { Router } = require('express');
const router = Router();

const validation = require('../middlewares/validationMiddleware')
const userSchemaValidate = require('../validates/user.validate')
const { getUsers, createUser, loginUser, checkPhone, resendOtp, checkOtp } = require('../controllers/user.controller');

const authorize = require('../middlewares/authorize')

router.get('/users', getUsers);
router.post('/user/register', validation(userSchemaValidate.create), createUser);
router.post('/user/login', loginUser);
router.post('/user/check-phone', checkPhone);
router.post('/user/resend-otp', resendOtp);
router.post('/user/check-otp', checkOtp);
// export router
module.exports = router;