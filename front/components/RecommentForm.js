import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import useInput from '../hooks/useInput';
import { ADD_RECOMMENT_REQUEST } from '../reducers/product';

const RecommentForm = ({ comment }) => {
  const id = useSelector((state) => state.user.me?.id);
  const { addRecommentDone, addRecommentLoading,
  } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [recommentText, onChangeRecommentText, setRecommentText] = useInput('');

  useEffect(() => {
    if (addRecommentDone) {
      setRecommentText('');
    }
  }, [addRecommentDone]);

  const onSubmitRecomment = useCallback(() => {
    dispatch({
      type: ADD_RECOMMENT_REQUEST,
      data: {
        content: recommentText,
        userId: id,
        commentId: comment.id,
        productId: comment.ProductId,
      },
    });
  }, [recommentText, comment.id, comment.ProductId, id]);
  return (
    <Form onFinish={onSubmitRecomment} style={{ position: 'absolute', left: 50, top: 50 }}>
      <Form.Item style={{ position: 'relative', margin: 0, width: 250 }}>
        <Input.TextArea value={recommentText} onChange={onChangeRecommentText} rows={1} />
        <Button
          style={{ position: 'absolute', right: 0, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addRecommentLoading}
        >
          전송
        </Button>
      </Form.Item>
    </Form>
  );
};

RecommentForm.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default RecommentForm;
