import styled from 'styled-components';

export const ButtonStyled = styled.div`
  .ant-btn {
    height: 36px;
    width: 100%;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    min-width: 64px;
    font-weight: 500;
    box-shadow: none !important;

    span {
      font-weight: 500;
      font-size: inherit;
      color: white;
    }
  }

  .danger {
    background: #d64457;

    &:hover {
      background: #d64457 !important;
      opacity: 0.8;
    }
  }

  .danger.btn-outline {
    span {
      font-size: inherit;
      color: #d64457;
    }

    background: unset !important;
    color: #d64457;
    border: 1px solid #d64457;
  }

  .success {
    background: #00b63e;

    &:hover {
      background: #00b63e !important;
      opacity: 0.8;
    }
  }
  .success.btn-outline {
    span {
      font-size: inherit;
      color: #00b63e;
    }

    background: unset !important;
    color: #00b63e;
    border: 1px solid #00b63e;
  }

  .primary {
    background: #0070f4;

    &:hover {
      background: #0070f4 !important;
      opacity: 0.8;
    }
  }
  .primary.btn-outline {
    span {
      font-size: inherit;
      color: #0070f4;
    }

    background: unset !important;
    color: #0070f4;
    border: 1px solid #0070f4;
  }

  .disable {
    background: #6d6d6d;

    &:hover {
      background: #6d6d6d !important;
      opacity: 0.8;
    }
  }
  .disable.btn-outline {
    span {
      font-size: inherit;
      color: #6d6d6d;
    }

    background: unset !important;
    color: #6d6d6d;
    border: 1px solid #6d6d6d;
  }

  .original {
    background: white;
    border: 1px solid #d3d5d7;
    span {
      font-size: inherit;
      color: #0f1824;
    }

    &:hover {
      background: white !important;
      opacity: 0.8;
    }
  }
`;
