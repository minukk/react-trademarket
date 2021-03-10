import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { Button, Card, Popover, Avatar } from 'antd';
import { StarOutlined, EllipsisOutlined, ShoppingTwoTone, MessageOutlined, StarTwoTone } from '@ant-design/icons';

import CommentForm from './CommentForm';
import ProductContent from './ProductContent';
import ProductImages from './ProductImages';
import Comments from './Comment';
import { LIKE_PRODUCT_REQUEST, UNLIKE_PRODUCT_REQUEST, REMOVE_PRODUCT_REQUEST, UPDATE_PRODUCT_REQUEST } from '../reducers/product';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [edit, setEdit] = useState(false);

  const onClickUpdate = useCallback(() => {
    setEdit(true);
  }, []);
  const onCancelUpdate = useCallback(() => {
    setEdit(false);
  }, []);
  const onChangeProduct = useCallback((editText, editCategory) => () => {
    dispatch({
      type: UPDATE_PRODUCT_REQUEST,
      data: {
        ProductId: product.id,
        content: editText,
        category: editCategory,
      },
    });
  }, [product]);

  const onRemoveProduct = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_PRODUCT_REQUEST,
      data: product.id,
    });
  }, [id]);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_PRODUCT_REQUEST,
      data: product.id,
    });
  }, [id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: UNLIKE_PRODUCT_REQUEST,
      data: product.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const liked = product.Favored.find((v) => v.id === id);
  return (
    <div style={{ margin: '15px', width: 400, display: 'inline-block', overflow: 'scroll', height: 450 }}>
      <Card
        cover={!commentFormOpened && <ProductImages images={product.Images} />}
        hoverable="true"
        actions={[
          liked
            ? <StarTwoTone key="star" twoToneColor="gold" onClick={onUnlike} />
            : <StarOutlined key="star" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Link href={`/product/${product.id}`}><a><ShoppingTwoTone key="shop" /></a></Link>,
          <Popover
            key="more"
            content={(
              <Button.Group>
                {id && product.User.id === id
                  ? (
                    <>
                      <Button onClick={onClickUpdate}>수정</Button>
                      <Button type="danger" onClick={onRemoveProduct}>삭제</Button>
                    </>
                  ) : <Button>신고</Button>}
              </Button.Group>
            )}
          >
            <EllipsisOutlined key="ellips" />
          </Popover>,
        ]}
      >
        <>
          {/* <div style={{ float: 'right' }}>{product.category}</div> */}
          <Card.Meta
            avatar={(
              <Link href={`/user/${product.User.id}`}>
                <a><Avatar>{product.User.nickname[0]}</Avatar></a>
              </Link>
            )}
            title={product.User.nickname}
            description={
              (
                <ProductContent
                  edit={edit}
                  onChangeProduct={onChangeProduct}
                  onCancelUpdate={onCancelUpdate}
                  productContent={product.content}
                  productCategory={product.category}
                />
              )
            }
          />
        </>
      </Card>
      {commentFormOpened && (
        <>
          <Comments key={product.Comments.id} comment={product.Comments} />
          <CommentForm product={product} />
        </>
      )}
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    category: PropTypes.string,
    createAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Recomments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.any),
    Favored: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default ProductCard;
