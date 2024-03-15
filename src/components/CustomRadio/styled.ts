import styled from 'styled-components';

export const RadioStyled = styled.div`
  .ant-radio-wrapper span.ant-radio + * {
    padding-inline-end: 0px;
  }

  .ant-radio-group {
    & > div:not(:last-child) {
      margin-bottom: 12px;
    }
    .ant-radio-wrapper {
      padding: 8px 0;

      span {
        color: #555770;
      }

      span:nth-child(2) {
        flex-grow: 1;
      }

      .ant-radio-inner {
        width: 20px;
        height: 20px;
        background-color: transparent;
      }

      .ant-radio-checked {
        border: unset;
      }

      .ant-radio-checked .ant-radio-inner {
        border-color: #d64457;

        &::after {
          inset-block-start: 12%;
          inset-inline-start: 12%;
          display: block;
          width: 30px;
          height: 30px;
          background-color: #d64457;
        }

        &:hover {
          border-color: #d64457;
        }
      }

      .ant-radio-checked:hover .ant-radio-inner {
        &:hover {
          border-color: #d64457;
        }
      }
    }

    .ant-radio-wrapper:hover .ant-radio-inner {
      border-color: #d64457;
    }
  }
`;
