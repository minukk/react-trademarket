const Sequelize = require('sequelize');
const user = require('./user');
const product = require('./product');
const comment = require('./comment');
const recomment = require('./recomment');
const hashtag = require('./hashtag');
const image = require('./image')

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = user;
db.Product = product;
db.Comment = comment;
db.Recomment = recomment;
db.Hashtag = hashtag;
db.Image = image;

Object.keys(db).forEach((modelName) => {
  db[modelName].init(sequelize);
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
