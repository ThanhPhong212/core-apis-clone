const { Router } = require('express');
const fs = require('fs');
const path = require('path');
const router = Router();

fs.readdirSync(__dirname)
  .filter(file => {
    return ((file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js'));
  })
  .forEach(file => {
    var name = file.replace(file.slice(-10), '');
    name = require(path.join(__dirname, file));
    router.use('/api', name)
  });

// export router
module.exports = router;