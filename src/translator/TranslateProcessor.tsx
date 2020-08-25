import React from 'react';
import './TranslateProcessor.scss';
import { Button, Select } from 'antd';

const { Option } = Select;

interface TranslateProcessorProps {
  setTranslateType: React.Dispatch<React.SetStateAction<string>>;
  supportedLanguages : {[key:string]:string};
  setFromLanguage: React.Dispatch<React.SetStateAction<string>>;
  setToLanguage: React.Dispatch<React.SetStateAction<string>>;
  onClickTranslate: () => void;
}

const TranslateProcessor = (props: TranslateProcessorProps) => {

  let onTranslateTypeChange = (value: string) => {
    props.setTranslateType(value);
  }

  let onLanguageFromChange = (value: string) => {
    props.setFromLanguage(value);
  }

  let onLanguageToChange = (value: string) => {
    props.setToLanguage(value);
  }

  return (
    <div className='translate-processor-container'>
      <div>Translate type:</div>
      <Select
        placeholder='Select type to translate'
        style={{ width: 200}}
        defaultValue={'textToText'}
        onChange={onTranslateTypeChange}
      >
        <Option value='textToText'>Text to Text</Option>
        <Option value='voiceToText'>Voice to Text</Option>
        <Option value='pictureToText'>Picture to Text</Option>
      </Select>
      <div>Translate from</div>
      <Select
        placeholder='Select Language'
        style={{ width: 200}}
        onChange={onLanguageFromChange}
        defaultValue={'en'}
      >
        { Object.keys(props.supportedLanguages).map((key, index) =>
          <Option key={index} value={key}>
            {props.supportedLanguages[key]}
          </Option>
        )}
      </Select>
      <div>to</div>
      <Select
        placeholder='Select Language'
        style={{ width: 200}}
        onChange={onLanguageToChange}
        defaultValue={'th'}
      >
        { Object.keys(props.supportedLanguages).map((key, index) =>
          <Option key={index} value={key}>
            {props.supportedLanguages[key]}
          </Option>
        )}
      </Select>
      <Button type='primary' onClick={props.onClickTranslate}>
        Translate now!
      </Button>
    </div>
  );
}

export default TranslateProcessor;
