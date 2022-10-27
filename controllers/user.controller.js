const { User, Role } = require('../models/index');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const { convertUnderscore } = require('../plugins/index');
// Create User
exports.createUser = async (req, res) => {
    try {
        const { password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        req.body.password = hashPassword;
        req.body.role_id = req.body.roleId;
        const user = await User.create(req.body);
        res.status(200).send({
            status: true,
            message: '',
            data: await convertUnderscore(user)
        });
    } catch (err) {
        return res.status(400).send({
            status: false,
            message: err.message
        })
    }
}

// Get all -> 
exports.getUsers = async (req, res) => {
    try {
        // lay theo limit, theo page
        // isNext ?
        // custom fillter
        const { first_name, last_name, createAt } = req.query;
        const limit = req.query.limit ? req.query.limit : 10;
        const page = req.query.page ? req.query.page : 1;
        const query = [];
        if (first_name) query.push({ first_name: { [Op.like]: `%${first_name}%` } });
        if (last_name) query.push({ last_name: { [Op.like]: `%${last_name}%` } });
        if (createAt) query.push({ created_at: { [Op.gte]: createAt } });
        const user = await User.findAndCountAll({
            where: {
                [Op.and]: [
                    ...query
                ]
            },
            limit: limit,
            offset: (page - 1) * limit,
            order: [['created_at', 'ASC']],
        });
        const total_page = (user.count % limit) != 0 ? Math.floor(user.count / limit) + 1 : Math.floor(user.count / limit);
        await convertUnderscore(user.rows);
        res.status(200).send({
            total_page: total_page,
            data: user.rows,
            page,
            limit,
            isNext: parseInt(page) < total_page ? true : false
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        })
    }
}

// login User
exports.loginUser = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({
            where: { userName: userName }
        })
        if (!user) return res.status(403).send({
            status: false,
            message: "User not exist!!!"
        });
        const check = await bcrypt.compare(password, user.password);
        if (!check) return res.status(403).send({
            status: false,
            message: "password wrong!!!"
        });
        res.status(200).send({
            status: true,
            message: 'login success',
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        })
    }
}