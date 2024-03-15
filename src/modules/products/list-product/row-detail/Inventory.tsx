import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';

import { EProductStatus, EProductStatusLabel } from '@/enums';

import CustomTable from '../../../../components/CustomTable';

interface IRecord {
  key: number;
  branch: string;
  inventory: number;
  order: number;
  planSoldOff: string;
  status: EProductStatus;
}

const Inventory = () => {
  const record = {
    key: 1,
    branch: 'Chi nhánh mặc định',
    inventory: 80,
    order: 10,
    planSoldOff: 'content',
    status: EProductStatus.active,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Chi nhánh',
      dataIndex: 'branch',
      key: 'branch',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'inventory',
      key: 'inventory',
    },
    {
      title: 'Khách đặt hàng',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Dự kiến hết hàng',
      dataIndex: 'planSoldOff',
      key: 'planSoldOff',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            status === EProductStatus.active
              ? 'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]'
              : 'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]',
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {EProductStatusLabel[status]}
        </div>
      ),
    },
  ];

  return <CustomTable dataSource={dataSource} columns={columns} />;
};

export default Inventory;
