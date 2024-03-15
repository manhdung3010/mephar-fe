import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import { EDiscountStatus, EDiscountStatusLabel } from '@/enums';

import RowDetail from './row-detail';
import Search from './Search';

interface IRecord {
  key: number;
  id: string;
  name: string;
  fromDate: string;
  toDate: string;
  createdBy: string;
  status: EDiscountStatus;
  type: string;
}

export function Discount() {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const record = {
    key: 1,
    id: 'KM231101093112',
    name: 'Giảm giá sinh nhật',
    fromDate: '02/08/2023 11:17:51',
    toDate: '18/08/2023 00:00:00',
    createdBy: 'Trường Nguyễn',
    status: EDiscountStatus.active,
    type: 'Giảm giá hoá đơn',
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã chương trình',
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
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Từ ngày',
      dataIndex: 'fromDate',
      key: 'fromDate',
    },
    {
      title: 'Đến ngày',
      dataIndex: 'toDate',
      key: 'toDate',
    },
    {
      title: 'Người tạo',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            status === EDiscountStatus.active
              ? 'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]'
              : 'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]',
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {EDiscountStatusLabel[status]}
        </div>
      ),
    },
    {
      title: 'Hình thức khuyến mại',
      dataIndex: 'type',
      key: 'type',
    },
  ];
  return (
    <div className="mb-2">
      <div className="my-3 flex items-center justify-end gap-4">
        <CustomButton
          prefixIcon={<Image src={PlusIcon} />}
          onClick={() => router.push('/settings/discount/add-discount')}
        >
          Thêm mới khuyến mại
        </CustomButton>
      </div>

      <Search />

      <CustomTable
        dataSource={dataSource}
        columns={columns}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => <RowDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
    </div>
  );
}
