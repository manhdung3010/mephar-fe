import type { ColumnsType } from 'antd/es/table';

import { CustomModal } from '@/components/CustomModal';
import CustomTable from '@/components/CustomTable';
import { formatDateTime } from '@/helpers';
import { EOrderMarketStatus, EOrderMarketStatusLabel } from '@/modules/markets/type';

interface IRecord {
  id: number;
  time: string;
  note: string;
  status: string;
}

export function OrderHistoryModal({
  isOpen,
  onCancel,
  historyPurchase
}: {
  isOpen: boolean;
  onCancel: () => void;
  historyPurchase: any;
}) {

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
      render: (time) => formatDateTime(time)
    },
    {
      title: 'Nội dung',
      dataIndex: 'note',
      key: 'note',
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <div
          className={
            `py-1 px-2 rounded-2xl border-[1px]  w-max
          ${status === EOrderMarketStatus.PENDING && ' bg-[#fff2eb] border-[#FF8800] text-[#FF8800]'}
          ${status === EOrderMarketStatus.CONFIRM || status === EOrderMarketStatus.PROCESSING || status === EOrderMarketStatus.SEND && ' bg-[#e5f0ff] border-[#0063F7] text-[#0063F7]'}
          ${status === EOrderMarketStatus.DONE && ' bg-[#e3fff1] border-[#05A660] text-[#05A660]'}
          ${status === EOrderMarketStatus.CANCEL || status === EOrderMarketStatus.CLOSED && ' bg-[#ffe5e5] border-[#FF3B3B] text-[#FF3B3B]'}
          `
          }
        >
          {EOrderMarketStatusLabel[status?.toUpperCase()]}
        </div>
      ),
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
        dataSource={historyPurchase}
        bordered
        pagination={false}
      />
    </CustomModal>
  );
}
