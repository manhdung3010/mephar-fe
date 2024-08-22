import styled from "styled-components";

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
export const MarketPaginationStyled = styled.div`
  .ant-pagination-options {
    display: none;
  }

  .ant-pagination-item {
    background-color: white;
    border: 1px solid #c7c9d9;
    border-radius: 50px;
    min-width: 42px;
    width: 42px;
    height: 35px;
    line-height: 42px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;

    a {
      font-size: 16px;
      padding: 0;
    }
  }

  .ant-pagination-item:not(.ant-pagination-item-active):hover {
    background-color: #ffe5e5;
    border: 1px solid #d64457;
    opacity: 0.8;
    border-radius: 50px;

    a {
      color: #d64457;
    }
  }

  .ant-pagination-item-active {
    background-color: #ffe5e5;
    border: 1px solid #d64457;

    &:hover {
      opacity: 0.8;
      border: 1px solid #d64457;
      color: #d64457;
      a {
        color: #d64457;
      }
    }

    a {
      color: #d64457;
      margin-top: 1px;

      &:hover {
        color: #d64457;
      }
    }
  }

  .ant-pagination-prev,
  .ant-pagination-next {
    border-radius: 50px;
    min-width: 52px;
    width: 52px;
    height: 36px;
    border: 1px solid #c7c9d9;
  }

  .ant-pagination-item-ellipsis {
    border-radius: 50px;
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
