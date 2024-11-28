const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user');
const { join, login, logout } = require('../controllers/auth');

const router = express.Router();

router.post('/join', isNotLoggedIn, async(req,res,next) =>{
  const {email, nick, password} = req.body;
  try{
    const exUser = await User.findOne({where : {email}});
    if(exUser){
      return res.redirect('/join?error=exit');
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  }catch (error){
    console.error(error);
    return next(error);
  }
});

router.post('./login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user,info)=>{
    if(authError){
      console.error(authError);
      return next(authError);
    }
    if(!user){
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.login(user, (loginError) => {
      if(loginError){
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req,res,next);
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  res.session.destroy();
  res.redirect('/');
});
// // POST /auth/join
// router.post('/join', isNotLoggedIn, join); 

// // POST /auth/login
// router.post('/login', isNotLoggedIn, login);

// // GET /auth/logout
// router.get('/logout', isLoggedIn, logout);

// // GET /auth/kakao
// router.get('/kakao', passport.authenticate('kakao'));

// // GET /auth/kakao/callback
// router.get('/kakao/callback', passport.authenticate('kakao', {
//   failureRedirect: '/?error=카카오로그인 실패',
// }), (req, res) => {
//   res.redirect('/'); // 성공 시에는 /로 이동
// });

module.exports = router;
