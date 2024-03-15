import type { ColumnsType } from 'antd/es/table';

import { CustomModal } from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';

interface IRecord {
  key: number;
  date: string;
  content: string;
  user: string;
}

export function OrderHistoryModal({
  isOpen,
  onCancel,
}: {
  isOpen: boolean;
  onCancel: () => void;
}) {
  const record = {
    key: 1,
    date: '17/10/2023 09:05:14',
    content: 'PN231017090542',
    user: 'Quyentt',
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'user',
      key: 'user',
    },
  ];

  return (
    <CustomModal
      customFooter={true}
      title="Lịch sử đơn hàng"
      isOpen={isOpen}
      onCancel={onCancel}
      width={1100}
    >
      <div className="my-4 h-[1px] w-full bg-[#C7C9D9]"></div>
      <CustomTable
        columns={columns}
        dataSource={dataSource}
        bordered
        pagination={false}
      />
    </CustomModal>
  );
}
