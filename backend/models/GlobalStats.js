const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const GlobalStats = sequelize.define(
  "GlobalStats",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    totalValidVotes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = GlobalStats;
