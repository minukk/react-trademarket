import React from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const NoImageWrapper = styled.div`
  width: 400px;
  height: 300px;
`;
const ImageWrapper = styled.img`
  width: 400px;
  height: 300px;
`;
const NoneImageText = styled.span`
  font-size: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ProductImages = ({ images }) => {
  if (images.length === 0) {
    return (
      <>
        <NoImageWrapper>
          <NoneImageText>거래자들</NoneImageText>
        </NoImageWrapper>
      </>
    );
  }
  if (images.length === 1) {
    return (
      <>
        <ImageWrapper role="presentation" src={`http://localhost:3080/${images[0].src}`} alt={images[0].src} />
        {/* {showImageZoom && <ImagesZoom images={images} />} */}
      </>
    );
  }
  return (
    <>
      <div>
        <ImageWrapper role="presentation" style={{ width: '50%' }} src={`http://localhost:3080/${images[0].src}`} alt={images[0].src} />
        <div
          role="presentation"
          style={{ display: 'inline-block', width: '50%', textAlign: 'center', verticalAlign: 'middle' }}
        >
          <PlusOutlined />
          <br />
          {images.length - 1}
          개의 사진 더보기
        </div>
      </div>
    </>
  );
};

ProductImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
  })).isRequired,
};

export default ProductImages;
