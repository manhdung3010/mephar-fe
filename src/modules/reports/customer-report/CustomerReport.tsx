import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';
import { useRouter } from 'next/router';

import ExportIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

import Search from '../sales-report/Search';

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
    <div className='my-5'>
      Đang cập nhật...
    </div>
  );
}
