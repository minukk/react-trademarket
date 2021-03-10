import React, { useState, useCallback } from 'react';
import { List, Comment, Avatar, Button } from 'antd';
import PropTypes from 'prop-types';

import RecommentForm from './RecommentForm';

const Recomment = ({ comment }) => {
  const [recommentOpen, setRecommentOpen] = useState(false);
  const recommentFormOpen = useCallback(() => {
    setRecommentOpen((prev) => !prev);
  }, []);

  return (
    <>
      <List
        style={{ position: 'absolute', left: 30, width: '300px', marginTop: 30 }}
        itemLayout="horizontal"
        locale={{ emptyText: ' ' }}
        dataSource={comment.Recomments}
        renderItem={(item) => (
          <List.Item>
            <Comment
              author={item.User.nickname}
              avatar={(
                <Avatar>{item.User.nickname[0]}</Avatar>
              )}
              content={item.content}
            />
          </List.Item>
        )}
      />
      <Button style={{ position: 'absolute', right: -330 }} onClick={recommentFormOpen}>답글</Button>
      {recommentOpen && <RecommentForm comment={comment} />}
    </>
  );
};

Recomment.propTypes = {
  comment: PropTypes.any.isRequired,
};

export default Recomment;
