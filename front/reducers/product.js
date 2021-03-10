import produce from 'immer';

export const initialState = {
  mainProducts: [],
  imagePaths: [],
  singleProduct: null,
  hasMoreProducts: true,
  addProductLoading: false,
  addProductDone: false,
  addProductError: null,
  updateProductLoading: false,
  updateProductDone: false,
  updateProductError: null,
  removeProductLoading: false,
  removeProductDone: false,
  removeProductError: null,
  loadProductsLoading: false,
  loadProductsDone: false,
  loadProductsError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  removeCommentLoading: false,
  removeCommentDone: false,
  removeCommentError: null,
  addRecommentLoading: false,
  addRecommentDone: false,
  addRecommentError: null,
  likeProductLoading: false,
  likeProductDone: false,
  likeProductError: null,
  unlikeProductLoading: false,
  unlikeProductDone: false,
  unlikeProductError: null,
  loadProductLoading: false,
  loadProductDone: false,
  loadProductError: null,
  loadCategoryLoading: false,
  loadCategoryDone: false,
  loadCategoryError: null,
};

export const ADD_PRODUCT_REQUEST = 'ADD_PRODUCT_REQUEST';
export const ADD_PRODUCT_SUCCESS = 'ADD_PRODUCT_SUCCESS';
export const ADD_PRODUCT_FAILURE = 'ADD_PRODUCT_FAILURE';

export const UPDATE_PRODUCT_REQUEST = 'UPDATE_PRODUCT_REQUEST';
export const UPDATE_PRODUCT_SUCCESS = 'UPDATE_PRODUCT_SUCCESS';
export const UPDATE_PRODUCT_FAILURE = 'UPDATE_PRODUCT_FAILURE';

export const REMOVE_PRODUCT_REQUEST = 'REMOVE_PRODUCT_REQUEST';
export const REMOVE_PRODUCT_SUCCESS = 'REMOVE_PRODUCT_SUCCESS';
export const REMOVE_PRODUCT_FAILURE = 'REMOVE_PRODUCT_FAILURE';

export const LOAD_PRODUCTS_REQUEST = 'LOAD_PRODUCTS_REQUEST';
export const LOAD_PRODUCTS_SUCCESS = 'LOAD_PRODUCTS_SUCCESS';
export const LOAD_PRODUCTS_FAILURE = 'LOAD_PRODUCTS_FAILURE';

export const UPLOAD_IMAGES_REQUEST = 'UPLOAD_IMAGES_REQUEST';
export const UPLOAD_IMAGES_SUCCESS = 'UPLOAD_IMAGES_SUCCESS';
export const UPLOAD_IMAGES_FAILURE = 'UPLOAD_IMAGES_FAILURE';

export const ADD_COMMENT_REQUEST = 'ADD_COMMENT_REQUEST';
export const ADD_COMMENT_SUCCESS = 'ADD_COMMENT_SUCCESS';
export const ADD_COMMENT_FAILURE = 'ADD_COMMENT_FAILURE';

export const REMOVE_COMMENT_REQUEST = 'REMOVE_COMMENT_REQUEST';
export const REMOVE_COMMENT_SUCCESS = 'REMOVE_COMMENT_SUCCESS';
export const REMOVE_COMMENT_FAILURE = 'REMOVE_COMMENT_FAILURE';

export const ADD_RECOMMENT_REQUEST = 'ADD_RECOMMENT_REQUEST';
export const ADD_RECOMMENT_SUCCESS = 'ADD_RECOMMENT_SUCCESS';
export const ADD_RECOMMENT_FAILURE = 'ADD_RECOMMENT_FAILURE';

export const LIKE_PRODUCT_REQUEST = 'LIKE_PRODUCT_REQUEST';
export const LIKE_PRODUCT_SUCCESS = 'LIKE_PRODUCT_SUCCESS';
export const LIKE_PRODUCT_FAILURE = 'LIKE_PRODUCT_FAILURE';

export const UNLIKE_PRODUCT_REQUEST = 'UNLIKE_PRODUCT_REQUEST';
export const UNLIKE_PRODUCT_SUCCESS = 'UNLIKE_PRODUCT_SUCCESS';
export const UNLIKE_PRODUCT_FAILURE = 'UNLIKE_PRODUCT_FAILURE';

