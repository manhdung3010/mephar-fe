import type { ColumnsType } from 'antd/es/table';

import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  id: string;
  date: string;
  createdBy: string;
  price: number;
  paymentMethod: string;
  status: string;
  totalPrice: number;
}

const History = () => {
  const record = {
    key: 1,
    id: 'TTHD000046',
    date: '03/11/2023 22:07',
    createdBy: 'Người tạo',
    price: 120000,
    paymentMethod: 'Tiền mặt',
    status: 'Đã chuyển khoản',
    totalPrice: 120000,
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Giá trị phiếu',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Tiền thu/chi',
      dataIndex: 'price',
      key: 'price',
    },
  ];

  return <CustomTable dataSource={dataSource} columns={columns} />;
};

export default History;
