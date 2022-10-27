const { Router } = require('express');
const router = Router();

const userRouter = require('./user.router');
const roleRouter = require('./role.router');
const uploadRouter = require('./upload.router');

router.use('/api', userRouter)
router.use('/api', roleRouter)
router.use('/api', uploadRouter)


// export router
module.exports = router;