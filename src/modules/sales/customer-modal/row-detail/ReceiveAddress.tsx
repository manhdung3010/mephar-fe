import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import PlusIcon from '@/assets/PlusIconWhite.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

const { TextArea } = Input;

interface IRecord {
  key: number;
  name: string;
  receiveUser: string;
  receivePhone: string;
  receiveAddress: string;
  createdAt: string;
}

export function ReceiveAddress({ record }: { record: any }) {
  const data = {
    key: 1,
    name: 'Content',
    receiveUser: 'Huy',
    receivePhone: '0868666888',
    receiveAddress: 'content',
    createdAt: '12/10/2023 11:34',
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Tên địa chỉ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tên người nhận',
      dataIndex: 'receiveUser',
      key: 'receiveUser',
    },
    {
      title: 'SĐT nhận',
      dataIndex: 'receivePhone',
      key: 'receivePhone',
    },
    {
      title: 'Địa chỉ nhận',
      dataIndex: 'receiveAddress',
      key: 'receiveAddress',
    },
    {
      title: 'Ngày tạo',
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
      />

      <div className="flex justify-end gap-4">
        <CustomButton
          type="success"
          prefixIcon={<Image src={PlusIcon} alt="" />}
        >
          Thêm địa chỉ mới
        </CustomButton>
      </div>
    </div>
  );
}
