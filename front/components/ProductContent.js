import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { Button, Input, Select } from 'antd';

const ProductContent = (
  { productContent, productCategory, edit, onChangeProduct, onCancelUpdate },
) => {
  const { updateProductLoading, updateProductDone } = useSelector((state) => state.product);
  const [editText, setEditText] = useState(productContent);
  const [editCategory, setEditCategory] = useState(productCategory);

  useEffect(() => {
    if (updateProductDone) {
      onCancelUpdate();
    }
  }, [updateProductDone]);

  const onChangeText = useCallback((e) => {
    setEditText(e.target.value);
  });
  const onChangeCategory = (value) => {
    setEditCategory(value);
  };
  return (
    <div>
      {edit
        ? (
          <>
            <Input value={editText} onChange={onChangeText} />
            <Select value={editCategory} onChange={onChangeCategory} style={{ width: 100 }}>
              <Select.Option value="디지털|가전" title="디지털/가전">디지털/가전</Select.Option>
              <Select.Option value="의류" title="의류">의류</Select.Option>
              <Select.Option value="생활용품" title="생활용품">생활용품</Select.Option>
              <Select.Option value="도서" title="도서">도서</Select.Option>
              <Select.Option value="기타" title="기타">기타</Select.Option>
            </Select>
            <Button.Group>
              <Button
                loading={updateProductLoading}
                onClick={onChangeProduct(editText, editCategory)}
              >
                수정
              </Button>
              <Button type="danger" onClick={onCancelUpdate}>취소</Button>
            </Button.Group>
          </>
        )
        : productContent.split(/(#[^\s#]+)/g).map((v, i) => {
          if (v.match(/(#[^\s#]+)/)) {
            return <Link href={`/hashtag/${v.slice(1)}`} prefetch={false} key={i}><a>{v}</a></Link>;
          }
          return v;
        })}
    </div>
  );
};

ProductContent.propTypes = {
  productContent: PropTypes.string.isRequired,
  productCategory: PropTypes.string.isRequired,
  edit: PropTypes.bool,
  onChangeProduct: PropTypes.func.isRequired,
  onCancelUpdate: PropTypes.func.isRequired,
};

ProductContent.defaultProps = {
  edit: false,
};

export default ProductContent;
