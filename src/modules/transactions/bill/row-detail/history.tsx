import type { ColumnsType } from 'antd/es/table';

import CustomTable from '@/components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getOrderHistory } from '@/api/order.service';
import { formatDate, formatMoney } from '@/helpers';
import { EPaymentMethod } from '@/enums';

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

const History = ({ record }: any) => {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
  });

  const { data: orderHistory, isLoading } = useQuery(
    ['ORDER_HISTORY', JSON.stringify(formFilter)],
    () => getOrderHistory({ ...formFilter }, record.id)
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDate(value),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Giá trị phiếu',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (value) => value === EPaymentMethod.CASH ? "Tiền mặt" : value === EPaymentMethod.BANKING ? "Chuyển khoản" : "Khách nợ",
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value) => value === 'DONE' ? 'Đã hoàn thành' : 'Chưa hoàn thành',
    },
    {
      title: 'Tiền thu/chi',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => formatMoney(+value),
    },
  ];

  return <CustomTable dataSource={orderHistory?.data} columns={columns} />;
};

export default History;
