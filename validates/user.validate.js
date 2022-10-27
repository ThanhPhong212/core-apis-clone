const yup = require('yup');

exports.create = yup.object().shape({
    phone: yup.string().required(),
    password: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    roleId: yup.number().required(),
});