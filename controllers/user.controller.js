const { User, Otp } = require('../models/index');
const { Op } = require("sequelize");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');

//Check SDT
exports.checkPhone = async (req, res) => {
    try {
        const { phone } = req.body;
        const user = await User.findOne({
            where: { phone: phone }
        });
        if (user) {
            if (!user.isVerified) {
                const check = await sendOtp(phone);
                if (!check) return res.status(400).json({ status: false, message: "Please wait 90second to send again!!!" });
                return res.status(200).json({
                    status: true,
                    message: "",
                    data: { type: "register", phone: phone }
                });
            }
            return res.status(200).json({
                status: true,
                message: "user exsit",
                data: { type: "login", phone: phone }
            });
        }
        await User.create({ phone: phone, roleId: 2 });
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
    //đợi nhà cung cấp sms
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

//gửi lại otp
exports.resendOtp = async (req, res) => {
    const { phone } = req.body;
    const check = await sendOtp(phone);
    if (!check) return res.status(400).json({ status: false, message: "Please wait 90second to send again!!!" });
    return res.status(200).json({
        status: true,
        message: ""
    });
}

//Kiểm tra opt
exports.checkOtp = async (req, res) => {
    const { phone, otp } = req.body;
    const checkOtp = await Otp.findOne({
        where: {
            phone: phone,
            otp: otp,
            timeExpired: { [Op.gt]: Date.now() }
        }
    });
    if (!checkOtp) return res.status(400).json({ status: false, message: "OTP is not valid" });
    const user = await User.findOne({
        where: { phone: phone }
    });
    try {
        user.isVerified = true;
        user.isActive = true;
        await user.save();
    }
    catch (error) {
        return res.status(500).json({
            status: false,
            message: error.message,
            data: null
        });
    }
    res.status(200).send({
        status: true,
        message: 'verify success',
    })
}

// Create User (update password)
exports.createUser = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({
            where: { phone: phone }
        });
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        req.body.password = hashPassword;
        user.password = hashPassword;
        await user.save();
        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).send({
            status: true,
            message: 'success',
            token: token
        });
    } catch (err) {
        return res.status(400).send({
            status: false,
            message: err.message
        })
    }
}

// update user
exports.updateProfile = async (req, res) => {
    try {
        const id = req.params.id;
        if (req.files) {
            const file = req.files.avatar;
            const dir = `./tmp/avatarUser/`;
            const avt = await User.findOne({ where: { id: id }, attributes: ['avatar'] });
            if (avt) {
                if (avt.avatar) {
                    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                    fs.unlink(`${dir}/${avt.avatar}`, function (err) {
                        if (err) return;
                    });
                }
                file.name = file.md5 + '-' + id + '.' + file.name.split('.').pop();
                const path = `${dir}/${file.name}`;
                await file.mv(path, function (err) {
                    if (err) return res.status(400).send({ status: false, message: err.message });
                });
                req.body.avatar = file.name;
            }
        }
        const user = await User.update(req.body, { where: { id: id } });
        if (user == 1) {
            return res.status(200).send({ status: true, message: 'Update success' });
        } else {
            return res.status(400).send({ status: false, message: 'Update fail' });
        }
    } catch (error) {
        res.status(400).send({ status: false, message: error.message });
    }
};

// Get all ->
exports.getUsers = async (req, res) => {
    try {
        const { roleId, status, key_word, orderBy } = req.query;
        const limit = req.query.limit ? req.query.limit : 10;
        const page = req.query.page ? req.query.page : 1;
        const query = [{ isDeleted: false }];
        const query_role = [];
        const keyWord = [];

        //setup sort order
        const order_default = {
            createdAt: ['createdAt', 'DESC'],
            roleId: ['roleId', 'DESC'],
        };
        const order = [];
        if (orderBy) {
            for (let i = 0; i < orderBy.split(',').length; i++) {
                if (order_default[orderBy.split(',')[i]]) {
                    order_default[orderBy.split(',')[i]] = [orderBy.split(',')[i], 'ASC'];
                }
            }
        }
        Object.keys(order_default).forEach((keys) => {
            order.push(order_default[keys]);
        });

        //set up sort for query Or
        if (key_word)
            keyWord.push(
                {
                    fullName: {
                        [Op.iLike]: `%${key_word}%`,
                    },
                },
                {
                    code: {
                        [Op.iLike]: `%${key_word}%`,
                    },
                }
            );
        if (!key_word) keyWord.push({ isDeleted: false });

        //set up sort for query And
        if (status) query.push({ status: status });
        if (role_id) query_role.push({ id: roleId });
        const user = await User.findAndCountAll({
            where: {
                [Op.and]: [...query],
                [Op.or]: [...keyWord],
            },
            attributes: { exclude: ['password', 'roleId'] },
            include: [
                {
                    where: {
                        [Op.and]: [...query_role],
                    },
                    model: Role,
                    attributes: ['id', 'text', 'value'],
                },
            ],
            limit: limit,
            offset: (page - 1) * limit,
            order: [...order],
        });
        const total_page = user.count % limit != 0 ? Math.floor(user.count / limit) + 1 : Math.floor(user.count / limit);
        res.status(200).send({
            last_updated: user.rows.length > 0 ? convertDate(user.rows[0].updatedAt) : null,
            total_page: total_page,
            data: user.rows,
            page,
            limit,
            isNext: parseInt(page) < total_page ? true : false,
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message,
        });
    }
};

// login User
exports.loginUser = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const user = await User.findOne({
            where: { userName: userName, isDeleted: false, status: true }
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
        const refreshToken = jwt.sign({ id: user.id }, process.env.SECRET_REFRESH_KEY, {
            expiresIn: process.env.JWT_REFRESH_EXPIRE,
        });
        res.status(200).send({
            status: true,
            message: 'login success',
            token: token,
            refreshToken: refreshToken,
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        })
    }
}

//Profile
exports.getProfile = async (req, res) => {
    try {
        if (!req.headers.authorization) res.send(403);
        const bearer = req.headers.authorization.split(' ');
        const bearerToken = bearer[1];
        const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
        const id = verify.id;
        const user = await User.findByPk(id, {
            include: {
                model: Role
            },
            attributes: {
                exclude: ['password', 'token', 'roleId']
            }
        });
        if (user) {
            res.status(200).send({
                status: true,
                message: '',
                data: user,
            });
        } else {
            res.status(404).send({
                message: `Cannot find User with id=${id}.`
            });
        }
    }
    catch (err) {
        return res.status(400).send({
            status: false,
            message: err.message,
        });
    }

};

exports.refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;
        if (!refresh_token) return res.status(403).send({
            status: false,
            message: "Refresh token is required!!!"
        });
        const verify = jwt.verify(refresh_token, process.env.SECRET_REFRESH_KEY);
        const id = verify.id;
        const token = jwt.sign({ id: id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRE,
        });
        res.status(200).send({
            status: true,
            message: 'Refresh token success',
            token: token,
        });
    } catch (error) {
        return res.status(400).send({
            status: false,
            message: error.message
        })
    }
}