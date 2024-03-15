import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ExportIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import Search from './Search';

interface IRecord {
  key: number;
  id: string;
  name: string;
  lotNumber: number;
  dueDate: string;
  remainDay: number;
  quantity: number;
  costPrice: number;
  warehousePrice: number;
  sellPrice: number;
}

export function ProductReport() {
  const router = useRouter();

  const record = {
    key: 1,
    id: 'TH231017111225',
    name: 'Bạch đái hoàn Xuân quang',
    lotNumber: 100,
    dueDate: '30/12/2023',
    remainDay: 200,
    quantity: 10000,
    costPrice: 100000,
    warehousePrice: 1000000,
    sellPrice: 100000,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã hàng hóa',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên hàng hóa',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lô',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
    },
    {
      title: 'Hạn dùng',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Số ngày còn lại',
      dataIndex: 'remainDay',
      key: 'remainDay',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá vốn',
      dataIndex: 'costPrice',
      key: 'costPrice',
    },
    {
      title: 'Giá trị kho',
      dataIndex: 'warehousePrice',
      key: 'warehousePrice',
    },
    {
      title: 'Giá bán',
      dataIndex: 'sellPrice',
      key: 'sellPrice',
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
