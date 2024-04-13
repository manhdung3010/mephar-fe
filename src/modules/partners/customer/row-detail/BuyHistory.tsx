import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';

import { getOrder } from '@/api/order.service';
import DollarIcon from '@/assets/dolarIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { EOrderStatus, EOrderStatusLabel } from '@/enums';
import { formatDateTime, formatMoney } from '@/helpers';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  totalPrice: number;
  receivePrice: number;
  cashOfCustomer: number;
  returnPrice: number;
  createdAt: string;
  status: EOrderStatus;
}

export function BuyHistory({ record, branchId }: { record: any, branchId: number }) {
  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 99,
    customerId: record.id,
    branchId,
  });

  const { data: orders, isLoading } = useQuery(
    ['ORDER_LIST', JSON.stringify(formFilter), branchId],
    () => getOrder({ ...formFilter, branchId })
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      key: 'code',
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Khách trả',
      dataIndex: 'cashOfCustomer',
      key: 'cashOfCustomer',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Trả lại',
      dataIndex: 'returnPrice',
      key: 'returnPrice',
      render: (value, record) => formatMoney(+record?.cashOfCustomer - +record?.totalPrice),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={cx(
            status === EOrderStatus.SUCCEED
              ? "text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]"
              : "text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]",
            "px-2 py-1 rounded-2xl w-max"
          )}
        >
          {EOrderStatusLabel[status]}
        </div>
      ),
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={orders?.data?.items}
        columns={columns}
        pagination={false}
        className="mb-4"
        loading={isLoading}
      />
    </div>
  );
}
