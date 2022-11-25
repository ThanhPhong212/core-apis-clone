const jwt = require('jsonwebtoken');

exports.numberFormatThousands = (num) => {
    return num.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

exports.decodeToken = (token) => {
    const bearer = token.split(' ');
    const bearerToken = bearer[1];
    const verify = jwt.verify(bearerToken, process.env.SECRET_KEY);
    return verify.id
}

exports.convertDate = (date, type = '/') => {
    return date.getDate() + type + (date.getMonth() + 1) + type + date.getFullYear()
}