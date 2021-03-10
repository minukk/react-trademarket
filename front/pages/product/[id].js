import React from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { END } from 'redux-saga';
import { useSelector } from 'react-redux';
import Head from 'next/head';

import wrapper from '../../store/configStore';
import AppLayout from '../../components/AppLayout';
import ProductCard from '../../components/ProductCard';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_PRODUCT_REQUEST } from '../../reducers/product';

const Product = () => {
  const router = useRouter();
  const { id } = router.query;
  const { singleProduct } = useSelector((state) => state.product);

  return (
    <AppLayout>
      <Head>
        <title>{singleProduct.User.nickname}님의 글</title>
        <meta name="description" content={singleProduct.content} />
        <meta property="og:title" content={`${singleProduct.User.nickname}님의 게시글`} />
        <meta property="og:description" content={singleProduct.content} />
        <meta property="og:image" content={singleProduct.Images[0] ? singleProduct.Images[0].src : ''} />
        <meta property="og:url" content={`http://localhost:3000/product/${id}`} />
      </Head>
      <ProductCard product={singleProduct} />
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = '';
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_PRODUCT_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  return { props: {} };
});

export default Product;
