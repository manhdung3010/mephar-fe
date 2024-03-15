import type { TableProps } from 'antd';
import { Table } from 'antd';
import styled from 'styled-components';

const CustomTableStyled = styled(Table)`
  .ant-table-container table > thead > tr:first-child > *:first-child {
    border-start-start-radius: 0px;
  }

  .ant-table-container table > thead > tr:first-child > *:last-child {
    border-start-end-radius: 0px;
  }

  thead.ant-table-thead .ant-table-cell {
    border-top: 1px solid #f7dadd;
    border-bottom: 1px solid #f7dadd;
    background: #fbecee;
  }

  .ant-table-expanded-row > .ant-table-cell {
    padding: 0 0;
  }
`;
const CustomTable = (props: TableProps<any>) => {
  return (
    <CustomTableStyled
      {...props}
      pagination={false}
      scroll={props.scroll ? props.scroll : { x: 1000 }}
    />
  );
};

export default CustomTable;
