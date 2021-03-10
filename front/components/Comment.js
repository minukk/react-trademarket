import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { List, Comment, Avatar, Button } from 'antd';
import PropTypes from 'prop-types';
import Recomment from './Recomment';
import { REMOVE_COMMENT_REQUEST } from '../reducers/product';

const Comments = ({ comment }) => {
  const id = useSelector((state) => state.user.me?.id);
  const dispatch = useDispatch();
  // const [commentId, setCommentId] = useState('');

  const onRemoveComment = (item) => () => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_COMMENT_REQUEST,
      data: item,
    });
  };

  return (
    <List
      style={{ overflow: 'scroll' }}
      header={`${comment.length}개의 댓글`}
      itemLayout="horizontal"
      locale={{ emptyText: '댓글을 작성해주세요.' }}
      dataSource={comment}
      renderItem={(item) => (
        <List.Item key={item.id}>
          <Comment
            style={{ margin: 10 }}
            author={item.User.nickname}
            content={item.content}
            avatar={(
              <>
                <Link href={`/user/${item.User.id}`}>
                  <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                </Link>
                <div style={{ position: 'absolute', right: -330 }}>
                  {id && item.User.id === id
                    ? (
                      <>
                        <Button danger="true" onClick={onRemoveComment(item)}>
                          삭제
                        </Button>
                        <br />
                      </>
                    ) : ''}
                </div>
                <Recomment comment={item} />
              </>
            )}
          />
        </List.Item>
      )}
    />
  );
};

Comments.propTypes = {
  comment: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Comments;
