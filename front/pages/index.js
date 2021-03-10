import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';

import AppLayout from '../components/AppLayout';
import ProductCard from '../components/ProductCard';
import { LOAD_PRODUCTS_REQUEST } from '../reducers/product';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configStore';

const Home = () => {
  const dispatch = useDispatch();
  const { mainProducts, hasMoreProducts, loadProductsLoading,
  } = useSelector((state) => state.product);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMoreProducts && !loadProductsLoading) {
          const lastId = mainProducts[mainProducts.length - 1]?.id;
          dispatch({
            type: LOAD_PRODUCTS_REQUEST,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMoreProducts, loadProductsLoading, mainProducts]);

  return (
    <AppLayout>
      {mainProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
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
    type: LOAD_PRODUCTS_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Home;
