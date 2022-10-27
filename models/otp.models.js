'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Otp extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Otp.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        phone: {
            type: DataTypes.STRING
        },
        otp: {
            type: DataTypes.STRING
        },
        timeExpired: {
            type: DataTypes.DATE,
            defaultValue: new Date(new Date().getTime() + 90 * 1000)
        }
    }, {
        sequelize,
        modelName: 'Otp',
        tableName: 'otps',
        underscored: true,
        underscoredAll: true,
        timestamps: false,
        indexes: [
            { fields: ['phone'], name: 'phone_otp_unique', unique: true }
        ]
    });
    return Otp;
};