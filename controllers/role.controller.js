const { Role, User, InvestFund } = require('../models/index');
const Sequelize = require('sequelize');
const { Op } = require('sequelize');

//  create role
exports.createRole = async (req, res) => {
  try {
    const role = await Role.create(req.body);
    res.status(200).send({
      status: true,
      message: '',
      data: role,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};
exports.getRoles = async (req, res) => {
  try {
    const role = await Role.findAll();
    if (!role) {
      res.status(404).send({
        status: false,
        message: 'not found',
        data: role,
      });
    }
    res.status(200).send({
      status: true,
      message: '',
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
        message: '',
      });
    }
    res.status(200).send({
      status: true,
      message: '',
      data: roleId,
    });
  } catch (error) {
    return res.status(400).send({
      status: false,
      message: error.message,
    });
  }
};

// get user by value of role
exports.getUserRole = async (req, res) => {
  try {

    const users = await Role.findAll({
      raw: true,
      where: {
        value: req.params.value,
      },
      attributes: [
        "value",
        "active",
        [Sequelize.col("Users.id"), "userId"],
        [Sequelize.col("Users.fullName"), "fullName"],
      ],
      include: [
        {
          model: User,
          where: { isDeleted: false },
          attributes: [],
        }
      ],
    });
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
