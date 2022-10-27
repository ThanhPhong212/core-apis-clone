const { Router } = require('express');
const router = Router();
const { uploadFile } = require('../controllers/upload.controller');

router.post('/upload-file', uploadFile);

module.exports = router;