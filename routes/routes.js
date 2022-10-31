const { Router } = require('express');
const router = Router();

const userRouter = require('./user.router');
const roleRouter = require('./role.router');
const uploadRouter = require('./upload.router');
const Message = require('./message.router');

router.use('/api', Message)
router.use('/api', userRouter)
router.use('/api', roleRouter)
router.use('/api', uploadRouter)


// export router
module.exports = router;