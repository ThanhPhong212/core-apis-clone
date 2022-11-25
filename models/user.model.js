'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Role.hasOne(this, {
        foreignKey: { name: 'role_id', allowNull: false },
        onDelete: 'NO ACTION',
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    phone: {
      type: DataTypes.STRING,
      unique: {
        msg: "Phone must be unique"
      }
    },

    password: {
      type: DataTypes.STRING
    },

    fullName: {
      type: DataTypes.STRING,
    },

    birthDate: {
      type: DataTypes.DATE
    },

    birthdayFormat: {
      type: DataTypes.VIRTUAL,
      get() {
        const date = this.getDataValue('birthDate');
        return convertDate(date);
      },
    },

    avatar: {
      type: DataTypes.STRING,
      set(value) {
        this.setDataValue('avatar', `user/${this.id}/avatar/${value}`);
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

    nationality: {
      type: DataTypes.STRING
    },

    gender: {
      type: DataTypes.STRING
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
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
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: false,
    indexes: [
      { fields: ['phone'], name: 'key_unique', unique: true }
    ]
  });
  return User;
};