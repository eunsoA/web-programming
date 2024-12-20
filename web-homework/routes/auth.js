const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('../middlewares');
const User = require('../models/user');
const { Op } = require('sequelize');

const router = express.Router();

// 회원가입
router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, name, username, password } = req.body;
  try {
    const exUser = await User.findOne({ 
      where: { 
        [Op.or]: [{ email }, { username }] 
      } 
    });
    if (exUser) {
      return res.redirect('/account?error=exist');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      name,
      username,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

// 로그인
router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?error=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);
});

// 로그아웃
router.get('/logout', isLoggedIn, (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;
