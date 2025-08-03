'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transaksi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  transaksi.init({
    userId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    listId: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    trid: DataTypes.TEXT,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transaksi',
  });
  return transaksi;
};