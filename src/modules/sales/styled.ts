import styled from 'styled-components';

export const HeaderStyled = styled.div``;

export const LeftMenuStyled = styled.div`
  &::-webkit-scrollbar {
    display: none;
  }

  border-right: 1px solid #e4e4e4;
`;

export const RightContentStyled = styled.div`
  border-left: 1px solid #e4e4e4;
`;

export const ProductTableStyled = styled.div`
  .ant-table {
    border: 1px solid #f7dadd;
    border-radius: 12px;
  }
  .ant-table-thead {
    .ant-table-cell {
      background: #fbecee;
      color: #000;

      &:first-child {
        border-start-start-radius: 12px !important;
      }

      &:last-child {
        border-start-end-radius: 12px !important;
      }
    }
  }

  .ant-table-tbody {
    .ant-table-row {
      .ant-table-cell {
        border-bottom: unset;
      }
    }
  }
`;
