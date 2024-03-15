import { Upload } from 'antd';
import styled from 'styled-components';

const { Dragger } = Upload;

export const UploadStyled = styled(Dragger)`
  .ant-upload {
    width: 100% !important;
    height: 100% !important;
    border: unset !important;
    background-color: unset !important;
    padding-top: 0px !important;
    padding-bottom: 0px !important;
  }

  .ant-upload-list {
    display: flex;
    flex-direction: column-reverse;
  }
`;
