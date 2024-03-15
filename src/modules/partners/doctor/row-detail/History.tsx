import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';

import CustomTable from '@/components/CustomTable';
import { EBillStatus, EBillStatusLabel } from '@/enums';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  totalPrice: number;
  receivePrice: number;
  returnPrice: number;
  createdAt: string;
  status: EBillStatus;
}

export function History({ record }: { record: any }) {
  const data = {
    key: 1,
    id: '002014',
    totalPrice: 120000,
    receivePrice: 50000,
    returnPrice: 0,
    status: EBillStatus.comleted,
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
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
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
