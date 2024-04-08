import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';

import DolorIcon from '@/assets/dolarIcon.svg';
import ExportIcon from '@/assets/exportIcon.svg';
import PaymentIcon from '@/assets/paymentIcon.svg';
import ReceiptIcon from '@/assets/receiptIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import { AddCashbookModal } from './AddCashbookModal';
import RowDetail from './row-detail';
import Search from './Search';

interface IRecord {
  key: number;
  id: string;
  date: string;
  type: string;
  receiveUser: string;
  value: number;
}

export function Cashbook() {
  const router = useRouter();

  const [openAddCashbookModal, setOpenAddCashbookModal] = useState(false);

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const record = {
    key: 1,
    id: 'TTHD231030154943',
    date: '30-10-2023 15:49',
    type: 'Thu tiền từ khách hàng',
    receiveUser: 'Dungtest',
    value: 100000,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
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
      title: 'Loại thu phí',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Người nộp/nhận',
      dataIndex: 'receiveUser',
      key: 'receiveUser',
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
    },
  ];
  return (
    // <div className="mb-2">
    //   <div className="my-3 flex justify-end bg-white p-2">
    //     <div className="flex items-center p-4">
    //       <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#0070F4] ">
    //         <Image src={DolorIcon} />
    //       </div>
    //       <div>
    //         <div className="text-xs text-[#15171A]">Quỹ đầu kỳ</div>
    //         <div className="text-[22px] text-[#0070F4]">0</div>
    //       </div>
    //     </div>

    //     <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

    //     <div className="flex items-center p-4">
    //       <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#00B63E]">
    //         <Image src={DolorIcon} />
    //       </div>
    //       <div>
    //         <div className="text-xs text-[#15171A]">Tổng thu</div>
    //         <div className="text-[22px] text-[#00B63E]">0</div>
    //       </div>
    //     </div>

    //     <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

    //     <div className="flex items-center p-4">
    //       <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F32B2B]">
    //         <Image src={DolorIcon} />
    //       </div>
    //       <div>
    //         <div className="text-xs text-[#15171A]">Tổng chi</div>
    //         <div className="text-[22px] text-[#F32B2B]">0</div>
    //       </div>
    //     </div>

    //     <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

    //     <div className="flex items-center p-4">
    //       <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF8800]">
    //         <Image src={DolorIcon} />
    //       </div>
    //       <div>
    //         <div className="text-xs text-[#15171A]">Tồn quỹ</div>
    //         <div className="text-[22px] text-[#FF8800]">0</div>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="mb-3 flex justify-end">
    //     <CustomButton
    //       type="success"
    //       prefixIcon={<Image src={ReceiptIcon} />}
    //       wrapClassName="mx-2"
    //       onClick={() => setOpenAddCashbookModal(true)}
    //     >
    //       Lập phiếu thu
    //     </CustomButton>
    //     <CustomButton
    //       type="success"
    //       prefixIcon={<Image src={PaymentIcon} />}
    //       wrapClassName="mx-2"
    //     >
    //       Lập phiếu chi
    //     </CustomButton>
    //     <CustomButton
    //       prefixIcon={<Image src={ExportIcon} />}
    //       wrapClassName="mx-2"
    //     >
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
    //     expandable={{
    //       // eslint-disable-next-line @typescript-eslint/no-shadow
    //       expandedRowRender: (record: IRecord) => <RowDetail record={record} />,
    //       expandIcon: () => <></>,
    //       expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
    //     }}
    //   />

    //   <AddCashbookModal
    //     isOpen={openAddCashbookModal}
    //     onCancel={() => setOpenAddCashbookModal(false)}
    //   />
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
