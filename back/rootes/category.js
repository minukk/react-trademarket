const express = require('express');
const { Op } = require('sequelize');

const { Product, Hashtag, Image, Comment, User, Recomment } = require('../models');
const router = express.Router();

router.get('/:category', async (req, res, next) => { // GET /category/:category
  try {
    const where = { category: decodeURIComponent(req.params.category) };
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
