import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Input, Row, Col, Button } from 'antd';
import styled from 'styled-components';

import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';
import { LOG_OUT_REQUEST } from '../reducers/user';

const MenuWrapper = styled(Menu)`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  background-color: #FFCC55;
  border-bottom: 0;
  width: 100%;
  height: 100px;
`;

const AppLayout = ({ children }) => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);

  const onLogout = useCallback(() => {
    dispatch({
      type: LOG_OUT_REQUEST,
    });
  }, []);
  return (
    <div>
      <MenuWrapper mode="horizontal">
        <Menu.Item style={{ position: 'absolute', left: 0, top: 15 }}>
          <h1><Link href="/"><a>거래자들</a></Link></h1>
        </Menu.Item>
        {/* 모바일에선 햄버거 버튼이 나오게 회원가입 로그인 검색 줄이기 */}
        <Menu.Item>
          <Input.Search enterButton style={{ verticalAlign: 'middle' }} size="large" />
        </Menu.Item>
        {me && <Menu.Item><Button type="primary"><Link href="/product"><a>내 물건 올리기</a></Link></Button></Menu.Item>}
        {me
          ? <Menu.Item>{me.nickname}님</Menu.Item>
          : <Menu.Item><SignUpModal /></Menu.Item>}
        {me
          ? (
            <Menu.Item>
              <Button onClick={onLogout} type="danger" loading={logOutLoading}>로그아웃</Button>
            </Menu.Item>
          ) : <Menu.Item><LoginModal /></Menu.Item>}
        {/* 로그인시 회원가입 버튼 없애고 xxx님 어서오세요. 내 정보 보기 등등 뜨게 */}
      </MenuWrapper>
      <Row gutter={8}>
        <Col xs={24} md={4} style={{ backgroundColor: '#FFCC55' }}>
          <Menu mode="inline" style={{ backgroundColor: '#FFCC55', borderRight: 0 }}>
            <Menu.Item><Link href="/"><a>전체보기</a></Link></Menu.Item>
            <Menu.Item><Link href="/category/디지털|가전"><a>디지털/가전</a></Link></Menu.Item>
            <Menu.Item><Link href="/category/의류"><a>의류</a></Link></Menu.Item>
            <Menu.Item><Link href="/category/생활용품"><a>생활용품</a></Link></Menu.Item>
            <Menu.Item><Link href="/category/도서"><a>도서</a></Link></Menu.Item>
            <Menu.Item><Link href="/category/기타"><a>기타</a></Link></Menu.Item>
          </Menu>
        </Col>
        <Col xs={24} md={20}>{children}</Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
