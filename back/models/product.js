const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Product extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING(30),
      },
    }, {
      modelName: 'Product',
      tableName: 'products',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    });
  }
  static associate(db) {
    db.Product.hasMany(db.Comment);
    db.Product.hasMany(db.Recomment);
    db.Product.hasMany(db.Image);
    db.Product.belongsTo(db.User);
    db.Product.belongsToMany(db.Hashtag, { through: 'ProductHashtag' });
    db.Product.belongsToMany(db.User, { through: 'Star', as: 'Favored' })
  }
};