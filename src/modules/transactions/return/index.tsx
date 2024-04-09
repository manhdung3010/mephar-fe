import type { ColumnsType } from 'antd/es/table';
import cx from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import ExportIcon from '@/assets/exportIcon.svg';
import ImportIcon from '@/assets/importIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';
import {
  EReturnTransactionStatus,
  EReturnTransactionStatusLabel,
} from '@/enums';

import ReturnDetail from './row-detail';
import Search from './Search';

interface IRecord {
  key: number;
  id: string;
  seller: string;
  date: string;
  customer: string;
  needReturnAmount: number;
  returnedAmount: number;
  status: EReturnTransactionStatus;
}

export function ReturnTransaction() {
  const router = useRouter();

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const record = {
    key: 1,
    id: 'PN231017090542',
    seller: 'dungtest',
    date: '17/10/2023 09:05:14',
    customer: 'Khách lẻ',
    needReturnAmount: 70000,
    returnedAmount: 70000,
    status: EReturnTransactionStatus.comleted,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index + 1 }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã hóa đơn',
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
      title: 'Người bán',
      dataIndex: 'seller',
      key: 'seller',
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Cần trả khách',
      dataIndex: 'needReturnAmount',
      key: 'needReturnAmount',
    },
    {
      title: 'Đã trả khách',
      dataIndex: 'returnedAmount',
      key: 'returnedAmount',
    },

    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (_, { status }) => (
        <div
          className={cx(
            status === EReturnTransactionStatus.comleted
              ? 'text-[#00B63E] border border-[#00B63E] bg-[#DEFCEC]'
              : 'text-[#6D6D6D] border border-[#6D6D6D] bg-[#F0F1F1]',
            'px-2 py-1 rounded-2xl w-max'
          )}
        >
          {EReturnTransactionStatusLabel[status]}
        </div>
      ),
    },
  ];
  return (
    // <div>
    //   <div className="my-3 flex justify-end gap-4">
    //     <CustomButton
    //       // onClick={() => router.push("/products/import/coupon")}
    //       type="success"
    //       prefixIcon={<Image src={ImportIcon} />}
    //     >
    //       Thêm phiếu trả hàng
    //     </CustomButton>

    //     <CustomButton prefixIcon={<Image src={ExportIcon} />}>
    //       Xuất file
    //     </CustomButton>
    //   </div>

    //   <Search />

    //   <CustomTable
    //     rowSelection={{
    //       type: 'checkbox',
    //     }}
    //     dataSource={dataSource}
    //     columns={columns}
    //     onRow={(record, rowIndex) => {
    //       return {
    //         onClick: event => {
    //           // Toggle expandedRowKeys state here
    //           if (expandedRowKeys[record.key]) {
    //             const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
    //             setExpandedRowKeys(remainingKeys);
    //           } else {
    //             setExpandedRowKeys({ ...expandedRowKeys, [record.key]: true });
    //           }
    //         }
    //       };
    //     }}
    //     expandable={{
    //       // eslint-disable-next-line @typescript-eslint/no-shadow
    //       expandedRowRender: (record: IRecord) => (
    //         <ReturnDetail record={record} />
    //       ),
    //       expandIcon: () => <></>,
    //       expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
    //     }}
    //   />
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
