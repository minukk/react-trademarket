import React, { useCallback, useEffect, useState } from 'react';
import { Input, Button, Modal } from 'antd';
import 'antd/dist/antd.css';
import { useDispatch, useSelector } from 'react-redux';
import useInput from '../hooks/useInput';
import { LOG_IN_REQUEST } from '../reducers/user';

const LoginModal = () => {
  const dispatch = useDispatch();
  const { logInError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const loginModal = () => {
    setLoginModalVisible(true);
  };
  const loginCancel = () => {
    setLoginModalVisible(false);
  };

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmit = useCallback(() => {
    dispatch({
      type: LOG_IN_REQUEST,
      data: { email, password },
    });
  }, [email, password]);

  return (
    <>
      <Button type="primary" onClick={loginModal}>로그인</Button>
      <Modal visible={loginModalVisible} onCancel={loginCancel} onOk={onSubmit} okText="로그인" cancelText="취소">
        <h2>로그인</h2>
        <div>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input name="user-password" type="password" value={password} onChange={onChangePassword} required />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LoginModal;
