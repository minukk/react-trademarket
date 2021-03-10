const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Recomment extends Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      modelName: 'Recomment',
      tableName: 'recomments',
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      sequelize,
    });
  }
  static associate(db) {
    db.Recomment.belongsTo(db.User);
    db.Recomment.belongsTo(db.Product);
    db.Recomment.belongsTo(db.Comment);
  }
};