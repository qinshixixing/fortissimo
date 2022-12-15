import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps } from 'antd';
import type { TextAreaProps, PasswordProps, SearchProps } from 'antd/es/input';

const defaultProps = {
  allowClear: true,
  showCount: true
};

function TextArea(props: TextAreaProps) {
  return <AntInput.TextArea {...defaultProps} {...props} />;
}

function Password(props: PasswordProps) {
  return <AntInput.Password {...defaultProps} {...props} />;
}

function Search(props: SearchProps) {
  return <AntInput.Search {...defaultProps} {...props} />;
}

export function Input(props: InputProps) {
  return <AntInput {...defaultProps} {...props} />;
}

Input.TextArea = TextArea;
Input.Password = Password;
Input.Search = Search;
Input.Group = AntInput.Group;
