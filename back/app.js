const express = require('express');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');

const db = require('./models');
const passportConfig = require('./passport');
const productRouter = require('./rootes/product');
const productsRouter = require('./rootes/products');
const userRouter = require('./rootes/user');
const categoryRouter = require('./rootes/category');

dotenv.config();
const app = express();

db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공');
  })
  .catch(console.error);
  
passportConfig();

app.use(cors({
  origin: true,
  credentials: true,
}));
app.use('/', express.static(path.join(__dirname, 'uploads')));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
  saveUninitialized: false,
  resave: false,
  secret: process.env.COOKIE_SECRET,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/product', productRouter);
app.use('/products', productsRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);

app.listen(3080, () => {
  console.log('server start');
});
