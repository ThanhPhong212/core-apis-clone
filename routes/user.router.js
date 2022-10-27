const { Router } = require('express');
const router = Router();

const validation = require('../middlewares/validationMiddleware')
const userSchemaValidate = require('../validates/user.validate')
const { getUsers, createUser, loginUser } = require('../controllers/user.controller');

router.get('/users', getUsers);
router.post('/user/register', validation(userSchemaValidate.create), createUser);
router.post('/user/login', loginUser);
// export router
module.exports = router;