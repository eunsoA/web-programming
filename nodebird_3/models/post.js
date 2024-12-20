const Sequelize = require('sequelize');

class Post extends Sequelize.Model {
  static initiate(sequelize) {
    Post.init({
      post_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      image_url: {
        type: Sequelize.STRING(255),
        allowNull: true,
      }
    }, {
      sequelize,
      timestamps: true,
      underscored: true,
      modelName: 'Post',
      tableName: 'board',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Post.belongsTo(db.User, { foreignKey: 'user_id' });
    db.Post.hasMany(db.Comment, { foreignKey: 'post_id' });
    db.Post.hasMany(db.Like, { foreignKey: 'post_id' });
  }
};

module.exports = Post;
