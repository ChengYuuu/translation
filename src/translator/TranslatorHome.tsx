import React, { useState, ChangeEvent, useEffect } from 'react';
import './TranslatorHome.scss';
import TranslateBox from './TranslateBox';
import TranslateProcessor from './TranslateProcessor';
import { Card, Input, Upload, Button } from 'antd';
import { AudioOutlined, CloseCircleTwoTone, UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Dragger } = Upload;

const TranslationHome = () => {

  const API_URL: string = 'http://localhost:8080';

  const [translateText, setTranslateText] = useState('');
  const [audioStream, setAudioStream] = useState<MediaStream>();
  const [pictureFile, setPictureFile] = useState<File>();
  const [pictureSrc, setPictureSrc] = useState<any>('');
  const [translateType, setTranslateType] = useState('textToText');
  const [supportedLanguages, setSupportedLanguages] = useState({});
  const [fromLanguage, setFromLanguage] = useState('en');
  const [toLanguage, setToLanguage] = useState('th');

  const [result, setResult] = useState('');

  useEffect(() => {
    let getSupportedLanguages = async () => {
      fetch(API_URL + '/supportedLanguages')
        .then(response => response.json())
        .then(data => setSupportedLanguages(data))
    }
    getSupportedLanguages();
  }, []);

  let typeOfTranslation: {[key: string]: string} = {
    textToText: 'Text to text translation',
    voiceToText: 'Voice to text translation',
    pictureToText: 'Picture to text translation'
  }

  let translateTextChange = (event: ChangeEvent) => {
    setTranslateText((event.target as HTMLTextAreaElement).value);
  }

  let pictureUploadProps = {
    showUploadList: false,
    beforeUpload: (file: File) => {
      let reader = new FileReader();
      reader.onloadend = (e) => {
        setPictureSrc(reader.result)
      }
      reader.readAsDataURL(file);
      setPictureFile(file);
      return false;
    }
  }

  let audioUploadProps = {
    showUploadList: false,
    beforeUpload: (file: File) => {
      return false;
    }
  }

  let getMicrophoneAudioStream = () => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => setAudioStream(stream));
  }

  let onClickRecordAudio = (event: React.MouseEvent<HTMLButtonElement>) => {
    getMicrophoneAudioStream();
  }

  let onClickDeletePicture = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPictureFile(undefined);
  }

  let onClickTranslate = () => {
    if (translateType === 'textToText') {
      (async () => {
        fetch(API_URL + '/translateText', 
          {method: 'post', body: JSON.stringify({ translateText: translateText, targetLanguage: toLanguage })})
          .then(response => response.json())
          .then(data => setResult(data.translatedText))
      })();
    } else if (translateType === 'voiceToText') {

    } else {
      (async () => {
        fetch(API_URL + '/translatePicture', 
          {method: 'post', body: JSON.stringify({ translatePicture: pictureSrc, targetLanguage: toLanguage })})
          .then(response => response.json())
          .then(data => setResult(data.translatedImage))
      })();
    }
  }

  let translateBoxInput: {[key: string]: React.ReactNode} = {
    textToText: <TextArea onChange={translateTextChange} style={{ width: '100%', height: '100%', border: '1px solid' }}/>,
    voiceToText: <div>
        <div style={{ width: '100%' , display: 'flex', justifyContent:'space-around', margin: '10px 0' }}>
          <Button type='primary' style={{  }} onClick={onClickRecordAudio} ><AudioOutlined />Record Now</Button>
          <Upload {...audioUploadProps}>
            <Button type='primary'>
              <UploadOutlined /> Select File
            </Button>
          </Upload>
        </div>
        <div style={{ textAlign: 'left', marginBottom: 10, marginLeft:10 }}>
          Audio file:
        </div>
        <audio controls style={{ width: '100%' }}/>
      </div>,
    pictureToText: pictureFile ?
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <img alt='Uploaded' src={pictureSrc} style={{ width: '100%', height: '100%', display: 'block' }} />
        <CloseCircleTwoTone onClick={onClickDeletePicture} style={{ position: 'absolute', top: 0, right: 0, margin: 10, fontSize: 20}}/>
      </div>
      : <Dragger {...pictureUploadProps}>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
      </Dragger>
  }

  return (
    <div>
      <div className='translator-header'>
        Single Word Translator
      </div>
      <div className='translator-body'>
        {
          Object.keys(typeOfTranslation).map((key, index) => 
          <TranslateBox key={index} title={typeOfTranslation[key]}>
            {translateBoxInput[key]}
          </TranslateBox>  
        )}
      </div>
      <div className='translator-processor'>
        <TranslateProcessor
          setTranslateType={setTranslateType}
          supportedLanguages={supportedLanguages}
          setFromLanguage={setFromLanguage}
          setToLanguage={setToLanguage}
          onClickTranslate={onClickTranslate}
        />
      </div>
      <Card title='Result' bordered={false} style={{ border: '1px solid', margin: '0 20px' }} headStyle={{ textAlign: 'center' }}>
        <div>
          {result}
        </div>
      </Card>
    </div>
  );
}

export default TranslationHome;
