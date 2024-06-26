const {Sequelize} = require('sequelize')
const {sequelize} = require('../db')

const Song = sequelize.define("songs", {
  title: Sequelize.STRING,
  price: Sequelize.NUMBER,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
  image: Sequelize.STRING,
});

module.exports = {
  db: sequelize,
  Song
};
