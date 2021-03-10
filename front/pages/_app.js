import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import 'antd/dist/antd.css';

import wrapper from '../store/configStore';

const TradeMarket = ({ Component }) => (
  <>
    <Head>
      <meta charSet="utf-8" />
      <title>거래자들</title>
    </Head>
    <Component />
  </>
);

TradeMarket.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default wrapper.withRedux(TradeMarket);
