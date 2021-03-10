import { all, fork } from 'redux-saga/effects';
import axios from 'axios';

import userSaga from './user';
import productSaga from './product';

axios.defaults.baseURL = 'http://localhost:3080';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(userSaga),
    fork(productSaga),
  ]);
}
