const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pelicula = sequelize.define('Pelicula', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  anio: { type: DataTypes.INTEGER, allowNull: false },
  director: { type: DataTypes.STRING, allowNull: false },
  sinopsis: { type: DataTypes.TEXT, allowNull: false },
  fase: { type: DataTypes.STRING, allowNull: false }
}, {
  timestamps: true
});

module.exports = Pelicula;
