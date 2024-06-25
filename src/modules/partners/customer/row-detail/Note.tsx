import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import PlusIcon from '@/assets/PlusIconWhite.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { getNoteList } from '@/api/customer.service';

const { TextArea } = Input;

interface IRecord {
  key: number;
  note: string;
  createdBy: string;
  createdAt: string;
}

export function Note({ record }: { record: any }) {
  const { data: notes, isLoading } = useQuery(
    ['POINT_HISTORY', record?.id],
    () => getNoteList(record?.id),
    {
      enabled: !!record?.id,
    }
  );

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
        dataSource={notes?.data?.items}
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
