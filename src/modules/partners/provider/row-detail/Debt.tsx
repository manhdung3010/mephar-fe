import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import DollarIcon from '@/assets/dolarIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  id: string;
  date: string;
  type: string;
  totalPrice: number;
  debt: number;
}

export function Debt({ record }: { record: any }) {
  const data = {
    key: 1,
    id: '002014',
    date: '12/10/2023 11:34',
    type: 'Content',
    totalPrice: 1500000,
    debt: 1000000,
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá trị',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Nợ cần trả NCC',
      dataIndex: 'debt',
      key: 'debt',
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
