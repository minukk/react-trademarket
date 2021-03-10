const express = require('express');
const { Product, User, Image, Comment, Recomment } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /products
  try {
    const where = {};
    if (parseInt(req.query.lastId)) {
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }
    }
    const products = await Product.findAll({
      where,
      limit: 10,
      order: [
        ['createdAt', 'DESC'],
        [Comment, 'createdAt', 'DESC']
      ],
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Comment,
        include:[{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Recomment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }]
        }],
      }, {
        model: User,
        as: 'Favored',
        attributes: ['id'],
      }, {
        model: Image,
      }]
    });
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;