const express = require('express');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const { Post, User, Comment } = require('../models');

const router = express.Router();

// 공통 미들웨어 - 모든 라우터에서 사용할 수 있도록 res.locals 에 값 설정
router.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// 메인 페이지 (/)
router.get('/', async (req, res, next) => {
  try {
    res.render('main', {
      title: '웹 프로그래밍 과제',
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 프원가입 페이지 (/account)
router.get('/account', isNotLoggedIn, (req, res) => {
  res.render('account', {
    title: '회원가입',
  });
});

// 프로필 페이지 (/profile)
router.get('/profile', isLoggedIn, async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      where: { user_id: req.user.user_id },
      include: [{
        model: User,
        attributes: ['user_id', 'username']
      }],
      order: [['created_at', 'DESC']]
    });

    const postCount = await Post.count({
      where: { user_id: req.user.user_id }
    });

    res.render('profile', {
      title: '내 정보',
      user: req.user,
      posts,
      postCount
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
