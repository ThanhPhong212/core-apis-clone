"use strict";
const userConfig = require("../config/config.json").constant.user;
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      value: {
        type: DataTypes.STRING,
      },
      text: {
        type: DataTypes.VIRTUAL,
        get() {
          if (userConfig.ROLES.includes(this.value)) {
            return userConfig[this.value];
          } else {
            return this.value;
          }
        },
        set(value) {
          throw new Error("Do not try to set the `text` value!");
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
      underscored: true,
      timestamps: false,
    }
  );
  return Role;
};
