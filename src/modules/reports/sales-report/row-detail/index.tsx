import { getOrder } from '@/api/order.service';
import CustomTable from '@/components/CustomTable';
import { formatDateTime, formatMoney } from '@/helpers';
import { IOrder } from '@/modules/transactions/order/type';
import { useQuery } from '@tanstack/react-query';
import { ColumnsType } from 'antd/es/table';
import { useState } from 'react';

function RowDetail({ record, branchId, from, to, fromTime, toTime }: any) {

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 99,
    keyword: '',
    ...(fromTime ? { from: from + " " + fromTime, to: to + " " + toTime } : { dateRange: JSON.stringify({ startDate: from, endDate: to }) }),
    status: undefined,
    branchId,
  });

  const { data: orders, isLoading } = useQuery(
    ['ORDER_LIST', JSON.stringify(formFilter), branchId],
    () => getOrder({ ...formFilter, branchId })
  );

  const columns: ColumnsType<IOrder> = [
    {
      title: "Mã hóa đơn",
      dataIndex: "code",
      key: "code",
      render: (value, _, index) => value,
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value) => formatDateTime(value),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (data) => data?.fullName,
    },
    {
      title: "Tổng tiền hàng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (value) => formatMoney(value),
    },
  ];

  return (
    <div className=''>
      <CustomTable
        dataSource={orders?.data?.items.map((item, index) => ({
          ...item,
          key: index + 1,
        }))}
        columns={columns}
        loading={isLoading}
      />
    </div>
  )
}

export default RowDetail