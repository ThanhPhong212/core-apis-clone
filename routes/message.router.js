const { Router } = require('express');
const router = Router();

const { send, getConversation } = require('../controllers/message.controller');

router.post('/message/send', send);
router.get('/message/get-conversation', getConversation);
// export router
module.exports = router;