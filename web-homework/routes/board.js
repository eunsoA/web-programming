const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Post, User, Comment } = require('../models');
const { isLoggedIn } = require('../middlewares');
const { Op } = require('sequelize');

const router = express.Router();

try {
  fs.readdirSync('uploads');
} catch (error) {
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// 게시판 목록
router.get('/', async (req, res, next) => {
  try {
    const query = req.query.search || '';
    const where = query ? {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { content: { [Op.like]: `%${query}%` } },
        { '$User.username$': { [Op.like]: `%${query}%` } }
      ]
    } : {};

    const posts = await Post.findAll({
      attributes: ['post_id', 'title', 'content', 'image_url', 'created_at', 'updated_at', 'user_id'],
      include: [{
        model: User,
        attributes: ['username']
      }],
      where,
      order: [['created_at', 'DESC']]
    });

    res.render('board', {
      title: '게시판',
      posts,
      query
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// 새 게시글 작성 페이지
router.get('/new', isLoggedIn, (req, res) => {
  res.render('write', { title: '새 게시글 작성' });
});

// 게시글 작성
router.post('/', isLoggedIn, upload.single('image'), async (req, res, next) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      content: req.body.content,
      image_url: req.file ? `/img/${req.file.filename}` : null,
      user_id: req.user.user_id,
    });
    res.redirect('/board');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 댓글 작성
router.post('/:id/comment', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ where: { post_id: req.params.id }});
    if (!post) {
      return res.status(404).redirect('/board');
    }
    
    const comment = await Comment.create({
      content: req.body.content,
      post_id: req.params.id,
      user_id: req.user.user_id,
    });
    
    res.redirect(`/board/${req.params.id}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 댓글 삭제
router.post('/:id/comment/:commentId/delete', isLoggedIn, async (req, res, next) => {
  try {
    await Comment.destroy({
      where: {
        comment_id: req.params.commentId,
        user_id: req.user.user_id,
      },
    });
    res.redirect(`/board/${req.params.id}`);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 수정 페이지
router.get('/:id/edit', isLoggedIn, async (req, res, next) => {
  try {
    const post = await Post.findOne({ 
      where: { 
        post_id: req.params.id,
        user_id: req.user.user_id,
      }
    });
    if (!post) {
      return res.redirect('/board');
    }
    res.render('edit', {
      title: '게시글 수정',
      post,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 수정
router.post('/:id/edit', isLoggedIn, upload.single('image'), async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { 
        post_id: req.params.id,
        user_id: req.user.user_id,
      }
    });

    if (!post) {
      return res.redirect('/board');
    }

    // 내용이 실제로 변경되었는지 확인
    const isContentChanged = post.title !== req.body.title || 
                           post.content !== req.body.content ||
                           (req.file && post.image_url !== `/img/${req.file.filename}`);

    await Post.update({
      title: req.body.title,
      content: req.body.content,
      image_url: req.file ? `/img/${req.file.filename}` : req.body.image_url,
      updated_at: isContentChanged ? new Date() : post.updated_at,
    }, {
      where: { 
        post_id: req.params.id,
        user_id: req.user.user_id,
      }
    });
    res.redirect('/board');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 삭제
router.post('/:id/delete', isLoggedIn, async (req, res, next) => {
  try {
    await Post.destroy({
      where: { 
        post_id: req.params.id,
        user_id: req.user.user_id,
      }
    });
    res.redirect('/board');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// 게시글 상세 보기 (가장 마지막에 위치)
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findOne({
      where: { post_id: req.params.id },
      attributes: ['post_id', 'title', 'content', 'image_url', 'created_at', 'updated_at', 'user_id'],
      include: [{
        model: User,
        attributes: ['username']
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['username']
        }],
        order: [['created_at', 'ASC']]
      }]
    });

    if (!post) {
      return res.status(404).render('error', {
        message: '게시글을 찾을 수 없습니다.'
      });
    }

    res.render('post', {
      title: post.title,
      post,
      user: req.user
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router; 