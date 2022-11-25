const { Router } = require("express");
const router = Router();

const validation = require("../middlewares/validationMiddleware");
const roleSchemaValidate = require("../validates/role.validate");
const {
  getRoles,
  createRole,
  getUserRole,
} = require("../controllers/role.controller");

router.get("/roles", getRoles);

router.post("/role/create",validation(roleSchemaValidate.create) ,createRole);

router.get("/role/:value", getUserRole);

// export router
module.exports = router;
