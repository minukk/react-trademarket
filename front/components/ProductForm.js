import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import Router from 'next/router';
import useInput from '../hooks/useInput';
import { ADD_PRODUCT_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from '../reducers/product';

const ProductionForm = () => {
  const { imagePaths, addProductDone } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput('');
  const [category, setCategory] = useState('');

  const onSelect = (value) => {
    console.log(`select ${value}`);
    setCategory(value);
  };

  useEffect(() => {
    if (addProductDone) {
      setText('');
      Router.replace('/');
    }
  }, [addProductDone]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('내용을 작성하세요.');
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append('image', p);
    });
    formData.append('content', text);
    formData.append('category', category);
    return dispatch({
      type: ADD_PRODUCT_REQUEST,
      data: formData,
    });
  }, [text, category, imagePaths]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  }, []);
  return (
    <>
      <Form style={{ margin: '10px 0 20px' }} encType="nultipart/form-data" onFinish={onSubmit}>
        <Select defaultValue="카테고리" onChange={onSelect} style={{ width: 200 }}>
          <Select.Option value="디지털|가전" title="디지털/가전">디지털/가전</Select.Option>
          <Select.Option value="의류" title="의류">의류</Select.Option>
          <Select.Option value="생활용품" title="생활용품">생활용품</Select.Option>
          <Select.Option value="도서" title="도서">도서</Select.Option>
          <Select.Option value="기타" title="기타">기타</Select.Option>
        </Select>
        <div style={{ margin: '10px 0 10px' }}>
          <input type="file" name="image" multiple hidden ref={imageInput} onChange={onChangeImages} />
          <Button onClick={onClickImageUpload} style={{ width: 200 }}>상품 이미지 업로드</Button>
          <br />
        </div>
        <div>
          {imagePaths.map((v, i) => (
            <div key={v} style={{ display: 'inline-block' }}>
              <img src={`http://localhost:3080/${v}`} style={{ width: '200px' }} alt={v} />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          ))}
        </div>
        <Input.TextArea placeholder="내용입력" value={text} onChange={onChangeText} />
        <Button type="primary" style={{ float: 'right' }} htmlType="submit">저장</Button>
      </Form>
    </>
  );
};

export default ProductionForm;
