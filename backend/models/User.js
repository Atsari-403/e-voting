const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define(
  "User",
  {
    nim: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hasVoted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "mahasiswa"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;
