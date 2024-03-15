import type { ColumnsType } from 'antd/es/table';

import CustomTable from '../../../../components/CustomTable';

interface IRecord {
  key: number;
  product: string;
  expireDate: string;
  quantity: number;
  lastInputPrice: number;
}

const ProductExpire = () => {
  const record = {
    key: 1,
    product: 'Sản phẩm A',
    expireDate: '2023-11-08',
    quantity: 10,
    lastInputPrice: 10000,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Lô/hạn sử dụng',
      dataIndex: 'product',
      key: 'product',
    },
    {
      title: 'Ngày hết hạn',
      dataIndex: 'expireDate',
      key: 'expireDate',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá nhập gần nhất',
      dataIndex: 'lastInputPrice',
      key: 'lastInputPrice',
    },
  ];

  return <CustomTable dataSource={dataSource} columns={columns} />;
};

export default ProductExpire;
