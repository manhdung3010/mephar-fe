import styled from 'styled-components';

export const PaginationStyled = styled.div`
  .ant-pagination-options {
    display: none;
  }

  .ant-pagination-item {
    background-color: #f0f1f1;
    border-radius: 50%;
    min-width: 24px;
    width: 24px;
    height: 24px;
    line-height: 24px;
    font-weight: 600;

    a {
      font-size: 12px;
      padding: 0 5px;
    }
  }

  .ant-pagination-item:not(.ant-pagination-item-active):hover {
    background-color: #d64457;
    opacity: 0.8;

    a {
      color: #fff;
    }
  }

  .ant-pagination-item-active {
    background-color: #d64457;
    border: unset;

    &:hover {
      opacity: 0.8;
    }

    a {
      color: #fff;
      margin-top: 1px;

      &:hover {
        color: #fff;
      }
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 50%;
    min-width: 24px;
    width: 24px;
    height: 24px;
  }

  .ant-pagination-item-ellipsis {
    border-radius: 50%;
    color: #555770 !important;
    font-size: 10px;
    width: 24px;
    height: 24px;
  }

  .anticon-double-right {
    svg {
      color: #d64457;
    }
  }
`;
