import styled from 'styled-components';

export const ComponentStyled = styled.div`
  width: 100%;

  .normal-select {
    width: 100% !important;

    border: 1px solid #d9d9d9;
    border-radius: 54px;
    .ant-select-selector {
      border: unset !important;
      box-shadow: unset !important;

      padding: 12px 16px;
      border-radius: 58px;
    }
  }

  .border-underline {
    border-bottom: 1px solid #e4e4eb;
    border-top: unset;
    border-left: unset;
    border-right: unset;
    border-radius: unset;

    .ant-select-selector {
      border: unset;
      box-shadow: none !important;
    }
  }

  .suffix-icon {
    .ant-select-selector {
      width: calc(100% - 35px);
    }
  }

  .prefix-icon {
    .ant-select-selector {
      padding-left: 44px;

      input {
        padding-left: 34px !important;
      }
    }
  }

  .ant-select-arrow {
    pointer-events: unset;
  }
`;
