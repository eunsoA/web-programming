const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Post, { foreignKey: 'user_id' });
    db.User.hasMany(db.Comment, { foreignKey: 'user_id' });
    db.User.hasMany(db.Like, { foreignKey: 'user_id' });
  }
};

module.exports = User;
