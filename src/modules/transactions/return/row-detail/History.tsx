import type { ColumnsType } from 'antd/es/table';

import CustomTable from '@/components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getReturnPaymentHistory } from '@/api/return-product.service';
import { formatDateTime, formatMoney } from '@/helpers';
import CustomPagination from '@/components/CustomPagination';

interface IRecord {
  key: number;
  id: string;
  date: string;
  fullnameCreator?: any
  createdBy: string;
  price: number;
  paymentMethod: string;
  status: string;
  totalPrice: number;
}

const History = ({ record }) => {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { data: returnHistory, isLoading } = useQuery(
    ['RETURN_HISTORY', JSON.stringify(formFilter)],
    () => getReturnPaymentHistory(formFilter, record.id),
    {
      enabled: !!record.id,
    }
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
      render: (date) => formatDateTime(date),
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (_, record) => record.fullnameCreator?.fullName,
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
      render: (value) => value === 'CASH' ? 'Tiền mặt' : 'Chuyển khoản',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (value) => value === 'DONE' ? 'Hoàn thành' : 'Đã hủy',
    },
    {
      title: 'Tiền thu/chi',
      dataIndex: 'amount',
      key: 'amount',
      render: (value) => formatMoney(+value),
    },
  ];

  return (
    <div>
      <CustomTable dataSource={returnHistory?.data?.items} columns={columns} loading={isLoading} />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={returnHistory?.data?.totalItem}
      />
    </div>
  );
};

export default History;
