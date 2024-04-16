import type { ColumnsType } from 'antd/es/table';
import { useRouter } from 'next/router';

import { getBranch } from '@/api/branch.service';
import { getSaleReport } from '@/api/report.service';
import CustomTable from '@/components/CustomTable';
import { saleReportLabels } from '@/enums';
import { formatMoney } from '@/helpers';
import { branchState } from '@/recoil/state';
import { useQuery } from '@tanstack/react-query';
import Table from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useRecoilState } from 'recoil';
import Search from './Search';
import RowDetail from './row-detail';

interface IRecord {
  key: number;
  date: string;
  name: string;
  costPrice: number;
  discountPrice: number;
  earnPrice: number;
  totalCostPrice: number;
  grossPrice: number;
}

export function SaleReport() {
  const router = useRouter();
  const [branch] = useRecoilState(branchState);

  const [expandedRowKeys, setExpandedRowKeys] = useState<
    Record<string, boolean>
  >({});

  const [formFilter, setFormFilter] = useState({
    type: 1,
    interest: 1,
    branchId: branch ? branch : undefined,
    from: dayjs().format("YYYY-MM-DD"),
    to: dayjs().format("YYYY-MM-DD"),
  });

  const { data: saleReport, isLoading } = useQuery(
    [
      'SALE_REPORT',
      formFilter.from,
      formFilter.to,
      formFilter.branchId,
    ],
    () => getSaleReport({ from: formFilter.from, to: formFilter.to, branchId: formFilter.branchId })
  );

  console.log("saleReport", saleReport)

  const { data: branches } = useQuery(['SETTING_BRANCH'], () => getBranch());

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Thời gian',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'totalRevenue',
      key: 'totalRevenue',
      render: (value) => formatMoney(+value)
    },
    {
      title: 'Giá trị trả',
      dataIndex: 'saleReturn',
      key: 'saleReturn',
      render: (value) => formatMoney(+value)
    },
    {
      title: 'Doanh thu thuần',
      dataIndex: 'realRevenue',
      key: 'realRevenue',
      render: (value) => formatMoney(+value)
    },
  ];


  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
      </div>

      <div className='grid grid-cols-12 gap-6 '>
        <div className='col-span-3'>
          <Search formFilter={formFilter} setFormFilter={setFormFilter} branches={branches} />
        </div>
        <div className='col-span-9'>
          <div className='p-6 bg-[#88909C]'>
            <div className='bg-white p-3'>
              <div>
                Ngày lập: {dayjs().format('DD/MM/YYYY HH:mm')}
              </div>
              <div className='text-center mb-5 flex flex-col gap-[10px]'>
                <h4 className='text-2xl font-semibold'>Báo cáo lợi nhuận theo {saleReportLabels[formFilter.interest]?.toLowerCase()}</h4>
                <p>Từ ngày {dayjs(formFilter.from).format("DD/MM/YYYY")} đến ngày {dayjs(formFilter.to).format("DD/MM/YYYY")}</p>
                <p>Chi nhánh: {branches?.data?.items?.find((item) => item.id === formFilter.branchId)?.name}</p>
              </div>
              <CustomTable
                dataSource={saleReport?.data?.items.map((item, index) => ({
                  ...item,
                  key: index + 1,
                }))}
                summary={pageData => {
                  let totalValue = 0;

                  pageData.forEach(({ value }) => {
                    totalValue += value;
                  });

                  return (
                    <Table.Summary.Row className='bg-[#e6fff6] font-semibold text-base'>
                      <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
                      <Table.Summary.Cell index={0}>{null}</Table.Summary.Cell>
                      <Table.Summary.Cell index={1}>{formatMoney(saleReport?.data?.summary?.totalRevenue)}</Table.Summary.Cell> {/* Empty cell */}
                      <Table.Summary.Cell index={2}>{formatMoney(saleReport?.data?.summary?.saleReturn)}</Table.Summary.Cell>
                      <Table.Summary.Cell index={3}>{formatMoney(saleReport?.data?.summary?.realRevenue)}</Table.Summary.Cell>
                    </Table.Summary.Row>
                  );
                }}
                columns={columns}
                // expandable={expandableProps}
                expandable={{
                  // eslint-disable-next-line @typescript-eslint/no-shadow
                  expandedRowRender: (record) => {
                    const title = record.title.split('-');
                    const newDate = `${title[2]}-${title[1]}-${title[0]}`
                    return <RowDetail record={record} branchId={branch} from={newDate} to={newDate} />
                  },
                  // expandIcon: () => <></>,
                  expandedRowKeys: Object.keys(expandedRowKeys).map(
                    (key) => Number(key) + 1
                  ),
                }}
                onRow={(record, rowIndex) => {
                  return {
                    onClick: event => {
                      // Toggle expandedRowKeys state here
                      if (expandedRowKeys[record.key - 1]) {
                        const { [record.key - 1]: value, ...remainingKeys } = expandedRowKeys;
                        setExpandedRowKeys(remainingKeys);
                      } else {
                        setExpandedRowKeys({ ...expandedRowKeys, [record.key - 1]: true });
                      }
                    }
                  };
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    // <div className='my-5'>
    //   Đang cập nhật...
    // </div>
  );
}
