import type { ColumnsType } from 'antd/es/table';

import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  totalPrice: number;
  discount: number;
}

export function DiscountInfo() {
  const record = {
    key: 1,
    totalPrice: 100000,
    discount: 5000,
  };

  const dataSource: IRecord[] = Array(2)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      className: 'max-w-[50%] w-1/2',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discount',
      key: 'discount',
      className: 'max-w-[50%] w-1/2',
    },
  ];
  return <CustomTable dataSource={dataSource} columns={columns} bordered />;
}
