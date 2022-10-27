const { Role, User } = require("../models/index");
const Sequelize = require("sequelize");

//  create role
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body)
    res.status(200).send({
      status: true,
      message: "",
      data: role,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// get all role
exports.getRoles = async (req, res) => {
  try {
    const role = await Role.findAll();
    if (!role) {
      res.status(404).send({
        status: false,
        message: "",
        data: role,
      });
    }
    res.status(200).send({
      status: true,
      message: "",
      data: role,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

//get role by id
exports.getRoleId = async (req, res) => {
  try {
    const roleId = await Role.findByPk(req.params.id);
    if (!roleId) {
      return res.status(404).send({
        status: false,
        message: "",
      });
    }
    res.status(200).send({
      status: true,
      message: "",
      data: roleId,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

//get users by role id

exports.getUserRoleId = async (req, res) => {
  try {
    const users = await Role.findAll({
      raw: true,
      where: {
        id: req.params.id,
      },
      attributes: [
        "id",
        "value",
        "text",
        "active",
        [Sequelize.col("User.id"), "user_id"],
        [Sequelize.col("User.user_name"), "user_name"],
        [Sequelize.col("User.first_name"), "first_name"],
        [Sequelize.col("User.last_name"), "last_name"],
        [Sequelize.col("User.created_at"), "created_at"],
      ],
      include: [
        {
          model: User,
          attributes: [],
        },
      ],
    });
    if (!users) {
      return res.status(404).send({
        status: false,
        message: "",
        data: [],
      });
    }
    res.status(200).send({
      status: true,   
      message: "",
      data: users,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
