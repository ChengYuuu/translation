import React from 'react';
import './TranslateBox.scss';

interface TranslateBoxProps {
  children: React.ReactNode;
  title: String;
}

const TranslateBox = (props: TranslateBoxProps) => {
  return (
    <div className='translate-box-container'>
      <div className='translate-box-header'>
        {props.title}
      </div>
      <div className='translate-engine'>
        {props.children}
      </div>
    </div>
  );
}

export default TranslateBox;
