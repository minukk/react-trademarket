import { all, fork, put, call, takeLatest, throttle } from 'redux-saga/effects';
import axios from 'axios';

import {
  ADD_PRODUCT_REQUEST, ADD_PRODUCT_SUCCESS, ADD_PRODUCT_FAILURE,
  UPDATE_PRODUCT_REQUEST, UPDATE_PRODUCT_SUCCESS, UPDATE_PRODUCT_FAILURE,
  REMOVE_PRODUCT_REQUEST, REMOVE_PRODUCT_SUCCESS, REMOVE_PRODUCT_FAILURE,
  LOAD_PRODUCTS_REQUEST, LOAD_PRODUCTS_SUCCESS, LOAD_PRODUCTS_FAILURE,
  UPLOAD_IMAGES_REQUEST, UPLOAD_IMAGES_SUCCESS, UPLOAD_IMAGES_FAILURE,
  ADD_COMMENT_REQUEST, ADD_COMMENT_SUCCESS, ADD_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST, REMOVE_COMMENT_SUCCESS, REMOVE_COMMENT_FAILURE,
  ADD_RECOMMENT_REQUEST, ADD_RECOMMENT_SUCCESS, ADD_RECOMMENT_FAILURE,
  LIKE_PRODUCT_REQUEST, LIKE_PRODUCT_SUCCESS, LIKE_PRODUCT_FAILURE,
  UNLIKE_PRODUCT_REQUEST, UNLIKE_PRODUCT_SUCCESS, UNLIKE_PRODUCT_FAILURE,
  LOAD_PRODUCT_REQUEST, LOAD_PRODUCT_SUCCESS, LOAD_PRODUCT_FAILURE,
  LOAD_USER_PRODUCT_REQUEST, LOAD_USER_PRODUCT_SUCCESS, LOAD_USER_PRODUCT_FAILURE,
  LOAD_CATEGORY_REQUEST, LOAD_CATEGORY_SUCCESS, LOAD_CATEGORY_FAILURE,
} from '../reducers/product';
import { ADD_PRODUCT_TO_ME, REMOVE_PRODUCT_OF_ME } from '../reducers/user';

function addProductAPI(data) { // POST /product
  return axios.post('/product', data);
}
function* addProduct(action) {
  try {
    const result = yield call(addProductAPI, action.data);
    yield put({
      type: ADD_PRODUCT_SUCCESS,
      data: result.data,
    });
    yield put({
      type: ADD_PRODUCT_TO_ME,
      data: result.data.id,
    });
  } catch (error) {
    yield put({
      type: ADD_PRODUCT_FAILURE,
      error: error.response.data,
    });
  }
}

function updateProductAPI(data) { // POST /product
  return axios.patch(`/product/${data.ProductId}`, data);
}
function* updateProduct(action) {
  try {
    const result = yield call(updateProductAPI, action.data);
    yield put({
      type: UPDATE_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: UPDATE_PRODUCT_FAILURE,
      error: error.response.data,
    });
  }
}

function removeProductAPI(data) { // DELETE /product/productId
  return axios.delete(`/product/${data}`);
}
function* removeProduct(action) {
  try {
    const result = yield call(removeProductAPI, action.data);
    yield put({
      type: REMOVE_PRODUCT_SUCCESS,
      data: result.data,
    });
    yield put({
      type: REMOVE_PRODUCT_OF_ME,
      data: action.data,
    });
  } catch (error) {
    yield put({
      type: REMOVE_PRODUCT_FAILURE,
      error: error.response.data,
    });
  }
}

function loadProductsAPI(lastId) { // GET /productc?lastId=lastId
  return axios.get(`/products?lastId=${lastId || 0}`);
}
function* loadProducts(action) {
  try {
    const result = yield call(loadProductsAPI, action.lastId);
    yield put({
      type: LOAD_PRODUCTS_SUCCESS,
      data: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_PRODUCTS_FAILURE,
      error: error.response.data,
    });
  }
}

function uploadImagesAPI(data) { // POST /product/images
  return axios.post('/product/images', data);
}
function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      error: err.response.data,
    });
  }
}

