const { User, Role, Otp } = require('../models/index');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const { convertUnderscore } = require('../plugins/index');
const jwt = require('jsonwebtoken');

//Check SDT
exports.checkPhone = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({
            where: { phone: phone }
        });
        if (user) {
            return res.status(200).json({
                status: true,
                message: "user exsit",
                data: { type: "login", phone: phone }
            });
        }
        const check = await sendOtp(phone);
        if (!check) return res.status(400).json({ status: false, message: "Please wait 90second to send again!!!" });
        return res.status(200).json({
            status: true,
            message: "",
            data: { type: "register", phone: phone }
        });
    } catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
}

const sendOtp = async (phone) => {
    const otp = Math.floor(100000 + Math.random() * 999999);
    try {
        const phoneOtp = await Otp.findOne({
            where: { phone: phone }
        });
        if (phoneOtp) {
            if (phoneOtp.timeExpired <= Date.now()) {
                await Otp.update({
                    otp: otp,
                    timeExpired: new Date(new Date().getTime() + 90 * 1000)
                }, {
                    where: { phone: phone }
                });
                return true;
            }
            return false;
        } else {
            const data = {
                otp: otp,
                phone: phone
            }
            await Otp.create(data);
            return true;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

exports.resendOtp = async (req, res) => {
    const { phone } = req.body;
    const check = await sendOtp(phone);
    if (!check) return res.status(400).json({ status: false, message: "Please wait 90second to send again!!!" });
    return res.status(200).json({
        status: true,
        message: ""
    });
}

exports.checkOtp = () => {
}
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
        const { phone, password } = req.body;
        const user = await User.findOne({
            where: { phone: phone }
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
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).send({
            status: true,
            message: 'login success',
            token: token
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        })
    }
}