import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ExportIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import Search from './Search';

interface IRecord {
  key: number;
  name: string;
  costPrice: number;
  discountPrice: number;
  earnPrice: number;
  returnPrice: number;
  netPrice: number;
  totalCostPrice: number;
  grossPrice: number;
}

export function CustomerReport() {
  const router = useRouter();

  const record = {
    key: 1,
    name: 'Hoàng Văn Lâm',
    costPrice: 20,
    discountPrice: 20,
    earnPrice: 0,
    returnPrice: 0,
    netPrice: 0,
    totalCostPrice: 0,
    grossPrice: 0,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Khách hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Tổng tiền hàng',
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
    {
      title: 'Giảm giá hóa đơn',
      dataIndex: 'discountPrice',
      key: 'discountPrice',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'earnPrice',
      key: 'earnPrice',
    },
    {
      title: 'Giá trị trả',
      dataIndex: 'returnPrice',
      key: 'returnPrice',
    },
    {
      title: 'Doanh thu thuần',
      dataIndex: 'netPrice',
      key: 'netPrice',
    },
    {
      title: 'Tổng giá vốn',
      dataIndex: 'totalCostPrice',
      key: 'totalCostPrice',
    },
    {
      title: 'Lợi nhuận gộp',
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
