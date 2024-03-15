import type { ColumnsType } from 'antd/es/table';

import CustomTable from '../../../../components/CustomTable';

interface IRecord {
  key: number;
  code: string;
  method: string;
  time: string;
  partner: string;
  cost: string;
  quantity: string;
  inStock: string;
}

const WareHouseCard = () => {
  const record = {
    key: 1,
    code: 'HH230704161432',
    method: 'Nhập hàng',
    time: '2023-07-28 17:14:05',
    partner: 'Thực phẩm chức năng',
    cost: '100,000',
    quantity: '300',
    inStock: '25',
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Chứng từ',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Phương thức',
      dataIndex: 'method',
      key: 'method',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Đối tác',
      dataIndex: 'partner',
      key: 'partner',
    },
    {
      title: 'Giá vốn',
      dataIndex: 'cost',
      key: 'cost',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Tồn cuối',
      dataIndex: 'inStock',
      key: 'inStock',
    },
  ];

  return <CustomTable dataSource={dataSource} columns={columns} />;
};

export default WareHouseCard;
