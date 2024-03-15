import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';

import CustomTable from '@/components/CustomTable';
import { EBillStatus, EBillStatusLabel } from '@/enums';

interface IRecord {
  key: number;
  id: string;
  date: string;
  createdBy: string;
  totalPrice: number;
  status: EBillStatus;
}

export function History({ record }: { record: any }) {
  const data = {
    key: 1,
    id: '002014',
    date: '12/10/2023 11:34',
    totalPrice: 120000,
    createdBy: 'dungtest',
    status: EBillStatus.comleted,
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
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Tổng cộng',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            {
              'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]':
                status === EBillStatus.comleted,
            },
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {EBillStatusLabel[status]}
        </div>
      ),
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
    </div>
  );
}
