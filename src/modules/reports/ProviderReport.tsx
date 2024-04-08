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
  beginDebt: number;
  totalPrice: number;
  endDebt: number;
}

export function ProviderReport() {
  const router = useRouter();

  const record = {
    key: 1,
    id: 'NC2307271411',
    name: 'Nhà máy dược Minh Tâm',
    beginDebt: 1000000,
    totalPrice: 100000000,
    endDebt: 10000000,
  };

  const dataSource: IRecord[] = Array(8)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã NCC',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên nhà cung cấp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Nợ đầu kỳ',
      dataIndex: 'beginDebt',
      key: 'beginDebt',
    },
    {
      title: 'Tổng thanh toán',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
    },
    {
      title: 'Nợ cuối kỳ',
      dataIndex: 'endDebt',
      key: 'endDebt',
    },
  ];
  return (
    // <div>
    //   <div className="my-3 flex justify-end gap-4">
    //     <CustomButton prefixIcon={<Image src={ExportIcon} />}>
    //       Xuất file
    //     </CustomButton>
    //   </div>

    //   <Search />

    //   <CustomTable dataSource={dataSource} columns={columns} />
    // </div>
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
