import { Input } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import EditIcon from '@/assets/editWhite.svg';
import ExportFileIcon from '@/assets/exportIcon.svg';
import { CustomButton } from '@/components/CustomButton';
import CustomTable from '@/components/CustomTable';

const { TextArea } = Input;

interface IRecord {
  key: number;
  id: string;
  type: string;
  price: number;
  collectPoint: number;
  totalPoint: number;
  createdAt: string;
}

export function CollectPointHistory({ record }: { record: any }) {
  const data = {
    key: 1,
    id: 'THD_202209272_105303',
    type: 'Bán hàng',
    price: 250000,
    collectPoint: 2,
    totalPoint: 2,
    createdAt: '12/10/2023 11:34',
  };

  const dataSource: IRecord[] = Array(1)
    .fill(0)
    .map((_, index) => ({ ...data, key: index }));

  const columns: ColumnsType<IRecord> = [
    {
      title: 'Mã phiếu',
      dataIndex: 'id',
      key: 'id',
      render: (value) => <span className="text-[#0070F4]">{value}</span>,
    },
    {
      title: 'Thời gian',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Giá trị',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Điểm giao dịch',
      dataIndex: 'collectPoint',
      key: 'collectPoint',
    },
    {
      title: 'Điểm sau giao dịch',
      dataIndex: 'totalPoint',
      key: 'totalPoint',
    },
  ];

  return (
    <div className="gap-12 ">
      <CustomTable
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        className="mb-4"
      />

      <div className="flex justify-end gap-4">
        <CustomButton
          type="success"
          prefixIcon={<Image src={EditIcon} alt="" />}
        >
          Cập nhật
        </CustomButton>

        <CustomButton
          type="danger"
          prefixIcon={<Image src={ExportFileIcon} alt="" />}
        >
          Xuất file
        </CustomButton>
      </div>
    </div>
  );
}
