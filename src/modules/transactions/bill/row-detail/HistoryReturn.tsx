import type { ColumnsType } from 'antd/es/table';

import CustomTable from '@/components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getOrderHistory, getSaleReturn } from '@/api/order.service';
import { formatDate, formatDateTime, formatMoney } from '@/helpers';
import { EPaymentMethod } from '@/enums';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';

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

const HistoryReturn = ({ record }: any) => {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    orderId: record.id,
  });
  const branchId = useRecoilValue(branchState);

  const { data: saleReturn, isLoading } = useQuery(
    ['SALE_RETURN', formFilter, branchId],
    () => getSaleReturn({ ...formFilter, branchId })
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã trả hàng',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Người nhận trả',
      dataIndex: 'customer',
      key: 'customer',
      render: (value) => value?.fullName,
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'paid',
      key: 'paid',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value) => value === 'SUCCEED' ? 'Đã hoàn thành' : 'Hủy bỏ',
    },
  ];

  return <CustomTable dataSource={saleReturn?.data?.items} columns={columns} />;
};

export default HistoryReturn;