export const LOAD_PRODUCT_REQUEST = 'LOAD_PRODUCT_REQUEST';
export const LOAD_PRODUCT_SUCCESS = 'LOAD_PRODUCT_SUCCESS';
export const LOAD_PRODUCT_FAILURE = 'LOAD_PRODUCT_FAILURE';

export const LOAD_USER_PRODUCT_REQUEST = 'LOAD_USER_PRODUCT_REQUEST';
export const LOAD_USER_PRODUCT_SUCCESS = 'LOAD_USER_PRODUCT_SUCCESS';
export const LOAD_USER_PRODUCT_FAILURE = 'LOAD_USER_PRODUCT_FAILURE';

export const LOAD_CATEGORY_REQUEST = 'LOAD_CATEGORY_REQUEST';
export const LOAD_CATEGORY_SUCCESS = 'LOAD_CATEGORY_SUCCESS';
export const LOAD_CATEGORY_FAILURE = 'LOAD_CATEGORY_FAILURE';

export const REMOVE_IMAGE = 'REMOVE_IMAGE';

const reducer = (state = initialState, action) => produce(state, (draft) => {
  switch (action.type) {
    case ADD_PRODUCT_REQUEST:
      draft.addProductLoading = true;
      draft.addProductDone = false;
      draft.addProductError = null;
      break;
    case ADD_PRODUCT_SUCCESS:
      draft.addProductLoading = false;
      draft.addProductDone = true;
      draft.mainProducts.unshift(action.data);
      draft.imagePaths = [];
      break;
    case ADD_PRODUCT_FAILURE:
      draft.addProductLoading = false;
      draft.addProductError = action.error;
      break;
    case UPDATE_PRODUCT_REQUEST:
      draft.updateProductLoading = true;
      draft.updateProductDone = false;
      draft.updateProductError = null;
      break;
    case UPDATE_PRODUCT_SUCCESS:
      draft.updateProductLoading = false;
      draft.updateProductDone = true;
      draft.mainProducts.find((v) => v.id === action.data.ProductId).content = action.data.content;
      draft.mainProducts.find((v) => v.id === action.data.ProductId)
        .category = action.data.category;
      break;
    case UPDATE_PRODUCT_FAILURE:
      draft.updateProductLoading = false;
      draft.updateProductError = action.error;
      break;
    case REMOVE_PRODUCT_REQUEST:
      draft.removeProductLoading = true;
      draft.removeProductDone = false;
      draft.removeProductError = null;
      break;
    case REMOVE_PRODUCT_SUCCESS:
      draft.removeProductLoading = false;
      draft.removeProductDone = true;
      draft.mainProducts = draft.mainProducts.filter((v) => v.id !== action.data.ProductId);
      break;
    case REMOVE_PRODUCT_FAILURE:
      draft.removeProductLoading = false;
      draft.removeProductError = action.error;
      break;
    case LOAD_USER_PRODUCT_REQUEST:
    case LOAD_PRODUCTS_REQUEST:
      draft.loadProductsLoading = true;
      draft.loadProductsDone = false;
      draft.loadProductsError = null;
      break;
    case LOAD_USER_PRODUCT_SUCCESS:
    case LOAD_PRODUCTS_SUCCESS:
      draft.loadProductsLoading = false;
      draft.loadProductsDone = true;
      draft.mainProducts = draft.mainProducts.concat(action.data);
      draft.hasMoreProducts = action.data.length === 10;
      break;
    case LOAD_USER_PRODUCT_FAILURE:
    case LOAD_PRODUCTS_FAILURE:
      draft.loadProductsLoading = false;
      draft.loadProductsError = action.error;
      break;
    case UPLOAD_IMAGES_REQUEST:
      draft.uploadImagesLoading = true;
      draft.uploadImagesDone = false;
      draft.uploadImagesError = null;
      break;
    case UPLOAD_IMAGES_SUCCESS:
      draft.uploadImagesLoading = false;
      draft.uploadImagesDone = true;
      draft.imagePaths = action.data;
      break;
    case UPLOAD_IMAGES_FAILURE:
      draft.uploadImagesLoading = false;
      draft.uploadImagesError = action.error;
      break;
    case ADD_COMMENT_REQUEST:
      draft.addCommentLoading = true;
      draft.addCommentDone = false;
      draft.addCommentError = null;
      break;
    case ADD_COMMENT_SUCCESS: {
      draft.addCommentLoading = false;
      draft.addCommentDone = true;
      const product = draft.mainProducts.find((v) => v.id === action.data.ProductId);
      product.Comments.unshift(action.data);
      break;
    }
    case ADD_COMMENT_FAILURE:
      draft.addCommentLoading = false;
      draft.addCommentError = action.error;
      break;
    case REMOVE_COMMENT_REQUEST:
      draft.removeCommentLoading = true;
      draft.removeCommentDone = false;
      draft.removeCommentError = null;
      break;
    case REMOVE_COMMENT_SUCCESS: {
      draft.removeCommentLoading = false;
      draft.removeCommentDone = true;
      const product = draft.mainProducts.find((v) => v.id === action.data.ProductId);
      product.Comments = product.Comments.filter(
        (v) => v.id !== action.data.CommentId,
      );
      break;
    }
    case REMOVE_COMMENT_FAILURE:
      draft.removeCommentLoading = false;
      draft.removeCommentError = action.error;
      break;
    case ADD_RECOMMENT_REQUEST:
      draft.addRecommentLoading = true;
      draft.addRecommentDone = false;
      draft.addRecommentError = null;
      break;
    case ADD_RECOMMENT_SUCCESS: {
      draft.addRecommentLoading = false;
      draft.addRecommentDone = true;
      const product = draft.mainProducts.find((v) => v.id === action.data.ProductId);
      const comment = product.Comments.find((v) => v.id === action.data.CommentId);
      console.log(comment);
      comment.Recomments.unshift(action.data);
      break;
    }
    case ADD_RECOMMENT_FAILURE:
      draft.addRecommentLoading = false;
      draft.addRecommentError = action.error;
      break;
    case LIKE_PRODUCT_REQUEST:
      draft.likeProductLoading = true;
      draft.likeProductDone = false;
      draft.likeProductError = null;
      break;
    case LIKE_PRODUCT_SUCCESS: {
      draft.likeProductLoading = false;
      draft.likeProductDone = true;
      const product = draft.mainProducts.find((v) => v.id === action.data.ProductId);
      product.Favored.push({ id: action.data.UserId });
      break;
    }
    case LIKE_PRODUCT_FAILURE:
      draft.likeProductLoading = false;
      draft.likeProductError = action.error;
      break;
    case UNLIKE_PRODUCT_REQUEST:
      draft.unlikeProductLoading = true;
      draft.unlikeProductDone = false;
      draft.unlikeProductError = null;
      break;
    case UNLIKE_PRODUCT_SUCCESS: {
      draft.unlikeProductLoading = false;
      draft.unlikeProductDone = true;
      const product = draft.mainProducts.find((v) => v.id === action.data.ProductId);
      product.Favored = product.Favored.filter((v) => v.id !== action.data.UserId);
      // const removeLike = product.Favored.find((v) => v.id === action.data.UserId);
      // product.Favored.splice(removeLike, 1);
      break;
    }
    case UNLIKE_PRODUCT_FAILURE:
      draft.unlikeProductLoading = false;
      draft.unlikeProductError = action.error;
      break;
    case LOAD_PRODUCT_REQUEST:
      draft.loadProductLoading = true;
      draft.loadProductDone = false;
      draft.loadProductError = null;
      break;
    case LOAD_PRODUCT_SUCCESS:
      draft.loadProductLoading = false;
      draft.loadProductDone = true;
      draft.singleProduct = action.data;
      break;
    case LOAD_PRODUCT_FAILURE:
      draft.loadProductLoading = false;
      draft.loadProductError = action.error;
      break;
    case LOAD_CATEGORY_REQUEST:
      draft.loadCategoryLoading = true;
      draft.loadCategoryDone = false;
      draft.loadCategoryError = null;
      break;
    case LOAD_CATEGORY_SUCCESS:
      draft.loadCategoryLoading = false;
      draft.loadCategoryDone = true;
      draft.mainProducts = draft.mainProducts.concat(action.data);
      draft.hasMoreProducts = action.data.length === 10;
      break;
    case LOAD_CATEGORY_FAILURE:
      draft.loadCategoryLoading = false;
      draft.loadCategoryError = action.error;
      break;
    case REMOVE_IMAGE:
      draft.imagePaths = draft.imagePaths.filter((v, i) => i !== action.data);
      break;
    default:
      break;
  }
});

export default reducer;
