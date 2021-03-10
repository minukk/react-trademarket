import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Button, Checkbox, Modal } from 'antd';
import useInput from '../hooks/useInput';
import { SIGN_UP_REQUEST } from '../reducers/user';

const SignUpModal = () => {
  const [signupModalVisible, setSignupModalVisible] = useState(false);
  const dispatch = useDispatch();
  const { signUpDone, signUpError } = useSelector((state) => state.user);
  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');

  const signupModal = () => {
    setSignupModalVisible(true);
  };
  const signupCancel = () => {
    setSignupModalVisible(false);
  };

  useEffect(() => {
    if (signUpDone) {
      setSignupModalVisible(false);
    }
  }, [signUpDone]);

  useEffect(() => {
    if (signUpError) {
      alert(signUpError);
    }
  }, [signUpError]);

  const [phonenumber, setPhonenumber] = useState('');
  const [phonenumberCheck, setPhonenumberCheck] = useState(false);

  // 정규표현식 번호 검사 다시 구현 서버에서도 구현
  const regExp = /^01(?:0|1[6-9])[.-]?(\\d{3}|\\d{4})[.-]?(\\d{4})$/;
  const onChangePhonenumber = useCallback((e) => {
    setPhonenumber(e.target.value);
    if (regExp.test(phonenumber)) {
      setPhonenumberCheck(true);
    }
  }, [phonenumber]);

  const [passwordCheck, setPasswordCheck] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  const onChangePasswordCheck = useCallback((e) => {
    setPasswordCheck(e.target.value);
    setPasswordError(e.target.value !== password);
  }, [password]);

  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);

  // 추후 수정할 것!
  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, [term, termError]);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    }
    if (!term) {
      console.log('동의실패');
      return setTermError(true);
    }
    if (!phonenumberCheck) {
      return setPhonenumberCheck(false);
    }
    return dispatch({
      type: SIGN_UP_REQUEST,
      data: { email, nickname, phonenumber, password },
    });
  }, [email, term, phonenumber, password, passwordCheck]);

  return (
    <>
      <Button type="primary" onClick={signupModal}>회원가입</Button>
      <Modal visible={signupModalVisible} onCancel={signupCancel} onOk={onSubmit} okText="회원가입" cancelText="취소">
        <h2>회원가입</h2>
        <div>
          <div>
            <label htmlFor="user-email">이메일</label>
            <br />
            <Input name="user-email" type="email" value={email} required onChange={onChangeEmail} />
          </div>
          <div>
            <label htmlFor="user-nickname">닉네임</label>
            <br />
            <Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
          </div>
          <div>
            <label htmlFor="user-email">휴대폰 번호</label>
            <br />
            <Input name="user-phone" type="text" value={phonenumber} required onChange={onChangePhonenumber} />
            {phonenumberCheck || <span>번호를 다시 입력하세요.</span>}
          </div>
          <div>
            <label htmlFor="user-password">비밀번호</label>
            <br />
            <Input name="user-password" type="password" value={password} required onChange={onChangePassword} />
          </div>
          <div>
            <label htmlFor="user-password-check">비밀번호 확인</label>
            <br />
            <Input name="user-password-check" type="password" value={passwordCheck} required onChange={onChangePasswordCheck} />
            {passwordError && <span>비밀번호가 일치하지 않습니다.</span>}
          </div>
          <div>
            <Checkbox name="user-term" checked={term} onChange={onChangeTerm}>동의합니다.</Checkbox>
            {termError && <span>약관에 동의하셔야 합니다.</span>}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SignUpModal;
