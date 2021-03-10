const express = require('express');
const bcypt = require('bcrypt');
const passport = require('passport');
const { Op } = require('sequelize');

const { User, Image, Comment, Product, Recomment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /user
  try {
    if (req.user) {
      const user = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ['password']
        },
        include: [{
          model: Product,
          attributes: ['id'],
        }]
      });
      res.status(200).json(user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId', async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: req.params.userId },
      attributes: {
        exclude: ['password']
      },
      include: [{
        model: Product,
        attributes: ['id'],
      }]
    });
    if (user) {
      const data = user.toJSON();
      data.products = data.Products.length;
      res.status(200).json(data);
    } else {
      res.status(404).json('존재하지 않는 사용자입니다.');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/login', (req, res, next) => { // POST /user/login -login
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.reason);
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUser = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ['password'],
        },
        include: [{
          model: Product,
          attributes: ['id'],
        }]
      })
      return res.status(200).json(fullUser);
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send('ok');
});

router.post('/', async (req, res, next) => { // POST /user  -signup
  try {
    const emailCheck = await User.findOne({
      where: {
        email: req.body.email,
      }
    });
    const nicknameCheck = await User.findOne({
      where: {
        nickname: req.body.nickname,
      }
    });
    if (emailCheck) {
      return res.status(403).send('이미 사용 중인 아이디입니다.');
    }
    if (nicknameCheck) {
      return res.status(403).send('이미 사용 중인 닉네임입니다.');
    }
    const hashedPassword = await bcypt.hash(req.body.password, 13);
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      phonenumber: req.body.phonenumber,
      password: hashedPassword,
    });
    res.status(201).send('ok');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:userId/products', async (req, res, next) => { // GET /user/userId/products
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) } // lastId보다 작은 10개
    }
    const products = await Product.findAll({
      where,
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
          order: [['createdAt', 'DESC']],
        }, {
          model: Recomment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }, {
            model: Comment,
            attributes: ['id'],
          }],
        }],
      }, {
        model: User,
        as: 'Favored',
        attributes: ['id'],
      }],
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
