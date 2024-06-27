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
import { useQuery } from '@tanstack/react-query';
import { getTransaction } from '@/api/cashbook.service';
import { formatDateTime, formatMoney } from '@/helpers';
import { useRecoilValue } from 'recoil';
import { branchState } from '@/recoil/state';
import CustomPagination from '@/components/CustomPagination';

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
  const branchId = useRecoilValue(branchState);

  const [openAddCashbookModal, setOpenAddCashbookModal] = useState(false);
  const [cashbookType, setCashbookType] = useState<string>('');

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const [formFilter, setFormFilter] = useState({
    page: 1,
    limit: 20,
    keyword: '',
    branchId
  });

  const { data: transactions, isLoading } = useQuery(
    ['TRANSACTION', JSON.stringify(formFilter)],
    () => getTransaction(formFilter),
  );
  const columns: any = [
    {
      title: 'Mã phiếu',
      dataIndex: 'code',
      key: 'code',
      render: (value, _, index) => (
        <span
          className="cursor-pointer text-[#0070F4]"
        >
          {value}
        </span>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value) => formatDateTime(value),
    },
    {
      title: 'Loại thu phí',
      dataIndex: 'typeTransaction',
      key: 'typeTransaction',
      render: (value) => value?.name,
    },
    {
      title: 'Người nộp/nhận',
      dataIndex: 'targetCustomer',
      key: 'targetCustomer',
      render: (value, record) => record?.targetCustomer?.fullName || record?.targetSupplier?.name || record?.targetOther?.name || record?.targetUser?.name,
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value) => formatMoney(value),
    },
  ];
  return (
    <div className="mb-2">
      <div className="my-3 flex justify-end bg-white p-2">
        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#0070F4] ">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Quỹ đầu kỳ</div>
            <div className="text-[22px] text-[#0070F4]">0</div>
          </div>
        </div>

        <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#00B63E]">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Tổng thu</div>
            <div className="text-[22px] text-[#00B63E]">0</div>
          </div>
        </div>

        <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#F32B2B]">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Tổng chi</div>
            <div className="text-[22px] text-[#F32B2B]">0</div>
          </div>
        </div>

        <div className="mx-4 h-20 w-[1px] bg-[#E1E3E6]" />

        <div className="flex items-center p-4">
          <div className="mr-4 flex h-[30px] w-[30px] items-center justify-center rounded-full bg-[#FF8800]">
            <Image src={DolorIcon} />
          </div>
          <div>
            <div className="text-xs text-[#15171A]">Tồn quỹ</div>
            <div className="text-[22px] text-[#FF8800]">0</div>
          </div>
        </div>
      </div>

      <div className="mb-3 flex justify-end">
        <CustomButton
          type="success"
          prefixIcon={<Image src={ReceiptIcon} />}
          wrapClassName="mx-2"
          onClick={() => {
            setOpenAddCashbookModal(true)
            setCashbookType('income')
          }}
        >
          Lập phiếu thu
        </CustomButton>
        <CustomButton
          type="success"
          prefixIcon={<Image src={PaymentIcon} />}
          wrapClassName="mx-2"
          onClick={() => {
            setOpenAddCashbookModal(true)
            setCashbookType('expenses')
          }}
        >
          Lập phiếu chi
        </CustomButton>
        <CustomButton
          prefixIcon={<Image src={ExportIcon} />}
          wrapClassName="mx-2"
        >
          Xuất file
        </CustomButton>
      </div>

      <Search />

      <CustomTable
        rowSelection={{
          type: 'checkbox',
        }}
        dataSource={transactions?.data?.items.map((item, index) => ({
          ...item,
          key: index,
        }))
        }
        columns={columns}
        onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              // Toggle expandedRowKeys state here
              if (expandedRowKeys[record.key]) {
                const { [record.key]: value, ...remainingKeys } = expandedRowKeys;
                setExpandedRowKeys(remainingKeys);
              } else {
                setExpandedRowKeys({ ...expandedRowKeys, [record.key]: true });
              }
            }
          };
        }}
        expandable={{
          // eslint-disable-next-line @typescript-eslint/no-shadow
          expandedRowRender: (record: IRecord) => <RowDetail record={record} />,
          expandIcon: () => <></>,
          expandedRowKeys: Object.keys(expandedRowKeys).map((key) => +key),
        }}
      />

      <CustomPagination
        page={formFilter.page}
        pageSize={formFilter.limit}
        setPage={(value) => setFormFilter({ ...formFilter, page: value })}
        setPerPage={(value) => setFormFilter({ ...formFilter, limit: value })}
        total={transactions?.data?.totalItem}
      />

      <AddCashbookModal
        isOpen={openAddCashbookModal}
        onCancel={() => setOpenAddCashbookModal(false)}
        type={cashbookType}
      />
    </div>
  );
}
