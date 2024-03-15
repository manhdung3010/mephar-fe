import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import ExportIcon from '@/assets/exportIcon.svg';
import PlusIcon from '@/assets/plusWhiteIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import ProductDetail from './row-detail';
import Search from './Search';

interface IRecord {
  key: number;
  id: string;
  date: string;
  balanceDate: string;
  actualAmount: number;
  diffTotal: number;
  diffGreat: number;
  diffLess: number;
  note: string;
}

export function CheckInventory() {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const record = {
    key: 1,
    id: 'PN231017090542',
    date: '17/10/2023 09:05:14',
    balanceDate: '17/10/2023 09:05:14',
    actualAmount: 5,
    diffTotal: 1,
    diffGreat: 1,
    diffLess: 0,
    note: '',
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
      title: 'Mã kiểm kho',
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
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Ngày cân bằng',
      dataIndex: 'balanceDate',
      key: 'balanceDate',
    },
    {
      title: 'Tổng thực tế',
      dataIndex: 'actualAmount',
      key: 'actualAmount',
    },
    {
      title: 'Tổng chênh lệch',
      dataIndex: 'diffTotal',
      key: 'diffTotal',
    },
    {
      title: 'SL lệch tăng',
      dataIndex: 'diffGreat',
      key: 'diffGreat',
    },
    {
      title: 'SL lệch giảm',
      dataIndex: 'diffLess',
      key: 'diffLess',
    },
    {
      title: 'Ghi chú',
      dataIndex: 'note',
      key: 'note',
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton
          onClick={() => router.push('/products/check-inventory/coupon')}
          type="success"
          prefixIcon={<Image src={PlusIcon} />}
        >
          Kiểm kho
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
            <ProductDetail record={record} />
          ),
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />
    </div>
  );
}
