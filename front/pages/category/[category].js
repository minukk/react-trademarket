import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { END } from 'redux-saga';
import axios from 'axios';
import { useRouter } from 'next/router';
import Head from 'next/head';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/ProductCard';
import wrapper from '../../store/configStore';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import { LOAD_CATEGORY_REQUEST } from '../../reducers/product';

const Category = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { category } = router.query;
  const { mainProducts, hasMoreProducts, loadCategoryLoading,
  } = useSelector((state) => state.product);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMoreProducts && !loadCategoryLoading) {
          dispatch({
            type: LOAD_CATEGORY_REQUEST,
            lastId: mainProducts[mainProducts.length - 1]
            && mainProducts[mainProducts.length - 1].id,
            data: category,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMoreProducts, mainProducts, category, loadCategoryLoading]);

  return (
    <AppLayout>
      <Head>
        <title>
          거래자들 | {category}
        </title>
      </Head>
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
    type: LOAD_CATEGORY_REQUEST,
    data: context.params.category,
  });
  context.store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});

export default Category;
