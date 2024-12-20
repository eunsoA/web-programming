const Sequelize = require('sequelize');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');
const Like = require('./like');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Post = Post;
db.Comment = Comment;
db.Like = Like;

User.initiate(sequelize);
Post.initiate(sequelize);
Comment.initiate(sequelize);
Like.initiate(sequelize);

User.associate(db);
Post.associate(db);
Comment.associate(db);
Like.associate(db);

module.exports = db;
