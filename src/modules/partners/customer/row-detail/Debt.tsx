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
  type: string;
  price: number;
  debt: number;
  createdAt: string;
}

export function Debt({ record }: { record: any }) {
  const data = {
    key: 1,
    id: '002014',
    type: 'Bán hàng',
    price: 120000,
    debt: 50000,
    createdAt: '12/10/2023 11:34',
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá trị',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Dư nợ khách hàng',
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