function addCommentAPI(data) { // POST /product/productId/comment
  return axios.post(`/product/${data.productId}/comment`, data);
}
function* addComment(action) {
  try {
    const result = yield call(addCommentAPI, action.data);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: ADD_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function removeCommentAPI(data) { // POST /product/comment
  return axios.delete(`/product/comment/${data.id}`);
}
function* removeComment(action) {
  try {
    const result = yield call(removeCommentAPI, action.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function addRecommentAPI(data) { // POST /product/1/recomment
  return axios.post(`/product/${data.commentId}/recomment`, data);
}
function* addRecomment(action) {
  try {
    const result = yield call(addRecommentAPI, action.data);
    yield put({
      type: ADD_RECOMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.log(err);
    yield put({
      type: ADD_RECOMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function likeProductAPI(data) { // POST /productId/like
  return axios.patch(`/product/${data}/like`, data);
}
function* likeProduct(action) {
  try {
    const result = yield call(likeProductAPI, action.data);
    yield put({
      type: LIKE_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function unlikeProductAPI(data) { // DELETE /productId/like
  return axios.delete(`/product/${data}/like`);
}
function* unlikeProduct(action) {
  try {
    const result = yield call(unlikeProductAPI, action.data);
    yield put({
      type: UNLIKE_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: UNLIKE_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadProductAPI(data) { // GET /product/productId
  return axios.get(`/product/${data}`);
}
function* loadProduct(action) {
  try {
    const result = yield call(loadProductAPI, action.data);
    yield put({
      type: LOAD_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadUserProductAPI(data, lastId) { // GET /user/userId/products?lastId
  return axios.get(`/user/${data}/products?lastId=${lastId || 0}`);
}
function* loadUserProduct(action) {
  try {
    const result = yield call(loadUserProductAPI, action.data, action.lastId);
    yield put({
      type: LOAD_USER_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_USER_PRODUCT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadCategoryAPI(data, lastId) { // GET /category/:category?lastid
  return axios.get(`/category/${encodeURIComponent(data)}?lastId=${lastId || 0}`);
}
function* loadCategory(action) {
  try {
    const result = yield call(loadCategoryAPI, action.data, action.lastId);
    yield put({
      type: LOAD_CATEGORY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_CATEGORY_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchAddProduct() {
  yield takeLatest(ADD_PRODUCT_REQUEST, addProduct);
}
function* watchUpdateProduct() {
  yield takeLatest(UPDATE_PRODUCT_REQUEST, updateProduct);
}
function* watchRemoveProduct() {
  yield takeLatest(REMOVE_PRODUCT_REQUEST, removeProduct);
}
function* watchLoadProducts() {
  yield throttle(5000, LOAD_PRODUCTS_REQUEST, loadProducts);
}
function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}
function* watchAddComment() {
  yield takeLatest(ADD_COMMENT_REQUEST, addComment);
}
function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}
function* watchAddRecomment() {
  yield takeLatest(ADD_RECOMMENT_REQUEST, addRecomment);
}
function* watchLikeProduct() {
  yield takeLatest(LIKE_PRODUCT_REQUEST, likeProduct);
}
function* watchUnlikeProduct() {
  yield takeLatest(UNLIKE_PRODUCT_REQUEST, unlikeProduct);
}
function* watchLoadProduct() {
  yield takeLatest(LOAD_PRODUCT_REQUEST, loadProduct);
}
function* watchLoadUserProduct() {
  yield takeLatest(LOAD_USER_PRODUCT_REQUEST, loadUserProduct);
}
function* watchLoadCategory() {
  yield takeLatest(LOAD_CATEGORY_REQUEST, loadCategory);
}

export default function* productSaga() {
  yield all([
    fork(watchLoadProducts),
    fork(watchAddProduct),
    fork(watchUpdateProduct),
    fork(watchRemoveProduct),
    fork(watchUploadImages),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchAddRecomment),
    fork(watchLikeProduct),
    fork(watchUnlikeProduct),
    fork(watchLoadProduct),
    fork(watchLoadUserProduct),
    fork(watchLoadCategory),
  ]);
}
