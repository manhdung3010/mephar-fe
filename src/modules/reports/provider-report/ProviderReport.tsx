import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ExportIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import Search from '../sales-report/Search';

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
    //   </div>

    //   <div className='grid grid-cols-12 gap-6 '>
    //     <div className='col-span-2'>
    //       <Search />
    //     </div>
    //     <div className='col-span-10'>
    //       <div className='p-6 bg-[#88909C]'>

    //         <div className='bg-white p-3'>
    //           <div>
    //             Ngày lập: 30/10/2023
    //           </div>
    //           <div className='text-center mb-5 flex flex-col gap-[10px]'>
    //             <h4 className='text-2xl font-semibold'>Báo cáo lợi nhuận theo thời gian</h4>
    //             <p>Từ ngày 11/12/2023 đến ngày 11/12/2023</p>
    //             <p>Chi nhánh: QT Pharma - Dược Quyết Thắng</p>
    //             <p>Bảng giá: Tất cả</p>
    //           </div>
    //           <CustomTable dataSource={dataSource} columns={columns} />
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
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
