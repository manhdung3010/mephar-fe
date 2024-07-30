import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import DollarIcon from '@/assets/dolarIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
// import PaymentModal from './PaymentModal';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCustomerDebt } from '@/api/customer.service';
import { formatDateTime, formatMoney } from '@/helpers';
import PaymentModal from '@/modules/partners/customer/row-detail/PaymentModal';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  type: string;
  price: number;
  debt: number;
  createdAt: string;
}

export function Debt({ record, branchId }: { record: any, branchId: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentRecord, setPaymentRecord] = useState();

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 99,
    customerId: record.id,
    branchId,
  });

  const { data: orders, isLoading } = useQuery(
    ['ORDER_LIST_DEBT', JSON.stringify(formFilter), branchId],
    () => getCustomerDebt({ ...formFilter }, record.id)
  );

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (value) => value === 'ORDER' ? 'Bán hàng' : 'Trả hàng'
    },
    {
      title: 'Giá trị',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (value) => formatMoney(value),
    },
    {
      title: 'Dư nợ khách hàng',
      dataIndex: 'debtAmount',
      key: 'debtAmount',
      render: (value) => formatMoney(+value),
    },
    {
      title: 'Thao tác',
      dataIndex: 'action',
      key: 'action',
      render: (_, record: any) => (
        <div className="flex gap-3">
          <CustomButton
            type="success"
            prefixIcon={<Image src={DollarIcon} alt="" />}
            onClick={() => {
              setIsOpen(true)
              setPaymentRecord(record)
            }}
          >
            Thanh toán
          </CustomButton>
        </div>
      ),
    },
  ];
  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={orders?.data}
        columns={columns}
        pagination={false}
        className="mb-4"
        loading={isLoading}
      />

      <PaymentModal isOpen={isOpen} onCancel={() => setIsOpen(!isOpen)} record={paymentRecord} />
    </div>
  );
}
