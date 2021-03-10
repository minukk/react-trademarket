const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { User, Product, Comment, Recomment, Image, Hashtag } = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

try {
  fs.accessSync('uploads');
} catch (error) {
  fs.mkdirSync('uploads');
}

const upload = multer({ // multer config
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);
      done(null, basename + '_' + new Date().getTime() + ext);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /product
  try {
    const hashtags = req.body.content.match(/#[^\s#]+/g);
    const product = await Product.create({
      content: req.body.content,
      category: req.body.category,
      UserId: req.user.id,
    });
    if (hashtags) {
      const result = await Promise.all(hashtags.map((tag) => Hashtag.findOrCreate({
        where: { name: tag.slice(1).toLowerCase() }
      })));
      await product.addHashtags(result.map((v) => v[0]));
    }
    if (req.body.image) {
      if (Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
        await product.addImages(images);
      } else {
        const image = await Image.create({ src: req.body.image });
        await product.addImages(image);
      }
    }
    const fullProduct = await Product.findOne({
      where: { id: product.id },
      include: [{
        model: Image,
      }, {
        model: Comment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }, {
          model: Recomment,
          include: [{
            model: User,
            attributes: ['id', 'nickname'],
          }]
        }]
      }, {
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: User,
        as: 'Favored',
        attributes: ['id', 'nickname'],
      }]
    });
    res.status(201).json(fullProduct);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/:productId', async (req, res, next) => { // GET /product/productId
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(404).send('존재하지 않는 게시글입니다.');
    }
    const singleProduct = await Product.findOne({
      where: { id: req.params.productId },
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
          }]
        }]
      },{
        model: User,
        as: 'Favored',
        attributes: ['id', 'nickname'],
      }],
    });
    res.status(200).json(singleProduct);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:productId', isLoggedIn, async (req, res, next) => {
  try {
    await Product.update({
      content: req.body.content,
      category: req.body.category,
    }, {
      where: {
        id: req.params.productId,
        UserId: req.user.id,
      }
    });
    res.status(200).json({ 
      ProductId: parseInt(req.params.productId, 10),
      content: req.body.content,
      category: req.body.category,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
})

router.delete('/:productId', isLoggedIn, async (req, res, next) => { // DELETE /product/productId
  try{
    await Product.destroy({
      where: { id: req.params.productId, UserId: req.user.id, },
    });
    res.status(200).json({ ProductId: parseInt(req.params.productId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/images', isLoggedIn, upload.array('image'), async(req, res, next) => { // POST /product/images
  console.log(req.files);
  res.json(req.files.map((v) => v.filename));
})

router.post('/:productId/comment', isLoggedIn, async (req, res, next) => { // POST /product/productId/comment
  try {
    const product = await Product.findOne({
      where: { id: req.params.productId },
    });
    if (!product) {
      return res.status(403).send('존재하지 않는 게시글입니다.');
    }
    const comment = await Comment.create({
      content: req.body.content,
      ProductId: parseInt(req.params.productId),
      UserId: req.user.id,
    });
    const fullComment = await Comment.findOne({
      where: { id: comment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],
      }, {
        model: Recomment,
        include: [{
          model: User,
          attributes: ['id', 'nickname'],
        }]
      }],
    });
    res.status(201).json(fullComment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post('/:commentId/recomment', isLoggedIn, async (req, res, next) => { //POST /product/commentId/recomment
  try {
    const comment = await Comment.findOne({
      where: { id: req.params.commentId },
    });
    if (!comment) {
      return res.status(403).send('존재하지 않는 댓글입니다.');
    }
    const recomment = await Recomment.create({
      content: req.body.content,
      CommentId: parseInt(req.params.commentId),
      UserId: req.user.id,
      ProductId: comment.ProductId,
    });
    const fullRecomment = await Recomment.findOne({
      where: { id: recomment.id },
      include: [{
        model: User,
        attributes: ['id', 'nickname'],        
      }],
    });
    res.status(201).json(fullRecomment);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.patch('/:productId/like', isLoggedIn, async (req, res, next) => { //PATCH /product/productId/like
  try {
    const product = await Product.findOne({ where: { id: req.params.productId }});
    if (!product) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await product.addFavored(req.user.id);
    res.json({ ProductId: product.id, UserId: req.user.id });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.delete('/:productId/like', isLoggedIn, async (req, res, next) => { // DELETE /product/productId/like
  try {
    const product = await Product.findOne({ where: { id: req.params.productId }});
    if (!product) {
      return res.status(403).send('게시글이 존재하지 않습니다.');
    }
    await product.removeFavored(req.user.id);
    res.json({ ProductId: product.id, UserId: req.user.id });
  } catch (error){
    console.error(error);
    next(error);
  }
});

router.delete('/comment/:commentId', isLoggedIn, async(req, res, next) => { // DELETE /product/commentId
  try {
    const comment = await Comment.findOne({ where: { id: req.params.commentId }});
    await Comment.destroy({
      where: { id: req.params.commentId },
    });
    res.status(200).json({ CommentId: parseInt(req.params.commentId), ProductId: comment.ProductId });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
