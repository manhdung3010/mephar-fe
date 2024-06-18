import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import DollarIcon from '@/assets/dolarIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  quantity: number;
  returnQuantity: number;
  price: number;
  totalPrice: number;
  receivePrice: number;
  returnPrice: number;
  createdAt: string;
}

export function ReturnHistory({ record }: { record: any }) {
  const data = {
    key: 1,
    id: 'THD_202209272_105303',
    quantity: 2,
    returnQuantity: 0,
    price: 20000,
    totalPrice: 20000,
    receivePrice: 0,
    returnPrice: 0,
    createdAt: '12/10/2023 11:34',
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã hóa đơn',
      dataIndex: 'id',
      key: 'id',
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Số lượng trả',
      dataIndex: 'returnQuantity',
      key: 'returnQuantity',
    },
    {
      title: 'Số lượng mua',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Khách trả',
      dataIndex: 'receivePrice',
      key: 'receivePrice',
    },
    {
      title: 'Trả lại',
      dataIndex: 'returnPrice',
      key: 'returnPrice',
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div className="flex justify-end gap-4">
        <CustomButton
          type="success"
          prefixIcon={<Image src={DollarIcon} alt="" />}
        >
          Thanh toán
        </CustomButton>
      </div>
    </div>
  );
}
