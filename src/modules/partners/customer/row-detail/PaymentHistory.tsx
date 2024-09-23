import { paymentHistory } from '@/api/customer.service';
import CustomPagination from '@/components/CustomPagination';
import CustomTable from '@/components/CustomTable';
import { formatDateTime, formatMoney } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

function PaymentHistory({ id }) {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 10,
  });

  const { data: history, isLoading } = useQuery(
    ['CUSTOMER_PAYMENT_HISTORY', JSON.stringify(formFilter)],
    () => paymentHistory(id, formFilter),
    {
      enabled: !!id,
    }
  );

  const columns: any = [
    {
      title: 'Mã thanh toán',
      dataIndex: 'code',
      key: 'code',
      render: (value, record) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value, record) => formatDateTime(value),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (value, record) => formatMoney(value),
    },
    {
      title: 'Phương thức thanh toán',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (value, record) => value === 'BANK' ? 'Chuyển khoản' : 'Tiền mặt',
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={history?.data?.items}
        columns={columns}
        pagination={false}
        className="mb-4"
        loading={isLoading}
      />
      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={history?.data?.totalItem}
      />
    </div>
  );
}

export default PaymentHistory