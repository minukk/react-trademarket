import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/ProductCard';
import wrapper from '../../store/configStore';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import { LOAD_USER_PRODUCT_REQUEST } from '../../reducers/product';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const { mainProducts, hasMoreProducts, loadProductsLoading,
  } = useSelector((state) => state.product);
  const { userInfo } = useSelector((state) => state.user);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMoreProducts && !loadProductsLoading) {
          dispatch({
            type: LOAD_USER_PRODUCT_REQUEST,
            lastId: mainProducts[mainProducts.length - 1]
            && mainProducts[mainProducts.length - 1].id,
            data: id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMoreProducts, mainProducts, id, loadProductsLoading]);

  return (
    <AppLayout>
      {userInfo && (
        <Head>
          <title>
            {userInfo.nickname}
            님의 글
          </title>
        </Head>
      )}
      {mainProducts.map((c) => <PostCard key={c.id} product={c} />)}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const cookie = context.req ? context.req.headers.cookie : '';
  axios.defaults.headers.Cookie = ''; // cookie 공유 문제 방지
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
  }
  context.store.dispatch({
    type: LOAD_USER_PRODUCT_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch({
    type: LOAD_USER_REQUEST,
    data: context.params.id,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
  console.log('getState', context.store.getState().product.mainProducts);
  return { props: {} };
});

export default User;
