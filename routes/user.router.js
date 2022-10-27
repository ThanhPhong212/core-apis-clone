const { Router } = require('express');
const router = Router();

const validation = require('../middlewares/validationMiddleware')
const userSchemaValidate = require('../validates/user.validate')
const { getUsers, createUser, loginUser, checkPhone } = require('../controllers/user.controller');

const authorize=require('../middlewares/authorize')

router.get('/users', getUsers);
router.post('/user/register',authorize(['ADMIN']), validation(userSchemaValidate.create), createUser);
router.post('/user/login', loginUser);
router.post('/user/check-phone', checkPhone);
// export router
module.exports = router;