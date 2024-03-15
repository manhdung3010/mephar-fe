import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import ExportIcon from '@/assets/exportIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import {
  EDeliveryTransactionStatus,
  EDeliveryTransactionStatusLabel,
} from '@/enums';

import ReturnDetail from './row-detail';
import Search from './Search';

interface IRecord {
  key: number;
  id: string;
  fromBranch: string;
  toBranch: string;
  fromDate: string;
  toDate: string;
  status: EDeliveryTransactionStatus;
}

export function DeliveryTransaction() {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const record = {
    key: 1,
    id: 'PN231017090542',
    fromBranch: 'Chi nhánh Mễ Trì Thượng',
    toBranch: 'Chi nhánh Mễ Trì Hạ',
    fromDate: '17/10/2023 09:05:14',
    toDate: '17/10/2023 09:05:14',
    status: EDeliveryTransactionStatus.DELIVERING,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã chuyển hàng',
      dataIndex: 'id',
      key: 'id',
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
          onClick={() => {
            const currentState = expandedRowKeys[`${index}`];
            const temp = { ...expandedRowKeys };
            if (currentState) {
              delete temp[`${index}`];
            } else {
              temp[`${index}`] = true;
            }
            setExpandedRowKeys({ ...temp });
          }}
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Từ chi nhánh',
      dataIndex: 'fromBranch',
      key: 'fromBranch',
    },
    {
      title: 'Tới chi nhánh',
      dataIndex: 'toBranch',
      key: 'toBranch',
    },
    {
      title: 'Ngày chuyển',
      dataIndex: 'fromDate',
      key: 'fromDate',
    },
    {
      title: 'Ngày nhận',
      dataIndex: 'toDate',
      key: 'toDate',
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
                status === EDeliveryTransactionStatus.DELIVERED,
              'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]':
                status === EDeliveryTransactionStatus.STORE,
              'text-[#0070F4] border border-[#0070F4] bg-[#E4F0FE]':
                status === EDeliveryTransactionStatus.STORE,
            },

            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {EDeliveryTransactionStatusLabel[status]}
        </div>
      ),
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton
          onClick={() => router.push('/transactions/delivery/coupon')}
          type="success"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Chuyển hàng
        </CustomButton>

        <CustomButton prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      </div>

      <Search />

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={dataSource}
        columns={columns}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => (
            <ReturnDetail record={record} />
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
    </div>
  );
}
