import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import PlusIcon from '@/assets/PlusIconWhite.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

const { TextArea } = Input;

interface IRecord {
  key: number;
  note: string;
  createdBy: string;
  createdAt: string;
}

export function Note({ record }: { record: any }) {
  const data = {
    key: 1,
    note: '002014',
    createdBy: 'Bán hàng',
    createdAt: '12/10/2023 11:34',
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: 'Người thêm',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className="mb-4"
        rowSelection={{
          type: 'checkbox',
        }}
      />

      <div className="flex justify-end gap-4">
        <CustomButton
          type="danger"
          prefixIcon={<Image src={PlusIcon} alt="" />}
        >
          Thêm ghi chú
        </CustomButton>
      </div>
    </div>
  );
}
