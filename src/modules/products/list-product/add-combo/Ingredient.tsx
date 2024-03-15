import type { ColumnsType } from 'antd/es/table';
import Image from 'next/image';

import SearchIcon from '@/assets/searchIcon.svg';
import { CustomInput } from '@/components/CustomInput';
import CustomTable from '@/components/CustomTable';

const Ingredient = () => {
  const record: any = {
    key: 1,
    code: 'HH230704161432',
    name: 'Cao dán gel Salonship',
    quantity: 1,
    unit: 'unit',
    prize: '300,000',
    cost: '250,000',
    total: '100,000',
  };

  const dataSource: any[] = Array(2)
    .fill(0)
    .map((_, index) => ({ ...record, key: index }));

  const columns: ColumnsType<any> = [
    {
      title: 'STT',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: 'Mã vạch',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên thành phần ',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Đơn vị',
      dataIndex: 'unit',
      key: 'unit',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Giá bán',
      dataIndex: 'prize',
      key: 'prize',
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total',
      key: 'total',
    },
  ];

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between">
        <div className="text-base font-semibold">Thành phần</div>
        <CustomInput
          className="w-60 !rounded-full px-4 py-2"
          prefixIcon={<Image src={SearchIcon} alt="" />}
          placeholder="Tìm kiếm sản phẩm"
          onChange={() => {}}
        />
      </div>

      <CustomTable
        columns={columns}
        dataSource={dataSource}
        className="my-8"
        pagination={false}
      />
    </div>
  );
};

export default Ingredient;
