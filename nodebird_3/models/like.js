const Sequelize = require('sequelize');

class Like extends Sequelize.Model {
  static initiate(sequelize) {
    Like.init({
      like_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'board',
          key: 'post_id'
        }
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: 'Like',
      tableName: 'likes',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
      indexes: [
        {
          unique: true,
          fields: ['post_id', 'user_id']
        }
      ]
    });
  }

  static associate(db) {
    db.Like.belongsTo(db.User, { foreignKey: 'user_id' });
    db.Like.belongsTo(db.Post, { foreignKey: 'post_id' });
  }
};

module.exports = Like; 