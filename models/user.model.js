'use strict';
const { Model } = require('sequelize');
const { convertDate } = require("../plugins/index");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Role.hasMany(this, {
        foreignKey: { name: 'roleId', allowNull: false },
        onDelete: 'NO ACTION',
      });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      avatar: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('avatar', `user/${this.code}/avatar/${value}`);
        },
        get() {
          const url = `${process.env.URL_AVT}:${process.env.PORT}`;
          const avatar = this.getDataValue('avatar');
          if (!avatar) {
            return `${url}/user/avatar-default.png`;
          }
          return `${url}/${avatar}`;
        },
      },
      email: {
        type: DataTypes.STRING,
        set(value) {
          this.setDataValue('userName', `${value}`);
          this.setDataValue('email', `${value}`);
        },
      },
      password: {
        type: DataTypes.STRING,
      },
      fullName: {
        type: DataTypes.STRING,
      },
      gender: {
        type: DataTypes.STRING,
        defaultValue: '2',
      },
      birthday: {
        type: DataTypes.DATEONLY,
      },
      birthdayFormat: {
        type: DataTypes.VIRTUAL,
        get() {
          const date = this.getDataValue('birthday');
          if (date) {
            const date2 = date.split('-');
            return `${date2[2]}-${date2[1]}-${date2[0]}`;
          }
        },
      },
      phone: {
        type: DataTypes.STRING,
        unique: {
          msg: 'phone must be unique',
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: new Date(),
        get() {
          const date = this.getDataValue('createdAt');
          return convertDate(date);
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: true,
      createdAt: false,
      // indexes: [
      //   { fields: ['userName','email'], name: 'key_unique', unique: true }
      // ]
    }
  );
  return User;
};
