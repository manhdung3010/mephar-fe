import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ExportIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import Search from './Search';

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

  const record = {
    key: 1,
    name: 'Hoàng Văn Lâm',
    date: '2023-10-30 15:49:43',
    costPrice: 20,
    discountPrice: 20,
    earnPrice: 0,
    totalCostPrice: 1000000,
    grossPrice: 0,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Nhân viên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thời gian',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
    {
      title: 'Giảm giá',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'earnPrice',
      key: 'earnPrice',
    },
    {
      title: 'Tổng giá vốn',
      dataIndex: 'totalCostPrice',
      key: 'totalCostPrice',
    },
    {
      title: 'Lợi nhuận',
      dataIndex: 'grossPrice',
      key: 'grossPrice',
    },
  ];
  return (
    <div>
      <div className="my-3 flex justify-end gap-4">
        <CustomButton prefixIcon={<Image src={ExportIcon} />}>
          Xuất file
        </CustomButton>
      </div>

      <Search />

      <CustomTable dataSource={dataSource} columns={columns} />
    </div>
  );
}
