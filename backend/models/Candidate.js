const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Candidate = sequelize.define(
  "Candidate",
  {
    nameKetua: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nameWakil: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    visi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    misi: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    designType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "combined",
      validate: {
        isIn: [["combined", "separate"]],
      },
    },
    fotoKetua: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fotoWakil: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fotoPamflet: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    votes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Candidate;
